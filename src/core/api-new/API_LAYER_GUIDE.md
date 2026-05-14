# API Layer Architecture

Complete guide to the banking app's HTTP API layer with interceptors, token management, and error handling.

## 📁 API Structure

```
src/core/
├── api/
│   ├── types.ts           # TypeScript interfaces
│   ├── endpoints.ts       # API endpoints & configuration
│   ├── error.mapper.ts    # Error handling & mapping
│   ├── client.ts          # Axios HTTP client
│   ├── auth.api.ts        # Authentication API calls
│   └── index.ts           # Public exports
│
└── authentication/
    └── token.manager.ts   # Secure token storage (Keychain)
```

## 🔐 Security Features

### 1. Token Management (Keychain)

Tokens are stored securely in iOS Keychain and Android Keystore:

```typescript
import { TokenManager } from '@core/authentication/token.manager';

// Save tokens
await TokenManager.saveTokens({
  accessToken: 'token',
  refreshToken: 'refresh',
  expiresIn: 3600
});

// Get access token
const token = await TokenManager.getAccessToken();

// Check expiry
const isExpired = await TokenManager.isTokenExpired();

// Clear on logout
await TokenManager.clearTokens();
```

### 2. Automatic Token Refresh

When access token expires (401 response), the client automatically:
1. Detects 401 response
2. Uses refresh token to get new access token
3. Retries original request with new token
4. Clears tokens and redirects to login on refresh failure

### 3. Request Interceptors

All API requests automatically:
- Attach Authorization header with access token
- Add Content-Type headers
- Log request details in development

```typescript
// Request flow:
// 1. Get access token from Keychain
// 2. Add Authorization: Bearer <token> header
// 3. Send request
// 4. Log request details (dev only)
```

### 4. Response Interceptors

All API responses:
- Log response details (dev only)
- Handle 401 errors with token refresh
- Pass errors to error mapper
- Return successful responses as-is

### 5. Exponential Backoff Retry Logic

Automatically retries failed requests with exponential backoff:

```typescript
// Retry Configuration
{
  maxRetries: 3,                    // Up to 3 retries
  retryDelay: exponentialDelay,     // 100ms, 200ms, 400ms
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
  retryMethods: ['GET', 'PUT', 'DELETE']
}

// Example retry timeline:
// Request 1: Fails with 503
// Wait 100ms
// Request 2: Fails with 503
// Wait 200ms
// Request 3: Fails with 503
// Wait 400ms
// Request 4: Success! Returns data
```

## 🎯 API Types

### Auth API

```typescript
import { AuthApi } from '@core/api';

// Login
const { user, tokens } = await AuthApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// Signup
const { user, tokens } = await AuthApi.signup({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});

// Refresh token
const tokens = await AuthApi.refreshToken(refreshToken);

// Logout
await AuthApi.logout();

// Verify email
await AuthApi.verifyEmail('user@example.com', 'OTP123');

// Forgot password
await AuthApi.forgotPassword('user@example.com');

// Reset password
await AuthApi.resetPassword('resetToken', 'newPassword123');

// Change password
await AuthApi.changePassword('currentPassword', 'newPassword');

// Check auth status
const { isAuthenticated } = await AuthApi.checkAuthStatus();

// Validate token
const isValid = await AuthApi.validateToken();
```

## 📊 Error Handling

### Error Mapping

All errors are mapped to user-friendly messages:

```typescript
import { mapApiError, getUserFriendlyMessage } from '@core/api';

try {
  await authApi.login(credentials);
} catch (error) {
  const mappedError = mapApiError(error);
  console.log(mappedError.message); // "Invalid email or password"
  console.log(mappedError.code);    // "INVALID_CREDENTIALS"
  console.log(mappedError.statusCode); // 401
}
```

### Error Codes & Messages

**Auth Errors:**
- `INVALID_CREDENTIALS` → "Invalid email or password"
- `EMAIL_ALREADY_EXISTS` → "This email is already registered"
- `WEAK_PASSWORD` → "Password must be at least 8 characters..."
- `ACCOUNT_LOCKED` → "Your account is temporarily locked..."
- `INVALID_OTP` → "Invalid or expired OTP..."

**Transaction Errors:**
- `INSUFFICIENT_BALANCE` → "Insufficient balance in your account"
- `INVALID_RECIPIENT` → "Invalid recipient account"
- `DUPLICATE_TRANSACTION` → "This transaction already exists"
- `TRANSACTION_LIMIT_EXCEEDED` → "You have exceeded your transaction limit"

**Network Errors:**
- `NETWORK_ERROR` → "Network connection failed..."
- `TIMEOUT_ERROR` → "Request timed out. Please try again."
- Connection loss automatically detected

**Server Errors:**
- `INTERNAL_SERVER_ERROR` → "Server error. Please try again later."
- `SERVICE_UNAVAILABLE` → "Service temporarily unavailable..."
- Auto-retry on 5xx errors

### Custom Error Handling

```typescript
import { isRetryableError, isAuthError } from '@core/api';

try {
  await apiClient.get('/data');
} catch (error) {
  const statusCode = error.response?.status;

  if (isAuthError(statusCode)) {
    // Redirect to login
  } else if (isRetryableError(statusCode)) {
    // Will be auto-retried
  } else {
    // Show error to user
  }
}
```

## 🔧 API Endpoints Configuration

### Static Endpoints

All endpoints are centrally configured:

