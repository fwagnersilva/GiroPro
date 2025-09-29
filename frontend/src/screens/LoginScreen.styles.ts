import { CSSProperties } from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/designSystem';

interface Styles {
  [key: string]: CSSProperties;
}

const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.loginScreen.background,
    color: colors.neutral.text.primary,
    fontFamily: typography.fontFamily,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  formContainer: {
    maxWidth: '400px',
    width: '100%',
    padding: spacing.loginScreen.formPadding,
    backgroundColor: colors.loginScreen.formBackground,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.loginScreen.titleMarginBottom,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.loginScreen.link,
  },
  error: {
    color: colors.secondary.error,
    marginBottom: spacing.loginScreen.errorMarginBottom,
    padding: spacing.md,
    backgroundColor: colors.loginScreen.errorBackground,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
  },
  rememberMeContainer: {
    marginBottom: spacing.lg,
    display: 'flex',
    alignItems: 'center',
  },
  rememberMeLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: typography.fontSize.sm,
    color: colors.neutral.text.secondary,
  },
  rememberMeCheckbox: {
    marginRight: spacing.sm,
    width: '16px',
    height: '16px',
    accentColor: colors.primary.main,
  },
  rememberMeText: {
    userSelect: 'none',
  },
  toggleContainer: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  forgotPasswordContainer: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  credentialsInfo: {
    marginTop: spacing.loginScreen.credentialsMarginTop,
    padding: spacing.loginScreen.credentialsPadding,
    backgroundColor: colors.loginScreen.inputBackground,
    borderRadius: borderRadius.md,
    textAlign: 'center',
  },
  credentialsTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    color: colors.loginScreen.link,
  },
  credentialsText: {
    fontSize: typography.fontSize.xs,
    margin: `${spacing.xs} 0`,
    color: colors.neutral.text.secondary,
  },
};

export default styles;


