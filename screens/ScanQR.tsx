import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Modal,
  Portal,
  Provider,
  Surface,
  Text,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { FIRESTORE } from '../utils/firebase.types';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getUser } from '../utils/firebase';
import { User } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanQR'>;

const ScanQR = ({
  navigation,
  route: {
    params: { type },
  },
}: Props) => {
  const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedUser, setScannedUser] = useState<User | null>(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data: uid }: BarCodeScannerResult) => {
    setScanned(true);
    setScannedUser(await getUser(uid));
  };

  const sendRequest = async () => {
    if (!scannedUser) return;
    const ref = await firestore().collection<FIRESTORE.ROOM>('rooms').add({
      type: 'individual',
      participants: [],
    });
    await firestore().collection<FIRESTORE.INVITATION>('invitations').add({
      sender: auth().currentUser!.uid,
      recipient: scannedUser.id,
      room: ref.id,
    });
    navigation.navigate('Home');
  };

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant='titleLarge'>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View style={styles.container}>
        <Portal>
          <Modal
            visible={scanned}
            contentContainerStyle={{
              backgroundColor: 'white',
              margin: 20,
              padding: 10,
              marginHorizontal: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {scannedUser ? (
              <Surface elevation={4}>
                <Avatar.Image
                  size={120}
                  source={{ uri: scannedUser.photo }}
                  style={{ marginBottom: 10 }}
                />
                <Text style={{ marginBottom: 20 }}>{scannedUser.name}</Text>
                <Button mode='contained' onPress={sendRequest}>
                  <Text>Send Request</Text>
                </Button>
              </Surface>
            ) : (
              <ActivityIndicator size={'small'} />
            )}
          </Modal>
        </Portal>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScanQR;
