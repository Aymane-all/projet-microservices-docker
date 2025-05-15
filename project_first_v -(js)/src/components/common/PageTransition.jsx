import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant pour animer les transitions entre les pages
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Le contenu à afficher
 * @param {string} props.transitionType - Le type de transition (fade, slide, zoom)
 * @param {number} props.duration - La durée de la transition en ms
 */
const PageTransition = ({ 
  children, 
  transitionType = 'fade', 
  duration = 300 
}) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  // Définir les classes CSS pour chaque type de transition
  const transitionClasses = {
    fade: {
      fadeIn: 'opacity-100 transition-opacity duration-300 ease-in-out',
      fadeOut: 'opacity-0 transition-opacity duration-300 ease-in-out'
    },
    slide: {
      fadeIn: 'translate-x-0 transition-transform duration-300 ease-in-out',
      fadeOut: 'translate-x-full transition-transform duration-300 ease-in-out'
    },
    zoom: {
      fadeIn: 'scale-100 transition-transform duration-300 ease-in-out',
      fadeOut: 'scale-95 opacity-0 transition-all duration-300 ease-in-out'
    }
  };

  // Obtenir les classes pour le type de transition actuel
  const getClasses = () => {
    const classes = transitionClasses[transitionType] || transitionClasses.fade;
    return classes[transitionStage];
  };

  useEffect(() => {
    // Si la location change, déclencher l'animation de sortie
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
      
      // Après la durée de l'animation, mettre à jour la location et déclencher l'animation d'entrée
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation, duration]);

  return (
    <div className={getClasses()}>
      {children}
    </div>
  );
};

export default PageTransition;
