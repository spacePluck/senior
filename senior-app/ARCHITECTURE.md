# VIP Care - Architecture Documentation

## 📐 Project Structure

```
senior-app/
├── app/                          # Next.js 16 App Router
│   ├── [locale]/                 # Internationalization (10 languages)
│   │   ├── medications/          # Medication management pages
│   │   ├── health/               # Health records pages
│   │   └── ...
│   └── api/                      # API routes (if needed)
│
├── components/                   # React components
│   ├── ui/                       # Reusable senior-friendly UI components
│   │   ├── SeniorButton.tsx
│   │   ├── SeniorInput.tsx
│   │   ├── SeniorCard.tsx
│   │   └── SeniorSelect.tsx
│   └── icons/                    # Icon components
│
├── lib/                          # Core libraries
│   ├── services/                 # 🔑 Service Layer (Business Logic)
│   │   ├── medication.service.ts
│   │   ├── health.service.ts
│   │   ├── user.service.ts
│   │   └── index.ts
│   ├── supabase/                 # Supabase client configuration
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts                  # Utility functions
│
├── hooks/                        # 🎣 Custom React Hooks
│   ├── useMedications.ts
│   ├── useMedicationLogs.ts
│   ├── useHealthRecords.ts
│   └── index.ts
│
├── store/                        # Zustand global state
│   ├── useUserStore.ts
│   ├── useMedicationStore.ts
│   └── useHealthStore.ts
│
├── types/                        # TypeScript type definitions
│   └── database.ts               # Supabase generated types
│
└── supabase/                     # Supabase configuration
    └── schema.sql                # Database schema
```

## 🏗️ Architecture Layers

### 1. **Service Layer** (`lib/services/`)
**Pure TypeScript classes with no React dependencies**

- Contains all business logic and API operations
- Directly interacts with Supabase
- Can be easily extracted to a NestJS backend
- Each service is a static class with well-defined methods

**Example:**
```typescript
// lib/services/medication.service.ts
export class MedicationService {
  static async getMedications(userId: string): Promise<Medication[]> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }
}
```

**Benefits:**
- ✅ No coupling with React
- ✅ Easy to test (unit tests)
- ✅ Can be moved to backend as-is
- ✅ Reusable across different frontends

---

### 2. **Custom Hooks Layer** (`hooks/`)
**React wrappers around services**

- Manages loading/error states
- Handles React lifecycle (useEffect, useCallback)
- Updates Zustand stores
- Provides user-friendly API for components

**Example:**
```typescript
// hooks/useMedications.ts
export function useMedications() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMedications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await MedicationService.getMedications(userId);
      setMedications(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { loading, error, loadMedications };
}
```

**Benefits:**
- ✅ Separates React concerns from business logic
- ✅ Reusable across components
- ✅ Consistent loading/error handling
- ✅ Easy to swap out services

---

### 3. **Store Layer** (`store/`)
**Zustand global state management**

- Manages app-wide state
- Optimistic updates
- Persistence (localStorage)

**Example:**
```typescript
// store/useMedicationStore.ts
export const useMedicationStore = create<MedicationStore>((set) => ({
  medications: [],
  setMedications: (medications) => set({ medications }),
  addMedication: (medication) =>
    set((state) => ({
      medications: [...state.medications, medication]
    })),
}));
```

---

### 4. **Component Layer** (`app/`, `components/`)
**React UI components**

- Uses custom hooks (not services directly)
- Focuses on presentation
- Senior-friendly UI/UX

