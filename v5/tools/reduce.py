#!/usr/bin/env python3
"""Box-reduce a transparent 2x Chrome PNG to an RGBA8888 bake."""
import json
from pathlib import Path
import sys
from PIL import Image

source, target = map(Path, sys.argv[1:3])
image = Image.open(source).convert('RGBA')
assert image.width % 2 == 0 and image.height % 2 == 0, 'Expected an exact 2x supersampled capture'
image = image.reduce(2)
image.save(target, format='PNG', optimize=True)
check = Image.open(target)
assert check.mode == 'RGBA' and target.read_bytes()[24:26] == bytes([8, 6]), 'Expected 8-bit RGBA PNG'
alpha = check.getchannel('A')
assert alpha.getextrema()[0] == 0, 'Transparent bake has no fully transparent pixels'
print(json.dumps({'width': check.width, 'height': check.height, 'mode': check.mode,
                  'alphaExtrema': alpha.getextrema(), 'nonzeroAlphaBBox': alpha.getbbox()}))
