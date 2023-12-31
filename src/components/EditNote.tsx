import { TextInput, StyleSheet, View } from 'react-native'
import { darkModeColors } from '../assets/colors';
import Note from '../modules/note';


export interface EditNoteProps {
    note: Note
    setTitle: (value: string) => void;
    setBody: (value: string) => void;
}

export default function EditNote(props: EditNoteProps) {
    return(
        <View style={{flex: 1}}>
            <TextInput 
                style={styles.title}
                value={props.note.title}
                onChangeText={props.setTitle}
                placeholder='Title'
                placeholderTextColor={darkModeColors.placeholder}
            />
            <TextInput 
                style={styles.body}
                value={props.note.body}
                onChangeText={props.setBody}
                placeholder='Body'
                placeholderTextColor={darkModeColors.placeholder}
                multiline
            />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 15,
        paddingBottom: 5,
    },
    body: {
        flex: 1,
        fontSize: 18,
        padding: 15,
        paddingTop: 5,
        textAlignVertical: 'top',
    }
});