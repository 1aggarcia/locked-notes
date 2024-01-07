import { View } from "react-native";
import AppText from "../components/AppText";
import styles from "../modules/styles";

export default function Denied() {
    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>Access Denied</AppText>
            <AppText>Too many failed attempts</AppText>
        </View>
    )
}