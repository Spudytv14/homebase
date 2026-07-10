const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /const list \= document\.getElementById\('landlordPropertyList'\);/;

const landlordRequestsRender = `
            const reqTable = document.getElementById('landlordViewingRequestsTable');
            const myIncomingRequests = viewingRequests.filter(r => r.landlordId === CURRENT_LANDLORD_ID);

            if (myIncomingRequests.length === 0) {
                reqTable.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding: 20px;">No viewing requests at this time.</td></tr>';
            } else {
                reqTable.innerHTML = myIncomingRequests.map(r => {
                    const prop = properties.find(p => p.id === r.propertyId);
                    const tenantUser = users.find(u => u.id === r.tenantId);
                    let actionHtml = '';
                    let statusHtml = '';

                    if (r.status === 'pending') {
                        statusHtml = '<span class="badge badge-warning">Needs Attention</span>';
                        actionHtml = \`
                            <div style="display:flex; gap: 4px; flex-wrap: wrap;">
                                <button class="btn btn-success btn-sm" onclick="landlordAction(\${r.id}, 'accept')"><i class="fas fa-check"></i> Accept</button>
                                <button class="btn btn-outline btn-sm" onclick="openRescheduleModal(\${r.id})"><i class="fas fa-clock"></i> Suggest Reschedule</button>
                                <button class="btn btn-danger btn-sm" onclick="landlordAction(\${r.id}, 'decline')"><i class="fas fa-times"></i></button>
                            </div>
                        \`;
                    } else if (r.status === 'accepted' || r.status === 'tenant_accepted_reschedule') {
                        statusHtml = '<span class="badge badge-success">Accepted</span>';
                        actionHtml = \`<button class="btn btn-primary btn-sm" onclick="openChatWith(\${tenantUser.id}, '\${tenantUser.name.replace(/'/g, "\\\\'")}', \${prop.id})"><i class="fas fa-comments"></i> Chat</button>\`;
                    } else if (r.status === 'declined') {
                        statusHtml = '<span class="badge badge-danger">Declined</span>';
                    } else if (r.status === 'rescheduled') {
                        statusHtml = '<span class="badge badge-info">Awaiting Tenant</span>';
                    } else if (r.status === 'tenant_declined_reschedule') {
                        statusHtml = '<span class="badge badge-danger">Tenant Declined Reschedule</span>';
                    }

                    return \`
                        <tr>
                            <td><strong>\${prop.title}</strong></td>
                            <td>\${tenantUser.name}</td>
                            <td>\${r.date} at \${r.time}<br><small class="text-muted">\${r.attendees ? r.attendees + ' attendees' : ''}</small></td>
                            <td style="max-width: 150px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="\${r.note || ''}">\${r.note || '-'}</td>
                            <td>\${statusHtml}</td>
                            <td>\${actionHtml}</td>
                        </tr>
                    \`;
                }).join('');
            }
`;

html = html.replace(regex, landlordRequestsRender + "\n            const list = document.getElementById('landlordPropertyList');");

const additionalFunctions = `
        function landlordAction(requestId, action) {
            const req = viewingRequests.find(r => r.id === requestId);
            if (!req) return;
            const prop = properties.find(p => p.id === req.propertyId);

            if (action === 'accept') {
                req.status = 'accepted';
                req.chatExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours conceptually
                addNotification(req.tenantId, \`Your viewing request for \${prop.title} has been ACCEPTED. Meeting point: \${prop.meetingPoint}\`);
                alert('Viewing request accepted. The tenant has been notified and chat is open.');
            } else if (action === 'decline') {
                req.status = 'declined';
                addNotification(req.tenantId, \`Your viewing request for \${prop.title} was declined by the landlord.\`);
                alert('Viewing request declined.');
            }
            renderLandlord();
        }

        function openRescheduleModal(requestId) {
            document.getElementById('rescheduleRequestId').value = requestId;
            document.getElementById('rescheduleForm').reset();
            document.getElementById('rescheduleModal').classList.add('active');
        }

        function closeRescheduleModal() {
            document.getElementById('rescheduleModal').classList.remove('active');
        }

        function handleRescheduleSubmit(e) {
            e.preventDefault();
            const requestId = parseInt(document.getElementById('rescheduleRequestId').value);
            const req = viewingRequests.find(r => r.id === requestId);
            if (!req) return;

            const newDate = document.getElementById('rescheduleDate').value;
            const newTime = document.getElementById('rescheduleTime').value;
            const prop = properties.find(p => p.id === req.propertyId);

            req.status = 'rescheduled';
            req.proposedDate = newDate;
            req.proposedTime = newTime;

            addNotification(req.tenantId, \`The landlord proposed a new time for \${prop.title}: \${newDate} at \${newTime}.\`);
            alert('Reschedule proposal sent to tenant.');
            closeRescheduleModal();
            renderLandlord();
        }
`;

html = html.replace('function renderLandlord()', additionalFunctions + '\n        function renderLandlord()');

fs.writeFileSync('index.html', html);
console.log('Landlord rendering updated.');
