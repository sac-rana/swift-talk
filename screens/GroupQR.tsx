import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Image } from 'expo-image';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupQR'>;
const GroupQR = ({
  route: {
    params: { room },
  },
}: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: room.photo }}
        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 16 }}
      />
      <QRCode value={room.id} size={200} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroupQR;
