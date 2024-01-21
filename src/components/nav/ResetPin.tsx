import { View } from "react-native";
import AppText from "../common/AppText";
import Styles from "../../util/services/styles";

export default function ResetPin() {
    const styles = Styles.get();

    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={{fontSize: 25}}>ResetPin</AppText>
        </View>
    )
}