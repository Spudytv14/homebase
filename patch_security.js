const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const oldSendPeerMessage = `        function sendPeerMessage() {
            const input = document.getElementById('peerChatInput');
            const text = input.value.trim();
            if (!text || !activeChatPeerId) return;

            const currentUserId = document.getElementById('tenant-dash').classList.contains('active-dash') ? CURRENT_TENANT_ID : CURRENT_LANDLORD_ID;

            // AI/Smart Message Filter
            const contactRegex = /(\\b07\\d{8}\\b|\\b07\\d\\s\\d{3}\\s\\d{4}\\b|\\+?\\d{1,3}[\\s-]?\\d{3}[\\s-]?\\d{3}[\\s-]?\\d{4}|[\\w\\.-]+@[\\w\\.-]+\\.\\w+|www\\.[^\\s]+|https?:\\/\\/[^\\s]+|facebook\\.com\\/[^\\s]+|instagram\\.com\\/[^\\s]+|t\\.me\\/[^\\s]+|\\@\\w+)/gi;

            let isBlocked = false;
            if (contactRegex.test(text)) {
                isBlocked = true;
            }

            chats.push({
                fromId: currentUserId,
                toId: activeChatPeerId,
                text: text,
                timestamp: Date.now(),
                blocked: isBlocked
            });

            if (isBlocked) {
                 chats.push({
                    fromId: 'system',
                    toId: currentUserId,
                    peerId: activeChatPeerId, // Add peerId to associate warning with specific chat
                    text: '⚠️ For your security, personal contact details cannot be shared until the rental process is complete.',
                    timestamp: Date.now() + 1,
                    isSystemWarning: true
                });
            }

            input.value = '';
            renderPeerChatWindow();
        }`;

const newSendPeerMessage = `        function sendPeerMessage() {
            const input = document.getElementById('peerChatInput');
            const text = input.value.trim();
            if (!text || !activeChatPeerId) return;

            const currentUserId = document.getElementById('tenant-dash').classList.contains('active-dash') ? CURRENT_TENANT_ID : CURRENT_LANDLORD_ID;

            // AI/Smart Message Filter - Robust
            const contactRegex = /(\\b0\\d{9}\\b|\\b\\+?\\d{1,4}[\\s-]?\\d{3,4}[\\s-]?\\d{3,4}\\b|[\\w\\.-]+@[\\w\\.-]+\\.\\w+|www\\.[^\\s]+|https?:\\/\\/[^\\s]+|facebook\\.com\\/[^\\s]+|instagram\\.com\\/[^\\s]+|t\\.me\\/[^\\s]+|wa\\.me\\/[^\\s]+|wa\\.link\\/[^\\s]+|whatsapp|\\@\\w+)/gi;

            let isBlocked = false;
            if (contactRegex.test(text)) {
                isBlocked = true;
            }

            chats.push({
                fromId: currentUserId,
                toId: activeChatPeerId,
                text: text,
                timestamp: Date.now(),
                blocked: isBlocked,
                propertyId: activeChatPropertyId // Associated with the viewing request property
            });

            if (isBlocked) {
                 chats.push({
                    fromId: 'system',
                    toId: currentUserId,
                    peerId: activeChatPeerId,
                    text: '⚠️ For your safety and security, sharing personal contact information outside HomeBase is not permitted before the rental process is completed.',
                    timestamp: Date.now() + 1,
                    isSystemWarning: true,
                    propertyId: activeChatPropertyId
                });
            }

            input.value = '';
            renderPeerChatWindow();
        }

        function extendChatExpiry(requestId) {
            const req = viewingRequests.find(r => r.id === requestId);
            if (req) {
                req.chatExpiry = req.chatExpiry + (48 * 60 * 60 * 1000); // add 48 hours
                alert('Chat extended by 48 hours.');
                renderPeerChatWindow();
            }
        }`;

html = html.replace(oldSendPeerMessage, newSendPeerMessage);
fs.writeFileSync('index.html', html);
console.log('Security updated.');
