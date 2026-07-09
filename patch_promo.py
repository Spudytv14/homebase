import re

with open("index.html", "r") as f:
    content = f.read()

# Update CSS for .promo-banner to transparent, reposition, and clean up
old_promo_css = """        .promo-banner {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: #f1f5f9;
            border: 2px solid #f59e0b;
            border-radius: var(--radius);
            padding: 16px 20px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;

        }"""
new_promo_css = """        .promo-banner {
            background: transparent;
            color: var(--text);
            border: 1px dashed var(--primary-light);
            border-radius: var(--radius);
            padding: 12px 16px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
            text-align: center;
        }"""
content = content.replace(old_promo_css.strip(), new_promo_css.strip())

# Clean up promo banner HTML (remove countdown, simplify text)
old_promo_html = """            <!-- PROMO BANNER -->
            <div class="promo-banner" id="promoBanner">
                <div class="promo-icon"><i class="fas fa-gift"></i></div>
                <div class="promo-text">
                    <strong>🌟 Points Promotion!</strong> Earn <strong>2 points</strong> per referral. <strong>10 points = FREE unlock</strong> (worth $2)!<br />
                    <span class="countdown">⏳ Promotion ends <span id="promoCountdown">31 December 2026</span></span>
                </div>
            </div>"""
new_promo_html = """            <!-- PROMO BANNER -->
            <div class="promo-banner" id="promoBanner">
                <div class="promo-icon" style="font-size: 1.5rem;"><i class="fas fa-gift"></i></div>
                <div class="promo-text" style="font-size: 0.95rem;">
                    <strong>Points Promo:</strong> Earn <strong>2 pts</strong> per referral. <strong>10 pts = FREE unlock</strong>.
                </div>
            </div>"""
content = content.replace(old_promo_html.strip(), new_promo_html.strip())

# Relocate the promo banner to be INSIDE or next to the referral box for cleaner layout
# Search for referral box to reposition
old_referral = """            <!-- REFERRAL BOX -->
            <div class="referral-box">
                <i class="fas fa-users" style="color:var(--primary);font-size:1.2rem;"></i>
                <strong>Your Referral Code:</strong>
                <div class="ref-code" id="tenantRefCode" title="Click to copy" onclick="copyReferralCode()">HOME-TINASHE-2026</div>
                <p style="font-size:0.8rem;color:var(--text-muted);">Share this code! You earn <strong>2 points</strong> when a new tenant signs up with it.</p>
                <button class="btn btn-points btn-sm" onclick="simulateReferral()"><i class="fas fa-plus-circle"></i> Simulate Referral (+2 pts)</button>
            </div>"""

new_referral = """            <!-- REFERRAL BOX & PROMO -->
            <div class="referral-box">
                <div class="promo-banner" id="promoBanner">
                    <div class="promo-icon" style="font-size: 1.5rem;"><i class="fas fa-gift"></i></div>
                    <div class="promo-text" style="font-size: 0.9rem;">
                        <strong>Promo:</strong> 10 points = 1 FREE unlock.
                    </div>
                </div>
                <i class="fas fa-users" style="color:var(--primary);font-size:1.2rem;"></i>
                <strong>Your Referral Code:</strong>
                <div class="ref-code" id="tenantRefCode" title="Click to copy" onclick="copyReferralCode()">HOME-TINASHE-2026</div>
                <button class="btn btn-points btn-sm" style="margin-left: 10px;" onclick="simulateReferral()"><i class="fas fa-plus-circle"></i> Simulate Referral (+2 pts)</button>
            </div>"""

content = content.replace(new_promo_html.strip(), "") # Remove original promo banner
content = content.replace(old_referral.strip(), new_referral.strip())

# Clean up JS that updates countdown
old_js = """        // ============================================================
        // PROMO COUNTDOWN
        // ============================================================
        function updatePromoCountdown() {
            const targetDate = new Date('2026-12-31T23:59:59+02:00');
            const now = new Date();
            const diff = targetDate - now;
            if (diff <= 0) { document.getElementById('promoCountdown').textContent = 'Promotion has ended';
                document.getElementById('promoBanner').style.opacity = '0.7'; return; }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / (1000 * 60)) % 60);
            document.getElementById('promoCountdown').textContent = days + 'd ' + hours + 'h ' + mins +
                'm remaining — 31 December 2026';
        }
        setInterval(updatePromoCountdown, 60000);
        updatePromoCountdown();"""

content = content.replace(old_js.strip(), "")

with open("index.html", "w") as f:
    f.write(content)
print("Updated promo ad.")
