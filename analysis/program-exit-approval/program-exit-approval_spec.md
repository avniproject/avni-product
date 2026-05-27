# Program Exit Approval — Spec

## Primary Goals / Motivation

Avni supports an approval workflow for five entities — Subject, ProgramEnrolment, ProgramEncounter, Encounter, ChecklistItem — but **not for Program Exit**. A supervisor who fills the exit form on a beneficiary can therefore irreversibly halt the entire scheduled-visit pipeline for that subject with no second pair of eyes.

This spec closes that gap. Concretely:

- **The customer ask.** SNCU (Special Newborn Care Unit, JSSCP) wants supervisor-filed exits — driven by reasons like "permanent migration" or "death of child" — reviewed by a HOD user-group before being treated as final. Original issue: [avni-product#1388](https://github.com/avniproject/avni-product/issues/1388).
- **The platform gap.** Program Exit is the only "permanent action" in the program flow without a review layer. Exit reasons are high-impact and the resulting `isActive = false` flip stops the care schedule immediately.
- **Consistency.** Org admins already use Avni's approval workflow on enrolments and encounters. The same mental model and dashboard should extend cleanly to exits.

## Feature Description

### For the implementer (org admin, App Designer)

1. Open the App Designer → Forms → search for the ProgramExit form mapping for the relevant Program × Subject Type.
2. Toggle **Enable Approval** on. (The toggle is the same one used today for Enrolment / Encounter / Subject / Checklist forms.)
3. Assign the new **Approve Program Exit** and **Reject Program Exit** privileges to the role(s) that should approve exits (e.g., a HOD or Supervisor role).

That is the entire configuration step. Approval enforcement begins immediately for exits filed after this is enabled.

### For the field user (supervisor entering the exit on mobile)

1. Open the subject's program enrolment → tap **Exit Program** → fill the ProgramExit form → submit.
2. On submit:
   - The exit data is saved (existing behaviour): `programExitDateTime`, `programExitObservations`, `exitLocation` are written to the enrolment row.
   - `enrolment.isActive` flips to `false`. Implementer-written `nextScheduledVisits` / `decisions` rules that gate on `isActive` naturally stop generating schedules — same mechanism as today.
   - A new `EntityApprovalStatus` row is created with `entityType = ProgramExit`, `status = Pending`, linked to the enrolment by `entity_id` (long DB id).
3. The subject profile, the enrolment card, and the ProgramExitView all show the exit's approval status (Pending) alongside the exit summary.

### For the approver (HOD, mobile)

1. Opens the standard **Pending Approval** report card on the home dashboard. ProgramExit entries appear there automatically alongside any other pending approvals (the mobile card filters by FormMapping form type, so once a ProgramExit form has `enableApproval = true`, the card picks it up with no code change).
2. Taps an entry → sees the subject context, the exit form data, all observations and exit reason.
3. Taps **Approve** or **Reject**.
   - **Approve** writes a new status row with `status = Approved`. Nothing else changes.
   - **Reject** opens a comment dialog (matches existing reject UX); on confirm, writes a new status row with `status = Rejected` plus the comment. Nothing on the enrolment is mutated.

### For the supervisor after a reject

1. The rejected exit syncs down. The supervisor sees the Rejected entry on their subject profile / enrolment card with the rejection comment visible.
2. To act on it, the supervisor re-opens **ProgramExitView**:
   - **To correct and re-submit** — edit the form fields and save. This appends a new Pending `EntityApprovalStatus` row, restarting the approval cycle.
   - **To withdraw the exit** — clear the exit (existing platform behaviour, via the form-save path with `programExitDateTime` cleared). The enrolment becomes active again. No new approval row is created since `programExitDateTime` is no longer set.

This matches the existing reject UX on other entities — no new "re-submit from rejection" screen is introduced.

### Visibility surface

- **Mobile ProgramExitView** — shows the current approval status (Pending / Approved / Rejected) and the latest rejection comment if any.
- **Mobile subject profile / enrolment summary** — surfaces the same status alongside the exit summary.
- **Mobile Pending / Approved / Rejected report cards** — auto-include ProgramExit entries.
- **Webapp DEA (Data Entry App)** — same as mobile: status visible on the enrolment view.

### What does NOT change

- Existing approval flows (Subject / ProgramEnrolment / ProgramEncounter / Encounter / ChecklistItem) — zero behaviour change.
- For orgs that do not enable approval on the ProgramExit form mapping — zero behaviour change. Exit save commits as today, no status row is created.
- No new dashboard, no new screen, no new privilege concept — only the standard set extended.

## Overall Technical Approach

### Repos affected

`avni-server`, `avni-models`, `avni-client`, `avni-webapp`. **No changes** to `avni-etl`, `rules-config`, `rules-server`, `avni-media`, or `avni-infra`.

### Data model

- **New `EntityType` value: `ProgramExit`** on `EntityApprovalStatus`. Same row shape as existing approval statuses — `entity_id` is the enrolment's long DB id, `entity_type` is the new enum value.
- **No new tables, no schema changes** to `program_enrolment` or `entity_approval_status`. The existing `entity_approval_status` row model already supports multiple approval rows per `(entity_id, entity_type)` (no unique constraint), which is exactly what we need for the "re-edit → new Pending row" flow.

### Privileges

- Add **`ApproveProgramExit`** and **`RejectProgramExit`** to `PrivilegeType` (matches existing `Approve*` + `Reject*` pairs per entity).
- Flyway migration inserts the two privilege rows.
- Extend `AccessControlService.checkApprovePrivilegeOnEntityApprovalStatus()` switch with a `case ProgramExit` mapping to the new privileges.

### Sync

- New sync entity name **`ProgramExitEntityApprovalStatus`** added to `SyncEntityName` enum and registered in the `approvalStatusEntities` list. Reuses the existing `ScopeAwareService` pattern (scoped by user catchment + subject type) — mirrors `ProgramEnrolmentEntityApprovalStatus`.
- On the mobile side, `EntityService` / `EntitiesMetaData` registers `EntityApprovalStatus` for sync; only enum coverage needs verifying. The Realm schema for `EntityApprovalStatus.js` already stores `entityType` as a string — adding `ProgramExit` to the validation set is a schema-version bump.

### Server-side save flow

When `ProgramEnrolmentController` / `ProgramEnrolmentService` persists an enrolment row:

- If the save sets `programExitDateTime` (going from null to non-null, or non-null to a different value), AND the ProgramExit FormMapping for that program × subject type has `enableApproval = true` → invoke `EntityApprovalStatusService.createStatus(EntityType.ProgramExit, enrolment.id, Pending, …)`.
- If the save clears `programExitDateTime` (going from non-null to null) — no approval row is created. This is the "withdraw the exit" path; the enrolment becomes active again.
- Approve / Reject continue to go through the existing `POST /entityApprovalStatuses` endpoint; only the privilege switch and the entity-type enum need to recognise ProgramExit.

### Form-mapping configuration

- The webapp `FormSettings.jsx` already exposes the `Enable Approval` toggle for form mappings. **Verify** that the toggle is visible and persistable for FormType `ProgramExit` — the analysis suggests it already is, but a story will confirm and add a test.
- `FormMappingContract` already serialises `enableApproval`, and the bundle import handler is generic over `FormType` — bundle round-trip works without changes.

### Mobile surface

- `ProgramExitView` adds the approval-status block, matching the pattern in `ProgramEnrolmentView`.
- `ApprovalListingView` already filters by FormMapping form type — no change needed; ProgramExit auto-appears in Pending / Approved / Rejected cards once a form mapping is configured.
- `EntityApprovalStatusService` (mobile) adds `ProgramExit` to its entity-type set used for pending queries and reject calls.
- `PrivilegeService` (mobile) — verify schema → privilege mapping resolves ProgramExit to `ApproveProgramExit` / `RejectProgramExit`, not to the Enrolment privileges.

### Webapp surface

- DEA approval listing screens — confirm ProgramExit entries render correctly (most rendering is FormType-driven and should work generically).
- App Designer — confirm the `enableApproval` toggle is present and persistable for ProgramExit form mappings.

### Migration safety

- Flyway: insert privileges; **reset `enable_approval = false`** on all existing `FormMapping` rows with FormType `ProgramExit`. This guards against orgs that may have accidentally toggled it on (the toggle was reachable in the UI but the backend ignored it). The reset is the safest default — an admin who wants the workflow toggles it back on deliberately.
- Realm: schema-version bump on `EntityApprovalStatus.js` if the entityType set is enforced; otherwise additive.

### Non-goals (out of scope, restated)

- **Gating semantic.** v1 is post-hoc review only. Exit commits immediately; schedules stop immediately via `isActive`. Orgs that want alerts to continue until HOD approves must implement that in their schedule rules (by checking exit approval status).
- **Auto-undo on reject.** v1 does NOT mutate the enrolment on reject — matches existing platform behaviour for all other approval-capable entities. The supervisor manually re-opens the form to correct or withdraw.
- **Auto-cancellation of future ProgramEncounters on exit.** Not handled at the platform level; left to implementer rules that can gate on `isActive` and exit approval status.
- **Active push notification to HOD.** Approval discovery is dashboard-pull only — this is a settled platform decision.
- **Per-exit-reason gating.** Approval is all-or-nothing per form mapping; per-reason logic is implementer-rule territory.
- **Subject voiding / member-removal / cancelled-encounter approval.** Out of scope here. The cancelled/exited encounter case is tracked under Epic [#1871](https://github.com/avniproject/avni-product/issues/1871).
- **ETL surface for approval status.** No `entity_approval_status` view in ETL today; ProgramExit inherits that gap. Out of scope.
- **Per-catchment / configurable approver routing.** All users with the privilege see all pending exits in scope, same as other approvals today.

### Decisions taken (locked)

| # | Decision |
|---|---|
| 1 | **Review-after-save semantic.** Exit commits immediately; approval is post-hoc. |
| 2 | **Reject does NOT mutate the enrolment.** Only the status row changes. Matches existing pattern; the supervisor manually re-opens the form. |
| 3 | **New `ProgramExitEntityApprovalStatus`** sync entity (not piggybacked on `ProgramEnrolmentEntityApprovalStatus`). |
| 4 | **Flyway resets `enable_approval = false`** on all existing ProgramExit FormMappings on upgrade. |
| 5 | **Both `ApproveProgramExit` + `RejectProgramExit`** privileges added (existing convention: privileges in pairs). |
| 6 | **Scope = ProgramExit only.** No member removal, subject void, encounter-cancel approvals in this scope. |

### Residual risks / verification needed during build

1. **Mobile `PrivilegeService` mapping** — confirm `ProgramExit`-typed approval rows resolve to the new privileges, not to ApproveEnrolment. Add an explicit test.
2. **Realm schema bump** — confirm whether adding to the `entityType` set on `EntityApprovalStatus.js` requires a schema-version bump or is additive.
3. **Pre-merge SQL audit** — query production DBs for any FormMapping rows of FormType `ProgramExit` with `enable_approval = true`. If any are found, communicate the upgrade-time reset to the affected orgs in release notes. (Decision can be revisited if the audit surfaces deliberate users.)
4. **Approval status visibility on the supervisor's own device** — confirm that exits filed by the supervisor sync back to the same device with the latest status (Pending → Approved/Rejected). The existing scope-aware sync should already handle this since the enrolment is in their catchment, but worth verifying with an integration test.

---

## Stories to be created

Grouped by repo. Bodies will be written in the next phase (`/story`).

### avni-server
1. **Add `ProgramExit` to `EntityApprovalStatus.EntityType` enum** + persistence verification.
2. **Add `ApproveProgramExit` + `RejectProgramExit` privileges** — `PrivilegeType` enum entry, Flyway migration inserting the privilege rows, and `AccessControlService.checkApprovePrivilegeOnEntityApprovalStatus()` switch update.
3. **Create EntityApprovalStatus on ProgramExit save** — hook into `ProgramEnrolmentService` so that when `programExitDateTime` is set and the ProgramExit FormMapping has `enableApproval = true`, a Pending status row is appended with `entityType = ProgramExit`.
4. **Sync registration for `ProgramExitEntityApprovalStatus`** — add to `SyncEntityName` enum and `approvalStatusEntities` list; wire the scope-aware service mirroring `ProgramEnrolmentEntityApprovalStatus`.
5. **Flyway: reset `enable_approval = false` on existing ProgramExit form mappings** — one-line idempotent UPDATE in the same migration as the privilege inserts.
6. **Integration test:** end-to-end save of an enrolment with exit + approval enabled creates the correct status row; approve/reject transitions append correct rows; reject does not mutate the enrolment.

### avni-models
7. **Add `ProgramExit` to `entityType` set** in `EntityApprovalStatus.js`; bump schema version if needed; bump package version and re-link into avni-client.

### avni-client
8. **ProgramExitView shows approval status** — Pending/Approved/Rejected block with latest rejection comment, mirroring ProgramEnrolmentView.
9. **Verify ApprovalListingView auto-includes ProgramExit entries** once a ProgramExit FormMapping has `enableApproval = true`. Add automated test against a synthetic ProgramExit FormMapping.
10. **`EntityApprovalStatusService` + `PrivilegeService` recognise `ProgramExit`** — entity-type set updated; schema-to-privilege resolution maps ProgramExit to `ApproveProgramExit` / `RejectProgramExit`.
11. **Mobile reject UX** — confirm that rejection comment surfaces on ProgramExitView; supervisor can re-open the form and either correct or clear the exit; correct flow appends a new Pending row, clear flow does not.

### avni-webapp
12. **App Designer: confirm `Enable Approval` toggle for ProgramExit form mappings** — toggle visible, persists, and is round-tripped through the bundle. Add UI test.
13. **DEA approval-listing surface** — verify ProgramExit entries render in the webapp approval listing (mostly generic FormType-driven rendering; story to confirm and add test).

### Cross-cutting / documentation
14. **avni-readme update** — extend the `approval-workflow.md` page to list ProgramExit as a supported entity; document the supervisor's correction path (re-open → edit or clear).
