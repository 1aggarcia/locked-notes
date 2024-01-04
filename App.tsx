import { useState } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';

import styles from './src/modules/styles';

import Navigation from './src/wrappers/Navigation';
import CreatePin from './src/pages/CreatePin';

type Window = 'Navigation' | 'CreatePin'

export default function App() {
  const [window, setWindow] = useState<Window>('Navigation');

  return (
    <View style={styles.app}>
      <StatusBar barStyle='default' />
      <SafeAreaView style={styles.app}>
        {window === 'Navigation' && <Navigation goToCreatePin={() => setWindow('CreatePin')} />}
        {window === 'CreatePin' && <CreatePin goToNavigation={() => setWindow('Navigation')} />}
      </SafeAreaView>
    </View>
  );
}
