
import axios from 'axios';

// 테마별 검색어와 필수 포함 키워드를 정의합니다.
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

// 기사의 제목이나 설명에 필수 키워드가 포함되어 있는지 확인하는 함수
const hasRequiredKeyword = (article, keywords) => {
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  return keywords.some(keyword => title.includes(keyword) || description.includes(keyword));
};

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  const { sortBy = 'publishedAt' } = req.query;
  
  const allNews = {};
  const fetchedUrls = new Set();

  for (const title in themes) {
    const theme = themes[title];
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(theme.query)}&sortBy=${sortBy}&apiKey=${apiKey}`;
    
    try {
      const response = await axios.get(url);
      
      const articles = response.data.articles;

      // 1. 중복 기사 제거 및 2. 필수 키워드 필터링
      const filteredArticles = articles.filter(article => {
        const isUnique = !fetchedUrls.has(article.url);
        const isRelevant = hasRequiredKeyword(article, theme.requiredKeywords);
        return isUnique && isRelevant;
      });
      
      // 필터링된 기사의 URL을 Set에 추가
      filteredArticles.forEach(article => fetchedUrls.add(article.url));
      
      allNews[title] = filteredArticles;
    } catch (error) {
      console.error(`Error fetching news for ${title}:`, error.response ? error.response.data : error.message);
      allNews[title] = [];
    }
  }

  // 클라이언트에 전달할 themes 객체는 검색 쿼리가 아닌 제목만 포함하도록 단순화합니다.
  const themeTitles = Object.keys(themes);
  res.status(200).json({ articles: allNews, themes: themeTitles });
}
