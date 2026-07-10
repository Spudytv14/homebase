const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Ensure tables wrap correctly on mobile
const cssRegex = /@media \(max-width: 768px\) \{[\s\S]*?\}\n        @media \(max-width: 480px\)/;

const additionalCss = `            .table-wrap table {
                min-width: 600px; /* Ensure tables scroll horizontally instead of squishing */
            }
            .modal-box {
                width: 95%;
                margin: 10px;
                padding: 20px 15px;
            }
`;

html = html.replace(/@media \(max-width: 768px\) \{/, "@media (max-width: 768px) {\n" + additionalCss);
fs.writeFileSync('index.html', html);
console.log('Responsiveness patched.');
