import { View, ActivityIndicator } from "react-native";

import styles from "../../util/styles";
import AppText from "../shared/AppText";

export default function Loading() {
    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>Loading</AppText>
            <ActivityIndicator size='large'/>
        </View>
    )
}