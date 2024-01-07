import { View, ActivityIndicator } from "react-native";
import AppText from "../components/AppText";
import styles from "../modules/styles";

export default function Loading() {
    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>Loading</AppText>
            <ActivityIndicator size='large'/>
        </View>
    )
}