import React, { useState, useEffect } from 'react';
import externalApiService from '../../api/externalApi';
import NewsCard from '../common/NewsCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Newspaper } from 'lucide-react';

const MedicalNews = ({ count = 3 }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const articles = await externalApiService.medicalNews.getLatestNews(count);
        setNews(articles);
        setError(null);
      } catch (err) {
        console.error('Error fetching medical news:', err);
        setError('Impossible de charger les actualités médicales');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [count]);

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-4">
            <Newspaper size={24} />
          </div>
          <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Actualités Santé</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Restez informé
          </p>
          <p className="max-w-2xl mt-4 text-xl text-gray-500 mx-auto">
            Les dernières actualités et découvertes dans le domaine de la santé.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalNews;
