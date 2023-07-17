import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import type { FIRESTORE } from '../utils/firebase.types';
import { useState } from 'react';

GoogleSignin.configure({
  webClientId:
    '816176597858-dirfndqbhshseq8up66m2fkj0knempfl.apps.googleusercontent.com',
});

const Signin = () => {
  const [signInWith, setSignInWith] = useState<'google' | null>(null);
  async function signInWithGoogle() {
    setSignInWith('google');
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken, user } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);
    if (userCredential.additionalUserInfo?.isNewUser) {
      await firestore()
        .collection<FIRESTORE.USER>('users')
        .doc(userCredential.user.uid)
        .set({
          name: user.name ?? user.email,
          photo:
            user.photo ??
            'https://firebasestorage.googleapis.com/v0/b/swift-talk-aa33d.appspot.com/o/account.png?alt=media&token=8b738bcf-bdc9-4630-b368-1f2dcb545bb2',
          about: 'Hey',
        });
    }
  }
  return (
    <View style={styles.container}>
      <Button
        onPress={signInWithGoogle}
        icon={'google'}
        mode='elevated'
        loading={signInWith === 'google'}
        style={styles.button}
      >
        <Text>Signin with Google</Text>
      </Button>
      <Button icon={'phone'} mode='elevated' style={styles.button}>
        <Text>Signin with Phone</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    marginBottom: 20,
  },
});

export default Signin;
