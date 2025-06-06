import { ScrollView, View } from "react-native";

import { NoteMetadata } from "../types";
import { useStyles, useTranslation } from "../../shared/contexts/settingsContext";

import AppText from "../../shared/components/AppText";
import NotePreview from "./NotePreview";
import { NotesText } from "../notesText";

interface NoteListProps {
    noteList: NoteMetadata[];

    /** Open the edit view for the given note */
    openNote: (filename: string) => void

    /** Open the properties view for the given note */
    setNoteOptions: (metadata: NoteMetadata) => void;
}

export function NoteList(props: NoteListProps) {
    const text = useTranslation(NotesText);
    const { styles } = useStyles();
    const result = props.noteList.map(entry => (
        <NotePreview
            key={entry.filename}
            metadata={entry}
            openNote={props.openNote}
            setNoteOptions={props.setNoteOptions}
        />
    ))

    if (result.length === 0)
        return <View style={[styles.centered, {flex: 1}]}>
            <AppText style={styles.noteListEmpty}>
               {text.NO_NOTES_YET} 
            </AppText>
        </View>

    // Sort by date modified
    result.sort((a, b) => 
        b.props.metadata.dateModified - a.props.metadata.dateModified
    )

    return <ScrollView style={{flex: 1, padding: 10}}>
        {result}
    </ScrollView>
}
