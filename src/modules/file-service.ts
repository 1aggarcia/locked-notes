import * as SecureStore from 'expo-secure-store';
import { sha256 } from 'js-sha256';
import CryptoJS from 'react-native-crypto-js';

let pin: string | undefined
let salt: string | undefined

/**
 * Set pin and salt to use as an encryption key for the file service
 * @param data pin and salt to register
 */
export function registerEncryptionKey(data: { pin: string, salt: string }) {
    pin = data.pin;
    salt = data.salt;
}

function getEncryptionKey() {
    if (pin === undefined || salt === undefined) {
        throw Error('Encryption key has not been set');
    }
    return salt + pin;
}

/**
 * Generate random hexadecimal string of length given
 * @param length - length of string
 * @returns random hexadecimal string
 */
export function generateSalt(length: number): string {
    const chars = '0123456789ABCDEF'
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

/**
 * Hash text using SHA-256
 * @param text text to hash
 * @param salt salt to add to hash
 * @returns hashed text
 */
export function hash256(text: string, salt: string): string {
    const hash = sha256.create();
    hash.update(salt + text);
    return hash.hex();
}

export async function storeTestData() {
    const key = 'sampleData';

    const data = { firstName: 'Apolo', lastName: 'Garcia-Herrera Gregorio 2024' };
    await SecureStore.setItemAsync(key, JSON.stringify(data));
    alert(`data stored to key ${key}`);
}

export async function getValueFor(key: string) {
    const data = await SecureStore.getItemAsync(key);
    if (data) {
      alert(`Data found under key ${key}:\n${data}`)
    } else {
      alert(`No data found for key ${key}`);
    }
}

export async function deleteValue(key: string) {
    await SecureStore.deleteItemAsync(key);
    alert(`Deleted data under key ${key}`)
}

export function encryptData(data: string) {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(data, key).toString();
}

export function decryptData(ciphertext: string) {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}