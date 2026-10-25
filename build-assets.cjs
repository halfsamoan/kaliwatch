const fs=require('node:fs'),path=require('node:path');
const T=require('./tokens.js'),Face=require('./face.js');
const fontData=fs.readFileSync(path.join(__dirname,'fonts/RobotoMono.ttf')).toString('base64');
fs.mkdirSync(path.join(__dirname,'assets'),{recursive:true});
const variants={active:{},ambient:{mode:'ambient'},monochrome:{monochrome:true},'background-only':{backgroundOnly:true},'low-battery':{battery:12},'no-data':{battery:null,steps:null},'max-digits':{time:'23:59:59',battery:100,steps:99999}};
for(const [name,opts] of Object.entries(variants))fs.writeFileSync(path.join(__dirname,`assets/kali-orbit-${name}.svg`),Face.render({...opts,fontData}));
fs.writeFileSync(path.join(__dirname,'font-data.js'),`// Roboto Mono, SIL Open Font License; see fonts/OFL.txt\nwindow.OrbitFontData=${JSON.stringify(fontData)};\n`);
fs.writeFileSync(path.join(__dirname,'design-tokens.json'),JSON.stringify(T,null,2)+'\n');
console.log('Built 7 self-contained SVG assets, browser font data, and design-tokens.json.');
