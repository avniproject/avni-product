You are publishing a spec and its stories as GitHub issues. The argument is the spec file path (e.g. `analysis/some_feature_spec.md`). The stories file is expected alongside it with the suffix `_stories.md` (e.g. `analysis/some_feature_spec_stories.md`).

## Step 1 — Read the files

Read the spec file at `$ARGUMENTS` and the corresponding stories file (replace `_spec.md` with `_stories.md` in the path, or append `_stories.md` if the spec file does not end in `_spec.md`). If either file is missing, tell the user and stop.

## Step 2 — Confirm before creating issues

Summarise what you are about to create:
- One epic issue in `avni-india/avni-product` (from the spec)
- One issue per story in its respective repository (from the stories file)

List each item with its title and target repo. Ask the user to confirm before proceeding.

## Step 3 — Create the epic issue in avni-product

Use `gh issue create` to create the epic in `avni-india/avni-product`:

```bash
gh issue create \
  --repo avni-india/avni-product \
  --title "<Feature Name> — Epic" \
  --body "<spec content formatted as markdown>" \
  --label "epic"
```

The body should contain:
- The full spec (Primary Goals, Feature Description, Overall Technical Approach)
- A placeholder checklist at the bottom for story links (to be filled in after stories are created)

Record the URL of the created epic issue.

## Step 4 — Create story issues

For each story in the stories file:

1. Parse the story title and repository from the heading: `## [Story Title] · \`[repository-name]\``
2. Map the repository name to its full GitHub path under `avni-india/` (e.g. `avni-server` → `avni-india/avni-server`)
3. Create the issue:

```bash
gh issue create \
  --repo avni-india/<repository-name> \
  --title "<Story Title>" \
  --body "<story body including user story, acceptance criteria, technical details, testing gotchas>\n\n---\n**Epic:** <epic issue URL>"
```

4. After each story issue is created, record its URL.

## Step 5 — Update the epic with story links

Edit the epic issue body to replace the placeholder checklist with the actual story issue links:

```bash
gh issue edit <epic-issue-number> \
  --repo avni-india/avni-product \
  --body "<updated body with story links as a checklist>"
```

Format each story link as:
```
- [ ] [Story Title](story-issue-url) · `repository-name`
```

## Step 6 — Report results

Print a summary table:

| Issue | Repository | URL |
|-------|-----------|-----|
| Epic title | avni-india/avni-product | url |
| Story 1 title | avni-india/repo | url |
| Story 2 title | avni-india/repo | url |
| ... | | |
