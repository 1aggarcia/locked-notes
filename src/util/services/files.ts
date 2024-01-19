/** 
 * Read, write, and delete settings from Secure Store and 
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
} from './encryption';

import Note, { isNote } from '../types/note';
import Settings, { defaultSettings, isValidSettings } from '../types/settings';

export type LoginInfo = {
    hash: string,
    salt: string,
}

const maxStringLength = 1 << 16; // 2^16
const saltLength = 64;
const notesDir = FileSystem.documentDirectory + 'notes/';


// -------------------------------------------------------- //
//                  Secure Score functions
// -------------------------------------------------------- //

/**
 * Hash, salt, and save pin to secure store in local storage.
 * @param pin pin to save
 * @returns Promise with new login info saved.
 *      Will reject promise if data cannot be saved,
 *      or if string is too long (cap: 2^16 chars)
 */
export async function savePinAsync(pin: string): Promise<LoginInfo> {
    if (pin.length > maxStringLength)
        throw new RangeError(`pin is too long: ${pin}`);

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


/**
 * Save a timestamp to Secure Store before which the app will not be accessible.
 * Rejects promise if there is an error in saving.
 * @param timestamp The date and time when access should be permitted.
 * 
 */
export async function setAccessTimeAsync(timestamp: Date): Promise<void> {
    try {
        // The timestamp is stored as a plain number to
        // make decoding easier and more reliable
        const timestamp_ms: number = timestamp.getTime();

        await SecureStore.setItemAsync('accessTime', timestamp_ms.toString());
    } catch (error) {
        console.error("An error occured in setAccessTimeAsync:", error);
        throw error;
    }
}

/**
 * Gets the timestamp from Secure Store before which the app
 * will not be accessible.
 * 
 * @returns Promise with timestamp from Secure Store as a Date object.
 *      If none is found, the epoch time (1970-01-01 00:00:00) is returned.
 */
export async function getAccessTimeAsync(): Promise<Date> {
    try {
        const timestamp_ms = Number(await SecureStore.getItemAsync('accessTime'));
        return new Date(timestamp_ms);
    } catch (error) {
        console.error("An error occured in getAccessTimeAsync:", error);
        return new Date(0);
    }
}


/**
 * Save the settings passed in to Secure Store. Rejects promise if there is
 * an issue savings
 * @param settings object with theme and unlockedTime fields
 */
export async function saveSettingsAsync(settings: Settings): Promise<void> {
    try {
        await SecureStore.setItemAsync('settings', JSON.stringify(settings));
    } catch (error) {
        console.error('An error occured in saveSettingsAsync:', error);
        throw error;
    }
}

/**
 * Get settings from Secure Store on device. If no settings are found,
 * the default settings are saved and returned.
 * @returns Promise resolving to settings
 */
export async function getSettingsAsync(): Promise<Settings> {
    try {
        const data = await SecureStore.getItemAsync('settings');

        if (data !== null && isValidSettings(JSON.parse(data))) {
            return JSON.parse(data);
        } else {
            // No settings saved or invalid: save default settings
            SecureStore.setItemAsync('settings', JSON.stringify(defaultSettings));
            return defaultSettings;
        }
    } catch (error) {
        console.error('An error occured in getSettingsAsync:', error);
        throw error;
    }
}

// -------------------------------------------------------- //
//        File Service functions (external storage)
// -------------------------------------------------------- //

/**
 * Saves and encrypts given note to given filename in notes
 * directory of external storage. Will reject promise if data
 * cannot be saved, or if the note title/body is too long (cap: 2^16 chars)
 * 
 * @param filename name of the note file with extension
 * @param note note to save to file
 */
export async function saveNoteAsync(filename: string, note: Note) {
    if (note.title.length > maxStringLength || note.body.length > maxStringLength)
        throw new RangeError(`note is too long: ${note}`);

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
        const decryptedFile = decryptData(await FileSystem.readAsStringAsync(fileUri));
        if (decryptedFile === null)
            // Decryption failed
            return null;

        const note = JSON.parse(decryptedFile);
        if (!isNote(note))
            return null;

        return note;
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
            if (note !== null)
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

/** 
 * For testing purposes ONLY
 * Not reccomended to use on real device, overwrites every function in directory selected
 */
export async function testSafAsync() {
    try {
        // Get folder
        const permissions = await FileSystem
            .StorageAccessFramework
            .requestDirectoryPermissionsAsync()

        // Verify permissions
        if (!permissions.granted) {
            alert('Access Denied');
            return;
        }

        // Enumerate files
        const names = await FileSystem
            .StorageAccessFramework
            .readDirectoryAsync(permissions.directoryUri);
        for (const fileUri of names) {
            // Write to file
            await FileSystem.StorageAccessFramework.writeAsStringAsync(
                fileUri, '-',
            )
            console.log(`File overwritted ${fileUri}?`);
        }
    } catch (error) {
        console.log(error);
    }

    // // Create new file
    // fileUri = await FileSystem
    //     .StorageAccessFramework
    //     .createFileAsync(uri, 'titulo.txt', 'text/plain');
}
