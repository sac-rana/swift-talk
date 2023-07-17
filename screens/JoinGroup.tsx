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
import { GroupChatRoom } from '../utils/types';
import { getRoom } from '../utils/firebase';

type Props = NativeStackScreenProps<RootStackParamList, 'JoinGroup'>;

const JoinGroup = ({
  navigation,
  route: {
    params: { type },
  },
}: Props) => {
  const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedRoom, setScannedRoom] = useState<GroupChatRoom | null>(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data: id }: BarCodeScannerResult) => {
    setScanned(true);
    const room = await getRoom(id);
    if (room.type === 'individual') return;
    setScannedRoom(room);
  };

  const joinGroup = async () => {
    if (!scannedRoom) return;
    await firestore()
      .collection<FIRESTORE.ROOM>('rooms')
      .doc(scannedRoom.id)
      .update({
        participants: firestore.FieldValue.arrayUnion(auth().currentUser!.uid),
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
            {scannedRoom ? (
              <Surface elevation={4}>
                <Avatar.Image
                  size={120}
                  source={{ uri: scannedRoom.photo }}
                  style={{ marginBottom: 10 }}
                />
                <Text style={{ marginBottom: 20 }}>{scannedRoom.name}</Text>
                <Text>{scannedRoom.participants.length + 1} Participants</Text>
                <Button mode='contained' onPress={joinGroup}>
                  <Text>Join Group</Text>
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

export default JoinGroup;
