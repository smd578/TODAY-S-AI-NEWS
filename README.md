
# 최신 AI 뉴스 웹페이지

이 프로젝트는 Next.js와 News API를 사용하여 최신 AI 뉴스를 자동으로 업데이트하여 보여주는 웹페이지입니다.

## 프로젝트 구조

```
latest-ai-news/
├── components/         # 재사용 가능한 React 컴포넌트
│   ├── NewsCard.js     # 개별 뉴스 기사 카드 UI
│   └── NewsSection.js  # 특정 주제의 뉴스들을 모아 보여주는 섹션
├── pages/              # Next.js 페이지 라우팅
│   ├── api/            # API 라우트
│   │   └── news.js     # News API와 통신하여 뉴스 데이터를 가져오는 API
│   ├── _app.js         # 모든 페이지에 공통으로 적용되는 설정
│   └── index.js        # 메인 페이지
├── public/             # 정적 파일 (이미지, 폰트 등)
├── styles/             # CSS 스타일
│   └── globals.css     # 전역 CSS
├── .env.local          # 환경 변수 파일 (API 키 등)
├── package.json        # 프로젝트 의존성 및 스크립트 설정
└── README.md           # 프로젝트 설명 문서
```

## 주요 기능 및 모듈 설명

- **`pages/api/news.js`**: News API와 통신하여 클라이언트 측에 뉴스 데이터를 제공하는 서버리스 API 라우트입니다. API 키를 안전하게 서버 측에서만 사용하도록 합니다.
- **`pages/index.js`**: 웹사이트의 메인 페이지입니다. `NewsSection` 컴포넌트를 사용하여 다양한 주제의 AI 뉴스들을 화면에 렌더링합니다.
- **`components/NewsSection.js`**: 특정 주제(query 또는 category)를 받아 `pages/api/news.js`로 뉴스 데이터를 요청하고, 받은 데이터를 `NewsCard` 컴포넌트를 이용해 목록으로 보여줍니다.
- **`components/NewsCard.js`**: 뉴스 기사 하나하나의 정보를(제목, 요약, 이미지 등) 받아 카드 형태의 UI로 예쁘게 표시합니다.
- **`pages/_app.js`**: 모든 페이지에 공통으로 적용되는 파일로, 이 프로젝트에서는 Bootstrap CSS를 전역으로 임포트하여 일관된 UI를 제공합니다.
- **`.env.local`**: News API 키와 같은 민감한 정보를 저장하는 파일입니다. 이 파일은 Git과 같은 버전 관리 시스템에 포함되지 않아 보안을 유지합니다.

## 실행 방법

1.  프로젝트 디렉토리로 이동합니다.
    ```bash
    cd latest-ai-news
    ```
2.  필요한 라이브러리를 설치합니다.
    ```bash
    npm install
    ```
3.  개발 서버를 실행합니다.
    ```bash
    npm run dev
    ```
4.  브라우저에서 `http://localhost:3000`으로 접속하여 웹페이지를 확인합니다.

