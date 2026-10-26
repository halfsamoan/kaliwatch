# G3 device tests (Galaxy Watch SM-R965N, 480 x 480)

The checklist is 07 §9.5 (`docs/debate/07-final-spec-v2.md`), run in this order. T1, T2, T9 and T15 come first, on the probe face (`wff/probe`, package `org.kaliwatch.g3.probe`). Only then install the main face (`wff/main`, package `org.kaliwatch.g3`). Both packages can be installed side by side. Commands run from the repo root (`kaliwatch/`) unless a block starts with `cd v5`. Fill in the Result column with the date, the measured value and pass or fail. If a test fails, apply its fallback, regenerate and rerun that test before going on.

## 0. Before the watch is connected

### 0.1 Already checked on the PC (run them all again before every APK build)

```bash
cd v5
npm run verify                  # 72 studio renders, the 07 validation table, G10 type inventory, instrument values; "all studio checks passed"
npm run gates                   # headless render + gates.py/depth-gates.py: G1-G3, G5-G9, G11, G12, wake; exits 1 on any FAIL
node tools/test-wff-expr.cjs    # wff-expr.js strings vs independent oracles: M1-M8, 24 UTC hour boundaries, 2026-2030 half-hour sweep, Reference = inlined
node tools/gen-wff.cjs          # regenerates wff/{main,probe}
npm run check-wff               # structural lint of both modules; must end "check-wff: ok"
```

`check-wff` covers tag nesting, the Reference chain order (07 §9.2), Variant rules (07 §9.3 and the v4 XSD), Condition and Expression names, ListOption ids, resources, fonts and strings, RGBA8888 PNGs, integer geometry, the memory estimate (07 §9.1), and the manifest and preview. It is not a schema validation, and none of these commands prove anything about the device. Device timing, rendering, precision and battery are what T1 to T24 below establish.

### 0.2 One-time SDK install (the owner does this by hand; agents never run sdkmanager or accept licences)

1. Download the Android command-line tools yourself (developer.android.com/studio, "Command line tools only"). Unzip them to `~/Android/Sdk/cmdline-tools/latest/`.
2. Run `~/Android/Sdk/cmdline-tools/latest/bin/sdkmanager --sdk_root="$HOME/Android/Sdk" "platform-tools" "build-tools;36.0.0" "platforms;android-36"` and accept the licences yourself.
3. Run `export ANDROID_HOME="$HOME/Android/Sdk"`. You need a JDK with `java` and `keytool` on the PATH (both are already in `/usr/bin`). Prefer `$ANDROID_HOME/platform-tools/adb` over the older system `/usr/bin/adb`, because `adb pair` needs platform-tools 30 or later.
4. Optional, for T20: build the `memory-footprint.jar` from Google's `google/watchface` repository (`play-validations`, `./gradlew :memory-footprint:executable-jar`). That is the owner's decision, because it means running downloaded code.

If `ANDROID_HOME` is missing, `v5/tools/build-apk.sh` stops and prints the step 2 command. It uses no Gradle. It runs aapt2 compile and link, then zipalign `-p 4`, then signs with apksigner using a local debug key (`v5/wff/debug.keystore`, gitignored), verifies the signature and prints the badging.

## 1. Connect, build, install, select

**Wi-Fi debugging.** On the watch:
1. Open Settings > About watch > Software information and tap Software version repeatedly until developer mode turns on.
2. In Settings > Developer options, turn on ADB debugging and Wireless debugging. The PC must be on the same Wi-Fi.
3. Tap Pair new device. It shows `IP:pairport` and a 6-digit code. The Wireless debugging screen itself shows `IP:port`.

```bash
adb pair 192.168.0.23:41234             # IP:pairport from "Pair new device"; type the 6-digit code
adb connect 192.168.0.23:37099          # IP:port from the Wireless debugging screen (a different port)
adb devices -l                          # exactly one line ending in "device"
export ANDROID_SERIAL=192.168.0.23:37099
adb shell getprop ro.build.version.sdk  # must be >= 36 (Wear OS 6 is needed for WFF 4 Reference); otherwise stop here
adb shell wm size                       # Physical size: 480x480
```

Set up the watch once. Set the time zone to Seoul (wff-expr assumes UTC+9). Turn on Settings > Display > Always On Display. Keep the watch on its charger during install sessions. For drain tests (T15, T17), take it off the charger, turn off Wireless debugging and read the battery level on the watch itself.

**Build and install:**
```bash
node v5/tools/gen-wff.cjs
ANDROID_HOME=$HOME/Android/Sdk v5/tools/build-apk.sh probe     # -> v5/wff/out/kaliwatch-g3-probe.apk
adb install -r v5/wff/out/kaliwatch-g3-probe.apk
ANDROID_HOME=$HOME/Android/Sdk v5/tools/build-apk.sh main      # -> v5/wff/out/kaliwatch-g3-main.apk (after the probe tests)
adb install -r v5/wff/out/kaliwatch-g3-main.apk
adb uninstall org.kaliwatch.g3.probe                           # when the probe is done
```

