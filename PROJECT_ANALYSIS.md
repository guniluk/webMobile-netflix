# MERN Netflix Clone & Mobile App 프로젝트 분석 보고서

이 보고서는 MERN (MongoDB, Express, React, Node.js) 스택 기반의 웹 서비스와 Expo (React Native, TypeScript) 기반의 모바일 앱으로 구성되어 최종 완료된 Netflix Clone 프로젝트의 전체 소스 코드 분석 및 웹/모바일 멀티 클라이언트와 백엔드 간의 연동 결과를 정리한 문서입니다.

---

## 1. 프로젝트 개요 (Overview)

본 프로젝트는 **Netflix Clone**을 완벽하게 재현하기 위해 웹, 모바일, 그리고 통합 백엔드 API를 밀접하게 설계한 풀스택 애플리케이션 서비스입니다.

- **백엔드**: Node.js, Express, MongoDB(Mongoose)를 기반으로 구축되었으며, 외부 영화 정보 API인 TMDB(The Movie Database)와 연동하여 영화/TV 쇼 정보를 제공합니다. 웹 클라이언트(쿠키 기반 JWT)와 모바일 클라이언트(Authorization 헤더 기반 JWT)를 동시에 안전하게 지원할 수 있는 하이브리드 인증 구조를 가집니다.
- **웹 프론트엔드**: Vite React(JavaScript) 환경에 Tailwind CSS v4와 daisyUI v5 테마를 적용해 넷플릭스 고유의 세련된 어두운 화면과 부드러운 스크롤 인터랙션을 구현하였고, Zustand를 사용해 전역 상태 및 라우트 보호(Auth Guard)를 제어합니다.
- **모바일 프론트엔드**: Expo (React Native, TypeScript) 및 Expo Router 파일 기반 라우팅을 채택하여 구현되었습니다. 모바일 기기의 상단 노치 영역 침범을 완벽히 비켜가는 Safe Area Insets 설계, 모바일에 맞춘 2열/3열 격자 검색 카드 배치, 그리고 홈화면의 프리미엄 2줄 칩(Chip) 헤더와 유튜브 공식 Iframe 플레이어 컴포넌트가 연동된 고급 영화 감상 UI를 제공합니다.

---

## 2. 기술 스택 (Technology Stack)

### 백엔드 (Backend)

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express (v5.2.1)
- **Database**: MongoDB via Mongoose (v9.6.2)
- **Authentication**: JSON Web Token (JWT v9.0.3), bcryptjs (v3.0.3), cookie-parser (v1.4.7)
- **HTTP Client**: Axios (v1.16.1)
- **Configuration**: Dotenv (v17.4.2)

### 웹 프론트엔드 (Web Frontend)

- **Framework & Builder**: React (v19), Vite (v8)
- **State Management**: Zustand (v5.0.3)
- **Styling**: Tailwind CSS (v4.0.0), daisyUI (v5.5.20)
- **Routing**: React Router DOM (v7.1.5)
- **Icons**: React Icons (v5.4.0)

### 모바일 프론트엔드 (Mobile Frontend)

- **Framework**: Expo SDK 54 (React Native v0.81.5)
- **State Management**: Zustand (v5.0.13) + AsyncStorage (v1.23.1)
- **Routing**: Expo Router (v6.0.23)
- **Video Player**: react-native-youtube-iframe (v2.3.0) + react-native-webview (v13.13.2)
- **Icons**: @expo/vector-icons (Ionicons)
- **Layout Assist**: react-native-safe-area-context (v5.6.0)
- **Language**: TypeScript (v5.9.2)

---

## 3. 디렉토리 및 파일 구조 (Directory Structure)

