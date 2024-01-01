import { useState } from 'react';
import { StatusBar, View } from 'react-native';
import styles from './modules/styles';

import Navigation from './wrappers/Navigation';
import CreatePin from './pages/CreatePin';
import { decryptData, encryptData, registerEncryptionKey } from './modules/file-service';

export default function App() {
  const [pinExists, setPinExists] = useState(false);

  const ciphertext = 'U2FsdGVkX182CfndT6dEpbu6t0QwVdgpeOgUc3aD09U='
  registerEncryptionKey({pin: '123456', salt: ''});
  alert(decryptData(ciphertext));

  return (
    <View style={styles.app}>
      <StatusBar />
      {
        pinExists?
        <Navigation goToCreatePin={() => setPinExists(false)} />
        :
        <CreatePin goToNavigation={() => setPinExists(true)} />
      }
    </View>
  );
}
