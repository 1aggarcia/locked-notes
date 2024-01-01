import { useState, useEffect } from 'react'
import Unlocked from "./Unlocked";
import Locked from '../pages/Locked';
import Denied from '../pages/Denied';

const maxTime = 300;

type Page = 'Denied' | 'Locked' | 'Unlocked'

interface NavigationProps {
    // Callback function to navigate to create pin page
    goToCreatePin: () => void
}

export default function Navigation(props: NavigationProps) {
    const [page, setPage] = useState<Page>('Unlocked');
    const [timeOpen, setTimeOpen] = useState(maxTime);

    // Countdown until reaching 0 seconds
    useEffect(() => {
        setTimeout(() => {
        if (timeOpen > 0) {
            setTimeOpen(timeOpen - 1);
        }
        }, 1000)
    });

    return (<>
        {page === 'Denied' && <Denied />}
        {page === 'Locked' && 
            <Locked 
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