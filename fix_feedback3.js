const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// I also need to add a setInterval loop to handle the "7-day inactivity", "24 hours before viewing reminder", "Viewing completed", and "auto-archive"

const backgroundJobs = `
        setInterval(() => {
            const now = Date.now();
            let stateChanged = false;

            viewingRequests.forEach(req => {
                if(req.status === 'accepted' || req.status === 'tenant_accepted_reschedule') {
                    const viewingDateTime = new Date(\`\${req.date}T\${req.time}\`).getTime();

                    // 24 hours before reminder
                    if (viewingDateTime - now <= (24 * 60 * 60 * 1000) && viewingDateTime - now > 0 && !req.reminded) {
                        req.reminded = true;
                        addNotification(req.tenantId, \`Reminder: You have a viewing scheduled in 24 hours for property ID \${req.propertyId}.\`);
                        addNotification(req.landlordId, \`Reminder: You have a viewing scheduled in 24 hours for property ID \${req.propertyId}.\`);
                    }

                    // Viewing completed (time passed)
                    if (now >= viewingDateTime && !req.completedNotified) {
                        req.completedNotified = true;
                        addNotification(req.tenantId, \`Your viewing for property ID \${req.propertyId} has completed.\`);
                        addNotification(req.landlordId, \`Viewing for property ID \${req.propertyId} has completed.\`);
                    }
                }

                // 7 days inactivity check
                // Find latest message timestamp for this request's chat
                if(req.chatExpiry && now < req.chatExpiry) {
                    const chatMsgs = chats.filter(c => c.propertyId === req.propertyId && (c.fromId === req.tenantId || c.toId === req.tenantId));
                    const lastActivity = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1].timestamp : req.createdAt;

                    if (now - lastActivity > (7 * 24 * 60 * 60 * 1000)) {
                        req.chatExpiry = now - 1000; // Force archive
                        addNotification(req.tenantId, \`Chat for property ID \${req.propertyId} archived due to inactivity.\`);
                        addNotification(req.landlordId, \`Chat for property ID \${req.propertyId} archived due to inactivity.\`);
                        stateChanged = true;
                    }
                }

                // Normal Expiry check (Archived)
                if (req.chatExpiry && now >= req.chatExpiry && !req.archivedNotified) {
                    req.archivedNotified = true;
                    addNotification(req.tenantId, \`Chat for property ID \${req.propertyId} has been archived.\`);
                    addNotification(req.landlordId, \`Chat for property ID \${req.propertyId} has been archived.\`);
                    stateChanged = true;
                }
            });

            if (stateChanged && activeChatPropertyId) {
                renderPeerChatWindow();
            }
        }, 10000); // Check every 10s for prototype
`;

html = html.replace('updateTenantPointsDisplay();\n        console.log(\'HomeBase ready', backgroundJobs + 'updateTenantPointsDisplay();\n        console.log(\'HomeBase ready');

fs.writeFileSync('index.html', html);
console.log('Background jobs implemented');
