// Rebuild the safe embedded logo from the preserved official SVG.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sourceFile = path.join(__dirname, 'kali-dragon-original.svg');
const bytes = fs.readFileSync(sourceFile);
const source = bytes.toString('utf8');
if (/<script|<foreignObject|\bhref\s*=|url\(/i.test(source)) throw new Error('External or active SVG content');
const data = {
  viewBox: source.match(/viewBox="([^"]+)"/)[1],
  body: source.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/fill="#fff"/g, 'fill="currentColor"'),
  source: 'https://gitlab.com/kalilinux/documentation/press-pack/-/raw/360c018b5cf65179ad3883d393b8ccbdfa674bc7/Kali/Logomark/kali-dragon-white.svg',
  sha256: crypto.createHash('sha256').update(bytes).digest('hex')
};
if ((data.body.match(/<path\b/g)||[]).length !== 1 || !data.body.includes('fill="currentColor"')) throw new Error('Unexpected source geometry');
const output = '// Official Kali Linux press-pack logomark. Geometry unchanged. See brand/PROVENANCE.md.\n' +
  '(function(root){\n  const data=' + JSON.stringify(data) + ';\n  root.KaliDragon=data;\n  if(typeof module!=="undefined") module.exports=data;\n})(typeof globalThis!=="undefined"?globalThis:this);\n';
fs.writeFileSync(path.join(__dirname, '../dragon-data.js'), output);
console.log(JSON.stringify({viewBox:data.viewBox,sha256:data.sha256,bodyLength:data.body.length}));
