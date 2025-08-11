
import Head from 'next/head';
import NewsSection from '../components/NewsSection';
import { useEffect, useState } from 'react';
import { useNews } from '../context/NewsContext';
import { useRouter } from 'next/router';

export default function Home() {
  // 데이터와 상태를 모두 Context에서 가져옵니다.
  const { news, loading, themes, sortBy, setSortBy, region, setRegion } = useNews();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 정렬 변경 핸들러
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // 지역 변경 핸들러
  const handleRegionChange = (e) => {
    setRegion(e.target.value);
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
          <div className="d-flex justify-content-center flex-wrap">
            {/* 정렬 옵션 */}
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="sortBy" id="publishedAt" value="publishedAt" checked={sortBy === 'publishedAt'} onChange={handleSortChange} />
              <label className="form-check-label" htmlFor="publishedAt">최신순</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="sortBy" id="popularity" value="popularity" checked={sortBy === 'popularity'} onChange={handleSortChange} />
              <label className="form-check-label" htmlFor="popularity">인기순</label>
            </div>

            {/* 구분선 */}
            <div className="mx-2" style={{ borderLeft: '1px solid #ccc', height: '24px' }}></div>

            {/* 지역 옵션 */}
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="region" id="all" value="all" checked={region === 'all'} onChange={handleRegionChange} />
              <label className="form-check-label" htmlFor="all">전체</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="region" id="kr" value="kr" checked={region === 'kr'} onChange={handleRegionChange} />
              <label className="form-check-label" htmlFor="kr">국내</label>
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
