import { View } from "react-native";

import styles from "../../util/styles";
import AppText from "../common/AppText";

export default function Denied() {
    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>Access Denied</AppText>
            <AppText>Too many failed attempts</AppText>
        </View>
    )
}