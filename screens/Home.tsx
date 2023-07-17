import { Surface, Text, List, Avatar, useTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useRooms, useRoomsSubscription } from '../utils/firestore.hooks';
import Loading from './Loading';
import { FlashList } from '@shopify/flash-list';

type Props = NativeStackScreenProps<RootStackParamList>;
const Home = ({ navigation }: Props) => {
  useRoomsSubscription();
  const { isLoading, error, data: rooms } = useRooms();
  const theme = useTheme();
  if (isLoading) return <Loading />;
  if (error) return null;
  if (!rooms || rooms.length === 0)
    return (
      <Surface
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text variant='headlineSmall'>You don't have any contacts.</Text>
      </Surface>
    );
  return (
    <Surface style={styles.container}>
      <FlashList
        estimatedItemSize={96}
        data={rooms}
        renderItem={({ item: room }) => {
          const name = room.type === 'individual' ? room.other.name : room.name;
          const photo =
            room.type === 'individual' ? room.other.photo : room.photo;
          return (
            // <List.Item
            //   left={props => (
            //     <Avatar.Image {...props} source={{ uri: photo }} />
            //   )}
            //   title={name}
            //   onPress={() => navigation.navigate('Chat', { room })}
            //   style={{ borderBottomWidth: 1, borderBottomColor: 'grey' }}
            // />
            <Item name={name} photo={photo} />
          );
        }}
      />
    </Surface>
  );
};

const Item = ({ name, photo }: { name: string; photo: string }) => {
  return (
    <Surface
      style={{
        flexDirection: 'row',
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <Avatar.Image source={{ uri: photo }} size={52} />
      <Text>{name}</Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;
