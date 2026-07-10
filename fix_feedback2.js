const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix 1: State Bug on Extend Button
// The extendBtn is created once. If we switch chats, we need to update the onclick.
const oldRenderPeerChat = `                if (isLandlord && req) {
                    // Check if extend button already exists
                    if (!document.getElementById('extendChatBtn')) {
                        const extendBtn = document.createElement('button');
                        extendBtn.id = 'extendChatBtn';
                        extendBtn.className = 'btn btn-outline btn-sm';
                        extendBtn.style.margin = '4px 8px';
                        extendBtn.style.padding = '4px 8px';
                        extendBtn.innerHTML = '<i class="fas fa-clock"></i> Extend';
                        extendBtn.onclick = () => extendChatExpiry(req.id);
                        inputArea.parentNode.insertBefore(extendBtn, inputArea);
                    }
                }`;

const newRenderPeerChat = `                if (isLandlord && req) {
                    // Check if extend button already exists, update or create
                    let extendBtn = document.getElementById('extendChatBtn');
                    if (!extendBtn) {
                        extendBtn = document.createElement('button');
                        extendBtn.id = 'extendChatBtn';
                        extendBtn.className = 'btn btn-outline btn-sm';
                        extendBtn.style.margin = '4px 8px';
                        extendBtn.style.padding = '4px 8px';
                        extendBtn.innerHTML = '<i class="fas fa-clock"></i> Extend';
                        inputArea.parentNode.insertBefore(extendBtn, inputArea);
                    }
                    extendBtn.onclick = () => extendChatExpiry(req.id);
                    extendBtn.style.display = 'block';
                } else {
                    const extendBtn = document.getElementById('extendChatBtn');
                    if(extendBtn) extendBtn.style.display = 'none';
                }`;

html = html.replace(oldRenderPeerChat, newRenderPeerChat);


// Fix 2: Multiple Requests Bug - find should look for latest or active instead of first
// Replaced `.find(r => r.propertyId === p.id && r.tenantId === CURRENT_TENANT_ID);` with filtering and sorting or getting the latest

// Replace in Render Tenant (button logic)
const oldTenantReqFind = /const req = viewingRequests\.find\(r \=\> r\.propertyId === p\.id && r\.tenantId === CURRENT_TENANT_ID\);/;
const newTenantReqFind = `const reqs = viewingRequests.filter(r => r.propertyId === p.id && r.tenantId === CURRENT_TENANT_ID);
                                const req = reqs.length > 0 ? reqs[reqs.length - 1] : null;`;
html = html.replace(oldTenantReqFind, newTenantReqFind);

// Replace in Render Chat
const oldChatReqFind = /const req = viewingRequests\.find\(r \=\> r\.propertyId === activeChatPropertyId && \(r\.tenantId === activeChatPeerId \|\| r\.tenantId === currentUserId\)\);/;
const newChatReqFind = `const reqs = viewingRequests.filter(r => r.propertyId === activeChatPropertyId && (r.tenantId === activeChatPeerId || r.tenantId === currentUserId));
            const req = reqs.length > 0 ? reqs[reqs.length - 1] : null;`;
html = html.replace(oldChatReqFind, newChatReqFind);


fs.writeFileSync('index.html', html);
console.log('Fixes implemented');
