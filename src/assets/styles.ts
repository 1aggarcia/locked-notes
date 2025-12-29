import { StyleSheet } from "react-native";
import { ColorTheme } from "./colors"; 

export type AppStylesheet = ReturnType<typeof generateStyles>;

/** Generate the stylesheet with the given color theme */
export function generateStyles(colorTheme: ColorTheme) {
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
            flex: 1,
            padding: 20,
        },
        pinButton: {
            margin: 5,
            marginHorizontal: 10,
            width: 80,
            height: 80,
            borderRadius: 50,
            borderColor: colorTheme.strongBorder,
            borderWidth: 2,
            backgroundColor: colorTheme.fg,
            alignItems: 'center',
            justifyContent: 'center'
        },
        pinBackspace: {
            margin: 5,
            width: 80,
            height: 80,
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
            justifyContent: 'center',
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
        modal: {
            backgroundColor: colorTheme.fg,
            borderColor: colorTheme.strongBorder,
            borderRadius: 10,
            borderWidth: 1,
            padding: 10,
            opacity: 1,
            width: "100%",
        },
        modalBg: {
            position: "absolute",
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            padding: 40
        },
        dropdownOptionContainer: {
            borderTopWidth: 1,
            borderTopColor: colorTheme.weakBorder,
        },
        dropdownOption: {
            padding: 15,
            fontSize: 17,
        },
        dropdownSelectedOption: {
            padding: 15,
            fontSize: 17,
            fontWeight: "bold",
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
        noteStatusBar: {
            backgroundColor: colorTheme.fg,
            color: colorTheme.placeholder,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 7,
            paddingBottom: 2,
        },
        noteStatusBarText: {
            color: colorTheme.placeholder,
            fontSize: 13,
        },
        settingsHeader: {
            fontSize: 25,
            padding: 15,
            textAlign: 'center'
        },
        settingsRowContainer: {
            flex: 2,
            backgroundColor: colorTheme.fg,
        },
        settingsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderTopColor: colorTheme.weakBorder,
            borderTopWidth: 1,
        },
        settingsText: {
            paddingVertical: 5,
            fontSize: 17,
        },
        settingsTextInput: {
            backgroundColor: colorTheme.bg,
            color: colorTheme.text,
            borderColor: colorTheme.weakBorder,
            borderWidth: 1,
            fontSize: 17,
            paddingHorizontal: 15
        },
    })
)};
