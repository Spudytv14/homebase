const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function usePointsToUnlock\(\) \{[\s\S]*?renderTenant\(\);\n        \}/;
html = html.replace(regex, '');

fs.writeFileSync('index.html', html);
