import { useState, useRef, useEffect, LegacyRef } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { TextInput, IconButton, useTheme } from 'react-native-paper';
import { FIRESTORE } from '../utils/firebase.types';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import * as DocumentPicker from 'expo-document-picker';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { FlashList } from '@shopify/flash-list';
import { useChats, useChatsSubscription } from '../utils/firestore.hooks';
import Loading from './Loading';
import TextMessage from '../components/TextMessage';
import MediaMessage from '../components/MediaMessage';
import { nanoid } from 'nanoid/async/index';
import * as ImagePicker from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen = ({
  route: {
    params: { room },
  },
}: Props) => {
  useChatsSubscription(room.id);
  const { isLoading, data: messages = [] } = useChats(room.id);

  const [newMessage, setNewMessage] = useState('');
  const theme = useTheme();

  if (isLoading) return <Loading />;
  if (!messages) {
    return null;
  }

  const handleSendMessage = async () => {
    const msg = newMessage.trim();
    if (msg === '') return;
    await firestore().collection<FIRESTORE.MESSAGE>('messages').add({
      text: msg,
      sender: auth().currentUser!.uid,
      room: room.id,
      file: '',
      type: 'text',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    setNewMessage('');
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!result.canceled) {
      const reference = storage().ref(`/messages/${nanoid()}`);
      const task = reference.putFile(result.assets[0].uri);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(async () => {
        const url = await reference.getDownloadURL();
        await firestore()
          .collection<
            Omit<FIRESTORE.MESSAGE, 'createdAt'> & {
              createdAt: FirebaseFirestoreTypes.FieldValue;
            }
          >('messages')
          .add({
            type: 'image',
            text: '',
            file: url,
            sender: auth().currentUser!.uid,
            room: room.id,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
      });
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === 'success') {
        const filename = result.name;
        const extension = filename.substring(filename.lastIndexOf('.') + 1);
        const reference = storage().ref(`/messages/${nanoid()}.${extension}`);
        const task = reference.putFile(result.uri);
        task.on('state_changed', taskSnapshot => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
        });
        task.then(async () => {
          const url = await reference.getDownloadURL();
          await firestore().collection<FIRESTORE.MESSAGE>('messages').add({
            type: 'document',
            text: '',
            file: url,
            sender: auth().currentUser!.uid,
            room: room.id,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = async (uri: string) => {
    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      FileSystem.documentDirectory + 'a.txt',
      {},
    );

    try {
      const result = await downloadResumable.downloadAsync();
      if (result) {
        console.log('Finished downloading to ', result.uri);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlashList
        data={messages}
        renderItem={({ item: message }) =>
          message.file ? (
            <MediaMessage message={message} />
          ) : (
            <TextMessage message={message} />
          )
        }
        keyExtractor={item => item.id}
        estimatedItemSize={100}
        inverted={true}
      />
      <KeyboardAvoidingView style={styles.footer} behavior='height'>
        <TextInput
          value={newMessage}
          onChangeText={value => setNewMessage(value)}
          style={styles.input}
          onSubmitEditing={handleSendMessage}
          multiline={true}
        />
        {!newMessage ? (
          <>
            <IconButton
              style={{ margin: 0, padding: 0 }}
              iconColor={theme.colors.secondary}
              icon='camera'
              onPress={handleImagePicker}
            />
            {/* <IconButton
              style={{ margin: 0, padding: 0 }}
              icon='file-document'
              onPress={() => handlePickDocument('document')}
            /> */}
          </>
        ) : null}
        <IconButton
          style={{
            margin: 0,
            padding: 0,
          }}
          iconColor={theme.colors.primary}
          size={30}
          icon='send-circle'
          onPress={handleSendMessage}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 5,
  },
});

export default ChatScreen;
