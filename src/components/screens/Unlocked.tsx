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
import { formatTime } from "../../util/encryption-service";

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

    // The timestamp when access to the app wil expire
    expirationTime: number;
}

export default function Unlocked(props: UnlockedProps) {
    const [timeOpen, setTimeOpen] = useState(secondsUntil(props.expirationTime));

    const screenOptions = {
        headerRight: () => <Button title='Lock' onPress={props.lock} />,
        title: `Unlocked Time: ${formatTime(timeOpen)}`
    }

    // Countdown until reaching 0 seconds
    useEffect(() => {
        setTimeout(() => {
        if (props.expirationTime > Date.now()) {
            // still time left, just keep counting
            setTimeOpen(secondsUntil(props.expirationTime));
        } else {
            // time is up
            props.lock()
        }
        }, 1000)
    });

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
 * Given a timestamp as the number of miliseconds since the epoch, determine the number of seconds
 * until that time arrives.
 * @param timestamp date and time as the number of miliseconds since the epoch.
 * @returns number of seconds until given timestamp, or 0 if date is in the past.
 */
function secondsUntil(timestamp: number) {
    const msPerSecond = 1000;
    const difference = Math.floor((timestamp - Date.now()) / msPerSecond);

    return (difference > 0)? difference : 0
}
