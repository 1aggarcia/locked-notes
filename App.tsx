import { useState, useEffect } from 'react';

import { LoginInfo, getLogin } from './src/modules/file-service';

import Loading from './src/windows/Loading';
import CreatePin from './src/windows/CreatePin';
import Locked from './src/windows/Locked';
import Denied from './src/windows/Denied';
import Unlocked from './src/windows/Unlocked';

type Window = 'Loading' | 'CreatePin' | 'Denied' | 'Locked' | 'Unlocked';

export default function App() {
  const [window, setWindow] = useState<Window>('Loading');
  const [login, setLogin] = useState<LoginInfo>();

  function loadLogin(login: LoginInfo | null) {
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
      .then(loadLogin)
      .catch(error => alert(error));
  }, [])

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
