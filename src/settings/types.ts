/** Object representation of app settings, saved as JSON to the disk */
type Settings = {
    darkMode: boolean,
    lowContrast: boolean,

    /** Number of seconds the app will be open when unlocked */
    unlockedTime: number;
}
export default Settings;

export const defaultSettings: Settings = {
    darkMode: false,
    lowContrast: false,
    unlockedTime: 600
}

/**
 * Determine if the given object is a valid Settings object
 * @param obj object to check
 * @returns true iff obj contains all the properties of a Settings object
 */
export function isValidSettings(obj: object): obj is Settings {
    return (
        typeof obj === 'object'
        && 'darkMode' in obj && typeof obj.darkMode === 'boolean'
        && 'lowContrast' in obj && typeof obj.darkMode === 'boolean'
        && 'unlockedTime' in obj && typeof obj.unlockedTime === 'number'
    )
}
