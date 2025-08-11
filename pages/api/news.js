
import axios from 'axios';

// '전체' 기사(영문)를 위한 테마 정의
const themes = {
  '신규 업데이트 / 업데이트 예정': {
    query: '("Gemini" OR "Claude" OR "VEO" OR "GPT" OR "Replit" OR "Cursor") AND (update OR release OR feature OR new OR announced)',
    requiredKeywords: ['update', 'release', 'new', 'feature', 'launch', 'unveil', 'preview', 'beta', 'announced', 'gemini', 'claude', 'veo', 'gpt', 'replit', 'cursor']
  },
  'AI 산업 및 비즈니스 동향': {
    query: 'AI industry business trends',
    requiredKeywords: ['market', 'business', 'industry', 'investment', 'funding', 'acquisition', 'partnership', 'economic', 'trend']
  },
  'AI 활용 사례 및 트렌드': {
    query: 'AI use case OR application OR trend',
    requiredKeywords: ['use case', 'how to', 'application', 'trend', 'study', 'report', 'survey', 'adopt', 'implement']
  },
  '집중분석: 바이브 코딩': {
    query: '("Vibe Coding" OR "바이브 코딩") AND AI',
    requiredKeywords: ['vibe coding', '바이브 코딩']
  },
  '집중분석: AI 영상 생성/편집': {
    query: '("RunwayML" OR "Pika" OR "Sora") AND (AI OR "video generation" OR "video editing")',
    requiredKeywords: ['runway', 'pika', 'sora', 'video', 'film', 'edit', 'generation', 'animation', 'generative']
  }
};

// '국내' 기사(한글)를 위한 테마 정의
const koreanThemes = {
  '신규 업데이트 / 업데이트 예정': {
    query: '("제미나이" OR "클로드" OR "VEO" OR "GPT" OR "리플릿" OR "커서") AND (업데이트 OR 출시 OR 기능 OR 새로운 OR 발표)',
    requiredKeywords: ['업데이트', '출시', '공개', '기능', '베타', '발표', '제미나이', '클로드', 'gpt']
  },
  'AI 산업 및 비즈니스 동향': {
    query: 'AI OR 인공지능 AND (산업 OR 비즈니스 OR 투자 OR 동향)',
    requiredKeywords: ['산업', '비즈니스', '시장', '투자', '펀딩', '인수', '파트너십', '경제', '동향']
  },
  'AI 활용 사례 및 트렌드': {
    query: 'AI OR 인공지능 AND (활용사례 OR 적용 OR 트렌드 OR 사용법)',
    requiredKeywords: ['활용', '사례', '방법', '적용', '트렌드', '보고서', '도입', '구축']
  },
  '집중분석: 바이브 코딩': {
    query: '"바이브 코딩" OR "Vibe Coding"',
    requiredKeywords: ['바이브 코딩', 'vibe coding']
  },
  '집중분석: AI 영상 생성/편집': {
    query: '("RunwayML" OR "Pika" OR "Sora" OR "AI 영상") AND (생성 OR 편집 OR 동영상)',
    requiredKeywords: ['runway', 'pika', 'sora', '영상', '비디오', '편집', '생성', '애니메이션']
  }
};


// 기사의 제목이나 설명에 필수 키워드가 포함되어 있는지 확인하는 함수
const hasRequiredKeyword = (article, keywords) => {
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  return keywords.some(keyword => title.includes(keyword) || description.includes(keyword));
};

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  const { sortBy = 'publishedAt', region = 'all' } = req.query;

  const selectedThemes = region === 'kr' ? koreanThemes : themes;
  const allNews = {};
  const fetchedUrls = new Set();

  const koreanDomains = [
    "yonhapenews.co.kr", "newsis.com", "yna.co.kr", "chosun.com", "donga.com",
    "joongang.co.kr", "hani.co.kr", "khan.co.kr", "mk.co.kr", "hankyung.com",
    "sedaily.com", "ytn.co.kr", "mbc.co.kr", "kbs.co.kr", "sbs.co.kr"
  ].join(',');

  for (const title in selectedThemes) {
    const theme = selectedThemes[title];
    
    try {
      let articles = [];

      if (region === 'kr') {
        // '국내'일 경우, 두 가지 API를 동시에 호출합니다.
        const generalQueryUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(theme.query)}&sortBy=${sortBy}&language=ko&pageSize=50&apiKey=${apiKey}`;
        const domainSpecificUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(theme.query)}&sortBy=${sortBy}&domains=${koreanDomains}&language=ko&pageSize=50&apiKey=${apiKey}`;

        const [generalResponse, domainResponse] = await Promise.all([
          axios.get(generalQueryUrl),
          axios.get(domainSpecificUrl)
        ]);

        // 두 결과를 합칩니다.
        articles = [...generalResponse.data.articles, ...domainResponse.data.articles];

      } else {
        // '전체'일 경우, 기존처럼 한 번만 호출합니다.
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(theme.query)}&sortBy=${sortBy}&apiKey=${apiKey}`;
        const response = await axios.get(url);
        articles = response.data.articles;
      }

      // 중복 제거 및 키워드 필터링
      const filteredArticles = articles.filter(article => {
        const isUnique = !fetchedUrls.has(article.url);
        if (isUnique) {
          fetchedUrls.add(article.url);
          return hasRequiredKeyword(article, theme.requiredKeywords);
        }
        return false;
      });

      allNews[title] = filteredArticles;

    } catch (error) {
      console.error(`Error fetching news for ${title}:`, error.response ? error.response.data : error.message);
      allNews[title] = [];
    }
  }

  const themeTitles = Object.keys(selectedThemes);
  res.status(200).json({ articles: allNews, themes: themeTitles });
}
