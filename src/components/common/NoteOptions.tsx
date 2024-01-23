import { Pressable, TouchableOpacity, View, Alert } from "react-native";

import showErrorDialog from "../../util/error";
import Styles from "../../util/services/styles";
import Note from "../../util/types/note";
import { formatDate } from "../../util/services/datetime";

import AppText from "./AppText";
import { 
    deleteNoteAsync,
    exportTextFileAsync,
    getRawNoteAsync
} from "../../util/services/files";

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

    const styles = Styles.get();
    const deleteButton = {
        text: 'Delete',
        onPress: () => {
            deleteNoteAsync(props.filename)
                .then(handleDelete)
                .catch(handleDeleteError);
        }
    }

    // Handle retreiving note and prompting user to export it
    async function exportNote() {
        const rawFile = await getRawNoteAsync(props.filename);
        if (rawFile === null) {
            showErrorDialog(`Error reading file ${props.filename}`);
            return;
        }

        if (await exportTextFileAsync(props.filename, rawFile) === false) {
            Alert.alert(
                'Operation Cancelled',
                'Access to file storage was denied.'
            );
        } else {
            Alert.alert('Success!', `${props.filename} successfully exported.`);
        }
        props.close();

    }

    function confirmDelete() {
        Alert.alert(
            'Really delete this note?',
            `Note "${props.note.title}" will be deleted forever.`,
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

                <TouchableOpacity onPress={exportNote}>
                    <AppText style={styles.noteOptionsButton}>
                        Export Encrypted File
                    </AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmDelete}>
                    <AppText style={[styles.noteOptionsButton, styles.noteDeleteButton]}>
                        Delete Note
                    </AppText>
                </TouchableOpacity>
            </View>
        </Pressable>
    )
}