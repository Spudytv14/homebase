const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newViewingModal = `
    <!-- MODAL: Request Viewing Form -->
    <div id="viewingRequestModal" class="modal-overlay">
        <div class="modal-box">
            <button class="close" onclick="closeViewingRequestModal()">&times;</button>
            <h2><i class="fas fa-calendar-alt"></i> Request House Viewing</h2>
            <p style="color:var(--text-muted); margin-bottom:12px;">Fill in your preferred viewing details.</p>
            <form id="viewingRequestForm" onsubmit="handleViewingRequestSubmit(event)">
                <div style="background:var(--bg); padding:14px; border-radius:var(--radius-sm); margin-bottom:16px;">
                    <div style="display:flex; justify-content:space-between; font-weight:500;"><span>Property:</span><span id="viewingPropertyName">—</span></div>
                </div>
                <div class="field-group">
                    <div class="field"><label>Preferred Date *</label><input type="date" id="viewDate" required /></div>
                    <div class="field"><label>Preferred Time *</label><input type="time" id="viewTime" required /></div>
                </div>
                <div class="field"><label>Number of Attendees (Optional)</label><input type="number" id="viewAttendees" min="1" placeholder="e.g. 2" /></div>
                <div class="field"><label>Note for Landlord</label><textarea id="viewNote" placeholder="e.g. I will arrive right after work." rows="2"></textarea></div>
                <div class="form-actions" style="margin-top: 15px;">
                    <button type="button" class="btn btn-outline" onclick="closeViewingRequestModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Continue to Payment <i class="fas fa-arrow-right"></i></button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL: Viewing Payment -->
    <div id="paymentModal" class="modal-overlay">
        <div class="modal-box">
            <button class="close" onclick="closePaymentModal()">&times;</button>
            <h2><i class="fas fa-credit-card"></i> Viewing Fee Payment</h2>
            <p style="color:var(--text-muted); margin-bottom:12px;">Pay <strong>$2.00</strong> or use <strong>10 Points</strong> to secure your viewing request.</p>
            <div style="background:var(--bg); padding:14px; border-radius:var(--radius-sm); margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; font-weight:500;"><span>Property:</span><span id="paymentPropertyName">—</span></div>
                <div style="display:flex; justify-content:space-between; font-weight:500; margin-top:4px;"><span>Cost:</span><span style="color:var(--primary);">$2.00 <span style="font-size:0.8rem;">or</span> 10 Points</span></div>
                <div style="display:flex; justify-content:space-between; font-weight:500; margin-top:2px;"><span>Your Points:</span><span style="color:var(--points-gold);" id="paymentYourPoints">0</span></div>
            </div>
            <div id="paymentPointsSection" style="margin-bottom:12px;">
                <button class="btn btn-points btn-block btn-sm" id="usePointsBtn" onclick="processViewingPayment('points')" disabled>
                    <i class="fas fa-star"></i> Use 10 Points to Pay (FREE)
                </button>
                <p style="font-size:0.7rem;color:var(--text-muted);text-align:center;margin-top:4px;">You need 10 points. Current balance: <span id="pointsBalanceLabel">0</span></p>
            </div>
            <div style="text-align:center;color:var(--text-muted);margin:8px 0;font-weight:600;">— OR pay $2 —</div>
            <label style="font-weight:600; font-size:0.9rem; display:block; margin-bottom:8px;">Select Payment Method</label>
            <div class="payment-selector" id="paymentMethodSelector">
                <div class="pm-option eco active" data-method="ecocash" onclick="selectPayment('ecocash')"><i class="fas fa-mobile-alt"></i>EcoCash</div>
                <div class="pm-option one" data-method="onemoney" onclick="selectPayment('onemoney')"><i class="fas fa-mobile-alt"></i>OneMoney</div>
                <div class="pm-option smile" data-method="smilecash" onclick="selectPayment('smilecash')"><i class="fas fa-mobile-alt"></i>SmileCash</div>
                <div class="pm-option paypal" data-method="paypal" onclick="selectPayment('paypal')"><i class="fab fa-paypal"></i>PayPal</div>
                <div class="pm-option inbucks" data-method="inbucks" onclick="selectPayment('inbucks')"><i class="fas fa-coins"></i>InBucks</div>
            </div>
            <div id="paymentEcoCashFields" style="margin-top:14px;"><div class="field"><label>EcoCash Number</label><input type="tel" id="ecoPhone" placeholder="e.g. 077 123 4567" /></div></div>
            <div id="paymentOneMoneyFields" style="display:none; margin-top:14px;"><div class="field"><label>OneMoney Number</label><input type="tel" id="onePhone" placeholder="e.g. 071 123 4567" /></div></div>
            <div id="paymentSmileCashFields" style="display:none; margin-top:14px;"><div class="field"><label>SmileCash Number</label><input type="tel" id="smilePhone" placeholder="e.g. 078 123 4567" /></div></div>
            <div id="paymentPaypalFields" style="display:none; margin-top:14px;"><div class="field"><label>PayPal Email</label><input type="email" id="paypalEmail" placeholder="you@example.com" /></div></div>
            <div id="paymentInbucksFields" style="display:none; margin-top:14px;"><div class="field"><label>InBucks Account</label><input type="text" id="inbucksAccount" placeholder="e.g. IB-1234-5678" /></div></div>
            <button class="btn btn-primary btn-block" style="margin-top:18px;" onclick="processViewingPayment('cash')"><i class="fas fa-check-circle"></i> Pay $2.00 &amp; Submit Request</button>
            <p style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin-top:10px;"><i class="fas fa-shield-alt"></i> Secure payment. Your viewing request will be sent to the landlord.</p>
        </div>
    </div>
`;

// Replace the old paymentModal block
const paymentModalRegex = /\<\!\-\- MODAL: Payment \-\-\>[\s\S]*?\<\!\-\- PEER CHAT WINDOW \-\-\>/;
html = html.replace(paymentModalRegex, newViewingModal + '\n    <!-- PEER CHAT WINDOW -->');

fs.writeFileSync('index.html', html);
console.log('Modals replaced successfully');
