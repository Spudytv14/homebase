const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /\$\{\(\(\) \=\> \{[\s\S]*?const unlockTime = unlockedProperties\[p\.id\];[\s\S]*?\}\)\(\)\}/;

const newRenderTenantButtons = `\${(() => {
                                const req = viewingRequests.find(r => r.propertyId === p.id && r.tenantId === CURRENT_TENANT_ID);

                                if (req) {
                                    return \`<button class="btn btn-outline btn-block btn-sm mt-2" disabled><i class="fas fa-clock"></i> Viewing Request Sent</button>\`;
                                } else {
                                    return p.status === 'vacant'
                                        ? \`<button class="btn btn-primary btn-block btn-sm mt-2" onclick="openViewingRequestModal(\${p.id}, '\${p.title.replace(/'/g, "\\\\'")}')"><i class="fas fa-eye"></i> Request House Viewing</button>\`
                                        : \`<button class="btn btn-outline btn-block btn-sm mt-2" disabled style="opacity:0.5;"><i class="fas fa-lock"></i> Currently Unavailable</button>\`;
                                }
                            })()}`;

html = html.replace(regex, newRenderTenantButtons);

const oldTimerLoop = /let unlockedProperties = \{\};[\s\S]*?\}, 1000\);/m;
html = html.replace(oldTimerLoop, '');

fs.writeFileSync('index.html', html);
console.log('Tenant viewing flow updated on cards.');
