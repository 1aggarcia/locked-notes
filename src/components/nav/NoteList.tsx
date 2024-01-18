import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getNotesAsync } from "../../util/files";
import styles from "../../util/styles";
import Note, { blankNote } from "../../util/note";
import { Params } from "../screens/Unlocked";
import showErrorDialog from "../../util/error";

import AppText from "../common/AppText";
import NotePreview from "../common/NotePreview";
import Loading from "../screens/Loading";
import NoteOptions from "../common/NoteOptions";

export default function NoteList({ navigation }: NativeStackScreenProps<Params>) {
    // map of notes where key=filename, value=note
    const [noteMap, setNoteMap] = useState<Map<string, Note>>();

    // note for which the properties menu is shown. Undefined means no menu shown
    const [noteOptions, setNoteOptions] = useState<{
        filename: string,
        note: Note
    }>();

    useEffect(refreshList, [])

    // Retreive notes from external storage
    function refreshList() {
        getNotesAsync()
            .then(setNoteMap)
            .catch(showErrorDialog);
     }

    function openNote(filename: string, note: Note) {
        const noteProps = { filename: filename, note: note };
        navigation.navigate('EditNote', noteProps);
    }

    function createNote() {
        const filename = `note_${Date.now()}.ejn`;
        openNote(filename, blankNote());
    }

    function clearOptions() {
        setNoteOptions(undefined);
        refreshList();
    }

    function generatePreviewList() {
        const result: JSX.Element[] = [];
        if (noteMap) {
            noteMap.forEach((note, filename) => {result.push(
                <NotePreview 
                    key={filename}
                    filename={filename}
                    note={note}
                    openNote={openNote}
                    setNoteOptions={setNoteOptions}
                />
            )});
        }
        if (result.length === 0)
            return <AppText style={styles.noteListEmpty}>No Notes Yet</AppText>

        // Sort by date modified
        result.sort((a, b) => b.props.note.dateModified - a.props.note.dateModified)
        return result;
    }

    if (noteMap === undefined) {
        return <Loading message='Fetching notes...'/>
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
                {noteOptions &&
                    <NoteOptions
                        note={noteOptions.note}
                        filename={noteOptions.filename}
                        close={clearOptions}
                    />
                }
            </View>
        )
    }
}
