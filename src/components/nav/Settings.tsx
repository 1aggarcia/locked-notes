import { useState, useEffect } from 'react';
import { Button, View, Switch } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { getSettingsAsync, saveSettingsAsync } from '../../util/services/files';
import showErrorDialog from '../../util/error';
import { getStyles } from "../../util/services/styles";
import SettingsType from '../../util/types/settings';

import AppText from "../common/AppText";
import { Params } from "../screens/Unlocked";
import Loading from '../screens/Loading';

export default function Settings({ navigation }: NativeStackScreenProps<Params>) {
    const [wasChanged, setWasChanged] = useState(false);
    const [settings, setSettings] = useState<SettingsType>();

    function saveSettings() {
        if (wasChanged === false || settings === undefined)
            return;

        saveSettingsAsync(settings)
            .then(() => setWasChanged(false))
            .catch(showErrorDialog);
    }

    function setDarkMode(value: boolean) {
        if (settings === undefined)
            return;

        setWasChanged(true);
        setSettings({
            useDarkMode: value,
            unlockedTime: settings.unlockedTime
        });
    }

    // Load settings from disk
    useEffect(() => {
        getSettingsAsync()
            .then(setSettings)
            .catch(showErrorDialog)
    }, [])

    if (settings === undefined)
        return <Loading message='Loading settings...' />

    return (
        <View style={[getStyles().app, getStyles().centered]}>
            <AppText style={{fontSize: 25}}>Settings</AppText>
            <Switch onValueChange={setDarkMode} value={settings.useDarkMode} />
            <Button title='Go to ResetPin' onPress={() => navigation.navigate('ResetPin')}/>
            <Button title='Save' onPress={saveSettings} disabled={!wasChanged} />
        </View>
    )
}