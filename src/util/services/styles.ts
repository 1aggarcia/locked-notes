import { StyleSheet } from "react-native";
import { lightModeColors, darkModeColors } from "../../assets/colors";

// Export a singleton module to encapsulate global style vars
const Styles = (() => {
    // Default values
    let useDarkMode = false;
    let stylesheet = generateStyles(false);

    return {
        get: () => stylesheet,

        getColorTheme: () => useDarkMode? darkModeColors : lightModeColors,

        isDarkMode: () => useDarkMode,

        setDarkMode: (value: boolean) => {
            useDarkMode = value;
            stylesheet = generateStyles(value);
        },
    }
})()

export default Styles;


/** Generate the stylesheet with the given color theme */
function generateStyles(useDarkMode: boolean) {
    const colorTheme = useDarkMode? darkModeColors : lightModeColors;

    return (StyleSheet.create({
        app: {
            backgroundColor: colorTheme.bg,
            flex: 1,
        },
        appText: {
            color: colorTheme.text
        },
        centered: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        placeholder: {
            color: colorTheme.placeholder
        },
        header: {
            fontSize: 30,
            textAlign: 'center'
        },
        noteTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            padding: 15,
            paddingBottom: 5,
            color: colorTheme.text
        },
        noteBody: {
            flex: 1,
            fontSize: 17,
            padding: 15,
            paddingTop: 5,
            verticalAlign: 'top',
            color: colorTheme.text
        },
        notePreview: {
            borderColor: colorTheme.weakBorder,
            borderWidth: 2,
            backgroundColor: colorTheme.fg,
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
        },
        notePreviewHeader: {
            fontWeight: 'bold',
            fontSize: 20
        },
        createButton: {
            position: 'absolute',
            bottom: 15,
            right: 15,
            width: 70,
            height: 70,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colorTheme.buttonBg,
        },
        createButtonText: {
            fontSize: 30,
            fontWeight: 'bold',
            color: colorTheme.bg
        },
        pinContainer: {
            justifyContent: 'flex-end', 
            flex: 1
        },
        pinButton: {
            margin: 5,
            width: 90,
            height: 70,
            borderRadius: 50,
            borderColor: colorTheme.strongBorder,
            borderWidth: 2,
            backgroundColor: colorTheme.fg,
            alignItems: 'center',
            justifyContent: 'center'
        },
        pinBackspace: {
            margin: 5,
            width: 90,
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
        },
        pinDots: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
        },
        pinDot: {
            width: 15,
            height: 15,
            borderRadius: 20,
            borderColor: colorTheme.strongBorder,
            borderWidth: 2,
        },
        pinDotFull: {
            backgroundColor: colorTheme.strongBorder
        },
        pinPad: {
            justifyContent: 'flex-end',
        },
        keypad: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingVertical: 20,
        },
        backspace: {
            alignSelf: 'flex-end',
            padding: 10,
            borderColor: colorTheme.strongBorder,
            borderWidth: 1
        },
        editNote: {
            flex: 1,
            backgroundColor: colorTheme.fg,
        },
        noteOptions: {
            backgroundColor: colorTheme.fg,
            borderColor: colorTheme.strongBorder,
            borderRadius: 10,
            borderWidth: 1,
            padding: 10,
            opacity: 1,
        },
        noteOptionsBg: {
            position: "absolute",
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            padding: 20
        },
        button: {
            borderColor: colorTheme.strongBorder,
            color: colorTheme.text,
            borderWidth: 1,
            borderRadius: 10,
            margin: 5,
            paddingVertical: 5,
            paddingHorizontal: 20,
            fontWeight: 'bold'
        },
        noteListEmpty: {
            color: colorTheme.placeholder,
            fontSize: 25,
            fontWeight: 'bold',
        },
        charCount: {
            backgroundColor: colorTheme.fg,
            color: colorTheme.placeholder,
            fontSize: 13,
            bottom: 0,
            paddingHorizontal: 7,
            paddingBottom: 2,
            textAlign: 'right'
        },
        settingsHeader: {
            fontSize: 25,
            padding: 15,
            textAlign: 'center'
        },
        settingsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderTopColor: colorTheme.weakBorder,
            borderTopWidth: 1,
            backgroundColor: colorTheme.fg
        },
        settingsText: {
            paddingVertical: 5,
            fontSize: 17,
        },
        settingsButton: {
            backgroundColor: colorTheme.buttonBg,
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 5,
        },
        settingsButtonText: {
            color: colorTheme.fg,
            fontSize: 17,
        },
        settingsTextInput: {
            color: colorTheme.text,
            fontSize: 17,
            paddingHorizontal: 15
        },
    })
)};
