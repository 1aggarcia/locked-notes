import { useState, useEffect } from 'react';
import { ScrollView } from "react-native";
import Note from '../modules/note';
import { getNotes } from '../modules/file-service';
import Loading from './Loading';
import NotePreview from '../components/NotePreview';
import AppText from '../components/AppText';
import styles from '../modules/styles';

interface NoteListProps {
    // Callback function to open note passed in
    openNote: (filename: string, note: Note) => void
}

export default function NoteList(props: NoteListProps) {
    // map of notes where key=filename, value=note
    const [noteMap, setNoteMap] = useState<Map<string, Note>>();

    // Retreive note from external storage
    useEffect(() => {
        async function loadNoteList() {
            setNoteMap(await getNotes());
        }
        loadNoteList();
    }, [])

    function generateList() {
        let result: JSX.Element[] = [];
        if (noteMap) {
            noteMap.forEach((note, filename) => {
                result.push(<NotePreview 
                    openNote={props.openNote} filename={filename} key={filename} note={note}
                />)
            })
        }
        return result;
    }

    if (noteMap === undefined) {
        return <Loading />
    } else if (noteMap.size === 0) {
        return <AppText style={styles.placeholder}>No Notes Yet</AppText>
    } else {
        return (
            <ScrollView style={{flex: 1, padding: 10}}>
                {generateList()}
            </ScrollView>
        )
    }
}