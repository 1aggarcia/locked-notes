import { useState } from 'react';
import { View, ScrollView, TextInput, Switch } from 'react-native';

import styles from '../modules/styles';
import { darkModeColors } from '../assets/colors';
import Note from '../modules/note';
import { saveNote } from '../modules/file-service';

export interface NoteProps {
    note: Note
}

export default function NoteView(props: NoteProps) {
    const [title, setTitle] = useState(props.note.title);
    const [body, setBody] = useState(props.note.body);
    const [editing, setEditing] = useState(false);

    function updateEditing(value: boolean) {
        const newNote: Note = {
            title: title,
            body: body,
            dateCreated: props.note.dateCreated,
            dateModified: props.note.dateModified,
        }
        setEditing(value);
        saveNote('test', newNote);
    }

    return (
        <View style={{flex: 1}}>
            <Switch value={editing} onValueChange={updateEditing}/>
            <ScrollView style={{flex: 1}}>
                <TextInput 
                    style={styles.noteTitle}
                    value={title}
                    onChangeText={setTitle}
                    placeholder='Title'
                    placeholderTextColor={darkModeColors.placeholder}
                    multiline
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