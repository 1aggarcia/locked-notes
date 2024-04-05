/** 
 * Creates and manages a navigator for the app's unlocked mode.
 * All the screens used in the navigator are contained within the "nav" folder.
 */

import { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Styles from "../../util/services/styles";
import { formatTime, secondsUntil } from "../../util/services/datetime";

import NotesView from "../authenticated/NotesView";
import EditNote from "../authenticated/EditNote";
import Settings from "../authenticated/Settings";
import ResetPin from "../authenticated/ResetPin";
import AppText from "../shared/AppText";

export type Params = {
    NotesView: undefined;
    EditNote: { filename: string };
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

    // Count down until expireTime goes into the past
    useEffect(() => {
        const interval = setInterval(decrementTime, 1000);

        // Stop the counter when this component is unmounted
        // React handles the rest automatically
        return () => clearInterval(interval);
    }, []);

    const screenOptions = {
        headerBackTitle: "Back",
        headerRight: () => (<>
            <TouchableOpacity onPress={props.lock}>
                <AppText>Lock</AppText>
            </TouchableOpacity>
        </>),
        title: `Unlocked Time: ${formatTime(timeLeft)}`,
    }

    /** Refresh the clock, lock the app if it is past the expiryTime */
    function decrementTime() {
        if (Date.now() < props.expiryTime.getTime()) {
            setTimeLeft(secondsUntil(props.expiryTime));
        } else {
            props.lock()
        }
    }

    return (
        <NavigationContainer theme={Styles.isDarkMode()? DarkTheme : DefaultTheme}>
            <Stack.Navigator screenOptions={screenOptions} initialRouteName='NotesView'>
                <Stack.Screen name={'NotesView'} component={NotesView} />
                <Stack.Screen
                    name={'EditNote'}
                    component={EditNote}
                    options={{ headerBackButtonMenuEnabled: false }}
                />
                <Stack.Screen name={'Settings'} component={Settings} />
                <Stack.Screen name={'ResetPin'} component={ResetPin} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
