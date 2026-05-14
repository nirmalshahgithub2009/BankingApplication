/**
 * Root Navigator
 * Handles the main navigation between Auth and App states
 */

import React, { useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import { ROOT_ROUTES, NavigationConfig } from './config';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '@features/auth/screens/SplashScreen';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@core/api-new';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AuthContextType {
  isSignedIn: boolean;
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Export for use in other parts of the app
export const AuthContext = React.createContext<AuthContextType>({
  isSignedIn: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

interface RootNavigatorProps {
  initialRoute?: keyof RootStackParamList;
}

const RootNavigator: React.FC<RootNavigatorProps> = ({ initialRoute = ROOT_ROUTES.SPLASH }) => {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            isSignedIn: action.isSignedIn,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignedIn: true,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignedIn: false,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignedIn: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Restore token on app startup
    const bootstrapAsync = async () => {
      try {
        // Simulate delay
        await new Promise<void>((resolve) => setTimeout(resolve, 1000));

        // TODO: Replace with actual token retrieval from secure storage
        // Example: const tokens = await SecureStorage.getTokens();
        // if (tokens?.accessToken) {
        //   setTokens(tokens);
        //   dispatch({ type: 'RESTORE_TOKEN', isSignedIn: true });
        // } else {
        //   dispatch({ type: 'RESTORE_TOKEN', isSignedIn: false });
        // }

        // For now, check if tokens already exist in memory
        const hasToken = getAccessToken() !== null;
        dispatch({ type: 'RESTORE_TOKEN', isSignedIn: hasToken });
      } catch (error) {
        console.error('Failed to restore token:', error);
        dispatch({ type: 'RESTORE_TOKEN', isSignedIn: false });
      }
    };

    bootstrapAsync().catch(console.error);
  }, []);

  const authContext = React.useMemo(
    () => ({
      isSignedIn: state.isSignedIn,
      isLoading: state.isLoading,
      signIn: async (accessToken: string, refreshToken: string) => {
        try {
          // Update token manager with new tokens
          setTokens({ accessToken, refreshToken });

          // TODO: Save tokens to secure storage
          // Example: await SecureStorage.setTokens({ accessToken, refreshToken });

          dispatch({ type: 'SIGN_IN' });
        } catch (error) {
          console.error('Sign in failed:', error);
          throw error;
        }
      },
      signOut: async () => {
        try {
          // Clear tokens from memory
          clearTokens();

          // TODO: Clear tokens from secure storage
          // Example: await SecureStorage.clearTokens();

          dispatch({ type: 'SIGN_OUT' });
        } catch (error) {
          console.error('Sign out failed:', error);
          throw error;
        }
      },
    }),
    [state]
  );

  if (state.isLoading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={NavigationConfig.themes.light}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={state.isSignedIn ? ROOT_ROUTES.APP : ROOT_ROUTES.AUTH}
        >
          {state.isSignedIn ? (
            <Stack.Screen
              name={ROOT_ROUTES.APP}
              component={AppNavigator}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <Stack.Screen
              name={ROOT_ROUTES.AUTH}
              component={AuthNavigator}
              options={{
                headerShown: false,
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default RootNavigator;
