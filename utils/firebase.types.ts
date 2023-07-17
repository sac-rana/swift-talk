import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { User as U, Message as M, Group as G, Invitation as I } from './types';

namespace FIRESTORE {
  export type User = Omit<U, 'id'>;
  export type Message = Omit<M, 'id'>;
  export type Group = Omit<G, 'id'>;
  export type Invitation = Omit<I, 'id'>;
}

export type { FIRESTORE };
