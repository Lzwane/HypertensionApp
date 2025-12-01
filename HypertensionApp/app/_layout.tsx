import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import 'react-native-reanimated';
import { SessionProvider, useSession } from './ctx';

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
  // 1. Get the Firebase User object
  const { user, isLoading } = useSession();
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

  // 2. Auth Protection Logic
  useEffect(() => {
    if (isLoading) return;

    // Check which group we are in
    const inTabsGroup = segments[0] === '(tabs)';
    
    // EXPLICIT TYPE CASTING to fix TypeScript errors with segments
    const segmentStr = segments[0] as string | undefined; 
    const inAuthGroup = segmentStr === 'login' || segmentStr === 'signup';

    if (!user && inTabsGroup) {
      // Not logged in -> Go to Login
      router.replace('/login' as Href);
    } else if (user && inAuthGroup) {
      // Logged in but on Login page -> Go to Home
      router.replace('/(tabs)' as Href);
    }
  }, [user, isLoading, segments]);

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
        <Stack.Screen name="symptom-log" options={{ presentation: 'modal', headerShown: false }} />
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