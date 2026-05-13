# API Integration - Quick Reference Guide

## Quick Start

### 1. User Login Flow

```typescript
// LoginScreen.tsx
const { signIn } = useContext(AuthContext);

const handleLogin = async () => {
  const response = await apiClient.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  // This updates token manager automatically
  await signIn(response.accessToken, response.refreshToken);
};
```

### 2. Using API Services

```typescript
// Import service
import { AccountService } from '@domain/accounts/services';

// Use it - tokens are automatically included
const accounts = await AccountService.getAccounts();
const details = await AccountService.getAccountDetails('acc-123');
```

### 3. Direct API Calls

```typescript
// For quick one-off requests
const data = await apiClient.get('/endpoint');
const result = await apiClient.post('/endpoint', { key: 'value' });
```

### 4. Logout

```typescript
const { signOut } = useContext(AuthContext);
await signOut(); // Clears tokens and redirects to login
```

---

## API Client Features

### Request Methods

```typescript
// GET with query parameters
apiClient.get<MyType>('/users', { page: 1, limit: 10 });

// POST with JSON body
apiClient.post<MyType>('/users', { name: 'John', email: 'john@example.com' });

// PUT for updates
apiClient.put<MyType>('/users/123', { name: 'Jane' });

// DELETE
apiClient.delete<MyType>('/users/123');
```

### Error Handling

```typescript
try {
  const data = await apiClient.get('/endpoint');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.statusCode); // HTTP status
    console.log(error.message); // Error message
    console.log(error.isRetryable); // Can retry?
    console.log(error.responseBody); // Response data
  }
}
```

### Custom Interceptors

```typescript
// Add request interceptor (e.g., custom headers)
apiClient.addRequestInterceptor(async (request) => {
  return {
    ...request,
    headers: {
      ...request.headers,
      'X-Custom-Header': 'value',
    },
  };
});

// Add error interceptor (e.g., global error handling)
apiClient.addErrorInterceptor(async (error) => {
  if (error.statusCode === 401) {
    // Redirect to login
  }
  throw error;
});
```

---

## Token Management

### Check if User is Signed In

```typescript
import { getAccessToken } from '@core/api/tokenManager';

if (getAccessToken()) {
  console.log('User is authenticated');
} else {
  console.log('User needs to login');
}
```

### Manual Token Update (if needed)

```typescript
import { setTokens } from '@core/api/tokenManager';

setTokens({
  accessToken: 'new-token',
  refreshToken: 'new-refresh-token',
});
```

### Clear Tokens

```typescript
import { clearTokens } from '@core/api/tokenManager';

clearTokens(); // Manually clear (normally done via signOut)
```

---

## Environment Configuration

### Available Environments

| Environment | Base URL                          | Retries | Timeout |
| ----------- | --------------------------------- | ------- | ------- |
| development | `https://dev-api.bankapp.local`   | 2       | 15s     |
| staging     | `https://staging-api.bankapp.com` | 2       | 15s     |
| production  | `https://api.bankapp.com`         | 3       | 15s     |

### Change Environment

```typescript
// In src/core/api/config.ts
const ENVIRONMENT: Environment = 'staging'; // Change this

// Or use __DEV__ flag (automatic)
// __DEV__ → development
// !__DEV__ → production
```

---

## Creating a New Service

### Template: src/domain/[domain]/services/[Service].ts

```typescript
import { apiClient } from '@core/api/client';

export type MyModel = {
  id: string;
  name: string;
  // ... other fields
};

export const MyService = {
  // Fetch all
  getAll: async (): Promise<MyModel[]> => {
    return apiClient.get<MyModel[]>('/endpoint');
  },

  // Fetch one
  getById: async (id: string): Promise<MyModel> => {
    return apiClient.get<MyModel>(`/endpoint/${id}`);
  },

  // Create
  create: async (data: Omit<MyModel, 'id'>): Promise<MyModel> => {
    return apiClient.post<MyModel>('/endpoint', data);
  },

  // Update
  update: async (id: string, data: Partial<MyModel>): Promise<MyModel> => {
    return apiClient.put<MyModel>(`/endpoint/${id}`, data);
  },

  // Delete
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/endpoint/${id}`);
  },
};
```

### Export from index.ts

```typescript
// src/domain/[domain]/services/index.ts
export * from './[Service]';
```

---

## Common Patterns

### Loading State

```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await apiClient.get('/data');
    setData(data);
  } finally {
    setLoading(false);
  }
};
```

### Error State

```typescript
const [error, setError] = useState<string>('');

