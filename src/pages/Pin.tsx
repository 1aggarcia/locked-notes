import { Text, View } from 'react-native';
import { useState } from 'react';
import PinPad from '../components/PinPad';

export default function Pin() {
    const [pin, setPin] = useState('');

    return (<View>
        <Text>Current Pin: {pin}</Text>
        <PinPad sendPin={setPin}></PinPad>
    </View>)
}