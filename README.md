# 🎬 MERN Netflix Clone & Mobile App 풀스택 프로젝트 가이드

이 프로젝트는 **MongoDB, Express, React, Node.js (MERN)** 스택으로 이루어진 넷플릭스 클론 웹 서비스와, 동일한 백엔드 API를 공유하며 구동되는 **Expo (React Native, TypeScript) 기반 모바일 앱**이 통합된 크로스 플랫폼 풀스택 프로젝트입니다.

하나의 통합 백엔드가 브라우저(쿠키 세션) 및 모바일 기기(Bearer 헤더 토큰) 요청에 동시에 유연하게 응답하도록 최적화되어 있습니다.

---

## 📂 1. 디렉토리 구조 (Directory Structure)

*   `backend/`: Express 서버 API 소스 폴더 (Node.js ESM)
    *   `package.json`: 백엔드 의존성 및 통합 개발 실행 스크립트 정의
    *   `server.js`: 서버 진입점
    *   `.env`: 서버 환경변수 설정 파일
*   `frontend/`: React + Vite + Zustand + Tailwind CSS 웹 프론트엔드 소스 폴더
    *   `package.json`: 웹 프론트엔드 의존성 정의
*   `mobile/`: Expo SDK 54 + TypeScript + Expo Router + Zustand 모바일 프론트엔드 소스 폴더
    *   `package.json`: 모바일 앱 의존성 정의

---

## ⚙️ 2. 사전 준비 사항 (Prerequisites)

