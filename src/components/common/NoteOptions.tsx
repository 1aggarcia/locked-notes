import { Pressable, Alert } from "react-native";

import showErrorDialog from "../../util/error";
import { NoteMetadata } from "../../util/types/note";

import Styles from "../../util/services/styles";
import { formatDate } from "../../util/services/datetime";
import { deleteNoteAsync, getRawNoteAsync } from "../../util/services/notefiles";
import { exportTextFileAsync } from "../../util/services/androidstorage";

import AppText from "./AppText";
import AppButton from "./AppButton";

interface NoteOptionProps {
    metadata: NoteMetadata;

    /** Close the popup menu, go back to the NoteList screen */
    close: () => void;
}

export default function NoteOptions(props: NoteOptionProps) {
    const dateCreatedString = formatDate(props.metadata.dateCreated);
    const dateModifiedString = formatDate(props.metadata.dateModified);

    const styles = Styles.get();
    const errorColor = Styles.getColorTheme().error;

    const deleteButton = {
        text: 'Delete',
        onPress: () => {
            deleteNoteAsync(props.metadata.filename)
                .then(props.close)
                .catch(handleDeleteError);
        }
    }

    function handleDeleteError(reason: unknown) {
        props.close();
        showErrorDialog(reason);
    }

    function confirmDelete() {
        Alert.alert(
            'Really delete this note?',
            `Note "${props.metadata.title}" will be deleted forever.`,
            [{text: 'Cancel'}, deleteButton]
        )
    }

    // Handle retreiving note and prompting user to export it
    async function exportNote() {
        try {
            const rawFile = await getRawNoteAsync(props.metadata.filename);
            if (rawFile === null) {
                showErrorDialog(`Error reading file ${props.metadata.filename}`);
                return;
            }

            if (await exportTextFileAsync(props.metadata.filename, rawFile) === false) {
                Alert.alert(
                    'Operation Cancelled',
                    'Access to file storage was denied.'
                );
            } else {
                Alert.alert('Success!', `${props.metadata.filename} successfully exported.`);
            }
            props.close();
        } catch (error) {
            showErrorDialog(error);
        }

    }

    return (
        <Pressable
            onPress={props.close}
            style={[styles.noteOptionsBg, styles.centered]}
        >
            <Pressable style={[styles.noteOptions, styles.centered]}>
                <AppText
                    style={{fontSize: 18, padding: 5, fontWeight: 'bold'}}
                >
                    Note Properties
                </AppText>
                <AppText style={{padding: 5}}>
                    Filename: {props.metadata.filename}
                </AppText>
                <AppText style={{padding: 5}}>
                    Title: "{props.metadata.title}"
                </AppText>
                <AppText style={{padding: 5}}>
                    Created: {dateCreatedString}
                </AppText>
                <AppText style={{padding: 5}}>
                    Last Modified: {dateModifiedString}
                </AppText>
                <AppButton onPress={exportNote}>
                    Export Encrypted File
                </AppButton>
                <AppButton color={errorColor} onPress={confirmDelete}>
                    Delete Note
                </AppButton>
            </Pressable>
        </Pressable>
    )
}
