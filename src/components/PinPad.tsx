import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

import { sha256 } from 'js-sha256';

import PinButton from './PinButton';
import colors from '../assets/colors';
import PinVisualizer from './PinVisualizer';

const maxPinLength = 6;

export interface PinPadProps {
    // Function to execute when the pin is completed
    onComplete: (pin: string) => any;

    // Salt should be a 64 character long hexadecimal string
    salt: string;
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
            props.onComplete(hash256(newPin, props.salt));
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
        props.onComplete('');
    }

    return (<>
        <PinVisualizer
            max={maxPinLength}
            currentLength={pin.length}
        />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
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
        <Pressable onPress={backspace}>
            <Text style={styles.backspace}>Delete</Text>
        </Pressable>
    </>)
}

const styles = StyleSheet.create({
    backspace: {
        textAlign: 'right',
        padding: 10,
        borderColor: colors.border,
        borderWidth: 1
    }
});

/**
 * Hash text using SHA-256
 * @param text text to hash
 * @returns hashed text
 */
function hash256(text: string, salt: string): string {
    const hash = sha256.create();
    hash.update(salt + text);
    return hash.hex();
}