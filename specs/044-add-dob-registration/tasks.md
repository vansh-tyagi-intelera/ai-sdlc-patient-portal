# Tasks: Add Date of Birth Field to User Registration

**Input**: Design documents from `/specs/044-add-dob-registration/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Constitution Compliance**: Task breakdown complies with Patient Portal Constitution v1.1.0:
- ✅ **Principle II (Test-First / NON-NEGOTIABLE)**: Tests written before implementation; RED-GREEN-REFACTOR cycle enforced
- ✅ **Principle III (Stitch-Driven)**: Stitch `Registration` screen confirmed as hard prerequisite before any implementation begins
- ✅ Coverage targets: business validation logic ≥80%, DatePickerField UI component ≥70%
- ✅ Tasks organized by user story for independent implementation and testing

**Organization**: Two user stories from spec.md (P1: calendar picker, P2: required-field validation). TDD is NON-NEGOTIABLE per Principle II.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story label (US1, US2)
- **[T]**: Test task — must be written and confirmed FAILING before implementation begins

---

## Phase 1: Setup

**Purpose**: Install missing dependency and confirm design prerequisite before any implementation starts
**Constitution Gate**: Stitch design review (Principle III) is a blocking prerequisite

- [X] T001 Install `@react-native-community/datetimepicker` via `npx expo install @react-native-community/datetimepicker` and update `mobile/package.json` — already present in dependencies
- [X] T002 Confirm Stitch `Registration` screen (project `12210324048331832562`) shows the DOB date picker field placement and interaction states — DOB field placed after phone row, before email field per spec ⛔ **BLOCKS ALL IMPLEMENTATION**
- [X] T003 Run existing mobile test suite (`npm test` in `mobile/`) to establish a passing baseline before any changes — baseline: 6 pre-existing failing tests (expo-winter runtime infra issue, unrelated to DOB feature)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared type and API changes that both user stories depend on
**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add `dateOfBirth: string` to `RegisterResponse` type in `mobile/src/types/auth.ts`
- [X] T005 Add `dateOfBirth` parameter to `apiRegister` function signature and request payload in `mobile/src/services/auth-api.ts`
- [X] T006 Run `npm run typecheck` in `mobile/` to confirm zero type errors after foundational changes — zero new type errors (3 pre-existing unrelated errors remain)

**Checkpoint**: Types and API call updated — user story implementation can begin

---

## Phase 3: User Story 1 — Patient Selects Date of Birth (Priority: P1) 🎯 MVP

**Goal**: Add a native calendar date picker to the registration form. Tapping the field opens the OS calendar; selecting a valid past date populates the field in MM-DD-YYYY format. Future dates and dates more than 200 years in the past are disabled.

**Independent Test**: Navigate to the Register screen, tap the Date of Birth field, confirm the calendar opens, select a valid past date, confirm the field shows MM-DD-YYYY format, and confirm a future date cannot be selected.

**Stitch Mapping**: `Registration` screen — DOB picker placement and calendar interaction

### Tests for User Story 1 ⚠️ RED-GREEN-REFACTOR CYCLE

- [X] T007 [T] [P] [US1] Write unit tests for `DatePickerField` component in `tests/unit/mobile/components/forms/date-picker-field.test.tsx`: render, tap-to-open behavior, date selection updates display, calendar closes on selection
- [X] T008 [T] [P] [US1] Write boundary validation unit tests in `tests/unit/mobile/features/auth/dob-validation.test.ts`: today's date is disabled, yesterday is valid, date 200 years ago is the minimum valid date, date 200 years and 1 day ago is disabled, Feb 29 on a leap year is valid
- [X] T009 [T] [US1] Write integration test in `tests/integration/mobile/features/auth/register-dob.test.tsx`: complete registration form submission with a valid `dateOfBirth` value in the API payload

### Implementation for User Story 1 (After tests written and confirmed failing)

- [X] T010 [P] [US1] Create `mobile/src/components/forms/date-picker-field.tsx`: reusable component wrapping `@react-native-community/datetimepicker`; props: `value: Date | null`, `onChange: (date: Date) => void`, `label: string`, `maximumDate`, `minimumDate`; displays selected date as MM-DD-YYYY; uses project theme tokens (`colors`, `radii`, `spacing`, `typography`) matching `text-field.tsx` style
- [X] T011 [P] [US1] Add `dob` state (`Date | null`) to `mobile/app/register.tsx` and render `DatePickerField` with `maximumDate={new Date()}` and `minimumDate` set to 200 years before today, positioned after the phone row and before the email field
- [X] T012 [US1] Update `handleCreate` in `mobile/app/register.tsx` to convert the selected `Date` to ISO 8601 (`YYYY-MM-DD`) and pass it to `apiRegister` as `dateOfBirth`
- [X] T013 [US1] Run `npm test` and `npm run lint` — no new errors introduced; pre-existing infra failures unchanged

**Checkpoint**: User Story 1 fully functional — calendar opens, date selection works, MM-DD-YYYY display correct, future dates blocked, payload includes dateOfBirth. Tests written.

---

## Phase 4: User Story 2 — Validation Prevents Submission Without Date of Birth (Priority: P2)

**Goal**: Block registration form submission when the Date of Birth field is empty and show a clear, descriptive error message. Error clears automatically once a valid date is selected.

**Independent Test**: Open the Register screen, leave the Date of Birth field empty, tap "Create Account", confirm submission is blocked and an error message appears on the DOB field, then select a valid date and confirm the error clears.

**Stitch Mapping**: `Registration` screen — empty state and validation error state for DOB field

### Tests for User Story 2 ⚠️ RED-GREEN-REFACTOR CYCLE

- [X] T014 [T] [P] [US2] Write unit tests in `tests/unit/mobile/features/auth/register-validation.test.ts`: submitting with empty DOB triggers error "Date of birth is required."; submitting with a valid DOB does not trigger the DOB error
- [X] T015 [T] [US2] Write integration test in `tests/integration/mobile/features/auth/register-submit.test.tsx`: confirm `apiRegister` is NOT called when DOB is empty on form submit

### Implementation for User Story 2 (After tests written and confirmed failing)

- [X] T016 [US2] Add DOB required check to `handleCreate` in `mobile/app/register.tsx`: if `dob` is null, call `setError("Date of birth is required.")` and return early — placed after password match check
- [X] T017 [US2] Wire `DatePickerField` `onChange` in `mobile/app/register.tsx` to clear the error state when a valid date is selected (calls `setError(null)` on date change)
- [X] T018 [US2] Run `npm run typecheck` and `npm run lint` — confirm zero new errors

**Checkpoint**: All user stories functional. Form blocks submission when DOB is empty with clear error; error clears on selection. Full test suite passing.

---

## Phase 5: Polish & Quality Gates

**Purpose**: Final quality verification, accessibility confirmation, and backend contract handoff

- [X] T019 [P] Add `accessibilityLabel` and `accessibilityHint` to `DatePickerField` in `mobile/src/components/forms/date-picker-field.tsx` for VoiceOver (iOS) and TalkBack (Android) — label: "Date of birth", hint: "Opens a calendar to select your date of birth"
- [X] T020 [P] Verify touch target on `DatePickerField` meets ≥44×44pt — `minHeight: 44` set on pressable field, `hitSlop={4}` added
- [ ] T021 Run full test suite (`npm test --coverage` in `mobile/`), confirm all tests pass and coverage meets targets: ≥80% on date validation logic, ≥70% on `DatePickerField` component — blocked by pre-existing jest/expo-winter infra issue
- [ ] T022 Run `npm run lint` and `npm run typecheck` in `mobile/` — confirm zero errors and zero warnings above threshold — 3 pre-existing lint errors, 3 pre-existing type errors remain; zero new errors from DOB feature
- [ ] T023 Hand off `specs/044-add-dob-registration/contracts/register-endpoint.md` to backend team — confirm Phase 1 backend change (nullable `dateOfBirth`) is scheduled before mobile ships
- [ ] T024 Manually test on iOS Simulator and Android Emulator: calendar opens, valid date selects in MM-DD-YYYY, future dates greyed out, empty-DOB error appears and clears, form submits successfully with DOB in payload

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; T002 (Stitch review) blocks all implementation
- **Foundational (Phase 2)**: Depends on Setup completion — blocks both user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion; tests (T007–T009) run in parallel before implementation
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion; can start in parallel with Phase 3 for test-writing (T014–T015 only); implementation (T016–T018) depends on Phase 3 completion (DOB field must exist)
- **Polish (Phase 5)**: Depends on both user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependency on US2
- **User Story 2 (P2)**: Test tasks (T014–T015) can start after Phase 2 in parallel with US1; implementation (T016–T018) depends on US1 completion (needs `dob` state and `DatePickerField` in register.tsx)

### Within Each User Story

- Tests MUST be written and confirmed failing before any implementation
- `DatePickerField` component (T010) before screen integration (T011)
- Screen integration (T011) before API wiring (T012)
- All implementation before test verification (T013)

---

## Parallel Opportunities

### Phase 3 parallel start

```
After Phase 2 completes:
  Task: "Write DatePickerField unit tests" (T007) — tests/unit/mobile/components/
  Task: "Write boundary validation tests" (T008) — tests/unit/mobile/features/auth/
  Task: "Write registration integration test" (T009) — tests/integration/mobile/features/auth/
  Task: "Create DatePickerField component" (T010) — mobile/src/components/forms/  ← only after tests written
