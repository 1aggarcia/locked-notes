import { View } from "react-native";

import Styles from "../../util/services/styles";
import AppText from "../common/AppText";

export default function Denied() {
    const styles = Styles.get();

    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>Access Denied</AppText>
            <AppText>Too many failed unlock attempts</AppText>
            <AppText>Try again in a few minutes</AppText>
        </View>
    )
}