/** Object representation of app settings, saved as JSON to the disk */
type Settings = {
    useDarkMode: boolean;

    /** Number of seconds the app will be open when unlocked */
    unlockedTime: number;
}
export default Settings;

export const defaultSettings: Settings = {
    useDarkMode: false,
    unlockedTime: 600
}

/**
 * Determine if the given object is a valid Settings object
 * @param obj object to check
 * @returns true iff obj contains all the properties of a Settings object
 */
export function isValidSettings(obj: object): boolean {
    return (
        typeof obj === 'object'
        && 'useDarkMode' in obj && typeof obj.useDarkMode === 'boolean'
        && 'unlockedTime' in obj && typeof obj.unlockedTime === 'number'
    )
}
