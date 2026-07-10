const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldFormFields = `<div class="field"><label>Full Address *</label><input type="text" id="propAddress" placeholder="e.g. 42 Samora Machel Ave, Eastlea" required /></div>`;
const newFormFields = `<div class="field"><label>Full Address *</label><input type="text" id="propAddress" placeholder="e.g. 42 Samora Machel Ave, Eastlea" required /></div>
                <div class="field"><label>Meeting Point</label><input type="text" id="propMeetingPoint" placeholder="e.g. Main Gate, Security Office, GPS Pin (Optional)" /></div>`;

html = html.replace(oldFormFields, newFormFields);

const oldHandleAdd = `        function handleAddProperty(e) {
            e.preventDefault();
            const title = document.getElementById('propTitle').value.trim();
            const location = document.getElementById('propLocation').value.trim();
            const address = document.getElementById('propAddress').value.trim();
            const price = parseFloat(document.getElementById('propPrice').value);
            const rooms = parseInt(document.getElementById('propRooms').value);
            const density = document.getElementById('propDensity').value;
            const propType = document.getElementById('propType').value;
            const furnished = document.getElementById('propFurnished').value;
            const parking = document.getElementById('propParking').value.trim();
            const security = document.getElementById('propSecurity').value.trim();
            const utilities = document.getElementById('propUtilities').value.trim();
            const status = document.getElementById('propStatus').value;
            const desc = document.getElementById('propDesc').value.trim();`;

const newHandleAdd = `        function handleAddProperty(e) {
            e.preventDefault();
            const title = document.getElementById('propTitle').value.trim();
            const location = document.getElementById('propLocation').value.trim();
            const address = document.getElementById('propAddress').value.trim();
            const meetingPoint = document.getElementById('propMeetingPoint').value.trim() || address; // default to address
            const price = parseFloat(document.getElementById('propPrice').value);
            const rooms = parseInt(document.getElementById('propRooms').value);
            const density = document.getElementById('propDensity').value;
            const propType = document.getElementById('propType').value;
            const furnished = document.getElementById('propFurnished').value;
            const parking = document.getElementById('propParking').value.trim();
            const security = document.getElementById('propSecurity').value.trim();
            const utilities = document.getElementById('propUtilities').value.trim();
            const status = document.getElementById('propStatus').value;
            const desc = document.getElementById('propDesc').value.trim();`;

html = html.replace(oldHandleAdd, newHandleAdd);

const oldNewPropObj = `const newProp = { id: nextPropId++, landlordId: CURRENT_LANDLORD_ID, title, location, address, price, rooms,
                density, propType, furnished, parking, security, utilities, status, desc: desc ||
                    'New listing — full details provided.', imgIdx: Math.floor(Math.random() * PROPERTY_IMAGES.length) };`;

const newNewPropObj = `const newProp = { id: nextPropId++, landlordId: CURRENT_LANDLORD_ID, title, location, address, meetingPoint, price, rooms,
                density, propType, furnished, parking, security, utilities, status, desc: desc ||
                    'New listing — full details provided.', imgIdx: Math.floor(Math.random() * PROPERTY_IMAGES.length) };`;

html = html.replace(oldNewPropObj, newNewPropObj);
fs.writeFileSync('index.html', html);
console.log('Property form updated.');
