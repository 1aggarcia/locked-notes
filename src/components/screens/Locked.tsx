import { useState } from "react";
import { TextInput, View } from "react-native";

import appEncryptor, { saltAndSha256 } from "../../util/services/encryption";
import { LoginInfo } from "../../util/storage/securestore";
import Styles from "../../util/services/styles";

import AppText from "../shared/AppText";
import PinPad from "../shared/PinPad";

const BACKDOOR_ENABLED = false;
const MAX_ATTEMPTS = 5;

interface LockedProps {
    unlock: () => void;

    /** Lock the app without a way to unlock it */
    denyAccess: () => void;

    login: LoginInfo;
}

export default function Locked(props: LockedProps) {
    const [attempts, setAttempts] = useState(0);
    const [error, setError] = useState(false);

    const styles = Styles.get();

    function confirmPin(pin: string) {
        const hashedPin = saltAndSha256({ text: pin, salt: props.login.salt})
        if (hashedPin === props.login.hash) {
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
                    <NotForProdBackdoorAction login={props.login} />
                }
                <AppText style={styles.header}>Enter PIN to unlock</AppText>
                {error &&
                    <AppText style={{color: 'red', textAlign: 'center'}}>
                        Incorrect PIN entered. {`${MAX_ATTEMPTS - attempts}`} attempts remaining.
                    </AppText>
                }
            </View>
            <PinPad onComplete={confirmPin}/>
        </View>
    )
}

// Dangerous way to expose login details to the user
// For development purposes only
function NotForProdBackdoorAction(props: { login: LoginInfo }) {
    if (!BACKDOOR_ENABLED) {
        throw new ReferenceError("Bad attempt to access secret component");
    } 

    const textLogin = props.login.hash + " " + props.login.salt;
    console.log(textLogin);

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
//         onPress={() => {
//             async function test() {
//                 try {
//                     const filename = 'note_1705653496165.ejn';
//                     const rawFile = await getFileFromNotesDirAsync(filename);
//                     if (rawFile === null)
//                         throw ReferenceError("Error reading file");

//                     await exportTextFileAsync(filename, rawFile);

//                     alert("File export complete.")
//                 } catch (error) {
//                     showErrorDialog(error);
//                 }
//             }
//             test();
//         }}
//         style={{backgroundColor: 'lime', padding: 15}}
//     >
//         <AppText style={{textAlign: 'center'}}>Do something dangerous to my phone</AppText>
//     </TouchableOpacity>
// }