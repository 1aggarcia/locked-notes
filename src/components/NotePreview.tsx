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
    return (
        <Pressable onPress={() => props.openNote(props.filename, props.note)}>
            <AppText style={styles.notePreview}>
                {props.note.title}
            </AppText>
        </Pressable>
    )
}