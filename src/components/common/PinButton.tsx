import { TouchableHighlight } from "react-native"

import styles, { colorMap } from "../../util/services/styles";
import AppText from "./AppText";

interface PinButtonProps {
    digit: number,
    onPress: (digit: number) => void
}

export default function PinButton(props: PinButtonProps) {
    return (
        <TouchableHighlight 
            onPress={() => props.onPress(props.digit)}
            style={styles.pinButton}
            underlayColor={colorMap.placeholder}
        >   
            <AppText style={{fontSize: 25, fontWeight: 'bold'}}>{props.digit}</AppText>
        </TouchableHighlight>
    )
}