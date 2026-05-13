import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
};

// App Tabs
export type AppTabsParamList = {
  Home: undefined;
  Accounts: undefined;
  Payments: undefined;
  Profile: undefined;
};

// App Stack (nested under each tab)
export type AppStackParamList = {
  HomeScreen: undefined;
  AccountsScreen: undefined;
  PaymentsScreen: undefined;
  ProfileScreen: undefined;
  AccountDetails: { accountId: string };
  TransactionDetails: { transactionId: string };
  Settings: undefined;
};

// Root Stack
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};

// Screen Props Types
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type AppTabsScreenProps<T extends keyof AppTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<AppTabsParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type AppStackScreenProps<T extends keyof AppStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AppStackParamList, T>,
  BottomTabScreenProps<AppTabsParamList>
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
