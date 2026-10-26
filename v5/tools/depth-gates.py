"""Final-spec G5/G6/G7, measured on source-linked Chrome renders. Missing evidence never passes."""
import json, math, sys
from pathlib import Path
import numpy as np
from PIL import Image

job = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
results = []
def gate(name, passed, detail, measured=True):
    status = ('PASS' if passed else 'FAIL') if measured else 'NOTMEASURED'
    results.append({'name': name, 'status': status, 'detail': detail})
    print(f'{status}  {name}  {detail}')
def rgb(file):
    return np.asarray(Image.open(file).convert('RGB'), dtype=np.float64) / 255

def Y(file):
    c = rgb(file)
    return np.where(c <= .04045, c / 12.92, ((c + .055) / 1.055) ** 2.4) @ np.array([.2126, .7152, .0722])
def L(y):
    f = np.where(y > 216 / 24389, np.cbrt(y), (24389 / 27 * y + 16) / 116)
    return 116 * f - 16

def grid(n):
    y, x = np.mgrid[:n, :n]
    return (x + .5) * 450 / n, (y + .5) * 450 / n

def sample(im, x, y):
    # Bilinear sample in design coordinates, with pixel-centre registration.
    n = im.shape[0]; px = x * n / 450 - .5; py = y * n / 450 - .5
    ix, iy = np.floor(px).astype(int), np.floor(py).astype(int)
    fx, fy = px - ix, py - iy
    x0, y0 = np.clip(ix, 0, n - 1), np.clip(iy, 0, n - 1)
    x1, y1 = np.clip(ix + 1, 0, n - 1), np.clip(iy + 1, 0, n - 1)
    return im[y0, x0] * (1-fx) * (1-fy) + im[y0, x1] * fx * (1-fy) + im[y1, x0] * (1-fx) * fy + im[y1, x1] * fx * fy

