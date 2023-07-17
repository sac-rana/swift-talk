import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  List,
  Title,
  Caption,
  TouchableRipple,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useMyUser } from '../utils/firestore.hooks';
import firestore from '@react-native-firebase/firestore';
import { FIRESTORE } from '../utils/firebase.types';
import { useQueryClient } from '@tanstack/react-query';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList>;
const ProfileScreen = ({ navigation }: Props) => {
  const { data: user } = useMyUser();
  const queryClient = useQueryClient();
  if (!user) return null;
  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      await firestore()
        .collection<FIRESTORE.USER>('users')
        .doc(user.id)
        .update({
          photo: result.assets[0].uri,
        });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  };
  const edit = () => navigation.navigate('EditProfile');
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableRipple onPress={handleImagePicker}>
          <Avatar.Image
            size={100}
            source={{ uri: user.photo }}
            style={styles.avatar}
          />
        </TouchableRipple>
        <Title style={styles.username}>{user.name}</Title>
      </View>
      <List.Section style={styles.section}>
        <List.Subheader>Profile Info</List.Subheader>
        <List.Item
          title='Email'
          description={auth().currentUser!.email}
          left={props => <List.Icon {...props} icon='email' />}
          onPress={edit}
        />
        <List.Item
          title='Phone'
          description={user.phoneNumber}
          left={props => <List.Icon {...props} icon='phone' />}
          onPress={edit}
        />
        <List.Item
          title='About'
          description={user.about}
          left={props => <List.Icon {...props} icon='information-outline' />}
          onPress={edit}
        />
      </List.Section>
      <Button
        mode='contained'
        icon='logout'
        style={styles.logoutButton}
        onPress={() => console.log('Logout')}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    color: '#777',
  },
  section: {
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#f44336',
  },
});

export default ProfileScreen;
