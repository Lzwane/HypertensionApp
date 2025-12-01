import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import 'react-native-reanimated';
import { SessionProvider, useSession } from './ctx'; // Import the session provider

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Auth Protection Logic
  useEffect(() => {
    if (isLoading) return;

    // Check if the user is in the (tabs) group
    const inTabsGroup = segments[0] === '(tabs)';

    if (!session && inTabsGroup) {
      // If not logged in and trying to access tabs, go to login
      router.replace('/login' as Href);
    } else if (session && !inTabsGroup) {
      // If logged in and on login page, go to home
      // Check if we are specifically on login or signup to redirect
      // Otherwise we might redirect loop if we are on a modal or something
      // FIX: Cast segments[0] to string to avoid type overlap errors
      const currentSegment = segments[0] as string;
      // Using (segments as string[]).length to satisfy TS
      const isRoot = (segments as string[]).length === 0;
      
      if (currentSegment === 'login' || currentSegment === 'signup' || isRoot) {
         router.replace('/(tabs)' as Href);
      }
    }
  }, [session, isLoading, segments]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="bp-log" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="food-log" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="add-med" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="quiz" options={{ headerShown: false }} />
        <Stack.Screen name="pharmacy" options={{ headerShown: false }} />
        <Stack.Screen name="report" options={{ headerShown: false }} />
        <Stack.Screen name="emergency" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}