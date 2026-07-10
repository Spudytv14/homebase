const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Note: Ensure `addNotification` exists globally
const globalAddNotif = `
        function addNotification(userId, message) {
            notifications.push({
                id: nextNotificationId++,
                userId: userId,
                message: message,
                timestamp: Date.now(),
                read: false
            });
            updateNotificationBell();
        }
`;

html = html.replace('let notifications = [];', globalAddNotif + '\n        let notifications = [];');

// Add Bell to navbars
const tenantNavRightOld = `<div class="right">
                <span class="points-display" id="tenantPointsDisplay"><i class="fas fa-star"></i> <span id="tenantPointsVal">0</span> Points</span>`;

const tenantNavRightNew = `<div class="right">
                <div style="position:relative; cursor:pointer; margin-right:10px;" onclick="openNotificationsModal()">
                    <i class="fas fa-bell" style="font-size:1.2rem; color:var(--text-muted);"></i>
                    <span id="tenantNotifBadge" style="position:absolute; top:-5px; right:-8px; background:var(--danger); color:#fff; font-size:0.65rem; padding:2px 5px; border-radius:10px; display:none;">0</span>
                </div>
                <span class="points-display" id="tenantPointsDisplay"><i class="fas fa-star"></i> <span id="tenantPointsVal">0</span> Points</span>`;

html = html.replace(tenantNavRightOld, tenantNavRightNew);

const landlordNavRightOld = `<div class="right">
                <button class="btn btn-outline btn-sm" onclick="openChatListModal()"><i class="fas fa-envelope"></i> Messages</button>`;

const landlordNavRightNew = `<div class="right">
                <div style="position:relative; cursor:pointer; margin-right:10px;" onclick="openNotificationsModal()">
                    <i class="fas fa-bell" style="font-size:1.2rem; color:var(--text-muted);"></i>
                    <span id="landlordNotifBadge" style="position:absolute; top:-5px; right:-8px; background:var(--danger); color:#fff; font-size:0.65rem; padding:2px 5px; border-radius:10px; display:none;">0</span>
                </div>
                <button class="btn btn-outline btn-sm" onclick="openChatListModal()"><i class="fas fa-envelope"></i> Messages</button>`;

html = html.replace(landlordNavRightOld, landlordNavRightNew);


const notificationsModal = `
    <!-- MODAL: Notifications -->
    <div id="notificationsModal" class="modal-overlay">
        <div class="modal-box" style="max-width: 450px;">
            <button class="close" onclick="closeNotificationsModal()">&times;</button>
            <h2><i class="fas fa-bell"></i> Notifications</h2>
            <div id="notificationsList" style="display:flex; flex-direction:column; gap:10px; margin-top: 15px; max-height: 400px; overflow-y:auto;">
                <!-- Populated via JS -->
            </div>
            <button class="btn btn-ghost btn-block btn-sm" style="margin-top: 10px;" onclick="markAllNotifsRead()"><i class="fas fa-check-double"></i> Mark all as read</button>
        </div>
    </div>
`;

const chatWindowRegex = /\<\!\-\- PEER CHAT WINDOW \-\-\>/;
html = html.replace(chatWindowRegex, notificationsModal + '\n    <!-- PEER CHAT WINDOW -->');

const notifLogic = `
        function updateNotificationBell() {
            const currentUserId = document.getElementById('tenant-dash').classList.contains('active-dash') ? CURRENT_TENANT_ID : CURRENT_LANDLORD_ID;
            if (!currentUserId) return;

            const unreadCount = notifications.filter(n => n.userId === currentUserId && !n.read).length;

            const tenantBadge = document.getElementById('tenantNotifBadge');
            const landlordBadge = document.getElementById('landlordNotifBadge');

            if (tenantBadge) {
                tenantBadge.textContent = unreadCount;
                tenantBadge.style.display = unreadCount > 0 ? 'block' : 'none';
            }
            if (landlordBadge) {
                landlordBadge.textContent = unreadCount;
                landlordBadge.style.display = unreadCount > 0 ? 'block' : 'none';
            }
        }

        function openNotificationsModal() {
            const currentUserId = document.getElementById('tenant-dash').classList.contains('active-dash') ? CURRENT_TENANT_ID : CURRENT_LANDLORD_ID;
            const list = document.getElementById('notificationsList');

            const myNotifs = notifications.filter(n => n.userId === currentUserId).sort((a,b) => b.timestamp - a.timestamp);

            if (myNotifs.length === 0) {
                list.innerHTML = '<div class="text-center text-muted" style="padding: 20px;">No notifications yet.</div>';
            } else {
                list.innerHTML = myNotifs.map(n => \`
                    <div style="background: \${n.read ? 'var(--bg)' : '#eff6ff'}; padding: 12px; border-radius: var(--radius-sm); border-left: 3px solid \${n.read ? 'transparent' : 'var(--primary)'}; font-size: 0.85rem;">
                        \${n.message}
                        <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">\${new Date(n.timestamp).toLocaleTimeString()}</div>
                    </div>
                \`).join('');
            }

            document.getElementById('notificationsModal').classList.add('active');

            // Mark as read after a short delay
            setTimeout(markAllNotifsRead, 2000);
        }

        function closeNotificationsModal() {
            document.getElementById('notificationsModal').classList.remove('active');
        }

        function markAllNotifsRead() {
            const currentUserId = document.getElementById('tenant-dash').classList.contains('active-dash') ? CURRENT_TENANT_ID : CURRENT_LANDLORD_ID;
            notifications.forEach(n => {
                if (n.userId === currentUserId) n.read = true;
            });
            updateNotificationBell();
        }
`;

html = html.replace('function loadDashboard(dashId) {', notifLogic + '\n        function loadDashboard(dashId) {');

// Attach bell updater to dash change
const dashChangeRegex = /if \(dashId === 'landlord-dash'\) renderLandlord\(\);/;
html = html.replace(dashChangeRegex, "if (dashId === 'landlord-dash') renderLandlord();\n            updateNotificationBell();");

fs.writeFileSync('index.html', html);
console.log('Notifications system complete.');
