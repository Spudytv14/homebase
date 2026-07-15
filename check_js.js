const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /<script>([\s\S]*?)<\/script>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  try {
    new vm.Script(match[1]);
  } catch(e) {
    console.log("Syntax error in script tag:", e.message);
    const lines = match[1].split('\n');
    console.log(e.stack.split('\n').slice(0, 3).join('\n'));
  }
}
