const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldPointsBanner = `<div class="promo-banner" id="promoBanner">
                    <div class="promo-icon" style="font-size: 1.5rem;"><i class="fas fa-gift"></i></div>
                    <div class="promo-text" style="font-size: 0.9rem;">
                        <strong>Promo:</strong> 10 points = 1 FREE unlock.
                    </div>
                </div>
                <i class="fas fa-users" style="color:var(--primary);font-size:1.2rem;"></i>
                <strong>Your Referral Code:</strong>
                <div class="ref-code" id="tenantRefCode" title="Click to copy" onclick="copyReferralCode()">HOME-TINASHE-2026</div>
                <button class="btn btn-points btn-sm" style="margin-left: 10px;" onclick="simulateReferral()"><i class="fas fa-plus-circle"></i> Simulate Referral (+2 pts)</button>`;

const newPointsBanner = `<div class="promo-banner" id="promoBanner">
                    <div class="promo-icon" style="font-size: 1.5rem;"><i class="fas fa-gift"></i></div>
                    <div class="promo-text" style="font-size: 0.9rem;">
                        <strong>Promo:</strong> 10 points = 1 FREE Viewing Request.
                    </div>
                </div>
                <i class="fas fa-users" style="color:var(--primary);font-size:1.2rem;"></i>
                <strong>Your Referral Code:</strong>
                <div class="ref-code" id="tenantRefCode" title="Click to copy" onclick="copyReferralCode()">HOME-TINASHE-2026</div>
                <button class="btn btn-points btn-sm" style="margin-left: 10px;" onclick="simulateTenPoints()"><i class="fas fa-plus-circle"></i> Simulate 10 Points</button>`;

html = html.replace(oldPointsBanner, newPointsBanner);


const oldPropertyGrid = `<div id="tenantPropertyGrid" class="property-grid"></div>
            <div id="tenantNoResult" class="no-results" style="display:none;"><i class="fas fa-home"></i><h3>No properties match your filters</h3><p>Try adjusting your search or location.</p></div>`;

const newPropertyGrid = `<div id="tenantViewingRequestsPanel" class="panel" style="margin-top: 30px;">
                <div class="panel-header">
                    <h2><i class="fas fa-calendar-check"></i> My Viewing Requests</h2>
                </div>
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Requested For</th>
                                <th>Status</th>
                                <th>Actions / Info</th>
                            </tr>
                        </thead>
                        <tbody id="tenantViewingRequestsTable">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="tenantPropertyGrid" class="property-grid"></div>
            <div id="tenantNoResult" class="no-results" style="display:none;"><i class="fas fa-home"></i><h3>No properties match your filters</h3><p>Try adjusting your search or location.</p></div>`;

html = html.replace(oldPropertyGrid, newPropertyGrid);

const oldSimulateReferral = `function simulateReferral() {
            const tenant = getCurrentTenant();
            if (!tenant) return;
            tenant.points += 2;
            updateTenantPointsDisplay();
            alert('🎉 +2 Points earned! A new tenant signed up with your referral code.\\n\\nCurrent balance: ' + tenant
                .points + ' points.\\nEarn ' + (10 - tenant.points) + ' more to unlock a property for FREE!');
        }`;

const newSimulateTenPoints = `function simulateTenPoints() {
            const tenant = getCurrentTenant();
            if (!tenant) return;
            tenant.points = 10;
            updateTenantPointsDisplay();
            alert('🎉 You now have 10 points! You can request a property viewing for FREE!');
        }`;

html = html.replace(oldSimulateReferral, newSimulateTenPoints);
fs.writeFileSync('index.html', html);
console.log('Tenant dashboard UI updated.');
