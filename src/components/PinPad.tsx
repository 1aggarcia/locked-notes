import { View, Pressable } from 'react-native';
import { useState } from 'react';
import PinButton from './PinButton';


export interface PinPadProps {
    sendPin: (value: string) => void;
}

export default function PinPad(props: PinPadProps) {
    const [pin, setPin] = useState('');

    function updatePin(digit: number) {
        const newPin = pin + digit;

        setPin(newPin);
        props.sendPin(newPin);
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <View>
                <PinButton digit={1} onPress={() => updatePin(1)}/>
                <PinButton digit={4} onPress={() => updatePin(4)}/>
                <PinButton digit={7} onPress={() => updatePin(7)}/>
            </View>
            <View>
                <PinButton digit={2} onPress={() => updatePin(2)}/>
                <PinButton digit={5} onPress={() => updatePin(5)}/>
                <PinButton digit={8} onPress={() => updatePin(8)}/>
                <PinButton digit={0} onPress={() => updatePin(0)}/>
            </View>
            <View>
                <PinButton digit={3} onPress={() => updatePin(3)}/>
                <PinButton digit={6} onPress={() => updatePin(6)}/>
                <PinButton digit={9} onPress={() => updatePin(9)}/>
            </View>
        </View>
    )
}