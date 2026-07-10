const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// I need to see what pendingViewingRequest is initialized as
// Ah, looking closely at how the buttons work:
// The click was using .first.click() on the button, which triggered openViewingRequestModal
// Then we fill the form and click "Continue to Payment" which sets pendingViewingRequest
// And then we use evaluate processViewingPayment("points"). But it says Cannot read properties of null (reading 'date') on pendingViewingRequest.date
// This means pendingViewingRequest is null.

console.log(html.match(/function handleViewingRequestSubmit[\s\S]*?openPayment/)[0]);
