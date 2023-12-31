import { useState } from 'react';
import { Text, View } from 'react-native';
import Note from '../pages/Note';

const secondsInMinute = 60;
const newLines = 'top\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nbottom'

export interface UnlockedProps {
    page: 'NoteList' | 'Note';
    openTime: number;
}

export default function Unlocked(props: UnlockedProps) {
    const [page, setPage] = useState(props.page);

    return (
        <View style={{flex: 1}}>
            <Text>Unlocked time: {formatTime(props.openTime)}</Text>
            {page === 'NoteList' && <Text>Non existent page</Text>}
            {page === 'Note' && <Note title='Título' body={newLines}/>}
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
