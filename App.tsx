import { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';

import { getLoginInfo } from './src/modules/file-service';
import Loading from './src/windows/Loading';
import CreatePin from './src/windows/CreatePin';
import Locked from './src/windows/Locked';
import Denied from './src/windows/Denied';
import Unlocked from './src/windows/Unlocked';

type Window = 'Loading' | 'CreatePin' | 'Denied' | 'Locked' | 'Unlocked';

export default function App() {
  const [window, setWindow] = useState<Window>('Loading');
  const [loginHash, setLoginHash] = useState<string>();
  const [loginSalt, setLoginSalt] = useState<string>();

  async function loadLogin() {
    const loginInfo = await getLoginInfo();

    if (loginInfo === null) {
        // Pin does not exist: send user to make one
        setWindow('CreatePin');
    } else {
      setLoginHash(loginInfo.hash);
      setLoginSalt(loginInfo.salt);
      setWindow('Locked');
    }
  }

  // Load hash and salt from local storage
  useEffect(() => { 
    loadLogin();
  }, [])

  switch (window) {
    case 'Loading':
      return <Loading />;
    case 'CreatePin':
      return <CreatePin unlock={() => setWindow('Unlocked')} />;
    case 'Denied':
      return <Denied />;
    case 'Locked':
      if (loginHash === undefined || loginSalt === undefined) {
        throw Error("Bad state: missing login info");
      }
      return (
        <Locked 
          hash={loginHash}
          salt={loginSalt}
          unlock={() => setWindow('Unlocked')}
          denyAccess={() => setWindow('Denied')}
        />
      );
    case 'Unlocked':
      return <Unlocked lock={() => setWindow('Locked')}/>;
  }
}
