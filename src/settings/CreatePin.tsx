import { useState } from "react";
import { View } from "react-native";

import { useStyles } from "../shared/contexts/stylesContext";
import { LoginInfo, savePinAsync } from "../shared/services/securestore";
import showErrorDialog from "../shared/util/error";

import AppText from "../shared/components/AppText";
import PinPad from "./components/PinPad";

interface CreatePinProps {
    /** Set the app's login state & unlock the app */
    updateLogin: (login: LoginInfo) => void
}

export default function CreatePin(props: CreatePinProps) {
    const { styles } = useStyles();

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

    function handleSaveError(reason: unknown) {
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