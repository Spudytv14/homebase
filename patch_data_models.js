const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Update Tinashe's points to 2
html = html.replace(
    /name: 'Tinashe Moyo', contact: 'tinashe@email.com', phone: '0771234567', role: 'tenant', status: 'active',\s*nationalId: '63-1234567-A12', password: "spudy14", points: 4/,
    `name: 'Tinashe Moyo', contact: 'tinashe@email.com', phone: '0771234567', role: 'tenant', status: 'active',\n                nationalId: '63-1234567-A12', password: "spudy14", points: 2`
);

// Insert viewingRequests and notifications stores
const newStores = `
        let viewingRequests = [];
        let nextViewingRequestId = 1;

        let notifications = [];
        let nextNotificationId = 1;
`;

html = html.replace(/let nextPropId = 16;/, newStores + '\n        let nextPropId = 16;');

fs.writeFileSync('index.html', html);
console.log('Data models updated.');