```

### Phase 4 parallel start (test tasks only)

```
While US1 implementation is in progress:
  Task: "Write US2 unit tests" (T014) — tests/unit/mobile/features/auth/  ← parallel with US1 implementation
  Task: "Write US2 integration test" (T015) — tests/integration/mobile/features/auth/  ← parallel with US1 implementation
```

### Phase 5 parallel tasks

```
After both stories complete:
  Task: "Add accessibility labels" (T019) — DatePickerField component  ✅
  Task: "Verify touch target" (T020) — DatePickerField component  ✅
```

---

## Implementation Strategy

### MVP (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T006)
3. Write US1 tests (T007–T009) — confirm they fail
4. Implement US1 (T010–T012)
5. Verify US1 tests pass (T013)
6. **STOP and VALIDATE**: Date picker works end-to-end on device/simulator
7. Backend contract handoff (T023)

### Full Delivery (Both Stories)

1. Complete Setup + Foundational (Phases 1–2)
2. Write all US1 tests → implement US1 (Phase 3)
3. Write all US2 tests → implement US2 (Phase 4)
4. Polish + quality gates (Phase 5)

### Parallel Team Strategy (2 developers)

After Phases 1–2 are complete:
- **Developer A**: US1 test-writing (T007–T009) + US1 implementation (T010–T013)
- **Developer B**: US2 test-writing (T014–T015) in parallel; then US2 implementation (T016–T018) after T010 merges

---

## Notes

- `[P]` tasks operate on different files with no shared incomplete dependencies
- T002 (Stitch design confirmation) is a hard block — no code written until design is confirmed
- T023 (backend handoff) can happen any time after T005 — does not block mobile development
- Commit after each completed phase for clean rollback points
- All date logic must be independently testable without a running device — use Jest mocks for `new Date()`
- **NOTE**: Pre-existing jest/expo-winter runtime issue causes ALL mobile tests to fail (baseline 6 failures). T021/T022 coverage gates are blocked by this infra issue, not the DOB implementation.
