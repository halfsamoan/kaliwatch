"""Measures the G3 gates on renders made by tools/gates.cjs (docs/debate/07-final-spec-v2.md section 8.4).
Usage: python -I tools/gates.py gates.json
Prints one PASS/FAIL line per gate with the measured values."""
import sys, json, math
import numpy as np
from PIL import Image

def lstar(rgb):
    c = rgb.astype(np.float64) / 255
    lin = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    Y = 0.2126 * lin[..., 0] + 0.7152 * lin[..., 1] + 0.0722 * lin[..., 2]
    f = np.where(Y > 216 / 24389, np.cbrt(Y), (24389 / 27 * Y + 16) / 116)
    return 116 * f - 16

def load(path):
    im = Image.open(path).convert('RGB')
    if im.size[0] != 450:
        im = im.reduce(im.size[0] // 450)  # box downsample, as the spec's lit-share rule
    return np.asarray(im)

yy, xx = np.mgrid[0:450, 0:450]
r = np.hypot(xx + 0.5 - 225, yy + 0.5 - 225)
dial = r <= 225
lines = []
def gate(name, ok, msg):
    lines.append(f"{'PASS' if ok else 'FAIL'}  {name}  {msg}")

job = json.load(open(sys.argv[1], encoding='utf-8'))
open_ = (load(job['open'])[..., 0] > 127) & dial

# G8 composition
share_open = open_.sum() / dial.sum()
struct = (~open_) & dial
mirror = (struct != struct[:, ::-1]) & dial
gate('G8 composition', share_open >= 0.355 and mirror.sum() / dial.sum() >= 0.15,
     f'open sky {100 * share_open:.1f} % of the dial (>= 35.5), mirror difference {100 * mirror.sum() / dial.sum():.1f} % (>= 15)')

# G1 sky brightness: 24 hourly LST samples, then M1 to M3
s45, s70, med = [], [], []
for p in job['g1']:
    L = lstar(load(p))[open_]
    s45.append(float((L >= 45).mean())); s70.append(float((L >= 70).mean())); med.append(float(np.median(L)))
sw45, sw70, swmed = s45[:24], s70[:24], med[:24]
ok = min(sw45) >= 0.08 and np.median(sw45) >= 0.15 and np.median(sw70) >= 0.04 and max(swmed) <= 14
gate('G1 sky brightness', ok,
     f'L*>=45 of open sky: min {100 * min(sw45):.1f} % (>= 8), median {100 * np.median(sw45):.1f} % (>= 15); '
     f'L*>=70 median {100 * np.median(sw70):.1f} % (>= 4); open-sky median L* max {max(swmed):.1f} (<= 14); '
     f'M1/M2/M3 L*>=45: {", ".join(f"{100 * v:.1f} %" for v in s45[24:])}')
m1_dial = s45[24] * open_.sum() / dial.sum()
gate('G8 Milky Way at M1', m1_dial >= 0.06, f'pixels at L*>=45 in open sky at M1: {100 * m1_dial:.1f} % of the dial (>= 6; includes stars, lines and names)')

# G2 calm under the glass (digits and date hidden): digit ink box x 123-327, y 196.8-252.3
box = (slice(197, 252), slice(123, 327))
worst = []
for p in job['g2']:
    L = lstar(load(p))[box]
    worst.append((float(np.median(L)), float(np.percentile(L, 99))))
gate('G2 digit calm', all(m <= 8 and q <= 30 for m, q in worst),
     f'median L* max {max(m for m, _ in worst):.1f} (<= 8), 99th percentile max {max(q for _, q in worst):.1f} (<= 30) over M1-M8')

# G3 always-on lit share (device scale 3, box-downsampled to 450)
res = []
for p in job['g3']:
    im = load(p); mx = im.max(axis=2)
    res.append((float(((mx > 0) & dial).sum() / dial.sum()), float(((mx > 8) & dial).sum() / dial.sum()), int(((mx > 0) & (r > 220) & dial).sum())))
gate('G3 AOD lit share', all(a <= 0.095 and o == 0 for a, _, o in res),
     'non-zero RGB ' + ', '.join(f'{100 * a:.2f} %' for a, _, _ in res) + ' (<= 9.5); >8/255 ' + ', '.join(f'{100 * b:.2f} %' for _, b, _ in res) +
     '; lit beyond r 220: ' + ', '.join(str(o) for _, _, o in res) + ' (0)')

# G9 names and figures, 360 LST samples, against the open-sky mask
Px, Py = job['P']
def is_open(x, y):
    ix, iy = int(math.floor(x)), int(math.floor(y))
    return 0 <= ix < 450 and 0 <= iy < 450 and bool(open_[iy, ix])
def rot(p, lst):
    a = math.radians(-lst); c, s = math.cos(a), math.sin(a)
    return Px + p[0] * c - p[1] * s, Py + p[0] * s + p[1] * c
counts = []
for lst in range(360):
    n = 0
    for nm in job['names']:
        cx, cy = rot(nm['anchor'], lst)
        if not all(is_open(cx + dx, cy + dy) for dx, dy in ((-11, 6), (11, 6), (-11, 14), (11, 14), (0, 10))):
            continue
        st = [is_open(*rot(q, lst)) for q in nm['stars']]
        if st and sum(st) / len(st) >= 0.6:
            n += 1
    counts.append(n)
c = np.array(counts)
gate('G9 names', c.min() >= 3 and (c >= 4).mean() >= 0.98 and c.mean() >= 6.5,
     f'readable names: min {c.min()} (>= 3), >= 4 for {100 * (c >= 4).mean():.1f} % of LST (>= 98), mean {c.mean():.2f} (>= 6.5)')

print('\n'.join(lines))
