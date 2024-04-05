import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { LoginInfo, getLoginAsync, getSettingsAsync } from './util/storage/securestore';
import Styles from './util/services/styles';
import showErrorDialog from './util/error';

import Authenticator from './components/screens/Authenticator';
import Loading from './components/screens/Loading';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [login, setLogin] = useState<LoginInfo>();
  
  async function loadSettingsAsync() {
    try {
      const settings = await getSettingsAsync();
      const savedLogin = await getLoginAsync();

      Styles.setColorTheme(settings.darkMode, settings.lowContrast);
      if (savedLogin !== null)
        setLogin(savedLogin);

      setLoaded(true);
    } catch (error) {
      showErrorDialog(error);
    }
  }

  useEffect(() => {
    loadSettingsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      {loaded? <>
        <Authenticator login={login} />
        <StatusBar style={Styles.isDarkMode()? 'light' : 'dark'}/>
        </>
        :
        <Loading message='Fetching app settings...' />
      }

    </SafeAreaProvider>
  )
}
