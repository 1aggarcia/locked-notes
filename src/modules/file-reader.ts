import { sha256 } from 'js-sha256';

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