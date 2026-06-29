# 🎬 MERN Netflix Clone & Mobile App 풀스택 프로젝트 가이드

이 프로젝트는 **MongoDB, Express, React, Node.js (MERN)** 스택으로 이루어진 넷플릭스 클론 웹 서비스와, 동일한 백엔드 API를 공유하며 구동되는 **Expo (React Native, TypeScript) 기반 모바일 앱**이 통합된 크로스 플랫폼 풀스택 프로젝트입니다.

하나의 통합 백엔드가 브라우저(쿠키 세션) 및 모바일 기기(Bearer 헤더 토큰) 요청에 동시에 유연하게 응답하도록 최적화되어 있습니다.

---

## 📂 1. 디렉토리 구조 (Directory Structure)

*   `backend/`: Express 서버 API 소스 폴더
*   `frontend/`: React + Vite + Tailwind CSS 웹 프론트엔드 소스 폴더
*   `mobile/`: Expo SDK 54 + TypeScript + Expo Router 모바일 프론트엔드 소스 폴더
*   `package.json` (루트): 백엔드 의존성 관리 및 웹/서버 동시 실행 스크립트 정의

---

## ⚙️ 2. 사전 준비 사항 (Prerequisites)

1.  **Node.js 설치**: LTS 버전 권장 (v18+)
2.  **MongoDB Database**: MongoDB Atlas 계정 및 Connection URI 문자열 필요
3.  **TMDB API Key**: 영화 정보를 가져오기 위해 [The Movie Database (TMDB)](https://www.themoviedb.org/) 개발자 계정 가입 후 API Read Access Token 또는 API Key 발급이 필수적입니다.

---

## 🚀 3. 백엔드 설정 및 실행 방법

### 1) 환경 변수 설정
`backend/` 폴더 아래에 `.env` 파일을 생성하거나 수정하고 아래 항목들을 입력합니다.

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/netflix_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
TMDB_API_KEY=your_tmdb_api_key_here
NODE_ENV=development
```

### 2) 의존성 설치 및 백엔드 실행
프로젝트 루트 폴더(루트 경로)에서 터미널을 열고 실행합니다.

```bash
# 1. 백엔드 및 공통 의존성 설치 (루트 경로에서 실행)
npm install

# 2. 백엔드 서버 단독 실행
npm run dev:backend
```
*   서버는 기본적으로 **5000** 포트에서 대기합니다.
*   정상 구동 시 `Server running on port 5000` 및 `MongoDB connected` 메시지가 출력됩니다.

---

## 💻 4. 웹 프론트엔드 (Web) 설정 및 실행 방법

웹 클라이언트는 Vite의 프록시 설정을 통해 백엔드(5000포트)와 내부 통신하며 쿠키 기반 JWT 인증 체계를 사용합니다.

```bash
# 1. 웹 프론트엔드 단독 실행 (루트 경로에서 실행)
npm run dev:frontend

# 2. (선택사항) 백엔드와 웹 프론트엔드 동시 실행
npm run dev
```
*   브라우저에서 `http://localhost:5173`으로 접속하여 웹 화면을 테스트할 수 있습니다.

---

## 📱 5. 모바일 프론트엔드 (Mobile) 설정 및 실행 방법

모바일 앱은 Expo SDK 54와 Expo Router로 구현되었으며, 로컬 PC에서 작동 중인 백엔드(5000포트)와 통신하기 위해 **동적 로컬 IP 자동 감지 모듈**이 내장되어 있습니다.

### 1) 모바일 의존성 설치
`mobile/` 폴더로 이동하여 패키지를 설치합니다.

```bash
cd mobile
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
모바일 기기에서는 `localhost` 주소로 PC의 백엔드에 접근할 수 없습니다. 이 프로젝트는 **`Constants.expoConfig?.hostUri`**를 활용해 Metro 번들러 서버가 구동 중인 PC의 로컬 네트워크 IP를 자동으로 추출한 뒤, `http://<PC_IP>:5000` 주소를 빌드하도록 코드가 보완되어 있습니다.
따라서, 별도의 코드 수정 없이 Expo Go와 PC의 백엔드 서버가 자동으로 완벽하게 연동됩니다.

---

## ✨ 6. 핵심 제공 기능 및 상세 화면 안내

1.  **로그인 및 자동 로그인**:
    *   웹: 쿠키 기반 JWT 세션 유지
    *   모바일: 기기 스토리지(`AsyncStorage`)에 JWT 토큰을 저장하고 API 호출 시 헤더(`Authorization: Bearer <token>`)로 전송하여 자동 로그인 유지
2.  **홈 화면 (Home)**:
    *   TMDB API를 활용한 오늘의 실시간 트렌딩 영화/TV 배너 노출 및 유튜브 예고편 상세 보기 연동
    *   카테고리별 영화 및 TV쇼 가로 스크롤 카드 슬라이더
    *   모바일에 최적화된 로고 & 아바타 프로필 레이아웃 및 칩(Chip) 형태의 세련된 선택 바
3.  **검색 화면 (Search)**:
    *   영화, TV쇼, 인물(People) 탭 전환 검색 지원
    *   검색 시 실시간으로 최근 검색 이력이 백엔드 DB에 영구 기록
4.  **최근 검색 기록 (History)**:
    *   사용자별로 최근 검색한 기록 카드 목록 조회
    *   모바일 탭에서 당겨서 새로고침(Pull-to-refresh) 지원 및 휴지통 버튼 터치 시 DB와 즉각 동기화되어 삭제 처리
5.  **콘텐츠 정보 및 예고편 (Watch Detail)**:
    *   노치/상태표시줄 침범 방지 Safe Area 탑 인셋 마진 연동
    *   공식 유튜브 API 플레이어(`react-native-youtube-iframe`)를 사용한 안전하고 쾌적한 비디오 스트리밍
    *   유사한 장르의 관련 미디어 슬라이더 추천 목록 제공
    *   우측 상단 아바타 프로필 클릭 시 즉각적인 로그아웃(Confirm Alert) 제공
