import re

with open("index.html", "r") as f:
    content = f.read()

# Add unlockedProperties and setInterval globally
init_code = """
        // ============================================================
        // INIT
        // ============================================================
        let unlockedProperties = {};
        setInterval(() => {
            let hasUnlocked = false;
            let needsRender = false;
            const now = Date.now();
            for (const [id, time] of Object.entries(unlockedProperties)) {
                hasUnlocked = true;
                if (now - time >= 120000) {
                    delete unlockedProperties[id];
                    needsRender = true;
                }
            }
            if (hasUnlocked && document.getElementById('tenant-dash').classList.contains('active-dash')) {
                renderTenant();
            } else if (needsRender) {
                renderTenant();
            }
        }, 1000);

        document.getElementById('aiChatBtn').style.display = 'none';
"""
content = content.replace("""
        // ============================================================
        // INIT
        // ============================================================
        document.getElementById('aiChatBtn').style.display = 'none';""", init_code)

# Replace usePointsToUnlock
points_unlock_old = """
            alert('✅ Unlocked with 10 Points!\\n\\n🏠 ' + prop.title + '\\n📞 Phone: +263 77 ' + Math.floor(Math.random() *
                9000000 + 1000000) + '\\n📧 Email: ' + (landlord ? landlord.contact : 'landlord@props.co.zw') +
                '\\n📍 Address: ' + (prop.address || prop.location));
            transactions.push({ id: 'TXN' + String(transactions.length + 1).padStart(3, '0'), tenant: tenant.name,
                landlord: landlord ? landlord.name : 'Landlord', property: prop.title, amount: 0,
                ref: 'PTS-' + Math.random().toString(36).substring(2, 6).toUpperCase(), status: 'Success (Points)' });
            closePaymentModal();
            renderTenant();
            if (document.getElementById('admin-dash').classList.contains('active-dash')) renderAdmin();
        }"""
points_unlock_new = """
            alert('✅ Unlocked with 10 Points! The landlord details are now visible on the property card for 120 seconds.');
            transactions.push({ id: 'TXN' + String(transactions.length + 1).padStart(3, '0'), tenant: tenant.name,
                landlord: landlord ? landlord.name : 'Landlord', property: prop.title, amount: 0,
                ref: 'PTS-' + Math.random().toString(36).substring(2, 6).toUpperCase(), status: 'Success (Points)' });
            closePaymentModal();
            unlockedProperties[prop.id] = Date.now();
            if (document.getElementById('admin-dash').classList.contains('active-dash')) renderAdmin();
            renderTenant();
        }"""
content = content.replace(points_unlock_old.strip(), points_unlock_new.strip())

# Replace processPayment
process_payment_old = """
            alert('✅ Payment of $2.00 via ' + methodName + ' (' + identifier + ') successful!\\n\\n🏠 ' + prop.title +
                '\\n📞 Phone: +263 77 ' + Math.floor(Math.random() * 9000000 + 1000000) + '\\n📧 Email: ' + (landlord ?
                    landlord.contact : 'landlord@props.co.zw') + '\\n📍 Address: ' + (prop.address || prop.location));
            const tenant = getCurrentTenant();
            transactions.push({ id: 'TXN' + String(transactions.length + 1).padStart(3, '0'), tenant: tenant ? tenant
                    .name : 'Tenant', landlord: landlord ? landlord.name : 'Landlord', property: prop.title, amount: 2,
                ref: methodName.substring(0, 2).toUpperCase() + Math.random().toString(36).substring(2, 8)
                .toUpperCase(), status: 'Success' });
            closePaymentModal();
            renderTenant();
            if (document.getElementById('admin-dash').classList.contains('active-dash')) renderAdmin();
        }"""
process_payment_new = """
            alert('✅ Payment of $2.00 via ' + methodName + ' (' + identifier + ') successful! The landlord details are now visible on the property card for 120 seconds.');
            const tenant = getCurrentTenant();
            transactions.push({ id: 'TXN' + String(transactions.length + 1).padStart(3, '0'), tenant: tenant ? tenant
                    .name : 'Tenant', landlord: landlord ? landlord.name : 'Landlord', property: prop.title, amount: 2,
                ref: methodName.substring(0, 2).toUpperCase() + Math.random().toString(36).substring(2, 8)
                .toUpperCase(), status: 'Success' });
            closePaymentModal();
            unlockedProperties[prop.id] = Date.now();
            if (document.getElementById('admin-dash').classList.contains('active-dash')) renderAdmin();
            renderTenant();
        }"""
content = content.replace(process_payment_old.strip(), process_payment_new.strip())

with open("index.html", "w") as f:
    f.write(content)
print("Updated unlock mechanics.")
