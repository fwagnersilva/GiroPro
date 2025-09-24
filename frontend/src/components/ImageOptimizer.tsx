import React from 'react';
import { Image as RNImage, Platform } from 'react-native';
import { Image as WebImage } from 'react-native-web';

interface ImageOptimizerProps {
  source: { uri: string };
  style?: any;
  alt?: string;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({ source, style, alt }) => {
  // Lógica para otimização de imagem (lazy loading, conversão para WebP, etc.)
  // Por enquanto, vamos apenas renderizar a imagem de forma condicional

  if (Platform.OS === 'web') {
    return <WebImage source={source} style={style} alt={alt} />;
  } else {
    return <RNImage source={source} style={style} />;
  }
};

export default ImageOptimizer;


