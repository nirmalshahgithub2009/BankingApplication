import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from './types';
import { AUTH_ROUTES } from './config';
import LoginScreen from '@features/auth/screens/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Auth Navigator
 * Handles authentication flow with login screen
 */
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName={AUTH_ROUTES.LOGIN}
    >
      <Stack.Screen
        name={AUTH_ROUTES.LOGIN}
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
