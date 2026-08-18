import re

with open('index.html', 'r') as f:
    html = f.read()

# CSS to inject
css = """
    /* Auth Container Styles Added via Script */
    .auth-container {
      width: 100%;
      max-width: 440px;
      position: relative;
      z-index: 10;
      margin: 0 auto;
    }

    .auth-container .auth-card {
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    .auth-container .brand-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .auth-container .brand-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 58px;
      height: 58px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #ffffff;
      font-size: 1.6rem;
      border-radius: 16px;
      margin-bottom: 0.9rem;
      box-shadow: 0 10px 20px -3px rgba(79, 70, 229, 0.4);
      transition: all 0.3s ease;
    }

    .auth-container .brand-title {
      font-size: 1.65rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.025em;
    }

    .auth-container .brand-subtitle {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-top: 0.3rem;
    }

    .auth-container .portal-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 30px;
      margin-bottom: 1.5rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
      transition: all 0.3s ease;
    }

    .auth-container .portal-badge.role-tenant { background: #e0f2fe; border-color: #bae6fd; color: #0369a1; }
    .auth-container .portal-badge.role-landlord { background: #dcfce7; border-color: #bbf7d0; color: #15803d; }
    .auth-container .portal-badge.role-admin { background: #fef3c7; border-color: #fde68a; color: #b45309; }

    .auth-container .form-group { margin-bottom: 1.25rem; text-align: left; }
    .auth-container .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.45rem; }
    .auth-container .input-wrapper { position: relative; display: flex; align-items: center; }
    .auth-container .input-wrapper i.prefix-icon { position: absolute; left: 14px; color: var(--text-muted); font-size: 1rem; pointer-events: none; transition: color 0.2s ease; }
    .auth-container .input-wrapper input { width: 100%; padding: 0.85rem 1rem 0.85rem 2.65rem; font-size: 0.95rem; color: var(--text-main); background: #f8fafc; border: 1.5px solid var(--border-color); border-radius: 12px; outline: none; transition: all 0.2s ease; }
    .auth-container .input-wrapper input:focus { background: #ffffff; border-color: var(--primary); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15); }
    .auth-container .toggle-password { position: absolute; right: 14px; background: none; border: none; color: var(--text-muted); font-size: 1rem; cursor: pointer; padding: 4px; }
    .auth-container .field-hint { font-size: 0.76rem; color: var(--text-muted); margin-top: 5px; display: flex; align-items: center; gap: 4px; }
    .auth-container .form-options { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; margin-bottom: 1.5rem; }
    .auth-container .remember-me { display: flex; align-items: center; gap: 8px; color: var(--text-muted); cursor: pointer; }
    .auth-container .remember-me input { accent-color: var(--primary); width: 16px; height: 16px; }
    .auth-container .forgot-link { color: var(--primary); text-decoration: none; font-weight: 500; }
    .auth-container .forgot-link:hover { text-decoration: underline; }
    .auth-container .submit-btn { width: 100%; padding: 0.95rem 1.5rem; font-size: 1rem; font-weight: 600; color: #ffffff; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 8px 20px -3px rgba(79, 70, 229, 0.4); transition: all 0.25s ease; }
    .auth-container .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -3px rgba(79, 70, 229, 0.5); }
    .auth-container .card-footer { text-align: center; margin-top: 1.75rem; font-size: 0.875rem; color: var(--text-muted); }
    .auth-container .card-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }

    /* Background for body in view-login */
    #view-login {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.78), rgba(30, 27, 75, 0.88)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80') center center / cover no-repeat fixed;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
    }
"""

if '</style>' in html:
    html = html.replace('</style>', css + '\n</style>')

