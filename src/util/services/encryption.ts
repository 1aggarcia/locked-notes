import { Hasher, sha256 } from 'js-sha256';
import CryptoJS from 'react-native-crypto-js';

const HEX_CHARS = '0123456789ABCDEF';

/**
 * Object to encrypt and decrypt text data using a secret key never
 * visible to clients. The key is generated from a numerical PIN via
 * the `registerPinAsKey`method
 */
export class Encryptor {
    private key?: string;

    /**
     * Hash and register pin to use as an encryption key
     * @param pin to hash and register
     */
    registerPinAsKey(pin: string) {
        this.key = sha256Hash1000(pin);
    }

    /**
     * Encrypts data with AES using registered key.
     * Key must be set using `registerEncryptionKey()` before use
     * @param data text data to encrypt. Must not be empty.
     * @throws Error if encryption key has not been registered
     * @returns encrypted data as text
     */
    encrypt(data: string) {
        if (this.key === undefined)
            throw ReferenceError('Encryption key has not been set');
        if (data.length === 0)
            throw RangeError('Attempted to encrypt an empty string');

        return CryptoJS.AES.encrypt(data, this.key).toString();
    }

    /**
     * Decrypts ciphertext with AES using registered key.
     * Key must be set using `registerEncryptionKey()` before use
     * @param ciphertext encrypted data as text
     * @throws Error if encryption key has not been registered.
     * @returns The decrypted data, if the correct key was registered.
     *        Otherwise, null
     */
    decrypt(ciphertext: string) {
        if (this.key === undefined)
            throw ReferenceError('Encryption key has not been set');

        const bytes = CryptoJS.AES.decrypt(ciphertext, this.key);
        if (bytes.sigBytes < 0) {
            console.warn('Ciphertext could not be decrypted. Was the wrong key registered?');
            return null;
        }

        try {
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch {
            console.warn('Ciphertext could not be decrypted. Was the wrong key registered?');
            return null;
        }
    }
}

// Main Encryptor used to read note files on the disk
const appEncryptor = new Encryptor();
export default appEncryptor;


/**
 * Salt and hash text using SHA-256
 * @param data text and salt to hash
 * @returns hashed text in hexadecimal
 */
export function saltAndSha256(data: { text: string, salt: string }): string {
    const hash = sha256.create();
    hash.update(data.salt + data.text);
    return hash.hex();
}

/**
 * Generate random hexadecimal string of length given
 * @param length - length of string
 * @returns random hexadecimal string
 */
export function generateSalt(length: number): string {
    let result = '';
    for (let i = length; i > 0; --i) result += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
    return result;
}

/**
 * Hashes data 1000 times using SHA-256. Data is reversed before each hash.
 * @param data text to hash
 * @returns hashed text in hexadecimal
 */
function sha256Hash1000(data: string): string {
    let result = data;
    let hasher: Hasher;

    for (let i = 0; i < 1000; i++) {
        // Reverse result before hashing
        result = result.split('').reverse().join();

        // Rehash result
        hasher = sha256.create()
        hasher.update(result);
        result = hasher.hex();
    }
    return result;
}
