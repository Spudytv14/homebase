const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Also need to add activeChatPropertyId to the globals
const oldGlobals = `        let chats = [];
        let activeChatPeerId = null;
        let activeChatPeerName = null;`;

const newGlobals = `        let chats = [];
        let activeChatPeerId = null;
        let activeChatPeerName = null;
        let activeChatPropertyId = null;`;

html = html.replace(oldGlobals, newGlobals);

// Update renderPeerChatWindow to show extend button if landlord and chat is active, or show archived message
const oldRenderChat = `        function renderPeerChatWindow() {
            if (!activeChatPeerId) return;
            const currentUserId = document.getElementById('tenant-dash').classList.contains('active-dash') ? CURRENT_TENANT_ID : CURRENT_LANDLORD_ID;

            const conversation = chats.filter(c =>
                (c.fromId === currentUserId && c.toId === activeChatPeerId) ||
                (c.fromId === activeChatPeerId && c.toId === currentUserId) ||
                (c.fromId === 'system' && c.toId === currentUserId && c.peerId === activeChatPeerId) // Show system warnings to the current user for this specific chat
            );`;

const newRenderChat = `        function renderPeerChatWindow() {
            if (!activeChatPeerId) return;
            const currentUserId = document.getElementById('tenant-dash').classList.contains('active-dash') ? CURRENT_TENANT_ID : CURRENT_LANDLORD_ID;
            const isLandlord = document.getElementById('landlord-dash').classList.contains('active-dash');

            const req = viewingRequests.find(r => r.propertyId === activeChatPropertyId && (r.tenantId === activeChatPeerId || r.tenantId === currentUserId));
            const isArchived = req ? Date.now() > req.chatExpiry : true;

            const conversation = chats.filter(c =>
                c.propertyId === activeChatPropertyId &&
                ((c.fromId === currentUserId && c.toId === activeChatPeerId) ||
                (c.fromId === activeChatPeerId && c.toId === currentUserId) ||
                (c.fromId === 'system' && c.toId === currentUserId && c.peerId === activeChatPeerId))
            );

            const chatHeader = document.getElementById('peerChatHeader');
            chatHeader.innerHTML = '<i class="fas fa-user"></i> Chat with ' + activeChatPeerName + (isArchived ? ' (Archived)' : '');

            const inputArea = document.querySelector('#peerChatWindow .ai-chat-input');
            if (isArchived) {
                inputArea.style.display = 'none';
            } else {
                inputArea.style.display = 'flex';
                if (isLandlord && req) {
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
                }
            }`;

html = html.replace(oldRenderChat, newRenderChat);
fs.writeFileSync('index.html', html);
console.log('Chat logic updated.');
