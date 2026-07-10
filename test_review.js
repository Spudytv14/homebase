// Verify existing unlocking behavior
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('viewingRequests')) {
    console.log('Test Pass: viewingRequests is defined');
} else {
    throw new Error('Test Fail: viewingRequests not found');
}

if (!html.includes('setInterval(() => {')) {
    console.log('Test Pass: 120s loop is gone');
} else {
    throw new Error('Test Fail: 120s loop still present');
}
