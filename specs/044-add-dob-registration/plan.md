# Implementation Plan: Add Date of Birth Field to User Registration

**Branch**: `044-add-dob-registration` | **Date**: 2026-04-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/044-add-dob-registration/spec.md`

## Summary

Add a required Date of Birth field to the mobile patient registration screen (`mobile/app/register.tsx`). The field opens a native calendar picker on tap, enforces MM-DD-YYYY display format, disables future dates and dates more than 200 years in the past, and blocks form submission when empty. The backend `/auth/register` endpoint must be extended to accept and persist a `dateOfBirth` value; this is the primary external dependency.

## Technical Context

**Language/Version**: TypeScript 5.9 (mobile)
**Primary Dependencies**: React Native 0.81.5, Expo ~54, expo-router ~6, react-hook-form ^7.72, zod ^4.3.6, @react-native-community/datetimepicker (to be installed)
**Storage**: Backend REST API at `localhost:8080/api/v1` — `.NET` service (PatientPortal.Api); source not in this repo
**Testing**: Jest ^30 + @testing-library/react-native ^13 (unit/integration); no mobile E2E runner configured yet
**Target Platform**: iOS and Android via React Native (Expo managed workflow)
**Project Type**: Mobile application — patient-facing registration flow
**Performance Goals**: ≥55 fps during form interaction; calendar picker opens within 100ms of tap; app startup ≤2s cold
**Constraints**: Stitch `Registration` screen design must be reviewed before implementation; WCAG 2.1 AA / VoiceOver / TalkBack required; website has no registration flow and is out of scope
**Scale/Scope**: Single screen change; 1 new component, 1 modified screen, 1 modified API call, 1 modified type file, 1 new validation schema

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Code Quality (Principle I)**: TypeScript 5.9 and React Native 0.81.5 confirmed; ESLint + typescript-eslint already configured in `mobile/`
  - Linting tool: ESLint with typescript-eslint (configured in `mobile/package.json`)
  - Code coverage target: 80% for date validation business logic, 70% for the date picker UI component

- [x] **Test-Driven (Principle II)**: Jest ^30 + @testing-library/react-native ^13 already installed
  - Testing tool: Jest (mobile) with `jest-expo` preset
  - Unit test strategy: date validation boundary logic (today, 200-year limit, leap years), picker component state transitions (open/close/select)
  - Integration test scope: full registration form submission with `dateOfBirth` in payload; required-field validation blocking submission

- [x] **UX Consistency (Principle III — Stitch-Driven)**:
  - Design system: Stitch project `Remix of Mobile - Patient Auth & Profile` (`12210324048331832562`) — `Registration` screen is in the required inventory
  - **HARD DEPENDENCY**: Stitch `Registration` screen must be reviewed for DOB field placement and calendar design before implementation begins
  - Accessibility: VoiceOver (iOS) and TalkBack (Android) labels required on the date picker; touch target ≥44×44pt

- [x] **Performance (Principle IV)**:
  - Response time: Calendar picker opens ≤100ms; backend registration p95 ≤200ms (existing SLA, no degradation expected)
  - Memory: ≤150MB peak; native date picker component adds negligible overhead
  - Performance testing: Manual benchmark + Expo DevTools profiling; CI lint/type check gates

**Gate Status**: ✅ PASS — all gates cleared. Stitch design review is a mandatory step before development starts (Principle III).

## Project Structure

### Documentation (this feature)

```text
specs/044-add-dob-registration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── register-endpoint.md   # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (mobile — primary change surface)

```text
mobile/
├── app/
│   └── register.tsx                          # MODIFY — add DOB DatePickerField, state, validation
├── src/
│   ├── components/forms/
│   │   ├── text-field.tsx                    # EXISTING — no change
│   │   └── date-picker-field.tsx             # CREATE — reusable DOB picker component
│   ├── services/
│   │   └── auth-api.ts                       # MODIFY — add dateOfBirth to apiRegister payload
│   └── types/
│       └── auth.ts                           # MODIFY — add dateOfBirth to RegisterRequest type
├── __tests__/
│   ├── components/forms/
│   │   └── date-picker-field.test.tsx        # CREATE — picker open/close/select unit tests
│   └── features/auth/
│       └── dob-validation.test.ts            # CREATE — boundary validation unit tests
└── package.json                              # MODIFY — add @react-native-community/datetimepicker
```

**Structure Decision**: Mobile-only change. No website changes (no web registration flow exists). Backend contract change required — communicated via `contracts/register-endpoint.md`.

## Complexity Tracking

No constitution violations. No new architectural patterns introduced — follows existing `TextField` component model and `react-hook-form` integration already used in the project.
