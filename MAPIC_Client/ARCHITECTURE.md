# Kiến trúc ứng dụng MAPIC Client

## Tổng quan

Ứng dụng được xây dựng theo kiến trúc **MVVM (Model-View-ViewModel)** kết hợp với **Expo Router** và **Zustand** cho state management.

## Cấu trúc thư mục

```
MAPIC_Client/
├── app/                      # Expo Router - File-based routing
│   ├── (auth)/              # Auth screens group
│   ├── (tabs)/              # Main tabs group
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry point
│
├── screens/                  # Screen components (View layer)
│   ├── auth/                # Authentication screens
│   ├── home/                # Home screens
│   └── profile/             # Profile screens
│
├── viewmodels/              # Business logic (ViewModel layer)
│   ├── auth.viewmodel.ts    # Auth logic
│   └── index.ts
│
├── models/                   # Data models (Model layer)
│   ├── user.model.ts        # User data structure
│   ├── api-response.model.ts
│   └── index.ts
│
├── store/                    # Global state management (Zustand)
│   ├── auth.store.ts        # Authentication state
│   ├── app.store.ts         # App-wide state
│   └── index.ts
│
├── services/                 # API services
│   ├── api.service.ts       # Base API client
│   ├── auth.service.ts      # Auth API calls
│   └── cloudinary.service.ts
│
├── components/               # Reusable UI components
│   ├── ui/                  # Base UI components
│   ├── themed-text.tsx
│   └── themed-view.tsx
│
├── navigation/               # Navigation configuration
│   ├── types.ts             # Navigation types
│   ├── linking.ts           # Deep linking config
│   └── index.ts
│
├── hooks/                    # Custom React hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
│
├── utils/                    # Utility functions
│   ├── validation.ts        # Form validation
│   ├── format.ts            # Data formatting
│   ├── storage.ts           # AsyncStorage wrapper
│   └── index.ts
│
├── constants/                # App constants
│   ├── api.ts               # API endpoints
│   └── theme.ts             # Theme configuration
│
├── types/                    # TypeScript type definitions
│   └── auth.types.ts
│
└── assets/                   # Static assets
    ├── images/
    └── fonts/
```

## Kiến trúc MVVM

### 1. Model (models/)
- Định nghĩa cấu trúc dữ liệu
- Business entities
- Data transformation logic
- Ví dụ: `User`, `ApiResponse`, `Product`

### 2. View (screens/ + components/)
- UI components
- Hiển thị dữ liệu từ ViewModel
- Xử lý user interactions
- Không chứa business logic

### 3. ViewModel (viewmodels/)
- Business logic layer
- Xử lý dữ liệu từ Services
- Quản lý state của từng màn hình
- Expose data và actions cho View
- Custom hooks pattern: `useAuthViewModel()`

## State Management với Zustand

### Global State (store/)
- **auth.store.ts**: User authentication state
- **app.store.ts**: App-wide settings (theme, language)
- Persistent storage với AsyncStorage
- Simple API, không boilerplate

### Local State
- Component state với `useState`
- Form state trong screens
- UI state (loading, errors)

## Data Flow

```
User Action → View (Screen)
    ↓
ViewModel (Business Logic)
    ↓
Service (API Call)
    ↓
Model (Data Structure)
    ↓
Store (Global State) ← ViewModel
    ↓
View (Re-render)
```

## Navigation

### Expo Router (File-based)
- `app/(auth)/` - Authentication flow
- `app/(tabs)/` - Main app tabs
- Automatic deep linking
- Type-safe navigation

### Navigation Types
- Định nghĩa trong `navigation/types.ts`
- Type-safe params
- Auto-completion

## Best Practices

### 1. Separation of Concerns
- View chỉ render UI
- ViewModel xử lý logic
- Service gọi API
- Store quản lý global state

### 2. Reusability
- Components có thể tái sử dụng
- Custom hooks cho logic chung
- Utility functions

### 3. Type Safety
- TypeScript cho tất cả code
- Strict type checking
- Interface cho models

### 4. Error Handling
- Try-catch trong ViewModels
- Error state trong UI
- User-friendly messages

### 5. Performance
- Lazy loading screens
- Memoization khi cần
- Optimized re-renders

## Thư viện chính

- **Expo**: Framework và tooling
- **Expo Router**: File-based navigation
- **Zustand**: State management
- **React Navigation**: Navigation primitives
- **AsyncStorage**: Local storage
- **TypeScript**: Type safety

## Quy trình phát triển feature mới

1. **Tạo Model** (`models/`)
   - Định nghĩa data structure
   - Validation logic

2. **Tạo Service** (`services/`)
   - API endpoints
   - Data fetching

3. **Tạo Store** (nếu cần global state)
   - Zustand store
   - Actions và state

4. **Tạo ViewModel** (`viewmodels/`)
   - Business logic
   - Custom hook

5. **Tạo Screen** (`screens/`)
   - UI components
   - Sử dụng ViewModel

6. **Tạo Route** (`app/`)
   - File-based routing
   - Layout configuration

## Testing Strategy

- Unit tests cho ViewModels
- Integration tests cho Services
- Component tests cho UI
- E2E tests cho critical flows

## Deployment

- Expo EAS Build
- OTA Updates
- Environment configuration
- CI/CD pipeline
