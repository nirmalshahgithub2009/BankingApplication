/**
 * Auth Navigator
 * Handles authentication flow (Login and other auth screens)
 */

import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from './types';
import { AUTH_ROUTES, NavigationConfig } from './config';
import LoginScreen from '@features/auth/screens/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...NavigationConfig.screenOptions,
        headerShown: false,
        animationEnabled: false,
      }}
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
