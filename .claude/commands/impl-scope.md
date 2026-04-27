You are helping a product analyst scope a new Avni implementation for an organisation. The goal is to map the organisation's field program requirements to Avni's capabilities, identify what can be achieved through configuration alone, and surface gaps that require new development.

Given the organisation or program name in $ARGUMENTS (ask if empty):

---

## Step 1 — Understand the program

Ask the analyst to describe the implementation. Cover:

1. **Program overview** — What is the field program? (e.g., maternal health, TB contact tracing, school attendance, WASH monitoring)
2. **Field workers** — Who uses the Android app? (community health workers, teachers, enumerators, supervisors)
3. **Primary entities** — What are the main things being tracked? (mothers, patients, households, schools, water sources)
4. **Core activities** — What are the main workflows? (registration, follow-up visits, referrals, screenings, enrolments, exits)
5. **Reporting needs** — What reports and dashboards are needed? Who views them? (supervisors, program managers, donors)
6. **Scale** — Approximate number of field workers, locations, and subjects expected
7. **Languages** — What languages does the app need to support?

Wait for answers before continuing.

---

## Step 2 — Map to Avni's domain model

Based on the answers, produce a domain model mapping covering each area:

### Subject Types
- What entities need to be tracked long-term?
- Are there group subjects (households, schools) with individual members?
- What registration data is needed per subject type?
- Which subject types need GPS-tracked locations?

### Programs
- What structured programs will subjects enrol in?
- What are the enrolment criteria for each?
- Is there an exit condition or a program end state?

### Encounter Types
- What interactions happen outside of programs (general visits, assessments)?
- What interactions happen within programs (follow-up visits, screenings)?
- For each encounter type: is it scheduled or ad hoc? Recurring or one-time?

### Concepts (Data Elements)
- What key data points are captured across forms?
- What coded responses are needed? (yes/no, single-select, multi-select)
- What numeric values with acceptable ranges?
- Are there date, media, or GPS fields?

### Rules and Logic
- Are there visit schedules? (frequency, timing triggers)
- Are there eligibility rules? (who qualifies for enrolment or a specific visit)
- Is there decision support? (alerts when values are out of range, referral triggers)
- What validation rules are needed on forms?

### Locations
- What is the geographic/administrative hierarchy? (e.g., State → District → Block → Village)
- Approximate number of locations at each level
- Are locations tied to facilities, catchment areas, or both?

### Users and Access Control
- What roles exist? (field worker, supervisor, admin)
- What data should each role see and edit?
- How are catchments (geographic boundaries) mapped to field workers?
- Are there approval or review workflows?

### Translations
- What languages are required?
- Avni has pre-built translations for Hindi, Marathi, Gujarati, Tamil, and Kannada. New languages require custom translation work.

### Reporting and Analytics
- What aggregate metrics need tracking? (coverage, completion rates, flags)
- Should supervisors see offline dashboards on the Android app?
- Is web-based reporting needed? (Metabase self-service, Jasper custom reports, Superset)
- Is ETL required? (needed for any hosted reporting tool)

---

## Step 3 — Identify what can be configured vs. what must be built

For each domain area, assess whether the requirement is met by current Avni capabilities:

| Area | Requirement | Avni current capability | Gap? |
|------|-------------|-------------------------|------|
| ... | ... | ... | Yes / No / Partial |

**Configuration only (no development needed):**
Use the Avni admin web app and bundle configuration to set up: subject types, programs, encounter types, concepts, forms, form mappings, rules (standard), location hierarchy, user groups, catchments, users, translations, report cards, dashboards.

**Gaps requiring development (note each one):**
- Non-standard rules behaviour
- New field types or UI components
- Integration with external systems
- Export formats not currently supported
- Performance or scale limitations
- Features not yet in Avni (check against current codebase)

---

## Step 4 — Create analysis documents for each gap

For each gap identified in Step 3, create a separate analysis document using the structure from the `/analyse` workflow:

1. Create `analysis/<org-program>-<gap-slug>/<org-program>-<gap-slug>.md`
2. Populate each section: Primary purpose, Current state, The feature, Out of scope, Technical details, Open questions

---

## Step 5 — Create the implementation scope document

Write `analysis/<org-program>/impl_scope.md` with the following structure:

---

# Implementation Scope — <Organisation / Program Name>

## Program Overview
Brief description of the field program and its goals.

## Domain Model

### Subject Types
| Subject Type | Description | Group? | Registration Form |
|---|---|---|---|

### Programs
| Program | Subject Types | Enrolment Criteria | Exit Condition |
|---|---|---|---|

### Encounter Types
| Encounter Type | Scheduled / Ad hoc | Within Program? |
|---|---|---|

### Location Hierarchy
List location types top to bottom with approximate counts.

### User Roles
| Role | Access Level | Catchment Scope |
|---|---|---|

### Languages
List required languages and note pre-built vs. custom translation needed.

## Configuration Plan
What can be set up using Avni's admin web app and bundle config, with no code changes:
- Subject types: ...
- Programs: ...
- Forms: ...
- Rules: ...
- Reports: ...

## Gaps Requiring Development

| Gap | Analysis Document | Priority |
|---|---|---|
| ... | `analysis/<slug>/<slug>.md` | High / Medium / Low |

## Next Steps
1. Review this scope with the implementation team
2. For each gap, run `/spec analysis/<slug>/<slug>.md` to write a feature spec
3. Run `/story` on each spec to create development stories
4. Run `/publish` to create GitHub issues

---

After creating the files, summarise:
- The scope document location
- How many gaps were identified and what they are
- Which gaps should be specced first (by priority)
