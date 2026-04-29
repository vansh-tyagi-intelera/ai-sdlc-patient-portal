# Data Model: Add Date of Birth Field to User Registration

**Branch**: `044-add-dob-registration` | **Date**: 2026-04-23

---

## Entity: Patient Registration Request

Represents the data payload sent when a new patient creates an account.

| Field             | Type     | Required | Validation                                                    | Display Format |
|-------------------|----------|----------|---------------------------------------------------------------|----------------|
| `fullName`        | string   | Yes      | Non-empty                                                     | As entered     |
| `email`           | string   | Yes      | Valid email format                                            | As entered     |
| `password`        | string   | Yes      | Min 8 chars, 1 uppercase, 1 special char, 1 digit            | Hidden (••••)  |
| `confirmPassword` | string   | Yes      | Must match `password`                                         | Hidden (••••)  |
| `dateOfBirth`     | string   | **Yes**  | `MM-DD-YYYY`; not in future; max 200 yrs ago                 | MM-DD-YYYY     |

**New field**: `dateOfBirth` — added by this feature.

---

## Entity: Register Response

Represents the data returned after successful registration.

| Field         | Type   | Notes                        |
|---------------|--------|------------------------------|
| `userId`      | string | Unique patient identifier    |
| `email`       | string | Registered email address     |
| `firstName`   | string | Parsed from `fullName`       |
| `lastName`    | string | Parsed from `fullName`       |
| `dateOfBirth` | string | ISO 8601 echo-back (new)     |
| `message`     | string | Confirmation message         |

**New field**: `dateOfBirth` — backend team must add to response; mobile type update required.

---

## TypeScript Type Changes

### `mobile/src/types/auth.ts` — additions

```typescript
// Extend RegisterResponse
export type RegisterResponse = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;  // NEW — MM-DD-YYYY
  message: string;
};

// Extend UserAccount (used by auth store and profile screens)
export type UserAccount = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  dateOfBirth?: string;  // NEW — MM-DD-YYYY; optional until all login responses include it
};
```

### `mobile/src/services/auth-api.ts` — additions

```typescript
// Updated apiRegister signature
export async function apiRegister(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
  dateOfBirth: string,  // NEW — MM-DD-YYYY
): Promise<RegisterResponse>
```

---

## Validation Rules

| Rule                   | Logic                                      | Error Message                                     |
|------------------------|--------------------------------------------|---------------------------------------------------|
| Required               | `dateOfBirth` must not be empty/null       | "Date of birth is required."                      |
| No future date         | `dateOfBirth` ≤ today's date               | "Date of birth cannot be in the future."          |
| Max age 200 years      | `dateOfBirth` ≥ today minus 200 years      | "Please enter a valid date of birth."             |
| Valid date             | Parsed date must be a real calendar date   | Handled by native picker (no manual entry)        |

---

## State Transitions: Date Picker Field

```
INITIAL (no date selected)
    │
    ▼ [user taps field]
PICKER_OPEN
    │
    ├─► [user selects date] → DATE_SELECTED (date stored, calendar closed)
    │                                │
    │                                ▼ [user submits form without date]
    │                           VALID — proceed
    │
    └─► [user dismisses / cancels] → INITIAL (no change)
                │
                ▼ [user submits form without date]
           VALIDATION_ERROR (required message shown)
```

---

## Date Format Conversions

| Context                    | Format        | Example         |
|----------------------------|---------------|-----------------|
| Native picker output       | `Date` object | `Date(2000, 5, 15)` |
| Display to user (UI)       | MM-DD-YYYY    | `06-15-2000`    |
| Sent to backend API        | YYYY-MM-DD    | `2000-06-15`    |
| Stored in backend DB       | `DateOnly`    | `2000-06-15`    |
