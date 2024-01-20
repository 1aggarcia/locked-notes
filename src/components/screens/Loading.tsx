import { View, ActivityIndicator } from "react-native";

import { getStyles } from "../../util/services/styles";
import AppText from "../common/AppText";

interface LoadingProps {
    /** Give the user some helpful information about what is loading */
    message: string
}

export default function Loading(props: LoadingProps) {
    const styles = getStyles();

    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>Loading</AppText>
            <AppText>{props.message}</AppText>
            <ActivityIndicator size='large'/>
        </View>
    )
}