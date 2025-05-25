import { useState } from "react";
import { TextInput, View } from "react-native";

import appEncryptor, { saltAndSha256 } from "../shared/services/encryption";
import { useLogin } from "../shared/contexts/loginContext";
import { useStyles, useTranslation } from "../shared/contexts/settingsContext";

import AppText from "../shared/components/AppText";
import PinPad from "../settings/components/PinPad";
import { AccessText } from "./accessText";

const BACKDOOR_ENABLED = false;
const MAX_ATTEMPTS = 5;

interface LockedProps {
    unlock: () => void;

    /** Lock the app without a way to unlock it */
    denyAccess: () => void;
}

export default function Locked(props: LockedProps) {
    const { login } = useLogin(); 
    const { styles } = useStyles();
    const text = useTranslation(AccessText);

    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState(false);

    function onPinComplete(pin: string) {
        const hashedPin = saltAndSha256({ text: pin, salt: login.salt})
        if (hashedPin === login.hash) {
            // Correct login info, set encryption key and unlock
            appEncryptor.registerPinAsKey(pin);
            props.unlock()
        } else {
            setError(true);
            if (attempts + 1 === MAX_ATTEMPTS) {
                props.denyAccess()
            } else {
                setAttempts(attempts + 1)
            }
        }
    }

    return (
        <View style={[styles.app, styles.pinContainer]}>
            <View style={[styles.centered, {flex: 1}]}>
                {BACKDOOR_ENABLED && 
                    <NotForProdBackdoorAction />
                }
                <AppText style={styles.header}>{text.ENTER_PIN_TO_UNLOCK}</AppText>
                {error &&
                    <AppText style={{color: 'red', textAlign: 'center'}}>
                        {text.incorrectPin(`${MAX_ATTEMPTS - attempts}`)}
                    </AppText>
                }
            </View>
            <PinPad onComplete={onPinComplete}/>
        </View>
    )
}

// Dangerous way to expose login details to the user
// For development purposes only
function NotForProdBackdoorAction() {
    if (!BACKDOOR_ENABLED) {
        throw new ReferenceError("Bad attempt to access secret component");
    } 
    const { login } = useLogin();

    const textLogin = login.hash + " " + login.salt;
    console.debug(textLogin);

    return (
        // Login details in copy and paste box
        <TextInput
            style={{padding: 15}}
            value={textLogin}
            selectTextOnFocus
            multiline />
    )
}

/** Dummy button for testing new services */
// function TestActionDontUse() {
//     return <TouchableOpacity 
//         onPress={cleanupTempNoteFiles}
//         style={{backgroundColor: 'lime', padding: 15}}
//     >
//         <AppText style={{textAlign: 'center'}}>Do something dangerous to my phone</AppText>
//     </TouchableOpacity>
// }