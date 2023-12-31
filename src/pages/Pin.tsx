import { View } from 'react-native';
import { useState } from 'react';
import PinPad from '../components/PinPad';
import AppText from '../components/AppText';

const salt = generateSalt(64);

export interface PinProps {
    // Function to unlock the app on correct pin entry
    unlock: () => void
}

export default function Pin(props: PinProps) {
    const [hashedPin, setHashedPin] = useState('');

    function complete(pin: string) {
        setHashedPin(pin)
        props.unlock();
    }

    return (
        <View style={{justifyContent: 'flex-end', flex: 1}}>
            <AppText style={{textAlign: 'center', fontSize: 40}}>App Locked</AppText>
            <PinPad salt={salt} onComplete={complete}></PinPad>
        </View>
    )
}

function generateSalt(length: number) {
    const chars = '0123456789ABCDEF'
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}