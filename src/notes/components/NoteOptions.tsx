import { Pressable, Alert, AlertButton, Platform } from "react-native";

import showErrorDialog from "../../shared/util/error";
import { NoteMetadata } from "../types";

import { useStyles, useTranslation } from "../../shared/contexts/settingsContext";
import { formatDate } from "../../shared/util/datetime";
import {
    deleteNoteAsync,
    getRawNoteAsync
} from "../storage/notefiles";
import { exportTextFileAsync } from "../storage/android";

import AppText from "../../shared/components/AppText";
import AppButton from "../../shared/components/AppButton";
import { NotesText } from "../notesText";
import { CommonText } from "../../shared/commonText";

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
    const text = useTranslation(NotesText);
    const commonText = useTranslation(CommonText);

    function handleDeleteError(reason: unknown) {
        props.close();
        showErrorDialog(reason);
    }

    function confirmDelete() {
        const cancelButton: AlertButton = {text: commonText.CANCEL, style: 'cancel'};
        const deleteButton: AlertButton = {
            text: text.DELETE,
            style: 'destructive',
            onPress: () => {
                deleteNoteAsync(props.metadata.filename)
                    .then(props.close)
                    .catch(handleDeleteError);
            }
        };

        Alert.alert(
            text.DELETE_CONFIRMATION_TITLE,
            text.deleteConfirmationMessage(props.metadata.title),
            [cancelButton, deleteButton]
        )
    }

    // Handle retrieving note and prompting user to export it
    async function exportNote() {
        try {
            const rawFile = await getRawNoteAsync(props.metadata.filename);
            if (rawFile === null) {
                showErrorDialog(`${text.ERROR_READING_FILE} ${props.metadata.filename}`);
                return;
            }

            if (await exportTextFileAsync(props.metadata.filename, rawFile) === false) {
                Alert.alert(
                    commonText.OPERATION_CANCELLED,
                    commonText.ACCESS_DENIED 
                );
            } else {
                Alert.alert(
                    commonText.SUCCESS,
                    text.successfulExport(props.metadata.filename)
                );
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
                    {text.NOTE_PROPERTIES}
                </AppText>
                <AppText style={{padding: 5}}>
                    {text.FILENAME}: {props.metadata.filename}
                </AppText>
                <AppText style={{padding: 5}}>
                    {text.TITLE}: "{props.metadata.title}"
                </AppText>
                <AppText style={{padding: 5}}>
                    {text.CREATED}: {dateCreatedString}
                </AppText>
                <AppText style={{padding: 5}}>
                    {text.LAST_MODIFIED}: {dateModifiedString}
                </AppText>
                <AppText style={{padding: 5}}>
                    {text.SIZE}: {formatBytesString(props.metadata.fileSize)}
                </AppText>
                {/* User exports are currently only supported by android */}
                <AppButton onPress={exportNote} disabled={Platform.OS !== "android"}>
                    {text.EXPORT_ENCRYPTED_FILE}
                </AppButton>
                <AppButton color='red' onPress={confirmDelete}>
                    {text.DELETE_NOTE}
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
