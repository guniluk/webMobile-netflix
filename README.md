# 🎬 MERN Netflix Clone & Mobile App (Cross-Platform Fullstack)

이 프로젝트는 **MongoDB, Express, React, Node.js (MERN)** 기반의 웹 넷플릭스 클론 서비스와 **Expo (React Native, TypeScript)** 기반의 크로스 플랫폼 모바일 앱을 아우르는 **풀스택 통합 프로젝트**입니다. 

단일 백엔드 API 서버를 통해 **웹 브라우저(쿠키 세션 JWT)**와 **모바일 앱(Bearer 토큰)** 양쪽 클라이언트의 요청을 동시에 유연하고 안전하게 처리하도록 설계되어 있습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

### Backend
- **Runtime & Framework**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), `bcryptjs`
- **Data Source**: TMDB API (The Movie Database), DuckDuckGo Instant Answer API (Wikipedia Profile)

### Web Frontend (`frontend/`)
- **Framework**: React (Vite)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API (Vite Proxy config)

### Mobile Frontend (`mobile/`)
- **Framework**: Expo (React Native, TypeScript, SDK 54)
- **Navigation**: Expo Router (File-based Routing)
- **State Management**: Zustand + AsyncStorage (토큰 및 상태 영구 저장)
- **Styling**: Vanilla React Native StyleSheet
- **Media**: `react-native-youtube-iframe` (유튜브 트레일러 스트리밍)

---

## 📂 프로젝트 구조 (Directory Structure)

```
project/
 ├─ backend/             # Express API 서버 소스 코드 (ESM)
 │   ├─ config/          # DB 및 환경설정
 │   ├─ controllers/     # API 비즈니스 로직 (Auth, Movie, TV, Search)
 │   ├─ models/          # MongoDB 스키마 (User)
 │   ├─ routes/          # API 엔드포인트 정의
 │   └─ server.js        # 백엔드 진입점
 ├─ frontend/            # React Web 클라이언트 코드
 │   ├─ src/             # 웹 소스 코드 (pages, components, store)
 │   └─ vite.config.js   # 프록시 설정 포함 Vite 설정
 └─ mobile/              # Expo React Native 모바일 앱 코드
     ├─ app/             # Expo Router 스크린 구조 (person, watch, tabs 등)
     ├─ assets/          # 앱 아이콘 및 스플래시 이미지 자산
     ├─ store/           # Zustand 상태 저장소 & API 설정
     └─ app.json         # Expo 메타데이터 설정
```

---

## 🚀 빠른 시작 가이드 (Quick Start)

### 1. 환경 변수 설정
`backend/` 디렉토리 내에 `.env` 파일을 생성하고 아래 양식에 맞추어 변수를 설정합니다.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
TMDB_API_KEY=your_tmdb_api_key
NODE_ENV=development
```

### 2. 백엔드 & 웹 서버 동시 구동
프로젝트 **루트 디렉토리**에서 다음 명령어로 백엔드와 웹 프론트엔드를 동시에 실행할 수 있습니다.
```bash
# 1. 루트 디렉토리에서 패키지 설치
npm install

# 2. 백엔드(Port 5000) & 웹 프론트엔드(Port 5173) 동시 실행
npm run dev
```
- 웹 브라우저에서 `http://localhost:5173`으로 접속할 수 있습니다.
- 백엔드 서버 단독 실행: `npm run dev:backend`
- 웹 프론트엔드 단독 실행: `npm run dev:frontend`

### 3. 모바일 앱 (Expo) 구동
```bash
# 1. mobile 폴더로 이동 후 패키지 설치
cd mobile
npm install

# 2. Expo Metro 번들러 구동
npm start
```
- **Android Emulator**: 터미널에서 `a` 키 입력
- **iOS Simulator**: 터미널에서 `i` 키 입력 (macOS 전용)
- **실기기(Expo Go)**: 모바일 앱 스토어에서 `Expo Go`를 설치한 후, **동일한 Wi-Fi** 네트워크 환경에서 터미널의 QR 코드를 스캔합니다.

---

## ✨ 핵심 기능 및 구현 세부사항

| 구분 | 구현된 핵심 기능 | 비고 / 구현 특이사항 |
| :--- | :--- | :--- |
| **🔐 인증 (Auth)** | 이중 쿠키/헤더 세션 유지 | Web은 쿠키(`jwt-netflix`)를 통해 보안 인증, Mobile은 `AsyncStorage`에 토큰을 영구 보관 후 헤더(`Authorization: Bearer <token>`) 주입 |
| **🏠 홈 화면** | 트렌드 영화/TV 배너 | TMDB 실시간 API 연동, 유튜브 예고편 오버레이, 장르 선택 필터링 |
| **🔍 검색 (Search)** | 탭 전환 및 상태 보존 | - 영화/TV/인물별 검색 기록 및 상태 최적화<br>- 상세 페이지 조회 후 **뒤로 가기(Back) 시 검색 결과 자동 복구**<br>- 탭 전환이나 홈 이동 시 검색 기록 자동 초기화 및 검색창 클리어 처리 |
| **👤 인물 상세** | 위키 백과 및 구글 검색 결과 뷰 | - DuckDuckGo Instant Answer API 기반 프로필 요약 제공<br>- 구글 스타일의 연관 링크 카드와 아웃링크 탑재<br>- 인물 이미지 전송 시 TypeScript 널 가드 처리 완료 |
| **📜 검색 기록** | 기록 실시간 보존 및 관리 | - 중복 검색어 검색 시 이전 이력을 `$pull`하고 최신 이력을 `$push`하여 중복 완벽 제거<br>- 모바일 당겨서 새로고침(Pull-to-refresh) 지원 및 삭제 DB 동기화 |
| **🎬 콘텐츠 상세** | 유튜브 스트리밍 플레이어 | - `react-native-youtube-iframe` 연동 및 Safe Area 고려한 노치 마진 보정<br>- 상세 정보 텍스트와 비디오 영역 간 여백 조정으로 시각적 밸런스 극대화 |

---

## 🛠️ 주요 수정 및 개선 사항 (TypeScript 안정화)

1. **Expo Router 타입 세이프 경로 보완**:
   `router.push` 실행 시 문자열 템플릿 대신 정확한 동적 파라미터 규격을 적용해 경로 타입 에러(Code 2322)를 해결했습니다.
   - [search.tsx](file:///Users/guniluk/Desktop/CLI/webMobile-netflix/mobile/app/%28tabs%29/search.tsx): `/person/[name]` 및 `/watch/[id]`에 맞춤형 `params` 설정

2. **React Native Image Source 타입 보정**:
   `imageUrl || profile.imageUrl`에 포함된 `null` 타입 가능성으로 인한 컴포넌트 타입 매칭 에러(Code 2769)를 널 병합 연산자(`|| undefined`) 조치로 완벽하게 해결했습니다.
   - [[name].tsx](file:///Users/guniluk/Desktop/CLI/webMobile-netflix/mobile/app/person/%5Bname%5D.tsx): `source={{ uri: imageUrl || profile.imageUrl || undefined }}`

3. **로컬 IP 동적 감지**:
   모바일 기기 실기기 연동 시 별도의 IP 하드코딩 없이 `Constants.expoConfig?.hostUri`를 통해 Metro 번들러 실행 PC의 IP 주소와 자동으로 포트를 바인딩하도록 백엔드 접속 설정이 구현되어 있습니다.
