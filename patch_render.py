import re

with open("index.html", "r") as f:
    content = f.read()

# Update renderTenant to display the inline card
old_render = """
                const landlordName = 'Property Owner';
                return `
                    <div class="property-card">
                        <div class="img-wrap">
                            <img src="${imgUrl}" alt="${p.title}" loading="lazy" />
                            <span class="badge ${statusClass} status-badge">${statusLabel}</span>
                            <span class="badge ${densityClass} density-badge">${densityLabel}</span>
                            ${isVerified ? '<span class="verified-icon"><i class="fas fa-check-circle" style="color:var(--verified);font-size:1rem;"></i></span>' : ''}
                        </div>
                        <div class="body">
                            <div class="price">$${p.price} <span>/ month</span></div>
                            <div class="title">${p.title} ${isVerified ? '<i class="fas fa-check-circle verified-check" title="Verified Landlord"></i>' : ''}</div>
                            <div class="meta">
                                <span><i class="fas fa-bed"></i> ${p.rooms} bed</span>
                                <span><i class="fas fa-map-pin"></i> ${p.location}</span>
                                <span><i class="fas fa-layer-group"></i> ${(p.density||'middle').charAt(0).toUpperCase()+(p.density||'middle').slice(1)}</span>
                            </div>
                            <div class="landlord-info"><i class="fas fa-user"></i> ${landlordName} ${isVerified ? '<i class="fas fa-check-circle verified-check-sm"></i>' : ''}</div>
                            <div class="desc">${p.desc || ''}</div>
                            ${p.status === 'vacant'
                                ? `<button class="btn btn-primary btn-block btn-sm" onclick="openPayment(${p.id}, '${p.title.replace(/'/g, "\\'")}')"><i class="fas fa-unlock"></i> Unlock Contact · $2 or 10pts</button>`
                                : `<button class="btn btn-outline btn-block btn-sm" disabled style="opacity:0.5;"><i class="fas fa-lock"></i> Currently Unavailable</button>`
                            }
                        </div>
                    </div>`;"""

new_render = """
                const isUnlocked = !!unlockedProperties[p.id];
                const landlordName = isUnlocked ? (landlord ? landlord.name : 'Unknown') : 'Property Owner';
                const unlockTimeLeft = isUnlocked ? Math.max(0, Math.floor((120000 - (Date.now() - unlockedProperties[p.id])) / 1000)) : 0;

                let contactCard = '';
                if (isUnlocked) {
                    contactCard = `
                        <div style="background: #f8fafc; border: 1px solid var(--primary-light); padding: 12px; border-radius: 8px; margin-top: 12px; font-size: 0.85rem;">
                            <strong style="display:block; margin-bottom: 6px; color: var(--primary);"><i class="fas fa-id-card"></i> Landlord Details (Unlocked)</strong>
                            <div style="margin-bottom: 4px;"><i class="fas fa-user"></i> ${landlordName}</div>
                            <div style="margin-bottom: 4px;"><i class="fas fa-phone"></i> +263 77 ${Math.floor(Math.random() * 9000000 + 1000000)}</div>
                            <div style="margin-bottom: 4px;"><i class="fas fa-envelope"></i> ${landlord ? landlord.contact : 'N/A'}</div>
                            <div style="margin-bottom: 4px;"><i class="fas fa-map-marker-alt"></i> ${p.address || p.location}</div>
                            <div style="color: var(--danger); font-size: 0.75rem; margin-top: 6px; font-weight: 600;"><i class="fas fa-clock"></i> Hiding in ${unlockTimeLeft}s</div>
                        </div>
                    `;
                }

                return `
                    <div class="property-card">
                        <div class="img-wrap">
                            <img src="${imgUrl}" alt="${p.title}" loading="lazy" />
                            <span class="badge ${statusClass} status-badge">${statusLabel}</span>
                            <span class="badge ${densityClass} density-badge">${densityLabel}</span>
                            ${isVerified ? '<span class="verified-icon"><i class="fas fa-check-circle" style="color:var(--verified);font-size:1rem;"></i></span>' : ''}
                        </div>
                        <div class="body">
                            <div class="price">$${p.price} <span>/ month</span></div>
                            <div class="title">${p.title} ${isVerified ? '<i class="fas fa-check-circle verified-check" title="Verified Landlord"></i>' : ''}</div>
                            <div class="meta">
                                <span><i class="fas fa-bed"></i> ${p.rooms} bed</span>
                                <span><i class="fas fa-map-pin"></i> ${p.location}</span>
                                <span><i class="fas fa-layer-group"></i> ${(p.density||'middle').charAt(0).toUpperCase()+(p.density||'middle').slice(1)}</span>
                            </div>
                            <div class="landlord-info"><i class="fas fa-user"></i> ${landlordName} ${isVerified ? '<i class="fas fa-check-circle verified-check-sm"></i>' : ''}</div>
                            <div class="desc">${p.desc || ''}</div>
                            ${p.status === 'vacant' && !isUnlocked
                                ? `<button class="btn btn-primary btn-block btn-sm" onclick="openPayment(${p.id}, '${p.title.replace(/'/g, "\\'")}')"><i class="fas fa-unlock"></i> Unlock Contact · $2 or 10pts</button>`
                                : ''
                            }
                            ${p.status !== 'vacant' && !isUnlocked
                                ? `<button class="btn btn-outline btn-block btn-sm" disabled style="opacity:0.5;"><i class="fas fa-lock"></i> Currently Unavailable</button>`
                                : ''
                            }
                            ${contactCard}
                        </div>
                    </div>`;"""

content = content.replace(old_render.strip(), new_render.strip())

with open("index.html", "w") as f:
    f.write(content)
print("Updated renderTenant with card.")
