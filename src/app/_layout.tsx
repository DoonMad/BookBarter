import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import RequestProvider from '../contexts/RequestProvider';

import { useColorScheme } from '@/src/components/useColorScheme';

import "@/src/global.css"
import AuthProvider, { useAuth } from '../contexts/AuthProvider';
import { ActivityIndicator } from 'react-native-paper';
import QueryProvider from '../contexts/QueryProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  // const {session, sessionLoading} = useAuth();
  // if(sessionLoading){
  //   return <ActivityIndicator />
  // }
  // if(session){
  //   return <Redirect href={'/(auth)/SignIn'} />
  // }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <QueryProvider>
          <RequestProvider>
            <Stack>
              <Stack.Screen name="index"/>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </RequestProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