```text
mern-netflix/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB 연결 설정
│   ├── controllers/
│   │   ├── auth.controller.js  # 로그인, 로그아웃, 회원가입, 세션 확인 (모바일 토큰 반환 기능 추가)
│   │   ├── movie.controller.js # 영화 데이터 조회 (Trending, Category, Trailers 등)
│   │   ├── search.controller.js# 인물, 영화, TV 검색 및 검색 기록 관리
│   │   └── tv.controller.js    # TV 쇼 데이터 조회 (Trending, Category, Trailers 등)
│   ├── middleware/
│   │   └── protectRoute.js     # JWT 토큰 검증 미들웨어 (쿠키 및 Bearer Header 둘 다 검증)
│   ├── models/
│   │   └── user.model.js       # User 및 검색 이력 스키마 (Mongoose)
│   ├── routes/
│   │   ├── auth.route.js       # /api/v1/auth 라우트 정의
│   │   ├── movie.route.js      # /api/v1/movie 라우트 정의
│   │   ├── search.route.js     # /api/v1/search 라우트 정의
│   │   └── tv.route.js         # /api/v1/tv 라우트 정의
│   ├── services/
│   │   └── tmdb.service.js     # TMDB API 호출 서비스 함수
│   ├── utils/
│   │   └── generateToken.js    # JWT 생성 및 쿠키 설정 유틸리티
│   └── server.js               # 백엔드 진입점 (Entry Point)
│   └── .env                    # 환경 변수 설정 파일 (Secrets)
├── frontend/                   # 웹 프론트엔드 소스 코드 폴더
│   ├── public/                 # 아바타 이미지 및 정적 소스
│   ├── src/
│   │   ├── components/         # Navbar, Footer, MovieSlider 컴포넌트
│   │   ├── pages/              # Home, Signup, Login, Search, WatchDetail 페이지
│   │   ├── store/              # Zustand 스토어 (authStore, contentStore)
│   │   └── App.jsx / main.jsx  # 라우트 설정 및 가드, 렌더링 진입점
├── mobile/                     # 모바일 프론트엔드 소스 코드 폴더 [NEW]
│   ├── app/
│   │   ├── (auth)/             # 인증 그룹 (landing, login, signup 스크린)
│   │   ├── (tabs)/             # 메인 탭 그룹 (index, search, history 스크린)
│   │   ├── watch/[id].tsx      # 상세 정보 및 유튜브 예고편 플레이어 스크린
│   │   └── _layout.tsx         # 전역 Stack 내비게이션 설정
│   │   └── index.tsx           # 초기 진입 및 세션 체크 분기 라우터
│   ├── components/
│   │   ├── Avatar.tsx          # 아바타 컴포넌트 (Static URL 보정 및 로그아웃 Alert 연동)
│   │   └── MovieSlider.tsx     # 가로 스크롤 영화 리스트 카드 슬라이더
│   ├── store/
│   │   ├── api.ts              # Expo Go 환경 local PC IP 주소 자동 감지 설정
│   │   ├── authStore.ts        # Zustand + AsyncStorage + Fetch API 인증 스토어
│   │   └── contentStore.ts     # 미디어 콘텐츠 타입 스토어 ('movie' / 'tv')
│   ├── package.json            # 모바일 dependencies 및 expo 스크립트
│   └── tsconfig.json           # TypeScript 빌드 설정
```

---

## 4. 백엔드 구성 요소 및 상세 로직 분석

### 4.1. 서버 엔트리 포인트 (`backend/server.js`)

- Express 앱 초기화 및 미들웨어 세팅 (`express.json()`, `express.urlencoded()`, `cookieParser()`, `cors()`).
- 모든 프론트엔드/모바일 API 요청은 `/api/v1/` prefix 아래로 마운트되어 일관된 라우팅 체계를 따릅니다.

### 4.2. 하이브리드 클라이언트 대응 인증 및 세션 검증

- **`protectRoute.js` 미들웨어 개선**:
  - 기존 웹 클라이언트용 보안 쿠키(`req.cookies['jwt-netflix']`) 뿐만 아니라, 모바일 기기가 HTTP 헤더로 전송하는 Bearer 토큰(`req.headers.authorization`)에서 토큰을 자동 추출하여 통합 검증 및 인가를 수용합니다.
- **`auth.controller.js` 응답 개선**:
  - 회원가입(`signupController`) 및 로그인(`loginController`) 시 쿠키 발급과 동시에 **응답 JSON 본문에 `token` 문자열을 함께 포함하여 반환**합니다. 이를 통해 모바일 앱이 발급받은 토큰을 기기 스토리지에 안정적으로 영구 저장할 수 있게 되었습니다.

---

## 5. 웹 프론트엔드 아키텍처 및 연동 분석

