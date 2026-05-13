import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import type { AppTabsParamList, AppStackParamList } from './types';
import { APP_ROUTES, APP_STACK_ROUTES, NavigationConfig } from './config';

// Create placeholder screen components (to be imported from features)
const HomeScreen = () => null;
const AccountsScreen = () => null;
const PaymentsScreen = () => null;
const ProfileScreen = () => null;

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppTabsParamList>();

/**
 * Home Tab Stack
 */
const HomeTabStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={APP_STACK_ROUTES.HOME_SCREEN}
    >
      <Stack.Screen
        name={APP_STACK_ROUTES.HOME_SCREEN}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={APP_STACK_ROUTES.TRANSACTION_DETAILS}
        component={HomeScreen}
        options={{ title: 'Transaction Details' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Accounts Tab Stack
 */
const AccountsTabStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={APP_STACK_ROUTES.ACCOUNTS_SCREEN}
    >
      <Stack.Screen
        name={APP_STACK_ROUTES.ACCOUNTS_SCREEN}
        component={AccountsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={APP_STACK_ROUTES.ACCOUNT_DETAILS}
        component={HomeScreen}
        options={{ title: 'Account Details' }}
      />
    </Stack.Navigator>
  );
};

/**
 * Payments Tab Stack
 */
const PaymentsTabStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={APP_STACK_ROUTES.PAYMENTS_SCREEN}
    >
      <Stack.Screen
        name={APP_STACK_ROUTES.PAYMENTS_SCREEN}
        component={PaymentsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

/**
 * Profile Tab Stack
 */
const ProfileTabStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={APP_STACK_ROUTES.PROFILE_SCREEN}
    >
      <Stack.Screen
        name={APP_STACK_ROUTES.PROFILE_SCREEN}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={APP_STACK_ROUTES.SETTINGS}
        component={HomeScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

/**
 * App Navigator
 * Main app navigation with bottom tab navigator
 */
const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let label = '';

          if (route.name === APP_ROUTES.HOME) {
            label = focused ? '🏠' : '🏠';
          } else if (route.name === APP_ROUTES.ACCOUNTS) {
            label = focused ? '💳' : '💳';
          } else if (route.name === APP_ROUTES.PAYMENTS) {
            label = focused ? '💰' : '💰';
          } else if (route.name === APP_ROUTES.PROFILE) {
            label = focused ? '👤' : '👤';
          }

          return <Text style={{ fontSize: 20, color }}>{label}</Text>;
        },
        tabBarActiveTintColor: NavigationConfig.themes.light.colors.primary,
        tabBarInactiveTintColor: '#999999',
        tabBarLabelPosition: 'below-icon',
      })}
      initialRouteName={APP_ROUTES.HOME}
    >
      <Tab.Screen
        name={APP_ROUTES.HOME}
        component={HomeTabStack}
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={APP_ROUTES.ACCOUNTS}
        component={AccountsTabStack}
        options={{
          title: 'Accounts',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={APP_ROUTES.PAYMENTS}
        component={PaymentsTabStack}
        options={{
          title: 'Payments',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={APP_ROUTES.PROFILE}
        component={ProfileTabStack}
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