```typescript
import { API_ENDPOINTS } from '@core/api';

// Auth endpoints
API_ENDPOINTS.AUTH.LOGIN      // '/auth/login'
API_ENDPOINTS.AUTH.SIGNUP     // '/auth/signup'
API_ENDPOINTS.AUTH.LOGOUT     // '/auth/logout'
API_ENDPOINTS.AUTH.REFRESH_TOKEN // '/auth/refresh'

// Account endpoints
API_ENDPOINTS.ACCOUNTS.GET_ALL    // '/accounts'
API_ENDPOINTS.ACCOUNTS.GET_BY_ID  // '/accounts/:id'

// Transaction endpoints
API_ENDPOINTS.TRANSACTIONS.GET_ALL          // '/transactions'
API_ENDPOINTS.TRANSACTIONS.GET_BY_ACCOUNT   // '/accounts/:accountId/transactions'

// Card endpoints
API_ENDPOINTS.CARDS.GET_ALL      // '/cards'
API_ENDPOINTS.CARDS.BLOCK        // '/cards/:id/block'

// ... and more
```

### Dynamic Endpoint Building

```typescript
import { buildEndpoint } from '@core/api';

const url = buildEndpoint(
  API_ENDPOINTS.ACCOUNTS.GET_BY_ID,
  { id: '123' }
);
// Result: '/accounts/123'
```

## 📝 Configuration

### Environment Variables

```bash
# .env
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_API_TIMEOUT=30000
REACT_APP_MAX_RETRIES=3
```

### API Config

```typescript
import { API_CONFIG } from '@core/api';

{
  baseURL: 'https://api.example.com',
  timeout: 30000,           // 30 seconds
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 429, 500, 502, 503, 504]
}
```

## 📱 Usage in Components

### With Redux Thunks

```typescript
import { useAppDispatch, useAppSelector, loginUser, selectUser } from '@app';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLogin = async () => {
    await dispatch(loginUser({ email: 'user@example.com', password: '123456' }));
  };

  return (
    <View>
      <Input onChangeText={setEmail} />
      <Button onPress={handleLogin}>Login</Button>
      {user && <Text>Welcome, {user.firstName}!</Text>}
    </View>
  );
};
```

### Direct API Calls

```typescript
import { AuthApi, mapApiError } from '@core/api';

const handleLogin = async () => {
  try {
    const result = await AuthApi.login({ email, password });
    // Handle success
  } catch (error) {
    const apiError = mapApiError(error);
    showErrorMessage(apiError.message);
  }
};
```

## 🧪 Testing API Layer

### Mocking API Client

```typescript
import { apiClient } from '@core/api';
import mockAxios from 'jest-mock-axios';

jest.mock('@core/api/client', () => ({
  apiClient: mockAxios,
}));

describe('AuthApi', () => {
  it('should login successfully', async () => {
    const mockResponse = {
      data: {
        user: { id: '1', email: 'test@example.com' },
        tokens: { accessToken: 'token', refreshToken: 'refresh', expiresIn: 3600 }
      }
    };

    mockAxios.post.mockResolvedValue(mockResponse);

    const result = await AuthApi.login({ email: 'test@example.com', password: 'pass' });

    expect(result.user.email).toBe('test@example.com');
  });
});
```

### Testing Error Handling

```typescript
import { mapApiError } from '@core/api';

describe('Error Mapping', () => {
  it('should map 401 error', () => {
    const error = {
      response: {
        status: 401,
        data: { code: 'UNAUTHORIZED', message: 'Invalid credentials' }
      }
    };

    const mapped = mapApiError(error);

    expect(mapped.code).toBe('UNAUTHORIZED');
    expect(mapped.message).toContain('session has expired');
  });
});
```

## 🔄 Token Refresh Flow

```
1. User makes API request
   ↓
2. Request Interceptor adds Authorization header
   ↓
3. API returns 401 (Token Expired)
   ↓
4. Response Interceptor detects 401
   ↓
5. Call /auth/refresh with refreshToken
   ↓
6. If success:
   - Save new tokens to Keychain
   - Retry original request with new token
   - Return success
   ↓
7. If refresh fails:
   - Clear all tokens
   - Return error (app redirects to login)
```

## 📚 API Request Flow Diagram

```
┌─────────────────────┐
│  API Call           │
│  AuthApi.login()    │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ Request Interceptor │
│ Add Auth header     │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ Axios Request       │
│ With retry logic    │
└──────────┬──────────┘
           │
           ↓
        Success?
        /      \
      YES      NO
      │        │
      │        ↓
      │   Response Code?
      │   /    |    \
      │  401  4xx   5xx
      │  │    │     │
      │  │    │     └→ Retry?
      │  │    │        Yes→ Retry with backoff
      │  │   Show    No→ Error to user
      │  │  Error
      │  │
      │  └→ Refresh Token
      │     Success?
      │     /      \
      │   YES      NO
      │   │        │
      │   ├→ Retry ├→ Clear tokens
      │   Request  └→ Redirect to login
      │   │
      ↓   ↓
┌─────────────────────┐
│ Response Interceptor│
│ Log result          │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ Return to caller    │
└─────────────────────┘
```

## 🚀 Future Enhancements

- [ ] SSL Certificate Pinning
- [ ] Request encryption
- [ ] API versioning strategy
- [ ] Rate limiting handling
- [ ] Offline request queueing
- [ ] GraphQL support
- [ ] WebSocket for real-time updates
