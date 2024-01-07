import { View } from "react-native";
import AppText from "../components/AppText";
import styles from "../modules/styles";

export default function Denied() {
    return (
        <View style={{flex: 1}}>
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <AppText style={styles.header}>Access Denied</AppText>
                <AppText>Too many failed attempts</AppText>
            </View>
            {/* Extra view to position top text at 1/3 from top */}
            <View style={{flex: 1}} />
        </View>
    )
}