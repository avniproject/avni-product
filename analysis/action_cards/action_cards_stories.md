# Action Cards — Stories

Stories are grouped by repository. Each will become a GitHub issue in its respective repo, linked to the epic in avni-product.

---

## avni-server

## Add action configuration fields to ReportCard · `avni-server`

**As a** platform developer, **I need** the ReportCard entity to store and serve action configuration, **so that** mobile clients can sync and act on it.

### Acceptance Criteria
- [ ] New Flyway migration adds three columns to `report_card`:
  - `action` — NOT NULL, default `ShowSubject`, following existing enum storage pattern
  - `action_detail` — JSONB, nullable (only populated when action = `PerformVisit`)
  - `on_action_completion` — NOT NULL, default `SubjectProfile`, following existing enum storage pattern
- [ ] Migration backfills `action = ShowSubject` and `on_action_completion = SubjectProfile` on all existing rows
- [ ] `ReportCard.java` entity has fields and getters/setters for all three new columns
- [ ] `CardService` validates: if `action = PerformVisit`, `action_detail` must contain a valid encounter type UUID; throws `BadRequestError` if missing
- [ ] Action fields are accepted and persisted via POST `/web/reportCard` and PUT `/web/reportCard/{id}`
- [ ] New fields are included in the org export zip (`ReportCardBundleContract`, `ReportCardBundleRequest`)
- [ ] Org import correctly reads and applies the new fields (`CardService.uploadCard`)
- [ ] Sync endpoint `/v2/card/search/lastModified` returns the new fields to mobile clients

### Technical Details
- Migration: next available `V1_XXX` file in `avni-server-data/src/main/resources/db/migration/`; check the latest number before creating
- `action` and `on_action_completion` column type: follow how other simple enum-like string fields are stored in the schema; prefer readability over performance (small table)
- `action_detail` JSONB: store as `{"encounterTypeUUID": "<uuid>"}` — follow the `@Type(JSONObjectUserType.class)` pattern used for `standardReportCardInput` in `ReportCard.java` (lines 41–43); provide `getActionDetailEncounterTypeUUID()` and `setActionDetailEncounterTypeUUID(String)` helpers
- Validation pattern: follow `CardService.buildStandardReportCardInputRecentDuration()` (lines 132–141) — check type support, clear field if not applicable, throw `BadRequestError` if required but missing
- `ReportCardRequest.java` (parent of `ReportCardWebRequest`): add the three new fields here
- `ReportCardBundleContract` / `ReportCardBundleRequest`: serialise `action` and `on_action_completion` as strings, `action_detail` encounter type as a UUID string — follow the existing pattern for `standardReportCardType` and `standardReportCardInputEncounterTypes`

### Testing Gotchas
- Existing cards (pre-migration) must behave identically after migration — `ShowSubject` default must be transparent to old clients
- Export → import round-trip: verify `PerformVisit` cards survive an org bundle cycle with encounter type UUID intact
- Excluded card types (approval, task, comment, DueChecklist): `CardService` should not validate or require action detail for these — test that saving them with `action = ShowSubject` (default) works without error
- The sync endpoint must not break for old mobile clients that do not yet read the new fields

---

## avni-models

## Add action fields to ReportCard Realm schema · `avni-models`

**As a** mobile developer, **I need** the ReportCard model to include action configuration fields, **so that** avni-client can read and use them after sync.

### Acceptance Criteria
- [ ] `ReportCard.js` Realm schema includes:
  - `action` — string, NOT NULL in practice (default `ShowSubject`)
  - `actionEncounterType` — optional object reference to `EncounterType`
  - `onActionCompletion` — string, NOT NULL in practice (default `SubjectProfile`)
- [ ] Helper methods added to `ReportCard.js`:
  - `isActionPerformVisit()` — returns `true` when `action === 'PerformVisit'`
  - `isOnActionCompletionHome()` — returns `true` when `onActionCompletion === 'Home'`
  - `isActionSupported()` — returns `false` for approval types, task types, comment type, and `DueChecklist`; returns `true` for all other card types (including custom/query cards)
