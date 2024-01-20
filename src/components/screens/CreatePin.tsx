import { useState } from "react";
import { View } from "react-native";

import { getStyles } from "../../util/services/styles";
import { LoginInfo, savePinAsync } from "../../util/services/files";
import showErrorDialog from "../../util/error";

import AppText from "../common/AppText";
import PinPad from "../common/PinPad";

interface CreatePinProps {
    /** Set the app's login state & unlock the app */
    updateLogin: (login: LoginInfo) => void
}

export default function CreatePin(props: CreatePinProps) {
    const styles = getStyles();

    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    function confirmPin(newPin: string) {
        if (newPin === pin) {
            savePinAsync(pin)
                .then(props.updateLogin)
                .catch(handleSaveError);
        } else {
            setPin('');
            setError(true);
        }
    }

    // the promise reject gives us "any" type for `reason` so we are forced to use it here
    function handleSaveError(reason: any) {
        console.error(reason);
        showErrorDialog(reason);
        setPin('');
        // We want to reset the screen to simulate a new attempt,
        // i.e. remove any error messages from the last attempt
        setError(false);
    }

    if (pin === '') {
        // Pin has not been set
        return (
            <View style={[styles.app, styles.pinContainer]}>
                <View style={[styles.centered, {flex: 1}]}>
                    <AppText style={styles.header}>Create a New PIN</AppText>
                    {error &&
                        <AppText style={{color: 'red', textAlign: 'center'}}>
                            The PINs entered did not match. Please try again
                        </AppText>
                    }
                </View>
                <PinPad onComplete={setPin} />
            </View>
        )
    } else {
        // Pin has been set: need to confirm it
        return (
            <View style={[styles.app, styles.pinContainer]}>
                <View style={[styles.centered, {flex: 1}]}>
                    <AppText style={styles.header}>Confirm PIN</AppText>
                </View>
                <PinPad onComplete={confirmPin} />
            </View>
        )
    }
}