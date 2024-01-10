import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { LoginInfo, getLoginAsync } from './util/file-service';
import { isDarkMode } from './util/styles';

import Authenticator from './components/screens/Authenticator';
import Loading from './components/screens/Loading';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [login, setLogin] = useState<LoginInfo>();
  
  function handleGetLogin(login: LoginInfo | null) {
    if (login) {
      setLogin(login);
    }
    setLoaded(true);
  }
  
  useEffect(() => {
    getLoginAsync()
      .then(handleGetLogin)
      .catch(error => alert(error));
  }, [])

  return (<>
    <SafeAreaProvider>
      {loaded?
        <Authenticator login={login} />
        :
        <Loading />
      }
      <StatusBar style={isDarkMode? 'light' : 'dark'}/>
    </SafeAreaProvider>
  </>)
}
