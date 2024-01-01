import { useState } from 'react';
import { View } from 'react-native';

import AppText from '../components/AppText';

import NoteView from '../pages/NoteView';
import NoteList from '../pages/NoteList';
import Settings from '../pages/Settings';
import ResetPin from '../pages/ResetPin';

const secondsInMinute = 60;
const newLines = 'top\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nbottom'

const note = {title: 'Título', body: newLines, dateCreated: '', dateModified: ''}

export interface UnlockedProps {
    page: 'NoteList' | 'NoteView' | 'Settings' | 'ResetPin';
    timeOpen: number;
    // Callback function to set nav page to access denied
    denyAccess: () => void;
}

export default function Unlocked(props: UnlockedProps) {
    const [page, setPage] = useState(props.page);

    return (
        <View style={{flex: 1}}>
            <AppText>Unlocked time: {formatTime(props.timeOpen)}</AppText>
            {page === 'NoteList' && <NoteList />}
            {page === 'NoteView' && <NoteView note={note}/>}
            {page === 'Settings' && <Settings />}
            {page === 'ResetPin' && <ResetPin />}
        </View>
    )
}

/**
 * Convert seconds to string representing MM:SS
 * @param seconds number of seconds to count. Must be < 3600
 */
function formatTime(seconds: number): string {
    if (seconds >= 3600) {
        throw RangeError(`seconds >= 3600: ${seconds}`);
    }

    const minutes = Math.floor(seconds / secondsInMinute);
    const leftOver = seconds % secondsInMinute;

    // account for leading zero    
    if (leftOver < 10) {
        return `${minutes}:0${leftOver}`
    } else {
        return `${minutes}:${leftOver}`
    }
}
