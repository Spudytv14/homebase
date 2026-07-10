const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
console.log(html.match(/function processViewingPayment[\s\S]*?renderTenant\(\);\n        \}/)[0]);
