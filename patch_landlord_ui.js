const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldLandlordGrid = `<div class="panel"><div id="landlordPropertyList" class="landlord-props"></div></div>`;

const newLandlordGrid = `
            <div id="landlordViewingRequestsPanel" class="panel">
                <div class="panel-header">
                    <h2><i class="fas fa-calendar-check"></i> Viewing Requests</h2>
                </div>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Tenant</th>
                                <th>Requested Date/Time</th>
                                <th>Note</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="landlordViewingRequestsTable">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="panel"><div id="landlordPropertyList" class="landlord-props"></div></div>`;

html = html.replace(oldLandlordGrid, newLandlordGrid);


const rescheduleModal = `
    <!-- MODAL: Suggest Reschedule -->
    <div id="rescheduleModal" class="modal-overlay">
        <div class="modal-box" style="max-width: 400px;">
            <button class="close" onclick="closeRescheduleModal()">&times;</button>
            <h2><i class="fas fa-calendar-plus"></i> Suggest Reschedule</h2>
            <form id="rescheduleForm" onsubmit="handleRescheduleSubmit(event)">
                <input type="hidden" id="rescheduleRequestId" />
                <div class="field"><label>New Date *</label><input type="date" id="rescheduleDate" required /></div>
                <div class="field"><label>New Time *</label><input type="time" id="rescheduleTime" required /></div>
                <div class="form-actions" style="margin-top: 15px;">
                    <button type="button" class="btn btn-outline" onclick="closeRescheduleModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Send Proposal</button>
                </div>
            </form>
        </div>
    </div>
`;

// Insert the modal before the chat window
const chatWindowRegex = /\<\!\-\- PEER CHAT WINDOW \-\-\>/;
html = html.replace(chatWindowRegex, rescheduleModal + '\n    <!-- PEER CHAT WINDOW -->');

fs.writeFileSync('index.html', html);
console.log('Landlord dashboard UI updated.');
