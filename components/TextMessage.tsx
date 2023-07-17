import { Message } from '../utils/types';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

type Props = {
  message: Message;
};
const TextMessage = ({ message }: Props) => {
  const theme = useTheme();
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
      <Text
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
        {message.text}
        {message.createdAt && (
          <Text style={{ fontSize: 10, color: 'white' }}>{`\n${new Date(
            message.createdAt,
          ).getHours()}:${new Date(message.createdAt).getMinutes()}`}</Text>
        )}
      </Text>
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
    maxWidth: '80%',
    fontSize: 15,
  },
});

export default TextMessage;
