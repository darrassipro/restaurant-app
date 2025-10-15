// app/_layout.tsx
import { useFonts } from 'expo-font';
import { Redirect, SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import '../global.css';
import { store } from '../store';
import { useGetCurrentUserQuery } from '../store/api/authApi';
import { selectIsAuthenticated, selectIsLoading, selectUser, setLoading } from '../store/slices/authSlice';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});

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
    return null;
  }

  // Determine redirect path
  const getRedirectPath = () => {
    if (!isAuthenticated) return '/(auth)/login';
    if (!user) return '/(auth)/login';
    
    switch (user.role) {
      case 'customer':
        return '/(customer)/home';
      case 'admin':
        return '/(admin)/dashboard';
      case 'manager':
        return '/(manager)/dashboard';
      case 'chef':
        return '/(chef)/kitchen';
      default:
        return '/(auth)/login';
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/register" />
            <Stack.Screen name="(auth)/forgot-password" />
            <Stack.Screen name="(auth)/otp-verification" />
            <Stack.Screen name="(auth)/reset-password" />
          </>
        ) : (
          <>
            {user?.role === 'customer' && <Stack.Screen name="(customer)" />}
            {user?.role === 'admin' && <Stack.Screen name="(admin)" />}
            {user?.role === 'manager' && <Stack.Screen name="(manager)" />}
            {user?.role === 'chef' && <Stack.Screen name="(chef)" />}
          </>
        )}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <Redirect href={getRedirectPath()} />
    </View>
  );
}