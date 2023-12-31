import { ScrollView } from 'react-native'
import styles from '../modules/styles'
import AppText from './AppText'

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
            <AppText style={styles.noteTitle}>{props.note.title}</AppText>
            <AppText style={styles.noteBody}>{props.note.body}</AppText>
        </ScrollView>
    )
}