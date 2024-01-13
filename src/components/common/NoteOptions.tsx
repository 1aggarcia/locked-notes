import { Pressable, TouchableOpacity, View, Alert } from "react-native";

import styles from "../../util/styles";
import Note, { formateDate } from "../../util/note";

import AppText from "./AppText";
import { deleteNote } from "../../util/file-service";

interface NoteOptionProps {
    /** The note we will show the options for */
    note: Note;

    filename: string;

    /** Close the popup menu, go back to the NoteList screen */
    close: () => void;
}

export default function NoteOptions(props: NoteOptionProps) {
    const dateCreatedString = formateDate(props.note.dateCreated);
    const dateModifiedString = formateDate(props.note.dateModified);

    const deleteButton = {
        text: 'Delete',
        onPress: () => {
            deleteNote(props.filename)
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

    // the promise gives us "any" type for `reason` so we are forced to use it here
    function handleDeleteError(reason: any) {
        props.close();
        Alert.alert('Internal Error', reason.toString())
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