import { PropsWithChildren } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";

import Styles from "../../util/services/styles";
import AppText from "./AppText";

interface AppButtonProps {
    onPress: (event: GestureResponderEvent) => void,

    /** Optional override for default colors */
    color?: string,

    disabled?: boolean
}

/** Simple text button with standardized styling accross the app */
export default function AppButton(props: PropsWithChildren<AppButtonProps>) {
    const colorTheme = Styles.getColorTheme();

    // Make a copy of the button styles to personalize
    const buttonStyle = {...Styles.get().button}

    if (props.disabled) {
        // Always override colors to disabled if the button is disabled
        buttonStyle.borderColor = colorTheme.buttonDisabled;
        buttonStyle.color = colorTheme.buttonDisabled;
    } else if (props.color !== undefined) {
        // Override color values if color was passed in
        buttonStyle.borderColor = props.color;
        buttonStyle.color = props.color;
    } else {
        // No colors specified: apply defaults
        buttonStyle.borderColor = colorTheme.buttonBg;
        buttonStyle.color = colorTheme.buttonBg;
    }

    return (
        <TouchableOpacity disabled={props.disabled} onPress={props.onPress}>
            <AppText style={buttonStyle}>
                {props.children}
            </AppText>
        </TouchableOpacity>
    )
}