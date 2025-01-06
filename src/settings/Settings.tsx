import isEqual from 'lodash.isequal';
import { useState, useEffect } from 'react';
import { View, Switch, TextInput, Alert, AlertButton } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { 
    getSettingsAsync,
    saveSettingsAsync 
} from '../shared/services/securestore';
import showErrorDialog from '../shared/util/error';
import { useSetColorTheme, useStyles } from '../shared/contexts/stylesContext';
import SettingsType from './types';

import AppText from "../shared/components/AppText";
import Loading from '../layout/Loading';
import AppButton from '../shared/components/AppButton';
import { Params } from "../access/Unlocked";
import { exportAllNotes } from '../notes/storage/android';
import { usePreventRemove } from '@react-navigation/native';

const MIN_UNLOCKED_SECONDS = 60;
const MAX_UNLOCKED_SECONDS = 3600;

export default function Settings(
    { navigation }: NativeStackScreenProps<Params, 'Settings'>)
{
    const [settings, setSettings] = useState<SettingsType>();
    const [savedSettings, setSavedSetings] = useState<SettingsType>();

    const { styles } = useStyles();
    const setAppColorTheme = useSetColorTheme();
    const hasChanged = !isEqual(settings, savedSettings);

    // Load settings from disk
    useEffect(() => {
        getSettingsAsync()
            .then(settings => {
                setAppColorTheme({
                    isDarkMode: settings.darkMode,
                    isLowContrast: settings.lowContrast
                });
                setSettings(settings);
                setSavedSetings(settings);
            })
            .catch(showErrorDialog)
    }, []);

    usePreventRemove(hasChanged, ({ data }) => {
        saveSettings()
            .finally(() => navigation.dispatch(data.action));
    });

    function setColorTheme(isDarkMode: boolean, isLowContrast: boolean) {
        if (settings === undefined) return;

        setSettings({
            ...settings,
            darkMode: isDarkMode,
            lowContrast: isLowContrast,
        });
        setAppColorTheme({ isDarkMode, isLowContrast });
    }

    function setUnlockedTime(value: string) {
        if (settings === undefined) return;

        // Filter out non-numeric characters
        const digits = Number(value.replace(/[^0-9]/g, ''))

        setSettings({
            ...settings,
            unlockedTime: digits
        });
    }

    async function saveSettings() {
        if (hasChanged === false || settings === undefined) return;

        if (settings.unlockedTime < MIN_UNLOCKED_SECONDS) {
            alert(`Unlocked time must be at least ${MIN_UNLOCKED_SECONDS} seconds`);
            return;
        }
        if (settings.unlockedTime > MAX_UNLOCKED_SECONDS) {
            alert(`Unlocked time must be at most ${MAX_UNLOCKED_SECONDS} seconds`);
            return;
        }
        try {
            await saveSettingsAsync(settings);
            setSavedSetings(settings);
        } catch (err) {
            showErrorDialog(err);
        }
    }

    if (settings === undefined) {
        return <Loading message='Loading settings...' />
    }

    return (
        <View style={styles.app}>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <AppText style={styles.settingsHeader}>Settings</AppText>
            </View>

            <View style={styles.settingsRowContainer}>
                <DarkModeRow
                    darkMode={settings.darkMode}
                    lowContrast={settings.lowContrast}
                    setColorTheme={setColorTheme}/>

                <UnlockedTimeRow
                    setUnlockedTime={setUnlockedTime}
                    unlockedTime={settings.unlockedTime} />

                <ResetPinRow
                    navigateAway={() => navigation.navigate('ResetPin')} />

                <DataRow />

                <SaveRow wasChanged={hasChanged} saveSettings={saveSettings} />
            </View>
        </View>
    )
}


// Definitions for sub-components

interface DarkModeRowProps {
    darkMode: boolean,
    lowContrast: boolean,
    setColorTheme: (darkMode: boolean, lowContrast: boolean) => void
}

function DarkModeRow(props: DarkModeRowProps) {
    const { styles } = useStyles();

    function toggleDarkMode(value: boolean) {
        props.setColorTheme(value, props.lowContrast);
    }

    function toggleLowContrast(value: boolean) {
        props.setColorTheme(props.darkMode, value);
    }

    return (<>
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>Dark Mode:</AppText>
            <Switch 
                onValueChange={toggleDarkMode}
                value={props.darkMode} />
        </View>
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>Low Contrast:</AppText>
            <Switch 
                onValueChange={toggleLowContrast}
                value={props.lowContrast} />
        </View>
    </>)
}


interface UnlockedTimeRowProps {
    unlockedTime: number,
    setUnlockedTime: (value: string) => void
}

function UnlockedTimeRow(props: UnlockedTimeRowProps) {
    const { styles, colorTheme } = useStyles();

    return (
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>
                Unlocked Time (seconds):
            </AppText>

            <TextInput 
                keyboardType='number-pad'
                style={styles.settingsTextInput}
                onChangeText={props.setUnlockedTime}
                value={props.unlockedTime.toString()}
                placeholderTextColor={colorTheme.placeholder} />

        </View>
    )
}


interface ResetPinRowProps { navigateAway: () => void }

function ResetPinRow(props: ResetPinRowProps) {
    const { styles } = useStyles();

    return (
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>PIN</AppText>
            <AppButton onPress={props.navigateAway}>
                Reset
            </AppButton>
        </View>
    )
}

function DataRow() {
    const { styles } = useStyles();

    function onExportPress() {
        const cancelBtn: AlertButton = { text: "Cancel", style: "cancel" };
        const okBtn: AlertButton = {
            text: "Ok",
            onPress: onExportConfirm
        };

        Alert.alert(
            "Export all notes?",
            "This will copy all encrypted note files"
            + " into the directory that you choose.",
            [cancelBtn, okBtn]
        );
    }

    async function onExportConfirm() {
        try {
            const success = await exportAllNotes();

            if (success) {
                Alert.alert('Success!', `All notes successfully exported.`);
            } else {
                Alert.alert(
                    'Operation Cancelled',
                    'Access to file storage was denied.'
                );
            }
        } catch (err) {
            showErrorDialog(err);
        }
    }

    return (
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>App Data</AppText>
            <AppButton onPress={onExportPress}>
                Export All Notes
            </AppButton>
        </View>
    )
}


interface SaveRowProps {
    wasChanged: boolean,
    saveSettings: () => void
}

function SaveRow(props: SaveRowProps) {
    const { styles } = useStyles();

    return (
        <View style={styles.settingsRow}>
            <AppButton
                disabled={!props.wasChanged} onPress={props.saveSettings}
            >Save</AppButton>

        {props.wasChanged &&
            <AppText style={{color: 'red', textAlignVertical: 'center'}}>
                You have unsaved changes
            </AppText>
        }
        </View>
    )
}

// unused
function BottomRow() {
    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <AppText style={{textAlign: 'center'}}>
                Restart required to apply new changes
            </AppText>
        </View>
    )
}
