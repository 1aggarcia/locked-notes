import { useState } from "react";
import { View } from "react-native";

import PinPad from "../components/PinPad";
import AppText from "../components/AppText";
import styles from "../modules/styles";
import { savePinAsync } from "../modules/file-service";

interface CreatePinProps {
    // Callback function to go to navigation page
    goToNavigation: () => void
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
            props.goToNavigation();
        }
    }

    if (pin === '') {
        // Pin has not been set
        return (
            <View style={styles.pinContainer}>
                {error && <AppText style={{color: 'red', textAlign: 'center'}}>
                    The PINs entered did not match. Please try again
                </AppText>}
                <AppText style={styles.header}>Create a New PIN</AppText>
                <PinPad onComplete={setPin} />
            </View>
        )
    } else {
        // Pin has been set: need to confirm it
        return (
            <View style={styles.pinContainer}>
                <AppText style={styles.header}>Confirm PIN</AppText>
                <PinPad onComplete={confirmPin} />
            </View>
        )
    }
}