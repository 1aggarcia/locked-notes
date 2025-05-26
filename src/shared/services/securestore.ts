/**
 * Manage data stored in the device's secure store.
 * Used to store and retreive app data such as settings and login info.
 * Not used to store user data like notes.
 * 
 * In general, getters should not throw errors, they should catch any errors
 * and return defualt values instead.
 * Setters do throw errors if a value can't be saved.
 */

import * as SecureStore from 'expo-secure-store';

import appEncryptor, { generateSalt, saltAndSha256 } from './encryption';
import Settings, { defaultSettings, isValidSettings } from '../../settings/types';
import { cleanupTempNoteFiles, reencryptNotesAsync } from '../../notes/storage/notefiles';

export type LoginInfo = {
    hash: string,
    salt: string,
}

const maxStringLength = 1 << 16;  // 2^16
const saltLength = 64;

/**
 * Hash, salt, and save pin to secure store in local storage.
 * As a side effect, re-encrypts all notes saved to disk to be
 * accessible via the new pin
 * @param pin pin to save
 * @returns Promise with new login info saved.
 *      Will reject promise if data cannot be saved,
 *      or if string is too long (cap: 2^16 chars)
 */
export async function savePinAsync(pin: string): Promise<LoginInfo> {
    if (pin.length > maxStringLength) {
        throw new RangeError(`pin is too long: ${pin}`);
    }
    const loginSalt = generateSalt(saltLength);
    const loginHash = saltAndSha256({ text: pin, salt: loginSalt })

    try {
        await reencryptNotesAsync(pin);
        await SecureStore.setItemAsync('loginHash', loginHash);
        await SecureStore.setItemAsync('loginSalt', loginSalt);
        appEncryptor.registerPinAsKey(pin);
        await cleanupTempNoteFiles();
    } catch (error) {
        console.error("An error occured in savePinAsync:", error);
        throw error;
    }

    return { hash: loginHash, salt: loginSalt };
}

/**
 * Retrieve login hash and salt from local storage, if it exists
 * @returns object containing login hash and salt if it exists, null otherwise
 */
export async function getLoginAsync(): Promise<LoginInfo | null> {
    try {
        const loginHash = await SecureStore.getItemAsync('loginHash');
        const loginSalt = await SecureStore.getItemAsync('loginSalt');

        if (loginHash === null || loginSalt === null) {
            return null;
        }
        return { hash: loginHash, salt: loginSalt };
    } catch (error) {
        console.log("getLoginAsync caught an error:", error);
        return null;
    }
}


/**
 * Save a timestamp to Secure Store before which the app will not be accessible.
 * Rejects promise if there is an error in saving.
 * @param timestamp The date and time when access should be permitted.
 * 
 */
export async function setAccessTimeAsync(timestamp: Date): Promise<void> {
    try {
        // The timestamp is stored as a plain number to
        // make decoding easier and more reliable
        const timestamp_ms: number = timestamp.getTime();
        await SecureStore.setItemAsync('accessTime', timestamp_ms.toString());
    } catch (error) {
        console.error("An error occured in setAccessTimeAsync:", error);
        throw error;
    }
}

/**
 * Gets the timestamp from Secure Store before which the app
 * will not be accessible.
 * 
 * @returns Promise with timestamp from Secure Store as a Date object.
 *      If none is found, the epoch time (1970-01-01 00:00:00) is returned.
 */
export async function getAccessTimeAsync(): Promise<Date> {
    try {
        const timestampMs = Number(await SecureStore.getItemAsync('accessTime'));
        return new Date(timestampMs);
    } catch (error) {
        console.log("getAccessTimeAsync caught an error:", error);
        return new Date(0);
    }
}

/**
 * Save the settings passed in to Secure Store. Rejects promise if there is
 * an issue savings
 * @param settings object with theme and unlockedTime fields
 */
export async function saveSettingsAsync(settings: Settings): Promise<void> {
    try {
        await SecureStore.setItemAsync('settings', JSON.stringify(settings));
    } catch (error) {
        console.error('An error occured in saveSettingsAsync:', error);
        throw error;
    }
}

/**
 * Get settings from Secure Store on device. If no settings are found,
 * the default settings are saved and returned.
 * @returns Promise resolving to settings
 */
export async function getSettingsAsync(): Promise<Settings> {
    try {
        const data = await SecureStore.getItemAsync('settings');
        if (data === null) {
            throw new Error("No settings entry found in SecureStore");
        }
        const parsedData = {
            ...defaultSettings,
            ...JSON.parse(data)
        }
        if (!isValidSettings(parsedData)) {
            throw ReferenceError("Settings is malformed:" + data);
        }
        return parsedData;
    } catch (error) {
        console.log('getSettingsAsync caught an error:', error);

        // Save the default settings, overwrite any fautly or non-existent data
        SecureStore.setItemAsync('settings', JSON.stringify(defaultSettings));
        return defaultSettings;
    }
}
