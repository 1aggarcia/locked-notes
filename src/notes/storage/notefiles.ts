/** Manage note files from the local file system */

import * as FileSystem from 'expo-file-system';

import appEncryptor, { Encryptor } from '../../shared/services/encryption';
import Note, { NoteMetadata, isNote } from '../types';

export const NOTES_DIR = FileSystem.documentDirectory + 'notes/';
const MAX_STRING_LEN = 1 << 16;  // 2^16
const TEMP_FILE_EXTENSION = ".swp";

/**
 * Saves and encrypts given note to given filename in notes
 * directory of external storage. Will reject promise if data
 * cannot be saved, or if the note title/body is too long (cap: 2^16 chars)
 * 
 * @param filename name of the note file with extension
 * @param note note to save to file
 */
export async function saveNoteAsync(filename: string, note: Note) {
    saveAndEncryptNote(filename, note, appEncryptor);
}

/**
 * Retreives the file with the given filename from the notes directory,
 * if it exists
 * @param filename name of the file
 * @returns file contents if there is a corresponding file, null otherwise
 */
export async function getRawNoteAsync(filename: string): Promise<string | null> {
    try {
        return await FileSystem.readAsStringAsync(NOTES_DIR + filename);
    } catch (error) {
        console.warn("An error occured in getRawNoteAsync:", error);
        return null;
    }
}

/**
 * Retreives the note with the given filename, if it exists.
 * @param filename name of the note file with extension
 * @returns note as an object if there is a corresponding file, null otherwise.
 *  The object includes the file size in bytes.
 */
export async function getNoteAsync(filename: string) {
    const fileUri = NOTES_DIR + filename;
    try {
        const info = await FileSystem.getInfoAsync(fileUri);
        if (!info.exists) {
            console.log(`note file does not exist: ${fileUri}`);
            return null;
        }
        const decryptedFile = appEncryptor.decrypt(
            await FileSystem.readAsStringAsync(fileUri)
        );
        if (decryptedFile === null) {
            // Decryption failed
            console.warn(`getNoteAsync: decryption failed ${filename}`);
            return null;
        }
        const note = JSON.parse(decryptedFile);
        if (!isNote(note))
            return null;

        return { ...note, size: info.size };
    } catch (error) {
        console.log("getNoteAsync caught an error:", error);
        return null;
    }
}

/**
 * Retrieves list of all notes in external storage
 * @returns map of notes currently in the notes directory
 */
export async function getNoteListAsync(): Promise<NoteMetadata[]> {
    const result: NoteMetadata[] = [];
    try {
        await cleanupTempNoteFiles();
        const filenames = await FileSystem.readDirectoryAsync(NOTES_DIR);

        for (const filename of filenames) {
            const note = await getNoteAsync(filename);
            if (note === null) {
                continue;
            }
            // Add metadata to list
            result.push({
                filename: filename,
                title: note.title,
                dateCreated: note.dateCreated,
                dateModified: note.dateModified,
                fileSize: note.size,
            });
        }
    } catch (error) {
        // Directory not found or empty
        console.warn("getNoteListAsync", error);
    }
    return result;
}

/**
 * Deletes note with given filename from the notes directory in external storage.
 * Promise will reject if there the note cannot be deleted
 * @param filename filename of note, with extension
 */
export async function deleteNoteAsync(filename: string) {
    const fileUri = NOTES_DIR + filename;
    try {
        await FileSystem.deleteAsync(fileUri);
    } catch (error) {
        console.error("An error occured in deleteNoteAsync:", error);
        throw error;
    }
}

/**
 * Makes a copy of all readble notes on disk, decrypted with the saved app
 * encryptor and encrypted with the PIN passed in. The files have the same
 * as the original, but with `.swp` added to the end.
 * 
 * e.g. a file `note.ejn` encrypted with the pin 123456 would be copied to
 * `note.ejn.swp` encrypted with `newPin`
 * @param newPin PIN to use for encryption
 */
export async function reencryptNotesAsync(newPin: string) {
    const newEncryptor = new Encryptor();
    newEncryptor.registerPinAsKey(newPin);

    let filenames: string[];
    try {
        filenames = await FileSystem.readDirectoryAsync(NOTES_DIR);
    } catch (error) {
        // probably the first time user is using the app
        console.log("reencryptNotesAsync: notes directory doesn't exist", error);
        return; 
    }

    for (const filename of filenames) {
        try {
            await reencryptNote(filename, newEncryptor);
        } catch (error) {
            console.error(`Failed to reencrypt ${filename}: ${error}`);
            throw error;
        }
    }
}

/**
 * Cleanup to perform on the disk after calling `reencryptNotesAsync`.
 * 
 * Looks for pairs of notes in the notes directory with names
 * `filename` and `filename`.swp. If `filename`.swp can be decrypted with the app
 * encryptor, but `filename` cannot, then `filename` is deleted and
 * `filename`.swp is renamed to `filename`.
 * @returns Promise resolving if cleanup is successful, rejecting if an error occurs
 * with the file system
 */
export async function cleanupTempNoteFiles() {
    let filenames: Set<string>;
    try {
        filenames = new Set(await FileSystem.readDirectoryAsync(NOTES_DIR));
    } catch (error) {
        // probably the first time the user is using the app
        console.log("cleanupTempNoteFiles: notes directory doesn't exist - ", error);
        throw error;
    }

    for (const filename of filenames) {
        const swapFilename = filename + TEMP_FILE_EXTENSION;
        if (!filenames.has(swapFilename)) continue;

        const file = await getNoteAsync(filename);
        const swapFile = await getNoteAsync(swapFilename);

        if (file === null && swapFile !== null) {
            // Happy path: reencryption succeeded
            await FileSystem.moveAsync({
                from: NOTES_DIR + swapFilename,
                to: NOTES_DIR + filename
            });  // this may throw
        } else if (file !== null && swapFile === null) {
            console.warn(`reencryption failed on ${filename}: deleting ${swapFilename}`);
            await deleteNoteAsync(swapFilename);
        } else {
            throw new Error(`niether ${filename} nor ${swapFilename} can be decrypted`);
        }
    }
}

// Helper functions //

async function saveAndEncryptNote(
    filename: string, note: Note, encryptor: Encryptor
) {
    if (note.title.length > MAX_STRING_LEN || note.body.length > MAX_STRING_LEN)
        throw new RangeError(`note is too long: ${note}`);

    const text = JSON.stringify(note);

    try {
        await FileSystem.readDirectoryAsync(NOTES_DIR);
    } catch {
        await FileSystem.makeDirectoryAsync(NOTES_DIR);
    }
    try {
        const fileUri = NOTES_DIR + filename
        await FileSystem.writeAsStringAsync(fileUri, encryptor.encrypt(text));
        console.debug(`File ${filename} saved`);
    } catch (error) {
        console.error("An error occured in saveNoteAsync:", error);
        throw error;
    }
}

/**
 * Decrypt the note with the path provided using the appEncryptor,
 * reencrypt it with the provided encryptor, and save it to the path
 * <filename>.swp
 * @param filename the name of the original note file in the notes directory
 * @param encryptor the desired encryption scheme
 * @returns Promise resolving to the new filename, or rejecting if there
 *   is an error in retrieval or saving
 */
async function reencryptNote(filename: string, encryptor: Encryptor) {
    const note = await getNoteAsync(filename);
    if (note === null) {
        return null;
    }

    const newName = filename + TEMP_FILE_EXTENSION;
    try {
        await saveAndEncryptNote(newName, note, encryptor);
    } catch (error) {
        console.error("An error occured in reencryptNote:", error);
        throw error;
    }
    return newName;
}
