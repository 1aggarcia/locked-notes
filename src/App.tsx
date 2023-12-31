import { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View
} from 'react-native';

import Pin from './pages/Pin';
import colors from './assets/colors';
import Unlocked from './components/Unlocked';

// Max Time app can be open, in seconds. Should be less than 60 minutes
const maxTime = 300;

export default function App() {
  const [openTime, setOpenTime] = useState(maxTime);

  return (
    <View style={styles.container}>
      <StatusBar />
      {
        openTime > 0?
        <Unlocked page='Note' openTime={openTime}/>
        :
        <Pin />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
  },
});
