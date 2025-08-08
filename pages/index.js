
import Head from 'next/head';
import NewsSection from '../components/NewsSection';
import { useEffect, useState } from 'react';
import { useNews } from '../context/NewsContext';
import { useRouter } from 'next/router';

export default function Home() {
  // 데이터와 상태를 모두 Context에서 가져옵니다.
  const { news, loading, themes, sortBy, setSortBy } = useNews();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 정렬 변경 핸들러는 이제 Context의 setSortBy를 호출하기만 하면 됩니다.
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleMoreClick = (title) => {
    router.push(`/theme/${encodeURIComponent(title)}?title=${encodeURIComponent(title)}`);
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
              {/* 전역 sortBy 상태를 사용합니다. */}
              <input className="form-check-input" type="radio" name="sortBy" id="publishedAt" value="publishedAt" checked={sortBy === 'publishedAt'} onChange={handleSortChange} />
              <label className="form-check-label" htmlFor="publishedAt">최신순</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="sortBy" id="popularity" value="popularity" checked={sortBy === 'popularity'} onChange={handleSortChange} />
              <label className="form-check-label" htmlFor="popularity">인기순</label>
            </div>
          </div>
        </div>

        {loading || !isMounted ? (
          <p className="text-center">Loading news...</p>
        ) : (
          <>
            {themes && themes.map((title, index) => (
              <div key={title}>
                <NewsSection 
                  title={title} 
                  articles={news[title] ? news[title].slice(0, 4) : []} 
                  onMoreClick={() => handleMoreClick(title)}
                />
                {/* 마지막 섹션 다음에는 구분선을 추가하지 않습니다. */}
                {index < themes.length - 1 && <hr className="themed-hr" />}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
