import { StyleSheet } from "react-native";
import { darkModeColors, lightModeColors } from "../assets/colors";

// Eventually will need to pull this from app settings
export const isDarkMode = false;

export const colorMap = isDarkMode ? darkModeColors : lightModeColors;

const styles = StyleSheet.create({
    app: {
        backgroundColor: colorMap.bg,
        flex: 1,
    },
    appText: {
        color: colorMap.text
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    placeholder: {
        color: colorMap.placeholder
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
        color: colorMap.text
    },
    noteBody: {
        flex: 1,
        fontSize: 17,
        padding: 15,
        paddingTop: 5,
        verticalAlign: 'top',
        color: colorMap.text
    },
    notePreview: {
        borderColor: colorMap.weakBorder,
        borderWidth: 2,
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
        backgroundColor: colorMap.buttonBg,
    },
    createButtonText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colorMap.bg
    },
    pinContainer: {
        justifyContent: 'flex-end', 
        flex: 1
    },
    pinButton: {
        margin: 5,
        width: 80,
        height: 80,
        borderRadius: 50,
        borderColor: colorMap.strongBorder,
        borderWidth: 2,
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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    pinDot: {
        width: 15,
        height: 15,
        borderRadius: 20,
        borderColor: colorMap.strongBorder,
        borderWidth: 2,
    },
    pinDotFull: {
        backgroundColor: colorMap.strongBorder
    },
    keypad: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 20
    },
    backspace: {
        alignSelf: 'flex-end',
        padding: 10,
        borderColor: colorMap.strongBorder,
        borderWidth: 1
    },
    button: {
        padding: 10,
        borderColor: colorMap.buttonBg,
        borderWidth: 1
    }
});

export default styles;