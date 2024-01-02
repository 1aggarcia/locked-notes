import { useState } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';

import styles from './modules/styles';

import Navigation from './wrappers/Navigation';
import CreatePin from './pages/CreatePin';

type Window = 'Navigation' | 'CreatePin'

export default function App() {
  const [window, setWindow] = useState<Window>('Navigation');

  return (
    <View style={styles.app}>
      <StatusBar />
      <SafeAreaView style={styles.app}>
        {window === 'Navigation' && <Navigation goToCreatePin={() => setWindow('CreatePin')} />}
        {window === 'CreatePin' && <CreatePin goToNavigation={() => setWindow('Navigation')} />}
      </SafeAreaView>
    </View>
  );
}
