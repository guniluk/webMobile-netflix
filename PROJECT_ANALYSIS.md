# MERN Netflix Clone 프로젝트 분석 보고서 (최신 업데이트)

이 보고서는 MERN (MongoDB, Express, React, Node.js) 스택을 기반으로 최종 완료된 Netflix Clone 프로젝트의 전체 소스 코드 분석 및 프론트엔드/백엔드 연동 결과를 정리한 문서입니다.

---

## 1. 프로젝트 개요 (Overview)

본 프로젝트는 **Netflix Clone**을 완벽하게 재현하기 위해 프론트엔드와 백엔드를 밀접하게 결합한 풀스택 웹 애플리케이션입니다.

- **백엔드**: Node.js, Express, MongoDB(Mongoose)를 기반으로 구축되었으며, 외부 영화 정보 API인 TMDB(The Movie Database)와 연동하여 각종 영화/TV 쇼 정보를 제공합니다. JWT 쿠키 검증 미들웨어와 검색 내역 추가/삭제 로직이 구현되어 있습니다.
- **프론트엔드**: Vite React(JavaScript) 환경에 Tailwind CSS v4와 daisyUI v5 테마를 적용해 넷플릭스 고유의 세련된 어두운 화면과 부드러운 스크롤 인터랙션을 구현하였고, Zustand를 사용해 전역 상태 및 라우트 보호(Auth Guard)를 제어합니다.

---

## 2. 기술 스택 (Technology Stack)

### 백엔드 (Backend)

- **Runtime**: Node.js
- **Framework**: Express (v5.2.1)
- **Database**: MongoDB via Mongoose (v9.6.2)
- **Authentication**: JSON Web Token (JWT v9.0.3), bcryptjs (v3.0.3), cookie-parser (v1.4.7)
- **HTTP Client**: Axios (v1.16.1)
- **Configuration**: Dotenv (v17.4.2)

### 프론트엔드 (Frontend)

- **Framework & Builder**: React (v19), Vite (v8)
- **State Management**: Zustand (v5.0.3)
- **Styling**: Tailwind CSS (v4.0.0), daisyUI (v5.5.20)
- **Routing**: React Router DOM (v7.1.5)
- **Icons**: React Icons (v5.4.0)

---

## 3. 디렉토리 및 파일 구조 (Directory Structure)

```text
mern-netflix/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB 연결 설정
│   ├── controllers/
│   │   ├── auth.controller.js  # 로그인, 로그아웃, 회원가입, 세션 확인 비즈니스 로직
│   │   ├── movie.controller.js # 영화 데이터 조회 (Trending, Category, Trailers 등)
│   │   ├── search.controller.js# 인물, 영화, TV 검색 및 검색 기록 관리
│   │   └── tv.controller.js    # TV 쇼 데이터 조회 (Trending, Category, Trailers 등)
│   ├── middleware/
│   │   └── protectRoute.js     # JWT 토큰 검증 및 사용자 인가 미들웨어
│   ├── models/
│   │   └── user.model.js       # User 스키마 및 검색 이력 관리 스키마 (Mongoose)
│   ├── routes/
│   │   ├── auth.route.js       # /api/v1/auth 라우트 정의 (authCheck 추가됨)
│   │   ├── movie.route.js      # /api/v1/movie 라우트 정의
│   │   ├── search.route.js     # /api/v1/search 라우트 정의
│   │   └── tv.route.js         # /api/v1/tv 라우트 정의
│   ├── services/
│   │   └── tmdb.service.js     # TMDB API 호출 서비스 함수 (버그 수정 완료)
│   ├── utils/
│   │   └── generateToken.js    # JWT 생성 및 쿠키 설정 유틸리티
│   └── server.js               # 백엔드 진입점 (Entry Point)
│   └── .env               # 환경 변수 설정 파일 (Secrets)
├── frontend/
│   ├── public/
│   │   ├── favicon.svg         # 사이트 파비콘
│   │   ├── icons.svg           # 공통 벡터 아이콘 어셋
│   │   ├── avatar1~3.png       # 신규 유저용 프로필 아바타 이미지 3종 (추가됨)
│   ├── src/
│   │   ├── assets/             # 정적 이미지 어셋
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # 상단 네비게이션 헤더 (반응형 모바일 서브메뉴, 활성 탭 인디케이터)
│   │   │   ├── Footer.jsx      # 페이지 하단 정보 영역
│   │   │   └── MovieSlider.jsx # 카테고리별 영화/TV쇼 가로 스크롤 카드 슬라이더
│   │   ├── pages/
│   │   │   ├── Home.jsx        # 비인가 랜딩 화면 / 인가 사용자용 영화/TV쇼 메인 보드 화면
│   │   │   ├── Signup.jsx      # 넷플릭스 테마 회원가입 폼
│   │   │   ├── Login.jsx       # 넷플릭스 테마 로그인 폼
│   │   │   ├── Search.jsx      # 영화/TV쇼/인물 통합 검색 및 최근 검색기록 실시간 관리
│   │   │   └── WatchDetail.jsx # 상세 메타데이터 출력, YouTube 예고편 재생, 유사 추천 슬라이더
│   │   ├── store/
│   │   │   ├── authStore.js    # Zustand 인증 전역 스토어 (Signup, Login, Logout, SessionCheck)
│   │   │   └── contentStore.js # Zustand 콘텐츠 종류 스토어 ('movie' <-> 'tv' 토글)
│   │   ├── App.jsx             # React 라우터 조립 및 인증 라우트 가드(Route Guards) 설정
│   │   ├── main.jsx            # React 앱 렌더링 시작점
│   │   ├── index.css           # Tailwind CSS 및 daisyUI 플러그인 로드
│   │   └── App.css             # 기본 스타일 시트 무력화
│   ├── vite.config.js          # 백엔드 Proxy(5000포트) 및 Tailwind 컴파일 환경 설정
│   └── package.json            # 프론트엔드 의존성 및 스크립트
├── PROJECT_ANALYSIS.md         # 프로젝트 전체 소스 코드 분석 결과 보고서 (본 문서)
└── GEMINI.md                   # 프로젝트 관리 가이드
```

