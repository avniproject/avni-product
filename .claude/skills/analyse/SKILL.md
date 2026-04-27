---
name: analyse
description: "Use this skill when the user wants to analyse a feature request, gap, or user need in the Avni platform. Triggers include: 'analyse <feature>', 'do an analysis of', 'write an analysis for', 'create an analysis document', or any request to understand the current state and scope of an Avni feature before speccing or implementation."
---

# Avni Feature Analysis

You are helping a product analyst create an initial analysis document for a feature request, gap, or user need in the Avni platform.

Given the feature name or problem description provided by the user (ask if not given):

---

## Step 1 — Clarify the request if vague

If no feature or problem has been described, or it is too vague, ask:
1. What is the feature or problem? (1–2 sentences)
2. Who is affected? (field workers, implementers, org admins, developers)
3. Is this about a new Avni capability, a gap in an existing feature, or a workflow improvement?
4. Are there any real-world use cases or examples from implementers?

Wait for answers before continuing.

---

## Step 2 — Explore current state
- Check for related features, workarounds, or partial implementations
- Read relevant source files in the affected repos
- Note what already exists vs. what is missing

### Step 2a — Read relevant Avni documentation
1. Go through avni_README.md and understand the Avni features
2. Continue until you have a solid understanding of what Avni currently supports in this area
3. Build a mental map of what Avni currently supports before proceeding

### Step 2b — Explore relevant repositories
After reading the docs, check source code in the sibling repos (at the same level as `avni-product`):
- `../avni-server` (backend, data model)
- `../avni-client` (Android app)
- `../avni-webapp` (admin UI)
- `../avni-models` (shared domain model)
- `../avni-etl` (reporting pipeline)

---

## Step 3 — Ask clarifying questions

Before writing the analysis, surface open questions that require the analyst's input:
- What is the MVP vs. the full vision?
- Are there known constraints (backward compatibility, multi-tenancy, performance)?
- Have implementers confirmed this is a real pain point?
- Is there a specific organisation or program where this has come up?

Wait for answers before continuing.

---

## Step 4 — Create the analysis document

Derive a slug from the feature name (lowercase, hyphens). Create `analysis/<slug>/` inside the `avni-product` workspace and write `analysis/<slug>/<slug>.md`.

Follow INVEST principles when framing the feature.

---

### Primary purpose
Why this feature is needed, what problem it solves, and for whom. Include real-world context if available.

### Current state
What Avni currently does in this area. Reference specific files or code patterns where relevant.

### The feature
What needs to be built or changed. Enumerate user-facing behaviours.
Do not add technical implementation details here. Reference GitHub cards (releases 15.x, 16.x) in `avni-client` and `avni-server` repos where technical details are tracked separately.

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
