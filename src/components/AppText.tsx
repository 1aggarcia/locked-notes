import { StyleProp, Text, TextStyle } from "react-native"
import styles from "../modules/styles"
import { PropsWithChildren } from "react";

export interface AppTextProps {
    style?: StyleProp<TextStyle>;
}

export default function AppText(props: PropsWithChildren<AppTextProps>) {
    return (
        <Text style={[styles.appText, props.style]}>{props.children}</Text>
    )
}