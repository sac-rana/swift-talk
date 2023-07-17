import { useQuery, useQueryClient } from '@tanstack/react-query';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import type { FIRESTORE } from './firebase.types';
import { useEffect } from 'react';
import { getRoom, getUser } from './firebase';
import { Invitation } from './types';

const useInvitaions = () =>
  useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const data = await firestore()
          .collection<FIRESTORE.Invitation>('invitations')
          .where('recipient', '==', auth().currentUser!.uid)
          .get()
      const invitations = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return invitations;
    },
  });

type Message = Omit<FIRESTORE.MESSAGE, 'createdAt'> & {
  createdAt: FirebaseFirestoreTypes.Timestamp | null;
};

const useChatsSubscription = (roomId: string) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = firestore()
      .collection<Message>('messages')
      .where('room', '==', roomId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          snapshot.docChanges().forEach(d => {
            d.doc.
          })
          const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate().toJSON(),
            };
          });
          queryClient.setQueryData(['chats', roomId], messages);
        },
        error => console.log('error', error),
      );
    return unsubscribe;
  }, [queryClient, roomId]);
};

const useChats = (roomId: string) => {
  return useQuery({
    queryKey: ['chats', roomId],
    queryFn: async () => {
      const data = (
        await firestore()
          .collection<Message>('messages')
          .where('room', '==', roomId)
          .orderBy('createdAt', 'desc')
          .get()
      ).docs;
      const messages = data.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toJSON(),
        };
      });
      return messages;
    },
    staleTime: Infinity,
  });
};

const useRoomsSubscription = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = firestore()
      .collection<FIRESTORE.ROOM>('rooms')
      .where('participants', 'array-contains', auth().currentUser!.uid)
      .onSnapshot(async snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const rooms = [];
        for (let room of data) {
          if (room.type === 'individual') {
            const otherId = room.participants.filter(
              id => id != auth().currentUser!.uid,
            )[0];
            const other = await getUser(otherId);
            rooms.push({ id: room.id, type: room.type, other });
          } else rooms.push(room);
        }
        queryClient.setQueryData(['rooms'], rooms);
      });
    return unsubscribe;
  }, []);
};

const useRooms = () =>
  useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const data = (
        await firestore()
          .collection<FIRESTORE.ROOM>('rooms')
          .where('participants', 'array-contains', auth().currentUser!.uid)
          .get()
      ).docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const rooms = [];
      for (let room of data) {
        if (room.type === 'individual') {
          const otherId = room.participants.filter(
            id => id != auth().currentUser!.uid,
          )[0];
          const other = await getUser(otherId);
          rooms.push({ id: room.id, type: room.type, other });
        } else rooms.push(room);
      }
      return rooms;
    },
    staleTime: Infinity,
  });

export {
  useInvitaions,
  useUser,
  useChatsSubscription,
  useChats,
  useRoomsSubscription,
  useRooms,
  useMyUser,
};

const useContactsSubscription = () => {
  
}