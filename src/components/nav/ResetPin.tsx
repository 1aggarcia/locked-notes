import { View } from "react-native";
import AppText from "../common/AppText";
import { getStyles } from "../../util/services/styles";

export default function ResetPin() {
    return (
        <View style={[getStyles().app, getStyles().centered]}>
            <AppText style={{fontSize: 25}}>ResetPin</AppText>
        </View>
    )
}