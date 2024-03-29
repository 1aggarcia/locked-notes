/** Wrap all text in a custom text component to standardize styling */

import { PropsWithChildren } from "react";
import { StyleProp, Text, TextStyle } from "react-native"

import Styles from "../../util/services/styles";

export interface AppTextProps {
    style?: StyleProp<TextStyle>;
}

/** Text component with standardized styling accross the app */
export default function AppText(props: PropsWithChildren<AppTextProps>) {
    return (
        <Text style={[Styles.get().appText, props.style]}>
            {props.children}
        </Text>
    );
}