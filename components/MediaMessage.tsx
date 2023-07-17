import { Message } from '../utils/types';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { Image } from 'expo-image';

type Props = {
  message: Message;
};
const MediaMessage = ({ message }: Props) => {
  const myMsg = message.sender === auth().currentUser!.uid;
  return (
    <View
      style={[
        styles.container,
        {
          alignItems: myMsg ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <View
        style={[
          styles.msg,
          {
            backgroundColor: myMsg ? 'blue' : 'green',
          },
          myMsg
            ? {
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
              }
            : {
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10,
              },
        ]}
      >
        {message.text ? <Text>{message.text}</Text> : null}
        <Image
          style={{ flex: 1, width: 200, height: 250 }}
          source={{ uri: message.file }}
        />
        {message.createdAt && (
          <Text style={{ fontSize: 10, color: 'white' }}>{`\n${new Date(
            message.createdAt,
          ).getHours()}:${new Date(message.createdAt).getMinutes()}`}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 2,
  },
  msg: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 15,
  },
});

export default MediaMessage;
