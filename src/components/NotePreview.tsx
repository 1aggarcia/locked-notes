import { Pressable } from "react-native";
import Note from "../modules/note";
import AppText from "./AppText";
import styles from "../modules/styles";

interface NotePreviewProps {
    filename: string
    note: Note

    // Callback function to open note passed in
    openNote: (filename: string, note: Note) => void
}

export default function NotePreview(props: NotePreviewProps) {
    const dateString = formateDate(props.note.dateModified);

    return (
        <Pressable style={styles.notePreview} onPress={() => props.openNote(props.filename, props.note)}>
            <AppText style={styles.notePreviewHeader}>
                {props.note.title}
            </AppText>
            <AppText>
                Modified: {dateString}
            </AppText>
        </Pressable>
    )
}

/**
 * Convert timestamp in form of seconds since epoch to formatted datetime
 * @param seconds number of seconds since the epoch (1970-01-01 00:00:00)
 * @returns string representation of date
 */
function formateDate(seconds: number) {
    const date = new Date(seconds);
    return date.toLocaleString(undefined, {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit'
    });
}