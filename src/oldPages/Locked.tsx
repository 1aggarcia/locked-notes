import { useState } from "react";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';

import AppText from "../components/AppText";
import styles from "../modules/styles";
import { View } from "react-native";
import PinPad from "../components/PinPad";
import { registerPinAsEncryptionKey, saltAndSha256 } from "../modules/encryption-service";

type LockedProps = {
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
        <View style={{flex: 1}}>
            <View style={{flex: 1}}>
                <AppText style={[{flex: 1, justifyContent: 'center'}, styles.header]}>Enter PIN to unlock</AppText>
                <View style={{flex: 1, backgroundColor: 'blue'}}>
                    {error && <AppText style={{color: 'red', textAlign: 'center'}}>
                        Incorrect PIN entered. {`${maxAttempts - attempts}`} attempts remaining.
                    </AppText>
                    }
                </View>
            </View>
            <PinPad onComplete={confirmPin}/>
        </View>
    )
}

// async function findEncryptionKey(pin: string) {
//     const encryptionSalt = await SecureStore.getItemAsync('encryptionSalt');
//     if (encryptionSalt !== null) {
//         registerEncryptionKey(encryptionSalt + pin);
//     } else {
//         alert('Encryption key not found');
//     }
// }