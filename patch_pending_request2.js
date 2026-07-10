const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

console.log(html.match(/function closeViewingRequestModal[\s\S]*?pendingViewingRequest = null;\n        \}/)[0]);
