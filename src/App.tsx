import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from './shared/contexts/settingsContext';
import { LoginProvider } from './shared/contexts/loginContext';
import AppLayout from './layout/AppLayout';
import AppStatusBar from './layout/AppStatusBar';

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <LoginProvider>

          <AppLayout />
          <AppStatusBar />

        </LoginProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  )
}
