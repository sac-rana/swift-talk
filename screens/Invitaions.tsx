import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Button, List, Text } from 'react-native-paper';
import { useInvitaions } from '../utils/firestore.hooks';
import Loading from './Loading';
import Error from './Error';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FIRESTORE } from '../utils/firebase.types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useQueryClient } from '@tanstack/react-query';

type Props = NativeStackScreenProps<RootStackParamList>;
const Invitations = ({ navigation }: Props) => {
  const { isLoading, error, data: invitations } = useInvitaions();
  const queryClient = useQueryClient();
  if (isLoading) return <Loading />;
  if (error || !invitations) return <Error />;
  const acceptInvite = async (invite: typeof invitations[number]) => {
    await firestore()
      .collection<FIRESTORE.ROOM>('rooms')
      .doc(invite.room.id)
      .update({
        participants: firestore.FieldValue.arrayUnion(
          auth().currentUser!.uid,
          invite.sender.id,
        ),
      });
    await firestore()
      .collection<FIRESTORE.INVITATION>('invitations')
      .doc(invite.id)
      .delete();
    queryClient.invalidateQueries({ queryKey: ['rooms'] });
    navigation.navigate('Home');
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        {invitations.map(invite => {
          if (invite.room.type === 'individual') {
            return (
              <List.Item
                key={invite.id}
                title={invite.sender.name}
                left={props => (
                  <Avatar.Image
                    {...props}
                    source={{ uri: invite.sender.photo }}
                  />
                )}
                right={props => (
                  <Button {...props} onPress={() => acceptInvite(invite)}>
                    Accept
                  </Button>
                )}
              />
            );
          }
          const room = invite.room;
          return (
            <List.Item
              title={room.name}
              left={props => (
                <Avatar.Image {...props} source={{ uri: room.photo }} />
              )}
              right={props => (
                <Button {...props} onPress={() => acceptInvite(invite)}>
                  Accept
                </Button>
              )}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Invitations;
