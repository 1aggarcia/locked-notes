import { View } from "react-native";

import { getStyles } from "../../util/services/styles";
import AppText from "../common/AppText";

export default function Denied() {
    return (
        <View style={[getStyles().app, getStyles().centered]}>
            <AppText style={getStyles().header}>Access Denied</AppText>
            <AppText>Too many failed unlock attempts</AppText>
            <AppText>Try again in a few minutes</AppText>
        </View>
    )
}