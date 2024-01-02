import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

import { 
    decryptData,
    encryptData,
    generateSalt,
    hash256,
    registerEncryptionKey
} from './encryption-service';

const saltLength = 64;
const notesDir = FileSystem.documentDirectory + 'notes/';

/**
 * Hash, salt, and save pin to secure store in local storage
 * @param pin pin to save
 */
export async function savePinAsync(pin: string) {
    const loginSalt = generateSalt(saltLength);
    const encryptionSalt = generateSalt(saltLength);

    const hash = hash256({ text: pin, salt: loginSalt });
    registerEncryptionKey({ pin: pin, salt: encryptionSalt })
    
    await SecureStore.setItemAsync('loginHash', hash);
    await SecureStore.setItemAsync('loginSalt', loginSalt);
    await SecureStore.setItemAsync('encryptionSalt', encryptionSalt);
}

/**
 * Remove login information from local storage
 */
export async function deletePinAsync() {
    await SecureStore.deleteItemAsync('loginHash');
    await SecureStore.deleteItemAsync('loginSalt');
    await SecureStore.deleteItemAsync('encryptionSalt');
}

export async function getLoginInfo() {
    const loginHash = await SecureStore.getItemAsync('loginHash');
    const loginSalt = await SecureStore.getItemAsync('loginSalt');

    if (loginHash === null || loginSalt === null) {
        return null
    } else {
        return { hash: loginHash, salt: loginSalt }
    }
}

export async function saveTestFile() {
    const note = {
        title: 'ya es hora',
        body: '"¿Hora de qué?" decís. Pues no sé, inventá algo.',
        dateCreated: '2024-01-01',
        dateModified: '2024-01-01'
    }
    const text = JSON.stringify(note);

    try {
        await FileSystem.readDirectoryAsync(notesDir);
    } catch {
        await FileSystem.makeDirectoryAsync(notesDir);
    }
    try {
        await FileSystem.writeAsStringAsync(notesDir + 'test.enf', encryptData(text));
    } catch (error) {
        alert(error);
    }
}

export async function readTestFile() {
    const fileUri = notesDir + "test.enf";
    try {
        const encryptedFile = await FileSystem.readAsStringAsync(fileUri)
        alert(`Filepath:\n${fileUri}\n\nRaw contents:\n${encryptedFile}\n\nDecrypted:\n${decryptData(encryptedFile)}`);
    } catch (error) {
        alert(error)
    }
}

export async function deleteTestFile() {
    const fileUri = FileSystem.documentDirectory + 'test.enf'
    try {
        await FileSystem.deleteAsync(fileUri);
    } catch (error) {
        alert(error);
    }
}