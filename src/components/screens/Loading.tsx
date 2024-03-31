import { View, ActivityIndicator } from "react-native";

import Styles from "../../util/services/styles";
import AppText from "../shared/AppText";

interface LoadingProps {
    /** Give the user some helpful information about what is loading */
    message: string
}

export default function Loading(props: LoadingProps) {
    const styles = Styles.get();

    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={styles.header}>Loading</AppText>
            <AppText>{props.message}</AppText>
            <ActivityIndicator size='large'/>
        </View>
    )
}