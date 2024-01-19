/** 
 * Creates and manages a navigator for the app's unlocked mode.
 * All the screens used in the navigator are contained within the "nav" folder.
 */

import { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Note from "../../util/types/note";
import { isDarkMode } from "../../util/services/styles";
import { formatTime } from "../../util/services/datetime";

import NotesView from "../nav/NotesView";
import EditNote from "../nav/EditNote";
import Settings from "../nav/Settings";
import ResetPin from "../nav/ResetPin";
import AppText from "../common/AppText";

export type Params = {
    NotesView: undefined;
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
        headerRight: () => (
            <TouchableOpacity onPress={props.lock}>
                <AppText>Lock</AppText>
            </TouchableOpacity>
        ),
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
                <Stack.Screen name={'NotesView'} component={NotesView} />
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
