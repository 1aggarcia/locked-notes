import { TouchableOpacity } from "react-native"
import styles from "../modules/styles";
import AppText from "./AppText";

export interface PinButtonProps {
    digit: number,
    onPress: (digit: number) => void
}

export default function PinButton(props: PinButtonProps) {
    function handlePress() {
        props.onPress(props.digit);
    }

    return (
        <TouchableOpacity onPress={handlePress} style={styles.pinButton}>
            <AppText style={{fontSize: 25}}>{props.digit}</AppText>
        </TouchableOpacity>
    )
}