import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Bouton animé avec effets de survol et de clic
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.to - URL de destination (si c'est un lien)
 * @param {string} props.type - Type de bouton (button, submit, reset)
 * @param {string} props.variant - Variante de style (primary, secondary, accent, outline, text)
 * @param {string} props.size - Taille du bouton (sm, md, lg)
 * @param {boolean} props.fullWidth - Si le bouton doit prendre toute la largeur
 * @param {boolean} props.disabled - Si le bouton est désactivé
 * @param {Function} props.onClick - Fonction à exécuter au clic
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {string} props.className - Classes CSS supplémentaires
 */
const AnimatedButton = ({
  to,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Styles de base pour tous les boutons
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 transform';
  
  // Styles pour les différentes variantes
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-md hover:shadow-lg',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-lg',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
    text: 'bg-transparent text-primary-600 hover:bg-primary-50 hover:underline',
  };
  
  // Styles pour les différentes tailles
  const sizeClasses = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6',
  };
  
  // Styles pour les boutons désactivés
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'hover:scale-105 active:scale-95';
  
  // Styles pour la largeur
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Effet de pression
  const pressedClasses = isPressed ? 'scale-95' : '';
  
  // Combinaison de toutes les classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${disabledClasses}
    ${widthClasses}
    ${pressedClasses}
    ${className}
  `;
  
  // Gestionnaires d'événements
  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };
  
  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };
  
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };
  
  // Si c'est un lien, utiliser le composant Link
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  }
  
  // Sinon, utiliser un bouton standard
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
