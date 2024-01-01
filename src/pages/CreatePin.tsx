import { useState, useEffect } from "react";
import { View } from "react-native";
import PinPad from "../components/PinPad";
import AppText from "../components/AppText";
import styles from "../modules/styles";
import { generateSalt, hash256, registerEncryptionKey } from "../modules/encryption-service";

const pinSalt = generateSalt(64);
const fileSalt = generateSalt(64);

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
            savePin({ pin: pin, pinSalt: pinSalt, fileSalt: fileSalt });
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

function savePin(data: { pin: string, pinSalt: string, fileSalt: string }) {
    const hash = hash256({ text: data.pin, salt: data.pinSalt });
    console.log(hash);

    registerEncryptionKey({ pin: data.pin, salt: data.fileSalt })
    throw Error('File Saving Unimplemented');
}