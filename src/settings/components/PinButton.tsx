import { TouchableHighlight } from "react-native"

import { useStyles } from "../../shared/contexts/stylesContext";
import AppText from "../../shared/components/AppText";

interface PinButtonProps {
    digit: number,
    onPress: (digit: number) => void
}

export default function PinButton(props: PinButtonProps) {
    const { styles, colorTheme } = useStyles();
    return (
        <TouchableHighlight 
            onPress={() => props.onPress(props.digit)}
            style={styles.pinButton}
            underlayColor={colorTheme.placeholder}
        >   
            <AppText style={{fontSize: 25, fontWeight: 'bold'}}>{props.digit}</AppText>
        </TouchableHighlight>
    )
}
