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
  const [sortBy, setSortBy] = useState('publishedAt');
  const [region, setRegion] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const fetchAllNews = async () => {
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

      if (parsedData && Array.isArray(parsedData.themes) && cacheTimestamp && now - cacheTimestamp < thirtyMinutes) {
        setError(null); // 성공 시 에러 상태 초기화
        setNews(parsedData.articles);
        setThemes(parsedData.themes);
        setLoading(false);
      } else {
        setLoading(true);
        setError(null); // 새로운 호출 시작 전 에러 상태 초기화
        try {
          const response = await axios.get('/api/news', { params: { sortBy, region } });
          const { articles, themes } = response.data;
          setNews(articles);
          setThemes(themes);
          
          const cachePayload = { articles, themes };
          localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
          localStorage.setItem(cacheTimestampKey, now.toString());
        } catch (err) {
          console.error('Error fetching all news:', err);
          
          // API 호출 실패 시, 먼저 캐시에서 데이터 로드를 시도
          const lastResortDataJSON = localStorage.getItem(cacheKey);
          if (lastResortDataJSON) {
            alert('뉴스 API 호출에 실패했습니다. 마지막으로 성공한 데이터를 표시합니다. 이 데이터는 최신이 아닐 수 있습니다.');
            try {
              const lastResortData = JSON.parse(lastResortDataJSON);
              if (lastResortData && lastResortData.articles) {
                setNews(lastResortData.articles);
                setThemes(lastResortData.themes);
              }
            } catch (parseError) {
              console.error('Failed to parse fallback data from localStorage', parseError);
              setError('데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
            }
          } else {
            // 캐시조차 없으면 에러 상태 설정
            setError('데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
          }
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
    setRegion,
    error, // 에러 상태를 context value로 전달
  };

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};