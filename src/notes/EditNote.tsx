import { useState, useEffect } from "react";
import { ScrollView, TextInput, View, Alert, AlertButton, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { usePreventRemove } from "@react-navigation/native";

// https://icons.expo.fyi/Index/Ionicons/arrow-undo
import Ionicons from '@expo/vector-icons/Ionicons';

import showErrorDialog from "../shared/util/error";
import { useStyles, useTranslation } from "../shared/contexts/settingsContext";
import Note from "./types";
import { getNoteAsync, saveNoteAsync } from "./storage/notefiles";

import AppText from "../shared/components/AppText";
import { Params } from "../access/Unlocked";
import Loading from "../layout/Loading";
import { NotesText } from "./notesText";
import {
    addPatchToEditHistory,
    canRedoPatch,
    canUndoPatch,
    initEditHistory,
    NoteContents,
    redoCurrentPatch,
    undoCurrentPatch,
} from "./editHistory";
import { useDebounce } from "./hooks";

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
    const [savedContents, setSavedContents] = useState<NoteContents>({
        title: '',
        body: '',
    });
    const [editHistory, setEditHistory] = useState(initEditHistory());

    const debounce = useDebounce(NOTE_SAVE_DEBOUNCE_MS);
    const { styles, colorTheme } = useStyles();
    const text = useTranslation(NotesText);
    
    const filename = route.params.filename;

    // Fetch the note from storage
    useEffect(() => {
        getNoteAsync(filename)
            .then(handleGetNote)
            .catch(handleGetNoteError);
    }, []);

    usePreventRemove(title.length === 0, ({ data }) => {
        const cancelBtn: AlertButton = { text: text.BACK, style: "cancel" };
        const continueBtn: AlertButton = {
            text: text.CONTINUE,
            style: "destructive",
            onPress: () => saveNote({ title, body }).then(
                () => navigation.dispatch(data.action)
            )
        };

        Alert.alert(
            text.WARNING,
            text.NO_TITLE_WARNING_MESSAGE,
            [cancelBtn, continueBtn]
        );
    });

    usePreventRemove(!matchesSavedVersion(title, body), async ({ data }) => {
        await saveNote({ title, body });
        navigation.dispatch(data.action);
    });

    function matchesSavedVersion(title: string, body: string): boolean {
        return title === savedContents.title && body === savedContents.body;
    }

    async function saveNote(contents: NoteContents) {
        const { title, body } = contents;
        if (!loaded || matchesSavedVersion(title, body)) {
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
            setSavedContents(contents);
            setSaveStatus(SaveStatuses.SAVED);
        } catch (err) {
            setSaveStatus(SaveStatuses.FAILED);
            showSaveErrorDialog(err, () => saveNote(contents));
        }
    }

    function showSaveErrorDialog(error: unknown, retry: () => void) {
        const ignoreBtn: AlertButton = { text: text.IGNORE, style: "cancel" };
        const retryButton: AlertButton = {
            text: text.RETRY,
            style: "destructive",
            onPress: retry,
        };

        Alert.alert(
            text.FAILED_TO_SAVE,
            text.FAILED_TO_SAVE_MESSAGE + '\n\n' + error,
            [ignoreBtn, retryButton]
        );
    }

    function handleGetNote(note: Note | null) {
        if (note !== null) {
            setTitle(note.title);
            setBody(note.body);
            setDateCreated(note.dateCreated);
            setSavedContents(note);

            // Reset the edit history with the last saved version
            setEditHistory(initEditHistory(note));
        }
        // If no note was found, the default values already
        // in state work perfectly to make a new one
        setLoaded(true);
    }

    function handleGetNoteError(reason: unknown) {
        showErrorDialog(reason);
        navigation.goBack();
    }

    function handleEdit(title: string, body: string) {
        setTitle(title);
        setBody(body);
        debounce(async () => {
            await saveNote({ title, body });
            setEditHistory((history) => addPatchToEditHistory(
                { title, body, filename },
                history
            ));
        });
    }

    function handleUndoPress() {
        if (!canUndoPatch(editHistory)) {
            return;
        }
        const updated = undoCurrentPatch({ title, body }, editHistory);

        setTitle(updated.note.title);
        setBody(updated.note.body);
        setEditHistory(updated.editHistory);

        debounce(() => saveNote(updated.note));
    }

    function handleRedoPress() {
        if (!canRedoPatch(editHistory)) {
            return;
        }
        const updated = redoCurrentPatch({ title, body }, editHistory);

        setTitle(updated.note.title);
        setBody(updated.note.body);
        setEditHistory(updated.editHistory);

        debounce(() => saveNote(updated.note));
    }

    function getNoteStatusText() {
        if (saveStatus === SaveStatuses.SAVING) {
            return text.SAVING;
        }
        if (saveStatus === SaveStatuses.FAILED) {
            return text.FAILED_TO_SAVE;
        }
        if (!matchesSavedVersion(title, body)) {
            return text.UNSAVED_CHANGES;
        }
        return text.ALL_CHANGES_SAVED;
    }

    if (!loaded) {
        return <Loading message={text.FETCHING_NOTE_CONTENTS} />
    }

    const UndoButton = () => (
        <TouchableOpacity
            style={{ padding: 10 }}
            disabled={!canUndoPatch(editHistory)}
            onPress={handleUndoPress}
        >
            <Ionicons
                name="arrow-undo-sharp"
                size={24}
                color={colorTheme.placeholder}
            />
        </TouchableOpacity>
    );
    
    const RedoButton = () => (
        <TouchableOpacity
            style={{ padding: 10 }}
            disabled={!canRedoPatch(editHistory)}
            onPress={handleRedoPress}
        >
            <Ionicons
                name="arrow-redo-sharp"
                size={24}
                color={colorTheme.placeholder}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.app}>
            <ScrollView style={styles.editNote}>
                <TextInput 
                    style={styles.noteTitle}
                    value={title}
                    maxLength={MAX_TITLE_LENGTH}
                    onChangeText={(newTitle) => handleEdit(newTitle, body)}
                    placeholder={text.TITLE}
                    placeholderTextColor={colorTheme.placeholder}
                    multiline
                />
                <TextInput 
                    style={styles.noteBody}
                    value={body}
                    maxLength={MAX_BODY_LENGTH}
                    onChangeText={(newBody) => handleEdit(title, newBody)}
                    placeholder={text.WRITE_SOMETHING_HERE}
                    placeholderTextColor={colorTheme.placeholder}
                    multiline
                />
            </ScrollView>
            <View style={styles.noteStatusBar}>
                <View style={{ flexDirection: "row" }}>
                    <UndoButton />
                    <RedoButton />
                </View>
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
