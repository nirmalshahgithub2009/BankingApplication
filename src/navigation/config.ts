import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

// Route Constants
export const ROOT_ROUTES = {
  SPLASH: 'Splash',
  AUTH: 'Auth',
  APP: 'App',
} as const;

export const AUTH_ROUTES = {
  LOGIN: 'Login',
} as const;

export const APP_ROUTES = {
  HOME: 'Home',
  ACCOUNTS: 'Accounts',
  PAYMENTS: 'Payments',
  PROFILE: 'Profile',
} as const;

export const APP_STACK_ROUTES = {
  HOME_SCREEN: 'HomeScreen',
  ACCOUNTS_SCREEN: 'AccountsScreen',
  PAYMENTS_SCREEN: 'PaymentsScreen',
  PROFILE_SCREEN: 'ProfileScreen',
  ACCOUNT_DETAILS: 'AccountDetails',
  TRANSACTION_DETAILS: 'TransactionDetails',
  SETTINGS: 'Settings',
} as const;

// Custom Theme
const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    background: '#FFFFFF',
    card: '#F9F9F9',
    text: '#000000',
    border: '#E8E8E8',
    notification: '#FF3B30',
  },
};

const DarkCustomTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#0A84FF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#3A3A3C',
    notification: '#FF453A',
  },
};

// Navigation Configuration
export const NavigationConfig = {
  themes: {
    light: LightTheme,
    dark: DarkCustomTheme,
  },

  // Screen options
  screenOptions: {
    headerShown: false,
    animationEnabled: Platform.OS === 'android',
  },

  // Tab bar options
  tabBarOptions: {
    activeTintColor: '#007AFF',
    inactiveTintColor: '#999999',
    showLabel: true,
    style: {
      backgroundColor: '#FFFFFF',
      borderTopColor: '#E8E8E8',
      borderTopWidth: 1,
      paddingBottom: Platform.OS === 'ios' ? 0 : 8,
    },
  },

  // Animation configurations
  animations: {
    slideFromRight: {
      gestureEnabled: true,
      animationEnabled: true,
    },
    fadeFromCenter: {
      gestureEnabled: false,
      animationEnabled: true,
    },
  },
};
