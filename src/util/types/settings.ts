export type ThemeName = 'dark' | 'light' | 'lowContrastDark' | 'lowContrastLight'

/** Object representation of app settings, saved as JSON to the disk */
type Settings = {
    /** String representation of the color theme */
    colorTheme: ThemeName,

    /** Number of seconds the app will be open when unlocked */
    unlockedTime: number;
}
export default Settings;

export const defaultSettings: Settings = {
    colorTheme: 'light',
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
        && 'colorTheme' in obj && typeof obj.colorTheme === 'string'
        && isThemeName(obj.colorTheme)
        && 'unlockedTime' in obj && typeof obj.unlockedTime === 'number'
    )
}

function isThemeName(value: string): value is ThemeName {
    return (
        value === 'dark'
        || value === 'light'
        || value === 'lowContrastDark'
        || value === 'lowContrastLight'
    );
}
