"""Measure lit pixels of a rendered watch-face PNG inside the round dial.
Usage: python tools/lit_pixels.py face.png [--threshold 8]
Reports the share of dial pixels whose max RGB channel exceeds the threshold (Wear OS AOD guidance: <= 15%)
and the mean luminance; this is an image statistic, not a power measurement."""
import sys, argparse
import numpy as np
from PIL import Image

def measure(path, threshold=8):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.int32)
    h, w, _ = im.shape
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy, r = (w - 1) / 2, (h - 1) / 2, min(w, h) / 2
    dial = (xx - cx) ** 2 + (yy - cy) ** 2 <= r * r
    mx = im.max(axis=2)
    lit = (mx > threshold) & dial
    lum = (0.2126 * im[..., 0] + 0.7152 * im[..., 1] + 0.0722 * im[..., 2])
    return {
        'path': path, 'threshold': threshold,
        'dial_pixels': int(dial.sum()), 'lit_pixels': int(lit.sum()),
        'lit_percent': round(100 * lit.sum() / dial.sum(), 2),
        'mean_luminance_0_255': round(float(lum[dial].mean()), 2),
        'bright_percent_over_80': round(100 * float(((mx > 80) & dial).sum()) / dial.sum(), 2),
    }

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('png', nargs='+'); ap.add_argument('--threshold', type=int, default=8)
    a = ap.parse_args()
    for p in a.png:
        print(measure(p, a.threshold))
