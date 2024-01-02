import { useState, useEffect } from 'react'

import { deletePinAsync, getLoginInfo } from '../modules/file-service';

import Unlocked from "./Unlocked";
import Locked from '../pages/Locked';
import Denied from '../pages/Denied';
import Loading from '../pages/Loading';

const maxTime = 5;

type Page = 'Denied' | 'Locked' | 'Unlocked' | 'Loading'

interface NavigationProps {
    // Callback function to navigate to create pin page
    goToCreatePin: () => void
}

export default function Navigation(props: NavigationProps) {
    const [page, setPage] = useState<Page>('Loading');
    const [timeOpen, setTimeOpen] = useState(maxTime);
    const [hash, setHash] = useState<string>();
    const [salt, setSalt] = useState<string>();

    // Load hash and salt from local storage
    useEffect(() => {
        async function loadLogin() {
            const loginInfo = await getLoginInfo();

            if (loginInfo === null) {
                // Pin does not exists: send user to make one
                props.goToCreatePin();
            } else {
                setHash(loginInfo.hash);
                setSalt(loginInfo.salt);
                setPage('Locked');
            }
        }
        loadLogin();
    }, [])

    // Countdown until reaching 0 seconds
    useEffect(() => {
        setTimeout(() => {
        if (timeOpen > 0) {
            setTimeOpen(timeOpen - 1);
        } else {
            setPage('Locked')
        }
        }, 1000)
    });

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
                page='NoteView' 
                timeOpen={timeOpen} 
                denyAccess={() => setPage('Denied')}
            />
        }
    </>)
}