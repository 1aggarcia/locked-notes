import { PropsWithChildren } from "react";
import { GestureResponderEvent, TouchableOpacity } from "react-native";

import { useStyles } from "../contexts/settingsContext";
import AppText from "./AppText";

type AppButtonProps = {
    onPress?: (event: GestureResponderEvent) => void;

    /**
     * Workaround for broken `onPress` handler in React Navigation w/ Expo 52:
     * https://github.com/react-navigation/react-navigation/issues/12274
     * 
     * Remove this and make `onPress` required once the issue is fixed
     */
    onPressIn?: (event: GestureResponderEvent) => void;

    /** Optional override for default colors */
    color?: string;

    disabled?: boolean;
}

/** Simple text button with standardized styling across the app */
export default function AppButton(props: PropsWithChildren<AppButtonProps>) {
    const { styles, colorTheme } = useStyles();

    // Make a copy of the button styles to personalize
    const buttonStyle = {...styles.button}

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
        <TouchableOpacity
            disabled={props.disabled}
            onPress={props.onPress}
            onPressIn={props.onPressIn}
        >
            <AppText style={buttonStyle}>
                {props.children}
            </AppText>
        </TouchableOpacity>
    )
}
