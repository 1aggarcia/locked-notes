/** Wrap all text in a custom text component to standardize styling */

import { PropsWithChildren } from "react";
import { StyleProp, Text, TextStyle } from "react-native"

import styles from "../../util/styles"

export interface AppTextProps {
    style?: StyleProp<TextStyle>;
}

export default function AppText(props: PropsWithChildren<AppTextProps>) {
    return (
        <Text style={[styles.appText, props.style]}>
            {props.children}
        </Text>
    );
}