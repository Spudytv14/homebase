const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The bug is that closeViewingRequestModal resets pendingViewingRequest = null,
// and handleViewingRequestSubmit calls closeViewingRequestModal() just before openPayment()!
// So it resets it before processViewingPayment can use it!

const oldClose = `        function closeViewingRequestModal() {
            document.getElementById('viewingRequestModal').classList.remove('active');
            pendingViewingRequest = null;
        }`;

const newClose = `        function closeViewingRequestModal() {
            document.getElementById('viewingRequestModal').classList.remove('active');
            // pendingViewingRequest is kept until payment completes or is canceled
        }`;

html = html.replace(oldClose, newClose);

const oldClosePayment = `        function closePaymentModal() {
            document.getElementById('paymentModal').classList.remove('active');
        }`;

const newClosePayment = `        function closePaymentModal() {
            document.getElementById('paymentModal').classList.remove('active');
            pendingViewingRequest = null;
        }`;

html = html.replace(oldClosePayment, newClosePayment);

fs.writeFileSync('index.html', html);
console.log('Fixed pendingViewingRequest bug');
