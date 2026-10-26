# Kali 드래곤 자산 원자료

확인일: 2026-10-25. 사용자가 요청한 실제 Kali Linux 드래곤을 **Kali 공식 Press Pack**에서 직접 가져왔다. 제3자가 다시 그린 로고나 임의의 용 그림을 사용하지 않았다.

- 공식 저장소: https://gitlab.com/kalilinux/documentation/press-pack
- 공식 분류: `Kali/Logomark` (Dragon). `Kali/README.md`에서도 Logomark를 Dragon으로 명시한다.
- 원본 경로: `Kali/Logomark/kali-dragon-white.svg`
- 확인한 저장소 commit: `360c018b5cf65179ad3883d393b8ccbdfa674bc7`
- 파일의 last commit: `9f88d1b3bffcc9e8d25759569d90dba0160da0a5`
- Git blob: `d963c1ed8e3a99b76c4bd7f4bf2b01011b882d9d`
- 고정 원본 URL: https://gitlab.com/kalilinux/documentation/press-pack/-/raw/360c018b5cf65179ad3883d393b8ccbdfa674bc7/Kali/Logomark/kali-dragon-white.svg
- 보존 파일: `kali-dragon-original.svg` (다운로드 원본 바이트, 1,936 bytes)
- SHA-256: `7f1dffb8c5da8e0e889c490d7530ac297979587598a49462c6a6076e721331ed`

## 렌더러 공급 형식

`../dragon-data.js`는 브라우저 전역 `KaliDragon` 및 Node `module.exports`로 `{viewBox, body, source, sha256}`를 제공한다. 원본 `viewBox`는 `0 0 135.47 135.47`이다. 원본의 한 개 path와 그 안의 모든 형상 좌표를 그대로 유지했다.

기하학을 다시 그리거나 단순화하지 않았다. 단색 적용을 위해 `fill="#fff"`만 `fill="currentColor"`로 바꾸고, 임베딩을 위해 최상위 `<svg>` 껍질을 분리했다. 외부 파일·script·foreignObject·href·CSS url 참조가 없음을 확인했다. 워치페이스의 크기·색·불투명도 조정은 이 데이터 밖의 렌더러가 담당한다.

재생성: `node brand/import-official.cjs` (패키지 루트에서 실행).

Kali Linux 및 드래곤은 원 소유자의 브랜드 자산이다. 이 개인 디자인 프로토타입이 Kali 또는 OffSec의 공식 제품·승인 제품이라는 뜻은 아니다. 공식 상표 정책: https://www.kali.org/docs/policy/trademark/
