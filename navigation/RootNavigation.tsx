import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import HomeHeader from '../components/HomeHeader';
import Home from '../screens/Home';
import { QueryClient } from '@tanstack/react-query';
import type { RootStackParamList } from './types';
import Invitations from '../screens/Invitaions';
import QRInvite from '../screens/QRInvite';
import ScanQR from '../screens/ScanQR';
import Profile from '../screens/Profile';
import Chat from '../screens/Chat';
import EditProfile from '../screens/EditProfile';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatHeader from '../components/ChatHeader';
import CreateGroup from '../screens/CreateGroup';
import JoinGroup from '../screens/JoinGroup';
import Header from '../components/Header';
import { RealmContext } from '../utils/realm';

const Stack = createNativeStackNavigator<RootStackParamList>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
    },
  },
});

const asyncPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const AppNavigation = () => {
  const theme = useTheme();
  const { RealmProvider } = RealmContext;
  return (
    <RealmProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncPersister }}
      >
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ header: Header }}>
            <Stack.Screen
              name='Home'
              component={Home}
              options={{
                title: 'Home',
                header: HomeHeader,
              }}
            />
            <Stack.Screen name='Invitations' component={Invitations} />
            <Stack.Screen name='QRInvite' component={QRInvite} />
            <Stack.Screen name='ScanQR' component={ScanQR} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='EditProfile' component={EditProfile} />
            <Stack.Screen
              name='Chat'
              component={Chat}
              options={{
                header: ChatHeader,
              }}
            />
            <Stack.Screen
              name='CreateGroup'
              component={CreateGroup}
              options={{ title: 'Create Group' }}
            />
          </Stack.Navigator>
          <Stack.Screen
            name='JoinGroup'
            component={JoinGroup}
            options={{ title: 'Join Group' }}
          />
        </NavigationContainer>
      </PersistQueryClientProvider>
    </RealmProvider>
  );
};

export default AppNavigation;
