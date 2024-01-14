import { TouchableOpacity } from "react-native";

import Note, { formateDate } from "../../util/note";
import styles from "../../util/styles";
import AppText from "./AppText";

interface NotePreviewProps {
    filename: string
    note: Note

    /** Open the edit view for the given note */
    openNote: (filename: string, note: Note) => void

    /** Open the properties view for the given note */
    setNoteOptions: (data: {filename: string, note: Note}) => void;
}

export default function NotePreview(props: NotePreviewProps) {
    const dateModifiedString = formateDate(props.note.dateModified);
    const noteOptions = {filename: props.filename, note: props.note};

    return (
        <TouchableOpacity
            style={styles.notePreview} 
            onPress={() => props.openNote(props.filename, props.note)}
            onLongPress={() => props.setNoteOptions(noteOptions)}
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
