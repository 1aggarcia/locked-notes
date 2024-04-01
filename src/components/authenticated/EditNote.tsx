import { useState, useEffect } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import showErrorDialog from "../../util/error";
import { getNoteAsync, saveNoteAsync } from "../../util/storage/notefiles";
import Note from "../../util/types/note";
import Styles from "../../util/services/styles";

import { Params } from "../screens/Unlocked";
import Loading from "../screens/Loading";
import AppText from "../shared/AppText";

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

    // The most recent values saved to the disk
    const [savedTitle, setSavedTitle] = useState('');
    const [savedBody, setSavedBody] = useState('');

    const filename = route.params.filename;
    const styles = Styles.get();

    // Fetch the note from storage
    useEffect(() => {
        getNoteAsync(filename)
            .then(handleGetNote)
            .catch(handleGetNoteError);
    }, []);

    // Wait one second after the user finishes typing to save
    useEffect(() => {
        if (!loaded) return;

        const timeout = setTimeout(checkForUpdates, 1000);

        // Reset the timeout whenever the note changes
        return () => clearTimeout(timeout);
    },
    [title, body]);

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            checkForUpdates();
            navigation.dispatch(e.data.action);
        })
    }, [navigation])

    function handleGetNote(note: Note | null) {
        if (note !== null) {
            setTitle(note.title);
            setBody(note.body);
            setDateCreated(note.dateCreated);

            setSavedTitle(note.title);
            setSavedBody(note.body);
        }
        // If no note was found, the default values already
        // in state work perfectly to make a new one
        setLoaded(true);
    }

    function handleGetNoteError(reason: unknown) {
        showErrorDialog(reason);
        navigation.goBack();
    }

    /**
     * Checks for any new changes in the note.
     * Saves the note if there are changes.
     */
    function checkForUpdates() {
        // TODO: make async
        if (savedTitle === title && savedBody === body) {
            // no new changes
            return;
        }
        saveNoteAsync(filename, {
            title: title,
            body: body,
            dateModified: Date.now(),
            dateCreated: dateCreated,
        })
        .then(() => {
            setSavedTitle(title);
            setSavedBody(body);
        })
        .catch(showErrorDialog);
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
                    onChangeText={setTitle}
                    placeholder='Title'
                    placeholderTextColor={Styles.getColorTheme().placeholder}
                    multiline
                />
                <TextInput 
                    style={styles.noteBody}
                    value={body}
                    maxLength={maxBodyLength}
                    onChangeText={setBody}
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