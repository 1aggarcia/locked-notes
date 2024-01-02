import { useState } from 'react';
import { View, ScrollView, TextInput, Switch, Pressable } from 'react-native';

import styles from '../modules/styles';
import { darkModeColors } from '../assets/colors';
import Note from '../modules/note';
import { deleteNote, saveNote } from '../modules/file-service';
import AppText from '../components/AppText';

export interface EditNoteProps {
    filename: string;
    note: Note;

    // Callback function to go back to note list
    goBack: () => void;
}

export default function EditNote(props: EditNoteProps) {
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
        saveNote(props.filename, newNote);
    }

    function goBack() {
        const newNote: Note = {
            title: title,
            body: body,
            dateCreated: props.note.dateCreated,
            dateModified: props.note.dateModified,
        }
        saveNote(props.filename, newNote);
        props.goBack();
    }

    return (
        <View style={{flex: 1}}>
            <Pressable onPress={goBack}>
                <AppText style={styles.button}>Go back</AppText>
            </Pressable>
            <Pressable onPress={async () => await deleteNote(props.filename)}>
                <AppText style={styles.button}>Delete Note</AppText>
            </Pressable>
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
            <Switch value={editing} onValueChange={updateEditing}/>
        </View>
    )
}