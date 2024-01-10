/** Manage PIN creation & authentication */

import { useState } from "react";

import { LoginInfo } from "../../util/file-service";

import CreatePin from './CreatePin';
import Denied from './Denied';
import Locked from './Locked';
import Unlocked from './Unlocked';

type Mode = 'Denied' | 'Locked' | 'Unlocked';

interface AuthenticatorProps {
    // We allow an undefined login to signal that
    // the user should be prompted to create a PIN
    login: LoginInfo | undefined;
}

export default function Authenticator(props: AuthenticatorProps) {
    const [mode, setMode] = useState<Mode>('Locked');
    const [login, setLogin] = useState(props.login);

    function updateLogin(newLogin: LoginInfo) {
        setLogin(newLogin);
        setMode('Unlocked');
    }

    if (login === undefined) {
        return <CreatePin updateLogin={updateLogin} />;
    }
    
    switch (mode) {
        case 'Denied':
            return <Denied />;
        case 'Unlocked':
            return <Unlocked lock={() => setMode('Locked')}/>;
        case 'Locked':
            return <Locked 
                login={login}
                unlock={() => setMode('Unlocked')}
                denyAccess={() => setMode('Denied')}
            />;
      }
}