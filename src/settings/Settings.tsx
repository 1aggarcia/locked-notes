import isEqual from 'lodash.isequal';
import { useState, useEffect } from 'react';
import { View, Switch, TextInput, Alert, AlertButton } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { 
    getSettingsAsync,
    saveSettingsAsync 
} from '../shared/services/securestore';
import showErrorDialog from '../shared/util/error';
import {
    useSetColorTheme,
    useSetLanguage,
    useStyles,
    useTranslation
} from '../shared/contexts/settingsContext';
import SettingsType from './types';

import AppText from "../shared/components/AppText";
import Loading from '../layout/Loading';
import AppButton from '../shared/components/AppButton';
import { Params } from "../access/Unlocked";
import { exportAllNotes } from '../notes/storage/android';
import { usePreventRemove } from '@react-navigation/native';
import { SettingsText } from './settingsText';
import { CommonText } from '../shared/commonText';
import { LANGUAGE_NAMES, SupportedLanguage } from '../shared/services/translator';
import { LanguageDropdown } from './components/LanguageDropdown';

const MIN_UNLOCKED_SECONDS = 60;
const MAX_UNLOCKED_SECONDS = 3600;

export default function Settings(
    { navigation }: NativeStackScreenProps<Params, 'Settings'>)
{
    const [settings, setSettings] = useState<SettingsType>();
    const [savedSettings, setSavedSettings] = useState<SettingsType>();

    const { styles } = useStyles();
    const text = useTranslation(SettingsText);
    const setAppColorTheme = useSetColorTheme();
    const setAppLanguage = useSetLanguage();
    const hasChanged = !isEqual(settings, savedSettings);

    // Load settings from disk
    useEffect(() => {
        getSettingsAsync()
            .then(settings => {
                setAppColorTheme({
                    isDarkMode: settings.darkMode,
                    isLowContrast: settings.lowContrast
                });
                setAppLanguage(settings.language);
                setSettings(settings);
                setSavedSettings(settings);
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

    function setLanguage(language: SupportedLanguage) {
        if (settings === undefined) return;

        setSettings({
            ...settings,
            language: language
        });
        setAppLanguage(language);
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
            alert(text.unlockedTimeTooSmall(`${MIN_UNLOCKED_SECONDS}`));
            return;
        }
        if (settings.unlockedTime > MAX_UNLOCKED_SECONDS) {
            alert(text.unlockedTimeTooLarge(`${MAX_UNLOCKED_SECONDS}`));
            return;
        }
        try {
            await saveSettingsAsync(settings);
            setSavedSettings(settings);
        } catch (err) {
            showErrorDialog(err);
        }
    }

    if (settings === undefined) {
        return <Loading message={text.LOADING_SETTINGS} />
    }

    return (
        <View style={styles.app}>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <AppText style={styles.settingsHeader}>{text.SETTINGS}</AppText>
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

                <LanguageRow
                    currentLanguage={settings.language}
                    onLanguageChange={setLanguage} />

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
    const text = useTranslation(SettingsText);

    function toggleDarkMode(value: boolean) {
        props.setColorTheme(value, props.lowContrast);
    }

    function toggleLowContrast(value: boolean) {
        props.setColorTheme(props.darkMode, value);
    }

    return (<>
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>{text.DARK_MODE}</AppText>
            <Switch 
                onValueChange={toggleDarkMode}
                value={props.darkMode} />
        </View>
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>{text.LOW_CONTRAST}</AppText>
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
    const text = useTranslation(SettingsText);

    return (
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>
                {text.UNLOCKED_TIME}
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
    const text = useTranslation(SettingsText);

    return (
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>PIN</AppText>
            <AppButton onPress={props.navigateAway}>
                {text.RESET}
            </AppButton>
        </View>
    )
}

function LanguageRow(props: {
    currentLanguage: SupportedLanguage;
    onLanguageChange: (language: SupportedLanguage) => void;
}) {
    const text = useTranslation(SettingsText);
    const { styles } = useStyles();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>{text.LANGUAGE}</AppText>
            <AppButton onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                {LANGUAGE_NAMES[props.currentLanguage]}
            </AppButton>
            <LanguageDropdown
                isOpen={isDropdownOpen}
                selectedLanguage={props.currentLanguage}
                onLanguageChange={props.onLanguageChange}
                onClose={() => setIsDropdownOpen(false)}
            />
        </View>
    );
}

function DataRow() {
    const { styles } = useStyles();
    const text = useTranslation(SettingsText);
    const commonText = useTranslation(CommonText);

    function onExportPress() {
        const cancelBtn: AlertButton = {
            text: commonText.CANCEL,
            style: "cancel"
        };
        const okBtn: AlertButton = {
            text: "Ok",
            onPress: onExportConfirm
        };
        Alert.alert(
            text.EXPORT_CONFIRMATION_TITLE,
            text.EXPORT_CONFIRMATION_MESSAGE,
            [cancelBtn, okBtn]
        );
    }

    async function onExportConfirm() {
        try {
            const success = await exportAllNotes();

            if (success) {
                Alert.alert(commonText.SUCCESS, text.ALL_NOTES_EXPORTED);
            } else {
                Alert.alert(
                    commonText.OPERATION_CANCELLED,
                    commonText.ACCESS_DENIED,
                );
            }
        } catch (err) {
            showErrorDialog(err);
        }
    }

    return (
        <View style={styles.settingsRow}>
            <AppText style={styles.settingsText}>{text.APP_DATA}</AppText>
            <AppButton onPress={onExportPress}>
                {text.EXPORT_ALL_NOTES}
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
    const text = useTranslation(SettingsText);

    return (
        <View style={styles.settingsRow}>
            <AppButton
                disabled={!props.wasChanged} onPress={props.saveSettings}
            >{text.SAVE}</AppButton>

        {props.wasChanged &&
            <AppText style={{color: 'red', textAlignVertical: 'center'}}>
                {text.UNSAVED_CHANGES}
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