G = job['geometry']; x, y = grid(150); radius = np.hypot(x-225, y-225)
angle = np.degrees(np.arctan2(x-225, 225-y)) % 360
open_sky = rgb(job['open'])[..., 0] > .5
for t in job['thumbnail']:
    full = Y(t['full']); light = L(full); moment = t['moment']
    if moment == 'M1':
        if t.get('f1') and t.get('f2'):
            f1 = Y(t['f1']); f2 = Y(t['f2'])
            a = float(np.median(f1[(radius>=189)&(radius<=194)&~((angle>=290)&(angle<=340))]))
            b = float(np.median(f2[(radius>=205)&(radius<=225)]))
            ratio = b/a if a>0 else None
            gate('G5 F2/F1 base', ratio is not None and ratio>=8, f'F2 median Y {b:.5f}, F1 {a:.5f}; ratio {ratio:.2f}x (>= 8)' if ratio is not None else 'zero F1 median: invalid base evidence')
        else: gate('G5 F2/F1 base', False, 'missing source-linked f1/f2 surface tags', False)
        if t.get('milky'):
            pixels = int(((L(Y(t['milky']))>=60)&open_sky).sum())
            gate('G5 Milky Way', pixels>0, f'{pixels} actual Milky Way pixels at L*>=60 in open sky at 150 px (> 0)')
        else: gate('G5 Milky Way', False, 'missing Milky Way source layer', False)
        rx, ry = t['rotor']; rotor = np.hypot(x-rx, y-ry)<=12
        bright = int((rotor&(full>=.4)).sum())
        gate('G5 rotor', bright>=12, f'{bright} visible rotor pixels at linear Y>=40% (>= 12)')
        # One 150 px output pixel across the radial bead profile must reach Y .30.
        # Exclude actual dragon ink and clipped portions, rather than its bounding rectangle.
        dragon = rgb(job['dragon']).max(axis=2)>0
        a = np.linspace(-job['horizonHalfAngle'], job['horizonHalfAngle'], 1200)*math.pi/180
        cx, cy = G['H']; hr=G['HR']; valid=[]; lit=[]
        for th in a:
            nx, ny=math.sin(th),-math.cos(th); bx,by=cx+(hr+2.5)*nx,cy+(hr+2.5)*ny
            ix,iy=int(bx/3),int(by/3)
            if not(0<=ix<150 and 0<=iy<150) or math.hypot(bx-225,by-225)>=180 or dragon[iy,ix]: continue
            found=set()
            for off in np.arange(0,5.01,.25):
                qx,qy=cx+(hr+off)*nx,cy+(hr+off)*ny; px,py=int(qx/3),int(qy/3)
                if 0<=px<150 and 0<=py<150 and full[py,px]>=.3: found.add((px,py))
            valid.append(1);lit.append(len(found)>=1)
        share=float(np.mean(lit)) if lit else 0
        gate('G5 horizon bead', bool(valid) and share>=.6, f'>=1 bright output pixel along {100*share:.2f}% of {len(valid)} visible-length samples (>= 60); Y>=30%')
        qx,qy=G['Q']; a=np.linspace(0,2*math.pi,720,endpoint=False);dx,dy=np.sin(a),-np.cos(a)
        bx,by=qx+59.25*dx,qy+59.25*dy
        visible=np.hypot(bx-225,by-225)<179
        delta=np.abs(sample(light,bx,by)-sample(light,qx+55.5*dx,qy+55.5*dy))
        median=float(np.median(delta[visible])) if visible.any() else 0
        gate('G5 sub-disc lip', median>=12, f'median lip-to-floor delta L* {median:.2f} (>= 12)')
    globe=(np.hypot(x-G['L'][0],y-G['L'][1])<=G['LR'])&(radius<180)
    lit_mask=rgb(t['litMask']).max(axis=2)>0
    if t['phase']>=2:
        mean=float(full[lit_mask].mean()) if lit_mask.any() else 0
        gate(f'G5 globe {moment}', lit_mask.any() and mean>=.4, f'S9={t["phase"]}; lit area mean linear Y {100*mean:.2f}% (>= 40)')
    else:
        unlit=globe&~lit_mask; delta=np.abs(light-L(Y(t['withoutGlobe'])))
        mean=float(delta[unlit].mean()) if unlit.any() else 0
        gate(f'G5 globe {moment}', unlit.any() and mean>=8, f'S9={t["phase"]}; mean unlit-vs-underlying-sky delta L* {mean:.2f} (>= 8)')

# G6 is a lint of actual source parameters. Missing metadata and selectors cannot pass.
audit=job.get('light')
if not audit: gate('G6 one light',False,'bake-sources.js lightAudit metadata unavailable',False)
else:
    for s in audit.get('shadows',[]):
        complete=all(k in s for k in ['dx','dy','deltaHeight']) and bool(s.get('selectorMatches'))
        if not complete: gate('G6 shadow '+s.get('id','?'),False,'missing parameters or no matching source selector',False);continue
        actual=s.get('actualOffset')
        if actual is None: gate('G6 shadow source '+s['id'],False,'actual source offset cannot be recovered',False);continue
        mismatch=max(abs(actual[0]-s['dx']),abs(actual[1]-s['dy']))
        gate('G6 shadow source '+s['id'],mismatch<=.02,f'declared offset ({s["dx"]}, {s["dy"]}) vs actual source ({actual[0]:.3f}, {actual[1]:.3f})')
        length=math.hypot(actual[0],actual[1]);theta=math.degrees(math.atan2(actual[0],-actual[1]))%360
        expected=1.25*s['deltaHeight'];error=abs(length-expected)/expected if expected>0 else float('inf');tolerance=.3 if s.get('rotor') else .15
        angular=abs((theta-135+180)%360-180)
        gate('G6 shadow '+s['id'],angular<=5 and error<=tolerance,f'angle {theta:.2f}° (135±5), length {length:.3f}, expected {expected:.3f}, error {100*error:.2f}% (<= {100*tolerance:g})')
    for h in audit.get('highlights',[]):
        if not h.get('selectorMatches') or h.get('kind') not in ['raised','inner'] or 'angle' not in h: gate('G6 highlight '+h.get('id','?'),False,'missing kind/angle or source selector',False);continue
        target=315 if h['kind']=='raised' else 135;delta=abs((h['angle']-target+180)%360-180)
        gate('G6 highlight '+h['id'],delta<=.01,f'{h["kind"]}: {h["angle"]}° (required {target})')
    if not audit.get('shadows') or not audit.get('highlights'): gate('G6 inventory',False,'empty shadow/highlight inventory',False)

