import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';

const useKeyboard = () => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setShown(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setShown(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return shown;
};

export { useKeyboard };
