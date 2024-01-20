import { useState, useEffect } from 'react';
import { Button, View, Switch } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../common/AppText";
import { getStyles } from "../../util/services/styles";
import { Params } from "../screens/Unlocked";
import { getSettingsAsync, saveSettingsAsync } from '../../util/services/files';

export default function Settings({ navigation }: NativeStackScreenProps<Params>) {
    const [darkMode, setDarkMode] = useState(false);

    async function saveSettings() {
        const settings = await getSettingsAsync();

        settings.useDarkMode = darkMode;
        await saveSettingsAsync(settings);
        console.log('settings saved:', settings);
    }

    return (
        <View style={[getStyles().app, getStyles().centered]}>
            <AppText style={{fontSize: 25}}>Settings</AppText>
            <Switch onValueChange={setDarkMode} value={darkMode} />
            <Button title='Go to ResetPin' onPress={() => navigation.navigate('ResetPin')}/>
            <Button title='Save' onPress={saveSettings} />
        </View>
    )
}