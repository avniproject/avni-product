You are publishing or updating a spec and its stories as GitHub issues. The argument is the name of a subdirectory within `analysis/` (e.g. `/publish action_cards`).

---

## Step 1 — Resolve the target directory

If `$ARGUMENTS` is empty:
- List the subdirectories inside `analysis/`
- Ask the user which one they want to publish and stop — do not proceed until they answer

If `$ARGUMENTS` is provided, the target directory is `analysis/$ARGUMENTS`.

Find the spec file by looking for a file matching `*_spec.md` inside the target directory.
Find the stories file by looking for a file matching `*_stories.md` inside the target directory.

If either file is missing, tell the user and stop.

---

## Step 2 — Detect mode: publish vs update

Check if a file named `published_issues.md` exists inside the target directory.

- **If it does not exist** → this is a **publish** run. Continue to Step 3.
- **If it exists** → this is an **update** run. Skip to the UPDATE FLOW section at the bottom.

---

## Step 3 — Ask for release (publish only)

Ask the user: "Which release should these issues be tagged to? (e.g. `16.11.0`) — or press Enter to skip."

Wait for the answer before proceeding. Record it as `RELEASE_NAME` (may be empty).

---

## Step 4 — Confirm before creating issues

Summarise what you are about to create:
- One epic issue in `avniproject/avni-product` (from the spec)
- One issue per story in its respective repository (from the stories file)
- If RELEASE_NAME is set: all issues will be added to the **Avni Product** GitHub Project (project 2) with Release = `RELEASE_NAME`

List each item with its title and target repo. Ask the user to confirm before proceeding.

---

## Step 5 — Create the epic issue in avni-product

```bash
gh issue create \
  --repo avniproject/avni-product \
  --title "<Feature Name> — Epic" \
  --body "<spec content + placeholder stories checklist>" \
  --label "epic"
```

The body should contain:
- The full spec (Primary Goals, Feature Description, Overall Technical Approach)
- A `## Stories` section at the bottom with `<!-- stories -->` as a placeholder

Record the epic issue URL and number.

---

## Step 6 — Create story issues

For each story in the stories file:

1. Parse the story title and repository from the heading: `## [Story Title] · \`[repository-name]\``
2. Map the repository name to its full GitHub path under `avniproject/` (e.g. `avni-server` → `avniproject/avni-server`)
3. Create the issue:

```bash
gh issue create \
  --repo avniproject/<repository-name> \
  --title "<Story Title>" \
  --body "<story body>\n\n---\n**Epic:** <epic issue URL>"
```

4. Record each story's URL and issue number.

---

## Step 7 — Update the epic with story links

Edit the epic to replace `<!-- stories -->` with the actual checklist:

```
- [ ] [Story Title](url) · `repository-name`
```

---

## Step 8 — Add to project board and set release (if RELEASE_NAME is set)

For each issue (epic + all stories):

1. Add to project:
```bash
gh project item-add 2 --owner avniproject --url <issue-url> --format json
```
Record the returned `id` (project item ID).

2. Look up the Release field option ID for RELEASE_NAME from the project fields. The Release field ID is `PVTSSF_lADOARJb1M4ARRhzzgPlLE`. Find the option ID matching RELEASE_NAME from the known options (e.g. `16.11.0` → `226198a6`).

3. Set the release:
```bash
gh project item-edit \
  --project-id PVT_kwDOARJb1M4ARRhz \
  --id <item-id> \
  --field-id PVTSSF_lADOARJb1M4ARRhzzgPlLE \
  --single-select-option-id <option-id>
```

---

## Step 9 — Save published_issues.md

Write a file at `analysis/$ARGUMENTS/published_issues.md` with the following format:

```markdown
# Published Issues — <Feature Name>

## Epic
- [<title>](<url>) · `avni-product` · #<number>

## Stories
- [<title>](<url>) · `<repo>` · #<number>
- ...

## Metadata
- Release: <RELEASE_NAME or "none">
- Published: <today's date>
```

---

## Step 10 — Report results

Print a summary table:

| Issue | Repository | URL |
|-------|-----------|-----|
| Epic title | avniproject/avni-product | url |
| Story title | avniproject/repo | url |
| ... | | |

---

---

# UPDATE FLOW

Triggered when `published_issues.md` already exists in the target directory.

## U1 — Read current state

Read `published_issues.md` to get the epic issue number and all story issue numbers and their repos.

## U2 — Diff spec and stories

For each issue, fetch the current GitHub body:
```bash
gh issue view <number> --repo avniproject/<repo> --json body --jq '.body'
```

Compare it to the corresponding content in the spec/stories files.

Show the user a diff for each issue that has changed. Format it clearly:

```
## Changes detected

### Epic (#1847 · avni-product)
--- current
+++ new
  <diff lines>

### Story: Add action fields (#978 · avni-server)
(no changes)

### Story: Admin UI (#1743 · avni-webapp)
--- current
+++ new
  <diff lines>
```

If no issues have changed, tell the user and stop.

## U3 — Confirm before updating

Ask the user to confirm which issues to update. Default: all changed issues.

## U4 — Apply updates

For each confirmed issue:
```bash
gh issue edit <number> --repo avniproject/<repo> --body "<new body>"
```

## U5 — Report results

List each updated issue with its URL.
