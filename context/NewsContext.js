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
  const [sortBy, setSortBy] = useState('publishedAt'); // 정렬 상태를 전역으로 관리
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // sortBy 상태가 변경될 때마다 뉴스를 다시 불러옵니다.
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const fetchAllNews = async () => {
      const cachedDataJSON = localStorage.getItem('newsData');
      const cacheTimestamp = localStorage.getItem('newsTimestamp');
      const cachedSortBy = localStorage.getItem('newsSortBy');
      const now = new Date().getTime();
      const thirtyMinutes = 30 * 60 * 1000;

      let parsedData = null;
      try {
        if (cachedDataJSON) parsedData = JSON.parse(cachedDataJSON);
      } catch (error) {
        parsedData = null; 
      }

      // 캐시가 유효하고, 정렬 순서도 현재와 같을 때만 캐시를 사용합니다.
      if (parsedData && Array.isArray(parsedData.themes) && cachedSortBy === sortBy && cacheTimestamp && now - cacheTimestamp < thirtyMinutes) {
        setNews(parsedData.articles);
        setThemes(parsedData.themes);
        setLoading(false);
      } else {
        setLoading(true);
        try {
          const response = await axios.get('/api/news', { params: { sortBy } });
          const { articles, themes } = response.data;
          setNews(articles);
          setThemes(themes);
          
          const cachePayload = { articles, themes };
          localStorage.setItem('newsData', JSON.stringify(cachePayload));
          localStorage.setItem('newsTimestamp', now.toString());
          localStorage.setItem('newsSortBy', sortBy); // 정렬 순서도 캐시에 저장
        } catch (error) {
          console.error('Error fetching all news:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAllNews();
  }, [sortBy, isMounted]);

  const value = {
    news,
    loading,
    themes,
    sortBy,
    setSortBy, // setSortBy를 외부로 노출시켜 어느 컴포넌트에서든 호출 가능하게 함
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};