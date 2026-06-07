import Toast from 'react-native-toast-message';

export const showToast = {
  success: (message: string, duration = 3000) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
      visibilityTime: duration,
      autoHide: true,
      bottomOffset: 40,
    });
  },
  error: (message: string, duration = 3000) => {
    Toast.show({
      type: 'error',
      text1: message,
      position: 'bottom',
      visibilityTime: duration,
      autoHide: true,
      bottomOffset: 40,
    });
  },
  info: (message: string, duration = 3000) => {
    Toast.show({
      type: 'info',
      text1: message,
      position: 'bottom',
      visibilityTime: duration,
      autoHide: true,
      bottomOffset: 40,
    });
  },
};