# Replace the HTML
import re
match = re.search(r'<div id="view-login" class="active-view">(.*?)(<!-- TENANT DASHBOARD -->)', html, re.DOTALL)
if match:
    new_html = """
    <div id="view-login" class="active-view">
        <div class="auth-container">
            <!-- LOGIN CARD -->
            <div id="login-card" class="auth-card active-auth-card">
              <div class="brand-header">
                <div class="brand-logo" id="brandLogo">
                  <i class="fa-solid fa-house-chimney"></i>
                </div>
                <h1 class="brand-title">HomeBase</h1>
                <p class="brand-subtitle">Smart Unified Housing Access</p>
              </div>

              <div class="portal-badge" id="portalBadge">
                <i class="fa-solid fa-circle-dot badge-icon" id="badgeIcon"></i>
                <span id="badgeText">Enter email to route portal</span>
              </div>

              <form id="login-form" onsubmit="handleLogin(event)">
                <input type="hidden" name="detected_role" id="detectedRole" value="tenant">

                <div class="form-group">
                  <label for="login-email">Email Address</label>
                  <div class="input-wrapper">
                    <i class="fa-solid fa-envelope prefix-icon"></i>
                    <input type="email" id="login-email" placeholder="e.g. resident@mail.com, manager@domain.com" required autocomplete="email">
                  </div>
                  <div class="field-hint">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Portal dynamically routes depending on account type</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="login-password">Password</label>
                  <div class="input-wrapper">
                    <i class="fa-solid fa-lock prefix-icon"></i>
                    <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password">
                    <button type="button" class="toggle-password" id="togglePassword" aria-label="Toggle password visibility">
                      <i class="fa-regular fa-eye" id="eyeIcon"></i>
                    </button>
                  </div>
                </div>

                <div class="form-options">
                  <label class="remember-me">
                    <input type="checkbox" name="remember" id="remember">
                    <span>Remember me</span>
                  </label>
                  <a href="#" class="forgot-link">Forgot password?</a>
                </div>

                <button type="submit" class="submit-btn" id="submitBtn">
                  <span id="btnText">Sign In to Portal</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </button>

              </form>

              <div class="card-footer">
                Need registration? <a href="#" onclick="toggleAuthView('signup-choice'); return false;">Contact management</a>
              </div>
            </div>

            <!-- SIGNUP CHOICE CARD -->
            <div id="signup-choice-card" class="auth-card" style="display:none;">
              <div class="brand-header">
                <div class="brand-logo" id="brandLogoSignup">
                  <i class="fa-solid fa-house-chimney"></i>
                </div>
                <h1 class="brand-title">HomeBase</h1>
                <p class="brand-subtitle">Smart Unified Housing Access</p>
              </div>

                <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:6px;text-align:center;">Create an Account</h2>
                <p class="auth-sub" style="font-size:0.9rem;color:var(--text-muted);margin-bottom:24px;text-align:center;">Join HomeBase today</p>
                <div class="signup-options" style="display:flex;flex-direction:column;gap:12px;">
                    <button class="submit-btn" style="background:#fff;border:1px solid #ddd;color:#333;box-shadow:none;" type="button" onclick="alert('Google login simulated');"><i class="fab fa-google" style="color:#db4437;"></i> Sign up with Google</button>
                    <div class="divider" style="display:flex;align-items:center;text-align:center;color:var(--text-muted);font-size:0.75rem;font-weight:600;margin:10px 0;"><span>OR</span></div>
                    <button class="submit-btn" type="button" onclick="toggleAuthView('signup')"><i class="fas fa-envelope"></i> Sign up with Email</button>
                </div>
                <div class="auth-switch" style="text-align:center;margin-top:24px;font-size:0.85rem;color:var(--text-muted);">
                    Already have an account? <a href="#" onclick="toggleAuthView('login'); return false;" style="color:var(--primary);text-decoration:none;font-weight:600;">Log in</a>
                </div>
            </div>

            <!-- SIGNUP FORM CARD -->
            <div id="signup-form-card" class="auth-card" style="display:none;">
                <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:6px;">Register</h2>
                <p class="auth-sub" style="font-size:0.9rem;color:var(--text-muted);margin-bottom:24px;">Fill in your details</p>
                <form id="signup-form" onsubmit="handleSignup(event)" style="display:flex;flex-direction:column;gap:16px;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label>Full Name</label>
                        <div class="input-wrapper">
                            <input type="text" id="reg-name" placeholder="John Doe" required />
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label>Email Address</label>
                        <div class="input-wrapper">
                            <input type="email" id="reg-email" placeholder="john@example.com" required />
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label>Password</label>
                        <div class="input-wrapper">
                            <input type="password" id="reg-password" placeholder="Create a password" required />
                        </div>
                    </div>
                    <div style="display:flex;gap:12px;">
                        <div class="form-group" style="margin-bottom:0;flex:1;">
                            <label>Role</label>
                            <div class="input-wrapper">
                                <select id="reg-role" required onchange="toggleRegLocation()" style="width:100%;padding:0.85rem 1rem;font-size:0.95rem;color:var(--text-main);background:#f8fafc;border:1.5px solid var(--border-color);border-radius:12px;outline:none;">
                                    <option value="">-- Select Role --</option>
                                    <option value="tenant">Tenant</option>
                                    <option value="landlord">Landlord</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group" id="reg-location-wrapper" style="display:none;margin-bottom:0;flex:1;">
                            <label>Location</label>
                            <div class="input-wrapper">
                                <select id="reg-location" style="width:100%;padding:0.85rem 1rem;font-size:0.95rem;color:var(--text-main);background:#f8fafc;border:1.5px solid var(--border-color);border-radius:12px;outline:none;">
                                    <option value="Harare">Harare</option>
                                    <option value="Bulawayo">Bulawayo</option>
                                    <option value="Gweru">Gweru</option>
                                    <option value="Mutare">Mutare</option>
                                    <option value="Chitungwiza">Chitungwiza</option>
                                    <option value="Victoria Falls">Victoria Falls</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;gap:12px;">
                        <div class="form-group" style="margin-bottom:0;flex:1;">
                            <label>Phone Number</label>
                            <div class="input-wrapper">
                                <input type="tel" id="reg-phone" placeholder="077 123 4567" required />
                            </div>
                        </div>
                        <div class="form-group" style="margin-bottom:0;flex:1;">
                            <label>National ID</label>
                            <div class="input-wrapper">
                                <input type="text" id="reg-id" placeholder="XX-XXXXXXX-X XX" required />
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="submit-btn" style="margin-top:10px;"><i class="fas fa-user-plus"></i> Register</button>
                </form>
                <div class="auth-switch" style="text-align:center;margin-top:24px;font-size:0.85rem;">
                    <a href="#" onclick="toggleAuthView('signup-choice'); return false;" style="color:var(--text-muted);text-decoration:none;font-weight:600;"><i class="fas fa-arrow-left"></i> Back</a>
                </div>
            </div>
        </div>
    </div>
    """
    html = html.replace(match.group(0), new_html + "\n\n    <!-- TENANT DASHBOARD -->")

