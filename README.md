# MUSUBU — 논산 QR 관광 데모

공개 주소: https://minteset0-afk.github.io/musubu-tour-demo/

QR → 일본어 이야기 감상 → 카테고리 → 업체 상세 → 익명 후기 저장 → 데모 바우처.

## 구성
- `index.html`: 기존 녹색 화면·내장 일본어 MP3·QR 링크·바우처, 접근성 있는 상세 dialog.
- `app.js`, `shops.css`: 모바일 Bottom Sheet / PC 중앙 패널, 리뷰·실시간 처리.
- `shops.js`: 카테고리별 2곳, 총 6개 가상 업체. 실제 API가 아닌 발표용 데이터.
- `demo-shop.html`: 공식 사이트 버튼으로 새 탭에 열리는 가상 소개 페이지. 실제 업체가 아님을 표시.
- `vendor/supabase.js`: Supabase JS 2.117.2 고정 버전, 외부 CDN 없이 제공.
- `database/schema.sql`, `database/seed.sql`: 적용한 DB 구조 및 가상 업체 데이터 기록.
- `qr.html`: 기존 QR 유지. GitHub Pages 배포 workflow 유지.

## Supabase
서울 리전 Free 프로젝트: `fzynbjgkictmlmuxfldl`.
프런트엔드는 publishable key만 사용. 관리자 키를 사용하지 않음.

- `shops`: shop_id, name, category, image_url, address, business_hours, phone, products, external_url, map_url, description, is_demo.
- `reviews`: id(UUID), shop_id(FK), rating(1–5), review_text(공백 제외 최소 2자·최대 500자), created_at(DB 시각), request_id(중복 요청 방지 UUID).
- 두 테이블 RLS 활성화. anon은 SELECT, reviews의 shop_id/rating/review_text/request_id만 INSERT 가능. UPDATE/DELETE 불가. 업체 INSERT 불가. id/created_at 임의 지정 불가.
- `shop_review_stats()`는 SECURITY INVOKER로 전체 후기 개수·평균 계산. anon에만 실행 권한 부여.
- reviews를 supabase_realtime publication에 추가. 선택한 업체의 INSERT만 구독, 닫으면 연결 해제. 구독 완료·재연결 시 DB를 다시 조회해 누락 보정.
- 화면에는 최신 후기 20개만 전송. 후기 본문은 textContent로 표시해 HTML 실행을 막음.
- DB 저장 결과의 실제 id가 확인된 뒤에만 바우처 활성화. 전송 실패·유효성 오류는 발급하지 않음.
- 바우처는 현재 페이지 세션의 발표용 UI 상태이며 실제 금전 가치, 본인 인증, 영구 사용 이력은 없음.

## 운영 범위
소규모 발표·테스트를 위한 Free 구성. 요금제 업그레이드/유료 서비스는 사용하지 않음. 무료 한도 초과 시 무제한 운영을 보장하지 않으며 프로젝트가 비활성 상태가 되면 발표 전 대시보드에서 확인이 필요함.
공개 익명 등록 특성상 악의적 대량 등록 방어는 별도 서비스 운영 단계에서 추가해야 함. 개인정보를 후기에 적지 않도록 안내함.
가상 주소·전화번호·가격이며 지도는 논산 지역 검색. 사진은 Unsplash 참고 이미지, 로드 실패 시 로컬 대체 이미지 표시.

## 재현
`npm ci --ignore-scripts` 다음 `npm run build:vendor`. 사이트는 별도 서버 없이 정적 파일로 동작.
DB SQL은 이미 적용되어 있으므로 기존 프로젝트에 중복 실행하지 않음. DB 설정을 바꾸면 SQL 기록과 클라이언트 데이터도 함께 관리.

## 한국어 / 日本語 (2026-09-30)

- 기본 한국어. 언어 우선순위는 유효한 `?lang=ko|ja` → `localStorage['musubu.language']` → `ko`입니다.
- `i18n.js`의 `translations.ko`, `translations.ja`에서 UI/오류/안내 문구를 관리합니다. `shopTranslations`는 기존 shop_id에 대응하는 일본어 설명과 메뉴명입니다. 상호명과 사용자 리뷰 원문은 변경하지 않습니다.
- 언어 변경은 페이지를 다시 불러오지 않습니다. `<html lang>` 및 `lang-ko/theme-ko`, `lang-ja/theme-ja` 클래스를 바꾸고 `musubu:languagechange` 이벤트로 동적 화면을 갱신합니다. 작성 중인 후기, 선택 별점, 활성 Realtime 채널과 발급 바우처는 유지됩니다.
- `themes.css`는 기존 한국어 녹색 테마를 유지하고 일본어에서 코랄/핑크/남색 테마를 적용합니다. 모바일 Bottom Sheet, 일본어 줄바꿈, 터치 버튼, reduced-motion 설정을 지원합니다.
- 동일한 기존 Supabase 프로젝트, reviews 테이블, shop_id 및 RLS를 사용합니다. 별도 DB나 유료 번역 API, 추가 서버는 없습니다.
- 일본어 발표 URL: https://minteset0-afk.github.io/musubu-tour-demo/?lang=ja
- 한국어 발표 URL: https://minteset0-afk.github.io/musubu-tour-demo/?lang=ko
- `qr.html`에서 두 언어 QR을 표시하고 SVG로 저장할 수 있습니다. QR 이미지는 로컬 자산이며 외부 QR API에 의존하지 않습니다.
- `audio.js`는 기존 페이지에 포함된 일본어 MP3를 그대로 재생하고 상태 문구를 번역합니다. 브라우저 기본 오디오 컨트롤의 언어는 브라우저/운영체제 설정을 따릅니다.
