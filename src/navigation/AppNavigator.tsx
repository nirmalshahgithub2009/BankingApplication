/**
 * App Navigator
 * Main app navigation with bottom tabs and stack-based navigation within each tab
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import type { AppStackParamList, AppTabsParamList } from './types';
import { APP_ROUTES, TAB_ROUTES, NavigationConfig } from './config';

// Tab Screens
import HomeScreen from '@features/accounts/screens/HomeScreen';
import AccountsScreen from '@features/accounts/screens/AccountsScreen';
import PaymentsScreen from '@features/transactions/screens/PaymentsScreen';
import ProfileScreen from '@features/settings/screens/ProfileScreen';

// Additional Screens
import AccountDetailsScreen from '@features/accounts/screens/AccountDetailsScreen';
import TransactionDetailsScreen from '@features/transactions/screens/TransactionDetailsScreen';
import PaymentFormScreen from '@features/transactions/screens/PaymentFormScreen';

const AppStack = createNativeStackNavigator<AppStackParamList>();
const TabStack = createBottomTabNavigator<AppTabsParamList>();

/**
 * Home Tab Stack Navigator
 */
const HomeTabStack: React.FC = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        ...NavigationConfig.screenOptions,
        headerShown: true,
      }}
    >
      <AppStack.Screen
        name={TAB_ROUTES.HOME}
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={APP_ROUTES.TRANSACTION_DETAILS}
        component={TransactionDetailsScreen}
        options={{
          title: 'Transaction Details',
          headerShown: true,
        }}
      />
    </AppStack.Navigator>
  );
};

/**
 * Accounts Tab Stack Navigator
 */
const AccountsTabStack: React.FC = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        ...NavigationConfig.screenOptions,
        headerShown: true,
      }}
    >
      <AppStack.Screen
        name={TAB_ROUTES.ACCOUNTS}
        component={AccountsScreen}
        options={{
          title: 'Accounts',
          headerShown: true,
        }}
      />
      <AppStack.Screen
        name={APP_ROUTES.ACCOUNT_DETAILS}
        component={AccountDetailsScreen}
        options={{
          title: 'Account Details',
          headerShown: true,
        }}
      />
    </AppStack.Navigator>
  );
};

/**
 * Payments Tab Stack Navigator
 */
const PaymentsTabStack: React.FC = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        ...NavigationConfig.screenOptions,
        headerShown: true,
      }}
    >
      <AppStack.Screen
        name={TAB_ROUTES.PAYMENTS}
        component={PaymentsScreen}
        options={{
          title: 'Payments',
          headerShown: true,
        }}
      />
      <AppStack.Screen
        name={APP_ROUTES.PAYMENT_FORM}
        component={PaymentFormScreen}
        options={{
          title: 'New Payment',
          headerShown: true,
        }}
      />
    </AppStack.Navigator>
  );
};

/**
 * Profile Tab Stack Navigator
 */
const ProfileTabStack: React.FC = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        ...NavigationConfig.screenOptions,
        headerShown: true,
      }}
    >
      <AppStack.Screen
        name={TAB_ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
    </AppStack.Navigator>
  );
};

/**
 * Main App Navigator with Bottom Tabs
 */
const AppNavigator: React.FC = () => {
  return (
    <TabStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: NavigationConfig.themes.light.colors.primary,
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <TabStack.Screen
        name={TAB_ROUTES.HOME}
        component={HomeTabStack}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <TabStack.Screen
        name={TAB_ROUTES.ACCOUNTS}
        component={AccountsTabStack}
        options={{
          title: 'Accounts',
          tabBarLabel: 'Accounts',
          tabBarIcon: ({ color, size }) => <AccountsIcon color={color} size={size} />,
        }}
      />
      <TabStack.Screen
        name={TAB_ROUTES.PAYMENTS}
        component={PaymentsTabStack}
        options={{
          title: 'Payments',
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => <PaymentsIcon color={color} size={size} />,
        }}
      />
      <TabStack.Screen
        name={TAB_ROUTES.PROFILE}
        component={ProfileTabStack}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />,
        }}
      />
    </TabStack.Navigator>
  );
};

// Placeholder Icon Components (Replace with actual icons)
const HomeIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <TabIcon name="🏠" color={color} size={size} />
);

const AccountsIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <TabIcon name="💳" color={color} size={size} />
);

const PaymentsIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <TabIcon name="💰" color={color} size={size} />
);

const ProfileIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <TabIcon name="👤" color={color} size={size} />
);

// Simple text-based icon component (replace with react-native-vector-icons if needed)
const TabIcon: React.FC<{ name: string; color: string; size: number }> = ({ name, color, size }) =>
  null; // Icons will be handled differently - implement as needed

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 5,
    height: 60,
  },
});

export default AppNavigator;
