import { Pressable } from "react-native";
import Note from "../modules/note";
import AppText from "./AppText";

interface NotePreviewProps {
    note: Note

    // Callback function to open note passed in
    openNote: (note: Note) => void
}

export default function NotePreview(props: NotePreviewProps) {
    return (
        <Pressable onPress={() => props.openNote(props.note)}>
            <AppText style={{fontWeight: 'bold'}}>- {props.note.title}</AppText>
        </Pressable>
    )
}