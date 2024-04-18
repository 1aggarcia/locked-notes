import { useContext } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../shared/AppText";
import Styles from "../../util/services/styles";
import { Params } from "../screens/Unlocked";
import AppButton from "../shared/AppButton";

export default function ResetPin(
    { route }: NativeStackScreenProps<Params, 'ResetPin'>
) {
    // Props:
    const login = route.params.login;
    // - setLogin: Non functional

    // state:
    // - authenticated: boolean
    // - newPin: string
    // - errorMsg: string

    const styles = Styles.get();

    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={{fontSize: 25}}>ResetPin</AppText>
            <AppText>{ JSON.stringify(login) }</AppText>
        </View>
    )
}