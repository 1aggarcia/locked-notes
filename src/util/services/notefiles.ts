/** Manage note files from the local file system */

import * as FileSystem from 'expo-file-system';

import Encryption from './encryption';
import Note, { NoteMetadata, isNote } from '../types/note';

export type LoginInfo = {
    hash: string,
    salt: string,
}

const maxStringLength = 1 << 16; // 2^16
const notesDir = FileSystem.documentDirectory + 'notes/';

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
        await FileSystem.writeAsStringAsync(fileUri, Encryption.encrypt(text));
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
        return await FileSystem.readAsStringAsync(notesDir + filename);
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
    const fileUri = notesDir + filename;
    try {
        const decryptedFile = Encryption.decrypt(
            await FileSystem.readAsStringAsync(fileUri)
        );
        if (decryptedFile === null)
            // Decryption failed
            return null;

        const note = JSON.parse(decryptedFile);
        if (!isNote(note))
            return null;

        return note;
    } catch (error) {
        console.warn("An error occured in getNoteAsync:", error);
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
        const filenames = await FileSystem.readDirectoryAsync(notesDir);

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
    const fileUri = notesDir + filename;
    try {
        await FileSystem.deleteAsync(fileUri);
    } catch (error) {
        console.error("An error occured in deleteNoteAsync:", error);
        throw error;
    }
}
