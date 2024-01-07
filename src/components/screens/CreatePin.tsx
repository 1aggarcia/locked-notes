import { useState } from "react";
import { View } from "react-native";

import styles from "../../util/styles";
import { savePinAsync } from "../../util/file-service";

import AppText from "../shared/AppText";
import PinPad from "../shared/PinPad";

interface CreatePinProps {
    // Callback function to unlock the app after pin creation
    unlock: () => void
}

export default function CreatePin(props: CreatePinProps) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    function confirmPin(newPin: string) {
        if (newPin !== pin) {
            setPin('');
            setError(true);
        } else {
            savePinAsync(pin);
            props.unlock()
        }
    }

    if (pin === '') {
        // Pin has not been set
        return (
            <View style={[styles.app, styles.pinContainer]}>
                {error &&
                    <AppText style={{color: 'red', textAlign: 'center'}}>
                        The PINs entered did not match. Please try again
                    </AppText>
                }
                <AppText style={styles.header}>Create a New PIN</AppText>
                <PinPad onComplete={setPin} />
            </View>
        )
    } else {
        // Pin has been set: need to confirm it
        return (
            <View style={[styles.app, styles.pinContainer]}>
                <AppText style={styles.header}>Confirm PIN</AppText>
                <PinPad onComplete={confirmPin} />
            </View>
        )
    }
}