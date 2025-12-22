import { useState, useEffect } from "react";
import { ScrollView, TextInput, View, Alert, AlertButton } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { usePreventRemove } from "@react-navigation/native";

import showErrorDialog from "../shared/util/error";
import { useStyles, useTranslation } from "../shared/contexts/settingsContext";
import Note from "./types";
import { getNoteAsync, saveNoteAsync } from "./storage/notefiles";

import AppText from "../shared/components/AppText";
import { Params } from "../access/Unlocked";
import Loading from "../layout/Loading";
import { NotesText } from "./notesText";

const SaveStatuses = {
    SAVING: 'SAVING',
    SAVED: 'SAVED',
    FAILED: 'FAILED',
} as const;

type SaveStatus = typeof SaveStatuses[keyof typeof SaveStatuses];

// Maximum number of characters permitted in the title and body
const MAX_TITLE_LENGTH = 128;  // 2^7
const MAX_BODY_LENGTH = 16384;  // 2^14

const NOTE_SAVE_DEBOUNCE_MS = 750;

export default function EditNote(
    { route, navigation }: NativeStackScreenProps<Params, 'EditNote'>
) {
    const [loaded, setLoaded] = useState(false);
    const [saveStatus, setSaveStatus] =
        useState<SaveStatus>(SaveStatuses.SAVED);

    // Default values of blank note, in the event that a new note is being created
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [dateCreated, setDateCreated] = useState(Date.now());

    // The most recent values saved to the disk
    const [savedTitle, setSavedTitle] = useState('');
    const [savedBody, setSavedBody] = useState('');

    const filename = route.params.filename;
    const { styles, colorTheme } = useStyles();
    const text = useTranslation(NotesText);

    // Fetch the note from storage
    useEffect(() => {
        getNoteAsync(filename)
            .then(handleGetNote)
            .catch(handleGetNoteError);
    }, []);

    // Debounced save
    useEffect(() => {
        const timeout = setTimeout(checkForUpdates, NOTE_SAVE_DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [title, body]);

    usePreventRemove(title.length === 0, ({ data }) => {
        const cancelBtn: AlertButton = { text: text.BACK, style: "cancel" };
        const continueBtn: AlertButton = {
            text: text.CONTINUE,
            style: "destructive",
            onPress: () => checkForUpdates().then(
                () => navigation.dispatch(data.action)
            )
        };

        Alert.alert(
            text.WARNING,
            text.NO_TITLE_WARNING_MESSAGE,
            [cancelBtn, continueBtn]
        );
    });

    usePreventRemove(hasUnsavedChanges(), async ({ data }) => {
        await checkForUpdates();
        navigation.dispatch(data.action);
    });

    /*
    POC for diffing
    useEffect(() => {

        console.log("body changed");
        const bodyPatch = structuredPatch(filename, filename, initialBody, body);
        console.log({ bodyPatch });
        const timeout2 = setTimeout(() => {
            console.log("reserving patch");
            const reversed = reversePatch(bodyPatch);
            const undoneBody = applyPatch(body, reversed);
            console.log({ reversed, undoneBody });
            setBody(!undoneBody ? "error" : undoneBody);
        }, 1000);

        return () => clearTimeout(timeout2);
    }, [body]);
    */

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

    function hasUnsavedChanges() {
        return (
            savedTitle !== title
            || savedBody !== body
        );
    }

    function getNoteStatusText() {
        if (saveStatus === SaveStatuses.SAVING) {
            return text.SAVING;
        }
        if (saveStatus === SaveStatuses.FAILED) {
            return text.FAILED_TO_SAVE;
        }
        if (hasUnsavedChanges()) {
            return text.UNSAVED_CHANGES;
        }
        return text.ALL_CHANGES_SAVED;
    }

    /**
     * Checks for any new changes in the note.
     * Saves the note if there are changes.
     */
    async function checkForUpdates() {
        if (!loaded || !hasUnsavedChanges()) {
            return;
        }

        const newNote = {
            title: title,
            body: body,
            dateModified: Date.now(),
            dateCreated: dateCreated,
        };

        try {
            /*
                TODO: Save requests should be queued instead.

                Currently the wrong status "UNSAVED" is shown if an edit is
                made while saving (should instead be "SAVING"). Saves are fast
                enough where this practically doesn't matter and only the
                "SAVED" status is ever visible to the user.
            */
            setSaveStatus(SaveStatuses.SAVING);
            await saveNoteAsync(filename, newNote);
            setSavedTitle(title);
            setSavedBody(body); 
            setSaveStatus(SaveStatuses.SAVED);
        } catch (err) {
            setSaveStatus(SaveStatuses.FAILED);
            showSaveErrorDialog(err);
        }
    }

    function showSaveErrorDialog(error: unknown) {
        const ignoreBtn: AlertButton = { text: text.IGNORE, style: "cancel" };
        const retryButton: AlertButton = {
            text: text.RETRY,
            style: "destructive",
            onPress: () => checkForUpdates(),
        };

        Alert.alert(
            text.FAILED_TO_SAVE,
            text.FAILED_TO_SAVE_MESSAGE + '\n\n' + error,
            [ignoreBtn, retryButton]
        );
    }

    if (!loaded) {
        return <Loading message={text.FETCHING_NOTE_CONTENTS} />
    }

    return (
        <View style={styles.app}>
            <ScrollView style={styles.editNote}>
                <TextInput 
                    style={styles.noteTitle}
                    value={title}
                    maxLength={MAX_TITLE_LENGTH}
                    onChangeText={setTitle}
                    placeholder={text.TITLE}
                    placeholderTextColor={colorTheme.placeholder}
                    multiline
                />
                <TextInput 
                    style={styles.noteBody}
                    value={body}
                    maxLength={MAX_BODY_LENGTH}
                    onChangeText={setBody}
                    placeholder={text.WRITE_SOMETHING_HERE}
                    placeholderTextColor={colorTheme.placeholder}
                    multiline
                />
            </ScrollView>
            <View style={styles.noteStatusBar}>
                <AppText style={styles.noteStatusBarText}>
                    {getNoteStatusText()}
                </AppText>
                <AppText style={styles.noteStatusBarText}>
                    {body.length} / {MAX_BODY_LENGTH}
                </AppText>
            </View>
        </View>
    );
}
