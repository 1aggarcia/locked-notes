import { GestureResponderEvent, Pressable, Text, StyleSheet } from "react-native"
import colors from "../assets/colors";

export interface PinButtonProps {
    digit: number,
    onPress: (event: GestureResponderEvent) => void
}

export default function PinButton(props: PinButtonProps) {
    return (
        <Pressable onPress={props.onPress} style={styles.button}>
            <Text>{props.digit}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        color: colors.whiteText,
        margin: 5,
        width: 70,
        height: 70,
        borderRadius: 50,
        borderColor: colors.border,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
});