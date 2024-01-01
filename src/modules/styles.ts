import { StyleSheet } from "react-native";
import { darkModeColors } from "../assets/colors";

let colorMap = darkModeColors;

const styles = StyleSheet.create({
    app: {
        backgroundColor: colorMap.bg,
        flex: 1,
    },
    appText: {
        color: colorMap.text
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
        fontSize: 18,
        padding: 15,
        paddingTop: 5,
        verticalAlign: 'top',
        color: colorMap.text
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
        borderColor: colorMap.border,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
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
        borderColor: colorMap.border,
        borderWidth: 2,
    },
    pinDotFull: {
        backgroundColor: colorMap.border
    },
    keypad: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 20
    },
    backspace: {
        alignSelf: 'flex-end',
        padding: 10,
        borderColor: darkModeColors.border,
        borderWidth: 1
    }
});

export default styles;