import { useState } from 'react';
import { StatusBar, View } from 'react-native';

import styles from './modules/styles';

import Navigation from './wrappers/Navigation';
import CreatePin from './pages/CreatePin';
import Loading from './pages/Loading';

type Window = 'Navigation' | 'CreatePin'

export default function App() {
  const [window, setWindow] = useState<Window>('Navigation');

  return (
    <View style={styles.app}>
      <StatusBar />
      {window === 'Navigation' && <Navigation goToCreatePin={() => setWindow('CreatePin')} />}
      {window === 'CreatePin' && <CreatePin goToNavigation={() => setWindow('Navigation')} />}
    </View>
  );
}
