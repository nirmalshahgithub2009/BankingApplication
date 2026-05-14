# API Layer Integration with Auth State - Implementation Guide

## Overview

This document outlines the steps taken to integrate the API layer (token manager) with the existing authentication state in the RootNavigator. This enables seamless token management across the application with centralized auth flow.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          App.tsx                                │
│                   (GestureHandlerRootView)                      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                    RootNavigator.tsx                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  AuthContext                                            │   │
│  │  ├─ isSignedIn (boolean)                               │   │
│  │  ├─ isLoading (boolean)                                │   │
│  │  ├─ signIn(accessToken, refreshToken)                 │   │
│  │  └─ signOut()                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                       │
│         ├─→ setTokens(tokens) [Token Manager]                 │
│         └─→ clearTokens() [Token Manager]                     │
└────────────────────────────────┬────────────────────────────────┘
             │
             ├─→ AuthNavigator (Auth Stack)
             │   └─ LoginScreen
             │      └─ apiClient.post('/auth/login')
             │         └─ Returns { accessToken, refreshToken }
             │
             └─→ AppNavigator (App Stack)
                 ├─ HomeScreen (TabStack)
                 ├─ AccountsScreen (TabStack)
                 ├─ PaymentsScreen (TabStack)
                 └─ ProfileScreen (TabStack)
                    └─ All screens use apiClient which
                       automatically injects tokens
```

---

## Files Modified

### 1. **src/navigation/RootNavigator.tsx**

**Changes:**

- Imported token manager functions: `getAccessToken`, `getRefreshToken`, `setTokens`, `clearTokens`
- Updated `AuthContextType` interface to accept tokens in `signIn` method
- Modified `signIn` handler to call `setTokens()` with the provided tokens
- Modified `signOut` handler to call `clearTokens()`
- Added token restoration logic in bootstrap effect to check for existing tokens

**Key Code:**

```typescript
// Import token manager
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@core/api/tokenManager';

// Updated signIn to accept tokens
signIn: async (accessToken: string, refreshToken: string) => {
  try {
    setTokens({ accessToken, refreshToken });
    dispatch({ type: 'SIGN_IN' });
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
},

// signOut clears tokens
signOut: async () => {
  try {
    clearTokens();
    dispatch({ type: 'SIGN_OUT' });
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}
```

**Benefits:**

- All tokens are centrally managed through the token manager
- Token state is synced with auth context
- Tokens automatically available to API client on subsequent requests

---

### 2. **src/features/auth/screens/LoginScreen.tsx** (New)

**Features:**

- Email/password input fields
- Integration with `AuthContext` for sign-in
- Integration with `apiClient.post()` for API call
- Error handling with user-friendly messages
- Loading state management
- Demo credentials display

**Key Code:**

```typescript
import { AuthContext } from '@navigation/RootNavigator';
import { apiClient } from '@core/api/client';

const { signIn } = useContext(AuthContext);

const handleLogin = async () => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    // Pass tokens to AuthContext
    await signIn(response.accessToken, response.refreshToken);
  } catch (err) {
    // Error handling
  }
};
```

**Benefits:**

- Centralized login flow
- Automatic token injection into auth state
- API error handling with retry/refresh mechanisms
- Clean separation of concerns

---

### 3. **src/features/auth/screens/SplashScreen.tsx** (New)

**Features:**

- Loading indicator during app initialization
- Shows while tokens are being restored

**Benefits:**

- Professional UX during bootstrap
- Time for token restoration from secure storage

---

### 4. **src/core/api/tokenManager.ts** (Created earlier)

**Functionality:**

- In-memory token storage
- `getAccessToken()` / `getRefreshToken()` - retrieve tokens
- `setTokens(tokens)` - store tokens
- `clearTokens()` - remove tokens on logout
- `hasValidAccessToken()` - check token validity

**Usage Flow:**

1. User logs in → API returns tokens
2. LoginScreen calls `signIn(accessToken, refreshToken)`
3. RootNavigator calls `setTokens()` to store
4. Token manager stores in memory
5. ApiClient automatically retrieves tokens for subsequent requests

---

### 5. **src/core/api/client.ts** (Created earlier)

This API client is implemented with Axios. It uses an Axios instance for all requests, a centralized request interceptor for token injection, and a consistent response/error normalization layer.

**Token Injection Interceptor:**

```typescript
private async injectTokenInterceptor(request: RequestConfig): Promise<RequestConfig> {
  const headers = request.headers ? { ...request.headers } : {};
  const accessToken = getAccessToken();

  if (accessToken) {
    Object.assign(headers, {
      Authorization: `Bearer ${accessToken}`,
    });
  }

  return { ...request, headers };
}
```

**Axios-based Error Handling:**

- Axios errors are converted into `ApiError` via `normalizeAxiosError()`
- Network-level failures fallback to `normalizeNetworkError()`
- Response interceptor throws structured `ApiError` for non-2xx responses

**Refresh Flow on 401:**

- When API returns 401 (Unauthorized)
- Client automatically calls refresh endpoint via `axios.post()`
- New tokens stored in token manager via `setTokens()`
- Original request retried with the refreshed token

---

## Integration Flow

### Login Flow

```
User enters credentials
        ↓
LoginScreen.handleLogin()
        ↓
apiClient.post('/auth/login', { email, password })
        ↓
API returns { accessToken, refreshToken, user }
        ↓
AuthContext.signIn(accessToken, refreshToken)
        ↓
TokenManager.setTokens({ accessToken, refreshToken })
        ↓
RootNavigator.dispatch({ type: 'SIGN_IN' })
        ↓
Navigation changes to AppNavigator
        ↓
