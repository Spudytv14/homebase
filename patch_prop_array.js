const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Apply meetingPoint to existing properties dynamically
const regex = /address: '([^']+)'/g;
html = html.replace(regex, "address: '$1', meetingPoint: '$1'");

fs.writeFileSync('index.html', html);
console.log('Existing properties updated with meetingPoint.');
