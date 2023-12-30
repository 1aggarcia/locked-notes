import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import PinButton from './PinButton';
import colors from '../assets/colors';
import PinVisualizer from './PinVisualizer';

const maxPinLength = 6;

export interface PinPadProps {
    sendPin: (value: string) => void;
}

export default function PinPad(props: PinPadProps) {
    const [pin, setPin] = useState('');

    /**
     * Add digit given to the pin, given pin is not at max length
     * @param digit number 0-9 to add to pin
     */
    function updatePin(digit: number) {
        if (pin.length >= maxPinLength) {
            return;
        }
        if (0 > digit || digit > 9) {
            throw RangeError('Digit Must be between 0-9');
        }

        const newPin = pin + digit;
        setPin(newPin);
        props.sendPin(newPin);
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
        props.sendPin(newPin);
    }

    return (<>
        <PinVisualizer
            max={maxPinLength}
            currentLength={pin.length}
        />
        <View style={{flexDirection: 'row'}}>
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