# Inject JS
js = """
    const emailInput = document.getElementById('login-email');
    if (emailInput) {
        const portalBadge = document.getElementById('portalBadge');
        const badgeText = document.getElementById('badgeText');
        const badgeIcon = document.getElementById('badgeIcon');
        const brandLogo = document.getElementById('brandLogo');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const detectedRole = document.getElementById('detectedRole');
        const togglePasswordBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('login-password');
        const eyeIcon = document.getElementById('eyeIcon');

        if (togglePasswordBtn) {
            togglePasswordBtn.addEventListener('click', () => {
              const isPassword = passwordInput.getAttribute('type') === 'password';
              passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
              eyeIcon.classList.toggle('fa-eye');
              eyeIcon.classList.toggle('fa-eye-slash');
            });
        }

        // Auto-detect portal type based on email input without manual tab switching
        emailInput.addEventListener('input', (e) => {
          const val = e.target.value.toLowerCase().trim();
          if (portalBadge) {
              portalBadge.classList.remove('role-tenant', 'role-landlord', 'role-admin');

              if (!val) {
                portalBadge.className = 'portal-badge';
                badgeIcon.className = 'fa-solid fa-circle-dot badge-icon';
                badgeText.textContent = 'Enter email to route portal';
                btnText.textContent = 'Sign In to Portal';
                detectedRole.value = 'tenant';
                brandLogo.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
                submitBtn.style.background = 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)';
                return;
              }

              // 1. Admin Role (admin@, staff@, root@, etc.)
              if (val.includes('admin') || val.includes('staff') || val.includes('root') || val.includes('hr-marketing')) {
                portalBadge.classList.add('role-admin');
                badgeIcon.className = 'fa-solid fa-shield-halved badge-icon';
                badgeText.textContent = 'Admin Control Portal detected';
                btnText.textContent = 'Sign In as Administrator';
                detectedRole.value = 'admin';
                brandLogo.style.background = 'linear-gradient(135deg, #d97706, #f59e0b)';
                submitBtn.style.background = 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)';
              }
              // 2. Landlord / Property Manager Role
              else if (val.includes('landlord') || val.includes('owner') || val.includes('host') || val.includes('manager')) {
                portalBadge.classList.add('role-landlord');
                badgeIcon.className = 'fa-solid fa-building-user badge-icon';
                badgeText.textContent = 'Landlord Portal detected';
                btnText.textContent = 'Sign In to Landlord Portal';
                detectedRole.value = 'landlord';
                brandLogo.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
              }
              // 3. Default Tenant / Resident
              else {
                portalBadge.classList.add('role-tenant');
                badgeIcon.className = 'fa-solid fa-user-tag badge-icon';
                badgeText.textContent = 'Tenant Resident Portal detected';
                btnText.textContent = 'Sign In to Tenant Portal';
                detectedRole.value = 'tenant';
                brandLogo.style.background = 'linear-gradient(135deg, #0284c7, #38bdf8)';
                submitBtn.style.background = 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)';
              }
          }
        });
    }
"""

if '</script>' in html:
    html = html.replace('</script>', js + '\n</script>')

with open('index.html', 'w') as f:
    f.write(html)
print("Updated index.html")
