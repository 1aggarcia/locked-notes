/** Manage PIN creation & authentication */

import { useState, useEffect } from "react";

import {
    LoginInfo,
    getAccessTimeAsync,
    getSettingsAsync,
    setAccessTimeAsync
} from "../shared/services/securestore";
import { calculateExpiryTime } from "../shared/util/datetime";
import showErrorDialog from "../shared/util/error";
import { useLogin, useSetLogin } from "../shared/contexts/loginContext";

import CreatePin from '../settings/CreatePin';
import Denied from '../access/Denied';
import Locked from '../access/Locked';
import Unlocked from '../access/Unlocked';
import Loading from "./Loading";
import { useTranslation } from "../shared/contexts/settingsContext";
import { layoutText } from "./layoutText";

type Mode = 'Locked' | 'Unlocked' | 'Denied' | 'Loading';

// Maximum number of seconds for which the app may be unlocked
const defaultUnlockedTime = 600;

// Number of seconds to deny access for
const denyAccessSeconds = 300;

/**
 * Main component for the app layout, to be wrapped in
 * various contexts in the `App.tsx` entry point
 */
export default function AppLayout() {
    const loginState = useLogin();
    const setLogin = useSetLogin();
    const text = useTranslation(layoutText);
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
        return <Loading message={text.FETCHING_APP_SETTINGS}/>

    if (loginState.status === "Undefined")
        return <CreatePin updateLogin={updateLogin} />;
    
    switch (mode) {
        case 'Loading':
            return <Loading message={text.VERIFYING_ACCESS} />;
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