1.  **Node.js 설치**: LTS 버전 권장 (v18+)
2.  **MongoDB Database**: MongoDB Atlas 계정 및 Connection URI 문자열 필요
3.  **TMDB API Key**: 영화 정보를 가져오기 위해 [The Movie Database (TMDB)](https://www.themoviedb.org/) 개발자 계정 가입 후 API Read Access Token 또는 API Key 발급이 필수적입니다.

---

## 🚀 3. 백엔드(Server) 설정 및 실행 방법

백엔드 관련 설정 파일과 `package.json`은 `backend/` 디렉토리 내에 위치해 있습니다.

### 1) 환경 변수 설정
`backend/` 폴더 아래에 `.env` 파일을 생성하거나 수정하고 아래 항목들을 입력합니다.

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/netflix_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
TMDB_API_KEY=your_tmdb_api_key_here
NODE_ENV=development
```

### 2) 의존성 설치 및 백엔드 실행
터미널을 열고 `backend/` 디렉토리로 이동하여 실행합니다.

```bash
# 1. 백엔드 폴더로 이동
cd backend

# 2. 백엔드 의존성 설치
npm install

# 3. 백엔드 서버 및 웹 프론트엔드 동시 실행 (권장)
npm run dev

# 4. 백엔드 서버만 단독 실행할 경우
npm run dev:backend
```
*   서버는 기본적으로 **3000** 포트에서 대기합니다.
*   정상 구동 시 `Server running on port 3000` 및 `MongoDB connected` 메시지가 출력됩니다.
*   `npm run dev` 스크립트를 사용하면 백엔드 서버(`3000` 포트)와 웹 프론트엔드(`5173` 포트)가 동시에 실행되어 테스트하기 쉽습니다.

---

## 💻 4. 웹 프론트엔드 (Web) 설정 및 실행 방법

웹 클라이언트는 Vite의 프록시 설정을 통해 백엔드(3000포트)와 내부 통신하며 쿠키 기반 JWT 인증 체계를 사용합니다.

### 1) 의존성 설치 및 실행
터미널을 열고 `frontend/` 디렉토리로 이동하여 실행합니다.

```bash
# 1. 웹 프론트엔드 폴더로 이동
cd frontend

# 2. 웹 의존성 설치
npm install

# 3. 웹 프론트엔드 단독 실행
npm run dev
```
*   웹 화면은 브라우저에서 `http://localhost:5173`으로 접속하여 테스트할 수 있습니다.
*   (참고) 백엔드 폴더(`backend/`) 안에서 `npm run dev:frontend` 명령어를 입력해 프론트엔드를 실행할 수도 있습니다.

---

## 📱 5. 모바일 프론트엔드 (Mobile) 설정 및 실행 방법

모바일 앱은 Expo SDK 54와 Expo Router로 구현되었으며, 로컬 PC에서 작동 중인 백엔드(3000포트)와 통신하기 위해 **동적 로컬 IP 자동 감지 모듈**이 내장되어 있습니다.

### 1) 모바일 의존성 설치
터미널을 열고 `mobile/` 디렉토리로 이동하여 패키지를 설치합니다.

```bash
# 1. 모바일 폴더로 이동
cd mobile

# 2. 모바일 의존성 설치
npm install
```

### 2) Expo 개발 서버 (Metro Bundler) 시작
```bash
# Expo 개발 서버 실행
npm start
# 또는
npx expo start
```
Metro 번들러가 터미널에 큰 QR 코드와 함께 나타납니다.

### 3) 에뮬레이터 또는 실기기(Expo Go) 구동 방법

*   **iOS 시뮬레이터 (Mac 전용)**: Metro 실행 상태에서 키보드 `i`를 누르거나 `npm run ios`를 실행합니다.
*   **Android 에뮬레이터**: Metro 실행 상태에서 키보드 `a`를 누르거나 `npm run android`를 실행합니다.
*   **실제 모바일 기기 (Expo Go)**:
    1.  스마트폰 기기(iPhone/Android)에 **Expo Go** 앱을 마켓에서 설치합니다.
    2.  스마트폰이 **개발자 PC와 동일한 Wi-Fi 네트워크**에 연결되어 있어야 합니다.
    3.  **Android**: Expo Go 앱을 켜고 터미널의 QR 코드를 스캔합니다.
    4.  **iOS**: 기본 카메라 앱으로 QR 코드를 스캔한 후 Expo Go 앱에서 열기를 터치합니다.

### 🔌 로컬 네트워크 및 에뮬레이터 통신 원리
모바일 기기에서는 `localhost` 주소로 PC의 백엔드에 접근할 수 없습니다. 이 프로젝트는 **`Constants.expoConfig?.hostUri`**를 활용해 Metro 번들러 서버가 구동 중인 PC의 로컬 네트워크 IP를 자동으로 추출한 뒤, `http://<PC_IP>:3000` 주소를 빌드하도록 코드가 보완되어 있습니다.
따라서, 별도의 코드 수정 없이 Expo Go와 PC의 백엔드 서버가 자동으로 완벽하게 연동됩니다.

---

## ✨ 6. 핵심 제공 기능 및 상세 화면 안내

### 🔑 1) 로그인 및 자동 로그인
*   **웹 (Web)**: 쿠키 기반 JWT 세션 유지를 통해 새로고침 후에도 로그인 상태를 안전하게 이어갑니다.
*   **모바일 (Mobile)**: 기기 로컬 스토리지(`AsyncStorage`)에 JWT 토큰을 영구 저장하고, 모든 API 요청 헤더(`Authorization: Bearer <token>`)에 주입하여 원활한 자동 로그인 경험을 보장합니다.

### 🏠 2) 홈 화면 (Home)
*   TMDB API 연동을 기반으로 오늘의 실시간 트렌딩 영화/TV 배너와 유튜브 예고편 상세 보기 제공
*   가로 스크롤 가능한 카드 슬라이더로 카테고리별 다채로운 영화 및 TV쇼 목록 전시
*   모바일 환경에 맞춰 재설계된 아바타 프로필 레이아웃 및 칩(Chip) 형태의 장르/카테고리 선택 필터

### 🔍 3) 검색 화면 (Search) & 상태 보존 제어
*   영화(Movies), TV쇼(TV Shows), 인물(People) 탭 기반 독립형 검색 지원
*   **검색 리스트 이미지 필터링**: 영화, TV쇼 포스터나 인물 프로필 사진(`poster_path`, `profile_path`)이 누락되어 플레이스홀더로 표시되는 불완전한 항목을 백엔드 단에서 사전에 필터링하여 온전한 리스트만 깨끗하게 출력합니다.
*   **뒤로 가기 상태 유지**: 상세 정보 화면(콘텐츠 상세, 인물 프로필)을 조회했다가 뒤로 가기(Back) 버튼이나 브라우저 뒤로 가기로 돌아오는 경우에만 **이전 검색 결과 목록**이 화면에 고스란히 복구됩니다. (웹의 경우 Zustand `searchStore`를 구축하여 처리하고, 모바일은 Stack Navigation으로 상태를 보존합니다.)
*   **검색창 입력 텍스트 자동 비움**: 상세 화면으로 전환되는 즉시 검색 입력창의 텍스트는 자동으로 초기화(clear)되어 세련된 사용자 경험을 유도합니다.
*   **네비게이션/탭 전환 시 전체 초기화**: 검색 화면 내부의 탭(영화/TV/인물)을 바꾸거나 Navbar 메뉴(Home, Movies 등)를 눌러서 화면을 나갈 때는 검색 상태(검색어, 검색 결과 리스트)가 완전히 초기화되어 항상 깔끔한 검색 첫 화면을 유지하도록 제어합니다. (모바일의 경우 하단 탭바에서 Search 탭을 재터치할 때 상태를 리셋하는 리스너를 달았습니다.)

### 👤 4) 인물 프로필 & 구글 검색결과 연동 (Person Profile)
*   검색 화면에서 인물 카드를 클릭하면 상세 프로필 페이지(웹: `PersonProfile.jsx`, 모바일: `[name].tsx`)로 이동합니다.
*   **일관된 이미지 표시**: 이전 검색 화면에서 노출되었던 고품질 TMDB 이미지 정보를 그대로 파라미터/상태(state)로 인계받아 프로필 이미지로 일관되게 표시합니다.
*   **Wikipedia 연동 인물 프로필**: 백엔드에서 DuckDuckGo Instant Answer API를 호출하여 Wikipedia 기반의 설명 글(Abstract)과 원본 위키 백과로 이동하는 출처 링크를 제공합니다.
*   **구글 스타일 검색결과 뷰**: 구글 검색과 유사한 디자인 카드를 구현하여, 해당 인물과 연관된 정보 및 관련 웹 링크(Related Links)와 요약(Snippet) 목록을 나열하며, 즉시 이동할 수 있는 구글 검색 외부 링크를 연동했습니다. (모바일의 경우 외부 브라우저 `Linking`을 사용)

### 📜 5) 최근 검색 기록 (History)
*   사용자별로 최근 검색한 기록 카드 목록 제공
*   **중복 검색 방지**: 동일한 키워드나 항목을 중복해서 검색하는 경우, 데이터베이스 저장 시점에 기존 중복 이력을 지우고(`$pull`) 최신 이력만 추가(`$push`)하여 중복을 원천 차단하며, API 조회 시점에도 Set 객체로 유니크하게 정렬하여 한 항목만 출력되도록 처리했습니다.
*   모바일 탭에서 당겨서 새로고침(Pull-to-refresh) 지원 및 휴지통 버튼 터치 시 DB와 즉각 동기화되어 실시간 삭제 처리

### 🎬 6) 콘텐츠 정보 및 예고편 (Watch Detail)
*   노치/상태표시줄 침범 방지 Safe Area 탑 인셋 마진 연동
*   공식 유튜브 API 플레이어(`react-native-youtube-iframe`)를 사용한 안전하고 쾌적한 비디오 스트리밍
*   **UI/UX 레이아웃 개선**: 비디오 플레이어 컨테이너와 상세 텍스트 정보 사이의 간격을 늘려 여백의 미를 살리고 시각적 답답함을 해소했으며, 가로 배치(`md:`) 시 포스터 이미지와 상세 글의 세로축 중심을 수평선상으로 맞춰주는 가운데 정렬(`items-center`)을 보완했습니다.
*   유사한 장르의 관련 미디어 슬라이더 추천 목록 제공
*   우측 상단 아바타 프로필 클릭 시 즉각적인 로그아웃(Confirm Alert) 제공
