import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import styles from '../../util/styles';
import PinButton from './PinButton';
import PinVisualizer from './PinVisualizer';
import AppText from './AppText';

const maxPinLength = 6;

export interface PinPadProps {
    // Function to execute when the pin is completed
    onComplete: (pin: string) => void;
}

export default function PinPad(props: PinPadProps) {
    const [pin, setPin] = useState('');

    /**
     * Add digit given to the pin, given pin is not at max length
     * @param digit number 0-9 to add to pin
     */
    function updatePin(digit: number) {
        // Check validity
        if (pin.length >= maxPinLength) {
            return;
        }
        if (0 > digit || digit > 9) {
            throw RangeError('Digit Must be between 0-9');
        }

        const newPin = pin + digit;
        setPin(newPin);

        // Send pin back if max length
        if (newPin.length === maxPinLength) {
            setPin('');
            props.onComplete(newPin);
        }
    }

    /**
     * Remove last digit from pin, given pin is not empty
     */
    function backspace() {
        if (pin.length === 0) {
            return;
        }
        const newPin = pin.slice(0, -1);
        setPin(newPin);
    }

    return (<>
        <PinVisualizer
            max={maxPinLength}
            currentLength={pin.length}
        />
        <View style={styles.keypad}>
            <View>
                <PinButton digit={1} onPress={updatePin}/>
                <PinButton digit={4} onPress={updatePin}/>
                <PinButton digit={7} onPress={updatePin}/>
            </View>
            <View>
                <PinButton digit={2} onPress={updatePin}/>
                <PinButton digit={5} onPress={updatePin}/>
                <PinButton digit={8} onPress={updatePin}/>
                <PinButton digit={0} onPress={updatePin}/>
            </View>
            <View>
                <PinButton digit={3} onPress={updatePin}/>
                <PinButton digit={6} onPress={updatePin}/>
                <PinButton digit={9} onPress={updatePin}/>
            </View>
        </View>
        <TouchableOpacity style={styles.backspace} onPress={backspace}>
            <AppText>Delete</AppText>
        </TouchableOpacity>
    </>)
}