/** Manage PIN creation & authentication */

import { useState } from "react";

import { LoginInfo } from "../../util/file-service";

import CreatePin from './CreatePin';
import Denied from './Denied';
import Locked from './Locked';
import Unlocked from './Unlocked';

type Mode = 'Denied' | 'Locked' | 'Unlocked';

// Maximum number of seconds for which the app may be unlocked
const maxSeconds = 599;

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
        setMode('Denied');
    }

    if (login === undefined)
        return <CreatePin updateLogin={updateLogin} />;
    
    switch (mode) {
        case 'Denied':
            return <Denied />;
        case 'Unlocked':
            return <Unlocked 
                lock={() => setMode('Locked')}
                expiryTime={calculateExpiryTime(maxSeconds)}
            />;
        case 'Locked':
            return <Locked 
                login={login}
                unlock={() => setMode('Unlocked')}
                denyAccess={() => setMode('Denied')}
            />;
      }
}

/**
 * Generate a timestamp a given number of seconds in the future
 * @param seconds the number of seconds from now to generate timestamp
 * @returns timestamp with given number of seconds from now
 */
function calculateExpiryTime(seconds: number): Date {
    const msPerSec = 1000;
    const seconds_int = Math.floor(seconds);
    const timestamp = Date.now() + seconds_int * msPerSec;

    return new Date(timestamp);
}
