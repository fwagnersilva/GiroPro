import { Platform, Alert as RNAlert } from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export const Alert = {
  alert: (
    title: string, 
    message?: string, 
    buttons?: AlertButton[]
  ) => {
    if (Platform.OS === 'web') {
      // Para web, usar window.confirm ou window.alert
      if (buttons && buttons.length > 1) {
        const result = window.confirm(`${title}\n${message || ''}`);
        if (result && buttons[0]?.onPress) {
          buttons[0].onPress();
        } else if (!result && buttons[1]?.onPress) {
          buttons[1].onPress();
        }
      } else {
        window.alert(`${title}${message ? '\n' + message : ''}`);
        if (buttons && buttons[0]?.onPress) {
          buttons[0].onPress();
        }
      }
    } else {
      // Para mobile, usar Alert nativo do React Native
      RNAlert.alert(title, message, buttons);
    }
  }
};

export default Alert;

