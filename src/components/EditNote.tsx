import { TextInput, StyleSheet, View } from 'react-native'
import colors from '../assets/colors';


export interface EditNoteProps {
    title: string;
    body: string;
    setTitle: (value: string) => void;
    setBody: (value: string) => void;
}

export default function EditNote(props: EditNoteProps) {
    return(
        <View style={{flex: 1}}>
            <TextInput 
                style={styles.title}
                value={props.title}
                onChangeText={props.setTitle}
                placeholder='Title'
                placeholderTextColor={colors.placeholder}
            />
            <TextInput 
                style={styles.body}
                value={props.body}
                onChangeText={props.setBody}
                placeholder='Body'
                placeholderTextColor={colors.placeholder}
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