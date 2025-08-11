import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const NewsContext = createContext();

export const useNews = () => {
  return useContext(NewsContext);
};

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [themes, setThemes] = useState([]);
  const [sortBy, setSortBy] = useState('publishedAt'); // 정렬 상태
  const [region, setRegion] = useState('all'); // 'all' 또는 'kr'
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // sortBy 또는 region 상태가 변경될 때마다 뉴스를 다시 불러옵니다.
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const fetchAllNews = async () => {
      // 캐시 키를 정렬 순서와 지역에 따라 동적으로 생성
      const cacheKey = `newsData-${sortBy}-${region}`;
      const cacheTimestampKey = `newsTimestamp-${sortBy}-${region}`;

      const cachedDataJSON = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(cacheTimestampKey);
      const now = new Date().getTime();
      const thirtyMinutes = 30 * 60 * 1000;

      let parsedData = null;
      try {
        if (cachedDataJSON) parsedData = JSON.parse(cachedDataJSON);
      } catch (error) {
        parsedData = null;
      }

      // 캐시가 유효할 때만 캐시를 사용합니다.
      if (parsedData && Array.isArray(parsedData.themes) && cacheTimestamp && now - cacheTimestamp < thirtyMinutes) {
        setNews(parsedData.articles);
        setThemes(parsedData.themes);
        setLoading(false);
      } else {
        setLoading(true);
        try {
          // API 요청 시 region 파라미터를 추가합니다.
          const response = await axios.get('/api/news', { params: { sortBy, region } });
          const { articles, themes } = response.data;
          setNews(articles);
          setThemes(themes);
          
          const cachePayload = { articles, themes };
          localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
          localStorage.setItem(cacheTimestampKey, now.toString());
        } catch (error) {
          console.error('Error fetching all news:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAllNews();
  }, [sortBy, region, isMounted]);

  const value = {
    news,
    loading,
    themes,
    sortBy,
    setSortBy,
    region,
    setRegion, // setRegion을 외부로 노출
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};