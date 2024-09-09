import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StylesProvider } from './shared/contexts/stylesContext';
import { LoginProvider } from './shared/contexts/loginContext';
import AppLayout from './layout/AppLayout';
import AppStatusBar from './layout/AppStatusBar';

export default function App() {
  return (
    <SafeAreaProvider>
      <StylesProvider>
        <LoginProvider>

          <AppLayout />
          <AppStatusBar />

        </LoginProvider>
      </StylesProvider>
    </SafeAreaProvider>
  )
}
