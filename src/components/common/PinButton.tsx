import { TouchableHighlight } from "react-native"

import { getStyles, getColorTheme } from "../../util/services/styles";
import AppText from "./AppText";

interface PinButtonProps {
    digit: number,
    onPress: (digit: number) => void
}

export default function PinButton(props: PinButtonProps) {
    return (
        <TouchableHighlight 
            onPress={() => props.onPress(props.digit)}
            style={getStyles().pinButton}
            underlayColor={getColorTheme().placeholder}
        >   
            <AppText style={{fontSize: 25, fontWeight: 'bold'}}>{props.digit}</AppText>
        </TouchableHighlight>
    )
}