import { Pressable, TouchableOpacity, View, Alert } from "react-native";

import showErrorDialog from "../../util/error";
import styles from "../../util/services/styles";
import Note from "../../util/types/note";
import { formatDate } from "../../util/services/datetime";

import AppText from "./AppText";
import { deleteNoteAsync } from "../../util/services/files";

interface NoteOptionProps {
    /** The note we will show the options for */
    note: Note;

    filename: string;

    /** Close the popup menu, go back to the NoteList screen */
    close: () => void;
}

export default function NoteOptions(props: NoteOptionProps) {
    const dateCreatedString = formatDate(props.note.dateCreated);
    const dateModifiedString = formatDate(props.note.dateModified);

    const deleteButton = {
        text: 'Delete',
        onPress: () => {
            deleteNoteAsync(props.filename)
                .then(handleDelete)
                .catch(handleDeleteError);
        }
    }

    function confirmDelete() {
        Alert.alert(
            'Really delete this note?',
            `File "${props.filename}" will be deleted forever.`,
            [{text: 'Cancel'}, deleteButton]
        )
    }

    function handleDelete() {
        props.close();
        Alert.alert('Success!', 'Note has been deleted.')
    }

    // the promise reject gives us "any" type for `reason` so we are forced to use it here
    function handleDeleteError(reason: any) {
        props.close();
        showErrorDialog(reason);
    }

    return (
        <Pressable onPress={props.close} style={[styles.noteOptionsBg, styles.centered]}>
            <View style={[styles.noteOptions, styles.centered]}>
                <AppText style={{fontSize: 18, padding: 5, fontWeight: 'bold'}}>
                    Note Properties
                </AppText>
                <AppText style={{padding: 5}}>
                    Filename: {props.filename}
                </AppText>
                <AppText style={{padding: 5}}>
                    Title: "{props.note.title}"
                </AppText>
                <AppText style={{padding: 5}}>
                    Created: {dateCreatedString}
                </AppText>
                <AppText style={{padding: 5}}>
                    Last Modified: {dateModifiedString}
                </AppText>

                <TouchableOpacity onPress={confirmDelete}>
                    <AppText style={styles.deleteButton}>Delete Note</AppText>
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}