import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getNotesAsync } from "../../util/services/files";
import styles from "../../util/services/styles";
import Note, { blankNote } from "../../util/types/note";
import showErrorDialog from "../../util/error";

import { Params } from "../screens/Unlocked";
import Loading from "../screens/Loading";
import AppText from "../common/AppText";
import NoteOptions from "../common/NoteOptions";
import { NoteList } from "../common/NoteList";

export default function NotesView({ navigation }: NativeStackScreenProps<Params>) {
    // map of notes where key=filename, value=note
    const [noteMap, setNoteMap] = useState<Map<string, Note>>();

    // note for which the properties menu is shown. Undefined means no menu shown
    const [noteOptions, setNoteOptions] = useState<{
        filename: string,
        note: Note
    }>();

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

    // Load notes from external storage to app state
    function refreshList() {
        getNotesAsync()
            .then(setNoteMap)
            .catch(showErrorDialog);
    }

    // Refresh the list only when this screen is focused (prevents inf loop)
    useFocusEffect(useCallback(refreshList, []));

    if (noteMap === undefined)
        return <Loading message='Fetching notes...'/>;

    return (
        <View style={styles.app}>
            <NoteList
                noteMap={noteMap}
                openNote={openNote}
                setNoteOptions={setNoteOptions}
            />
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <AppText style={{textAlign: 'center'}}>Settings</AppText>
            </TouchableOpacity>
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
    );
}
