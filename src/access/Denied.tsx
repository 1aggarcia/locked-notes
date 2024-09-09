import { View } from "react-native";

import { useStyles } from "../shared/contexts/stylesContext";
import AppText from "../shared/components/AppText";

export default function Denied() {
    const { styles } = useStyles();

    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>Access Denied</AppText>
            <AppText>Too many failed unlock attempts</AppText>
            <AppText>Try again in a few minutes</AppText>
        </View>
    )
}