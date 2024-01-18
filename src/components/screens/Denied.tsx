import { View } from "react-native";

import styles from "../../util/styles";
import AppText from "../common/AppText";

export default function Denied() {
    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>Access Denied</AppText>
            <AppText>Too many failed unlock attempts</AppText>
            <AppText>Try again in a few minutes</AppText>
        </View>
    )
}