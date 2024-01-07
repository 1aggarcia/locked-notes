import { Button, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../components/AppText";
import styles from "../modules/styles";
import { Params } from "../windows/Unlocked";

export default function Settings({ route, navigation }: NativeStackScreenProps<Params>) {
    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={{fontSize: 25}}>Settings</AppText>
            <Button title='Go to ResetPin' onPress={() => navigation.navigate('ResetPin')}/>
        </View>
    )
}