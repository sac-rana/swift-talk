import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { FIRESTORE } from '../utils/firebase.types';
import { useMyUser } from '../utils/firestore.hooks';
import { useQueryClient } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList>;
const EditProfile = ({ navigation }: Props) => {
  const { data: user } = useMyUser();
  const [name, setName] = useState(user?.name ?? '');
  const [about, setAbout] = useState(user?.about ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');

  const queryClient = useQueryClient();

  if (!user) return null;

  const handleSave = async () => {
    await firestore()
      .collection<FIRESTORE.USER>('users')
      .doc(auth().currentUser!.uid)
      .update({
        name,
        about,
        phoneNumber,
      });
    queryClient.invalidateQueries({
      queryKey: ['users', auth().currentUser!.uid],
    });
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <TextInput
        label='Name'
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label='Phone Number'
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
      />
      <TextInput
        label='About'
        value={about}
        onChangeText={setAbout}
        style={styles.input}
        multiline
      />
      <Button style={styles.btn} mode='contained' onPress={handleSave}>
        Save Changes
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 20,
  },
  btn: {
    marginTop: 30,
  },
});

export default EditProfile;
