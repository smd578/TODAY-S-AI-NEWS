
import Head from 'next/head';
import NewsSection from '../components/NewsSection';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('publishedAt'); // or 'popularity'

  const themes = {
    '신규 업데이트 / 업데이트 예정': '("Gemini" OR "Claude" OR "VEO" OR "GPT" OR "Replit" OR "Cursor") AND (update OR release OR feature OR new)',
    'AI 산업 및 비즈니스 동향': 'AI industry business',
    'AI 기술 및 연구 혁신': 'AI technology research innovation',
    'AI 사회적 이슈 및 윤리': 'AI social issue ethics',
    'AI 활용 사례 및 트렌드': 'AI use case trend',
    '집중분석: 바이브 코딩': '("Vibe Coding" OR "바이브 코딩") AND AI',
    '집중분석: AI 영상 생성/편집': '("RunwayML" OR "Pika" OR "Sora") AND (AI OR "video generation" OR "video editing")'
  };

  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      const fetchedNews = {};
      const fetchedUrls = new Set(); // Keep track of displayed article URLs

      for (const title in themes) {
        const query = themes[title];
        try {
          const response = await axios.get('/api/news', { params: { q: query, sortBy: sortBy } });
          
          // Filter out articles that have already been seen in previous themes
          const uniqueArticles = response.data.articles.filter(article => !fetchedUrls.has(article.url));
          
          // Add the new, unique article URLs to the set
          uniqueArticles.forEach(article => fetchedUrls.add(article.url));
          
          fetchedNews[title] = uniqueArticles;
        } catch (error) {
          console.error(`Error fetching ${title} news:`, error);
          fetchedNews[title] = [];
        }
      }

      setNews(fetchedNews);
      setLoading(false);
    };

    fetchAllNews();
  }, [sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="container">
      <Head>
        <title>TODAY'S AI NEWS</title>
        <meta name="description" content="Automatically updated AI news website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-5">
        <div className="hero-gradient text-center mb-5">
          <h1 className="mb-3">TODAY'S AI NEWS</h1>
          <div className="d-flex justify-content-center">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="sortBy" id="publishedAt" value="publishedAt" checked={sortBy === 'publishedAt'} onChange={handleSortChange} />
              <label className="form-check-label" htmlFor="publishedAt">최신순</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="sortBy" id="popularity" value="popularity" checked={sortBy === 'popularity'} onChange={handleSortChange} />
              <label className="form-check-label" htmlFor="popularity">인기순</label>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading news...</p>
        ) : (
          <>
            <NewsSection title="신규 업데이트 / 업데이트 예정" articles={news['신규 업데이트 / 업데이트 예정']} query={themes['신규 업데이트 / 업데이트 예정']} />
            <hr className="themed-hr" />
            <NewsSection title="AI 산업 및 비즈니스 동향" articles={news['AI 산업 및 비즈니스 동향']} query={themes['AI 산업 및 비즈니스 동향']} />
            <hr className="themed-hr" />
            <NewsSection title="AI 기술 및 연구 혁신" articles={news['AI 기술 및 연구 혁신']} query={themes['AI 기술 및 연구 혁신']} />
            <hr className="themed-hr" />
            <NewsSection title="AI 사회적 이슈 및 윤리" articles={news['AI 사회적 이슈 및 윤리']} query={themes['AI 사회적 이슈 및 윤리']} />
            <hr className="themed-hr" />
            <NewsSection title="AI 활용 사례 및 트렌드" articles={news['AI 활용 사례 및 트렌드']} query={themes['AI 활용 사례 및 트렌드']} />

            <hr className="themed-hr" />

            <div className="row">
              <div className="col-lg-6">
                <NewsSection title="집중분석: 바이브 코딩" articles={news['집중분석: 바이브 코딩']} query={themes['집중분석: 바이브 코딩']} />
              </div>
              <div className="col-lg-6">
                <NewsSection title="집중분석: AI 영상 생성/편집" articles={news['집중분석: AI 영상 생성/편집']} query={themes['집중분석: AI 영상 생성/편집']} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
