/** Manage PIN creation & authentication */

import { useState, useEffect } from "react";

import {
    LoginInfo,
    getAccessTimeAsync,
    getSettingsAsync,
    setAccessTimeAsync
} from "../../util/storage/securestore";
import { calculateExpiryTime } from "../../util/services/datetime";
import showErrorDialog from "../../util/error";

import CreatePin from './CreatePin';
import Denied from './Denied';
import Locked from './Locked';
import Unlocked from './Unlocked';
import Loading from "./Loading";
import { useLogin, useSetLogin } from "../../contexts/loginContext";

type Mode = 'Locked' | 'Unlocked' | 'Denied' | 'Loading';

// Maximum number of seconds for which the app may be unlocked
const defaultUnlockedTime = 600;

// Number of seconds to deny access for
const denyAccessSeconds = 300;

interface AuthenticatorProps {
    // We allow an undefined login to signal that
    // the user should be prompted to create a PIN
    login: LoginInfo | undefined;
}

export default function Authenticator() {
    const loginState = useLogin();
    const setLogin = useSetLogin(); 
    const [mode, setMode] = useState<Mode>('Loading');
    const [unlockedTime, setUnlockedTime] = useState(defaultUnlockedTime);

    function updateLogin(newLogin: LoginInfo) {
        setLogin({ login: newLogin, status: "Defined" });
        setMode('Unlocked');
    }

    /** Set the access time to a future time, then lock the user out */
    function denyAccess() {
        setAccessTimeAsync(calculateExpiryTime(denyAccessSeconds))
            .catch(showErrorDialog)
            // Doesn't matter if the expiry time was properly saved or not,
            // locally the user should still be locked out
            .finally(() => setMode('Denied'))
    }
    
    /** Deny or allow user access based on the given timestamp */
    function verifyAccess(timestamp: Date) {
        if (Date.now() < timestamp.getTime()) {
            setMode('Denied');
        } else {
            setMode('Locked');
        }
    }

    // Deny access to the app if the current time is before
    // the access time
    async function loadDependencies() {
        try {
            const settings = await getSettingsAsync();
            const accessTime = await getAccessTimeAsync();

            setUnlockedTime(settings.unlockedTime);
            verifyAccess(accessTime);
        } catch (error) {
            showErrorDialog(error);
        }
    }

    useEffect(() => { loadDependencies() }, []);

    if (loginState.status === "Loading")
        return <Loading message="Fetching app settings..."/>

    if (loginState.status === "Undefined")
        return <CreatePin updateLogin={updateLogin} />;
    
    switch (mode) {
        case 'Loading':
            return <Loading message='Verifying access...' />;
        case 'Denied':
            return <Denied />;
        case 'Unlocked':
            return (
                <Unlocked
                    expiryTime={calculateExpiryTime(unlockedTime)}
                    lock={() => setMode('Locked')}
                />
            );
        case 'Locked':
            return (
                <Locked
                    unlock={() => setMode('Unlocked')}
                    denyAccess={denyAccess}
                />
            );
      }
}
