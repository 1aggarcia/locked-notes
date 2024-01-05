import { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import styles from './src/modules/styles';

import Navigation from './src/wrappers/Navigation';
import CreatePin from './src/pages/CreatePin';
import { deletePinAsync } from './src/modules/file-service';

type Window = 'Navigation' | 'CreatePin'

export default function App() {
  const [window, setWindow] = useState<Window>('Navigation');

  return (
    <NavigationContainer>
      <StatusBar barStyle='default' />
      <SafeAreaView style={styles.app}>
        {window === 'Navigation' && <Navigation goToCreatePin={() => setWindow('CreatePin')} />}
        {window === 'CreatePin' && <CreatePin goToNavigation={() => setWindow('Navigation')} />}
      </SafeAreaView>
    </NavigationContainer>
  );
}
