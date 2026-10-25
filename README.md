# KALI — Orbital Observatory v4

초승달 아이콘을 **화면 밖의 거대한 고리 행성을 보는 관측창**으로 재설계했다. 공식 Kali 드래곤·초록색·INFINITY·고정된 시각을 유지한다. 독립형 디자인 시스템 및 검수 산출물이다.

## 바로 보기

`index.html`을 브라우저로 열면 된다. 인터넷·설치·워치 연결 없이 동작한다. Node.js가 있으면 `npm start` 후 `http://127.0.0.1:4178/`에서도 볼 수 있다.

- **Active**: 구면 광원·대기 띠·그림자·앞뒤 고리와 분리 틈이 보인다. 시간·날짜·브랜드 영역은 비워 둔다.
- **AOD**: 같은 위치의 구체 윤곽과 전면 고리만 남는다. 검은 몸체가 뒤쪽 고리를 확실히 가린다.
- **AOD → Active 재생**: 재질 220ms, 앞 고리 40ms 지연+180ms. 기존 전체 360ms 전환은 유지한다.
- **저감 모션**: 수동 또는 OS 설정 시 즉시 전환. 행성 비행·상시 회전·별 반짝임은 없다.
- **정밀 검토**: 225px·값 없음·최대 자릿수·배터리 부족·10% 모션·가이드.
- **현재 시각 사용**: 컴퓨터의 시간·날짜만 읽으며 배터리·걸음 수는 시연 값이다.
- **SVG / PNG 저장**: 현재 상태를 글꼴 포함 벡터 또는 900×900 PNG로 저장한다.

225px는 충분한 공간에서 실제 225 CSS px이다. 실제 워치의 물리 크기나 dp를 증명하는 수치가 아니다. 케이스는 디자인 검토용 가상 프레임이다.

## 설계 토론과 검증

7명이 제안·비판·재반박·종합에 참여했다. 작은 사실적 행성 A, 큰 관측창 B, 추상적 eclipse C를 실제 렌더로 비교했다. 처음 A를 추천한 형태 담당자는 2차 비교 후 B로 의견을 수정했다. 고리와 몸체의 마스크 분리는 구도 담당의 재반박을 반영했다.

**7명 전원 최종 승인이라고 주장하지 않는다.** 일부 중간 회차는 계정 한도로 중단됐으며, 최종 통합은 리드와 독립 기술 검증자가 확인했다. 토론의 주장·반박·조건·미완 보고는 `docs/DEBATE.html`에 공개했다.

- 메인 회귀 검증 **81개 통과**, 브라우저 오류 0
- 독립 최종 기술 검증 **21개 통과**
- 시간·날짜·브랜드 보호 영역: 천체 배경 픽셀 변화 0
- AOD 후면 고리 가림: 몸체 상반구 표본 2,531픽셀에서 변화 0
- AOD 비영 RGB 약 **11.32%**, 이미지 분석값이며 실제 전력 수치가 아님

## 주요 파일

| 파일 | 용도 |
|---|---|
| `preview-active.png`, `preview-ambient.png` | 최종 Active/AOD 직접 렌더 |
| `before-after.png`, `motion-storyboard.png`, `motion-preview.webm` | 전후 비교와 모션 시연 |
| `assets/*.svg`, `assets/*-900.png` | 7종 자체 포함 SVG·PNG |
| `celestial.js` | 구면·그림자·뒤/앞 고리·AOD·구도 마스크 렌더러 |
| `face.js`, `studio.js`, `tokens.js` | 공통 다이얼·중단 가능한 모션·토큰 |
| `brand/PROVENANCE.md`, `brand/kali-dragon-original.svg` | 공식 드래곤 원본·출처·해시 |
| `docs/DEBATE.html`, `docs/DESIGN-SYSTEM.html`, `docs/QA.html` | 설계 토론·명세·검수 |
| `evidence-v4/` | 최종 결과 JSON, ROI·가림·프레임·역할별 기록 |

## 재생성 및 검수

`node build-assets.cjs`는 토큰 JSON과 SVG를 재생성한다. 기본 미리보기에는 의존성 설치가 필요 없다. 검수를 다시 실행하려면 `npm install`, `npx playwright install chromium` 후 서버를 켜고 다른 터미널에서 `npm run verify`를 실행한다. `ORBIT_NODE_MODULES`, `ORBIT_CHROMIUM`, `ORBIT_URL`로 기존 환경을 지정할 수 있다.

## 경계와 미확인

실제 천체 관측 시뮬레이션이 아닌 독자 그래픽이다. NASA 원자료에서 광원·구체·고리 가림 원리를 참고했으며 실제 사진을 복사하지 않았다. 공식 Kali 드래곤의 path는 그대로 유지했다. Kali Linux™와 드래곤은 OffSec 상표이고 이 개인 디자인은 공식 제품이 아니다. Roboto Mono 라이선스는 `fonts/OFL.txt`에 있다.

크기가 유동적인 브라우저 케이스의 원형 클립 경계에는 전환 후 최대 RGB9의 미세한 AA 차이가 남는다. 다이얼 정보 영역은 정적 기준과 일치한다. 상세 한계는 QA에 기록했다.

APK·WFF XML·공식 validator·실기 밝기·전력·번인·메모리·프레임 속도는 미확인 또는 미수행이다. 기존 KALIWATCH·archsport 소스는 변경하지 않았다.
