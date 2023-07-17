import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import RootNavigation from './navigation/RootNavigation';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect } from 'react';
import Signin from './screens/Signin';
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);
  if (initializing) return null;
  if (!user) return <Signin />;
  return (
    <PaperProvider>
      <RootNavigation />
    </PaperProvider>
  );
}