# G7: OLED brightness scales linear luminance. It does not multiply sRGB code values.
for frame in job['depth']:
    light=L(.4*Y(frame['full']));moment=frame['moment']
    for edge in frame['edges']:
        if not edge.get('mask') or not edge.get('points'): gate(f'G7 {moment} edge {edge["name"]}',False,'missing semantic edge mask or contour',False);continue
        mask=rgb(edge['mask']).max(axis=2);counts=[]
        for px,py,nx,ny in edge['points']:
            offsets=np.arange(-4,4.01,.5);qx,qy=px+nx*offsets,py+ny*offsets
            support=sample(mask,qx,qy)>0
            if not support.any():continue
            intensity=sample(light,qx,qy);indices=np.flatnonzero(support);left=max(0,int(indices[0])-2);right=min(len(offsets)-1,int(indices[-1])+2)
            # Adjacent face samples sit 1 design px beyond either visible bevel edge.
            contrast=max(float(np.max(np.abs(intensity[indices]-intensity[left]))),float(np.max(np.abs(intensity[indices]-intensity[right]))))
            counts.append(contrast>=12)
        share=float(np.mean(counts)) if counts else 0
        gate(f'G7 {moment} edge {edge["name"]}',bool(counts) and share>=.6,f'{100*share:.2f}% of {len(counts)} visible contour samples reach delta L*>=12 (>= 60%) at 480 px, 40% linear brightness')
    gx,gy=grid(480);rr=np.hypot(gx-225,gy-225)
    for shadow in frame['shadows']:
        if not shadow.get('mask') or not shadow.get('without'): gate(f'G7 {moment} shadow {shadow["name"]}',False,'missing source-linked shadow mask/baseline',False);continue
        # Round 6: a receiver pixel is one the shadow contributes at least 10 % to; the mask render leaves a 1-5 % haze over thousands of pixels that no shadow could darken.
        support=rgb(shadow['mask']).max(axis=2)>=.1
        if shadow['name']=='dragon-crescent': support&=(rr<180)&(np.hypot(gx-G['H'][0],gy-G['H'][1])>G['HR'])
        elif shadow['name']=='subdisc-floor': support&=np.hypot(gx-G['Q'][0],gy-G['Q'][1])<58.5
        elif shadow['name']=='rotor-lip': support&=(rr>=G['lip'][0])&(rr<=G['lip'][1])
        elif shadow['name']=='plate-sky':
            if not frame.get('clouds'): gate(f'G7 {moment} shadow plate-sky',False,'missing actual Milky Way cloud layer',False);continue
            support&=(L(Y(frame['clouds']))>=45)&(rr<180)
        delta=L(.4*Y(shadow['without']))-light
        # A moment with no Milky Way cloud under the plate's shadow has no receiver to judge; G7 then needs it measured at another moment.
        if shadow['name']=='plate-sky' and not support.any(): gate(f'G7 {moment} shadow plate-sky',True,'no Milky Way cloud under the shadow at this moment (no receiver; measured at the other moments)');continue
        share=float((delta[support]>=8).mean()) if support.any() else 0
        gate(f'G7 {moment} shadow {shadow["name"]}',support.any() and share>=.5,f'{100*share:.2f}% of {int(support.sum())} visible receiver pixels reach delta L*>=8 (>= 50%) at 40% linear brightness')

if sum(1 for r in results if r['name'].endswith('shadow plate-sky') and 'no receiver' not in r['detail'])==0: gate('G7 shadow plate-sky',False,'no moment had a Milky Way receiver under the plate shadow')
Path(sys.argv[1]).with_name('depth-measurements.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
sys.exit(0 if results and all(r['status']=='PASS' for r in results) else 1)
