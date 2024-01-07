import { View, ActivityIndicator } from "react-native";
import AppText from "../components/AppText";
import styles from "../modules/styles";

export default function Loading() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <AppText style={styles.header}>Loading</AppText>
            <ActivityIndicator size='large'/>
        </View>
    )
}