### Primary purpose

When a location hierarchy is expanded (e.g. a Health and Wellness Center level added between Block and Village), district-level users who are unfamiliar with the new intermediate level are forced to traverse an extra step during subject registration and address-based filtering. This creates friction and errors for users who simply want to work across all values at that intermediate level without specifying one.

This feature introduces a **"Show all next level addresses"** chip at intermediate address levels so users can explicitly skip a level and move directly to the next level down without selecting anything specific. Reference: [avni-client#1906](https://github.com/avniproject/avni-client/issues/1906)

---

### Current state

Address-level pickers appear in:
- Subject registration (address assignment)
- Location FormElement (within forms)
- CustomDashboard Search Filters
- App Search
- DEA (Data Entry App)

Currently, users must select at least one value at each intermediate level before the next level's options are revealed. There is no way to skip or bypass an intermediate level without selecting something specific from it.

Currently there is no way to skip or bypass an intermediate level. This feature adds a chip to do exactly that.

---

### The feature

**Acceptance Criteria**

- A **"Show all next level addresses"** chip is displayed next to the level label for each non-lowest address level
- Tapping the chip skips selection at that level and immediately reveals the next level's options
- When active, the chip is visually highlighted (filled teal); any previously selected option at that level is deselected, and all options remain fully tappable
- If the user selects a specific option while the chip is active, the chip deactivates automatically
- If the chip is inactive and the user taps it, any currently selected option at that level is deselected automatically
- Tapping the active chip again deactivates it and hides the next level's address options (collapses the levels below)
- The chip appears only at non-lowest address levels in the hierarchy
- Supported across all address-level picker surfaces: Subject Address (registration), Location FormElement, CustomDashboard Search Filters, App Search, and DEA

---

### Out of scope

- MyDashboard support (deprecated)
- Lowest-level address fields (no child level to reveal)
- Web admin UI address pickers (separate surface, not in scope for this issue)

---

### Technical details

- The "Show all next level addresses" state will need a sentinel representation (e.g. `null`, empty array, or a special `ANY` constant) that downstream filter/query logic can interpret as "no restriction at this level"
- Sync and query logic in `avni-server` that filters by address level will need to handle this sentinel correctly
- The UI components for address-level pickers are shared across registration, search, and filter surfaces — changes here will propagate to all in-scope surfaces
- Backward compatibility: existing saved filters or registrations with fully specified address chains should be unaffected

---

### Findings from codebase exploration

*(To be completed during Step 2b exploration of avni-client, avni-webapp, avni-server)*

Likely files to investigate:
- `avni-client` — address-level picker components, subject registration flow, search/filter actions
- `avni-webapp` — DEA address picker
- `avni-server` — address-level filtering in subject search endpoints

---

### Open questions

1. **Persistence**: When a filter with "Show all next level addresses" active is saved (e.g. a custom dashboard filter), how is it stored and restored?
3. **Display in summary**: When "Show all next level addresses" is active for a level, what label appears in the filter summary or registration address display? (e.g. "Block: All" or "Block: —"?)
4. **Server-side query impact**: Does skipping an intermediate level affect performance for large address hierarchies? Is there a known threshold where this matters?
5. **DEA-specific behaviour**: DEA has its own address picker — does it use the same component, or does it need a separate implementation?
6. **Confirmation from implementers**: Has the team at the affected organisation (with the HWC hierarchy) confirmed that "Show all next level addresses" covers their pain point?
