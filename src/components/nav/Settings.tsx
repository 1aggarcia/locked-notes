import { Button, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../common/AppText";
import { setColorTheme, getStyles } from "../../util/services/styles";
import { Params } from "../screens/Unlocked";

export default function Settings({ navigation }: NativeStackScreenProps<Params>) {
    return (
        <View style={[getStyles().app, getStyles().centered]}>
            <AppText style={{fontSize: 25}}>Settings</AppText>
            <Button title='Set theme to Random Colors' onPress={() => setColorTheme('Random Colors')} />
            <Button title='Set theme to Dark Mode' onPress={() => setColorTheme('Dark Mode')} />
            <Button title='Go to ResetPin' onPress={() => navigation.navigate('ResetPin')}/>
        </View>
    )
}