- [ ] `fromResource` / sync mapping populates the three new fields from the server response
- [ ] Package version bumped and published

### Technical Details
- File: `src/ReportCard.js`
- Schema pattern for optional object reference (line 21 existing): `{ type: 'object', objectType: 'EncounterType', optional: true }`
- `actionEncounterType` is resolved from `action_detail.encounterTypeUUID` in the sync response — check how `ReportCardService` on avni-client maps server responses to Realm objects to follow the correct pattern
- `isActionSupported()` logic: `standardReportCardType` is null (custom card) → `true`; call `standardReportCardType.isApprovalType()`, `isTaskType()`, `isCommentType()`, or `isChecklistType()` → `false`; all other standard types → `true`

### Testing Gotchas
- Realm schema changes require a schema version bump in avni-client — the developer picking up the avni-client story must handle this
- `isActionSupported()` must correctly return `false` for every excluded type — test all values of `StandardReportCardTypeType`, not just representative ones
- Cards synced before this feature ships will have `action = ShowSubject` and `onActionCompletion = SubjectProfile` from the server migration backfill — verify these deserialise correctly

---

## avni-webapp

## Report card admin UI — configure action fields · `avni-webapp`

**As an** administrator, **I need** to configure Action, Action Detail, and On Action Completion on a report card, **so that** field workers get direct-action behaviour for single-subject cards.

### Acceptance Criteria
- [ ] Action dropdown is shown on the report card edit form for eligible card types; hidden for excluded types (approval types, task types, Comments, DueChecklist)
  - Options: `Show Subject` (default), `Perform Visit`
- [ ] When Action = `Perform Visit`, an Action Detail section appears with a **single-select** encounter type picker
- [ ] Action Detail is required when Action = `Perform Visit`; form shows a validation error if it is empty and the user attempts to save
- [ ] On Action Completion dropdown is shown when Action = `Perform Visit`
  - Options: `Subject Profile` (default), `Home`
- [ ] When Action changes away from `Perform Visit`, Action Detail is cleared and On Action Completion resets to `Subject Profile`
- [ ] When card type changes to an excluded type, action fields are hidden and their values are reset
- [ ] All three fields are saved correctly on POST/PUT to `/web/reportCard`
- [ ] All three fields are correctly loaded and pre-populated when editing an existing card

### Technical Details
- File: `src/formDesigner/components/ReportCard/CreateEditReportCard.jsx`
  - Add Action dropdown using `AvniSelect` — follow the `standardReportCardType` dropdown pattern (lines 273–302)
  - Conditionally render Action Detail and On Action Completion using the same guard pattern as existing conditional fields (e.g. `{card.isSubjectTypeFilterSupported() && ...}`)
  - For Action Detail, use a single-select variant of encounter type loading — the encounter type list endpoint is `/web/encounterType/v2`; filter by the subject types and programs already configured on the card (same params as `EncounterTypeSelect`)
- File: `src/common/model/WebReportCard.js`
  - Add `action`, `actionEncounterType`, `onActionCompletion` properties
  - Update `createNewReportCard()` with defaults (`ShowSubject`, `SubjectProfile`)
  - Update `fromResource()` to map the new server fields
  - Update `toResource()` to serialise: `action` as string, `actionEncounterTypeUUID` as UUID string, `onActionCompletion` as string
  - Update `clone()` to copy the new fields
  - Add `isActionSupported()` helper (mirrors logic in avni-models) for conditional rendering
  - Add validation in `validateCard()`: missing encounter type when action = PerformVisit → new error key e.g. `MISSING_ACTION_DETAIL`
- File: `src/formDesigner/components/ReportCard/ReportCardReducer.jsx`
  - Add reducer keys: `action`, `actionEncounterType`, `onActionCompletion`
  - When `action` changes to a non-PerformVisit value, reset `actionEncounterType` to null in the same case

