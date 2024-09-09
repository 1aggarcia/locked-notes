/** Manage note files from the local file system */

import * as FileSystem from 'expo-file-system';

import appEncryptor, { Encryptor } from '../../shared/services/encryption';
import Note, { NoteMetadata, isNote } from '../types';

const MAX_STRING_LEN = 1 << 16;  // 2^16
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

/**
 * Reencrypt every note saved using a new pin in two steps:
 * 1: Decrypt every note possible and reencrypt it as a copy
 * 2: Delete the original files
 */
export async function reencryptNotesAsync(newPin: string) {
    const filePairs: [string, string][] = [];  // [originalFilename, tempFilename]
    const newEncryptor = new Encryptor();

    newEncryptor.registerPinAsKey(newPin);

    let filenames: string[];
    try {
        filenames = await FileSystem.readDirectoryAsync(NOTES_DIR);
    } catch (error) {
        console.error("An error occured in reencryptNotesAsync:", error);
        throw error;
    }
    console.log(filenames);

    // Step 1: Create temp files encrypted with new pin
    for (const filename of filenames) {
        try {
            const swapFilename = await reencryptNote(filename, newEncryptor);
            if (swapFilename !== null) {
                filePairs.push([NOTES_DIR + filename, NOTES_DIR + swapFilename]);
            }
        } catch (error) {
            console.error(`Failed to reencrypt ${filename}: ${error}`);
            throw error;
        }
    }

    // Step 2: merge temp files to their original location
    await mergeSwapFiles(filePairs);
    appEncryptor.registerPinAsKey(newPin);
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

    const newName = filename + ".swp";
    try {
        await saveAndEncryptNote(newName, note, encryptor);
    } catch (error) {
        console.error("An error occured in reencryptNote:", error);
        throw error;
    }
    return newName;
}

/**
 * Merge the contents of temporary "swap" files into the original filename,
 * remove the "swap" files
 * @param filePairs array of tuples [originalFilename, swapFilename]
 */
async function mergeSwapFiles(filePairs: [string, string][]) {
    for (const [file, swapFile] of filePairs) {
        const backupFile = file + ".old";
        try {
            console.debug(`Moving ${file.replace(NOTES_DIR, "")} to ${backupFile.replace(NOTES_DIR, "")}...`);
            await FileSystem.moveAsync({
                from: file,
                to: backupFile
            });

            console.debug(`Moving ${swapFile.replace(NOTES_DIR, "")} to ${file.replace(NOTES_DIR, "")}...`);
            await FileSystem.moveAsync({
                from: swapFile,
                to: file
            });

            console.debug(`Deleting ${backupFile.replace(NOTES_DIR, "")}...`);
            //throw new Error("Dummy delete error");
            await FileSystem.deleteAsync(backupFile);
        } catch (error) {
            console.error("An error occured in mergeSwapFiles:", error);
            throw error;
        }
    }
}
