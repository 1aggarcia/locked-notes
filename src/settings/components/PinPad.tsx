import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useStyles } from '../../shared/contexts/stylesContext';

import PinButton from './PinButton';
import PinVisualizer from './PinVisualizer';
import AppText from '../../shared/components/AppText';

const maxPinLength = 6;

export interface PinPadProps {
    /** External action to execute once the full pin has been entered */
    onComplete: (pin: string) => unknown;
}

export default function PinPad(props: PinPadProps) {
    const { styles } = useStyles();
    const [pin, setPin] = useState('');

    /**
     * Add digit given to the pin, given pin is not at max length
     * @param digit number 0-9 to add to pin
     */
    function updatePin(digit: number) {
        // Check validity
        if (pin.length >= maxPinLength)
            return;

        if (0 > digit || digit > 9)
            throw RangeError('Digit Must be between 0-9');

        const newPin = pin + digit;
        setPin(newPin);

        // Send pin back if it's reached max length
        if (newPin.length === maxPinLength) {
            setPin('');
            props.onComplete(newPin);
        }
    }

    /** Remove last digit from pin, given pin is not empty  */
    function backspace() {
        if (pin.length === 0)
            return;

        const newPin = pin.slice(0, -1);
        setPin(newPin);
    }

    return (
        <View style={styles.pinPad}>
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
                    <PinBackspace onPress={backspace} />
                </View>
            </View>
        </View>
    )
}

// One-time-use small component for the backspace button, so we define it here

interface PinBackspaceProps {
    onPress: () => void
}

function PinBackspace(props: PinBackspaceProps) {
    const { styles } = useStyles();
    return (
        <TouchableOpacity
            style={styles.pinBackspace}
            onPress={props.onPress}
        >
            <AppText style={{fontSize: 35}}>{'<'}</AppText>
        </TouchableOpacity>
    )
}