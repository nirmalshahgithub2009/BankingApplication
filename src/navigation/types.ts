/**
 * Navigation Types
 * Defines all navigation params and stack types for the app
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// Auth Stack Params
export type AuthStackParamList = {
  Login: undefined;
};

// App Stack Params (Main App Tabs)
export type AppTabsParamList = {
  Home: undefined;
  Accounts: undefined;
  Payments: undefined;
  Profile: undefined;
};

// App Stack Params (Navigator)
export type AppStackParamList = {
  MainTabs: undefined;
  AccountDetails: { accountId: string };
  TransactionDetails: { transactionId: string };
  PaymentForm: undefined;
};

// Root Stack Params
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  Splash: undefined;
};

// Screen Props Types

// Auth Navigation Props
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

// App Tabs Navigation Props
export type AppTabsScreenProps<T extends keyof AppTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<AppTabsParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>;

// App Stack Navigation Props
export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>;

// Root Navigation Props
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// Extend navigation prop for better typing
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
