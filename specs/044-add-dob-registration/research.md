# Research: Add Date of Birth Field to User Registration

**Branch**: `044-add-dob-registration` | **Date**: 2026-04-23
**Phase**: 0 — Unknowns resolved before design

---

## Decision 1: Date Picker Library

**Decision**: Install `@react-native-community/datetimepicker` via Expo

**Rationale**:
- Renders the OS-native date picker (iOS UIDatePicker, Android DatePickerDialog) — gives full accessibility for free (VoiceOver/TalkBack wired up by the OS)
- Fully compatible with Expo managed workflow (`npx expo install @react-native-community/datetimepicker`)
- Supports `minimumDate` and `maximumDate` props — directly satisfies the "disable future dates" and "disable dates >200 years past" requirements without custom logic
- `mode="date"` returns a JavaScript `Date` object — straightforward to format to MM-DD-YYYY for display

**Alternatives considered**:
- **Custom modal calendar (built from scratch)**: Rejected — significant implementation effort, accessibility must be hand-wired, higher maintenance burden; no added UX value over the native picker
- **react-native-date-picker**: Rejected — requires native module linking not supported in Expo managed workflow without ejecting
- **Expo DateTimePicker (same package)**: This IS `@react-native-community/datetimepicker` — Expo wraps it under the same name; same library, confirmed approach

---

## Decision 2: Date Format — Display vs. Storage

**Decision**: Both display and API use `MM-DD-YYYY` format — the backend accepts this format directly.

**Rationale**:
- MM-DD-YYYY is specified in the Jira ticket (SCRUM-47) for user-facing display
- The backend API confirmed it accepts `MM-DD-YYYY` — no conversion needed between display and wire format
- `formatDobForDisplay` and `formatDobForApi` both produce `MM-DD-YYYY`; having two functions with the same output maintains a clean boundary in case the backend format diverges in future

**Alternatives considered**:
- Sending ISO 8601 (`YYYY-MM-DD`) to the backend: Rejected — backend parses `MM-DD-YYYY` directly; sending ISO would cause validation failure

---

## Decision 3: Form Integration Pattern

**Decision**: Use `react-hook-form` `Controller` wrapping the native date picker; zod schema validation for the `dateOfBirth` field

**Rationale**:
- `register.tsx` already uses `useState` directly (not yet migrated to `react-hook-form`) — the DOB field will be added in the same `useState` pattern for consistency with the existing form, rather than introducing `Controller` in isolation
- Validation logic (required, max 200 years, no future dates) is encapsulated in a dedicated `dob-validation.ts` module, making it independently testable
- Zod is already installed (`^4.3.6`) — use `z.string()` with `.refine()` to validate the ISO date string

**Alternatives considered**:
- Full form migration to react-hook-form + Controller for the entire register screen: Deferred — out of scope for this bug fix; can be a separate refactor task

---

## Decision 4: Backend Contract Gap

**Decision**: Backend `/auth/register` endpoint must be updated to accept `dateOfBirth`; this is an external dependency

**Rationale**:
- Current `auth-api.ts` sends: `fullName`, `email`, `password`, `confirmPassword`
- The backend source is not in this repository — it is a separate `.NET` service
- The `RegisterResponse` and `UserAccount` types do not include `dateOfBirth`
- Backend team must add the field before end-to-end testing is possible

**Required change on backend side**:
- Add `dateOfBirth` (nullable initially, required once frontend ships) to the register request model
- Store as `DateOnly` in the patient record
- Validate: must be a past date; must not be more than 200 years ago
- Return `dateOfBirth` in `RegisterResponse` for confirmation

**Risk**: If backend change is delayed, mobile development can proceed with the field present in the UI and API payload — the backend will simply ignore the field until it is wired up. A feature flag or phased rollout is not needed; the field can be sent and ignored safely.

---

## Decision 5: Stitch Design Alignment

**Decision**: Stitch `Registration` screen review is a hard prerequisite for implementation

**Rationale**:
- Constitution Principle III mandates that all patient-facing mobile screens are driven by the Stitch design before implementation
- Stitch project `Remix of Mobile - Patient Auth & Profile` (ID: `12210324048331832562`) includes `Registration` in the required screen inventory
- The DOB field placement (after phone / before email, or at end of form), calendar interaction pattern, and empty/error states must match what is shown in Stitch before any code is written

**Action required**: Design team must update or confirm the Stitch `Registration` screen to include the DOB date picker before development task kick-off.

---

## Decision 6: Validation Boundary Rules

**Decision**: Apply the following date boundaries:
- **Maximum date** (calendar `maximumDate`): today (current date at render time) — prevents future date selection
- **Minimum date** (calendar `minimumDate`): today minus 200 years — prevents age >200 years
- **Required**: field must not be empty; form submission blocked if no date selected

**Leap year handling**: Delegated to the OS native picker — no custom logic required; the native picker correctly handles February 29 on leap vs. non-leap years.

**Manual text input**: The native `@react-native-community/datetimepicker` does not allow free-text entry — users can only select via the calendar UI, eliminating invalid manual input entirely on iOS. On Android, some modes allow text input; `mode="date"` with `display="calendar"` or `display="spinner"` restricts this.
