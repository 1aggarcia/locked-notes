import { ScrollView } from 'react-native'

import styles from '../../util/services/styles'
import AppText from './AppText'

export interface ViewNoteProps {
    title: string;
    body: string;
}

export default function ViewNote(props: ViewNoteProps) {
    return(
        <ScrollView style={{flex: 1}}>
            <AppText style={styles.noteTitle}>{props.title}</AppText>
            <AppText style={styles.noteBody}>{props.body}</AppText>
        </ScrollView>
    )
}