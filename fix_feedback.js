const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix 1: Show chat button for pending requests for Tenant
const oldTenantPending = `                    if (r.status === 'pending') {
                        statusBadge = '<span class="badge badge-warning">Pending Landlord Response</span>';
                        actionHtml = '<span class="text-muted" style="font-size: 0.8rem;">Awaiting response...</span>';
                    } else if (r.status === 'accepted') {`;

const newTenantPending = `                    if (r.status === 'pending') {
                        statusBadge = '<span class="badge badge-warning">Pending Landlord Response</span>';
                        actionHtml = \`
                            <div style="font-size: 0.8rem; margin-bottom: 6px;">
                                Awaiting response...
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="openChatWith(\${landlord.id}, '\${landlord.name.replace(/'/g, "\\\\'")}', \${prop.id})"><i class="fas fa-comments"></i> Open Chat</button>
                        \`;
                    } else if (r.status === 'accepted') {`;

html = html.replace(oldTenantPending, newTenantPending);

// Fix 2: Show chat button for pending requests for Landlord
const oldLandlordPending = `                    if (r.status === 'pending') {
                        statusHtml = '<span class="badge badge-warning">Needs Attention</span>';
                        actionHtml = \`
                            <div style="display:flex; gap: 4px; flex-wrap: wrap;">
                                <button class="btn btn-success btn-sm" onclick="landlordAction(\${r.id}, 'accept')"><i class="fas fa-check"></i> Accept</button>
                                <button class="btn btn-outline btn-sm" onclick="openRescheduleModal(\${r.id})"><i class="fas fa-clock"></i> Suggest Reschedule</button>
                                <button class="btn btn-danger btn-sm" onclick="landlordAction(\${r.id}, 'decline')"><i class="fas fa-times"></i></button>
                            </div>
                        \`;
                    } else if (r.status === 'accepted' || r.status === 'tenant_accepted_reschedule') {`;

const newLandlordPending = `                    if (r.status === 'pending') {
                        statusHtml = '<span class="badge badge-warning">Needs Attention</span>';
                        actionHtml = \`
                            <div style="display:flex; gap: 4px; flex-wrap: wrap;">
                                <button class="btn btn-success btn-sm" onclick="landlordAction(\${r.id}, 'accept')"><i class="fas fa-check"></i> Accept</button>
                                <button class="btn btn-outline btn-sm" onclick="openRescheduleModal(\${r.id})"><i class="fas fa-clock"></i> Suggest Reschedule</button>
                                <button class="btn btn-danger btn-sm" onclick="landlordAction(\${r.id}, 'decline')"><i class="fas fa-times"></i></button>
                                <button class="btn btn-primary btn-sm" onclick="openChatWith(\${tenantUser.id}, '\${tenantUser.name.replace(/'/g, "\\\\'")}', \${prop.id})"><i class="fas fa-comments"></i> Chat</button>
                            </div>
                        \`;
                    } else if (r.status === 'accepted' || r.status === 'tenant_accepted_reschedule') {`;

html = html.replace(oldLandlordPending, newLandlordPending);

// Fix 3: Fix chat logic for isArchived based on Expiry Date
const oldIsArchived = `const isArchived = req ? Date.now() > req.chatExpiry : true;`;
const newIsArchived = `const isArchived = req ? (req.chatExpiry !== 0 && Date.now() > req.chatExpiry) : true;`;
html = html.replace(oldIsArchived, newIsArchived);

// Fix 4: Set chatExpiry to 24 hours AFTER the scheduled viewing
const oldLandlordAction = `            if (action === 'accept') {
                req.status = 'accepted';
                req.chatExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours conceptually
                addNotification(req.tenantId, \`Your viewing request for \${prop.title} has been ACCEPTED. Meeting point: \${prop.meetingPoint}\`);`;

const newLandlordAction = `            if (action === 'accept') {
                req.status = 'accepted';
                const viewingDateTime = new Date(\`\${req.date}T\${req.time}\`).getTime();
                req.chatExpiry = viewingDateTime + (24 * 60 * 60 * 1000); // 24 hours after viewing
                addNotification(req.tenantId, \`Your viewing request for \${prop.title} has been ACCEPTED. Meeting point: \${prop.meetingPoint}\`);`;

html = html.replace(oldLandlordAction, newLandlordAction);

const oldTenantRescheduleAction = `            if (action === 'accept') {
                req.status = 'tenant_accepted_reschedule';
                req.date = req.proposedDate;
                req.time = req.proposedTime;
                req.chatExpiry = Date.now() + (24 * 60 * 60 * 1000); // Expiry starts 24h from now conceptually (simplified)
                addNotification(req.landlordId, \`Tenant accepted the rescheduled viewing for \${prop.title}.\`);`;

const newTenantRescheduleAction = `            if (action === 'accept') {
                req.status = 'tenant_accepted_reschedule';
                req.date = req.proposedDate;
                req.time = req.proposedTime;
                const viewingDateTime = new Date(\`\${req.date}T\${req.time}\`).getTime();
                req.chatExpiry = viewingDateTime + (24 * 60 * 60 * 1000); // 24h after rescheduled viewing
                addNotification(req.landlordId, \`Tenant accepted the rescheduled viewing for \${prop.title}.\`);`;

html = html.replace(oldTenantRescheduleAction, newTenantRescheduleAction);

// Fix 5: Rewrite openChatListModal for landlord dashboard messages
const oldChatListModal = /function openChatListModal\(\) \{[\s\S]*?document\.getElementById\('chatListModal'\)\.classList\.add\('active'\);\n        \}/;

const newChatListModal = `function openChatListModal() {
            const listContainer = document.getElementById('chatListContainer');
            listContainer.innerHTML = '';

            const myIncomingRequests = viewingRequests.filter(r => r.landlordId === CURRENT_LANDLORD_ID);

            if (myIncomingRequests.length === 0) {
                listContainer.innerHTML = '<div class="text-muted text-center" style="padding: 20px;">No conversations yet.</div>';
            } else {
                myIncomingRequests.forEach(req => {
                    const user = users.find(u => u.id === req.tenantId);
                    const prop = properties.find(p => p.id === req.propertyId);
                    if (user && prop) {
                        listContainer.innerHTML += \`
                            <div class="lprop-item" style="cursor: pointer;" onclick="openChatWith(\${user.id}, '\${user.name.replace(/'/g, "\\\\'")}', \${prop.id})">
                                <div class="info">
                                    <strong><i class="fas fa-user-circle"></i> \${user.name}</strong>
                                    <div class="sub">\${prop.title}</div>
                                </div>
                                <div class="actions">
                                    <button class="btn btn-outline btn-sm"><i class="fas fa-comment"></i> Open</button>
                                </div>
                            </div>
                        \`;
                    }
                });
            }

            document.getElementById('chatListModal').classList.add('active');
        }`;

html = html.replace(oldChatListModal, newChatListModal);

fs.writeFileSync('index.html', html);
console.log('Feedback incorporated');
