/**
 * Root Navigator
 * Handles the main navigation between Auth and App states
 */

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import { ROOT_ROUTES, NavigationConfig } from './config';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '@features/auth/screens/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AuthContextType {
  isSignedIn: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
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

  useEffect(() => {
    // Simulate token restoration (replace with actual auth check)
    const bootstrapAsync = async () => {
      try {
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // TODO: Replace with actual token retrieval logic
        // const userToken = await getStoredToken();
        // dispatch({ type: 'RESTORE_TOKEN', isSignedIn: !!userToken });

        dispatch({ type: 'RESTORE_TOKEN', isSignedIn: false });
      } catch (error) {
        console.error('Failed to restore token:', error);
        dispatch({ type: 'RESTORE_TOKEN', isSignedIn: false });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      isSignedIn: state.isSignedIn,
      isLoading: state.isLoading,
      signIn: async () => {
        try {
          // TODO: Replace with actual sign-in logic
          // const response = await api.login(credentials);
          // await saveToken(response.token);
          dispatch({ type: 'SIGN_IN' });
        } catch (error) {
          console.error('Sign in failed:', error);
          throw error;
        }
      },
      signOut: async () => {
        try {
          // TODO: Replace with actual sign-out logic
          // await clearToken();
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
            animationEnabled: false,
          }}
          initialRouteName={state.isSignedIn ? ROOT_ROUTES.APP : ROOT_ROUTES.AUTH}
        >
          {state.isSignedIn ? (
            <Stack.Screen
              name={ROOT_ROUTES.APP}
              component={AppNavigator}
              options={{
                animationEnabled: false,
              }}
            />
          ) : (
            <Stack.Screen
              name={ROOT_ROUTES.AUTH}
              component={AuthNavigator}
              options={{
                animationEnabled: false,
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
