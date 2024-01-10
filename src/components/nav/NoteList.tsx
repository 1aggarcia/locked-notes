import { useEffect, useState } from "react";
import { Button, ScrollView, TouchableHighlight, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getNotes } from "../../util/file-service";
import styles, { colorMap } from "../../util/styles";
import Note, { blankNote } from "../../util/note";
import { Params } from "../screens/Unlocked";

import AppText from "../common/AppText";
import NotePreview from "../common/NotePreview";
import Loading from "../screens/Loading";

export default function NoteList({ route, navigation }: NativeStackScreenProps<Params>) {
    // map of notes where key=filename, value=note
    const [noteMap, setNoteMap] = useState<Map<string, Note>>();

    // Retreive notes from external storage
    useEffect(() => {
        getNotes()
            .then(notes => setNoteMap(notes))
            .catch(error => alert(error));
    }, [])

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
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <AppText style={{textAlign: 'center'}}>Settings</AppText>
                </TouchableOpacity>
                <ScrollView style={{flex: 1, padding: 10}}>
                    {generatePreviewList()}
                </ScrollView>
                <TouchableOpacity style={styles.createButton} onPress={createNote}>
                    <AppText style={styles.createButtonText}>+</AppText>
                </TouchableOpacity>
            </View>
        )
    }
}