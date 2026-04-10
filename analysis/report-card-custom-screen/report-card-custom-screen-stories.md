# Fully Custom Card — Story Cards

> These stories follow the INVEST principle: Independent, Negotiable, Valuable, Estimable, Small, Testable.
> Real-world driver: DIL (pump operator payment summaries), AKRSP (print/share), Goonj (performance review).
> Out of scope for all stories: DEA/web data-entry app surface; printing media-filled form parts.

---

## Story 1 — Admin creates a "Fully custom card" in the webapp

**As an** implementer configuring a dashboard,
**I want to** create a new card of type "Fully custom card",
**so that** I can build a standalone display screen that is not tied to a subject list.

### Acceptance criteria
- The card type selector in `CreateEditReportCard` includes a new option: **Fully custom card** (alongside Standard, Nested, Custom data card).
- When "Fully custom card" is selected, the existing "Query" field is hidden and the fields specific to this type (HTML template, data rule, translations, filters) become visible.
- Name, description, and icon fields remain as-is from the existing card form.
- Saving a fully custom card without an uploaded HTML file shows a validation error.
- A saved fully custom card appears in the dashboard card list and can be assigned to a dashboard section.

### Notes
- New `cardType` value on the `ReportCard` entity (server + models): `FULLY_CUSTOM`.
- No changes to how existing card types are saved or rendered.

---

## Story 2 — Admin uploads an HTML template for the custom card

**As an** implementer,
**I want to** upload an HTML file as the display template for a fully custom card,
**so that** I can define an org-specific layout (tables, styling, sections) without being constrained by a fixed Avni UI.

### Acceptance criteria
- A **"Choose file"** button appears when card type is "Fully custom card".
- Only `.html` files are accepted; other file types are rejected with an error message.
- The uploaded file content is stored (as a string) on the `ReportCard` entity — field name: `htmlTemplate`.
- The file name is displayed after upload so the implementer can confirm the right file was selected.
- Re-uploading replaces the previous template.
- The stored HTML is included in the card's sync payload so it reaches the Android device.

### Notes
- Store as a text field on `ReportCard` (not a separate S3 asset). Keep it simple for now.
- The HTML will be treated as a JS template literal at render time on-device (using `new Function`).

---

## Story 3 — Admin defines a data rule for the custom card

**As an** implementer,
**I want to** write a JavaScript data rule that queries local data and returns a structured object,
**so that** the HTML template is rendered with real, org-specific data from the field worker's device.

### Acceptance criteria
- A **"Data rule"** code text area appears when card type is "Fully custom card".
- The rule follows the existing Avni rule signature: `(params, imports) => { return { data: { ... } } }`.
  - `params.ruleInput` contains the currently applied filter values.
  - `params.db` is the Realm DB object.
- The rule is stored in a new field `dataRule` on `ReportCard`.
- Saving without a data rule is allowed (an empty template with no dynamic data is valid).
- The data rule is included in the card's sync payload.
- On the Android app, the rule is evaluated via the existing `RuleEvaluationService` pattern (consistent with `executeDashboardCardRule`).

### Notes
- Rule output contract: `{ data: { ... } }`. The `data` object is passed to the HTML template as the `data` variable.
- The data rule re-runs whenever the filter selection changes (see Story 6).

---

## Story 4 — Admin configures translation keys for the custom card

**As an** implementer rolling out in multiple languages,
**I want to** define a list of translation key–English value pairs for the custom card,
**so that** the HTML template renders correctly in the field worker's local language without hardcoding strings.

### Acceptance criteria
- A **"Text to be translated"** section appears when card type is "Fully custom card", with rows of `[Key] [English value] [+ / −]`.
- The implementer can add, edit, and remove key–value pairs.
- Translation keys are stored in a new `translationKeys` JSON field on `ReportCard` (map of key → i18n key).
- These keys are exported as part of the org's translation bundle so they appear in the existing Translations admin screen for the implementer to add regional-language values.
- On the Android app, translations are resolved from the device locale using `I18n.t(i18nKey)` and passed as the `translations` object to the HTML template.
- If a translation key is missing for the device locale, it falls back to the English value.

### Notes
- In the HTML template, translations are accessed as `${translations.keyName}`.
- This is consistent with existing i18n patterns in avni-client.

---

## Story 5 — Admin configures card-level filters for the custom card

**As an** implementer,
**I want to** define one or more filters (e.g., Month, Year) at the card level,
**so that** field workers can slice the displayed data without needing a separate filter configuration on the dashboard section.

### Acceptance criteria
- A **"Filters"** section appears when card type is "Fully custom card", allowing the implementer to define filters with a label, filter type (e.g., month picker, dropdown), and default value.
- Filter definitions are stored as a JSON array in a new `filterConfig` field on `ReportCard`.
- Filters sync to the Android device as part of the card config.
- On the Android custom card screen, the defined filters are rendered at the top of the screen (e.g., a month dropdown).
- When the field worker changes a filter, the data rule is re-evaluated with the updated `ruleInput` and the HTML re-renders.
- At minimum, a **Month** filter type must be supported (required by DIL).

### Notes
- Filter state is local to the card screen session — not persisted after the screen is closed.
- `ruleInput` passed to the data rule includes the current filter values, consistent with the existing dashboard filter contract.

---

## Story 6 — Field worker views a fully custom card screen on Android

