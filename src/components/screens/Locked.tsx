import { useState } from "react";
import { View } from "react-native";

import { registerPinAsEncryptionKey, saltAndSha256 } from "../../util/encryption-service";
import { LoginInfo } from "../../util/file-service";
import styles from "../../util/styles";

import AppText from "../common/AppText";
import PinPad from "../common/PinPad";

interface LockedProps {
    // Callback function to unlock the app
    unlock: () => void;

    // Callback function to permanently lock the app
    denyAccess: () => void;

    login: LoginInfo
}

const maxAttempts = 5;

export default function Locked(props: LockedProps) {
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState(false);

    function confirmPin(pin: string) {
        const hashedPin = saltAndSha256({ text: pin, salt: props.login.salt})
        if (hashedPin === props.login.hash) {
            // Correct login info, set encryption key and unlock
            registerPinAsEncryptionKey(pin);
            props.unlock();
        } else {
            setError(true);
            if (attempts + 1 === maxAttempts) {
                props.denyAccess()
            } else {
                setAttempts(attempts + 1)
            }
        }
    }

    return (
        <View style={[styles.app, styles.pinContainer]}>
            {error &&
                <AppText style={{color: 'red', textAlign: 'center'}}>
                    Incorrect PIN entered. {`${maxAttempts - attempts}`} attempts remaining.
                </AppText>
            }
            <AppText style={styles.header}>Enter PIN to unlock</AppText>
            <PinPad onComplete={confirmPin}/>
        </View>
    )
}