import { useState, useEffect } from 'react';
import { ScrollView } from "react-native";
import Note from '../modules/note';
import { deleteNote, getNoteList } from '../modules/file-service';
import Loading from './Loading';
import NotePreview from '../components/NotePreview';
import AppText from '../components/AppText';
import styles from '../modules/styles';

interface NoteListProps {
    // Callback function to open note passed in
    openNote: (note: Note) => void
}

export default function NoteList(props: NoteListProps) {
    const [noteList, setNoteList] = useState<Note[]>();

    // Retreive note from external storage
    useEffect(() => {
        async function loadNoteList() {
            setNoteList(await getNoteList());
        }
        loadNoteList();
    }, [])

    if (noteList === undefined) {
        return <Loading />
    } else if (noteList.length === 0) {
        return <AppText style={styles.placeholder}>No Notes Yet</AppText>
    } else {
        return (
            <ScrollView style={{flex: 1, padding: 10}}>
                {noteList.map((note, i) => <NotePreview openNote={props.openNote} key={i} note={note}/>)}
            </ScrollView>
        )
    }
}