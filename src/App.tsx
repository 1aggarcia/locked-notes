import {
  StatusBar,
  StyleSheet,
  View
} from 'react-native';

import Pin from './pages/Pin';
import colors from './assets/colors';
import Note from './pages/Note';

const newLines = 'top\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nas\nbottom'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar />
      {/* <ViewNote title='Títul' body={newLines}></ViewNote> */}
      <Note title='Título' body={newLines}/>
      {/* <Pin /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1,
  },
});
