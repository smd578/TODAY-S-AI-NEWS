
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from '../../components/NewsCard';
import Head from 'next/head';

const ThemePage = () => {
  const router = useRouter();
  const { query, title } = router.query;
  const [articles, setArticles] = useState([]);
  const [sortBy, setSortBy] = useState('publishedAt');

  useEffect(() => {
    if (query) {
      const fetchNews = async () => {
        try {
          const response = await axios.get('/api/news', { params: { q: query, sortBy: sortBy } });
          setArticles(response.data.articles);
        } catch (error) {
          console.error(`Error fetching news for query ${query}:`, error);
        }
      };

      fetchNews();
    }
  }, [query, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="container">
      <Head>
        <title>{decodeURIComponent(title)} - TODAY'S AI NEWS</title>
      </Head>

      <main className="py-5">
        <h1 className="text-center mb-5">{decodeURIComponent(title)}</h1>

        <div className="d-flex justify-content-center mb-4">
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="sortBy" id="publishedAt" value="publishedAt" checked={sortBy === 'publishedAt'} onChange={handleSortChange} />
            <label className="form-check-label" htmlFor="publishedAt">최신순</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="sortBy" id="popularity" value="popularity" checked={sortBy === 'popularity'} onChange={handleSortChange} />
            <label className="form-check-label" htmlFor="popularity">인기순</label>
          </div>
        </div>

        <div className="row">
          {articles.map((article, index) => (
            <div className="col-lg-3 col-md-6" key={index}>
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ThemePage;
