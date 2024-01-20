/** All fields should be hex color codes */
export type ColorTheme = {
    bg: string,
    fg: string,
    strongBorder: string,
    weakBorder: string,
    placeholder: string,
    text: string,
    buttonBg: string,
}

export const lightModeColors: ColorTheme = {
    bg: '#eeeeee',
    fg: '#ffffff',
    strongBorder: '#000000',
    weakBorder: '#cccccc',
    placeholder: '#bbbbbb',
    text: '#000000',
    buttonBg: '#61009e',
}

export const darkModeColors: ColorTheme = {
    bg: '#121212',
    fg: '#000000',
    strongBorder: '#ffffff',
    weakBorder: '#444444',
    placeholder: '#777777',
    text: '#ffffff',
    buttonBg: '#dda6ff',
}
