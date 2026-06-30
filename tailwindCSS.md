# React (Vite) + Tailwind CSS v4 + daisyUI v5 설정 가이드

본 문서는 Vite + React 환경에서 가장 최신 버전인 **Tailwind CSS v4** 및 **daisyUI v5**를 설치하고 프로젝트에 적용하는 방법을 설명합니다.

Tailwind CSS v4.0부터는 기존의 `tailwind.config.js` 설정 방식 대신 **CSS 기반 구성(CSS-first configuration)**과 **Vite 전용 빌드 플러그인**을 채택하여 더욱 빠르고 간결하게 설정할 수 있습니다.

---

## 1. Tailwind CSS v4 설치 및 설정

### 1단계: 패키지 설치
Vite React 프로젝트 디렉토리(예: `frontend/`)에서 아래 명령어를 실행하여 Tailwind CSS v4 및 Vite 연동 플러그인을 설치합니다.
```bash
npm install tailwindcss @tailwindcss/vite
```

### 2단계: Vite 설정 변경 (`vite.config.js`)
`@tailwindcss/vite` 플러그인을 불러와 Vite 설정 파일에 등록합니다. 기존의 PostCSS 설정 파일(`postcss.config.js`)이 필요 없어집니다.
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Tailwind v4 Vite 플러그인 가져오기

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 플러그인 등록
  ],
});
```

### 3단계: 메인 CSS에 Tailwind 가져오기 (`src/index.css`)
기존의 `@tailwind base;`, `@tailwind components;` 지시문 대신 표준 CSS `@import` 문법을 사용합니다.
```css
/* src/index.css */
@import "tailwindcss";
```

---

## 2. daisyUI v5 설치 및 설정

daisyUI v5는 Tailwind CSS v4를 완벽히 네이티브로 지원하며, JS 파일 설정 대신 메인 CSS 파일 내에서 직접 플러그인으로 호출합니다.

### 1단계: 패키지 설치
daisyUI 패키지를 설치합니다.
```bash
npm install daisyui
```

### 2단계: 메인 CSS에 플러그인 추가 (`src/index.css`)
Tailwind CSS 임포트문 바로 아래에 `@plugin` 지시어를 사용하여 daisyUI를 로드합니다.
```css
/* src/index.css */
@import "tailwindcss";
@plugin "daisyui";
```

---

## 3. daisyUI 테마 설정 및 커스터마이징 (v5 최신 문법)

daisyUI v5에서는 CSS 파일 안에서 옵션을 넘겨주는 방식으로 테마 및 다크 모드를 제어합니다.

### 테마 활성화 및 다크 모드 매핑
기본 테마 설정 및 시스템 다크 모드 연동은 다음과 같이 정의합니다.
```css
/* src/index.css */
@import "tailwindcss";

/* daisyUI 플러그인 로드 및 테마 옵션 설정 */
@plugin "daisyui" {
  themes: winter --default, night --prefersdark;
}

/* Tailwind의 dark: 접두사를 daisyUI 테마와 매핑 */
@custom-variant dark (&:where([data-theme=night], [data-theme=night] *));
```

### 새로운 커스텀 테마 선언 (`@plugin "daisyui/theme"`)
기본 테마 외에 나만의 커스텀 테마를 생성하고 싶을 경우 CSS 내에서 다음과 같이 속성을 정의할 수 있습니다.
```css
/* src/index.css */
@import "tailwindcss";
@plugin "daisyui";

@plugin "daisyui/theme" {
  name: "mytheme";       /* 테마 이름 */
  default: true;         /* 기본 테마 설정 */
  prefersdark: false;    /* 다크모드 여부 */
  color-scheme: light;

  /* 테마 컬러 변수 정의 (oklch 혹은 hex, rgb 사용 가능) */
  --color-primary: oklch(55% 0.3 240);
  --color-primary-content: oklch(98% 0.01 240);
  --color-base-100: oklch(98% 0.02 240);
  
  /* 테마 UI 스타일 변수 정의 */
  --radius-box: 0.5rem;    /* 카드 등 박스 모서리 둥글기 */
  --radius-btn: 0.25rem;   /* 버튼 모서리 둥글기 */
}
```

---

## 4. React 컴포넌트 적용 예시 (최신 문법)

Tailwind CSS v4의 유틸리티 클래스와 daisyUI v5의 시맨틱 컴포넌트 클래스를 융합하여 작성한 React 컴포넌트 예시입니다.

```jsx
import { useState } from 'react';

export default function App() {
  const [theme, setTheme] = useState('winter');

  const toggleTheme = () => {
    const nextTheme = theme === 'winter' ? 'night' : 'winter';
    setTheme(nextTheme);
    // HTML 태그의 data-theme 속성을 변경하여 테마를 실시간 전환합니다.
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-8 transition-colors duration-300">
      <div className="max-w-md mx-auto card bg-base-200 shadow-xl p-6 border border-base-300">
        <h1 className="text-2xl font-black text-primary mb-2">
          Tailwind v4 + daisyUI v5
        </h1>
        
        <p className="text-sm text-neutral-content mb-6">
          Vite 기반 환경에서 가장 빠르고 간결하게 스타일을 구축해 보세요.
        </p>

        <div className="flex gap-4">
          {/* daisyUI 버튼 스타일링 */}
          <button className="btn btn-primary" onClick={toggleTheme}>
            테마 전환 ({theme === 'winter' ? '라이트' : '다크'})
          </button>
          
          <button className="btn btn-outline btn-secondary">
            보조 버튼
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. 핵심 변경 요약 (Tailwind v3 vs v4)

| 비교 항목 | Tailwind CSS v3 | Tailwind CSS v4 (최신) |
| :--- | :--- | :--- |
| **설정 파일** | `tailwind.config.js` 필수 작성 | **불필요** (CSS 파일 및 Vite 플러그인으로 대체) |
| **Vite 연동** | PostCSS 설정 (`postcss.config.js`) 거침 | `@tailwindcss/vite` 플러그인으로 **Direct 컴파일** |
| **CSS 선언** | `@tailwind base;` 등 사용 | `@import "tailwindcss";` 로 단일화 |
| **daisyUI 플러그인** | config의 `plugins: [require('daisyui')]` | CSS 파일의 `@plugin "daisyui";`로 선언 |
| **파일 감지(Purge)** | config 파일의 `content: [...]`에 경로 기입 | **자동 감지** (프로젝트 내 모든 마크업/JS 파일 스캔) |
