# Action Cards — Spec

## Primary Goals / Motivation

Report cards on the Avni Android app currently navigate the user to a listing screen (or subject profile), regardless of context. In many real-world workflows, the reason a card exists and the action to take are both known in advance — for example, a card configured to show subjects due for a specific visit. When only one subject is in the result, the user is forced to tap through a listing just to reach the action. This adds unnecessary steps and degrades the field experience.

This feature lets admins configure a card with a direct **action** (e.g., perform a visit) and control where the user lands **after** that action completes. When the card result contains exactly one subject, the action is executed directly — no listing screen shown. When there are multiple subjects, the existing listing behaviour is preserved unchanged.

The MVP focuses on the most common and impactful action: **Perform Visit**.

---

## Feature Description

Three new configuration fields are added to a report card:

### 1. Action
What happens when the card is tapped and there is exactly one subject in the result.

| Value | Behaviour |
|---|---|
| `Show Subject` *(default)* | Navigate to the Subject Profile, as today |
| `Perform Visit` | Directly start a visit for the configured encounter type |

When `Show Subject` is selected (or no action is configured), behaviour is identical to today.

### 2. Action Detail
Additional configuration required for certain actions.

- **Perform Visit**: The admin selects the **encounter type** for the visit. The app will look for a scheduled visit of this encounter type for the single subject. If found, it opens that visit. If not found, it starts an unscheduled visit of the same encounter type.

### 3. On Action Completion
Where the user is taken after the action is completed.

| Value | Screen |
|---|---|
| `Subject Profile` *(default)* | The subject's profile page |
| `Home` | The LandingView (CustomDashboard / MyDashboard) |

---

### Trigger condition
The action is executed directly **only when the card result contains exactly one subject**. If there is more than one subject, the app navigates to the listing screen as it does today — the action field has no effect on the listing screen itself.

**ScheduledVisits and OverdueVisits cards:** When one of these cards has Action = Perform Visit and the configured encounter type is set, a single subject in the result implies a single pending visit of that encounter type. The app uses the scheduled/overdue visit if present; otherwise starts an unscheduled visit.

---

### Card type eligibility

**Actions are NOT supported on:**
- Approval cards: `PendingApproval`, `Approved`, `Rejected`
- Task cards: `CallTasks`, `OpenSubjectTasks`
- `Comments`
- `DueChecklist`
- These card types will not show the Action, Action Detail, or On Action Completion fields in the admin UI

**Actions ARE supported on:**
- `ScheduledVisits`, `OverdueVisits`
- `Total`, `RecentRegistrations`, `RecentEnrolments`, `RecentVisits`
- Custom query-based cards
- Nested cards are **out of scope** for actions in this version

---

## Overall Technical Approach

### Repositories affected (in dependency order)

1. **avni-server** — stores and serves the configuration
2. **avni-models** — Realm schema consumed by avni-client (must be updated and re-linked before avni-client work begins)
3. **avni-webapp** — admin UI for configuring action fields on a card
4. **avni-client** — executes the action at runtime based on synced card config

---

### avni-server

**New DB columns on `report_card`** (new Flyway migration):
- `action` — follow existing enum storage pattern; NOT NULL, default `ShowSubject` (readable value, never null)
- `action_detail` — separate JSONB column, nullable (only meaningful when action = `PerformVisit`)
- `on_action_completion` — follow existing enum storage pattern; NOT NULL, default `SubjectProfile` (readable value, never null)

**Files to change:**
- `ReportCard.java` — add three new fields
- `ReportCardWebRequest.java` — add fields for API input
- `CardService.java` — add validation: if action = PerformVisit, action detail (encounter type) is required
- `ReportCardBundleContract.java` and `ReportCardBundleRequest.java` — include new fields in org export/import zip
- The sync endpoint (`/v2/card/search/lastModified`) derives its response from the entity and will automatically carry the new fields

**Non-goals:** No reporting changes. The fields are UI configuration only.

---

### avni-models

**File:** `ReportCard.js`

Add to the Realm schema:
- `action` — string, optional
- `actionEncounterType` — object reference to EncounterType, optional (the Action Detail for Perform Visit)
- `onActionCompletion` — string, optional

Add helper methods:
- `isActionPerformVisit()` — checks action === 'PerformVisit'
- `isOnActionCompletionHome()` — checks onActionCompletion === 'Home'
- `isActionSupported()` — returns false for excluded card types (approval, task, comment, checklist)

This package must be published/re-linked before avni-client development begins.

---

### avni-webapp

**Files to change:**
- `CreateEditReportCard.jsx` — add Action dropdown, conditional Action Detail (encounter type selector), and On Action Completion dropdown; hide all three for ineligible card types
- `WebReportCard.js` — add action, actionEncounterType, onActionCompletion fields; add `isActionSupported()` helper
- `ReportCardReducer.jsx` — add reducer cases for the three new fields

**Validation additions:**
- Action Detail (encounter type) is required when Action = Perform Visit
- On Action Completion defaults to Subject Profile; no mandatory validation needed

---

### avni-client

**`CustomDashboardActions.js`** — after fetching the card result, check if subject count === 1 AND the card has an action configured:
- If yes: skip listing navigation; directly invoke the action
- If no: existing navigation logic unchanged

**Visit execution (new helper or added to existing service):**
- Query for a scheduled/overdue visit matching the configured encounter type for the single subject
- If found: open that visit (existing visit flow)
- If not found: create and open an unscheduled visit of the configured encounter type

**Post-action navigation:**
- If `onActionCompletion === 'Home'`: navigate to LandingView after the visit form is saved
- Otherwise (default): navigate to Subject Profile

---

### Non-goals / out of scope
- No changes to reporting
- Actions beyond `Show Subject` and `Perform Visit` are deferred to future versions
- Actions on nested cards are deferred to a future version
- No changes to the listing screens (action behaviour within a listing is not in scope)
- Readme/documentation is a separate card

---

## Stories (to be written)

| Repository | Story |
|---|---|
| `avni-server` | Add action, action detail, on action completion fields — DB migration, entity, service validation, export bundle |
| `avni-models` | Add action fields to ReportCard Realm schema and helper methods |
| `avni-webapp` | Admin UI — configure action fields on a report card |
| `avni-client` | Runtime action execution — single-subject detection, visit logic, post-action navigation |
| `avni-product` | Documentation / readme update |
