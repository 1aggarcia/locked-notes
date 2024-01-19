import { Button, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import AppText from "../common/AppText";
import styles from "../../util/services/styles";
import { Params } from "../screens/Unlocked";

export default function Settings({ navigation }: NativeStackScreenProps<Params>) {
    return (
        <View style={[styles.app, styles.centered]}>
            <AppText style={{fontSize: 25}}>Settings</AppText>
            <Button title='Go to ResetPin' onPress={() => navigation.navigate('ResetPin')}/>
        </View>
    )
}