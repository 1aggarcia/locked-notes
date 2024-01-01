import { useState, useEffect } from "react";
import { View } from "react-native";
import PinPad from "../components/PinPad";
import AppText from "../components/AppText";
import styles from "../modules/styles";
import { generateSalt } from "../modules/file-reader";

const salt = generateSalt(64);

interface CreatePinProps {
    // Callback function to go to navigation page
    goToNavigation: () => void
}

export default function CreatePin(props: CreatePinProps) {
    const [hash, setHash] = useState('');
    const [error, setError] = useState(false);

    function confirmPin(newHash: string) {
        if (newHash !== hash) {
            setHash('');
            setError(true);
        } else {
            //savePin({ hash: hash, salt: salt });
            props.goToNavigation();
        }
    }

    if (hash === '') {
        // Pin has not been set
        return (
            <View style={styles.pinContainer}>
                {error && <AppText style={{color: 'red', textAlign: 'center'}}>
                    The PINs entered did not match. Please try again
                </AppText>}
                <AppText style={styles.header}>Create a New PIN</AppText>
                <PinPad salt={salt} onComplete={setHash} />
            </View>
        )
    } else {
        // Pin has been set: need to confirm it
        return (
            <View style={styles.pinContainer}>
                <AppText style={styles.header}>Confirm PIN</AppText>
                <PinPad salt={salt} onComplete={confirmPin} />
            </View>
        )
    }
}

function savePin(data: { hash: string, salt: string }) {
    console.log(data);
    throw Error('File Saving Unimplemented');
}