import { useState, useEffect } from 'react';
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

  // Countdown until reaching 0 seconds
  useEffect(() => {
    setTimeout(() => {
      if (openTime > 0) {
        setOpenTime(openTime - 1);
      }
    }, 1000)
  });

  return (
    <View style={styles.container}>
      <StatusBar />
      {
        openTime > 0?
        <Unlocked page='Note' openTime={openTime}/>
        :
        <Pin unlock={() => setOpenTime(maxTime)}/>
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
