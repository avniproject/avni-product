### Primary purpose

Avni currently lets implementers enable an approval workflow on five entities — Subject, ProgramEnrolment, ProgramEncounter, Encounter, ChecklistItem — but **not on Program Exit**. Supervisors who file a program exit can therefore irreversibly take a beneficiary out of an active care schedule with no second pair of eyes.

The original user-reported need comes from SNCU:

> When supervisors enter that beneficiaries are permanently migrated then the alert goes to HOD user-group in SNCU , once confirmed then no further schedule alert will generate by the system. The same logic for the death of the child will follow.

Two real-world drivers:
- **Reversibility.** Exit reasons like "permanently migrated" or "death of child" are high-impact — the wrong entry stops the entire scheduled-visit pipeline for that beneficiary. SNCU wants HOD review before the exit is treated as final.
- **Consistency with existing approvals.** Org admins already use Avni's approval workflow for enrolments and encounters. Program Exit is the obvious gap and the only "permanent action" in the program flow without a review layer.

GitHub issue: [avni-product#1388](https://github.com/avniproject/avni-product/issues/1388). Originally raised in 2023, scoped at that time for "analysis only, not 6.0 development" (per Maha's comment).

### Current state

**Approval workflow exists for these entities** (per `EntityApprovalStatus.EntityType` enum in `avni-server`):
- Subject
- ProgramEnrolment
- ProgramEncounter
- Encounter
- ChecklistItem

Program Exit is **not** in this enum.

**Program Exit is a separate form type, but not a separate entity.** `FormType` enum in avni-server lists `ProgramExit` as a distinct form type (alongside `ProgramEnrolment`, `ProgramEncounter`, etc.), so implementers already design exit forms separately in the App Designer. However, the exit *data* is stored as columns on the `ProgramEnrolment` row itself — `programExitDateTime`, `programExitObservations`, `exitLocation` — not as its own row.

**Once `programExitDateTime` is set, `enrolment.isActive` returns false.** This is the single mechanism by which exits "stop further alerts" — implementer-written `nextScheduledVisits` and `decisions` rules typically gate on `enrolment.isActive` and so naturally stop generating schedules once the exit row is saved.

**Existing approval workflow is review-after-save, not gating.** When a ProgramEnrolment or Encounter is submitted with approval enabled, the row commits immediately, schedules and decision rules run, and the supervisor reviews after the fact. Rejection lets the field user correct the entry. This is the semantic that will be extended to Program Exit (see "Decisions taken" below).

**Existing reject never mutates the entity.** Verified in `EntityApprovalStatusService.save()` (avni-server) and `EntityApprovalStatusService.rejectEntity()` (avni-client): on reject, only a new `EntityApprovalStatus` row with status=Rejected is written; the underlying ProgramEnrolment / Encounter is left untouched. The field user must manually re-open the form and re-save to trigger a fresh Pending status. **The "Reject = undo the exit" requirement for ProgramExit is therefore a brand-new platform pattern, not a straight extension.** See spec for design.

**EntityApprovalStatus row model.** Link is by `entity_id` (long DB id) + `entity_type` (enum), not by UUID. No unique constraint on `(entity_id, entity_type)` — multiple approval rows coexist over an entity's lifetime (every status transition appends a new row). Sync uses type-specific variants — `ProgramEnrolmentEntityApprovalStatus`, `EncounterEntityApprovalStatus`, etc. — alongside the deprecated generic `EntityApprovalStatus`. The mobile approval-listing screen filters by FormMapping form type, not by entity-type enum: adding a `ProgramExit` form mapping with `enableApproval = true` auto-includes it in the standard PendingApproval / Approved / Rejected cards with no card-service change.

**Privileges come in pairs.** Existing convention: every approval-capable entity has both `Approve<X>` and `Reject<X>` (e.g., `ApproveEnrolment` + `RejectEnrolment`). ProgramExit would need both.

**Bundle export already serialises `enableApproval`** in `FormMappingContract`; bundle import handler is generic over FormType, so no per-FormType case is needed.

**ETL has no approval-status surface today.** `entity_approval_status` is not joined into any ETL view (enrolment_view, encounter_view, etc.). ProgramExit approval will inherit the same gap — out of scope for this feature.

**Privilege model.** `PrivilegeType` enum already has `ApproveEnrolment`, `ApproveEncounter`, `ApproveSubject`, `ApproveChecklistitem` — one privilege per approval-capable entity type. There is no `ApproveProgramExit`.

**Mobile/webapp UI.** `ProgramExitView.js` in avni-client renders the exit form via `ProgramFormComponent` but does **not** show any approval status. `EntityApprovalStatusService.js` references `ProgramExit` in a form-type filter but creates the underlying approval row against the ProgramEnrolment entity, not the exit. The webapp's "Enable Approval" toggle in App Designer (`FormSettings.jsx`) does not appear to block the ProgramExit form type — but because the backend EntityType enum doesn't know about ProgramExit, turning it on today would be a no-op.

### Decisions taken (from analyst review)

| # | Question | Decision |
|---|---|---|
| 1 | Approval semantic | **Review-after-save** — match the existing Avni pattern. Exit data commits immediately; supervisor reviews after. Schedules stop on save (via `isActive`); rejection re-opens. |
| 2 | Approver scope | **Reuse existing privilege model.** Add `ApproveProgramExit`. Any role with that privilege can approve. No per-catchment routing. |
| 3 | Feature scope | **Program Exit only.** Subject voiding, member removal, cancelled/exited encounter outcomes are out of scope (the cancelled/exited encounter case is covered by Epic [#1871](https://github.com/avniproject/avni-product/issues/1871)). |
| 4 | Demand signal | **Confirmed customer ask** — SNCU. |

### The feature

User-facing behaviours:

**For the implementer (org admin, App Designer):**
- Enable Approval toggle on the ProgramExit form mapping (per Program × Subject Type, same as existing approval config).
- Add `Approve Program Exit` privilege to the appropriate role (e.g., a Supervisor / HOD role).

**For the field user (Supervisor entering the exit on mobile):**
- Fills the Program Exit form as today.
- On submit, the exit is saved; the enrolment shows status "Pending Exit Approval" alongside the existing exit summary.
- The subject becomes inactive in the program immediately (scheduled visits stop, because `isActive` is false).
- If the exit is rejected, the field user sees the rejection comment and can re-open the exit form to correct (or to clear the exit and restore the active enrolment).

**For the approver (HOD on mobile):**
- Sees pending exits in the standard approval dashboard (the same `PendingApproval` / `Approved` / `Rejected` standard report cards used for other entity approvals).
- Can open the exit form, view all entered data + comments, and Approve or Reject (with comment).
- On Reject, only the approval status row changes (matches existing platform behaviour for Enrolment/Encounter rejection). The exit stays committed; the supervisor sees the rejection and must re-open ProgramExitView to either correct the entry (which will re-trigger Pending) or clear the exit to restore the active enrolment.

**Visibility:**
- Exit's approval status (Pending / Approved / Rejected) is visible on the subject profile, on the enrolment card, and on the exit form itself in mobile + webapp.
- Standard `PendingApproval`, `Approved`, `Rejected` report cards extend to include ProgramExit entries.

### Out of scope

- **Gating semantic.** This MVP does not block the exit from committing or schedules from stopping until approval. The exit commits on save, just like enrolment/encounter approvals do today. If an organisation wants alerts to keep firing until HOD approves, they can write that logic into their schedule rules by also checking the approval status of the exit. The platform default mirrors the existing post-hoc review pattern.
- **Subject voiding / de-registration approvals**, **member-removal approval**, **cancelled-encounter approval**. Out of scope here. Cancelled/Exited encounter outcomes are addressed under Epic [#1871](https://github.com/avniproject/avni-product/issues/1871).
- **Per-catchment / per-user-group / rule-based approver routing.** All approvers with the privilege see all pending exits, same as current approval workflows.
- **Active push notification to HOD** when an exit is pending. The approver checks the dashboard. Dashboard-pull is the only platform-level solution for approval workflows in Avni; active push is not in scope. (Implementers can wire push via rules / notifications independently if needed.)
- **Per-exit-reason gating** (e.g., approval required only when reason = "death" or "migrated"). If a customer needs this, it is implementer-rule territory, not a platform feature.
- **Auto-cancellation of future ProgramEncounters on exit.** The platform does not currently mark future scheduled encounters as cancelled when an exit is filed (only `isActive` flips). This behaviour is not in scope here. Should be handled by rule, based on Approval status and ProgramExit.
- **ETL/reporting changes** beyond what `EntityApprovalStatus` already exposes — covered as a follow-up if needed.

### Technical details

Affected repos and high-level areas. Detailed implementation breakdown will live in the spec → stories phase.

- **avni-server**
  - Add `ProgramExit` to `EntityApprovalStatus.EntityType` enum + DB migration if the enum is persisted as string.
  - Add `ApproveProgramExit` to `PrivilegeType` enum + privilege bootstrap.
  - Extend `AccessControlService.checkApprovePrivilegeOnEntityApprovalStatus()` to recognise the new entity type.
  - In `ProgramEnrolmentController` / `ProgramEnrolmentService`: when a save sets `programExitDateTime` (first time, or re-set after a clear) AND the ProgramExit form mapping for that program × subject type has `enableApproval = true`, append an `EntityApprovalStatus` row with `entityType = ProgramExit`, `entity_id = enrolment.id`, status = Pending. Each subsequent edit appends a new status row if the status changes — matches existing pattern (no upsert / mutation).
  - **Approve / Reject** transitions only write a new EntityApprovalStatus row. Neither approve nor reject mutates `programExitDateTime` or any field on the ProgramEnrolment. (Matches existing Enrolment/Encounter approval semantics.)
  - Extend `AccessControlService.checkApprovePrivilegeOnEntityApprovalStatus()` switch to map `EntityType.ProgramExit` → `ApproveProgramExit` / `RejectProgramExit`.
  - Verify approval listing/search endpoints (the GET on `/api/approvalStatuses` and the mobile sync endpoint) filter ProgramExit correctly.
  - Add `ProgramExitEntityApprovalStatus` to the `SyncEntityName` enum (in `approvalStatusEntities` list) + register the corresponding `ScopeAwareService` so mobile devices pull these rows scoped to the user's catchment/subject type.
  - Flyway migration: insert `ApproveProgramExit` + `RejectProgramExit` privilege rows; reset `enable_approval = false` on all existing FormMapping rows of FormType `ProgramExit` (to prevent orgs that had the toggle accidentally set from getting surprise approvals on upgrade).
- **avni-models**
  - Add `ProgramExit` to the `entityType` set in `EntityApprovalStatus.js`. Bump package and re-link into avni-client.
- **avni-client**
  - `ProgramExitView`: display the approval status (Pending/Approved/Rejected) and any rejection comment, with the same UI affordances as ProgramEnrolmentView.
  - `SubjectApprovalView` / `ApprovalListingView` / `ApprovalDetailsCard`: include ProgramExit entries; render exit-form summary; wire Approve/Reject buttons.
  - `EntityApprovalStatusService`: include ProgramExit in the entityType set used for pending queries.
  - On Reject sync down: the supervisor sees the rejected exit on their listing / subject profile with the rejection comment. To act on it they re-open ProgramExitView and either edit + re-save (creates fresh Pending) or clear the exit (which restores active enrolment via the existing form-save path). No new "re-submit" UI — matches existing reject UX for other entities.
- **avni-webapp**
  - App Designer / `FormSettings.jsx`: confirm the Enable Approval toggle is presented for ProgramExit form mappings.
  - Approval listing screens (the webapp side of the approval dashboard): include ProgramExit entries.
- **avni-etl**
  - Confirm the views that expose `EntityApprovalStatus` include ProgramExit rows; document for implementers if any new column / view is required.
- **Bundle import/export**
  - `enableApproval` flag on ProgramExit form mapping must round-trip through the implementation bundle. Verify in `BundleImporter` and the bundle contract.
- **Sync**
  - `EntityApprovalStatus` rows for ProgramExit must be included in the field-user device sync so the supervisor can see status on their own subjects.

(Cross-check against `context/feature-spec-checklist.md` before spec finalisation: sync enum, privilege enum, bundle importer cases, ETL view, perf at realistic org scale.)

### Findings from codebase exploration

**Repositories affected:**
- `avni-server`, `avni-models`, `avni-client`, `avni-webapp`, `avni-etl`

**Key files and line references:**

| Area | File | Notes |
|---|---|---|
| EntityType enum (Java) | `avni-server/avni-server-data/src/main/java/org/avni/server/domain/EntityApprovalStatus.java` (lines 66–72) | Current enum: Subject, ProgramEnrolment, ProgramEncounter, Encounter, ChecklistItem. Add ProgramExit. |
| FormType enum | `avni-server/avni-server-data/src/main/java/org/avni/server/application/FormType.java` (line 15) | `ProgramExit` already exists as a distinct form type. |
| Enrolment model (server) | `avni-server/avni-server-data/src/main/java/org/avni/server/domain/ProgramEnrolment.java` (lines 54–56) | `programExitDateTime`, `programExitObservations`, `exitLocation` columns. |
| Enrolment save (controller) | `avni-server/avni-server-api/src/main/java/org/avni/server/web/ProgramEnrolmentController.java` (lines 78–91) | Existing approval-status creation on enrolment save. Mirror this for exit. |
| Enrolment save (service) | `avni-server/avni-server-api/src/main/java/org/avni/server/service/ProgramEnrolmentService.java` (line 154) | Where `programExitDateTime` is committed. |
| EntityType enum (JS) | `avni-models/src/EntityApprovalStatus.js` (lines 31–37) | Add ProgramExit. |
| `isActive` predicate | `avni-models/src/ProgramEnrolment.js` (lines 408–409) | `_.isNil(this.programExitDateTime)` — the actual lever that stops schedules once exit is saved. |
| Form-settings toggle | `avni-webapp/src/formDesigner/components/FormSettings.jsx` (around line 38) | `enableApproval` checkbox. Verify it's visible for ProgramExit form mappings. |
| Mobile exit form | `avni-client/packages/openchs-android/src/views/program/ProgramExitView.js` | Add approval-status UI. |
| Mobile approval service | `avni-client/packages/openchs-android/src/service/EntityApprovalStatusService.js` (lines 57–84) | Already mentions ProgramExit in a form-type filter; the underlying approval row is currently created against ProgramEnrolment. Refactor to create a ProgramExit-specific row. |
| Privilege enum | `avni-server/avni-server-data/src/main/java/org/avni/server/domain/accessControl/PrivilegeType.java` | Has `Approve*` + `Reject*` per entity (Subject, Enrolment, Encounter, Checklistitem). Add both `ApproveProgramExit` + `RejectProgramExit`. |
| EntityApprovalStatusService (server) | `avni-server/avni-server-api/src/main/java/org/avni/server/service/EntityApprovalStatusService.java` (`createStatus` lines 64–91; `save` lines 37–62) | Gated on `formMapping.isEnableApproval()`. Save() updates status row only — never touches the underlying entity. |
| AccessControlService approval check | `avni-server/avni-server-api/src/main/java/org/avni/server/service/accessControl/AccessControlService.java:250–265` (`checkApprovePrivilegeOnEntityApprovalStatus`) | Switch on EntityType — extend for ProgramExit. |
| Sync entity names | `avni-server/avni-server-data/src/main/java/org/avni/server/domain/sync/SyncEntityName.java` (lines 28–43) | Add `ProgramExitEntityApprovalStatus` to `approvalStatusEntities`. |
| Mobile approval listing | `avni-client/packages/openchs-android/src/views/approval/ApprovalListingView.js` (lines 20–60) | Filters by FormMapping form type. ProgramExit auto-included once FormMapping with `enableApproval=true` exists. |
| Mobile reject action | `avni-client/packages/openchs-android/src/action/approval/ApprovalActions.js` + `service/EntityApprovalStatusService.js` (lines 115–137) | Current reject only appends a Rejected status row. Does NOT mutate the entity. |
| FormMappingContract (bundle) | `avni-server/avni-server-api/src/main/java/org/avni/server/web/request/FormMappingContract.java` (lines 19, 72–77, 92) | `enableApproval` serialised; ProgramExit handled by generic FormType handler. |
| Privilege Flyway template | `avni-server/avni-server-api/src/main/resources/db/migration/V1_170__AddTablesForApprovalWorkflow.sql` (lines 69–84) | Reference for new privilege + standard-report-card insertions. |

### Open questions

1. **Reject = undo: scope of the undo.** Server-side reject clears `programExitDateTime`, `programExitObservations`, `exitLocation` on the enrolment. Two sub-questions: (a) Should the rejected exit observations be preserved anywhere (e.g., on the `EntityApprovalStatus` row, for audit/history), or fully discarded? (b) If schedules were already cancelled by implementer rules that fire on `isActive` flip, does re-activation automatically restore them, or does the implementer need to re-generate? Recommendation: preserve the rejected observations on the approval-status row for audit; document the schedule-regeneration expectation for implementers.
2. **Re-edit while Pending.** If the supervisor edits the exit form again while the previous submission is still Pending, do we update the existing approval row, or create a new one? (Existing approval workflows likely update — confirm and document.)
3. **Standard report cards.** Confirm whether `PendingApproval` / `Approved` / `Rejected` standard report cards automatically include the new ProgramExit entries, or whether each card type needs an explicit code change.
4. **Per-reason gating.** SNCU's example singles out "permanent migration" and "death". Should the platform allow per-reason gating, or is approval all-or-nothing per form (with per-reason logic left to implementer rules)? Recommendation: all-or-nothing platform feature; per-reason via rule.
5. **Privilege naming convention.** `ApproveProgramExit` (new) vs. broadening `ApproveEnrolment` to cover both. Recommendation: new privilege — matches existing convention of one privilege per approval-capable entity type, and lets orgs assign exit approval separately from enrolment approval.
6. **Sync of pending exits to other field users.** Should a supervisor on a different device see another supervisor's pending exit in the same catchment? Sync is per-user, so by default they would not. Confirm whether SNCU expects cross-supervisor visibility.
7. **Bundle / Sync enum / Privilege bootstrap.** Confirm the six-criteria spec checklist (`context/feature-spec-checklist.md`) is run before spec finalisation — specifically the sync enum and bundle round-trip points are easy to miss.
