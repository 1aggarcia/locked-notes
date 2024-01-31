import { useState, useEffect } from 'react';
import {
    Button,
    View,
    Switch,
    TextInput,
    TouchableOpacity
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { getSettingsAsync, saveSettingsAsync } from '../../util/services/securestore';
import showErrorDialog from '../../util/error';
import Styles from '../../util/services/styles';
import SettingsType from '../../util/types/settings';

import AppText from "../common/AppText";
import { Params } from "../screens/Unlocked";
import Loading from '../screens/Loading';

const minUnlockedTime = 60;
const maxUnlockedTime = 3600;

export default function Settings({ navigation }: NativeStackScreenProps<Params>) {
    const [wasChanged, setWasChanged] = useState(false);
    const [settings, setSettings] = useState<SettingsType>();

    const styles = Styles.get();

    function setDarkMode(value: boolean) {
        if (settings === undefined)
            return;

        setWasChanged(true);
        setSettings({
            ...settings,
            useDarkMode: value
        });
    }

    function setUnlockedTime(value: string) {
        if (settings === undefined)
            return;
    
        // Filter out non-numeric characters
        const digits = Number(value.replace(/[^0-9]/g, ''))

        setWasChanged(true);
        setSettings({
            ...settings,
            unlockedTime: digits
        });
    }

    function saveSettings() {
        if (wasChanged === false || settings === undefined)
            return;
    
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

    // Load settings from disk
    useEffect(() => {
        getSettingsAsync()
            .then(setSettings)
            .catch(showErrorDialog)
    }, [])

    if (settings === undefined)
        return <Loading message='Loading settings...' />

    // This is way too big, break it up
    return (
        <View style={[styles.app]}>
            <AppText style={styles.settingsHeader}>Settings</AppText>
            <View style={styles.settingsRow}>
                <AppText style={styles.settingsText}>Use dark mode:</AppText>
                <Switch 
                    onValueChange={setDarkMode}
                    value={settings.useDarkMode}
                />
            </View>
            <View style={styles.settingsRow}>
                <AppText style={styles.settingsText}>
                    Unlocked Time (seconds):
                </AppText>
                <TextInput 
                    keyboardType='number-pad'
                    style={styles.settingsTextInput}
                    placeholderTextColor={Styles.getColorTheme().placeholder}
                    onChangeText={setUnlockedTime}
                    value={settings.unlockedTime.toString()}
                />
            </View>
            <View style={styles.settingsRow}>
                <AppText style={styles.settingsText}>PIN</AppText>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ResetPin')}
                    style={styles.settingsButton}
                >
                    <AppText style={styles.settingsButtonText}>
                        Reset
                    </AppText>
                </TouchableOpacity>
            </View>
            <View style={styles.settingsRow}>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={saveSettings}
                    disabled={!wasChanged}
                >
                    <AppText style={styles.settingsButtonText}>
                        Save
                    </AppText>
                </TouchableOpacity>
            {wasChanged &&
                <AppText style={{color: 'red', textAlign: 'center'}}>
                    You have unsaved changes
                </AppText>
            }
            </View>
        </View>
    )
}