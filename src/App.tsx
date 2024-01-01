import { useState } from 'react';
import { StatusBar, View } from 'react-native';
import styles from './modules/styles';

import Navigation from './wrappers/Navigation';
import CreatePin from './pages/CreatePin';

export default function App() {
  const [pinExists, setPinExists] = useState(false);

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
