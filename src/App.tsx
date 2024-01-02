import { useState, useEffect } from 'react';
import { StatusBar, View } from 'react-native';

import styles from './modules/styles';

import Navigation from './wrappers/Navigation';
import CreatePin from './pages/CreatePin';
import Loading from './pages/Loading';
import { loginExistsAsync } from './modules/file-service';

type Window = 'Loading' | 'Navigation' | 'CreatePin'

export default function App() {
  const [window, setWindow] = useState<Window>('Loading');

  // Find out if pin has been previously created
  useEffect(
    () => {
      async function loadLogin() {
        if (await loginExistsAsync()) {
          setWindow('Navigation');
        } else {
          setWindow('CreatePin');
        }
      }
      loadLogin();
    }
  , [])

  return (
    <View style={styles.app}>
      <StatusBar />
      {window === 'Loading' && <Loading />}
      {window === 'Navigation' && <Navigation goToCreatePin={() => setWindow('CreatePin')} />}
      {window === 'CreatePin' && <CreatePin goToNavigation={() => setWindow('Navigation')} />}
    </View>
  );
}
