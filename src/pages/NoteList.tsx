import { useState, useEffect } from 'react';
import { ScrollView } from "react-native";
import Note from '../modules/note';
import { getNotes, saveNote } from '../modules/file-service';
import Loading from './Loading';
import NotePreview from '../components/NotePreview';
import AppText from '../components/AppText';
import styles from '../modules/styles';
import EditNote from './EditNote';

export default function NoteList() {
    // map of notes where key=filename, value=note
    const [noteMap, setNoteMap] = useState<Map<string, Note>>();
    const [note, setNote] = useState<Note>();
    const [noteFile, setNoteFile] = useState<string>();

    // Retreive note from external storage
    useEffect(() => {
        async function loadNoteList() {
            setNoteMap(await getNotes());
        }
        loadNoteList();
    }, [])

    function openNote(filename: string, note: Note) {
        setNote(note);
        setNoteFile(filename);
    }
    
    function closeNote() {
        setNote(undefined);
        setNoteFile(undefined);
    }

    function generateList() {
        let result: JSX.Element[] = [];
        if (noteMap) {
            noteMap.forEach((note, filename) => {
                result.push(<NotePreview 
                    openNote={openNote} filename={filename} key={filename} note={note}
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
        return (<>
            {
                note && noteFile? <EditNote note={note} filename={noteFile} goBack={closeNote} />
                :
                <ScrollView style={{flex: 1, padding: 10}}>
                    {generateList()}
                </ScrollView>
            }
        </>)
    }
}