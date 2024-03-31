import { TouchableHighlight } from "react-native"

import Styles from "../../util/services/styles";
import AppText from "./AppText";

interface PinButtonProps {
    digit: number,
    onPress: (digit: number) => void
}

export default function PinButton(props: PinButtonProps) {
    return (
        <TouchableHighlight 
            onPress={() => props.onPress(props.digit)}
            style={Styles.get().pinButton}
            underlayColor={Styles.getColorTheme().placeholder}
        >   
            <AppText style={{fontSize: 25, fontWeight: 'bold'}}>{props.digit}</AppText>
        </TouchableHighlight>
    )
}