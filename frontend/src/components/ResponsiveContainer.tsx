import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  isWeb, 
  isDesktop, 
  isTablet, 
  getCurrentPlatformConfig,
  getSafePadding 
} from '../utils/platformUtils';
import { spacing, grid } from '../styles/responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
  maxWidth?: number | string;
  centered?: boolean;
  padding?: boolean;
  backgroundColor?: string;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  safeArea = true,
  maxWidth,
  centered = false,
  padding = true,
  backgroundColor = '#F8F9FA',
}) => {
  const containerStyles = [
    styles.container,
    {
      backgroundColor,
      ...(padding && getSafePadding()),
      ...(maxWidth && { maxWidth }),
      ...(centered && isWeb() && { alignSelf: 'center' }),
    },
    style,
  ];

  const Container = safeArea && !isWeb() ? SafeAreaView : View;

  return (
    <Container style={containerStyles}>
      {isWeb() && isDesktop() ? (
        <View style={styles.desktopWrapper}>
          <View style={styles.desktopContent}>
            {children}
          </View>
        </View>
      ) : (
        children
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...grid.container,
  },
  
  desktopWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  
  desktopContent: {
    width: '100%',
    maxWidth: getCurrentPlatformConfig().maxWidth,
    flex: 1,
  },
});

export default ResponsiveContainer;

