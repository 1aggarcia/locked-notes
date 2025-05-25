/** 
 * Creates and manages a navigator for the app's unlocked mode.
 * All the screens used in the navigator are contained within the "nav" folder.
 */

import { useState, useEffect } from "react";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
    NativeStackNavigationOptions,
    NativeStackNavigationProp,
    createNativeStackNavigator
} from "@react-navigation/native-stack";

import { useStyles, useTranslation } from "../shared/contexts/settingsContext";
import { formatTime, secondsUntil } from "../shared/util/datetime";

import AppButton from "../shared/components/AppButton";
import NotesView from "../notes/NotesView";
import EditNote from "../notes/EditNote";
import Settings from "../settings/Settings";
import ResetPin from "../settings/ResetPin";
import { accessText } from "./accessText";

export type Params = {
    NotesView: undefined;
    EditNote: { filename: string };
    Settings: undefined;
    ResetPin: undefined;
};

const Stack = createNativeStackNavigator<Params>();

interface UnlockedProps {
    lock: () => unknown;

    /** Timestamp when the app should expire and lock itself */
    expiryTime: Date;
}

export default function Unlocked(props: UnlockedProps) {
    // number of seconds until the app closes
    const [timeLeft, setTimeLeft] = useState(secondsUntil(props.expiryTime));
    const { colorTheme, isDarkMode } = useStyles();
    const text = useTranslation(accessText);

    // Count down until expireTime goes into the past
    useEffect(() => {
        const interval = setInterval(decrementTime, 1000);

        // Stop the counter when this component is unmounted
        // React handles the rest automatically
        return () => clearInterval(interval);
    }, []);

    const screenOptions: NativeStackNavigationOptions = {
        headerBackTitle: text.BACK,
        // not ideal to use onPressIn but for now it's more stable that onPress
        headerRight: () => <AppButton onPressIn={props.lock}>{text.LOCK}</AppButton>,
        title: `${text.UNLOCKED}: ${formatTime(timeLeft)}`,
        headerStyle: { backgroundColor: colorTheme.fg },
        headerTitleStyle: { color: colorTheme.text },
        headerBackButtonMenuEnabled: false,   // TODO: watch out for problems here
    }

    // Prop 'navigation' is provided by the Stack Navigator
    const screenOptionsWithSettingsButton = (navProps: {
        navigation: NativeStackNavigationProp<Params, keyof Params, undefined>
    }) => ({
        headerRight: () => (<>
            <AppButton onPressIn={() => navProps.navigation.navigate('Settings')}>
                {text.SETTINGS}
            </AppButton>
            <AppButton onPressIn={props.lock}>{text.LOCK}</AppButton>
        </>),
    });

    /** Refresh the clock, lock the app if it is past the expiryTime */
    function decrementTime() {
        if (Date.now() < props.expiryTime.getTime()) {
            setTimeLeft(secondsUntil(props.expiryTime));
        } else {
            props.lock();
        }
    }

    return (
        <NavigationContainer theme={isDarkMode? DarkTheme : DefaultTheme}>
            <Stack.Navigator screenOptions={screenOptions} initialRouteName='NotesView'>
                <Stack.Screen name={'NotesView'} component={NotesView}
                    options={screenOptionsWithSettingsButton} />

                <Stack.Screen name={'EditNote'} component={EditNote}
                    options={screenOptionsWithSettingsButton} />

                <Stack.Screen name={'Settings'} component={Settings} />
                <Stack.Screen name={'ResetPin'} component={ResetPin} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