---

## 4. 백엔드 구성 요소 및 상세 로직 분석

### 4.1. 서버 엔트리 포인트 (`backend/server.js`)

- Express 앱 초기화 및 필요한 미들웨어 설정 (`express.json()`, `express.urlencoded()`, `cookieParser()`, `cors()`).
- API 버저닝 라우팅 설정 (`/api/v1/auth`, `/api/v1/movie`, `/api/v1/tv`, `/api/v1/search`).
- `/api` prefix를 가진 모든 프론트엔드 요청은 `vite.config.js` 프록시를 통해 백엔드(5000포트)로 전달되어 세션 쿠키를 안정적으로 유지 및 전송합니다.

### 4.2. 사용자 인증 로직 및 세션 검증

- **회원가입 (`signupController`)**:
  - 비밀번호 단방향 해싱(`bcryptjs`), 임의의 기본 아바타 설정(avatar1~3.png) 및 JWT 생성 후 보안 쿠키 설정.
- **로그인 & 로그아웃 (`loginController`, `logoutController`)**:
  - 이메일 및 비밀번호 검증 후 쿠키 부여, 로그아웃 시 `clearCookie`로 세션 만료.
- **세션 체크 API (`authCheckController`) - [NEW]**:
  - `GET /api/v1/auth/authCheck` 경로가 신설되어, 클라이언트가 마운트될 때마다 토큰 유효성을 판별하고 사용자 정보(`user`)를 프론트엔드에 즉각 전달합니다.

### 4.3. 콘텐츠 조회 및 검색 엔진

- **콘텐츠 조회 (`movie.controller.js`, `tv.controller.js`)**:
  - `GET /trending`: 대표 예고편 배너를 위한 랜덤 Trending 작 1건 조회.
  - `GET /:id/trailers`: YouTube 전용 예고편(Teaser, Trailer)을 필터링하여 리턴.
  - `GET /:id/details` & `GET /:id/similar`: 장르/평점 메타데이터 및 유사 추천 데이터 제공.
- **검색 및 이력 (`search.controller.js`)**:
  - 영화, TV쇼, 인물(People)을 검색하고, 성공 시 사용자의 `searchHistory` 데이터베이스 컬렉션에 이력을 `$push`로 자동 기록합니다.
  - `GET /history` 및 `DELETE /history/:id`를 통해 사용자별 최근 이력을 확인하고 개별 삭제하는 API가 완전히 구동됩니다.

---

## 5. 프론트엔드 아키텍처 및 연동 분석

### 5.1. 전역 상태 관리 (Zustand Stores)

