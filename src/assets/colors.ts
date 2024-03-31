/** All fields should be hex color codes */
export type ColorTheme = {
    bg: string,
    fg: string,
    strongBorder: string,
    weakBorder: string,
    placeholder: string,
    text: string,
    error: string,
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
    error: 'red',
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
    error: 'red',
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
    error: '#ff8a8a',
    buttonBg: '#e6cbf7',
    buttonDisabled: '#bbbbbb'
};

export const lowContrastDark: ColorTheme = {
    bg: '#121212',
    fg: '#000000',
    strongBorder: '#444444',
    weakBorder: '#333333',
    placeholder: '#323232',
    text: '#444444',
    error: '#940000',
    buttonBg: '#463552',
    buttonDisabled: '#323232'
};
