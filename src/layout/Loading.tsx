import { View, ActivityIndicator } from "react-native";

import { useStyles, useTranslation } from "../shared/contexts/settingsContext";
import AppText from "../shared/components/AppText";
import { LayoutText } from "./layoutText";

interface LoadingProps {
    /** Give the user some helpful information about what is loading */
    message: string
}

export default function Loading(props: LoadingProps) {
    const { styles } = useStyles();
    const text = useTranslation(LayoutText);

    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>{text.LOADING}</AppText>
            <AppText>{props.message}</AppText>
            <ActivityIndicator size='large'/>
        </View>
    )
}