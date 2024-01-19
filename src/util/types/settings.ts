/** Object representation of app settings, saved as JSON to the disk */
type Settings = {
    /** Name of the color theme to use */
    theme: string;

    /** Number of seconds the app will be open when unlocked */
    unlockedTime: number;
}
export default Settings;

export const defaultSettings: Settings = {
    theme: 'Light Mode',
    unlockedTime: 599
}

/**
 * Determine if the given object is a valid Settings object
 * @param obj object to check
 * @returns true iff obj contains all the properties of a Settings object
 */
export function isValidSettings(obj: object): boolean {
    return (
        typeof obj === 'object' &&
        'theme' in obj && typeof obj.theme === 'string' &&
        'unlockedTime' in obj && typeof obj.unlockedTime === 'number'
    )
}
