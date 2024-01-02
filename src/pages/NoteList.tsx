import { useState, useEffect } from 'react';
import { ScrollView } from "react-native";
import AppText from "../components/AppText";
import Note from '../modules/note';
import { getNoteList } from '../modules/file-service';
import Loading from './Loading';

export default function NoteList() {
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
    } else {
        return (
            <ScrollView style={{flex: 1, padding: 10}}>
                {noteList.map((note) => <AppText key={note.title}>{note.title}</AppText>)}
            </ScrollView>
        )
    }
}