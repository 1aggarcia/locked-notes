import { Pressable, Alert, AlertButton, Platform } from "react-native";

import showErrorDialog from "../../shared/util/error";
import { NoteMetadata } from "../types";

import { useStyles } from "../../shared/contexts/stylesContext";
import { formatDate } from "../../shared/util/datetime";
import {
    deleteNoteAsync,
    getRawNoteAsync
} from "../storage/notefiles";
import { exportTextFileAsync } from "../storage/android";

import AppText from "../../shared/components/AppText";
import AppButton from "../../shared/components/AppButton";

const KB_SIZE = 1 << 10;
const MB_SIZE = 1 << 20;
const GB_SIZE = 1 << 30;
const MAX_SIG_FIGS = 5;

interface NoteOptionProps {
    metadata: NoteMetadata;

    /** Close the popup menu, go back to the NoteList screen */
    close: () => void;
}

export default function NoteOptions(props: NoteOptionProps) {
    const dateCreatedString = formatDate(props.metadata.dateCreated);
    const dateModifiedString = formatDate(props.metadata.dateModified);

    const { styles } = useStyles();

    function handleDeleteError(reason: unknown) {
        props.close();
        showErrorDialog(reason);
    }

    function confirmDelete() {
        const cancelButton: AlertButton = {text: 'Cancel', style: 'cancel'};
        const deleteButton: AlertButton = {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
                deleteNoteAsync(props.metadata.filename)
                    .then(props.close)
                    .catch(handleDeleteError);
            }
        };

        Alert.alert(
            'Really delete this note?',
            `Note "${props.metadata.title}" will be deleted forever.`,
            [cancelButton, deleteButton]
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
                <AppText style={{padding: 5}}>
                    Size: {formatBytesString(props.metadata.fileSize)}
                </AppText>
                {/* User exports are currently only supported by android */}
                <AppButton onPress={exportNote} disabled={Platform.OS !== "android"}>
                    Export Encrypted File
                </AppButton>
                <AppButton color='red' onPress={confirmDelete}>
                    Delete Note
                </AppButton>
            </Pressable>
        </Pressable>
    )
}

/**
 * Given a number of bytes, return a readable string such as
 * "25 B", "5 KB", "235 GB"
 * @param bytes
 */
function formatBytesString(bytes: number) {
    // returns a number with an upper bound on the number of significant digits
    const truncateSigFigs = (n: number) => +n.toPrecision(MAX_SIG_FIGS);

    if (bytes < KB_SIZE) {
        return `${bytes} B`;
    }
    if (bytes < MB_SIZE) {
        return `${truncateSigFigs(bytes / KB_SIZE)} KB`;
    }
    if (bytes < GB_SIZE) {
        return `${truncateSigFigs(bytes / MB_SIZE)} MB`;
    }
    return `${truncateSigFigs(bytes / GB_SIZE)} GB`;
}
