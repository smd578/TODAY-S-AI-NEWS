
import axios from 'axios';

export default async function handler(req, res) {
  const { q, category, sortBy } = req.query;
  const apiKey = process.env.NEWS_API_KEY;
  let url;

  if (q) {
    let apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&apiKey=${apiKey}`;
    if (sortBy) {
      apiUrl += `&sortBy=${sortBy}`;
    }
    url = apiUrl;
  } else if (category) {
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
  } else {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const response = await axios.get(url);
    const articles = response.data.articles;

    const includeKeywords = ['develop', 'update', 'release', 'launch', 'feature', 'tool', 'model', 'software', 'program', 'gemini', 'claude', 'gpt', 'replit', 'cursor', 'veo'];
    const excludeKeywords = ['politic', 'social', 'issue', 'ethic', 'government', 'law', 'regulation'];

    const filteredArticles = articles.filter(article => {
      const title = article.title.toLowerCase();
      const description = article.description ? article.description.toLowerCase() : '';
      const content = article.content ? article.content.toLowerCase() : '';

      const hasIncludeKeyword = includeKeywords.some(keyword => title.includes(keyword) || description.includes(keyword) || content.includes(keyword));
      const hasExcludeKeyword = excludeKeywords.some(keyword => title.includes(keyword) || description.includes(keyword) || content.includes(keyword));

      return hasIncludeKeyword && !hasExcludeKeyword;
    });

    res.status(200).json({ articles: filteredArticles });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
