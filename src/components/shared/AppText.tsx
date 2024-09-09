/** Wrap all text in a custom text component to standardize styling */

import { PropsWithChildren } from "react";
import { StyleProp, Text, TextStyle } from "react-native"
import { useStyles } from "../../contexts/stylesContext";

export interface AppTextProps {
    style?: StyleProp<TextStyle>;
}

/** Text component with standardized styling accross the app */
export default function AppText(props: PropsWithChildren<AppTextProps>) {
    const { styles } = useStyles();
    return (
        <Text style={[styles.appText, props.style]}>
            {props.children}
        </Text>
    );
}