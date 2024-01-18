import { useState, useEffect } from "react";
import { ScrollView, TextInput, View, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import showErrorDialog from "../../util/error";
import { saveNoteAsync } from "../../util/files";
import { Params } from "../screens/Unlocked";

import styles, { colorMap } from "../../util/styles";

// Maximum number of characters permitted in the title and body
const maxTitleLength = 128;  // 2^7
const maxBodyLength = 16384;  // 2^14

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
            // alert('No creás notas blancas');
        })
    }, [navigation, title])

    function saveTitle(newTitle: string) {
        // If title is too long, don't save it
        if (newTitle.length > maxTitleLength)
            return;

        setTitle(newTitle);
        setDateModified(Date.now());
        // Save note to external storage
        saveNoteAsync(
            props.filename, {
                title: newTitle,
                body: body,
                dateCreated: props.note.dateCreated,
                dateModified: Date.now(),
            }
        ).catch(showErrorDialog);
    }

    function saveBody(newBody: string) {
        // If body is too long, don't save it
        if (newBody.length > maxBodyLength)
            return;

        setBody(newBody)
        setDateModified(Date.now());
        // Save note to external storage
        saveNoteAsync(
            props.filename, {
                title: title,
                body: newBody,
                dateCreated: props.note.dateCreated,
                dateModified: Date.now(),
            }
        ).catch(showErrorDialog);
    }

    return (
        <View style={styles.app}>
            <ScrollView style={styles.editNote}>
                <TextInput 
                    style={styles.noteTitle}
                    value={title}
                    maxLength={maxTitleLength}
                    onChangeText={saveTitle}
                    placeholder='Title'
                    placeholderTextColor={colorMap.placeholder}
                    multiline
                />
                <TextInput 
                    style={styles.noteBody}
                    value={body}
                    maxLength={maxBodyLength}
                    onChangeText={saveBody}
                    placeholder='Write something here...'
                    placeholderTextColor={colorMap.placeholder}
                    multiline
                />
            </ScrollView>
        </View>
    )
}