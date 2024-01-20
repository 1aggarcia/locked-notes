import { ScrollView, View } from "react-native";

import Note from "../../util/types/note";
import { getStyles } from "../../util/services/styles";

import AppText from "./AppText";
import NotePreview from "./NotePreview";

interface NoteListProps {
    noteMap: Map<string, Note> | undefined;

    /** Open the edit view for the given note */
    openNote: (filename: string, note: Note) => void

    /** Open the properties view for the given note */
    setNoteOptions: (data: {filename: string, note: Note}) => void;
}

export function NoteList(props: NoteListProps) {
    const result: JSX.Element[] = [];

    if (props.noteMap) {
        props.noteMap.forEach((note, filename) => {result.push(
            <NotePreview
                key={filename}
                filename={filename}
                note={note}
                openNote={props.openNote}
                setNoteOptions={props.setNoteOptions}
            />
        )});
    }

    if (result.length === 0)
        return <View style={[getStyles().centered, {flex: 1}]}>
            <AppText style={getStyles().noteListEmpty}>
                No Notes Yet
            </AppText>
        </View>

    // Sort by date modified
    result.sort((a, b) => b.props.note.dateModified - a.props.note.dateModified)

    return <ScrollView style={{flex: 1, padding: 10}}>
        {result}
    </ScrollView>
}
