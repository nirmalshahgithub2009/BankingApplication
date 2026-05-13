/**
 * Navigation Configuration
 * Centralized configuration for navigation themes, animations, and defaults
 */

import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const NavigationConfig = {
  // Theme configuration
  themes: {
    light: {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: '#007AFF',
        background: '#FFFFFF',
        card: '#F2F2F7',
        text: '#000000',
        border: '#E5E5EA',
        notification: '#FF3B30',
      },
    },
    dark: {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: '#0A84FF',
        background: '#000000',
        card: '#1C1C1E',
        text: '#FFFFFF',
        border: '#38383A',
        notification: '#FF453A',
      },
    },
  },

  // Stack navigator defaults
  screenOptions: {
    headerShown: true,
    animationEnabled: true,
    cardStyle: { backgroundColor: 'transparent' },
  },

  // Tab navigator defaults
  tabOptions: {
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#8E8E93',
    tabBarStyle: {
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
      backgroundColor: '#FFFFFF',
      paddingBottom: 5,
      height: 60,
    },
  },

  // Animation configs
  animations: {
    slideFromRight: {
      gestureDirection: 'horizontal' as const,
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 300 } },
        close: { animation: 'timing', config: { duration: 300 } },
      },
    },
    fadeFromCenter: {
      animationEnabled: true,
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 300 } },
        close: { animation: 'timing', config: { duration: 200 } },
      },
    },
  },
};

export const TAB_ROUTES = {
  HOME: 'Home',
  ACCOUNTS: 'Accounts',
  PAYMENTS: 'Payments',
  PROFILE: 'Profile',
} as const;

export const APP_ROUTES = {
  MAIN_TABS: 'MainTabs',
  ACCOUNT_DETAILS: 'AccountDetails',
  TRANSACTION_DETAILS: 'TransactionDetails',
  PAYMENT_FORM: 'PaymentForm',
} as const;

export const AUTH_ROUTES = {
  LOGIN: 'Login',
} as const;

export const ROOT_ROUTES = {
  AUTH: 'Auth',
  APP: 'App',
  SPLASH: 'Splash',
} as const;