**As a** field worker,
**I want to** tap a fully custom card on my dashboard and see a rich, org-defined display screen,
**so that** I can view information (e.g., my payment summary) in a format my organisation has designed.

### Acceptance criteria
- Tapping a fully custom card navigates to a new **CustomCardScreen** (not `IndividualSearchResultPaginatedView`).
- `CustomDashboardActions._getViewName()` returns the new screen for cards with type `FULLY_CUSTOM`.
- The screen renders the HTML template with the data rule output and translations injected via `buildHTML(htmlTemplate, data, translations)`.
- The HTML is rendered inside an `AutoHeightWebView` (consistent with the existing documentation feature).
- The screen works fully offline — all data comes from the local Realm DB.
- Standard Android back navigation returns the field worker to the dashboard.
- If the data rule throws an error, the screen shows a user-friendly error message (not a crash).

### Notes
- `buildHTML` uses `new Function('data', 'translations', \`return \`${htmlString}\`\`)` to evaluate the HTML as a template literal.
- HTML is uploaded by a trusted implementer and runs on-device — not from a server.

---

## Story 7 — Field worker filters data on the custom card screen

**As a** field worker,
**I want to** select a filter value (e.g., a month) on the custom card screen,
**so that** the displayed data updates to reflect only the records matching my selection.

### Acceptance criteria
- Configured filters (from Story 5) are displayed at the top of the custom card screen.
- Changing a filter value triggers re-evaluation of the data rule with the new filter value in `ruleInput`.
- The HTML re-renders with the updated data without a full screen reload.
- The selected filter value is preserved as long as the screen is open; resetting to default on screen close is acceptable.
- At minimum, a Month filter renders as a dropdown with month names in the device locale.

### Notes
- DIL requirement: filter by the month when a form was filled.
- Filter labels should respect the device locale (use existing i18n).

---

## Story 8 — Field worker prints the custom card view

**As a** field worker,
**I want to** print the custom card screen,
**so that** I can share a physical copy of my payment summary or performance data with my supervisor or for my records.

### Acceptance criteria
- A **Print** action (button or menu item) is available on the custom card screen.
- Tapping Print invokes `react-native-print` with the current rendered HTML string.
- The printed output matches what is displayed on screen.
- If no printer is available or printing fails, an appropriate error is shown.
- The print action is only shown when card-level config enables it (default: enabled for fully custom cards).

### Notes
- AKRSP requirement: print forms in custom format.
- `react-native-print` is the identified library; check if it's already a dependency in avni-client.

---

## Story 9 — Field worker shares the custom card view via WhatsApp

**As a** field worker,
**I want to** share my custom card screen to WhatsApp,
**so that** I can send my payment summary or performance data to my supervisor or colleagues directly.

### Acceptance criteria
- A **Share** action (button or menu item) is available on the custom card screen.
- Tapping Share opens the Android share sheet with the HTML content exported as a PDF or image.
- WhatsApp appears as a share target (standard Android share sheet behaviour).
- If the share fails, an appropriate error is shown.
- The share action is only shown when card-level config enables it (default: enabled for fully custom cards).

### Notes
- The share format (PDF vs. image screenshot) is a design decision to be confirmed.
- Leverage the same rendered HTML string used for printing.

---

## Story 10 — Fully custom card config syncs to Android

**As a** field worker,
**I want** the fully custom card configuration to be available on my device after a sync,
**so that** the card works correctly even when I am offline in the field.

### Acceptance criteria
- The new `ReportCard` fields (`htmlTemplate`, `dataRule`, `translationKeys`, `filterConfig`) are included in the existing `/v2/card/search/lastModified` sync endpoint response.
- The `ReportCard` Realm schema in `avni-models` is updated with the new fields.
- A Flyway migration adds the new columns to the `report_card` table in PostgreSQL.
- After sync, the field worker can open the fully custom card screen with no internet connection.
- If the card config changes on the server (e.g., a new HTML template is uploaded), the update is picked up on the next sync.

### Notes
- No change to sync frequency or mechanism — piggybacks on the existing card sync.
- Backward compatibility: existing cards with no `htmlTemplate` continue to function unchanged.

---

## Story 11 — Admin exports and imports fully custom card via bundle

**As an** implementer,
**I want** the fully custom card config to be included in Avni's bundle export and import,
**so that** I can replicate the configuration across environments (staging → production) or share it between organisations.

### Acceptance criteria
- Bundle export includes `htmlTemplate`, `dataRule`, `translationKeys`, and `filterConfig` for fully custom cards.
- Bundle import correctly restores all fields.
- Importing a bundle with a fully custom card that already exists updates it (upsert behaviour, consistent with other card types).
- Import validation fails gracefully if the HTML template field is malformed.

### Notes
- Follows the existing `CardService.saveCard()` / `editCard()` pattern.
- No changes to bundle file format — just additional fields on the existing card JSON structure.

---

## Dependency order (suggested)

```
Story 1 (card type)
  └── Story 2 (HTML template)
        └── Story 3 (data rule)
              ├── Story 4 (translations)
              ├── Story 5 (filters)
              └── Story 10 (sync)
                    └── Story 6 (view on Android)
                          ├── Story 7 (filters on screen)
                          ├── Story 8 (print)
                          └── Story 9 (share)
Story 11 (bundle) — parallel with Story 10
```

Stories 1–5 + 10 are backend/webapp work. Stories 6–9 are Android app work.
Story 11 can be done alongside Story 10 as they touch the same server-side code.
