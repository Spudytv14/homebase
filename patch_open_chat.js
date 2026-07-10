const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldOpenChat = `        function openChatWith(peerId, peerName) {
            activeChatPeerId = peerId;
            activeChatPeerName = peerName;
            document.getElementById('peerChatHeader').innerHTML = '<i class="fas fa-user"></i> Chat with ' + peerName;`;

const newOpenChat = `        function openChatWith(peerId, peerName, propertyId) {
            activeChatPeerId = peerId;
            activeChatPeerName = peerName;
            activeChatPropertyId = propertyId;
            document.getElementById('peerChatHeader').innerHTML = '<i class="fas fa-user"></i> Chat with ' + peerName;`;

html = html.replace(oldOpenChat, newOpenChat);
fs.writeFileSync('index.html', html);
