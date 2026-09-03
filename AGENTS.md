# Banking App - Production Grade Architecture

A scalable, secure, and maintainable banking mobile application built with React Native and TypeScript.

## 🏗️ Architecture Overview

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **State Management** | Redux Toolkit + React Query | App & server state management |
| **API** | Axios + Interceptors | HTTP client with token refresh |
| **Navigation** | React Navigation v6+ | Routing with deep linking |
| **Security** | Keychain + SSL Pinning | Secure token & data storage |
| **Firebase** | Crashlytics, Analytics, Remote Config | Crash reporting & monitoring |
| **Forms** | React Hook Form + Zod | Form validation & submission |
| **Theming** | Context API + Paper | Dynamic theme support |
| **Localization** | i18n-js | Multi-language support |
| **Testing** | Jest + React Testing Library + Detox | Unit, UI, Integration, E2E |

## 📁 Project Structure

```
src/
├── app/                    # Application entry point & store setup
├── core/
│   ├── api/               # HTTP client, interceptors, endpoints
│   ├── authentication/    # Token management, security
│   ├── firebase/          # Firebase services integration
│   ├── logger/            # Logging & analytics
│   └── utils/             # Validators, formatters, error mappers
├── shared/
│   ├── ui/                # Reusable components, theme, icons
│   ├── forms/             # Form validation logic & components
│   ├── localization/      # i18n setup & translations
│   └── hooks/             # Custom React hooks
├── features/
│   ├── auth/              # Authentication feature
│   ├── dashboard/         # Dashboard feature
│   └── settings/          # Settings feature
├── navigation/            # Root navigator & deep linking
└── __tests__/             # Test files (unit, UI, integration, E2E)
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22.11.0
- npm or yarn
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

```bash
# Install dependencies
npm install

# Install iOS pods
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your configuration values:
   ```bash
   cp .env.example .env
   ```

## 📋 Scripts

```bash
# Development
npm start              # Start Metro bundler
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator

# Testing
npm test               # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Generate coverage report

# Code Quality
npm run lint           # Run ESLint
npm run type-check     # Run TypeScript checks

# E2E Testing
detox build-framework-cache
detox build-app -c ios.sim.release
detox test -c ios.sim.release
```

## 🔐 Security Features

- ✅ Secure token storage in Keychain/Secure Enclave
- ✅ SSL Certificate Pinning
- ✅ API request/response interceptors
- ✅ Automatic token refresh on 401
- ✅ Device security checks
- ✅ Firebase Crashlytics for error tracking

## 🎨 Theming

Support for light/dark mode with dynamic theme switching:

```typescript
import { useTheme } from '@shared/ui/theme';

const MyComponent = () => {
  const { colors, isDark } = useTheme();
  // Use colors and isDark to style components
};
```

## 🌍 Localization

Multi-language support with runtime switching:

```typescript
import { useTranslation } from '@shared/localization';

const MyComponent = () => {
  const { t, i18n } = useTranslation();
  
  return <Text>{t('common.hello')}</Text>;
};
```

## 📊 Redux State Management

Feature-based Redux slices:

```typescript
// Dispatch action
dispatch(loginUser({ email, password }));

// Select state
const user = useAppSelector((state) => state.auth.user);
```

## 🧪 Testing Strategy

### Unit Tests (80%+ coverage)
- API client & interceptors
- Redux slices & thunks
- Validators & formatters
- Utility functions

### UI Tests (70%+ coverage)
- Component rendering
- User interactions
- Theme switching
- Error boundary

### Integration Tests (60%+ coverage)
- Auth flow (login → token save → redirect)
- Token refresh flow
- Form submission → API → Store
- Deep linking

### E2E Tests
- Critical user journeys
- End-to-end workflows

Run tests:
```bash
npm test              # Unit & UI tests
detox test           # E2E tests
```

## 📱 Features

### Authentication
- Secure login/signup flow
- Token refresh mechanism
- Session management
- Logout & cleanup

### Dashboard
- Account overview
- Transaction history
- Quick actions

### Settings
- Theme switching (light/dark)
- Language selection
- Account settings

## 🛠️ Development Workflow

### Adding a New Feature

1. Create feature folder: `src/features/[feature-name]/`
2. Create sub-folders: `screens`, `store`, `types`, `api`, `components`
3. Create Redux slice in `store/[feature].slice.ts`
4. Create API functions in `api/[feature].api.ts`
5. Create screens and components
6. Add navigation configuration
7. Add tests

### Adding a Reusable Component

1. Create in `src/shared/ui/components/`
2. Export from `src/shared/ui/components/index.ts`
3. Add unit tests
4. Add Storybook stories (optional)

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Firebase React Native Docs](https://rnfirebase.io/)

## 📄 License

Proprietary - Banking App

## 🤝 Contributing

Please follow the established patterns and maintain test coverage above 75%.
