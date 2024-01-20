import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { LoginInfo, getLoginAsync, getSettingsAsync } from './util/services/files';
import { isDarkMode } from './util/services/styles';
import showErrorDialog from './util/error';

import Authenticator from './components/screens/Authenticator';
import Loading from './components/screens/Loading';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [login, setLogin] = useState<LoginInfo>();
  
  function handleGetLogin(login: LoginInfo | null) {
    if (login)
      setLogin(login);

    setLoaded(true);
  }
  
  // Load login and settings from device secure store on app start
  useEffect(() => {
    getLoginAsync()
      .then(handleGetLogin)
      .catch(showErrorDialog);
  }, [])

  return (
    <SafeAreaProvider>
      {loaded?
        <Authenticator login={login} />
        :
        <Loading message='Fetching login info...' />
      }
      <StatusBar style={isDarkMode()? 'light' : 'dark'}/>
    </SafeAreaProvider>
  )
}