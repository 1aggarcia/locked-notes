/** 
 * Creates and manages a navigator for the app's unlocked mode.
 * All the screens used in the navigator are contained within the "nav" folder.
 */

import { useState, useEffect } from "react";
import { Button } from "react-native";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Note from "../../util/note";
import { isDarkMode } from "../../util/styles";

import NoteList from "../nav/NoteList";
import EditNote from "../nav/EditNote";
import Settings from "../nav/Settings";
import ResetPin from "../nav/ResetPin";

export type Params = {
    NoteList: undefined;
    EditNote: { filename: string, note: Note };
    Settings: undefined;
    ResetPin: undefined;
};
const Stack = createNativeStackNavigator<Params>();

interface UnlockedProps {
    lock: () => void;

    /** Timestamp when the app should expire and lock itself */
    expiryTime: Date;
}

export default function Unlocked(props: UnlockedProps) {
    // number of seconds until the app closes
    const [timeLeft, setTimeLeft] = useState(secondsUntil(props.expiryTime));

    const screenOptions = {
        headerRight: () => <Button title='Lock' onPress={props.lock} />,
        title: `Unlocked Time: ${formatTime(timeLeft)}`
    }

    // Countdown until expireTime goes into the past
    useEffect(() => {
        setTimeout(() => {
            if (Date.now() < props.expiryTime.getTime()) {
                // still time left, just keep counting
                setTimeLeft(secondsUntil(props.expiryTime) + 1);
            } else {
                // time is up
                props.lock()
            }
        }, 1000)
    }, [timeLeft]);

    return (
        <NavigationContainer theme={isDarkMode? DarkTheme : DefaultTheme}>
            <Stack.Navigator screenOptions={screenOptions}>
                <Stack.Screen name={'NoteList'} component={NoteList} />
                <Stack.Screen name={'EditNote'} component={EditNote} />
                <Stack.Screen name={'Settings'} component={Settings} />
                <Stack.Screen name={'ResetPin'} component={ResetPin} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

/**
 * Determine the number of seconds until the diven date
 * @param timestamp date and time to calculate the difference for
 * @returns number of seconds until given timestamp, or 0 if date is in the past.
 */
function secondsUntil(timestamp: Date): number {
    const msPerSec = 1000;
    const difference = Math.floor((timestamp.getTime() - Date.now()) / msPerSec);

    return (difference > 0)? difference : 0
}

/**
 * Convert seconds to string representing MM:SS
 * @param seconds number of seconds to count.
 */
function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const leftOver = Math.floor(seconds % 60);

    // account for leading zero
    if (leftOver < 10) {
        return `${minutes}:0${leftOver}`
    } else {
        return `${minutes}:${leftOver}`
    }
}