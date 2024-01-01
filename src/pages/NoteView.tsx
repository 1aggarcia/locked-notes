import { useState } from 'react';
import { View, ScrollView, TextInput, Switch } from 'react-native';

import styles from '../modules/styles';
import { darkModeColors } from '../assets/colors';

export interface NoteProps {
    note: {
        title: string,
        body: string,
        dateCreated: string,
        dateModified: string,
    }
}

export default function NoteView(props: NoteProps) {
    const [title, setTitle] = useState(props.note.title);
    const [body, setBody] = useState(props.note.body);
    const [editing, setEditing] = useState(false);

    return (
        <View style={{flex: 1}}>
            <Switch value={editing} onValueChange={setEditing}/>
            <ScrollView style={{flex: 1}}>
                <TextInput 
                    style={styles.noteTitle}
                    value={title}
                    onChangeText={setTitle}
                    placeholder='Title'
                    placeholderTextColor={darkModeColors.placeholder}
                    editable={editing}
                />
                <TextInput 
                    style={styles.noteBody}
                    value={body}
                    onChangeText={setBody}
                    placeholder='Write something here...'
                    placeholderTextColor={darkModeColors.placeholder}
                    multiline
                    editable={editing}
                />
            </ScrollView>
        </View>
    )
}