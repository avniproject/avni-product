You are helping a product analyst create an initial analysis document for a feature request, gap, or user need in the Avni platform.

Given the feature name or problem description in $ARGUMENTS (ask if empty):

---

## Step 1 — Clarify the request

If $ARGUMENTS is empty or too vague, ask:
1. What is the feature or problem? (1–2 sentences)
2. Who is affected? (field workers, implementers, org admins, developers)
3. Is this about a new Avni capability, a gap in an existing feature, or a workflow improvement?
4. Are there any real-world use cases or examples from implementers?

Wait for answers before continuing.

---

## Step 2 — Map to Avni's domain model

Using Avni's terminology, classify the request:

**Which domain areas are involved?**
- Subject types, Programs, Encounter types, Forms, Concepts, Rules
- Report cards, Dashboards, Offline reports, ETL/Metabase/Jasper
- Users, User groups, Catchments, Locations, Translations
- Sync, Bulk upload, API, Integrations, Approvals, Tasks

**Which applications are likely affected?**
- `avni-server` — backend API, data model, rules execution
- `avni-webapp` — admin UI and configuration
- `avni-client` — Android field app
- `avni-models` — shared domain model (npm: `openchs-models`)
- `avni-etl` — reporting data pipeline

**What kind of change is this?**
- Data model / schema change
- UI / UX change
- Rules / logic change
- Reporting / ETL change
- Configuration / admin change
- Infrastructure / platform change

---

## Step 3 — Explore current state
- Check for related features, workarounds, or partial implementations
- Read relevant source files in the affected repos
- Note what already exists vs. what is missing

### Step 3a — Read ALL Avni documentation
1. Start at https://avni.readme.io/docs/getting-started
2. Read the page fully
3. Extract ALL links that point to `avni.readme.io/docs/*`
4. Follow each link and read that page fully
5. From each new page, again extract all `avni.readme.io/docs/*` links
6. Continue until no new unvisited pages remain
7. Build a mental map of what Avni currently supports before proceeding

### Step 3b — Explore relevant repositories
After reading the docs, check source code of below repos in ../projects in:
- avni-server (backend, data model)
- avni-client (Android app)
- avni-webapp (admin UI)
- avni-models (shared domain model)
- avni-etl (reporting pipeline)

---

## Step 4 — Ask clarifying questions

Before writing the analysis, surface open questions that require the analyst's input:
- What is the MVP vs. the full vision?
- Are there known constraints (backward compatibility, multi-tenancy, performance)?
- Have implementers confirmed this is a real pain point?
- Is there a specific organisation or program where this has come up?

Wait for answers before continuing.

---

## Step 5 — Create the analysis document

Derive a slug from the feature name (lowercase, hyphens). Create `analysis/<slug>/` and write `analysis/<slug>/<slug>.md`.
Follow INVEST principles.
Structure:

---

### Primary purpose
Why this feature is needed, what problem it solves, and for whom. Include real-world context if available.

### Current state
What Avni currently does in this area. Reference specific files or code patterns where relevant.

### The feature
What needs to be built or changed. Enumerate user-facing behaviours and configuration changes. Focus on *what*, not *how*.

### Out of scope
What is explicitly excluded from this feature.

### Technical details
High-level notes on affected areas, data model considerations, and known constraints.

### Findings from codebase exploration
Specific files, classes, entities, or patterns found during exploration that are directly relevant.

### Open questions
Questions that remain unresolved and need to be answered before speccing begins.

---

After creating the file, tell the analyst:
- The file was created at `analysis/<slug>/<slug>.md`
- They should review and refine it before proceeding
- When ready, run `/spec analysis/<slug>/<slug>.md` to move to the spec phase
