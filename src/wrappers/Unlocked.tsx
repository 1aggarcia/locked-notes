import { useState, useEffect } from 'react';
import { Pressable, View } from 'react-native';

import AppText from '../components/AppText';

import NoteView from '../pages/NoteView';
import NoteList from '../pages/NoteList';
import Settings from '../pages/Settings';
import ResetPin from '../pages/ResetPin';
import Note from '../modules/note';
import { getNote } from '../modules/file-service';
import styles from '../modules/styles';

// Maximum time a the app can be unlocked, in seconds
const maxTime = 300;

export interface UnlockedProps {
    page: 'NoteList' | 'NoteView' | 'Settings' | 'ResetPin';

    // Callback function to lock application
    lock: () => void;

    // Callback function to set nav page to access denied
    denyAccess: () => void;
}

export default function Unlocked(props: UnlockedProps) {
    const [page, setPage] = useState(props.page);
    const [timeOpen, setTimeOpen] = useState(maxTime)
    const [note, setNote] = useState<Note | null>(null);

    // Countdown until reaching 0 seconds
    useEffect(() => {
        setTimeout(() => {
        if (timeOpen > 1) {
            setTimeOpen(timeOpen - 1);
        } else {
            props.lock()
        }
        }, 1000)
    });

    function openNote(note: Note) {
        setNote(note);
        setPage('NoteView');
    }

    return (
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row',}}>
            <AppText>Unlocked time: {formatTime(timeOpen)}</AppText>
                <Pressable onPress={props.lock}>
                    <AppText style={styles.button}>Lock</AppText>
                </Pressable>
            </View>
            {page === 'NoteList' && <NoteList openNote={openNote} />}
            {page === 'NoteView' && note !== null && <NoteView note={note}/>}
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
    const minutes = Math.floor(seconds / 60);
    const leftOver = seconds % 60;

    // account for leading zero    
    if (leftOver < 10) {
        return `${minutes}:0${leftOver}`
    } else {
        return `${minutes}:${leftOver}`
    }
}
