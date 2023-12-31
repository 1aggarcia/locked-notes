import { TextInput, View } from 'react-native'
import { darkModeColors } from '../assets/colors';
import styles from '../modules/styles';


export interface EditNoteProps {
    note: {
        title: string,
        body: string,
        dateCreated: string,
        dateModified: string,
    }
    setTitle: (value: string) => void;
    setBody: (value: string) => void;
}

export default function EditNote(props: EditNoteProps) {
    return(
        <View style={{flex: 1}}>
            <TextInput 
                style={styles.noteTitle}
                value={props.note.title}
                onChangeText={props.setTitle}
                placeholder='Title'
                placeholderTextColor={darkModeColors.placeholder}
            />
            <TextInput 
                style={styles.noteBody}
                value={props.note.body}
                onChangeText={props.setBody}
                placeholder='Body'
                placeholderTextColor={darkModeColors.placeholder}
                multiline
            />
        </View>
    )
}