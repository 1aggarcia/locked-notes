import { TextInput, StyleSheet, View } from 'react-native'
import { useState } from 'react';
import colors from '../assets/colors';


export interface EditNoteProps {
    title: string;
    body: string;
}

export default function EditNote(props: EditNoteProps) {
    const [editing, setEditing] = useState(true);
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);

    return(
        <View style={{flex: 1}}>
            <TextInput 
                style={styles.title}
                value={title}
                onChangeText={setTitle}
                placeholder='Title'
                placeholderTextColor={colors.placeholder}
                editable={editing}
            />
            <TextInput 
                style={styles.body}
                value={body}
                onChangeText={setBody}
                placeholder='Body'
                placeholderTextColor={colors.placeholder}
                multiline
                editable={editing}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        padding: 15,
        fontSize: 22,
        fontWeight: 'bold'
    },
    body: {
        flex: 1,
        padding: 18,
        fontSize: 15,
    }
});