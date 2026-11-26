import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { WellnessProvider } from './src/context/WellnessContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialMode="light">
        <AuthProvider>
          <WellnessProvider>
            <AppNavigator />
          </WellnessProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
