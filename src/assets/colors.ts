/** All fields should be hex color codes */
type ColorTheme = {
    bg: string,
    fg: string,
    strongBorder: string,
    weakBorder: string,
    placeholder: string,
    text: string,
    buttonBg: string,
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

export const lightModeColors: ColorTheme = {
    bg: '#eeeeee',
    fg: '#ffffff',
    strongBorder: '#000000',
    weakBorder: '#cccccc',
    placeholder: '#bbbbbb',
    text: '#000000',
    buttonBg: '#61009e',
}

export const randomColors: ColorTheme = {
    bg: '#d624c7',
    fg: '#59d579',
    strongBorder: '#68a1fd',
    weakBorder: '#655df1',
    placeholder: '#26f8a2',
    text: '#f2c85f',
    buttonBg: '#75cf74',
}