# Quickstart: Add Date of Birth Field to User Registration

**Branch**: `044-add-dob-registration` | **Date**: 2026-04-23

---

## Prerequisites

- Node.js ≥20, npm ≥10
- Expo CLI installed globally or via `npx`
- iOS Simulator (Xcode) or Android Emulator (Android Studio), or a physical device with Expo Go

---

## Setup

```bash
# From repo root
cd mobile
npm install

# Install the date picker library
npx expo install @react-native-community/datetimepicker
```

---

## Run the Mobile App

```bash
cd mobile

# Start Expo dev server
npm start

# Open on iOS simulator
npm run ios

# Open on Android emulator
npm run android
```

Navigate to the **Register** screen (tap "Create Account" on the splash/login screen).

---

## Testing the DOB Field

1. Tap the **Date of Birth** field — the native OS calendar picker should open
2. Select any past date — it should populate the field in `MM-DD-YYYY` format
3. Attempt to select a future date — it should be disabled (greyed out)
4. Try to submit the form without selecting a DOB — an error message should appear
5. Select a date, then submit — registration should proceed normally

---

## Run Tests

```bash
cd mobile

# Unit tests (validation logic + picker component)
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Key Files for This Feature

| File                                                      | Purpose                                 |
|-----------------------------------------------------------|-----------------------------------------|
| `mobile/app/register.tsx`                                 | Registration screen — DOB field added here |
| `mobile/src/components/forms/date-picker-field.tsx`       | Reusable DOB picker component           |
| `mobile/src/services/auth-api.ts`                         | API call — `dateOfBirth` added to payload |
| `mobile/src/types/auth.ts`                                | TypeScript types — `dateOfBirth` added  |
| `mobile/__tests__/components/forms/date-picker-field.test.tsx` | Picker component unit tests        |
| `mobile/__tests__/features/auth/dob-validation.test.ts`   | DOB validation boundary tests          |

---

## Backend Dependency

The `/auth/register` endpoint must be updated to accept `dateOfBirth` before end-to-end testing works. See [contracts/register-endpoint.md](contracts/register-endpoint.md) for the full API contract.

While waiting for backend changes, you can verify the mobile UI and validation logic in isolation — the field will be present and validated client-side; the API call will include `dateOfBirth` in the payload even if the backend ignores it temporarily.

---

## Stitch Design Reference

Before writing any implementation code, review the `Registration` screen in the Stitch project:
- **Project**: `Remix of Mobile - Patient Auth & Profile` (ID: `12210324048331832562`)
- Confirm DOB field placement, calendar interaction, empty state, and error state match the approved design
