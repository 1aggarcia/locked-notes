import { StyleProp, Text, TextStyle } from "react-native"
import styles from "../modules/styles"

export interface AppTextProps {
    children: string | string[];
    style?: StyleProp<TextStyle>;
}

export default function AppText(props: AppTextProps) {
    return (
        <Text style={[styles.appText, props.style]}>{props.children}</Text>
    )
}