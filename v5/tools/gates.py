"""Measures the G3 gates on renders made by tools/gates.cjs (docs/debate/07-final-spec-v2.md section 8.4).
Usage: python -I tools/gates.py gates.json
Prints one PASS/FAIL line per gate with the measured values."""
import sys, json, math
from pathlib import Path
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
    rgb = im.astype(np.float64) / 255
    linear = np.where(rgb <= 0.04045, rgb / 12.92, ((rgb + 0.055) / 1.055) ** 2.4)
    Y = linear @ np.array([0.2126, 0.7152, 0.0722])
    res.append((float(((mx > 0) & dial).sum() / dial.sum()), float(((mx > 8) & dial).sum() / dial.sum()), int(((mx > 0) & (r > 220) & dial).sum()), float(((mx > 24) & dial).sum() / dial.sum()), float(Y[dial].mean())))
gate('G3 AOD lit share', all(a <= 0.095 and o == 0 for a, _, o, _, _ in res),
     'non-zero RGB ' + ', '.join(f'{100 * a:.2f} %' for a, _, _, _, _ in res) + ' (<= 9.5); >8/255 ' + ', '.join(f'{100 * b:.2f} %' for _, b, _, _, _ in res) +
     '; lit beyond r 220: ' + ', '.join(str(o) for _, _, o, _, _ in res) + ' (0); >24/255 ' + ', '.join(f'{100 * b:.2f} %' for _, _, _, b, _ in res) + '; mean linear Y ' + ', '.join(f'{y:.5f}' for _, _, _, _, y in res))

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

# G11: every visible T4 text/tiered tspan at M1 and M2; glyph AA pixels are retained.
# The 2 px ring uses pixel centres around the union of the transformed glyph cells.
micro = []
for item in job['micro']:
    mask = load(item['mask']).max(axis=2) > 0
    L = lstar(load(item['full']))
    # Round 6: the box is the union of the glyph cells (getExtentOfChar), so text on a circle is measured against its own band,
    # not the sky an axis-aligned box of a curved run would take in. Straight text gives the same box as before.
    inside, outer = np.zeros_like(dial), np.zeros_like(dial)
    for x0, y0, x1, y1 in item.get('cells') or [item['bbox']]:
        inside |= (xx + 0.5 >= x0) & (xx + 0.5 <= x1) & (yy + 0.5 >= y0) & (yy + 0.5 <= y1)
        outer |= (xx + 0.5 >= x0 - 2) & (xx + 0.5 <= x1 + 2) & (yy + 0.5 >= y0 - 2) & (yy + 0.5 <= y1 + 2)
    ring = outer & ~inside & dial
    ink = float(np.median(L[mask])) if mask.any() else None
    surround = float(np.median(L[ring])) if ring.any() else None
    delta = ink - surround if ink is not None and surround is not None else None
    micro.append({**item, 'glyph_pixels': int(mask.sum()), 'ring_pixels': int(ring.sum()), 'glyph_L': ink, 'ring_L': surround, 'delta_L': delta, 'pass': delta is not None and delta >= 25})
valid = bool(micro) and all(m['pass'] for m in micro) and {m['moment'] for m in micro} == {'M1', 'M2'}
minimum = min((m['delta_L'] for m in micro if m['delta_L'] is not None), default=None)
gate('G11 micro legibility', valid, f'{len(micro)} visible T4 elements; minimum glyph-minus-ring median L* {minimum:.2f} (>= 25)' if minimum is not None else 'no measurable T4 glyphs')
for m in micro:
    lines.append(f"  {'PASS' if m['pass'] else 'FAIL'} {m['moment']} {m['frame']} {m['text']!r}: delta L*={m['delta_L'] if m['delta_L'] is not None else 'unmeasurable'}; glyph pixels={m['glyph_pixels']}, ring pixels={m['ring_pixels']}")

# G12: HSV hue in degrees; RGB chroma is max(R,G,B)-min(R,G,B), in 8-bit units.
# Euclidean dilation includes offsets dx^2+dy^2 <= 3^2 (not a 7x7 square).
rgb = load(job['phosphor']).astype(np.float64)
mx, mn = rgb.max(axis=2), rgb.min(axis=2)
chroma = mx - mn
hue = np.zeros_like(chroma)
nonzero = chroma > 0
for channel in range(3):
    selected = nonzero & (rgb.argmax(axis=2) == channel)
    numerator = (rgb[..., (channel + 1) % 3] - rgb[..., (channel + 2) % 3])[selected]
    hue[selected] = (60 * (numerator / chroma[selected] + 2 * channel)) % 360
phosphor = (hue >= 75) & (hue <= 110) & (chroma > 25) & dial
raw_dragon = load(job['dragon']).max(axis=2) > 0
padded = np.pad(raw_dragon, 3)
dragon = np.zeros_like(raw_dragon)
for dy in range(-3, 4):
    for dx in range(-3, 4):
        if dx * dx + dy * dy <= 9:
            dragon |= padded[3 + dy:453 + dy, 3 + dx:453 + dx]
phosphor_n = int(phosphor.sum())
dragon_n = int((phosphor & dragon).sum())
share = dragon_n / phosphor_n if phosphor_n else 0
gate('G12 phosphor budget', phosphor_n > 0 and share >= 0.45, f'{dragon_n}/{phosphor_n} phosphor pixels within dragon +3 px: {100 * share:.2f} % (>= 45); HSV h75..110, RGB chroma>25/255')

# Wake footprint gate: literal requirement at 100 ms, separately for each circle.
wake_results = []
for frame in job['wake']:
    L = lstar(load(frame['file']))
    median = float(np.median(L[open_]))
    baseline = lstar(load(frame['withoutFootprints']))
    for name, (cx, cy, radius) in job['footprint'].items():
        footprint = (np.hypot(xx + 0.5 - cx, yy + 0.5 - cy) <= radius) & dial
        minimum = float(L[footprint].min())
        # Round 6: the artefact is a black disc seen against the sky, so the gate counts the footprint inside the r 180 aperture.
        # Outside it the footprint lies under the trench and F1, which are black by design in every frame (reported, not gated).
        bad = int((L[footprint & (r < 180)] < median - 10).sum())
        baseline_bad = int((baseline[footprint] < median - 10).sum())
        outside_aperture = int((footprint & (L < median - 10) & (r >= 180)).sum())
        actual_darkening = float((baseline - L)[footprint].max())
        wake_results.append({'moment': frame['moment'], 'footprint': name, 'open_sky_median_L': median, 'minimum_L': minimum, 'violating_pixels': bad, 'baseline_violating_pixels': baseline_bad, 'violations_outside_aperture': outside_aperture, 'actual_footprint_darkening_max': actual_darkening})
        gate(f'Wake 100 ms {frame["moment"]}/{name}', bad == 0 and actual_darkening <= 10, f'open-sky median L* {median:.2f}, footprint minimum {minimum:.2f}, pixels inside the aperture >10 darker: {bad} (0); footprint darkening vs no-footprint render max {actual_darkening:.2f} L* (<= 10); diagnostic without AOD footprints: {baseline_bad}, outside sky aperture: {outside_aperture}, actual footprint darkening max {actual_darkening:.2f} L*')

evidence = {'micro': micro, 'phosphor': {'dragon_pixels': dragon_n, 'total_pixels': phosphor_n, 'share': share}, 'wake': wake_results, 'lines': lines}
Path(sys.argv[1]).with_name('gates-measurements.json').write_text(json.dumps(evidence, indent=2, ensure_ascii=False), encoding='utf-8')
print('\n'.join(lines))
sys.exit(1 if any(line.startswith('FAIL') for line in lines) else 0)
