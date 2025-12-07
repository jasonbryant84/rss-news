import { useState, useEffect } from 'react';

export function useRSSArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/articles');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.articles) {
        setArticles(data.articles);
      } else {
        throw new Error(data.message || 'Failed to parse articles');
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err.message);
      // Fallback to empty array on error
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles
  };
}
