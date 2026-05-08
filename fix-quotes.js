const fs = require('fs');
const p = 'src/app/(main)/contact/page.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/&quot;/g, '"');
fs.writeFileSync(p, c);
