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

// Maximum time the app can be unlocked, in seconds
const maxTime = 599;

interface UnlockedProps {
    lock: () => void;
}

export default function Unlocked(props: UnlockedProps) {
    const [timeOpen, setTimeOpen] = useState(maxTime)

    const screenOptions = {
        headerRight: () => <Button title='Lock' onPress={props.lock} />,
        title: `Unlocked Time: ${formatTime(timeOpen)}`
    }

    // Countdown until reaching 0 seconds
    useEffect(() => {
        setTimeout(() => {
        if (timeOpen > 1) {
            setTimeOpen(timeOpen - 1);
        } else {
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
 * Convert seconds to string representing MM:SS
 * @param seconds number of seconds to count. Must be < 3600
 */
function formatTime(seconds: number): string {
    if (seconds >= 3600) {
        throw RangeError(`seconds >= 3600: ${seconds}`);
    }
    const minutes = Math.floor(seconds / 60);
    const leftOver = seconds % 60;

    // account for leading zero
    if (leftOver < 10) {
        return `${minutes}:0${leftOver}`
    } else {
        return `${minutes}:${leftOver}`
    }
}