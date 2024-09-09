import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StylesProvider } from './contexts/stylesContext';
import { LoginProvider } from './contexts/loginContext';
import Authenticator from './components/screens/Authenticator';
import AppStatusBar from './components/shared/AppStatusBar';

export default function App() {
  return (
    <SafeAreaProvider>
      <StylesProvider>
        <LoginProvider>

          <Authenticator />
          <AppStatusBar />

        </LoginProvider>
      </StylesProvider>
    </SafeAreaProvider>
  )
}
