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

/** Function to type check color themes and add the `ColorTheme` type */
const colorTheme = (theme: ColorTheme) => theme;

export const Themes = {
    LIGHT: colorTheme({
        bg: '#eeeeee',
        fg: '#ffffff',
        strongBorder: '#000000',
        weakBorder: '#cccccc',
        placeholder: '#bbbbbb',
        text: '#000000',
        buttonBg: '#61009e',
        buttonDisabled: '#bbbbbb'
    }),
    DARK: colorTheme({
        bg: '#121212',
        fg: '#000000',
        strongBorder: '#ffffff',
        weakBorder: '#444444',
        placeholder: '#777777',
        text: '#ffffff',
        buttonBg: '#dda6ff',
        buttonDisabled: '#777777'
    }),
    LOW_CONTRAST_LIGHT: colorTheme({
        bg: '#eeeeee',
        fg: '#efefef',
        strongBorder: '#cccccc',
        weakBorder: '#dddddd',
        placeholder: '#bbbbbb',
        text: '#cccccc',
        buttonBg: '#e6cbf7',
        buttonDisabled: '#bbbbbb'
    }),
    LOW_CONTRAST_DARK: colorTheme({
        bg: '#121212',
        fg: '#000000',
        strongBorder: '#444444',
        weakBorder: '#333333',
        placeholder: '#323232',
        text: '#444444',
        buttonBg: '#463552',
        buttonDisabled: '#323232'
    }),
};
