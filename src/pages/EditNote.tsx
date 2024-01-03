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
    goBack: (note: Note) => void;
}

export default function EditNote(props: EditNoteProps) {
    const [title, setTitle] = useState(props.note.title);
    const [body, setBody] = useState(props.note.body);
    const [dateModified, setDateModified] = useState(props.note.dateModified);
    const [editing, setEditing] = useState(true);

    function saveTitle(newTitle: string) {
        setTitle(newTitle);
        setDateModified(Date.now());
        // Save note to external storage
        saveNote(props.filename, {
            title: newTitle,
            body: body,
            dateCreated: props.note.dateCreated,
            dateModified: Date.now(),
        });
    }

    function saveBody(newBody: string) {
        setBody(newBody)
        setDateModified(Date.now());
        // Save note to external storage
        saveNote(props.filename, {
            title: title,
            body: newBody,
            dateCreated: props.note.dateCreated,
            dateModified: Date.now(),
        });
    }

    function goBack() {
        // Save note to external storage
        props.goBack({
            title: title,
            body: body,
            dateCreated: props.note.dateCreated,
            dateModified: dateModified,
        });
    }

    return (
        <View style={{flex: 1}}>
            <Pressable onPress={goBack}>
                <AppText style={styles.button}>Go Back</AppText>
            </Pressable>
            <Pressable onPress={() => deleteNote(props.filename)}>
                <AppText style={styles.button}>Delete Note</AppText>
            </Pressable>
            <ScrollView style={{flex: 1}}>
                <TextInput 
                    style={styles.noteTitle}
                    value={title}
                    onChangeText={saveTitle}
                    placeholder='Title'
                    placeholderTextColor={darkModeColors.placeholder}
                    multiline
                    editable={editing}
                />
                <TextInput 
                    style={styles.noteBody}
                    value={body}
                    onChangeText={saveBody}
                    placeholder='Write something here...'
                    placeholderTextColor={darkModeColors.placeholder}
                    multiline
                    editable={editing}
                />
            </ScrollView>
            <Switch value={editing} onValueChange={setEditing}/>
        </View>
    )
}