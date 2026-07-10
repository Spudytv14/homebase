const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/let unlockedProperties = {};/g, ''); // just cleaning up unused variables
fs.writeFileSync('index.html', html);
