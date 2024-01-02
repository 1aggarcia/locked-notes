import { useState, useEffect } from 'react'

import { getLoginInfo } from '../modules/file-service';

import Unlocked from "./Unlocked";
import Locked from '../pages/Locked';
import Denied from '../pages/Denied';
import Loading from '../pages/Loading';

type Page = 'Denied' | 'Locked' | 'Unlocked' | 'Loading'

interface NavigationProps {
    // Callback function to navigate to create pin page
    goToCreatePin: () => void
}

export default function Navigation(props: NavigationProps) {
    const [page, setPage] = useState<Page>('Loading');
    const [hash, setHash] = useState<string>();
    const [salt, setSalt] = useState<string>();

    // Load hash and salt from local storage
    useEffect(() => {
        async function loadLogin() {
            const loginInfo = await getLoginInfo();

            if (loginInfo === null) {
                // Pin does not exist: send user to make one
                props.goToCreatePin();
            } else {
                setHash(loginInfo.hash);
                setSalt(loginInfo.salt);
                setPage('Locked');
            }
        }
        loadLogin();
    }, [])

    return (<>
        {page === 'Loading' && <Loading />}
        {page === 'Denied' && <Denied />}
        {page === 'Locked' && hash !== undefined && salt !== undefined &&
            <Locked 
                hash={hash}
                salt={salt}
                unlock={() => setPage('Unlocked')} 
                denyAccess={() => setPage('Denied')} 
            />
        }
        {page === 'Unlocked' &&
            <Unlocked 
                page='NoteList'
                lock={() => setPage('Locked')}
                denyAccess={() => setPage('Denied')}
            />
        }
    </>)
}