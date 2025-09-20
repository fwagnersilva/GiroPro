import React from 'react';
import { createCardStyle } from '../../styles/designSystem';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'xl',
  shadow = 'md',
  hover = false,
  style,
  ...props
}) => {
  const cardStyle = createCardStyle();
  
  const paddingMap = {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px'
  };
  
  const shadowMap = {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.2)'
  };

  return (
    <div
      {...props}
      style={{
        ...cardStyle,
        padding: paddingMap[padding],
        boxShadow: shadowMap[shadow],
        transition: hover ? 'transform 0.2s ease, box-shadow 0.2s ease' : 'none',
        cursor: hover ? 'pointer' : 'default',
        ...style
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = shadowMap.lg;
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = shadowMap[shadow];
      } : undefined}
    >
      {children}
    </div>
  );
};

export default Card;