**Select the face.** On the watch, long-press the current face, swipe to the end, tap "+ Add watch face" and pick "Kaliwatch G3 Probe" (or "Kaliwatch G3"). To set the motion option, long-press the face and go to Customize > Motion > Full (tilt) / Calm / Still. Calm is the default. If the face is missing from the list or draws blank, run `adb logcat -d | grep -iE 'watchface|wff' | tail -50` and record the parse error.

**Capture:**
```bash
mkdir -p v5/refs/device
adb exec-out screencap -p > v5/refs/device/T9-$(date +%H%M).png   # 480x480, Active (AOD may come back black: photograph it instead)
adb shell input keyevent KEYCODE_SLEEP    # to AOD (palm-over also works)
adb shell input keyevent KEYCODE_WAKEUP   # to Active
```
For films, put the watch on a stand and use a phone in 240 fps slow motion with constant room light.

**What the studio says now.** These are the expected probe lines, and also the main face telemetry:
```bash
node -e 'const r=require("./v5/wff-expr.js").at(new Date()),f=x=>x.toFixed(2);console.log(`LST ${f(r.lst)}  SUN ${f(r.lsun)}\nRA ${f(r.asun)}  DEC ${f(r.dsun)}\nJD ${f(r.jd)}  sprite ${r.moonSprite}`)'
```
To make a studio render for an overlay, run `cd v5 && PRESETS=vault5 STATES=2026-10-27T22:12:00+09:00 node tools/render-refs.cjs refs/device dev`. That renders at 450. Scale it by 480/450 (1.0667) before you lay it over a 480 screencap.

When the sky angle (360 − LST) is 0, 90, 180 and 270 in the next 24 h (needed for T11 and T14):
```bash
node -e 'const W=require("./v5/wff-expr.js");for(let t=Date.now()-Date.now()%60000,n=0;n<1440;n++,t+=60000){const a=((360-W.at(new Date(t)).lst)%360+360)%360;for(const k of [0,90,180,270])if(Math.abs(((a-k+540)%360)-180)<0.126)console.log(k,new Date(t).toLocaleString("sv-SE",{timeZone:"Asia/Seoul"}))}'
```

## 2. Probe face first (`wff/probe`)

The probe draws:
- the title `G3 T1 T2 T9 T15`;
- three Reference lines: `LST … SUN …`, `RA … DEC …` and `JD …`;
- a grey F2 arc (r 170, with a 30° gap at the top right) that rotates −14° → 0 and fades over the whole wake window;
- a sky dot that turns with −LST;
- a parallax dot at the bottom (Gyro, in Full only);
- the AOD label `AMBIENT / REFERENCE LIVE`;
- a 24 h DigitalClock that fades over 0.33 to 0.94 of the window.

| # | Face · option | Do and observe | Pass (07 §9.5) | Fallback | Result |
|---|---|---|---|---|---|
| T1 | probe · Calm | Film 3 wakes (AOD → Active) and 3 sleeps. W = frames from the first arc movement to the arc at rest, ÷ 240. Check the order on wake: arc and sky dot first, then the clock. On sleep, check whether the order plays in reverse. | W known (ms), order acceptable | `node v5/tools/gen-wff.cjs --window-ms <W>` (rescales the fractions); sleep offsets 0 | |
| T2 | probe · Calm | Use the T1 films. Follow the arc gap: it should turn 14° clockwise on wake and 14° back on sleep. | Short path both ways (about 14°, never a 346° spin) | Drop the angle Variant on `f2`, keep alpha | |
| T9 | probe · Calm, Active then AOD | At 3 minute boundaries, run the "studio says now" command and screencap or photograph the watch in the same minute. Do it in Active, then in AOD (the label shows). Record whether DEC shows negative (−12.49) or normalised (347.51). Record whether JD shows an integer such as `2461340.00`, which means float32 precision (round6-wff-expr.md). Check that the lines update every minute in AOD, and that the sky dot moves with LST. | LST, SUN, RA and DEC match the studio (±0.01) and update each minute in both modes | `node v5/tools/gen-wff.cjs --inline-references` (macro-expanded inline expressions; main face) | |
| T15 | probe · Full (tilt), then Calm | Tilt slowly to ±45° about each axis. The bottom dot should shift by at most 3 design px (3.2 device px). Check that it saturates at about 43° (meaning degree units), that it moves in a sign that reads as depth, and that it never jumps. In Calm it must not move at all. Drain: main face, 24 h in Full against 24 h in Calm, same use, off charger. | ≤ 3 px; ≤ +3 % drain | Ship Calm as the default (it already is) | |

## 3. Main face (`wff/main`), in spec order

