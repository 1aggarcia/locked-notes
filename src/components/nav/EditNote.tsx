import { useState, useEffect } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import showErrorDialog from "../../util/error";
import { getNoteAsync, saveNoteAsync } from "../../util/services/notefiles";
import Note from "../../util/types/note";
import Styles from "../../util/services/styles";

import { Params } from "../screens/Unlocked";
import Loading from "../screens/Loading";
import AppText from "../common/AppText";

// Maximum number of characters permitted in the title and body
const maxTitleLength = 128;  // 2^7
const maxBodyLength = 16384;  // 2^14

export default function EditNote(
    { route, navigation }: NativeStackScreenProps<Params, 'EditNote'>
) {
    const [loaded, setLoaded] = useState(false);

    // Default values of blank note, in the event that a new note is being created
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [dateCreated, setDateCreated] = useState(Date.now());

    const filename = route.params.filename;
    const styles = Styles.get();

    // Retreive note from storage
    useEffect(() => {
        getNoteAsync(filename)
            .then(handleGetNote)
            .catch(handleGetNoteError);
    }, []);

    function handleGetNote(note: Note | null) {
        if (note !== null) {
            setTitle(note.title);
            setBody(note.body);
            setDateCreated(note.dateCreated);
        }
        // If no note was found, the default values already
        // in state work perfectly to make a new one
        setLoaded(true);
    }

    function handleGetNoteError(reason: unknown) {
        showErrorDialog(reason);
        navigation.goBack();
    }

    function saveTitle(newTitle: string) {
        if (newTitle.length > maxTitleLength) return;

        setTitle(newTitle);

        // Save note to external storage
        saveNoteAsync(filename, {
            title: newTitle,
            body: body,
            dateModified: Date.now(),
            dateCreated: dateCreated,
        }).catch(showErrorDialog);
    }

    function saveBody(newBody: string) {
        if (newBody.length > maxBodyLength) return;

        setBody(newBody);

        // Save note to external storage
        saveNoteAsync(filename, {
            title: title,
            body: newBody,
            dateModified: Date.now(),
            dateCreated: dateCreated,
        }).catch(showErrorDialog);
    }

    if (!loaded) {
        return <Loading message="Fetching note contents..." />
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
                    placeholderTextColor={Styles.getColorTheme().placeholder}
                    multiline
                />
                <TextInput 
                    style={styles.noteBody}
                    value={body}
                    maxLength={maxBodyLength}
                    onChangeText={saveBody}
                    placeholder='Write something here...'
                    placeholderTextColor={Styles.getColorTheme().placeholder}
                    multiline
                />
            </ScrollView>
            <AppText style={styles.charCount}>
                {body.length} / {maxBodyLength}
            </AppText>
        </View>
    )
}

// Check for blank note before closing
// useEffect(() => {
    //     navigation.addListener('beforeRemove', (e) => {
    //         if (title.length > 0) {
    //             return;
    //         }
    //         // e.preventDefault();
    //         // alert('No creás notas blancas');
    //     })
    // }, [navigation, title])