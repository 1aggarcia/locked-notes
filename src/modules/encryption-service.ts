import { sha256 } from 'js-sha256';
import CryptoJS from 'react-native-crypto-js';

let encryptionKey: string | undefined;

/**
 * Register pin and salt to use as an encryption key for the encryption service
 * @param data pin and salt to register
 */
export function registerEncryptionKey(data: { pin: string, salt: string }) {
    encryptionKey = data.salt + data.pin
}

/**
 * Salt and has text using SHA-256
 * @param data text and salt to hash
 * @returns hashed text in hexadecimal
 */
export function hash256(data: { text: string, salt: string }): string {
    const hash = sha256.create();
    hash.update(data.salt + data.text);
    return hash.hex();
}

/**
 * Encrypts data with AES using registered key.
 * Key must be registered using `registerEncryptionKey()` before use
 * @param data text data to encrypt
 * @returns encrypted data as text
 */
export function encryptData(data: string): string {
    if (encryptionKey === undefined) {
        throw Error('Encryption key has not been registered');
    }
    return CryptoJS.AES.encrypt(data, encryptionKey).toString();
}

/**
 * Decrypts ciphertext with AES using registered key.
 * Key must be registered using `registerEncryptionKey()` before use
 * @param ciphertext encrypted data as text
 * @returns original text data, if the correct key was registered
 */
export function decryptData(ciphertext: string): string {
    if (encryptionKey === undefined) {
        throw Error('Encryption key has not been registered');
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
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