import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import Pin from './pages/Pin';
import colors from './assets/colors';
import EditNote from './pages/EditNote';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Pin /> */}
      <EditNote title='The Title' body='the note body'/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
