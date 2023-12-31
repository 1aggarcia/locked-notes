import { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LoginInfo, getLogin } from './util/file-service';
import { isDarkMode } from './util/styles';

import Loading from './components/screens/Loading';
import CreatePin from './components/screens/CreatePin';
import Locked from './components/screens/Locked';
import Denied from './components/screens/Denied';
import Unlocked from './components/screens/Unlocked';
import { StatusBar } from 'expo-status-bar';

type Window = 'Loading' | 'CreatePin' | 'Denied' | 'Locked' | 'Unlocked';

export default function App() {
  const [window, setWindow] = useState<Window>('Loading');
  const [login, setLogin] = useState<LoginInfo>();

  function loginHandler(login: LoginInfo | null) {
    if (login) {
      setLogin(login);
      setWindow('Locked');
    } else {
      // Login info was not found: send user to make a PIN
      setWindow('CreatePin');
    }
  }

  // Load login details from local storage
  useEffect(() => {
    getLogin()
      .then(loginHandler)
      .catch(error => alert(error));
  }, [])

  function Screens() {
    switch (window) {
      case 'Loading':
        return <Loading />;
      case 'Denied':
        return <Denied />;
      case 'CreatePin':
        return <CreatePin unlock={() => setWindow('Unlocked')} />;
      case 'Unlocked':
        return <Unlocked lock={() => setWindow('Locked')}/>;
      case 'Locked':
        if (login === undefined) {
          throw Error("Bad state: missing login info");
        }
        return (
          <Locked 
            login={login}
            unlock={() => setWindow('Unlocked')}
            denyAccess={() => setWindow('Denied')}
          />
        );
    }
  }

  return (<>
    <SafeAreaProvider>
      {Screens()}
      <StatusBar style={isDarkMode? 'light' : 'dark'}/>
    </SafeAreaProvider>
  </>)
}