### Testing Gotchas
- Switching from `PerformVisit` → `Show Subject`: `actionEncounterTypeUUID` must not be sent in the request body
- Editing a card saved before this feature: `action` will arrive as `ShowSubject` from the server — verify the form loads and displays sensibly with no Action Detail shown
- Excluded card types: confirm action fields are absent from the DOM entirely, not merely hidden, to prevent stale state from being submitted
- The encounter type picker for Action Detail should filter by the card's configured subject types/programs — verify it does not show encounter types irrelevant to the card's subjects

---

## avni-client

## Execute configured action directly for single-subject report cards · `avni-client`

**As a** field worker, **I need** the app to directly perform the configured action when a report card shows exactly one subject, **so that** I can complete tasks without navigating through a listing screen.

### Acceptance Criteria
- [ ] When a card result contains exactly one subject and `action = PerformVisit`, the app opens the encounter form directly — no listing screen is shown
- [ ] When a card result contains more than one subject, the app navigates to the listing screen as before; action configuration is ignored
- [ ] When `action = ShowSubject` (or is absent), behaviour is identical to today for all subject counts
- [ ] When the visit form is saved and `onActionCompletion = Home`, the app navigates to LandingView with the back stack cleared
- [ ] When `onActionCompletion = SubjectProfile` (default), post-visit navigation uses the existing default behaviour — no regression
- [ ] The single-subject shortcut works for all eligible card types: `ScheduledVisits`, `OverdueVisits`, `Total`, `RecentRegistrations`, `RecentEnrolments`, `RecentVisits`, and custom query cards
- [ ] Realm schema version is bumped to account for the new fields added in avni-models

### Technical Details
- Primary change: `CustomDashboardActions.js` `onCardPress` — after `getReportCardResult()`, before calling `action.onCustomRecordCardResults()`, add:
  ```
  if (reportCard.isActionPerformVisit() && result.length === 1) {
    // direct action path
  } else {
    // existing listing navigation (unchanged)
  }
  ```
- Use helper methods from avni-models (`isActionPerformVisit()`, `isOnActionCompletionHome()`) — ensure avni-models is updated and re-linked before this work begins
- Use `CHSNavigator.proceedEncounter()` (`CHSNavigator.js`) to launch the visit form; pass an `onSaveCallback` that navigates to LandingView when `isOnActionCompletionHome()`, or invokes existing default post-visit navigation otherwise
- The visit lookup strategy (finding an existing scheduled encounter vs creating unscheduled) is an implementation decision for the developer — consider the card type and what `result[0]` already contains
- LandingView navigation: use `TypedTransition.resetStack` to clear the back stack so the user cannot navigate back into the completed visit form

### Testing Gotchas
- Cards with `action = ShowSubject` (all existing cards after migration backfill): must behave exactly as before — run the full existing card-press flow as a regression test
- Custom query cards: the result shape may differ from standard card results; verify `result.length === 1` correctly identifies a single subject for custom cards
- `onActionCompletion = Home` with back stack cleared: ensure pressing the Android back button from LandingView after the action does not return to the visit form
- Realm migration: bump the schema version in the client to match the new fields added in avni-models; missing this causes a Realm schema mismatch crash on upgrade
- Test on a device with an existing Realm database (upgrade scenario), not only a fresh install

---

## avni-product

## Document Action Cards feature · `avni-product`

**As a** developer or implementer, **I need** documentation on the Action Cards feature, **so that** I can configure it correctly in a new or existing organisation.

### Acceptance Criteria
- [ ] Readme updated with a description of the three new report card fields (Action, Action Detail, On Action Completion)
- [ ] Valid values for each field documented with their effects
- [ ] Card type eligibility (which types support actions and which do not) documented
- [ ] Single-subject trigger condition documented
- [ ] Configuration walkthrough or example included

### Technical Details
- Update the relevant section of the Avni readme (avni.readme.io docs or the repo's own docs, whichever covers report cards)

### Testing Gotchas
- Verify documented field names match what appears in the admin UI and what is stored in the database — naming can drift between layers