| # | Face · option | Do and observe | Pass (07 §9.5) | Fallback | Result |
|---|---|---|---|---|---|
| T3 | main · Calm | Install and select. Confirm that the face loads with `controls="0.22 1 0.36 1"` on every Variant (the probe already uses it). In a wake film, the motion should start fast and settle slowly. | Accepted and rendered | `EASE_OUT` | |
| T4 | main · Calm | Take a macro photo of the AOD clock. The outline glyph box should be 47 x 86 design (50 x 92 device) at 1:1. Step through a wake film frame by frame and measure the edge offset between the outline (`kwo_*`) and the filled Active digits while both show. Leave it in AOD overnight and check that each minute updated. | ≤ 0.5 px misregistration | Re-bake the `kwo_*` offsets; then a PartText + `Outline` clock | |
| T5 | main · Calm | Lay an Active screencap over a studio render of the same minute (scaled 1.0667). Check the baselines of the time digits (TimeText), the date, the telemetry and the sub-disc text (PartText). | ±1 px | Per-type offsets in `wffBox()` (`v5/wffbox.js`) | |
| T6 | main · Calm | In the same overlay, compare the weights of the four Martian Mono instances (Wide SemiBold, Std Medium, Std Regular, Cond Regular) with the studio. | Match (no synthetic bold or condensing) | Bake the digits only if the weights are synthesised | |
| T7 | main · Calm | Screencap at 3 times of day and compare the sky rotation with the studio (use one named star against the dial). The sky should move on odd minutes. Film 10 hour boundaries (:59 → :00) for jumps. | ≤ 1°; motion as specified; no glitch at :59 → :00 | `[MINUTES_SINCE_EPOCH]` form of E1 (2-minute steps) | |
| T8 | main · Calm | Compare the telemetry (LST, JD) with the studio command. Check the step count format: `6,240` below 10k and `12.3k` at 10k or more. Set the step goal to 0 (Samsung Health) and confirm that nothing breaks. Check the planet quadrants (`atan` ternary) through the planet positions against the studio render. | Match the studio | Precompute with an extra wrap; plain `%s` | |
| T10 | main · Calm | Run `node v5/tools/gen-wff.cjs --inline-references`, build main, install. The largest expression (about 7 KB) must validate and load, and the sky must still move on the minute tick. Afterwards, regenerate without the flag. | OK | Drop the planets | |
| T11 | main · Calm | At the 4 times printed by the sky-angle command (0/90/180/270), screencap the 586² sky (at −68,−179). No straight edges or empty corners should appear inside the dome. | No clipping | A 450 Group with pivotY 0.2533 and an overflowing child | |
| T12 | main · Calm | Screencap in Active. The bright part of the SweepGradient lip should sit at the upper left (NW). | Lip lit at NW | Rotate the stop list | |
| T13 | main · Calm | Check the TextCircular labels inside the rotating `calendar` Group at 2 sky angles: they must be correctly placed on the ring, crisp, and not mirrored or centred on the circle. | Correct and crisp | `node v5/tools/gen-wff.cjs --circular-shift <em>` to recalibrate; else `f1_calendar.png` 480² (+0.92 MB) | |
| T14 | main · Calm | At the 4 sky angles from T11, check the counter-rotated star names, planets and rotor. They must stay upright, world-fixed and crisp, with the shadow at (+3,+3). | World-fixed, crisp | Bake the names into the sky; rotor shadow as a separate Arc | |
| T16 | main · all three | Switch between Full, Calm and Still in Customize, 3 times each. Watch for a flash. Compare `adb shell dumpsys meminfo \| grep -iE 'watchface\|wff'` before and after. | No flash; memory unchanged | BooleanConfiguration pair | |
| T17 | main · Calm | Leave it overnight (8 h) in AOD, off charger, Wi-Fi debugging off. Then do the same night with the current everyday face. Compare the battery % used. | Within 5 % of the current face | Move the trail and carriage into a Condition | |
| T18 | main · Calm | Set brightness to 40 % and look at the wrist indoors and in daylight. Check F2, the lip, the bead, the plate bevel, the Milky Way, the rotor and the sub-disc. | The stack reads | +15 % Y on F2 and the bead | |
| T19 | main · Calm, AOD | Take macro photos at t0, +1, +15 and +60 min. Check the frame shift, `sky_aod`, the sun and rotor rotation (about 15°/h), and the BAT and date updates. | Documented | ±1 px walk on non-digit AOD layers (07 §7.3); remove the movement claims | |
| T20 | PC, main APK | `java -jar memory-footprint.jar --watch-face v5/wff/out/kaliwatch-g3-main.apk --schema-version 4 --ambient-limit-mb 10 --active-limit-mb 100 --apply-v1-offload-limitations --estimate-optimization` (no watch needed; it can run as soon as the APK exists) | ≤ 2 layers, ≤ 2 clocks, ≤ 10 MB | Reorder the AOD nodes | |
| T21 | main · Calm | Spot-check the globe sprite about weekly for a month against `sprite` from the studio command and the published lunar age. | ±1 day | E12 from λ☾ (05 form) | |
| T22 | main · Calm | Set the watch language to 한국어 (Settings > General > Language). The date line must stay English. | `25 OCT / SUN / SCO` form | 19-branch Condition | |
| T23 | main · Calm | Take a straight-on macro photo of the edge. All F2 numerals between r 205 and 225 must be fully visible inside the bezel. | Numerals fully visible | Scale `f2` 0.975 about C; never thin the numerals | |
| T24 | v5.1 only | Headset ComplicationSlot in the sub-disc label line (07 §10.1). Not in this build. | Active only; AOD layers unchanged | Keep it on the production faces | n/a |
