import React from 'react';

interface LoadingSpinnerProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const webStyles = {
  spinner: {
    display: 'inline-block',
    borderRadius: '50%',
    border: '2px solid transparent',
    borderTopColor: 'currentColor',
    animation: 'spin 1s linear infinite',
  },
  small: {
    width: '16px',
    height: '16px',
  },
  medium: {
    width: '24px',
    height: '24px',
  },
  large: {
    width: '32px',
    height: '32px',
  },
};

// Add CSS animation keyframes
const spinnerCSS = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.getElementById('spinner-styles')) {
  const style = document.createElement('style');
  style.id = 'spinner-styles';
  style.textContent = spinnerCSS;
  document.head.appendChild(style);
}

const LoadingSpinnerWeb: React.FC<LoadingSpinnerProps> = ({ 
  color = '#007AFF', 
  size = 'medium' 
}) => {
  const sizeStyle = webStyles[size];
  
  return (
    <div
      style={{
        ...webStyles.spinner,
        ...sizeStyle,
        borderTopColor: color,
        borderRightColor: `${color}33`, // 20% opacity
        borderBottomColor: `${color}33`,
        borderLeftColor: `${color}33`,
      }}
    />
  );
};

export default LoadingSpinnerWeb;

