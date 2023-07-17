import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';

const QRInvite = () => {
  return (
    <View style={styles.container}>
      <QRCode value={auth().currentUser!.uid} size={240} />
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

export default QRInvite;
