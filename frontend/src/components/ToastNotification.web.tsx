import React, { useEffect, useState, useCallback } from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/designSystem';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastNotificationProps {
  message: string;
  type: ToastType;
  duration?: number;
  onHide: () => void;
  visible: boolean;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type,
  duration = 3000,
  onHide,
  visible,
}) => {
  const [show, setShow] = useState(false);

  const getToastConfig = useCallback(() => {
    let backgroundColor, textColor, borderColor;
    switch (type) {
      case 'success':
        backgroundColor = colors.secondary.success;
        textColor = colors.primary.contrast;
        borderColor = colors.secondary.success;
        break;
      case 'error':
        backgroundColor = colors.secondary.error;
        textColor = colors.primary.contrast;
        borderColor = colors.secondary.error;
        break;
      case 'warning':
        backgroundColor = colors.secondary.warning;
        textColor = colors.primary.contrast;
        borderColor = colors.secondary.warning;
        break;
      case 'info':
        backgroundColor = colors.primary.main;
        textColor = colors.primary.contrast;
        borderColor = colors.primary.main;
        break;
      default:
        backgroundColor = colors.neutral.surface;
        textColor = colors.neutral.text.primary;
        borderColor = colors.neutral.border;
    }
    return { backgroundColor, textColor, borderColor };
  }, [type]);

  const { backgroundColor, textColor, borderColor } = getToastConfig();

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onHide();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible, duration, onHide]);

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    top: spacing['4xl'],
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    backgroundColor,
    color: textColor,
    border: `1px solid ${borderColor}`,
    boxShadow: shadows.md,
    display: show ? 'flex' : 'none',
    alignItems: 'center',
    gap: spacing.sm,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.base,
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    opacity: show ? 1 : 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: textColor,
    fontSize: typography.fontSize.lg,
    cursor: 'pointer',
    marginLeft: spacing.md,
  };

  if (!show) return null;

  return (
    <div style={toastStyle}>
      <span>{message}</span>
      <button onClick={() => setShow(false)} style={closeButtonStyle}>&times;</button>
    </div>
  );
};

export default ToastNotification;


