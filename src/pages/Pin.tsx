import { Text, View } from 'react-native';
import { useState } from 'react';
import PinPad from '../components/PinPad';

const salt = generateSalt(64);

export default function Pin() {
    const [hashedPin, setHashedPin] = useState('');

    return (
        <View style={{justifyContent: 'flex-end', flex: 1}}>
            <Text style={{textAlign: 'center'}}>{hashedPin}</Text>
            <PinPad salt={salt} onComplete={setHashedPin}></PinPad>
        </View>
    )
}

function generateSalt(length: number) {
    const chars = '0123456789ABCDEF'
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}