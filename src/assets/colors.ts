/** All fields should be hex color codes */
export type ColorTheme = {
    bg: string,
    fg: string,
    strongBorder: string,
    weakBorder: string,
    placeholder: string,
    text: string,
    buttonBg: string,
    buttonDisabled: string,
};

export const lightColors: ColorTheme = {
    bg: '#eeeeee',
    fg: '#ffffff',
    strongBorder: '#000000',
    weakBorder: '#cccccc',
    placeholder: '#bbbbbb',
    text: '#000000',
    buttonBg: '#61009e',
    buttonDisabled: '#bbbbbb'
};

export const darkColors: ColorTheme = {
    bg: '#121212',
    fg: '#000000',
    strongBorder: '#ffffff',
    weakBorder: '#444444',
    placeholder: '#777777',
    text: '#ffffff',
    buttonBg: '#dda6ff',
    buttonDisabled: '#777777'
};

export const lowContrastLight: ColorTheme = {
    bg: '#eeeeee',
    fg: '#efefef',
    strongBorder: '#cccccc',
    weakBorder: '#dddddd',
    placeholder: '#bbbbbb',
    text: '#cccccc',
    buttonBg: '#d6afed',
    buttonDisabled: '#bbbbbb'
};

export const lowContrastDark: ColorTheme = {
    bg: '#121212',
    fg: '#000000',
    strongBorder: '#444444',
    weakBorder: '#333333',
    placeholder: '#323232',
    text: '#444444',
    buttonBg: '#3e224f',
    buttonDisabled: '#323232'
};
