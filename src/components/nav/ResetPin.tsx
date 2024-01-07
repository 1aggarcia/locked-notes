import { View } from "react-native";
import AppText from "../common/AppText";
import styles from "../../util/styles";

export default function ResetPin() {
    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={{fontSize: 25}}>ResetPin</AppText>
        </View>
    )
}