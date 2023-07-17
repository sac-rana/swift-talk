import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FIRESTORE } from './firebase.types';

const getUser = async (id: string) => {
  const data = await firestore()
    .collection<FIRESTORE.USER>('users')
    .doc(id)
    .get();
  if (!data.exists) throw new Error(`User with this id doesn't exist.`);
  return {
    id: data.id,
    ...data.data()!,
  };
};

const getRoom = async (id: string) => {
  const data = await firestore()
    .collection<FIRESTORE.ROOM>('rooms')
    .doc(id)
    .get();
  if (!data.exists) throw new Error(`Room with this id doesn't exist`);
  return {
    id: data.id,
    ...data.data()!,
  };
};

export { getUser, getRoom };
