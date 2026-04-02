You are co-developing stories with the user. Do not blindly write stories from the spec — treat this as a collaborative, iterative process.

Given the spec file at $ARGUMENTS:

## Step 1 — Explore the codebase
Before writing any stories, investigate the relevant repositories to validate and enrich the technical details in the spec. For each affected repository:
- Find the files, classes, and functions that will need to change
- Check existing patterns (naming conventions, how similar features were implemented) and follow them
- Look for anything the spec missed: related tables, sync endpoints, export handlers, UI components, permission checks, etc.
- Verify that the technical approach in the spec is feasible and correctly described

## Step 2 — Update the spec
If exploration reveals gaps or inaccuracies in the spec's technical approach, update the spec file before proceeding.

## Step 3 — Ask clarifying questions
Before writing stories, surface open questions that require the user's input. Do not assume answers — ask explicitly and wait. Questions should cover:
- Story scope boundaries that are unclear
- Acceptance criteria that cannot be precisely defined without more context
- Testing scenarios that need the user to clarify expected behaviour
- Any discovered complexity that might change how the work is sliced

Only proceed to Step 4 after the user has answered.

## Step 4 — Write the stories
Save the stories alongside the spec file with the suffix `_stories.md`. Group stories under a `## [Repository]` heading when there are multiple for the same repo. Each story will become a GitHub issue in its respective repository, linked to the epic in avni-product.

Structure each story as:

---

## [Story Title] · `[repository-name]`

**As a** [role], **I need** [capability], **so that** [benefit].

### Acceptance Criteria
A checklist a developer must tick off before the story is done. Each item must be specific and verifiable.
- [ ] ...

### Technical Details
Implementation guidance: specific files, classes, or functions to touch; data model changes; API contracts; edge cases to handle. Be concrete — reference actual code locations where known.

### Testing Gotchas
Non-obvious things that could trip up testing: tricky test data, environment-specific behaviour, interactions with other features, areas prone to regression.

---
