You are co-developing a feature spec with the user. Do not blindly write the spec — treat this as a collaborative, iterative process.

Given the analysis file at $ARGUMENTS:

## Step 1 — Explore the codebase
Before doing anything else, read the analysis and then investigate the relevant repositories to verify the technical claims and discover what is missing. Specifically:
- Check the repositories mentioned or implied (avni-server, avni-webapp, avni-client, etc.) to understand the current implementation of the feature area
- Verify that data model changes described are accurate (check existing schema, models, migrations)
- Verify that UI/UX changes are consistent with how the app currently works
- Look for related features, edge cases, or constraints that the analysis does not mention
- Identify any integrations, export formats, sync behaviour, or platform-specific concerns that may be affected

## Step 2 — Update the analysis
If you find gaps, inaccuracies, or missing pieces during exploration, update the analysis file directly with your findings before proceeding.

## Step 3 — Ask clarifying questions
Before writing the spec, surface any open questions that require the user's input. Do not assume answers to these — ask them explicitly and wait for the user's response. Questions should cover:
- Ambiguities in the feature description
- Decisions that have product/UX implications
- Technical trade-offs where the right choice is not obvious
- Scope boundaries that are unclear (what is in vs. out of MVP)

Only proceed to Step 4 after the user has answered.

## Step 4 — Write the spec
Save the spec alongside the analysis file with the suffix `_spec.md`. Structure it as follows:

---

# [Feature Name] — Spec

## Primary Goals / Motivation
Why this feature is being built. What problem it solves, and for whom. Include context about current limitations or user pain points.

## Feature Description
A clear, complete description of what the feature does from the user's perspective. Enumerate user-facing behaviours. Focus on what, not how.

## Overall Technical Approach
High-level technical strategy: which repositories are affected, what new data model changes are needed, key design decisions, and any constraints or non-goals. Give a developer a clear mental model before they dive into individual stories.

---

After writing the spec, list the stories that will need to be created (grouped by repository), but do not write them yet.
