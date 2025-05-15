import React from 'react';

/**
 * Carte de statistiques pour le tableau de bord d'administration
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Titre de la statistique
 * @param {string|number} props.value - Valeur de la statistique
 * @param {React.ReactNode} props.icon - Icône à afficher
 * @param {string} props.iconBgColor - Couleur de fond de l'icône
 * @param {string} props.iconColor - Couleur de l'icône
 * @param {string} props.trend - Tendance (up, down, neutral)
 * @param {string} props.trendValue - Valeur de la tendance (ex: "+12%")
 * @param {string} props.trendPeriod - Période de la tendance (ex: "depuis le mois dernier")
 */
const StatCard = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-primary-100',
  iconColor = 'text-primary-500',
  trend = 'neutral',
  trendValue,
  trendPeriod,
}) => {
  // Déterminer les classes CSS pour la tendance
  const getTrendClasses = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  // Déterminer l'icône de tendance
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        );
      case 'down':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      
      {(trendValue || trendPeriod) && (
        <div className="flex items-center text-sm">
          {trendValue && (
            <span className={`flex items-center mr-1 ${getTrendClasses()}`}>
              {getTrendIcon()}
              <span className="ml-1">{trendValue}</span>
            </span>
          )}
          {trendPeriod && (
            <span className="text-gray-500">{trendPeriod}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
