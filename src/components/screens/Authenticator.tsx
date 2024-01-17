/** Manage PIN creation & authentication */

import { useState, useEffect } from "react";

import { LoginInfo } from "../../util/file-service";

import CreatePin from './CreatePin';
import Denied from './Denied';
import Locked from './Locked';
import Unlocked from './Unlocked';

const maxSeconds = 30;
const msPerSecond = 1000;

type Mode = 'Denied' | 'Locked' | 'Unlocked';

interface AuthenticatorProps {
    // We allow an undefined login to signal that
    // the user should be prompted to create a PIN
    login: LoginInfo | undefined;
}

export default function Authenticator(props: AuthenticatorProps) {
    const [mode, setMode] = useState<Mode>('Locked');
    const [login, setLogin] = useState(props.login);
    const [expirationTime, setExpirationTime] = useState(0);

    function updateLogin(newLogin: LoginInfo) {
        setLogin(newLogin);
        unlock();
    }

    function unlock() {
        setExpirationTime(Date.now() + maxSeconds * msPerSecond);
        setMode('Unlocked');
    }

    if (login === undefined)
        return <CreatePin updateLogin={updateLogin} />;
    
    switch (mode) {
        case 'Denied':
            return <Denied />;
        case 'Unlocked':
            return <Unlocked 
                lock={() => setMode('Locked')}
                expirationTime={expirationTime}
            />;
        case 'Locked':
            return <Locked 
                login={login}
                unlock={unlock}
                denyAccess={() => setMode('Denied')}
            />;
      }
}