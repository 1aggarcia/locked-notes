/** 
 * Interact with files in user directories using Android's
 * Storage Access Framework. (iOS solution needs to be found)
 */

import * as FileSystem from 'expo-file-system';

import { Platform } from 'react-native';
import { StorageAccessFramework as SAF } from 'expo-file-system';
import { getRawNoteAsync, NOTES_DIR } from './notefiles';

/**
 * Request folder permissions from user, write given file as text
 * to the location user picks
 * 
 * @param filename name of file to save
 * @param content contents of file in text
 * @returns boolean Promise resolving to true if the file was sucessfully
 *  written, false if the user denies access. Promise rejects if an error
 *  occurs in the file system.
 */
export async function exportTextFileAsync(filename: string, content: string) {
    if (Platform.OS !== "android") {
        throw new Error("operation exportTextFileAsync is only supported by Android");
    }

    try {
        const permissions = await SAF.requestDirectoryPermissionsAsync();

        if (!permissions.granted) {
            return false;
        }
        // Create new file at the directory user selected
        const dir = permissions.directoryUri;
        const fileUri = await SAF.createFileAsync(dir, filename, 'text');

        await SAF.writeAsStringAsync(fileUri, content);

        return true;
    } catch (error) {
        console.error("An error occured in exportTextFileAsync:", error);
        throw error;
    }
}

/**
 * Prompt the user to choose a folder, then export all note files in the note
 * directory to that folder. The notes are not decrypted.
 * @returns true if the user gives permission, false otherwise.
 *  Rejects promise if there is an error in the file system
 */
export async function exportAllNotes() {
    if (Platform.OS !== "android") {
        throw new Error("operation exportAllData is only supported by Android");
    }

    try {
        const permissions = await SAF.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
            return false;
        }

        const dir = permissions.directoryUri
        const filenames = await FileSystem.readDirectoryAsync(NOTES_DIR);
        for (const filename of filenames) {
            const content = await getRawNoteAsync(filename);
            if (content === null) {
                console.warn(`file could not be read: ${filename}`);
                continue;
            }
            const fileUri = await SAF.createFileAsync(dir, filename, 'text');
            await SAF.writeAsStringAsync(fileUri, content);
        }
    } catch (error) {
        console.error("An error occured in exportAllData:", error);
        throw error;
    }
    return true;
}
