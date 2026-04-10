### Primary purpose

Field workers on the Avni Android app currently tap a report card and always land on a subject list — `IndividualSearchResultPaginatedView` for custom cards, or other fixed views for standard cards. There is no way for an implementer to define a standalone summary or display screen as the destination.

Organisations want to build non-subject-centric dashboards: for example, a field worker's own payment/incentive summary, a daily task overview, a coverage snapshot, or a location-level service status. None of these map to a subject list. Today, these use cases cannot be built inside Avni at all.

This feature introduces a new destination type for custom report cards: a configurable, standalone summary/display screen that the org defines and the field worker sees when they tap the card.

---

### Current state

**Custom report cards** (`standardReportCardType == null`) execute a JavaScript query stored in the `query` field and navigate the user to `IndividualSearchResultPaginatedView` — always a paginated subject list.

**Standard report cards** navigate to one of five hardcoded views based on card type:
- `IndividualListView` (default types: ScheduledVisits, OverdueVisits, Recent*)
- `ApprovalListingView` (approval types)
- `CommentListView` (Comments)
- `TaskListView` (task types)
- Task list sub-navigation (CallTasks, OpenSubjectTasks)

The navigation destination is resolved in `CustomDashboardActions._getViewName()` (`avni-client/packages/openchs-android/src/action/customDashboard/CustomDashboardActions.js`, line ~56). There is no branch for a custom/configurable screen type.

**No concept of a custom screen exists anywhere in the stack.** The `ReportCard` entity (server, models, webapp) has no field that would point to a custom screen definition.

---

### The feature

A new capability allowing a custom report card to navigate to a configurable standalone summary screen on the Android app:

- **New card destination type**: When configuring a custom report card in the webapp, the implementer can choose between the existing "subject list" destination and a new "custom summary screen" destination.
- **Custom summary screen**: A read-only display screen that is not tied to any subject. Content is populated based on org-defined configuration or a rule/script (see open questions).
- **Org-specific**: Each org defines their own screen layout and content — this is explicitly per-org, not a global Avni feature.
- **Android app only**: This feature is for the field worker Android experience, not the web data entry app.
- **Standalone**: The screen stands alone — it does not require selecting a subject to open.

Example use cases:
- A field worker's incentive/payment summary for the current month
- A location-level coverage snapshot (% of targets met)
- A daily work plan or task summary

---

### Out of scope

- Form-based data entry on the custom screen (read-only only, for now)
- Subject-linked screens (the screen does not open in the context of a specific subject)
- Web app / data entry app surface
- Charts or media rendering (unless trivially supported by the chosen configuration mechanism)
- Custom screens as a destination for standard report card types

---

### Technical details

**Affected repositories:**
- `avni-server` — new field(s) on `ReportCard` entity + migration + bundle export/import
- `avni-webapp` — new UI in `CreateEditReportCard.jsx` to configure the custom screen
- `avni-models` — new field(s) on `ReportCard` Realm schema
- `avni-client` — new screen component + new branch in `CustomDashboardActions._getViewName()` + navigation wiring

**Data model sketch:**
A new field on `ReportCard` (name TBD, e.g. `customScreenConfig`) would hold the screen definition. Could be:
- A reference to a new `CustomScreen` entity (heavier, more flexible)
- A JSON blob on `ReportCard` itself (lighter, simpler)
- A rule/script field, similar to `query` (consistent with existing patterns)

**Sync**: `ReportCard` already syncs to the Android app via `/v2/card/search/lastModified`. Any new fields will automatically be included in sync if added to the entity and contract.

**Offline**: The custom screen must work fully offline — all data shown must be derivable from the local Realm database or be embedded in the configuration.

---

### Findings from codebase exploration

| File | Relevance |
|---|---|
| `avni-models/src/ReportCard.js` | Realm schema — `query`, `standardReportCardType`, `nested`, `countOfCards` fields |
| `avni-server/.../domain/ReportCard.java` | JPA entity — same fields + `iconFileS3Key`, `standardReportCardInput` JSON blob |
| `avni-server/.../domain/StandardReportCardTypeType.java` | 14-value enum for standard card types |
| `avni-server/.../service/CardService.java` | `saveCard()`, `editCard()` — validation and creation |
| `avni-server/.../web/ReportCardController.java` | REST CRUD + sync endpoint |
| `avni-client/.../action/customDashboard/CustomDashboardActions.js` | `onCardPress()` + `_getViewName()` — hardcoded navigation |
| `avni-client/.../service/customDashboard/ReportCardService.js` | Query execution, result handling |
| `avni-client/.../service/RuleEvaluationService.js` | `executeDashboardCardRule()` — JavaScript rule evaluation |
| `avni-client/.../views/customDashboard/CustomDashboardView.js` | Dashboard rendering, card tap wiring |
| `avni-webapp/.../ReportCard/CreateEditReportCard.jsx` | Admin UI for card config — where new screen config UI would be added |
| `avni-webapp/.../model/WebReportCard.js` | Validation logic for card fields |

---

### Open questions

1. **How is the custom screen configured?** Two realistic options:
   - *Declarative via admin webapp*: Implementer defines sections, labels, and data bindings through UI — no code. Simpler for implementers, harder to build.
   - *JavaScript/rule-based*: Screen content is defined by a rule/script that returns a structured data object (consistent with how `query` works today). More flexible, requires implementer scripting skill.

2. **What does the screen render?** If rule-based, what is the shape of the return value? Key-value pairs? Sections with rows? A number + label + description? A list of items?

3. **Can items on the screen be tapped?** Is this purely read-ocheck how nly, or can rows/items navigate somewhere (e.g., to a subject profile)?

4. **Does the screen have a back button to the dashboard?** Standard Android back navigation should suffice — but confirm.

5. **Is there a maximum complexity for the screen?** (e.g., max number of sections, max rows per section — for performance)

6. **Multiple custom screen types vs. one generic type?** Should Avni support a library of named screen templates, or a single generic configurable screen per card?

7. **Action cards interaction**: The existing action_cards work adds action types to cards. Does this feature interact with or supersede any of those actions for custom screens?
