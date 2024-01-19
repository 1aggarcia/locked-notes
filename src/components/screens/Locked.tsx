import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { registerPinAsEncryptionKey, saltAndSha256 } from "../../util/services/encryption";
import { LoginInfo, testSafAsync } from "../../util/services/files";
import { getStyles } from "../../util/services/styles";

import AppText from "../common/AppText";
import PinPad from "../common/PinPad";

interface LockedProps {
    unlock: () => void;

    /** Lock the app without a way to unlock it */
    denyAccess: () => void;

    login: LoginInfo;
}

const maxAttempts = 5;

export default function Locked(props: LockedProps) {
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState(false);

    const styles = getStyles();

    function confirmPin(pin: string) {
        const hashedPin = saltAndSha256({ text: pin, salt: props.login.salt})
        if (hashedPin === props.login.hash) {
            // Correct login info, set encryption key and unlock
            registerPinAsEncryptionKey(pin);
            props.unlock()
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

/** Dummy button for testing new file service functions */
function TestActionDontUse() {
    return <TouchableOpacity 
        onPress={testSafAsync}
        style={{backgroundColor: 'lime', padding: 15}}
    >
        <AppText style={{textAlign: 'center'}}>Do something dangerous to my phone</AppText>
    </TouchableOpacity>
}