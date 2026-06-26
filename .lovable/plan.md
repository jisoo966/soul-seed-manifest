목업 기준으로 sisi 앱을 여우 동반자 컨셉의 4탭 구조로 전면 개편합니다. 여우 일러스트는 자리(placeholder)만 만들고, 업로드 후 교체합니다.

## 새 IA (탭 4개)

```
Journey       — 매일 산책/홈, 오늘의 풍경 + 한 줄
Postcards     — 멈춘 순간 캡처 → 카드로 수집
Messages      — 여우가 보내는 짧은 편지
My Stars      — 따라가는 별(목표/방향) 관리
```

PhoneFrame 하단 탭바를 위 4개로 교체.

## 라우트 변경

```
src/routes/
  index.tsx             → Journey (홈: "Good evening, [name]" + 풍경 + "Today you felt …" 카드 + 일러스트 자리)
  postcards.tsx         → 새로 (수집된 카드 그리드 + "+ new memory")
  postcards.$id.tsx     → 새로 (카드 상세: 우표, 우표 글, 별 태그)
  messages.tsx          → 새로 (도착한 메시지 리스트 / 메시지 상세)
  stars.tsx             → 새로 (My Stars 미니맵 + 별 리스트)
  stars.$id.tsx         → 새로 (별 상세: First noticed, Mentioned, Related postcards)
  capture.tsx           → 새로 (모달형: "The fox stopped. Shall we keep this moment?" + 카메라 + Save)
  onboarding.tsx        → 수정 (스플래시 → "Before we start, what are you hoping for?" → 별 선택 → 이름 → 완료)

삭제: collect.tsx, correspondence.tsx, constellations.tsx, profile.tsx
```

## 디자인 토큰 (styles.css)

- 배경: 따뜻한 크림 `oklch(0.97 0.012 85)`
- 보조: 라벤더/세이지 액센트 `oklch(0.62 0.14 285)` (별·CTA)
- 텍스트: 짙은 잉크 유지
- serif는 유지(현재 톤이 목업과 비슷). 본문은 sans 살짝 둥글게.
- 카드/풍경 컨테이너: 둥근 모서리 `rounded-[1.25rem]`, 부드러운 경계.

## 여우/풍경 이미지

`src/assets/fox/` 폴더 생성. 각 화면별 placeholder div (수채화 톤 그라데이션 배경 + "fox illustration goes here" 텍스트). 사용자가 업로드 후 import 경로만 교체하면 되도록 명확한 슬롯 컴포넌트 `<FoxScene name="home" />`로 추상화.

## 온보딩 흐름

1. sisi 스플래시 ("a journey with your inner companion")
2. "Before we start, what are you hoping for?" — 칩 선택 (To feel at home / To trust myself / To create more / To feel loved / Something else) → 첫 별로 저장
3. "Let's follow that one." → Start our journey
4. "How should I call you?" (기존 유지)
5. Journey 홈 진입

## 핵심 컴포넌트

- `PhoneFrame` 탭바 4개로 갱신 + 아이콘(lucide: MapPin, Mail-square, Mail, Star)
- `FoxScene` — 일러스트 슬롯
- `PostcardThumb`, `StarChip`, `MessageEnvelope`
- `Composer` — "Write here…" + 보내기 버튼 (Postcards 작성, Messages 답장 공용)

## 범위 밖

- 실제 메시지 자동 생성/AI 로직 (정적 mock data로)
- 데이터 영속화 (localStorage만; 별/카드 mock 배열)
- 별 도달(타임라인) 애니메이션은 정적 SVG로

작업량이 크니 이대로 한 번에 갈지, 아니면 (1) IA + Journey 홈 + 온보딩 먼저, (2) Postcards/Messages/My Stars 다음 턴 — 식으로 나눌지 알려주세요.