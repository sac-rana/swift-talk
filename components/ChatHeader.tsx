import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Appbar, Avatar, Menu } from 'react-native-paper';
import { RootStackParamList } from '../navigation/types';

const ChatHeader = ({
  options,
  route: { params },
  back,
  navigation,
}: NativeStackHeaderProps) => {
  const room = (params as RootStackParamList['Chat']).room;
  const [visible, setVisible] = useState(false);

  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Avatar.Image
        size={32}
        source={{
          uri: room.type === 'individual' ? room.other.photo : room.photo,
        }}
        style={{ marginRight: 14 }}
      />
      <Appbar.Content
        titleStyle={{ fontSize: 18 }}
        title={room.type === 'individual' ? room.other.name : room.name}
      />
      {room.type === 'group' && (
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Appbar.Action
              icon={'dots-vertical'}
              onPress={() => setVisible(true)}
            />
          }
          anchorPosition={'top'}
        >
          <Menu.Item
            title='Show QR'
            onPress={() => {
              setVisible(false);
              navigation.navigate('GroupQR', {
                room,
              });
            }}
          />
        </Menu>
      )}
    </Appbar.Header>
  );
};

export default ChatHeader;
