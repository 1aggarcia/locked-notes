import { useState, useEffect } from 'react';
import { View, Switch, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { 
    getSettingsAsync,
    saveSettingsAsync 
} from '../../util/services/securestore';
import showErrorDialog from '../../util/error';
import Styles from '../../util/services/styles';
import SettingsType from '../../util/types/settings';

import AppText from "../common/AppText";
import Loading from '../screens/Loading';
import AppButton from '../common/AppButton';
import { Params } from "../screens/Unlocked";

const minUnlockedTime = 60;
const maxUnlockedTime = 3600;

export default function Settings(
    { navigation }: NativeStackScreenProps<Params>)
{
    const styles = Styles.get();

    const [wasChanged, setWasChanged] = useState(false);
    const [settings, setSettings] = useState<SettingsType>();

    // Load settings from disk
    useEffect(() => {
        getSettingsAsync()
            .then(setSettings)
            .catch(showErrorDialog)
    }, [])

    function setDarkMode(value: boolean) {
        if (settings === undefined) return;

        setWasChanged(true);
        setSettings({
            ...settings,
            useDarkMode: value
        });
    }

    function setUnlockedTime(value: string) {
        if (settings === undefined) return;

        // Filter out non-numeric characters
        const digits = Number(value.replace(/[^0-9]/g, ''))

        setWasChanged(true);
        setSettings({
            ...settings,
            unlockedTime: digits
        });
    }

    function saveSettings() {
        if (wasChanged === false || settings === undefined) return;

        if (settings.unlockedTime < minUnlockedTime) {
            alert(`Unlocked time must be at least ${minUnlockedTime} seconds`);
            return;
        }
        if (settings.unlockedTime > maxUnlockedTime) {
            alert(`Unlocked time must be at most ${maxUnlockedTime} seconds`);
            return;
        }
        saveSettingsAsync(settings)
            .then(() => setWasChanged(false))
            .catch(showErrorDialog);
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
                    useDarkMode={settings.useDarkMode} setDarkMode={setDarkMode}/>

                <UnlockedTimeRow
                    setUnlockedTime={setUnlockedTime}
                    unlockedTime={settings.unlockedTime} />

                <ResetPinRow
                    navigateAway={() => navigation.navigate('ResetPin')}/>

                <SaveRow wasChanged={wasChanged} saveSettings={saveSettings} />
                <BottomRow />
            </View>
        </View>
    )
}


// Definitions for sub-components

interface DarkModeRowProps {
    useDarkMode: boolean,
    setDarkMode: (value: boolean) => void
}

function DarkModeRow(props: DarkModeRowProps) {
    const styles = Styles.get();

    return (
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>Use dark mode:</AppText>
            <Switch 
                onValueChange={props.setDarkMode}
                value={props.useDarkMode} />
        </View>
    )
}


interface UnlockedTimeRowProps {
    unlockedTime: number,
    setUnlockedTime: (value: string) => void
}

function UnlockedTimeRow(props: UnlockedTimeRowProps) {
    const styles = Styles.get();

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
                placeholderTextColor={Styles.getColorTheme().placeholder} />

        </View>
    )
}


interface ResetPinRowProps { navigateAway: () => void }

function ResetPinRow(props: ResetPinRowProps) {
    const styles = Styles.get();

    return (
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>PIN</AppText>
            <AppButton onPress={props.navigateAway}>
                Reset
            </AppButton>
        </View>
    )
}


interface SaveRowProps {
    wasChanged: boolean,
    saveSettings: () => void
}

function SaveRow(props: SaveRowProps) {
    const styles = Styles.get();

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


function BottomRow() {
    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <AppText style={{textAlign: 'center'}}>
                Restart required to apply new changes
            </AppText>
        </View>
    )
}
