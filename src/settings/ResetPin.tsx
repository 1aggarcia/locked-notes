import { useState } from "react";
import { Alert, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../shared/components/AppText";
import { useStyles, useTranslation } from "../shared/contexts/settingsContext";
import { Params } from "../access/Unlocked";
import PinPad from "./components/PinPad";
import { saltAndSha256 } from "../shared/services/encryption";
import CreatePin from "./CreatePin";
import { LoginInfo } from "../shared/services/securestore";
import { useLogin, useSetLogin } from "../shared/contexts/loginContext";
import { SettingsText } from "./settingsText";
import { CommonText } from "../shared/commonText";

export default function ResetPin(
    { navigation }: NativeStackScreenProps<Params, 'ResetPin'>
) {
    const text = useTranslation(SettingsText);
    const commonText = useTranslation(CommonText);
    const { login } = useLogin();
    const setLogin = useSetLogin(); 
    const [authenticated, setAuthenticated] = useState(false);

    const { styles } = useStyles();

    function confirmSavedPin(pin: string) {
        const hashedPin = saltAndSha256({
            text: pin,
            salt: login.salt
        });

        if (hashedPin !== login.hash) {
            // wrong PIN
            Alert.alert(text.VERIFICATION_FAILED, text.WRONG_PIN_ENTERED);
            navigation.goBack();
            return;
        }
        setAuthenticated(true);
    }

    // Update the cached pin in app state
    function setAppLogin(login: LoginInfo) {
        setLogin({ login, status: "Defined" });
        Alert.alert(commonText.SUCCESS, text.NEW_PIN_SAVED);
        navigation.goBack();
    }

    if (!authenticated) {
        return (
            <View style={[styles.app, styles.pinContainer]}>
                <View style={[styles.centered, {flex: 1}]}>
                    <AppText style={styles.header}>
                        {text.CONFIRM_SAVED_PIN}
                    </AppText>
                </View>
                <PinPad onComplete={confirmSavedPin}/>
            </View>
        )
    }
    return <CreatePin updateLogin={setAppLogin}/>
}
