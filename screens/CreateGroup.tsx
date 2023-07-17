import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Surface, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { FIRESTORE } from '../utils/firebase.types';
import { nanoid } from 'nanoid/async/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useMutation } from '@tanstack/react-query';
import { Image } from 'expo-image';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateGroup'>;
const CreateGroup = ({ navigation }: Props) => {
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState<string>();
  const [description, setDescription] = useState('');

  const theme = useTheme();

  const handleCreateGroup = useMutation({
    mutationFn: async () => {
      if (!groupImage || !groupName) return;
      const reference = storage().ref(`/photos/${nanoid()}`);
      await reference.putFile(groupImage);
      const url = await reference.getDownloadURL();
      await firestore()
        .collection<FIRESTORE.ROOM>('rooms')
        .add({
          type: 'group',
          admin: auth().currentUser!.uid,
          description,
          name: groupName,
          photo: url,
          participants: [auth().currentUser!.uid],
        });
      navigation.navigate('Home');
    },
  });

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      {groupImage && (
        <Image source={{ uri: groupImage }} style={styles.image} />
      )}
      <Button
        mode='contained'
        onPress={handlePickImage}
        style={{ marginBottom: 16 }}
      >
        Pick Group Image
      </Button>
      <TextInput
        label='Group Name'
        value={groupName}
        onChangeText={setGroupName}
        style={styles.formEle}
      />
      <TextInput
        label='Description'
        value={description}
        onChangeText={setDescription}
        style={styles.formEle}
        multiline
        numberOfLines={4}
      />
      <Button
        mode='contained'
        onPress={() => handleCreateGroup.mutate()}
        loading={handleCreateGroup.isLoading}
        disabled={handleCreateGroup.isLoading}
      >
        Create Group
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    paddingTop: 30,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 14,
    borderRadius: 80,
  },
  formEle: {
    marginBottom: 16,
    width: '100%',
  },
});

export default CreateGroup;
