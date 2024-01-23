import { TouchableOpacity } from "react-native";

import Note, { NoteMetadata } from "../../util/types/note";
import { formatDate } from "../../util/services/datetime";
import Styles from "../../util/services/styles";
import AppText from "./AppText";

interface NotePreviewProps {
    metadata: NoteMetadata

    /** Open the edit view for the given note */
    openNote: (filename: string) => void

    /** Open the properties view for the given note */
    setNoteOptions: (metadata: NoteMetadata) => void;
}

export default function NotePreview(props: NotePreviewProps) {
    const styles = Styles.get();
    const dateModifiedString = formatDate(props.metadata.dateModified);

    return (
        <TouchableOpacity
            style={styles.notePreview} 
            onPress={() => props.openNote(props.metadata.filename)}
            onLongPress={() => props.setNoteOptions(props.metadata)}
            activeOpacity={0.7}
        >   
            <AppText style={styles.notePreviewHeader}>
                {props.metadata.title}
            </AppText>
            <AppText style={styles.placeholder}>
                Modified: {dateModifiedString}
            </AppText>
        </TouchableOpacity>
    )
}
