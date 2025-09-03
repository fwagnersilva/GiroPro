import * as Haptics from 'expo-haptics';

export const triggerHaptic = (type: Haptics.ImpactFeedbackStyle | Haptics.NotificationFeedbackType) => {
  if (Haptics.isSupported()) {
    switch (type) {
      case Haptics.ImpactFeedbackStyle.Light:
      case Haptics.ImpactFeedbackStyle.Medium:
      case Haptics.ImpactFeedbackStyle.Heavy:
        Haptics.impactAsync(type);
        break;
      case Haptics.NotificationFeedbackType.Success:
      case Haptics.NotificationFeedbackType.Warning:
      case Haptics.NotificationFeedbackType.Error:
        Haptics.notificationAsync(type);
        break;
      default:
        Haptics.selectionAsync();
        break;
    }
  }
};

export const HapticFeedbackTypes = Haptics.ImpactFeedbackStyle;
export const HapticNotificationTypes = Haptics.NotificationFeedbackType;


