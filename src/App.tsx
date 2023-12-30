import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import Pin from './pages/Pin';
import colors from './assets/colors';

export default function App() {
  return (
    <View style={styles.container}>
      <Pin />
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
