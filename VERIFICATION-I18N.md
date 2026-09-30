# 한국어·일본어 공개 사이트 검증

검증일: 2026-09-30 (UTC). 구현 커밋: c503606c574983f1c3d25458e283e3d78e2f2cf9.
GitHub Pages Actions run 36650823051: success.

## 구현

변경: index.html, app.js, qr.html, demo-shop.html, README.md.
추가: i18n.js, audio.js, themes.css, demo-shop.js, assets/qr-ko.svg, assets/qr-ja.svg, 본 문서.

기존 shops.js, Supabase 프로젝트/테이블/RLS, shop_id, 외부 링크 목적지, MP3 원본 데이터는 유지했다. UI 문자열은 i18n.js의 ko/ja 사전, 일본어 업체 설명은 같은 shop_id의 shopTranslations에서 관리한다. 작성된 리뷰와 상호명은 원문 그대로 표시한다. 추가 유료 API나 서버를 도입하지 않았다.

## 공개 사이트에서 통과한 항목

- 기본 한국어, 상단 언어 버튼, 즉시 일본어 문구 및 theme-ja 적용, 한국어 복귀.
- localStorage 유지 및 URL lang 우선순위, 새로고침/재방문, ?lang=ja 직접 접속.
- 언어 변경 시 document의 performance.timeOrigin이 같음: 페이지 재로드 없음.
- 3개 카테고리 각 2개 업체 목록. 상세 패널에서 설명/주소/메뉴의 일본어 표시.
- 상세 패널에서 언어를 바꿔도 입력 중인 후기와 선택한 별점 유지.
- 360/390/412px Chromium 뷰포트: 가로 넘침 없음, Bottom Sheet 하단 정렬, 후기 입력 정상.
- 일본어 미입력 오류 안내, 실제 저장 전 바우처 비활성.
- 한국어·일본어 QR SVG 표시 및 정확한 언어별 링크.
- 가상 업체 소개 페이지 일본어 표시, 기존 일본어 음성 재생 (44.032초).
- 정상 이용 흐름에서 JavaScript 예외 및 콘솔 오류 0건.

## 두 독립 브라우저 세션의 실제 리뷰 저장·수신

A: PC Chromium, 한국어. B: 별도 BrowserContext, 터치/모바일 390×844, 일본어.
두 세션 모두 dessert-01 상세 패널의 Supabase Realtime 연결 완료 후 검증했다.

| 방향 | 입력 원문 | DB 리뷰 ID | 반대쪽 자동 갱신 |
|---|---|---|---|
| A → B | [다국어 검증 1790728458741] 한국어로 남긴 후기 원문입니다. | 97f656a2-0de6-4144-8793-29975ae44dd3 | ★ 平均 4.5 · クチコミ4件 |
| B → A | [多言語テスト 1790728458741] 日本語で書いたクチコミです。 | e5409f01-79cd-4c34-8576-501c6c00a63a | ★ 평균 4.4 · 후기 5개 |

등록 전 3개/평균4.3 → 별점5 등록 후 4개/4.5 → 별점4 등록 후 5개/4.4.
두 방향 모두 새로고침 없이 원문이 표시되었으며 Supabase SQL 조회로 실제 저장된 두 행을 별도로 확인했다. 브라우저 WebSocket 수신과 페이지 timeOrigin 유지도 확인했다. 검증 리뷰는 표시된 접두어로 구별할 수 있다.

저장 성공 세션만 바우처 활성화, 다른 세션은 자신의 후기 등록 전까지 잠김. 언어 변경 후에도 활성 상태 유지, 일본어 이용 처리 버튼은 `利用済み`로 변경됨.

## 보안 유지 확인

shops/reviews RLS=true. anon 정책은 shops SELECT, reviews SELECT/INSERT뿐이며 UPDATE/DELETE 정책이 없다. 기존 reviews의 supabase_realtime publication 유지. 프론트엔드는 기존 publishable key만 사용한다. 이번 작업은 DB 스키마나 정책을 변경하지 않았다.

## 테스트 범위의 한계

PC Chromium 및 모바일 뷰포트/터치 에뮬레이션을 사용했다. Galaxy 실기기 Samsung Internet 및 iPhone 실기기 Safari에서 직접 실행한 결과는 아니다. 브라우저 기본 오디오 컨트롤은 운영체제/브라우저 언어를 따른다.

일본어: https://minteset0-afk.github.io/musubu-tour-demo/?lang=ja
한국어: https://minteset0-afk.github.io/musubu-tour-demo/?lang=ko
발표용 QR: https://minteset0-afk.github.io/musubu-tour-demo/qr.html?lang=ja
