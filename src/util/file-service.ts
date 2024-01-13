/** 
 * Read, write, and delete login details from Secure Store and 
 * notes from external storage
 * */

import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

import { 
    decryptData,
    encryptData,
    generateSalt,
    saltAndSha256,
    registerPinAsEncryptionKey,
} from './encryption-service';

import Note, { isNote } from './note';

export type LoginInfo = {
    hash: string,
    salt: string,
}

const saltLength = 64;
const notesDir = FileSystem.documentDirectory + 'notes/';


// Functions to interact with secure store

/**
 * Hash, salt, and save pin to secure store in local storage.
 * @param pin pin to save
 * @returns Promise with new login info saved. Will reject promise if data cannot be saved.
 */
export async function savePinAsync(pin: string): Promise<LoginInfo> {
    const loginSalt = generateSalt(saltLength);
    const loginHash = saltAndSha256({ text: pin, salt: loginSalt })

    registerPinAsEncryptionKey(pin);

    try {
        await SecureStore.setItemAsync('loginHash', loginHash);
        await SecureStore.setItemAsync('loginSalt', loginSalt);
    } catch (error) {
        console.error("An error occured in savePinAsync:", error);
        throw error;
    }

    return { hash: loginHash, salt: loginSalt };
}

/**
 * Remove login information from local storage
 * Will reject promise if data cannot be deleted.
 */
export async function deletePinAsync() {
    try {
        await SecureStore.deleteItemAsync('loginHash');
        await SecureStore.deleteItemAsync('loginSalt');
        await SecureStore.deleteItemAsync('encryptionSalt');
    } catch (error) {
        console.error("An error occured in deletePinAsync:", error);
        throw error;
    }
}

/**
 * Retrieve login hash and salt from local storage, if it exists
 * @returns object containing login hash and salt if it exists, null otherwise
 */
export async function getLoginAsync(): Promise<LoginInfo | null> {
    try {
        const loginHash = await SecureStore.getItemAsync('loginHash');
        const loginSalt = await SecureStore.getItemAsync('loginSalt');

        if (loginHash === null || loginSalt === null)
            return null;

        return { hash: loginHash, salt: loginSalt };
    } catch (error) {
        console.error("An error occured in getLoginAsync:", error);
        return null;
    }
}


// Functions to interact with external file storage

/**
 * Saves and encrypts given note to given filename in notes directory of external storage.
 * Rejects promise if file cannot be saved.
 * @param filename name of the note file with extension
 * @param note note to save to file
 */
export async function saveNoteAsync(filename: string, note: Note) {
    const text = JSON.stringify(note);

    try {
        await FileSystem.readDirectoryAsync(notesDir);
    } catch {
        await FileSystem.makeDirectoryAsync(notesDir);
    }
    try {
        const fileUri = notesDir + filename
        await FileSystem.writeAsStringAsync(fileUri, encryptData(text));
    } catch (error) {
        console.error("An error occured in saveNoteAsync:", error);
        throw error;
    }
}

/**
 * Retreives the note with the given filename, if it exists.
 * @param fileName name of the note file with extension
 * @returns note as an object if there is a correspondind file, null otherwise
 */
export async function getNoteAsync(filename: string): Promise<Note | null> {
    const fileUri = notesDir + filename;
    try {
        const rawFile = await FileSystem.readAsStringAsync(fileUri)
        const decrypted = JSON.parse(decryptData(rawFile));

        if (isNote(decrypted)) {
            return decrypted;
        } else {
            return null;
        }
    } catch (error) {
        console.error("An error occured in getNoteAsync:", error);
        return null;
    }
}

/**
 * Retrieves map of all notes in external storage with key=filename, value=note
 * @returns map of notes currently in external storage
 */
export async function getNotesAsync(): Promise<Map<string, Note>> {
    const result = new Map<string, Note>();
    try {
        const filenames = await FileSystem.readDirectoryAsync(notesDir);

        for (const filename of filenames) {
            const note = await getNoteAsync(filename);
            if (note)
                result.set(filename, note);
        }
        return result;
    } catch {
        // Directory not found or empty
        return result
    }
}

/**
 * Deletes note with given filename from the notes directory in external storage.
 * Promise will reject if there the note cannot be deleted
 * @param filename filename of note, with extension
 */
export async function deleteNoteAsync(filename: string) {
    const fileUri = notesDir + filename;
    try {
        await FileSystem.deleteAsync(fileUri);
    } catch (error) {
        console.error("An error occured in deleteNoteAsync:", error);
        throw error;
    }
}
