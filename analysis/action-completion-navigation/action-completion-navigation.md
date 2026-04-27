### Primary purpose

When a field user completes a form triggered from a custom data card action (e.g. "Do visit"), the app currently navigates to a fixed destination. Different workflows need different post-completion destinations — returning to the subject profile vs. returning to wherever the user came from. This feature lets the implementer configure the post-completion navigation behaviour per card.

---

### Current state

After completing a form fill triggered from an action card, the navigation destination is fixed. There is no way for an implementer to configure where the user lands after saving the form.

---

### The feature

A new **"On Action completion"** dropdown is added to the Custom Data Card configuration screen in the web admin, positioned below the "Visit Type" field.

**Acceptance Criteria**

**Web admin (avni-webapp)**

- An "On Action completion" dropdown is shown below the "Visit Type" dropdown in the Custom Data Card config
- Options: **Subject Profile** and **Source page**
- This field is saved as part of the card configuration

**Mobile app (avni-client) — "Subject Profile" configured**

- After the user saves the form, the app navigates to the subject's profile page, regardless of where the form was opened from

**Mobile app (avni-client) — "Source page" configured**

- After the user saves the form, the app returns to the page from which the form was opened
- Source page depends on the number of overdue visits at the time the card was tapped:
  - **Single overdue visit:** tapping the card opens the form directly → on completion, return to **dashboard**
  - **Multiple overdue visits:** tapping the card opens a listing page → user selects a visit → form opens → on completion, return to the **listing page**

---

### Navigation flow diagram

```
Single overdue visit:
  Dashboard → [tap card] → Form → [save] → Dashboard  (Source page)
                                          → Subject Profile  (Subject Profile)

Multiple overdue visits:
  Dashboard → [tap card] → Listing page → [tap visit] → Form → [save] → Listing page  (Source page)
                                                                        → Subject Profile  (Subject Profile)
```

---

### Out of scope

- Standard Report Cards, Nested Report Cards, Custom Design Cards — only Custom Data Card is in scope
- Navigation behaviour for cancelled/abandoned forms (back button, not save)
- Configuring navigation for other action types beyond "Do visit"
- MyDashboard (deprecated)

---

### Analysis note

Current usage patterns on the ground are not yet clear. Scope is deliberately limited to Custom Data Card with this configurable dropdown — only organisations that explicitly configure "On Action completion" are affected. The feature can evolve as usage patterns become clearer.

---

### Technical details

**Web admin**

- New dropdown field `onActionCompletion` (values: `SUBJECT_PROFILE`, `SOURCE_PAGE`) added to the card configuration form in `avni-webapp`
- Field persisted to the server as part of the dashboard card config entity

**Mobile app**

- On card tap, the app records the **source page** (dashboard or listing page) before navigating forward
- This source is stored in navigation state / passed through the navigation stack for the duration of that action
- On form save:
  - If `SUBJECT_PROFILE` → navigate to subject profile
  - If `SOURCE_PAGE` → navigate back to the recorded source page
- The Android back stack naturally supports "go back to listing page" — the key is ensuring the form save action triggers the correct navigation rather than a hardcoded destination

**Affected repositories**

| Repository | Change |
|---|---|
| `avni-webapp` | Add "On Action completion" dropdown to Custom Data Card config UI |
| `avni-server` | Store and expose `onActionCompletion` field on dashboard card config |
| `avni-client` | Read `onActionCompletion` config; record source page on card tap; navigate to correct destination on form save |

---

### Open questions

1. **Default value:** If an existing card has no `onActionCompletion` configured (before this feature), what is the default behaviour — Subject Profile or Source page? Should it preserve current behaviour to avoid breaking existing deployments?
2. **Form abandonment:** If the user taps back without saving, should the same navigation rule apply, or always go back naturally?
3. **Sync timing:** After returning to the dashboard or listing page, does the card/list re-query immediately to reflect the completed visit, or does the user need to manually refresh?
