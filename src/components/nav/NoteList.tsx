import { useEffect, useState } from "react";
import { Button, ScrollView, TouchableHighlight, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getNotes } from "../../util/file-service";
import styles from "../../util/styles";
import Note, { blankNote } from "../../util/note";
import { Params } from "../screens/Unlocked";

import AppText from "../common/AppText";
import NotePreview from "../common/NotePreview";
import Loading from "../screens/Loading";
import NoteOptions from "../common/NoteOptions";

export default function NoteList({ route, navigation }: NativeStackScreenProps<Params>) {
    // map of notes where key=filename, value=note
    const [noteMap, setNoteMap] = useState<Map<string, Note>>();
    const [noteOptions, setNoteOptions] = useState<Note>();
    const [noteOptionsFilename, setNoteOptionsFilename] = useState<string>();

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

    function setOptions(note: Note, filename: string) {
        setNoteOptions(note);
        setNoteOptionsFilename(filename);
    }

    function clearOptions() {
        setNoteOptions(undefined);
        setNoteOptionsFilename(undefined);
    }

    function generatePreviewList() {
        let result: JSX.Element[] = [];
        if (noteMap) {
            noteMap.forEach((note, filename) => {
                result.push(<NotePreview 
                    key={filename}
                    filename={filename}
                    note={note}
                    openNote={openNote}
                    openNoteOptions={() => setOptions(note, filename)}
                />)
            })
        }
        if (result.length === 0)
            return <AppText style={styles.noteListEmpty}>No Notes Yet</AppText>

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
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <AppText style={{textAlign: 'center'}}>Settings</AppText>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.createButton} onPress={createNote}>
                    <AppText style={styles.createButtonText}>+</AppText>
                </TouchableOpacity>
                {noteOptions && noteOptionsFilename &&
                    <NoteOptions
                        note={noteOptions}
                        filename={noteOptionsFilename}
                        close={clearOptions}
                    />
                }
            </View>
        )
    }
}