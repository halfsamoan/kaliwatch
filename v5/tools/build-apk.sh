#!/usr/bin/env bash
# Resource-only WFF v4 APKs without Gradle: aapt2 compile -> link -> zipalign -> apksigner (debug key).
# usage (from anywhere): ANDROID_HOME=~/Android/Sdk v5/tools/build-apk.sh [probe] [main]   -> v5/wff/out/kaliwatch-g3-<module>.apk
set -euo pipefail
cd "$(dirname "$0")/.."
die() { printf 'build-apk: %s\n' "$*" >&2; exit 1; }
sdk="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
need="Install once (from Android command-line tools, accepting the licences yourself):
  sdkmanager --sdk_root=\"\$HOME/Android/Sdk\" \"platform-tools\" \"build-tools;36.0.0\" \"platforms;android-36\"
then: export ANDROID_HOME=\"\$HOME/Android/Sdk\" and rerun."
[ -n "$sdk" ] && [ -d "$sdk" ] || die "ANDROID_HOME is not set or not a directory. $need"
bt=""; for d in $(ls -1 "$sdk/build-tools" 2>/dev/null | sort -rV); do
  [ -x "$sdk/build-tools/$d/aapt2" ] && [ -x "$sdk/build-tools/$d/zipalign" ] && [ -x "$sdk/build-tools/$d/apksigner" ] && { bt="$sdk/build-tools/$d"; break; }
done
[ -n "$bt" ] || die "no build-tools with aapt2, zipalign and apksigner under $sdk/build-tools. $need"
jar=""; for d in $(ls -1 "$sdk/platforms" 2>/dev/null | sort -rV); do
  api="${d#android-}"; api="${api%%[!0-9]*}"
  [ -n "$api" ] && [ "$api" -ge 33 ] && [ -f "$sdk/platforms/$d/android.jar" ] && { jar="$sdk/platforms/$d/android.jar"; break; }
done
[ -n "$jar" ] || die "no platforms/android-NN/android.jar with NN >= 33 under $sdk (android-36 wanted). $need"
keytool="$(command -v keytool || true)"; [ -n "$keytool" ] || keytool="${JAVA_HOME:-/nonexistent}/bin/keytool"
ks=wff/debug.keystore pass=android
if [ ! -f "$ks" ]; then
  [ -x "$keytool" ] || die "keytool not found (install a JDK/JRE with keytool, or set JAVA_HOME)"
  "$keytool" -genkeypair -keystore "$ks" -storepass "$pass" -keypass "$pass" -alias androiddebugkey -keyalg RSA -keysize 2048 \
    -validity 10000 -dname "CN=Android Debug,O=Android,C=US" >/dev/null 2>&1 || die "keytool could not create $ks"
fi
modules=("$@"); [ ${#modules[@]} -gt 0 ] || modules=(probe main)
node tools/check-wff.cjs "${modules[@]}" || die "check-wff failed; fix the generated XML first"
echo "build-tools $bt"; echo "android.jar $jar"
mkdir -p wff/out
for m in "${modules[@]}"; do
  src="wff/$m"; work="wff/out/.build/$m"; apk="wff/out/kaliwatch-g3-$m.apk"
  [ -f "$src/manifest/AndroidManifest.xml" ] && [ -f "$src/res/raw/watchface.xml" ] || die "$src is not generated (run: node tools/gen-wff.cjs)"
  sdk_min="$(sed -n 's/.*minSdkVersion="\([0-9]*\)".*/\1/p' "$src/manifest/AndroidManifest.xml")"; sdk_target="$(sed -n 's/.*targetSdkVersion="\([0-9]*\)".*/\1/p' "$src/manifest/AndroidManifest.xml")"
  code="$(sed -n 's/.*versionCode \([0-9]*\).*/\1/p' "$src/build.gradle" 2>/dev/null)"; name="$(sed -n "s/.*versionName '\([^']*\)'.*/\1/p" "$src/build.gradle" 2>/dev/null)"
  rm -rf "$work"; mkdir -p "$work"
  "$bt/aapt2" compile --no-crunch --dir "$src/res" -o "$work/res.zip"
  "$bt/aapt2" link -o "$work/unsigned.apk" -I "$jar" --manifest "$src/manifest/AndroidManifest.xml" \
    --min-sdk-version "${sdk_min:-36}" --target-sdk-version "${sdk_target:-36}" --version-code "${code:-1}" --version-name "${name:-0.0.0}" "$work/res.zip"
  "$bt/zipalign" -p -f 4 "$work/unsigned.apk" "$work/aligned.apk"
  "$bt/apksigner" sign --ks "$ks" --ks-pass "pass:$pass" --key-pass "pass:$pass" --ks-key-alias androiddebugkey --out "$apk" "$work/aligned.apk"
  "$bt/apksigner" verify --verbose "$apk" | grep -E '^Verifies|^Verified using v[23]' || die "apksigner verify failed for $apk"
  "$bt/aapt2" dump badging "$apk" | grep -E "^(package|sdkVersion|minSdkVersion|targetSdkVersion|uses-feature):" || die "aapt2 dump badging failed for $apk"
  unzip -l "$apk" res/raw/watchface.xml >/dev/null || die "$apk lacks res/raw/watchface.xml"
  echo "ok $apk ($(du -h "$apk" | cut -f1))"
done
