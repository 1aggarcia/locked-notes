import { Text, ScrollView } from 'react-native'
import styles from '../modules/styles'

export interface ViewNoteProps {
    note: {
        title: string,
        body: string,
        dateCreated: string,
        dateModified: string,
    }
}

export default function ViewNote(props: ViewNoteProps) {
    return(
        <ScrollView style={{flex: 1}}>
            <Text style={styles.noteTitle}>{props.note.title}</Text>
            <Text style={styles.noteBody}>{props.note.body}</Text>
        </ScrollView>
    )
}