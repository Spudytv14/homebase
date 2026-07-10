const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldRenderTenantRegex = /function renderTenant\(\) \{[\s\S]*?grid\.innerHTML \= filtered\.map\(p \=\> \{/;

const additionToRenderTenant = `
            // Render Viewing Requests
            const reqTable = document.getElementById('tenantViewingRequestsTable');
            const myRequests = viewingRequests.filter(r => r.tenantId === tenant.id);
            if (myRequests.length === 0) {
                reqTable.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding: 20px;">No viewing requests yet. Find a property and request a viewing!</td></tr>';
            } else {
                reqTable.innerHTML = myRequests.map(r => {
                    const prop = properties.find(p => p.id === r.propertyId);
                    const landlord = users.find(u => u.id === prop.landlordId);
                    let statusBadge = '';
                    let actionHtml = '';

                    if (r.status === 'pending') {
                        statusBadge = '<span class="badge badge-warning">Pending Landlord Response</span>';
                        actionHtml = '<span class="text-muted" style="font-size: 0.8rem;">Awaiting response...</span>';
                    } else if (r.status === 'accepted') {
                        statusBadge = '<span class="badge badge-success">Accepted</span>';
                        actionHtml = \`
                            <div style="font-size: 0.8rem; margin-bottom: 6px;">
                                <strong>Meeting Point:</strong> \${prop.meetingPoint}
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="openChatWith(\${landlord.id}, '\${landlord.name.replace(/'/g, "\\\\'")}', \${prop.id})"><i class="fas fa-comments"></i> Open Chat</button>
                        \`;
                    } else if (r.status === 'declined') {
                        statusBadge = '<span class="badge badge-danger">Declined</span>';
                        actionHtml = '<span class="text-muted" style="font-size: 0.8rem;">The landlord declined this time.</span>';
                    } else if (r.status === 'rescheduled') {
                        statusBadge = '<span class="badge badge-info">Reschedule Proposed</span>';
                        actionHtml = \`
                            <div style="font-size: 0.8rem; margin-bottom: 6px; color: var(--primary);">
                                <strong>Proposed:</strong> \${r.proposedDate} at \${r.proposedTime}
                            </div>
                            <div style="display:flex; gap: 8px;">
                                <button class="btn btn-success btn-sm" onclick="respondToReschedule(\${r.id}, 'accept')"><i class="fas fa-check"></i> Accept</button>
                                <button class="btn btn-danger btn-sm" onclick="respondToReschedule(\${r.id}, 'decline')"><i class="fas fa-times"></i> Decline</button>
                            </div>
                        \`;
                    } else if (r.status === 'tenant_accepted_reschedule') {
                        statusBadge = '<span class="badge badge-success">Reschedule Accepted</span>';
                        actionHtml = \`
                            <div style="font-size: 0.8rem; margin-bottom: 6px;">
                                <strong>Meeting Point:</strong> \${prop.meetingPoint}
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="openChatWith(\${landlord.id}, '\${landlord.name.replace(/'/g, "\\\\'")}', \${prop.id})"><i class="fas fa-comments"></i> Open Chat</button>
                        \`;
                    } else if (r.status === 'tenant_declined_reschedule') {
                         statusBadge = '<span class="badge badge-danger">Reschedule Declined</span>';
                         actionHtml = '<span class="text-muted" style="font-size: 0.8rem;">You declined the reschedule.</span>';
                    }

                    return \`
                        <tr>
                            <td><strong>\${prop.title}</strong><br><span class="text-muted" style="font-size: 0.8rem;"><i class="fas fa-map-marker-alt"></i> \${prop.location}</span></td>
                            <td>\${r.date} at \${r.time}<br><span class="text-muted" style="font-size: 0.75rem;">Attendees: \${r.attendees || 1}</span></td>
                            <td>\${statusBadge}</td>
                            <td>\${actionHtml}</td>
                        </tr>
                    \`;
                }).join('');
            }
`;

const newCode = html.match(oldRenderTenantRegex)[0].replace(
    /const grid = document\.getElementById\('tenantPropertyGrid'\);/,
    additionToRenderTenant + "\n            const grid = document.getElementById('tenantPropertyGrid');"
);

html = html.replace(oldRenderTenantRegex, newCode);

const additionalTenantFuncs = `
        function respondToReschedule(requestId, action) {
            const req = viewingRequests.find(r => r.id === requestId);
            if (!req) return;

            const prop = properties.find(p => p.id === req.propertyId);

            if (action === 'accept') {
                req.status = 'tenant_accepted_reschedule';
                req.date = req.proposedDate;
                req.time = req.proposedTime;
                req.chatExpiry = Date.now() + (24 * 60 * 60 * 1000); // Expiry starts 24h from now conceptually (simplified)
                addNotification(req.landlordId, \`Tenant accepted the rescheduled viewing for \${prop.title}.\`);
                alert('You have accepted the rescheduled time. Chat is now open.');
            } else {
                req.status = 'tenant_declined_reschedule';
                addNotification(req.landlordId, \`Tenant declined the rescheduled viewing for \${prop.title}.\`);
                alert('You have declined the rescheduled time.');
            }
            renderTenant();
        }
`;

// Inject before renderTenant
html = html.replace('function renderTenant()', additionalTenantFuncs + '\n        function renderTenant()');

fs.writeFileSync('index.html', html);
console.log('Tenant viewing requests rendering and actions added.');
