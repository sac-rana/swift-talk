import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import {
  Appbar,
  Menu,
  Divider,
  Avatar,
  TouchableRipple,
  Text,
} from 'react-native-paper';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { useMyUser } from '../utils/firestore.hooks';

const HomeHeader = ({ options, navigation }: NativeStackHeaderProps) => {
  const [visible, setVisible] = useState(false);
  const { data: user } = useMyUser();
  if (!user) return null;
  return (
    <Appbar.Header elevated>
      <Appbar.Content title={options.title} />
      <TouchableRipple
        onPress={() => {
          navigation.navigate('Profile');
        }}
      >
        <Avatar.Image size={36} source={{ uri: user.photo }} />
      </TouchableRipple>
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
          onPress={() => {
            setVisible(false);
            navigation.navigate('ScanQR', {});
            navigation.navigate('');
          }}
          title='Scan QR'
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            navigation.navigate('Invitations');
          }}
          title={<Text>Invitations</Text>}
        />
        <Divider />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            navigation.navigate('CreateGroup');
          }}
          title='Create group'
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            navigation.navigate('QRInvite');
          }}
          title='Show QR Invite'
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            navigation.navigate('JoinGroup');
          }}
          title='Join Group'
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            auth().signOut();
          }}
          title='Sign Out'
        />
      </Menu>
    </Appbar.Header>
  );
};

export default HomeHeader;