try {
  const data = await apiClient.get('/data');
} catch (err) {
  const apiError = err instanceof ApiError ? err : new ApiError({ message: String(err) });
  setError(apiError.message);
}
```

### Retry with Backoff

```typescript
async function fetchWithBackoff(url: string, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiClient.get(url);
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
}
```

---

## Debugging

### Log API Requests/Responses

```typescript
apiClient.addRequestInterceptor(async (request) => {
  console.log('📤 Request:', request.url, request.method, request.body);
  return request;
});

apiClient.addResponseInterceptor(async (context) => {
  console.log('📥 Response:', context.response.status, context.data);
  return context;
});

apiClient.addErrorInterceptor(async (error) => {
  console.error('❌ Error:', error.statusCode, error.message);
  throw error;
});
```

### Check Token in Redux DevTools or Console

```typescript
// In browser console or debugger
import { getAccessToken, getRefreshToken } from '@core/api/tokenManager';

console.log('Access:', getAccessToken());
console.log('Refresh:', getRefreshToken());
```

---

## Common Issues & Solutions

### 401 Unauthorized

**Symptom**: Requests return 401 after login
**Solution**: ApiClient automatically retries with refresh token. If still failing:

1. Check token is saved in token manager
2. Verify refresh endpoint exists
3. Check refresh token is valid

### CORS Errors

**Symptom**: "Access to XMLHttpRequest blocked by CORS policy"
**Solution**:

1. Ensure API server has CORS headers
2. Check baseURL environment is correct
3. Verify Content-Type headers match server requirements

### Timeout Errors

**Symptom**: "Network request failed" after 15 seconds
**Solution**:

1. Check network speed
2. Increase timeout in `src/core/api/config.ts`
3. Implement client-side pagination or filtering

### Tokens Not Persisting

**Symptom**: User logged out after app reload
**Solution**: Implement secure storage (see TODO in RootNavigator)

```typescript
// Install: npm install react-native-keychain
// Then use it to persist tokens across app restarts
```

---

## Testing

### Mock API Calls in Tests

```typescript
import { apiClient } from '@core/api/client';

jest.mock('@core/api/client');
const mockApiClient = apiClient as jest.Mock;

test('fetches data', async () => {
  mockApiClient.get.mockResolvedValue([{ id: '1', name: 'Test' }]);

  const result = await ServiceClass.getAll();

  expect(mockApiClient.get).toHaveBeenCalledWith('/endpoint');
  expect(result).toHaveLength(1);
});
```

### Test Token Injection

```typescript
test('injects authorization header', async () => {
  setTokens({ accessToken: 'mock-token', refreshToken: 'mock-refresh' });

  const request = await apiClient.request({
    url: '/test',
    method: 'GET',
  });

  // Verify header in request
});
```

---

## Performance Tips

1. **Reuse Service Methods**: Don't make raw API calls in components
2. **Cache Results**: Use React Query or SWR for automatic caching
3. **Batch Requests**: Combine multiple requests into one
4. **Pagination**: Load data in chunks, not all at once
5. **Lazy Load**: Fetch data when needed, not on app start

---

## Security Best Practices

✅ **DO**:

- Store tokens in secure storage (Keychain/AsyncStorage with encryption)
- Include HTTPS for all API calls
- Validate SSL certificates
- Use httpOnly cookies if available
- Implement proper token expiry handling

❌ **DON'T**:

- Store tokens in localStorage (web) or plain AsyncStorage
- Log sensitive data (tokens, passwords)
- Hardcode API keys in source code
- Trust client-side validation only
- Share auth tokens between users

---

## Resources

- [API Integration Guide](./API_INTEGRATION_GUIDE.md) - Full documentation
- [src/core/api/client.ts](./src/core/api/client.ts) - ApiClient implementation
- [src/core/api/tokenManager.ts](./src/core/api/tokenManager.ts) - Token storage
- [src/navigation/RootNavigator.tsx](./src/navigation/RootNavigator.tsx) - Auth flow
- [src/domain/accounts/services/AccountService.ts](./src/domain/accounts/services/AccountService.ts) - Service example
