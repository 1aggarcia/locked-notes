import { Pressable, Text, StyleSheet } from "react-native"
import colors from "../assets/colors";

export interface PinButtonProps {
    digit: number,
    onPress: (digit: number) => void
}

export default function PinButton(props: PinButtonProps) {
    function handlePress() {
        props.onPress(props.digit);
    }

    return (
        <Pressable onPress={handlePress} style={styles.button}>
            <Text style={styles.text}>{props.digit}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        margin: 5,
        width: 80,
        height: 80,
        borderRadius: 50,
        borderColor: colors.border,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },

    text: {
        color: colors.whiteText,
        fontSize: 25
    }
});