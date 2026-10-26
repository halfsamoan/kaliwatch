#!/usr/bin/env python3
"""Build the four OFL font instances and the offline browser embedding.

Run: python3 -I tools/build-fonts.py [--measure]
The optional Chrome measurement uses temporary files and tests all 1,440 HH:MM
combinations. FontTools 4.61.1 is the recorded reproducible build dependency.
"""
import argparse
import base64
import hashlib
import html
import json
from pathlib import Path
import re
import subprocess
import tempfile

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'fonts/MartianMono-VF.ttf'
SOURCE_SHA256 = 'c3467843ec1c2574b05fbcfd7147c7bfbcf63ddca8fc2bcb9d117f1bfb1b22e7'
TIME_WIDTH = 92.5
TIME_SIZE = 55.5 / .836
FACES = [
    ('MartianMono-Wide-SemiBold.ttf', 'OrbitWide', 600, TIME_WIDTH),
    ('MartianMono-Std-Medium.ttf', 'OrbitStd', 500, 100),
    ('MartianMono-Std-Regular.ttf', 'OrbitStd', 400, 100),
    ('MartianMono-Cond-Regular.ttf', 'OrbitCond', 400, 75),
]


def instance(width, weight, output):
    font = TTFont(SOURCE, recalcTimestamp=False)
    axes = {axis.axisTag: (axis.minValue, axis.maxValue) for axis in font['fvar'].axes}
    if axes != {'wght': (100, 800), 'wdth': (75, 112.5)}:
        raise ValueError(f'Unexpected Martian Mono axes: {axes}')
    instantiateVariableFont(font, {'wdth': width, 'wght': weight}, inplace=True)
    font.save(output)
    font = TTFont(output, recalcTimestamp=False)
    assert 'fvar' not in font, 'WFF requires static font instances'
    return font


def measure(chrome):
    """Compare Chrome text boxes and exact ink from the saved TTF outlines."""
    reports = []
    with tempfile.TemporaryDirectory(prefix='kaliwatch-fonts-') as temp:
        temp = Path(temp)
        for width in (112.5 - 2.5 * i for i in range(16)):
            path = temp / 'candidate.ttf'
            font = instance(width, 600, path)
            glyphs, cmap = font.getGlyphSet(), font.getBestCmap()
            texts = [f'{i:02}' for i in range(60)] + [':', 'H']
            parts = []
            for value in texts:
                advance = sum(font['hmtx'].metrics[cmap[ord(c)]][0] for c in value)
                paths, offset = [], 0
                for char in value:
                    name = cmap[ord(char)]
                    pen = SVGPathPen(glyphs)
                    glyphs[name].draw(pen)
                    paths.append(f'<path transform="translate({offset})" d="{pen.getCommands()}"/>')
                    offset += font['hmtx'].metrics[name][0]
                parts.append(f'<text data-kind="text" data-value="{value}" x="0" y="0" '
                             f'style="font-family:candidate;font-size:{TIME_SIZE}px;text-anchor:middle">{value}</text>')
                parts.append(f'<g data-kind="ink" data-value="{value}" '
                             f'transform="scale({TIME_SIZE / 1000},-{TIME_SIZE / 1000}) translate({-advance / 2})">'
                             + ''.join(paths) + '</g>')
            data = base64.b64encode(path.read_bytes()).decode()
            page = ('<html><style>@font-face{font-family:candidate;src:url(data:font/ttf;base64,' + data + ')}</style>'
                    '<svg xmlns="http://www.w3.org/2000/svg">' + ''.join(parts) + '</svg><pre id="result"></pre>'
                    '<script>document.fonts.ready.then(()=>{const out=[...document.querySelectorAll("[data-kind]")].map(e=>{'
                    'let b=e.getBBox();if(e.dataset.kind==="ink"){const m=e.getCTM();'
                    'b={x:b.x*m.a+m.e,y:(b.y+b.height)*m.d+m.f,width:b.width*m.a,height:-b.height*m.d};}'
                    'return {...e.dataset,bbox:{x:b.x,y:b.y,width:b.width,height:b.height}}});'
                    'document.querySelector("#result").textContent=JSON.stringify(out);});</script></html>')
            page_path = temp / 'measure.html'
            page_path.write_text(page)
            result = subprocess.run([chrome, '--headless=new', '--no-sandbox', '--disable-gpu', '--dump-dom',
                                     '--virtual-time-budget=10000', page_path.as_uri()], capture_output=True, text=True, check=True)
            rows = json.loads(html.unescape(re.search(r'<pre id="result">(.*?)</pre>', result.stdout, re.S)[1]))
            ink = {r['value']: r['bbox'] for r in rows if r['kind'] == 'ink'}
            pair_max = lambda limit: max(ink[f'{i:02}']['width'] for i in range(limit))
            worst = {'left': float('inf'), 'right': float('inf')}
            for hour in range(24):
                for minute in range(60):
                    hh, mm, colon = ink[f'{hour:02}'], ink[f'{minute:02}'], ink[':']
                    worst['left'] = min(worst['left'], 225 + colon['x'] - 166 - hh['x'] - hh['width'])
                    worst['right'] = min(worst['right'], 284 + mm['x'] - 225 - colon['x'] - colon['width'])
            report = {'wdth': width, 'fontSize': TIME_SIZE, 'combinations': 1440,
                      'hhMaxInk': pair_max(24), 'mmMaxInk': pair_max(60), 'colonClearance': worst,
                      'digitXMin': min(166 + ink[f'{i:02}']['x'] for i in range(24)),
                      'digitXMax': max(284 + ink[f'{i:02}']['x'] + ink[f'{i:02}']['width'] for i in range(60)),
                      'digitYMin': min(252.3 - .018 * TIME_SIZE + ink[t]['y'] for t in texts[:60]),
                      'digitYMax': max(252.3 - .018 * TIME_SIZE + ink[t]['y'] + ink[t]['height'] for t in texts[:60]),
                      'capInkHeight': ink['H']['height'], 'digitInkHeight': max(ink[t]['height'] for t in texts[:60]),
                      'sampleTextBBox': next(r['bbox'] for r in rows if r['kind'] == 'text' and r['value'] == '08')}
            report['pairFit'] = report['hhMaxInk'] <= 94 and min(worst.values()) >= 6
            report['pass'] = (report['pairFit'] and report['digitXMin'] >= 123 and report['digitXMax'] <= 327
                              and report['digitYMin'] >= 196.8 - 1e-5 and report['digitYMax'] <= 252.3 + 1e-5)
            reports.append(report)
            if report['pass']:
                assert width == TIME_WIDTH, 'Measured fit differs from the committed T0 instance'
                break
        else:
            raise ValueError('No Martian Mono width satisfies the fixed time geometry')
    return reports


