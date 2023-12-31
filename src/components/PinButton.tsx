import { Pressable, Text } from "react-native"
import styles from "../modules/styles";

export interface PinButtonProps {
    digit: number,
    onPress: (digit: number) => void
}

export default function PinButton(props: PinButtonProps) {
    function handlePress() {
        props.onPress(props.digit);
    }

    return (
        <Pressable onPress={handlePress} style={styles.pinButton}>
            <Text style={{fontSize: 25}}>{props.digit}</Text>
        </Pressable>
    )
}