---
name: generate-release-notes
description: "Use this skill to generate/compile NEW GitHub release notes for an Avni platform release from the issues tagged with that release. Triggers include: 'generate release notes for <version>', 'draft release notes', 'write the release notes for the X.Y release', or any request to compile the issues tagged with a release into publishable notes following the avni-product release format. (For viewing existing/published release notes, use the release-notes skill instead.)"
---

# Avni Release Notes

You are generating release notes for an Avni platform release. Issues for a release are tracked in the **"Avni Product" GitHub Project** (owner `avniproject`, project number `2`) via a single-select **"Release"** field (e.g. `17.0.0`). Notes follow the format of previous releases at https://github.com/avniproject/avni-product/releases.

Given a target version (ask if not provided — e.g. "17.0.0"):

---

## Step 1 — Pull the issues tagged with the release

The Release field option is the exact version string (e.g. `17.0.0`, not `v17.0.0`). Confirm the option exists, then list all project items with that value:

```bash
# Confirm the Release field options
gh project field-list 2 --owner avniproject --format json \
  | python3 -c "import json,sys; f=[x for x in json.load(sys.stdin)['fields'] if x['name']=='Release'][0]; print([o['name'] for o in f['options']])"

# Pull all items and filter to the target release
gh project item-list 2 --owner avniproject --format json --limit 800 > /tmp/avni-items.json
python3 -c "
import json
d=json.load(open('/tmp/avni-items.json'))
rel=[i for i in d['items'] if i.get('release')=='<VERSION>']
for i in rel:
    c=i.get('content',{})
    repo=c.get('repository','?').split('/')[-1]
    print(repo+'#'+str(c.get('number','?')), '||', i.get('card Type','-'), '||', i.get('status','-'), '||', c.get('title',''))
"
```

Notes on the data:
- Each item's `content` has `repository` (full `owner/name`), `number`, `title`, and `type` (`Issue` / `PullRequest`).
- Item-level fields surface as lowercased keys: `release`, `status`, `card Type` (values: bug, story, spike, epic, support, checklist).
- Items span many repos: avni-server, avni-client, avni-webapp, avni-models, avni-etl, avni-media, avni-infra, avni-website, avni-ai, avni-product, avni-product-ops, rules-config, avni-health-modules, rules-server.
- Bump `--limit` if the project has grown beyond 800 items.

## Step 2 — Categorise

Sort every issue into these sections (drop empty sections):

- **🚀 New** — Headline feature(s). Look for a cluster of many issues across repos sharing a prefix/theme (e.g. "Edge-model remote fetch (P0): ..."). Group the cluster into ONE narrative section with sub-bullets grouped by concern (entity/sync, client, security, storage, first tenant, docs), each sub-bullet citing its several issues. This is the release's story, not a flat list.
- **🔒 Security** — Anything titled `[Security]`, RLS/row-level-security, auth, data-exposure, or credential handling.
- **🛠️ Improvements** — Enhancements, new configuration/UX affordances, performance work that adds capability, infra stand-ups.
- **🐛 Bug Fixes** — Titles that are defect fixes (card Type `bug`, or worded as a fix/broken behaviour). Rephrase each as "Fix <the problem>".
- **🧰 Maintenance** — Cross-repo chores (CI migrations, dependency/tooling). Keep light; omit if there are none.

**Exclude** release-management meta issues: the `Release X.Y.Z` tracking issue, `Branch cut ...`, and pure `[Spike]`/design-submission items with no shipped user-facing change. If unsure whether a spike shipped something, check the issue body with `gh issue view`.

## Step 3 — Write the notes

Match the house style (see the latest published release for reference):
- Title: `# Avni Release Notes v<VERSION>` (tag is `v`-prefixed even though the Release field is not).
- One-sentence framing under the headline `🚀 New` section explaining the user-facing value; continuity with the previous release is good ("Building on X shipped in <prev>...").
- Every bullet ends with its issue link(s) in the form `([avniproject/<repo>#<n>](https://github.com/avniproject/<repo>/issues/<n>))`. Multiple related issues → comma-separated links in one bullet. (The `/issues/` path auto-redirects for PRs, so it is safe for both.)
- Bullets are outcome-oriented and readable by implementers, not raw issue titles. Rephrase terse/internal titles into plain language; strip emoji-prefixed noise like "🐞 Bug:".
- Add a `📖 Full documentation:` link when a headline feature has a readme.io doc.

## Step 4 — Deliver

Write the notes to a file and show them to the user for review. **Do not publish** unless explicitly asked. If asked to publish:

```bash
gh release create v<VERSION> --repo avniproject/avni-product \
  --title "v<VERSION>" --notes-file <path> --draft   # keep --draft until confirmed
```

Report the counts you compiled (total issues, and how many fell into each section) so the user can sanity-check coverage against the project board.
