import { useContext, useState } from "react";
import { Alert, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../shared/AppText";
import { useStyles } from "../../contexts/stylesContext";
import { Params } from "../screens/Unlocked";
import PinPad from "../shared/PinPad";
import { saltAndSha256 } from "../../util/services/encryption";
import CreatePin from "../screens/CreatePin";
import { LoginInfo } from "../../util/storage/securestore";
import { LoginContext } from "../../util/context";

export default function ResetPin(
    { navigation }: NativeStackScreenProps<Params, 'ResetPin'>
) {
    const [login, setLogin] = useContext(LoginContext);
    const [authenticated, setAuthenticated] = useState(false);

    const { styles } = useStyles();

    function confirmSavedPin(pin: string) {
        const hashedPin = saltAndSha256({
            text: pin,
            salt: login.salt
        });

        if (hashedPin !== login.hash) {
            // wrong PIN
            Alert.alert("Verification Failed", "Wrong PIN entered");
            navigation.goBack();
            return;
        }
        setAuthenticated(true);
    }

    // Update the cached pin in app state
    function setAppLogin(login: LoginInfo) {
        setLogin(login);
        Alert.alert("Success!", "Your new PIN was saved");
        navigation.goBack();
    }

    if (!authenticated) {
        return (
            <View style={[styles.app, styles.pinContainer]}>
                <View style={[styles.centered, {flex: 1}]}>
                    <AppText style={styles.header}>Confirm Saved PIN</AppText>
                </View>
                <PinPad onComplete={confirmSavedPin}/>
            </View>
        )
    }
    return <CreatePin updateLogin={setAppLogin}/>
}
