import { Text, View } from 'react-native';
import { useState } from 'react';
import PinPad from '../components/PinPad';

export default function Pin() {
    const [pin, setPin] = useState('');

    return (
        <View>
            <Text style={{textAlign: 'center'}}>{pin}</Text>
            <PinPad onComplete={setPin}></PinPad>
        </View>
    )
}