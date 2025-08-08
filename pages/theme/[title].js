import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import NewsCard from '../../components/NewsCard';
import Head from 'next/head';
import { useNews } from '../../context/NewsContext';

const ThemePage = () => {
  const router = useRouter();
  const { title } = router.query;
  // 전역 상태(news, loading, sortBy, setSortBy)를 Context에서 가져옵니다.
  const { news, loading, sortBy, setSortBy } = useNews();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [displayArticles, setDisplayArticles] = useState([]);

  useEffect(() => {
    // Context의 news 데이터는 이미 올바르게 정렬되어 있으므로, 검색어 필터링만 적용합니다.
    if (title && news && news[title]) {
      const filtered = news[title].filter(article => {
        const titleText = article.title?.toLowerCase() || '';
        const descriptionText = article.description?.toLowerCase() || '';
        return titleText.includes(searchTerm.toLowerCase()) || descriptionText.includes(searchTerm.toLowerCase());
      });
      setDisplayArticles(filtered);
    }
  }, [title, news, searchTerm]); // 로컬 정렬 상태가 없으므로 의존성 배열에서 제거

  // 정렬 변경 시 전역 setSortBy를 호출합니다.
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const decodedTitle = title ? decodeURIComponent(title) : 'Theme';

  // 로딩 상태는 전역 loading을 따릅니다.
  if (loading) {
    return <p className="text-center py-5">Loading news...</p>;
  }

  return (
    <div className="container">
      <Head>
        <title>{decodedTitle} - TODAY'S AI NEWS</title>
      </Head>

      <main className="py-5">
        <h1 className="text-center mb-4">{decodedTitle}</h1>

        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="기사 제목 또는 내용 검색..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-auto d-flex align-items-center">
            <div className="form-check form-check-inline">
              {/* 전역 sortBy 상태와 동기화합니다. */}
              <input className="form-check-input" type="radio" name="sortBy" id="publishedAt" value="publishedAt" checked={sortBy === 'publishedAt'} onChange={handleSortChange} />
              <label className="form-check-label" htmlFor="publishedAt">최신순</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="sortBy" id="popularity" value="popularity" checked={sortBy === 'popularity'} onChange={handleSortChange} />
              <label className="form-check-label" htmlFor="popularity">인기순</label>
            </div>
          </div>
        </div>

        <div className="row">
          {displayArticles.length > 0 ? (
            displayArticles.map((article, index) => (
              <div className="col-lg-3 col-md-6 mb-4" key={index}>
                <NewsCard article={article} />
              </div>
            ))
          ) : (
            <p className="text-center">검색 결과가 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ThemePage;