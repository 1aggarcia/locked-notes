import { useState } from "react";
import * as SecureStore from 'expo-secure-store';

import AppText from "../components/AppText";
import styles from "../modules/styles";
import { View } from "react-native";
import PinPad from "../components/PinPad";
import { registerEncryptionKey, saltAndSha256 } from "../modules/encryption-service";

interface LockedProps {
    // Callback function to set nav page to unlocked
    unlock: () => void;
    
    // Callback function to set nav page to access denied
    denyAccess: () => void;

    hash: string,
    salt: string
}

const maxAttempts = 5;

export default function Locked(props: LockedProps) {
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState(false);

    function confirmPin(pin: string) {
        const hashedPin = saltAndSha256({ text: pin, salt: props.salt})
        if (hashedPin === props.hash) {
            findEncryptionKey(pin);
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
        <View style={styles.pinContainer}>
            {error && <AppText style={{color: 'red', textAlign: 'center'}}>
                    Incorrect PIN entered. {maxAttempts - attempts} attempts remaining.
                </AppText>}
            <AppText style={styles.header}>Enter PIN to unlock</AppText>
            <PinPad onComplete={confirmPin}/>
        </View>
    )
}

async function findEncryptionKey(pin: string) {
    const encryptionSalt = await SecureStore.getItemAsync('encryptionSalt');
    if (encryptionSalt !== null) {
        registerEncryptionKey(encryptionSalt + pin);
    } else {
        alert('Encryption key not found');
    }
}