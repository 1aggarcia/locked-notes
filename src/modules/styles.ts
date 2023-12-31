import { StyleSheet } from "react-native";
import { darkModeColors } from "../assets/colors";

let colorMap = darkModeColors;

const styles = StyleSheet.create({
    app: {
        backgroundColor: colorMap.bg,
        flex: 1,
    },
    noteTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 15,
        paddingBottom: 5,
    },
    noteBody: {
        flex: 1,
        fontSize: 18,
        padding: 15,
        paddingTop: 5,
        textAlignVertical: 'top',
    },
    pinButton: {
        margin: 5,
        width: 80,
        height: 80,
        borderRadius: 50,
        borderColor: darkModeColors.border,
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
        borderColor: darkModeColors.border,
        borderWidth: 2,
    },
    pinDotFull: {
        backgroundColor: darkModeColors.border
    }
});

export default styles;