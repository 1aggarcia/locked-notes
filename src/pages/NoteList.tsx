import { useEffect, useState } from "react";
import { Button, ScrollView, View } from "react-native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getNotes } from "../modules/file-service";
import styles from "../modules/styles";
import Note, { blankNote } from "../modules/note";
import { Params } from "../windows/Unlocked";

import AppText from "../components/AppText";
import NotePreview from "../components/NotePreview";
import Loading from "../windows/Loading";

export default function NoteList({ route, navigation }: NativeStackScreenProps<Params>) {
    // map of notes where key=filename, value=note
    const [noteMap, setNoteMap] = useState<Map<string, Note>>();

    // Retreive note from external storage
    useEffect(() => {
        async function loadNoteList() {
            setNoteMap(await getNotes());
        }
        loadNoteList();
    })

    function openNote(filename: string, note: Note) {
        const noteProps = { filename: filename, note: note };
        navigation.navigate('EditNote', noteProps);
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
    } else {
        return (
            <View style={styles.app}>
                <ScrollView style={{flex: 1, padding: 10}}>
                    {generatePreviewList()}
                </ScrollView>
                <Button title='Create New Note' onPress={createNote}/>
                <Button title='Go to Settings' onPress={() => navigation.navigate('Settings')}/>
            </View>
        )
    }
}