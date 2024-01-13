import { TouchableOpacity } from "react-native";

import Note, { formateDate } from "../../util/note";
import styles from "../../util/styles";
import AppText from "./AppText";

interface NotePreviewProps {
    filename: string
    note: Note

    // Callback function to open note passed in
    openNote: (filename: string, note: Note) => void

    openNoteOptions: () => void;
}

export default function NotePreview(props: NotePreviewProps) {
    const dateModifiedString = formateDate(props.note.dateModified);

    return (
        <TouchableOpacity
            style={styles.notePreview} 
            onPress={() => props.openNote(props.filename, props.note)}
            onLongPress={props.openNoteOptions}
            activeOpacity={0.7}
        >   
            <AppText style={styles.notePreviewHeader}>
                {props.note.title}
            </AppText>
            <AppText style={styles.placeholder}>
                Modified: {dateModifiedString}
            </AppText>
        </TouchableOpacity>
    )
}