- **`authStore.js`**: `user`, `isSigningUp`, `isLoggingIn`, `isCheckingAuth` 상태를 유지하며 `signup()`, `login()`, `logout()`, `authCheck()` 함수를 통해 API 응답 데이터를 가공 및 동기화합니다.
- **`contentStore.js`**: 글로벌 네비게이션바의 토글에 따라 현재 홈 대시보드가 보여줄 데이터 타입(`movie` 또는 `tv`)을 `contentType` 상태로 전역 제어합니다.

### 5.2. 라우터 조립 및 인증 방어벽 (Route Guards)

- [App.jsx](file:///Users/guniluk/Desktop/CODING/mern-netflix/frontend/src/App.jsx)에서는 사용자가 로그인 세션을 가지고 있는지 판별합니다.
  - 로그인 상태가 아닐 시 `WatchDetail`(`/watch/:id`) 및 `Search`(`/search`) 진입을 차단하고 `/login`으로 강제 리다이렉트합니다.
  - 로그인 상태일 시 `/login` 및 `/signup` 페이지에 직접 주소를 치고 가도 홈 화면(`/`)으로 우회(replace Navigate)시킵니다.

### 5.3. 주요 연동 뷰(Views)의 구현 상세

- **`Home.jsx`**: 미로그인 시에는 영화 재생 유도를 위한 광고성 랜딩 페이지를 표시하며, 로그인하면 상단 탑배너에서 YouTube 예고편 바로가기가 가능한 재생/상세 버튼과 하위 카테고리별 무한 슬라이더 리스트를 동적 렌더링합니다.
- **`WatchDetail.jsx`**: 전달된 `id`를 기반으로 YouTube 트레일러 영상을 iframe 플레이어로 재생합니다. 예고편 영상이 여러 개일 경우 이전/다음 버튼으로 즉시 비디오 변경이 가능하며, 하단에는 추천작 가로 슬라이더가 통합됩니다.
- **`Search.jsx`**: 검색 탭(영화, TV, 인물) 선택에 맞는 카드를 그리고 하단에는 사용자의 실시간 검색 이력 카드 리스트가 표출되며, 쓰레기통 아이콘 클릭 시 백엔드 DB에서 실시간 삭제 연동됩니다.

---

## 6. 완료된 버그 수정 및 환경 개선 사항 (Fixed Issues)

1. **`tmdb.service.js` ReferenceError 해결**
   - TMDB API 비동기 fetch 실패 시 호출할 수 없었던 컨트롤러의 `res` 참조 구문을 제거하고 `throw new Error` 방식으로 변경해 백엔드 서버 크래시를 완전히 방어했습니다.

2. **유저 아바타 엑스박스(broken image) 방어 및 Fallback UI 적용**
   - 가입 시 무작위 배정되던 `/avatar1.png`, `/avatar2.png`, `/avatar3.png` 파일이 `public/` 내에 누락되어 발생하던 이미지 깨짐 현상을 해결하기 위해 AI 디자인을 반영한 **아바타 파일 3종을 생성 및 이동**시켰습니다.
   - 혹시라도 프로필 이미지가 로드 실패할 때를 대비해 [Navbar.jsx](file:///Users/guniluk/Desktop/CODING/mern-netflix/frontend/src/components/Navbar.jsx)에서 `onError`를 받아 사용자 이름의 첫 글자를 넷플릭스 레드 색상의 원안에 텍스트 플레이스홀더로 세련되게 채워주는 **안전한 Fallback UI**를 추가 구현했습니다.

3. **네비게이션바 활성 탭 버그 해결**
   - 검색 화면(`/search`)에 들어갔을 때 상단 네비게이션 탭 중 "TV Shows" 등에 붉은 밑줄이 오표시되던 이슈를 `react-router-dom`의 `useLocation`과 연계하여 현재 URL 경로가 `/`일 때와 `/search`일 때를 독립 판별하여 빨간 줄이 올바른 탭에 렌더링되도록 수정했습니다.

4. **antigravity CLI 환경 설정 구성**
   - 전역 쉘에서 `antigravity` 명령어가 정상 동작하지 않던 환경 변수 alias 오류를 해결하였습니다.
   - 실제 CLI 구동 바이너리인 `/Users/guniluk/.local/bin/agy`와 전역 실행 파일 디렉토리 간에 **심볼릭 링크**를 등록하였고, [.zshrc](file:///Users/guniluk/.zshrc)의 별칭 선언 경로를 올바르게 패치하여 모든 곳에서 `antigravity` 명령어를 사용할 수 있게 조치했습니다.
