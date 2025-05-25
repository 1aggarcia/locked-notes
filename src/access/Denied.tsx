import { View } from "react-native";

import { useStyles, useTranslation } from "../shared/contexts/settingsContext";
import AppText from "../shared/components/AppText";
import { AccessText } from "./accessText";

export default function Denied() {
    const text = useTranslation(AccessText);
    const { styles } = useStyles();

    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>{text.ACCESS_DENIED}</AppText>
            <AppText>{text.TOO_MANY_ATTEMPTS}</AppText>
            <AppText>{text.TRY_AGAIN_LATER}</AppText>
        </View>
    );
}
