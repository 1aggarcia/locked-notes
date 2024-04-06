import { useState } from "react";
import { View } from "react-native";

import appEncryptor, { saltAndSha256 } from "../../util/services/encryption";
import { LoginInfo } from "../../util/storage/securestore";
import Styles from "../../util/services/styles";

import AppText from "../shared/AppText";
import PinPad from "../shared/PinPad";

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

    const styles = Styles.get();

    function confirmPin(pin: string) {
        const hashedPin = saltAndSha256({ text: pin, salt: props.login.salt})
        if (hashedPin === props.login.hash) {
            // Correct login info, set encryption key and unlock
            appEncryptor.registerPinAsKey(pin);
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
            <View style={[styles.centered, {flex: 1}]}>
                <AppText style={styles.header}>Enter PIN to unlock</AppText>
                {error &&
                    <AppText style={{color: 'red', textAlign: 'center'}}>
                        Incorrect PIN entered. {`${maxAttempts - attempts}`} attempts remaining.
                    </AppText>
                }
            </View>
            <PinPad onComplete={confirmPin}/>
        </View>
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