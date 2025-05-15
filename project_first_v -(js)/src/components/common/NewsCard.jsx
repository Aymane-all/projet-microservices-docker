import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const NewsCard = ({ article }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:scale-[1.02]">
      {article.urlToImage && (
        <div className="h-48 overflow-hidden">
          <img 
            src={article.urlToImage} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="bg-primary-100 text-primary-700 rounded-full px-2 py-1">
            {article.source?.name || 'Actualité Santé'}
          </span>
          <div className="flex items-center ml-3">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.description || 'Aucune description disponible.'}
        </p>
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          Lire l'article complet
          <ExternalLink size={16} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
