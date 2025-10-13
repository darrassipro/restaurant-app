import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '../store';
import { useGetCurrentUserQuery } from '../store/api/authApi';
import { selectIsAuthenticated, selectIsLoading, selectUser, setLoading } from '../store/slices/authSlice';

// Prevent auto-hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add any custom fonts here
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}

function RootLayoutContent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch();
  
  const { data, isLoading: isLoadingUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Just wait a bit to show the splash screen
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (isLoadingUser) return;
        dispatch(setLoading(false));
      } catch (error) {
        console.error('Error checking auth:', error);
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [isLoadingUser, dispatch]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null; // Keep showing splash screen
  }

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth routes
          <>
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/otp-verification" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/reset-password" options={{ headerShown: false }} />
          </>
        ) : (
          // Role-based routes
          <>
            {user?.role === 'customer' && (
              <Stack.Screen name="(customer)" options={{ headerShown: false }} />
            )}
            {user?.role === 'admin' && (
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            )}
            {user?.role === 'manager' && (
              <Stack.Screen name="(manager)" options={{ headerShown: false }} />
            )}
            {user?.role === 'chef' && (
              <Stack.Screen name="(chef)" options={{ headerShown: false }} />
            )}
          </>
        )}
      </Stack>
    </View>
  );
}