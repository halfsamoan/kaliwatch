# KALI — Phosphor Orbit · 조사와 디자인 근거

확인일: 2026-10-25, Asia/Seoul. 이번 결과물은 **디자인과 오프라인 브라우저 스튜디오**다. 실제 워치 설치·기기 성능 검증은 후속 작업이다.

## v4 추가 — 형태와 토론

현재 행성은 `celestial.js`의 독자 구면·띠·그림자·앞뒤 링이다. [NASA/JPL Shadow and Shade](https://www.jpl.nasa.gov/images/pia08271-shadow-and-shade/)와 [NASA Rings and Shadows](https://science.nasa.gov/photojournal/rings-and-shadows/)는 형태 설계자가 직접 검색·열람한 원자료다. 구면 명암·고리 가림·폭이 다른 띠를 이해하는 근거로 사용했으며 사진 자산을 복사하지 않았다. 조명·색·좌표·모션은 디자인 판단이다.

7역할의 제안과 실제 반박·측정·재반박은 `DEBATE.html`에 기록했다. 숫자 다수결이나 가짜 전원 승인이 아니라 보호 ROI·225px 렌더·AOD 가림을 근거로 구도를 선택했다. 이번 최종 수치는 QA와 evidence-v4를 기준으로 하며 아래는 버전별 이력이다.

## v3 추가 — Cosmic / INFINITY

사용자 요청에 따라 별빛·고리 행성을 SVG 도형으로 소량 추가하고, Active와 AOD의 서명을 INFINITY로 바꿨다. 실제 별자리·관측 정보가 아닌 독자 장식이므로 천문 데이터 출처를 꾸미지 않는다. 공식 Kali 드래곤의 path는 바꾸지 않았다.

## v2 추가 — 실제 Kali 드래곤과 AOD 복귀

사용자의 추가 요청으로 v1의 자체 제작 용은 제거했다. 현재 결과물은 [Kali 공식 Press Pack의 드래곤 원본](https://gitlab.com/kalilinux/documentation/press-pack/-/raw/360c018b5cf65179ad3883d393b8ccbdfa674bc7/Kali/Logomark/kali-dragon-white.svg)을 사용한다. 원본 path 좌표를 그대로 유지하고 fill만 currentColor로 바꿨다. 고정 commit·바이트·SHA-256은 `../brand/PROVENANCE.md`에 있다.

공식 자산을 가져온 뒤 화면·7개 SVG의 path d를 원본과 비교했다. 임의로 생성한 드래곤이나 제3자 재해석 로고가 아니다. [Kali 상표 정책](https://www.kali.org/docs/policy/trademark/)과 출처를 함께 남기며 공식 제품·승인을 주장하지 않는다.

AOD의 윤곽 숫자·분절 궤도·드래곤 점등 순서는 이번 디자인 판단이다. AOD에도 실제 드래곤을 남기고, 같은 SVG 노드가 Active로 이어지는 360ms 브라우저 전환으로 구성했다. 기존 v1의 AOD에서 드래곤을 제외했던 결정은 v2에서 대체됐다. 현재 상세 명세는 `DESIGN-SYSTEM.md`, 검수는 `QA.md`를 기준으로 한다.

## 기존 작업에서 계승한 것

| 원자료 | 확인한 내용 | 이번 결정 |
|---|---|---|
| `KALIWATCH\README.md:3`, `:7-9` | 기존 대상은 Galaxy Watch8 Classic. WFF v4 워치페이스와 상태 앱·타일 분리 | 기존 배포 구조를 참고하되 이번에는 원본 프로젝트를 변경하지 않고 독립 디자인 패키지 제작 |
| 같은 파일 `:13-21` | Terminal Green 테마, 짧은 기상 모션, 지속 scan line·Matrix 비·긴 부팅 GIF 배제 | 초록색 정체성과 짧고 절제된 움직임 계승 |
| 같은 파일 `:64-67` | 가장 큰 시간, 독립된 날짜층, 고정 정렬, AOD에서 초·커서·스캔 제거 | 큰 고정 시간과 주변 단일 궤도. AOD에서 장식과 움직임 축소 |
| `archsport\replica\design\components.md:7-9`, `:23` | 검정 표면에 핵심 정보 우선. 시스템 글꼴·tabular 숫자. 상태를 색만으로 구별하지 않음 | 시간 숫자 폭과 기준선을 고정하고, 상태는 글자와 색을 함께 사용 |
| 같은 파일 `:29-36` | 내용 fade 160ms, 글자 scale 금지, 사건 반응 한 번, 무한 맥동 배제, reduced motion 지원 | 읽는 정보는 고정. 주변 장식에만 제한된 움직임 적용. 모션 감소 시 정보 손실 없이 정지 |
| `archsport\replica\design\tokens.json:7-8`, `:12-17` | `#080a0d` 검정, `#f5f7fa` 본문, `#8de3c0` 민트. tabular 숫자와 모션 토큰 | 검정·발광 초록·보조 민트의 위계를 새 토큰으로 정의. 데스크톱 픽셀 크기를 워치에 그대로 복사하지 않음 |

사용자가 지칭한 `arch`는 대화에서 **archsport**로 확인됐다. 이 저장소에서 별도 `SKILL.md`는 발견되지 않았다. 실제 디자인 근거는 위 컴포넌트 문서와 토큰이다. 기존 문서의 기능 설명은 원본의 의도와 구현 기록이며, 이번 작업에서 기존 APK를 재검증했다는 의미가 아니다.

## halfsamoan 저장소 확인

이번 세션에 `gh repo list halfsamoan --limit 100 --json name,description,url,isPrivate`를 실행해 현재 접근 가능한 저장소 15개를 확인했다. 저장소 전체를 새로 복제하거나 수정하지 않았다.

- [halfsamoan/halfsamoan](https://github.com/halfsamoan/halfsamoan/blob/main/README.md): GitHub 연결 도구로 README 원문 확인. 선택 프로젝트를 모은 포트폴리오이며 워치 소스 저장소가 아니다.
- [archsport](https://github.com/halfsamoan/archsport): GNOME 경기 노치. 위 로컬 디자인·상태·모션 원칙의 근거.
- [notci](https://github.com/halfsamoan/notci): Spotify·카카오톡·오디오 기기 등의 GNOME 노치. [matci](https://github.com/halfsamoan/matci): GNOME 메모리 검사. 둘 모두 워치페이스 구현으로 오인하지 않는다.
- [GA-YOLO](https://github.com/halfsamoan/GA-YOLO): 포트폴리오 README와 저장소 설명에 FMCW 레이더·Range-Doppler 탐지 작업이 명시돼 있다. 신호·궤도·정밀 계기판을 개인적 시각 맥락으로 연결한 것은 **디자인 추론**이다. 실제 센서가 연결됐다는 뜻은 아니다.
- 나머지 확인 이름: `TOa_ai`, `auto_trader`, `shark_tuner`, `matchday-0816`, `gnome-focus-monitor`, `satecs-website`, `Qwen-Local-desktop-`, `cornro`, `PAPKER`, `h4rpy`. 설명과 접근 상태만 확인했으며 이번 워치 디자인의 직접 근거로 삼지 않았다.

## 직접 검색한 공식 레퍼런스

### 시각 원리

[Ressence TYPE 3 공식 소개](https://ressencewatches.com/pages/type-3)는 읽기 쉬운 평면적 표시, 회전 디스크, Eucalyptus 녹색을 설명한다. 여기서 **시간을 읽는 중심 정보와 주변 움직임의 위계**를 참고했다. Phosphor Orbit은 큰 고정 디지털 시간과 단일 궤도로 새로 구성한다. 레퍼런스의 다이얼 배치·바늘·브랜드 표시·제품 이미지를 결과물에 복제하지 않았다.

[CMF Watch Pro 2 공식 제품 페이지](https://ch.nothing.tech/products/cmf-watch-pro-2)도 검색·열람했다. 제품 자체의 원형 시계 맥락을 보조 비교 대상으로만 사용했다. 지역별 페이지와 검색 색인 내용이 달라 동적 워치페이스·AOD 기능에 관한 기술 근거로 사용하지 않는다.

### 나중에 적용할 때의 기술 근거

- [Google · WFF ambient 요구사항](https://developer.android.com/training/wearables/wff/ambient): interactive와 ambient 외형을 분리하고 essential 정보와 발광 면적을 줄이도록 안내한다. 문서는 AOD의 15% 기준을 연결한다. **이 패키지가 기기·스토어 심사 기준을 통과했다는 주장은 하지 않는다.** 실제 렌더와 공식 도구로 다시 확인해야 한다.
- [Google · WFF 설정과 좌표계](https://developer.android.com/training/wearables/wff/setup): WFF의 width·height는 기기에 맞게 확대되는 좌표 범위이며 물리 픽셀이 아니다. 이번 SVG의 450×450도 정규 설계 좌표다. 브라우저 JavaScript는 WFF의 실행 코드가 될 수 없으므로 별도 이식이 필요하다.
- [Google · WFF v4 전환 소개](https://android-developers.googleblog.com/2025/05/whats-new-in-watch-faces.html): ambient 진입·이탈 전환을 설명한다. 브라우저의 모션을 동일하게 지원한다고 가정하지 않고 대상 버전의 Variant·리소스로 매핑할 때 재확인한다.
- [Google · WFF 메모리 사용량](https://developer.android.com/training/wearables/wff/memory-usage): ambient 10MB, interactive 100MB 메모리 한도와 리소스 계산을 설명한다. SVG 파일 크기나 브라우저 메모리만으로 이 조건을 충족했다고 판단하지 않는다.

## 적용 판단과 한계

**메인 디자인 판단:** Phosphor Orbit은 Kali 초록색, archsport의 정보 위계, 사용자 레이더·신호처리 맥락을 통합한 새 방향이다. 특정 제품의 완성된 화면을 따라 만든 디자인이 아니다.

- Active, AOD, reduced-motion 상태를 한 시스템으로 다룬다. reduced motion은 정보가 아니라 장식 움직임을 줄인다.
- 큰 시간은 읽는 동안 움직이거나 찌그러지지 않게 유지한다. 주변 단일 궤도가 시그니처를 맡는다.
- 브라우저에 표시하는 배터리·걸음·시간 프리셋은 시연 데이터다. 실기기 센서 값으로 가장하지 않는다.
- 450 정규좌표 프리뷰는 배치 검토용이다. 실제 워치의 표시 크기·밝기·알림 여백·폰트 렌더·번인·배터리 소모·프레임률은 미확인이다.
- 나중에 기기를 확보하면 대상 모델·Wear OS/WFF 버전을 확인하고 리소스 변환, 공식 XML·메모리 검사, 실제 active↔AOD 전환 및 가독성 검수를 진행한다.

원본 `KALIWATCH`와 `archsport` 저장소는 이 조사 과정에서 변경하지 않았다. 커밋·푸시·외부 게시도 하지 않았다.
