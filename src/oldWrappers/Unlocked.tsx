import { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppText from '../components/AppText';

import NoteList from '../oldPages/NoteList';
import Note from '../modules/note';
import styles from '../modules/styles';

const Stack = createNativeStackNavigator();

// Maximum time a the app can be unlocked, in seconds
const maxTime = 300;

export interface UnlockedProps {
    page: 'NoteList' | 'Settings' | 'ResetPin';

    // Callback function to lock application
    lock: () => void;

    // Callback function to set nav page to access denied
    denyAccess: () => void;
}

export default function Unlocked(props: UnlockedProps) {
    const [page, setPage] = useState(props.page);
    const [timeOpen, setTimeOpen] = useState(maxTime)

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

    return (
        <View style={{flex: 1}}>
            <View style={{flexDirection: 'row',}}>
            <AppText>Unlocked time: {formatTime(timeOpen)}</AppText>
                <TouchableOpacity style={styles.button} onPress={props.lock}>
                    <AppText>Lock</AppText>
                </TouchableOpacity>
            </View>
            {page === 'NoteList' && <NoteList />}
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
