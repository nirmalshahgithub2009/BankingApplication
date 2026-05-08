/**
 * Navigation Module Index
 * Exports all navigation-related components and types
 */

export { default as RootNavigator, AuthContext } from './RootNavigator';
export { default as AppNavigator } from './AppNavigator';
export { default as AuthNavigator } from './AuthNavigator';

export type {
  AuthStackParamList,
  AppStackParamList,
  AppTabsParamList,
  RootStackParamList,
  AuthScreenProps,
  AppStackScreenProps,
  AppTabsScreenProps,
  RootStackScreenProps,
} from './types';

export { NavigationConfig, TAB_ROUTES, APP_ROUTES, AUTH_ROUTES, ROOT_ROUTES } from './config';