- **Zustand 전역 상태**: `authStore.js`에서 유저 세션을 관리하고 `contentStore.js`를 통해 메인 화면의 미디어 타입('movie' / 'tv') 변경 시 하위 슬라이더의 데이터를 실시간 변경합니다.
- **가드 라우팅**: `App.jsx`에서 로그인 여부에 따라 비인가 접근 차단(Route Guard)을 완벽히 실행하며, 가이드라인에 맞춘 daisyUI의 로딩 스피너 및 세련된 어두운 레이아웃이 연동되어 있습니다.

---

## 6. 모바일 프론트엔드 아키텍처 및 연동 분석 (NEW)

### 6.1. 동적 로컬 IP 감지 기술 (`mobile/store/api.ts`)

- 모바일 기기(실기기 Expo Go 또는 안드로이드 에뮬레이터)에서 `localhost` 주소로 로컬 백엔드 서버에 접속하려고 하면 `Network request failed` 오류가 발생합니다.
- 이를 해결하기 위해 Expo Metro 서버 번들이 로드된 개발자 PC의 로컬 네트워크 IP를 `Constants.expoConfig?.hostUri`에서 실시간 파싱하여 백엔드 Base URL(`http://<PC_IP>:5000`)로 자동 조립하는 동적 IP 감지 모듈을 구현하였습니다. 개발 기기 변경 시 수동 IP 하드코딩이 필요 없습니다.

### 6.2. 모바일 특화 UI/UX 적용

- **2줄(2-Row) 명품 헤더 설계**: 상단 영역이 좁은 모바일 특성을 고려하여 헤더 첫째 줄에 로고와 아바타 프로필을 나란히 배치하고, 둘째 줄에는 `Movies` / `TV Shows` 선택바를 모던한 칩(Chip) 형태로 단독 정렬하여 터치 미스를 방지하고 완성도 높은 화면을 구성했습니다.
- **안전 영역 보호(Safe Area Insets)**: 상세 감상 페이지(`watch/[id].tsx`)에 노치 디자인 및 카메라 펀치홀 영역 침범을 막기 위해 `useSafeAreaInsets`의 탑 인셋 마진 조절을 적용하여 뒤로 가기 버튼과 비디오 영역이 기기 상태표시줄과 절대 겹치지 않게 조절하였습니다.
- **유튜브 공식 플레이어 연동**: `react-native-youtube-iframe`과 `react-native-webview`를 사용하여, TMDB API에서 받아온 예고편 비디오 키값을 통해 안드로이드와 iOS 기기 내부에서 웹뷰 오버헤드나 크래시 없이 안전하게 비디오를 재생합니다.
- **최근 검색 관리**: `History` 화면을 단독 탭으로 분리하고 사용자가 목록을 아래로 끌어당겼을 때 당겨서 새로고침(`RefreshControl`)이 되도록 하였으며, 실시간 삭제 버튼 터치 시 백엔드 DB와 즉각 동기화되게 연동하였습니다.

---

## 7. 완료된 버그 수정 및 환경 개선 사항 (Fixed Issues)

1. **`tmdb.service.js` ReferenceError 해결**: API 비동기 fetch 에러 발생 시 잘못된 `res` 참조 구문을 제거하고 예외를 throw하게 수정하여 백엔드 서버 중단을 완전히 막았습니다.
2. **유저 아바타 Fallback UI 및 static 이미지 주소 보정**: 모바일 앱 내에서 백엔드가 전달한 상대 경로 아바타 주소(`/avatar1.png` 등)를 로컬 PC IP와 매칭하여 실 이미지로 전환하는 로직을 추가하고, 로드 실패 시 유저네임의 첫 글자를 따서 레드 서클 내부 텍스트로 치환하는 Fallback 처리를 적용했습니다.
3. **상태 표시줄 및 노치 영역 침범 수정**: 상세 페이지 로딩 시 상단 유튜브 비디오가 노치 위를 가려 사용을 저해하던 현상을 `useSafeAreaInsets` 동적 마진 수식을 사용해 노치 바로 아래로 화면 전체를 하향 정렬하여 해결하였습니다.
4. **Network request failed 수정**: Expo Go 실기기가 로컬 PC 백엔드를 인식할 수 없던 문제를 Metro IP 자동 파싱 감지 클래스로 완벽하게 보완했습니다.
5. **Lint 경고 및 오류 100% 제거**: 모바일 소스코드 전체에 대해 ESLint 및 Expo Lint 표준을 준수하도록 미사용 변수, React useEffect Hook의 Dependency 리스트를 완벽히 갱신하였습니다.
