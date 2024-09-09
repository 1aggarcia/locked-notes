import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import {
  LoginInfo,
  getLoginAsync,
} from './util/storage/securestore';
import showErrorDialog from './util/error';

import Authenticator from './components/screens/Authenticator';
import Loading from './components/screens/Loading';
import { StylesProvider, useStyles } from './contexts/stylesContext';
import AppStatusBar from './components/shared/AppStatusBar';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [login, setLogin] = useState<LoginInfo>();
  
  async function loadLogin() {
    try {
      const savedLogin = await getLoginAsync();
      if (savedLogin !== null)
        setLogin(savedLogin);

      setLoaded(true);
    } catch (error) {
      showErrorDialog(error);
    }
  }

  useEffect(() => {
    loadLogin();
  }, []);

  return (
    <SafeAreaProvider>
      <StylesProvider>
        {loaded? <>
          <Authenticator login={login} />
          <AppStatusBar />
          </>
          :
          <Loading message='Fetching app settings...' />
        }
      </StylesProvider>
    </SafeAreaProvider>
  )
}
