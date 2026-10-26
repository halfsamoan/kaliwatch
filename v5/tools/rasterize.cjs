// Rasterize an SVG file to PNG with Inkscape (installed locally). Usage: node tools/rasterize.cjs in.svg out.png [size]
const { execFileSync } = require('node:child_process'), path = require('node:path'), fs = require('node:fs');
const INK = process.env.INKSCAPE || 'C:/Program Files/Inkscape/bin/inkscape.com';
function rasterize(svgPath, pngPath, size = 900) {
  execFileSync(INK, [svgPath, '--export-type=png', `--export-filename=${pngPath}`, `--export-width=${size}`, `--export-height=${size}`, '--export-background=#000000', '--export-background-opacity=1'], { stdio: 'pipe', timeout: 180000 });
  return pngPath;
}
if (require.main === module) {
  const [svg, png, size] = process.argv.slice(2);
  if (!svg || !png) { console.error('usage: node tools/rasterize.cjs in.svg out.png [size]'); process.exit(2); }
  rasterize(path.resolve(svg), path.resolve(png), Number(size) || 900);
  console.log('wrote', png, fs.statSync(png).size, 'bytes');
}
module.exports = { rasterize };
