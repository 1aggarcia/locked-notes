import { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView, View } from "react-native";

import Note, { blankNote } from '../modules/note';
import { getNotes } from '../modules/file-service';

import Loading from './Loading';
import EditNote from './EditNote';

import NotePreview from '../components/NotePreview';
import AppText from '../components/AppText';
import styles from '../modules/styles';

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
    
    function closeNote(newNote: Note) {
        if (noteFile && noteMap) {
            // We copy the map to prevent direct state editing
            const noteMapCopy = new Map(noteMap)
            noteMapCopy.set(noteFile, newNote)
            setNoteMap(noteMapCopy);
        }
        setNote(undefined);
        setNoteFile(undefined);
    }

    function createNote() {
        const filename = `note_${Date.now()}.ejn`;
        openNote(filename, blankNote());
    }

    function generatePreviewList() {
        let result: JSX.Element[] = [];
        if (noteMap) {
            noteMap.forEach((note, filename) => {
                result.push(<NotePreview 
                    openNote={openNote} filename={filename} key={filename} note={note}
                />)
            })
        }
        if (result.length === 0) {
            return <AppText style={styles.placeholder}>No Notes Yet</AppText>;
        }
        // Sort by date modified
        result.sort((a, b) => b.props.note.dateModified - a.props.note.dateModified)
        return result;
    }

    if (noteMap === undefined) {
        return <Loading />
    }
    else if (note && noteFile) {
        return <EditNote note={note} filename={noteFile} goBack={closeNote} />
    }
    else {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{flex: 1, padding: 10}}>
                {generatePreviewList()}
                </ScrollView>
                <TouchableOpacity style={styles.button} onPress={createNote}>
                    <AppText>Create New</AppText>
                </TouchableOpacity>
            </View>
        );
    }
}