**Example:**
```typescript
// app/[locale]/medications/page.tsx
export default function MedicationsPage() {
  const { medications, loading, createMedication } = useMedications();

  // Component just handles UI
  return <div>...</div>;
}
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     Component Layer                      │
│                   (React Components)                     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ uses
                        ▼
┌─────────────────────────────────────────────────────────┐
│                      Hooks Layer                         │
│          (useMedications, useHealthRecords)              │
│                                                           │
│  • Manages loading/error states                          │
│  • Calls services                                         │
│  • Updates stores                                         │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ calls
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│     (MedicationService, HealthService, UserService)      │
│                                                           │
│  • Pure business logic                                    │
│  • No React dependencies                                  │
│  • Can be extracted to backend                            │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ queries
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase Client                       │
│                  (PostgreSQL Database)                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Migration Path to NestJS

### Current (Phase 1)
```
Frontend (Next.js) → Services → Supabase
```

### Future (Phase 2-3)
```
Frontend (Next.js) → Hooks → API Routes → NestJS Backend → Supabase
```

**Steps:**
1. Extract `lib/services/` to NestJS backend
2. Convert services to NestJS providers
3. Update hooks to call backend API instead of Supabase directly
4. Keep hooks layer unchanged (same interface)

**Example Migration:**

**Before (Current):**
```typescript
// hooks/useMedications.ts
const data = await MedicationService.getMedications(userId);
```

**After (NestJS Backend):**
```typescript
// hooks/useMedications.ts
const response = await fetch('/api/medications');
const data = await response.json();
```

**NestJS Backend:**
```typescript
// backend/src/medication/medication.service.ts
@Injectable()
export class MedicationService {
  async getMedications(userId: string) {
    // Same logic as current MedicationService
    return this.supabase.from('medications').select('*');
  }
}
```

---

## 📦 Service Layer Methods

### MedicationService
```typescript
✓ getMedications(userId)
✓ getMedicationById(id)
✓ createMedication(medication)
✓ updateMedication(id, updates)
✓ deleteMedication(id)
✓ getTodayLogs(userId)
✓ markLogAsTaken(logId)
✓ markLogAsSkipped(logId)
✓ generateMedicationLogs(medicationId, userId, times, days)
✓ getAdherenceRate(userId, days)
✓ getLowStockMedications(userId, threshold)
```

### HealthService
```typescript
✓ getHealthRecords(userId, type?)
✓ getRecordsByDateRange(userId, startDate, endDate, type?)
✓ getLatestRecord(userId, type)
✓ createHealthRecord(record)
✓ createBloodPressureRecord(userId, systolic, diastolic, notes?)
✓ createBloodSugarRecord(userId, value, notes?)
✓ createWeightRecord(userId, value, notes?)
✓ getHealthStats(userId, type, days)
✓ isBloodPressureNormal(systolic, diastolic)
✓ isBloodSugarNormal(value, fasting)
```

### UserService
```typescript
✓ getUserById(id)
✓ getUserByEmail(email)
✓ createUser(user)
✓ updateUser(id, updates)
✓ getFamilyMembers(seniorId)
✓ getLinkedSeniors(familyId)
✓ getCurrentUser()
✓ uploadProfileImage(userId, file)
```

---

## 🎯 Design Principles

1. **Separation of Concerns**
   - Services = Business Logic
   - Hooks = React Integration
   - Components = UI

2. **Single Responsibility**
   - Each service handles one domain
   - Each hook wraps one service

3. **Dependency Inversion**
   - Components depend on hooks (abstractions)
   - Hooks depend on services (abstractions)
   - Services depend on Supabase client

4. **Easy Testing**
   - Services can be unit tested
   - Hooks can be tested with React Testing Library
   - Components can be tested in isolation

5. **Migration Ready**
   - Service layer is backend-agnostic
   - Can switch from Supabase to any backend
   - Hooks provide stable interface

---

## 📝 Naming Conventions

### Services
- PascalCase class names: `MedicationService`
- Static methods: `createMedication()`
- Descriptive method names: `getLowStockMedications()`

### Hooks
- camelCase with `use` prefix: `useMedications()`
- Return object with clear names: `{ loading, error, createMedication }`

### Stores
- camelCase with `use` prefix: `useMedicationStore()`
- Action names: `addMedication()`, `updateMedication()`

---

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Family members can access linked senior's data (based on permissions)
- API keys stored in environment variables

---

## 📊 State Management Strategy

1. **Server State** (Supabase data)
   - Managed by hooks
   - Cached in Zustand stores
   - Refreshed on user actions

2. **Client State** (UI state)
   - Managed by React useState
   - Local to components

3. **Global State** (User session, preferences)
   - Managed by Zustand
   - Persisted to localStorage

---

## 🌐 Internationalization

- Supports 10 languages (ko, en, ja, zh-TW, zh-CN, vi, th, es, fr, de)
- Uses next-intl
- Locale-based routing: `/ko/medications`, `/en/medications`

---

## 🎨 UI/UX Guidelines

- **Senior-Friendly Design**
  - Large text (minimum 16px, default 18-20px)
  - High contrast colors
  - Large touch targets (minimum 44px)
  - Simple, clear navigation

- **Responsive Design**
  - Mobile-first approach
  - Breakpoints: sm, md, lg, xl
  - Flexible layouts

---

This architecture ensures:
✅ Clean code separation
✅ Easy testing
✅ Scalability
✅ Backend migration readiness
✅ Maintainability