def build():
    if hashlib.sha256(SOURCE.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise ValueError('Source font checksum mismatch; review the source before rebuilding')
    faces = []
    for filename, family, weight, width in FACES:
        path = ROOT / 'fonts' / filename
        instance(width, weight, path)
        faces.append({'file': filename, 'family': family, 'weight': weight, 'width': width,
                      'data': base64.b64encode(path.read_bytes()).decode()})
        print(filename, hashlib.sha256(path.read_bytes()).hexdigest())
    metadata = {'timeSize': TIME_SIZE, 'timeWidth': TIME_WIDTH, 'timeInkShiftY': -.018 * TIME_SIZE,
                'capRatio': .8, 'metrics': {'unitsPerEm': 1000, 'capRatio': .8,
                'stdAdvanceRatio': .7, 'condAdvanceRatio': .6,
                'digitInkYMin': -18, 'digitInkYMax': 818, 'digitInkHeight': 55.5}}
    source = ('// Generated by python3 -I tools/build-fonts.py; Martian Mono, SIL OFL 1.1.\n'
              '// Source, licence and measured fit: docs/evidence/round6-fonts.md.\n'
              '(function (root) {\n  "use strict";\n  const faces = ' + json.dumps(faces, separators=(',', ':')) + ';\n'
              '  const css = faces.map(f => `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};'
              'font-display:block;src:url("data:font/ttf;base64,${f.data}") format("truetype");}`).join("\\n");\n'
              '  const api = Object.freeze({ css, faces, ...' + json.dumps(metadata, separators=(',', ':')) + ' });\n'
              '  root.OrbitFonts = api;\n  if (typeof module !== "undefined" && module.exports) module.exports = api;\n'
              '})(typeof globalThis !== "undefined" ? globalThis : this);\n')
    (ROOT / 'orbit-fonts.js').write_text(source)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--measure', action='store_true')
    parser.add_argument('--chrome', default='/usr/bin/google-chrome')
    args = parser.parse_args()
    build()
    if args.measure:
        print(json.dumps(measure(args.chrome), indent=2))
