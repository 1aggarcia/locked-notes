/** Manage note files from the local file system */

import * as FileSystem from 'expo-file-system';

import appEncryptor, { Encryptor } from '../services/encryption';
import Note, { NoteMetadata, isNote } from '../types/note';

const MAX_STRING_LEN = 1 << 16; // 2^16
const NOTES_DIR = FileSystem.documentDirectory + 'notes/';

/**
 * Saves and encrypts given note to given filename in notes
 * directory of external storage. Will reject promise if data
 * cannot be saved, or if the note title/body is too long (cap: 2^16 chars)
 * 
 * @param filename name of the note file with extension
 * @param note note to save to file
 */
export async function saveNoteAsync(filename: string, note: Note) {
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
        await FileSystem.writeAsStringAsync(fileUri, appEncryptor.encrypt(text));
        console.debug(`File ${filename} saved`);
    } catch (error) {
        console.error("An error occured in saveNoteAsync:", error);
        throw error;
    }
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
 * @returns note as an object if there is a corresponding file, null otherwise
 */
export async function getNoteAsync(filename: string): Promise<Note | null> {
    const fileUri = NOTES_DIR + filename;
    try {
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

        return note;
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
        const filenames = await FileSystem.readDirectoryAsync(NOTES_DIR);

        for (const filename of filenames) {
            const note = await getNoteAsync(filename);
            if (note !== null) {
                // Add metadata to list
                result.push({
                    filename: filename,
                    title: note.title,
                    dateCreated: note.dateCreated,
                    dateModified: note.dateModified
                });
            }
        }
    } catch (error) {
        // Directory not found or empty
        console.warn(error);
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

// TODO: Finish
/**
 * Reencrypt every note saved using a new pin
 */
export async function reencryptNotesAsync(newPin: string) {
    const okToDelete: string[] = [];
    const newEncryptor = new Encryptor();

    newEncryptor.registerPinAsKey(newPin);

    try {
        const filenames = await FileSystem.readDirectoryAsync(NOTES_DIR);

        // Step 1: Create new files encrypted with new pin
        for (const filename of filenames) {
            if (await reencryptNote(filename, newEncryptor)) {
                okToDelete.push(filename);
            } else {
                console.error(`Failed to reencrypt ${filename}`);
            }
        }

        // Step 2: Remove old files after the app encryptor is set
        appEncryptor.registerPinAsKey(newPin);
        for (const filename of okToDelete) {
            await FileSystem.deleteAsync(NOTES_DIR + filename)
                .catch(err => console.error(err));
        }
    } catch (error) {
        // Directory not found or empty
        console.warn(error);
    }
}

// TODO: Reduce to encryptor-independent save note
async function reencryptNote(filename: string, encryptor: Encryptor) {
    const note = await getNoteAsync(filename);
    if (note === null) {
        return false;
    }

    const newFilename = NOTES_DIR + `note_${Date.now()}.ejn`;
    const reencrypted = encryptor.encrypt(JSON.stringify(note));
    try {
        await FileSystem.writeAsStringAsync(newFilename, reencrypted);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