All subsequent requests include Bearer token
```

### Logout Flow

```
User taps logout button
        ↓
AuthContext.signOut()
        ↓
TokenManager.clearTokens()
        ↓
RootNavigator.dispatch({ type: 'SIGN_OUT' })
        ↓
Navigation changes to AuthNavigator
```

### Token Refresh Flow (on 401)

```
API request returns 401
        ↓
ApiClient.handleApiError()
        ↓
Get refreshToken from TokenManager
        ↓
apiClient.post('/auth/refresh', { refreshToken })
        ↓
API returns { accessToken }
        ↓
TokenManager.setTokens(newToken)
        ↓
Retry original request with new token
```

---

## Secure Token Storage

> **TODO**: Currently tokens are stored in memory. For production, implement secure storage:

### For React Native:

```typescript
// Install: npm install react-native-keychain
import * as Keychain from 'react-native-keychain';

// In bootstrapAsync (RootNavigator):
const credentials = await Keychain.getGenericPassword();
if (credentials) {
  const tokens = JSON.parse(credentials.password);
  setTokens(tokens);
  dispatch({ type: 'RESTORE_TOKEN', isSignedIn: true });
}

// In signIn:
await Keychain.setGenericPassword('tokens', JSON.stringify({ accessToken, refreshToken }));

// In signOut:
await Keychain.resetGenericPassword();
```

---

## Configuration

### Environment-based API URLs

`src/core/api/config.ts` defines different endpoints per environment:

```typescript
development: {
  baseURL: 'https://dev-api.bankapp.local',
  timeoutMs: 15000,
  retryCount: 2,
}

staging: {
  baseURL: 'https://staging-api.bankapp.com',
  timeoutMs: 15000,
  retryCount: 2,
}

production: {
  baseURL: 'https://api.bankapp.com',
  timeoutMs: 15000,
  retryCount: 3,
}
```

---

## Error Handling

### ApiError Class

- Provides structured error information
- Includes retry-ability detection
- Captures HTTP status codes
- Preserves original error for debugging

### Error Interceptors

- Can be added to ApiClient to handle errors globally
- Example: Log errors, show toasts, redirect to login

```typescript
apiClient.addErrorInterceptor(async (error) => {
  if (error.statusCode === 401) {
    // Token expired, redirect to login
  }
  throw error;
});
```

---

## Usage Example

### In a Feature Component

```typescript
import { AccountService } from '@domain/accounts/services';

const AccountsScreen = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Automatically includes Bearer token
    AccountService.getAccounts()
      .then(setAccounts)
      .catch((error) => console.error(error));
  }, []);

  return <FlatList data={accounts} />;
};
```

### Direct API Call

```typescript
import { apiClient } from '@core/api/client';

const response = await apiClient.get('/accounts', {
  query: { page: 1, limit: 10 },
});
```

---

## Testing

### Test Token Injection

```typescript
// Mock token in token manager
setTokens({ accessToken: 'mock-token', refreshToken: 'mock-refresh' });

// Make API call
const result = await apiClient.get('/test');

// Verify Authorization header was included
```

### Test Token Refresh

```typescript
// Set expired token scenario
setTokens({ accessToken: null, refreshToken: 'valid-refresh' });

// Mock API to return 401
mockApi.mock401();

// Make request - should automatically refresh
const result = await apiClient.get('/protected');

// Verify new token was obtained
expect(getAccessToken()).not.toBeNull();
```

---

## Next Steps

1. **Implement Secure Storage**

   - Use `react-native-keychain` to persist tokens securely
   - Update `bootstrapAsync` to restore from secure storage

2. **Add API Service Layer**

   - Create services for other domains (Transactions, Cards, etc.)
   - Follow AccountService pattern

3. **Error Logging**

   - Add error interceptor to log API errors
   - Integrate with analytics service

4. **Timeout Handling**

   - Implement backoff strategy for retries
   - Add exponential backoff for rate-limited endpoints

5. **Test Coverage**
   - Unit tests for token manager
   - Integration tests for API client with interceptors
   - E2E tests for login/logout flow

---

## Files Created/Modified Summary

| File                                             | Status   | Purpose                                  |
| ------------------------------------------------ | -------- | ---------------------------------------- |
| `src/navigation/RootNavigator.tsx`               | Modified | Integrated token manager with auth state |
| `src/features/auth/screens/LoginScreen.tsx`      | Created  | User login with API integration          |
| `src/features/auth/screens/SplashScreen.tsx`     | Created  | Loading screen during bootstrap          |
| `src/core/api/config.ts`                         | Created  | Environment-based API configuration      |
| `src/core/api/errors.ts`                         | Created  | Centralized error handling               |
| `src/core/api/tokenManager.ts`                   | Created  | Token state management                   |
| `src/core/api/client.ts`                         | Created  | API client with interceptors             |
| `src/domain/accounts/services/AccountService.ts` | Created  | Example service layer                    |

---

## Key Benefits

✅ **Centralized Token Management** - Single source of truth for auth tokens
✅ **Automatic Token Injection** - All API requests include authorization header
✅ **Token Refresh Flow** - Automatic refresh on 401 errors
✅ **Retry Logic** - Failed requests retried with exponential backoff
✅ **Clean Separation** - API layer decoupled from business logic
✅ **Type-Safe** - Full TypeScript support
✅ **Error Handling** - Structured error information and recovery
✅ **Environment Config** - Different settings per environment
✅ **Future-Ready** - Easy to add analytics, logging, rate limiting

---

## References

- [React Navigation Auth Flow](https://reactnavigation.org/docs/auth-flow)
- [Axios](https://axios-http.com/)
- [React Context API](https://react.dev/reference/react/useContext)
