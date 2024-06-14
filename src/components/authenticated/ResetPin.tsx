import { useContext, useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../shared/AppText";
import Styles from "../../util/services/styles";
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

    const styles = Styles.get();

    function confirmSavedPin(pin: string) {
        const hashedPin = saltAndSha256({
            text: pin,
            salt: login.salt
        });

        if (hashedPin !== login.hash) {
            // wrong PIN
            navigation.goBack();
            return;
        }
        setAuthenticated(true);
    }

    function reencryptNotes(login: LoginInfo) {
        throw new ReferenceError("Unimplemented: reencryptNotes");
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
    return <CreatePin updateLogin={reencryptNotes}/>
    // if (newPin == "") {
    //     // PIN has not been set
    //     return (
    //         <View style={[styles.app, styles.pinContainer]}>
    //             <View style={[styles.centered, {flex: 1}]}>
    //                 <AppText style={styles.header}>Create a New PIN</AppText>
    //                 {errorMsg &&
    //                     <AppText style={{color: 'red', textAlign: 'center'}}>
    //                         The PINs entered did not match. Please try again
    //                     </AppText>
    //                 }
    //             </View>
    //             <PinPad onComplete={setNewPin} />
    //         </View>
    //     )
    // } else {
    //     // PIN has been set: needs to be confirmed
    //     return (
    //         <View style={[styles.app, styles.pinContainer]}>
    //             <View style={[styles.centered, {flex: 1}]}>
    //                 <AppText style={styles.header}>Confirm New PIN</AppText>
    //             </View>
    //             <PinPad onComplete={confirmNewPin} />
    //         </View>
    //     )
    // }
}