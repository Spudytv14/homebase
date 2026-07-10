const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newFunctions = `
        let pendingViewingRequest = null;

        function openViewingRequestModal(propertyId, propertyTitle) {
            paymentTargetPropertyId = propertyId;
            document.getElementById('viewingPropertyName').textContent = propertyTitle;
            document.getElementById('viewingRequestForm').reset();
            document.getElementById('viewingRequestModal').classList.add('active');
        }

        function closeViewingRequestModal() {
            document.getElementById('viewingRequestModal').classList.remove('active');
            pendingViewingRequest = null;
        }

        function handleViewingRequestSubmit(e) {
            e.preventDefault();
            const date = document.getElementById('viewDate').value;
            const time = document.getElementById('viewTime').value;
            const attendees = document.getElementById('viewAttendees').value;
            const note = document.getElementById('viewNote').value;

            pendingViewingRequest = {
                date,
                time,
                attendees,
                note
            };

            closeViewingRequestModal();
            openPayment(paymentTargetPropertyId, document.getElementById('viewingPropertyName').textContent);
        }

        function openPayment(propertyId, propertyTitle) {
            paymentTargetPropertyId = propertyId;
            document.getElementById('paymentPropertyName').textContent = propertyTitle;
            updateTenantPointsDisplay();
            document.getElementById('paymentModal').classList.add('active');
            document.getElementById('ecoPhone').value = '';
            document.getElementById('paypalEmail').value = '';
            document.getElementById('inbucksAccount').value = '';
            document.getElementById('onePhone').value = '';
            document.getElementById('smilePhone').value = '';
            selectPayment('ecocash');
        }

        function closePaymentModal() {
            document.getElementById('paymentModal').classList.remove('active');
        }

        function selectPayment(method) {
            selectedPayment = method;
            document.querySelectorAll('.pm-option').forEach(el => el.classList.remove('active'));
            const target = document.querySelector(\`.pm-option[data-method="\${method}"]\`);
            if (target) target.classList.add('active');
            document.getElementById('paymentEcoCashFields').style.display = method === 'ecocash' ? 'block' : 'none';
            document.getElementById('paymentPaypalFields').style.display = method === 'paypal' ? 'block' : 'none';
            document.getElementById('paymentInbucksFields').style.display = method === 'inbucks' ? 'block' : 'none';
            document.getElementById('paymentOneMoneyFields').style.display = method === 'onemoney' ? 'block' : 'none';
            document.getElementById('paymentSmileCashFields').style.display = method === 'smilecash' ? 'block' : 'none';
        }

        function processViewingPayment(type) {
            const tenant = getCurrentTenant();
            const prop = properties.find(p => p.id === paymentTargetPropertyId);
            const landlord = users.find(u => u.id === prop.landlordId);

            if (type === 'points') {
                if (!tenant || tenant.points < 10) return alert('You need at least 10 points.');
                tenant.points -= 10;
                transactions.push({ id: 'TXN' + String(transactions.length + 1).padStart(3, '0'), tenant: tenant.name,
                    landlord: landlord ? landlord.name : 'Landlord', property: prop.title, amount: 0,
                    ref: 'PTS-' + Math.random().toString(36).substring(2, 6).toUpperCase(), status: 'Success (Points)' });
            } else {
                let identifier = '';
                let methodName = '';
                if (selectedPayment === 'ecocash') { identifier = document.getElementById('ecoPhone').value.trim(); methodName = 'EcoCash'; if (!identifier) return alert('Please enter your EcoCash number.'); }
                else if (selectedPayment === 'onemoney') { identifier = document.getElementById('onePhone').value.trim(); methodName = 'OneMoney'; if (!identifier) return alert('Please enter your OneMoney number.'); }
                else if (selectedPayment === 'smilecash') { identifier = document.getElementById('smilePhone').value.trim(); methodName = 'SmileCash'; if (!identifier) return alert('Please enter your SmileCash number.'); }
                else if (selectedPayment === 'paypal') { identifier = document.getElementById('paypalEmail').value.trim(); methodName = 'PayPal'; if (!identifier) return alert('Please enter your PayPal email.'); }
                else if (selectedPayment === 'inbucks') { identifier = document.getElementById('inbucksAccount').value.trim(); methodName = 'InBucks'; if (!identifier) return alert('Please enter your InBucks account.'); }

                transactions.push({ id: 'TXN' + String(transactions.length + 1).padStart(3, '0'), tenant: tenant ? tenant.name : 'Tenant', landlord: landlord ? landlord.name : 'Landlord', property: prop.title, amount: 2,
                    ref: methodName.substring(0, 2).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase(), status: 'Success' });
            }

            // Create Viewing Request
            const newRequest = {
                id: nextViewingRequestId++,
                propertyId: prop.id,
                tenantId: tenant.id,
                landlordId: landlord.id,
                date: pendingViewingRequest.date,
                time: pendingViewingRequest.time,
                attendees: pendingViewingRequest.attendees,
                note: pendingViewingRequest.note,
                status: 'pending', // pending, accepted, declined, rescheduled
                createdAt: Date.now(),
                chatExpiry: 0 // Will be set when accepted
            };
            viewingRequests.push(newRequest);

            // Notification
            addNotification(landlord.id, \`New viewing request for \${prop.title} from \${tenant.name}.\`);
            addNotification(tenant.id, \`Payment successful. Viewing request sent for \${prop.title}.\`);

            alert('✅ Payment successful! Viewing request sent to the landlord. You can track its status in your dashboard. Chat is now open.');

            closePaymentModal();
            updateTenantPointsDisplay();
            pendingViewingRequest = null;
            renderTenant();
        }
`;

const regexPaymentFuncs = /function openPayment\([\s\S]*?renderTenant\(\);\n        \}/;
html = html.replace(regexPaymentFuncs, newFunctions);
fs.writeFileSync('index.html', html);
console.log('Payment functions updated.');
