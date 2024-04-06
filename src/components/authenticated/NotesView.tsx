import { useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getNoteListAsync } from "../../util/storage/notefiles";
import Styles from "../../util/services/styles";
import { NoteMetadata } from "../../util/types/note";
import showErrorDialog from "../../util/error";

import { Params } from "../screens/Unlocked";
import Loading from "../screens/Loading";
import AppText from "../shared/AppText";
import NoteOptions from "../shared/NoteOptions";
import { NoteList } from "../shared/NoteList";

export default function NotesView({ navigation }: NativeStackScreenProps<Params>) {
    // note for which the properties menu is shown. Undefined means no menu shown
    const [noteOptions, setNoteOptions] = useState<NoteMetadata>();
    const [noteList, setNoteList] = useState<NoteMetadata[]>();
    const styles = Styles.get();

    // Refresh the list only when this screen is focused (prevents inf loop)
    useFocusEffect(useCallback(refreshList, []));

    function openNote(filename: string) {
        navigation.navigate('EditNote', { filename: filename });
    }

    function createNote() {
        const filename = `note_${Date.now()}.ejn`;
        openNote(filename);
    }

    function clearOptions() {
        setNoteOptions(undefined);
        refreshList();
    }

    // Load notes from external storage to app state
    function refreshList() {
        getNoteListAsync()
            .then(setNoteList)
            .catch(showErrorDialog);
    }

    if (noteList === undefined)
        return <Loading message='Fetching notes...'/>;

    return (
        <View style={styles.app}>
            <NoteList
                noteList={noteList}
                openNote={openNote}
                setNoteOptions={setNoteOptions}
            />
            <TouchableOpacity style={styles.createButton} onPress={createNote}>
                <AppText style={styles.createButtonText}>+</AppText>
            </TouchableOpacity>
            {noteOptions &&
                <NoteOptions metadata={noteOptions} close={clearOptions}/>
            }
        </View>
    );
}
