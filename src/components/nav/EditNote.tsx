import { useState, useEffect } from "react";

import { Button, ScrollView, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { deleteNote, saveNote } from "../../util/file-service";
import { Params } from "../screens/Unlocked";

import styles, { colorMap } from "../../util/styles";


export default function EditNote({ route, navigation }: NativeStackScreenProps<Params, 'EditNote'>) {
    const props = route.params;

    const [title, setTitle] = useState(props.note.title);
    const [body, setBody] = useState(props.note.body);
    const [dateModified, setDateModified] = useState(props.note.dateModified);

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if (title.length > 0) {
                return;
            }
            // e.preventDefault();
            alert('No creás notas blancas');
        })
    }, [navigation, title])

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

    function deleteSelf() {
        deleteNote(props.filename);
        navigation.goBack();
    }

    return (
        <View style={styles.app}>
            {/* <Button title='Delete Note' onPress={deleteSelf} /> */}
            <ScrollView style={{flex: 1}}>
                <TextInput 
                    style={styles.noteTitle}
                    value={title}
                    onChangeText={saveTitle}
                    placeholder='Title'
                    placeholderTextColor={colorMap.placeholder}
                    multiline
                />
                <TextInput 
                    style={styles.noteBody}
                    value={body}
                    onChangeText={saveBody}
                    placeholder='Write something here...'
                    placeholderTextColor={colorMap.placeholder}
                    multiline
                />
            </ScrollView>
        </View>
    )
}