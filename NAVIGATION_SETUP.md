# Navigation Implementation Guide for BankApp

## Overview

This document outlines the complete navigation implementation for the BankApp React Native project using React Navigation v6. The navigation layer is designed to be scalable, maintainable, and follows best practices for React Native navigation patterns.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Folder Structure](#folder-structure)
3. [Installation & Setup](#installation--setup)
4. [Navigation Stack Hierarchy](#navigation-stack-hierarchy)
5. [Key Components](#key-components)
6. [Type Definitions](#type-definitions)
7. [Configuration Details](#configuration-details)
8. [Adding New Screens](#adding-new-screens)
9. [Authentication Flow](#authentication-flow)
10. [Navigation Best Practices](#navigation-best-practices)

---

## Architecture Overview

The navigation architecture is built on a **three-tier stack structure**:

1. **Root Navigator** - Manages Auth vs App state (handles authentication)
2. **Auth Navigator** - Login and authentication screens
3. **App Navigator** - Main app with bottom tab navigation and nested stacks

```
Root Navigator
├── Auth Navigator (when not authenticated)
│   └── Login Screen
│
└── App Navigator (when authenticated)
    ├── Home Tab Stack
    │   ├── Home Screen
    │   └── Transaction Details Screen
    │
    ├── Accounts Tab Stack
    │   ├── Accounts Screen
    │   └── Account Details Screen
    │
    ├── Payments Tab Stack
    │   ├── Payments Screen
    │   └── Payment Form Screen
    │
    └── Profile Tab Stack
        └── Profile Screen
```

---

## Folder Structure

```
src/
├── navigation/
│   ├── index.ts                 # Navigation exports
│   ├── types.ts                 # TypeScript type definitions
│   ├── config.ts                # Navigation configuration
│   ├── RootNavigator.tsx        # Root navigation component
│   ├── AuthNavigator.tsx        # Auth flow navigation
│   └── AppNavigator.tsx         # Main app navigation with tabs
│
└── features/
    ├── auth/
    │   └── screens/
    │       ├── LoginScreen.tsx
    │       └── SplashScreen.tsx
    │
    ├── accounts/
    │   └── screens/
    │       ├── HomeScreen.tsx
    │       ├── AccountsScreen.tsx
    │       └── AccountDetailsScreen.tsx
    │
    ├── transactions/
    │   └── screens/
    │       ├── PaymentsScreen.tsx
    │       ├── TransactionDetailsScreen.tsx
    │       └── PaymentFormScreen.tsx
    │
    └── settings/
        └── screens/
            └── ProfileScreen.tsx
```

---

## Installation & Setup

### Step 1: Install Dependencies

React Navigation requires several peer dependencies:

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-gesture-handler
```

### Step 2: Update App.tsx

Wrap your app with `GestureHandlerRootView` and `SafeAreaProvider`:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@navigation';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
```

### Step 3: Verify TypeScript Configuration

Ensure path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@navigation/*": ["src/navigation/*"],
      "@features/*": ["src/features/*"]
    }
  }
}
```

---

## Navigation Stack Hierarchy

### Root Navigator

**File:** `src/navigation/RootNavigator.tsx`

- **Purpose:** Manages the main navigation state (authenticated vs not authenticated)
- **Screens:**
  - `Auth` - Shows when user is not signed in
  - `App` - Shows when user is signed in
  - `Splash` - Loading state during token restoration

**Key Features:**

- Provides `AuthContext` for app-wide access to auth functions
- Handles token restoration on app launch
- Automatically switches between Auth and App stacks based on `isSignedIn` state

```tsx
export const AuthContext = React.createContext<AuthContextType>({
  isSignedIn: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});
```

### Auth Navigator

**File:** `src/navigation/AuthNavigator.tsx`

- **Purpose:** Handles authentication-related screens
- **Screens:**
  - `Login` - User login form

**Features:**

- No header shown (full-screen experiences)
- Animation disabled for auth flows
- Can be extended with Sign Up, Password Reset, etc.

### App Navigator

**File:** `src/navigation/AppNavigator.tsx`

- **Purpose:** Main app navigation with bottom tab bar
- **Tabs:**
  1. **Home** - Dashboard with account overview
  2. **Accounts** - List of bank accounts
  3. **Payments** - Payment management
  4. **Profile** - User profile and settings

**Each Tab contains a Native Stack Navigator:**

```tsx
// Example: Home Tab Stack
<AppStack.Navigator>
  <AppStack.Screen name="Home" component={HomeScreen} />
  <AppStack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
</AppStack.Navigator>
```

This allows for nested navigation within each tab.

---

## Key Components

### 1. Navigation Types (`types.ts`)

Defines all TypeScript interfaces for type-safe navigation:

```tsx
export type AuthStackParamList = {
  Login: undefined;
};

export type AppTabsParamList = {
  Home: undefined;
  Accounts: undefined;
  Payments: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  AccountDetails: { accountId: string };
  TransactionDetails: { transactionId: string };
  PaymentForm: undefined;
};
```

**Screen Props:**

```tsx
export type HomeScreenProps = AppTabsScreenProps<'Home'>;
```

### 2. Navigation Configuration (`config.ts`)

Centralized configuration for:

- Theme colors
- Default animations
- Tab bar styling
- Route constants

```tsx
export const TAB_ROUTES = {
  HOME: 'Home',
  ACCOUNTS: 'Accounts',
  PAYMENTS: 'Payments',
  PROFILE: 'Profile',
} as const;

export const NavigationConfig = {
  themes: { light: {...}, dark: {...} },
  screenOptions: {...},
  tabOptions: {...},
};
```

### 3. Navigation Exports (`index.ts`)

Provides clean exports for the entire navigation module:

```tsx
export { default as RootNavigator, AuthContext } from './RootNavigator';
export { default as AppNavigator } from './AppNavigator';
export { default as AuthNavigator } from './AuthNavigator';
export type { AuthStackParamList, AppStackParamList, ... } from './types';
export { NavigationConfig, TAB_ROUTES, APP_ROUTES, ... } from './config';
```

---

## Type Definitions

### Using Navigation Types in Screens

```tsx
// Approach 1: Import specific screen type
import type { AppTabsScreenProps } from '@navigation/types';

type HomeScreenProps = AppTabsScreenProps<'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  // Full type safety for navigation and route params
};
```

### Accessing Context

```tsx
import { AuthContext } from '@navigation';

const MyScreen: React.FC = () => {
  const authContext = React.useContext(AuthContext);

  const handleLogin = async () => {
    await authContext.signIn();
  };
};
```

### Navigation Props

```tsx
// Navigate to a screen
navigation.navigate('AccountDetails', { accountId: '123' });

// Go back
navigation.goBack();

// Go to top of stack
navigation.popToTop();

// Push (allows multiple instances)
navigation.push('AccountDetails', { accountId: '456' });
```

---

## Configuration Details

### Navigation Themes

Located in `src/navigation/config.ts`:

```tsx
themes: {
  light: {
    colors: {
      primary: '#007AFF',
      background: '#FFFFFF',
      card: '#F2F2F7',
      text: '#000000',
      border: '#E5E5EA',
      notification: '#FF3B30',
    },
  },
}
```

### Tab Bar Customization

```tsx
tabBarStyle: {
  borderTopWidth: 1,
  borderTopColor: '#E5E5EA',
  backgroundColor: '#FFFFFF',
  paddingBottom: 5,
  height: 60,
}
```

### Animation Configuration

Default animations for stack transitions:

- Duration: 300ms for open
- Duration: 300ms for close
- Gesture enabled for back navigation

---

## Adding New Screens

### Step 1: Define Route in Type Definition

**File:** `src/navigation/types.ts`

```tsx
export type AppStackParamList = {
  // ... existing routes
  NewScreen: { userId: string };
};
```

### Step 2: Create Screen Component

**File:** `src/features/module/screens/NewScreen.tsx`

```tsx
import type { AppStackScreenProps } from '@navigation/types';

type NewScreenProps = AppStackScreenProps<'NewScreen'>;

const NewScreen: React.FC<NewScreenProps> = ({ route, navigation }) => {
  const { userId } = route.params;
  // Component logic
};

export default NewScreen;
```

### Step 3: Add Route to Navigator

**File:** `src/navigation/AppNavigator.tsx`

```tsx
<AppStack.Screen
  name="NewScreen"
  component={NewScreen}
  options={{
    title: 'New Screen',
    headerShown: true,
  }}
/>
```

### Step 4: Navigate to Screen

```tsx
navigation.navigate('NewScreen', { userId: '123' });
```

---

## Authentication Flow

### How Authentication Works

1. **App Launch:** RootNavigator checks for stored auth token
2. **Loading State:** Shows SplashScreen while checking
3. **Route Selection:**
   - If token exists → Navigate to App stack
   - If no token → Navigate to Auth stack
4. **Sign In:** User logs in, token saved, navigates to App stack
5. **Sign Out:** Clears token, returns to Auth stack

### Authentication Implementation

```tsx
// Get auth context
const authContext = React.useContext(AuthContext);

// Sign in
await authContext.signIn();

// Sign out
await authContext.signOut();

// Check auth state
const { isSignedIn, isLoading } = authContext;
```

### Token Management (TODO)

Replace these TODO sections with your actual implementation:

```tsx
// src/navigation/RootNavigator.tsx

// In bootstrapAsync function:
// const userToken = await getStoredToken();
// In signIn:
// const response = await api.login(credentials);
// await saveToken(response.token);
// In signOut:
// await clearToken();
```

---

## Navigation Best Practices

### 1. Use Proper Type Safety

Always use typed screen props:

```tsx
// ✅ Good
type HomeScreenProps = AppTabsScreenProps<'Home'>;
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {};

// ❌ Avoid
const HomeScreen = ({ navigation }: any) => {};
```

### 2. Separate Navigation Config from Logic

```tsx
// In config.ts
export const NavigationConfig = { /* centralized config */ };

// In navigators
<Stack.Navigator screenOptions={NavigationConfig.screenOptions}>
```

### 3. Use Constants for Route Names

```tsx
// ✅ Good
import { TAB_ROUTES } from '@navigation';
navigation.navigate(TAB_ROUTES.HOME);

// ❌ Avoid
navigation.navigate('Home');
```

### 4. Handle Deep Linking

For future implementation, structure your routes to support deep linking:

```tsx
// Maintain consistent route naming
// Use params for dynamic segments
navigation.navigate('AccountDetails', { accountId: '123' });
// Can be linked as: app://accountdetails/123
```

### 5. Optimize Performance

- Use `React.memo` for screens
- Lazy load heavy components
- Use `useFocusEffect` for screen-specific logic

```tsx
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  React.useCallback(() => {
    // Refresh data when screen is focused
  }, [])
);
```

### 6. Error Handling

```tsx
const handleNavigation = async () => {
  try {
    await someLongOperation();
    navigation.navigate('NextScreen');
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

---

## Troubleshooting

### Issue: "Gesture Handler Root View" Error

**Solution:** Ensure `GestureHandlerRootView` wraps your app:

```tsx
<GestureHandlerRootView style={{ flex: 1 }}>
  <App />
</GestureHandlerRootView>
```

### Issue: Navigation Type Errors

**Solution:** Verify TypeScript configuration:

```bash
npm run type-check  # Should show no errors
```

### Issue: Bottom Tab Icons Not Showing

**Solution:** Implement icon rendering in AppNavigator:

```tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';

tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />;
```

### Issue: State Lost on Navigation

**Solution:** Use `navigation.setParams()` or Redux for global state

```tsx
navigation.setParams({ updatedData: newData });
```

---

## Future Enhancements

1. **Deep Linking** - Support universal links for web and native
2. **Bottom Sheet Navigation** - Implement bottom sheet modals
3. **Drawer Navigation** - Add side menu navigation
4. **Animation Library** - Integrate Reanimated for custom transitions
5. **State Persistence** - Save navigation state across app restarts
6. **Analytics** - Track screen views and navigation events

---

## References

- [React Navigation Official Docs](https://reactnavigation.org/)
- [React Navigation Type Checking](https://reactnavigation.org/docs/typescript/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [React Native Screens](https://github.com/software-mansion/react-native-screens)

---

## Summary

The implemented navigation system provides:

✅ **Type-safe navigation** with full TypeScript support  
✅ **Scalable architecture** for adding new modules  
✅ **Separation of concerns** - configs separate from logic  
✅ **Authentication management** - integrated auth flow  
✅ **Nested navigation** - tab + stack combinations  
✅ **Consistent styling** - centralized theme configuration  
✅ **Developer experience** - clean imports and exports

You can now extend this navigation structure to add new features and screens while maintaining consistency and type safety across the application.
