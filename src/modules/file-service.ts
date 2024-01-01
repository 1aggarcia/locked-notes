import * as SecureStore from 'expo-secure-store';

import { generateSalt, hash256, registerEncryptionKey } from './encryption-service';

const saltLength = 64;

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
 * Check if there is login info saved within secure store in local storage
 * @returns true iff loginHash, loginSalt and encryptionSalt are saved in local storage
 */
export async function loginExists(): Promise<boolean> {
    const loginHash = await SecureStore.getItemAsync('loginHash');
    const loginSalt = await SecureStore.getItemAsync('loginSalt');
    const encryptionSalt = await SecureStore.getItemAsync('encryptionSalt');

    return (loginHash !== null && loginSalt !== null && encryptionSalt !== null);
}