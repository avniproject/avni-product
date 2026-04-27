# WhatsApp Link → Avni App Open

**Date:** 2026-04-15
**Status:** Draft

---

## Primary purpose

Field workers (pump operators, health workers, community volunteers) receive WhatsApp nudge messages reminding them to take an action — record a visit, complete a follow-up, update a task status. Currently, even with a message in hand, the worker must manually unlock their phone, find the Avni app, and navigate to the right record. This friction reduces task completion rates, especially for low-digital-literacy users.

This feature allows a WhatsApp message to contain a tappable link that opens the Avni Android app directly — either on a specific task or a subject's record — eliminating manual navigation entirely.

**Who is affected:** Field workers using the Avni Android app. Programme managers benefit indirectly through higher task completion rates.

---

## Current state

### WhatsApp messaging (implemented — server + web admin)

Avni has a working messaging integration built on **Glific** (an open-source WhatsApp platform):

- `MessagingService.java` — schedules and dispatches messages to users/subjects
- `MessageSenderJob.java` — sends pending messages every 5 minutes
- `GlificRestClient.java` — HTTP client to the Glific API
- `MessageController.java` — REST endpoints (`POST /web/message/sendMsg`, `POST /web/message/startFlowForContact`)
- Web admin (`WhatsAppHome.jsx`, `WhatsAppUsersTab.jsx`) — UI for sending messages to users and subjects

**Gap:** Messages today are plain text with a limited `@name` placeholder. There is no way to include a tappable deep-link in the message body.

### Tasks feature (implemented — mobile)

The Tasks feature is fully built in the Android app. Tasks are created via the external API, assigned to users, synced to devices, and displayed in `TaskListView.js` / `TaskCard.js`. Two task types exist: **Call** and **Open Subject**.

**Gap:** There is no way to navigate to a specific task from outside the app.

### Deep linking (not implemented)

The Avni Android app has **no deep-linking support**:

- `AndroidManifest.xml` has only the standard launcher intent filter — no URL-handling configuration of any kind
- The React Native `Linking` API is used only for *outbound* links (opening external URLs from within the app). There are no inbound URL handlers anywhere in the codebase.

### Push notifications (not implemented)

Firebase is present for analytics only. There is no FCM messaging package — the app cannot receive push notifications.

---

## The feature

### User-facing behaviours

1. **WhatsApp message contains a tappable link.** When Avni sends a nudge message to a field worker via WhatsApp, the message body includes a link (e.g. a URL pointing to a specific task or subject).

2. **Tapping the link opens the Avni app.** On Android devices with Avni installed, tapping the link launches the app directly — no browser opens, no manual navigation required.

3. **The app opens on the right screen.** The app navigates directly to the relevant destination:
   - A task link opens the app on the task the worker needs to act on
   - A subject link opens the app on that subject's record
   - An unrecognised or generic link opens the app on its home screen

4. **Unauthenticated users are handled gracefully.** If the worker is not logged in, the app shows the login screen. After login, the app navigates to the intended destination automatically.

5. **Fallback when the app is not installed.** If Avni is not installed on the device, the link opens in a browser. The browser page prompts the user to install the app (Play Store link) or shows a "please open the Avni app" message. No data is exposed in the browser.

### Configuration behaviour

6. **Message templates support a deep-link placeholder.** Programme configurers can include a deep-link placeholder (e.g. `@taskLink`) in a message rule or template. The messaging system resolves this to the correct URL at the time the message is sent.

7. **Base URL is configurable per deployment.** Organisations using a self-hosted Avni instance will have a different domain than the cloud deployment. The base URL for generated links is a deployment-level configuration, not hard-coded.

---

## Out of scope

- **iOS / iPhone.** The Avni mobile app is Android-only. iOS Universal Links are not in scope.
- **Push notifications (FCM).** Delivering nudges via Firebase Cloud Messaging is a separate capability. This feature is specifically about WhatsApp messages with tappable links.
- **Web app deep linking.** The `avni-webapp` is not in scope.
- **Creating or scheduling nudge messages.** The existing Glific-based messaging configuration in `avni-webapp` is used as-is. This feature only adds link generation and app-side handling.
- **In-app notification inbox.** No notification history UI is in scope.
- **Automatic task creation triggered by the tap.** Tasks must exist and be assigned before a link to them is meaningful.

---

## Android flavour management

### The problem

Avni is distributed as multiple Android flavours — at minimum **standard Avni** (`com.openchsclient`) and **Avni Gramin** (`com.openchsclient.gramin`). These are distinct APKs with different package names, potentially different signing keys, and separate Play Store listings. The WhatsApp link must open the correct flavour, and the browser fallback must offer the correct Play Store link.

### Why custom URL schemes don't solve this

A custom URI scheme such as `avni://open` is:
- Not rendered as a tappable link in WhatsApp (WhatsApp only activates `https://` URLs)
- Not uniquely addressable per flavour without per-flavour schemes — and even then, there is no standard inter-app disambiguation

Android App Links (`https://`) is therefore the only viable path.

### How App Links work with multiple flavours

An `assetlinks.json` file at `https://domain/.well-known/assetlinks.json` can list **multiple app packages**. Android reads this file and associates all listed packages with the domain. When a link to that domain is tapped:

- If **one** of the listed apps is installed → it opens directly, no dialog
- If **multiple** are installed → Android shows a disambiguation dialog

For Avni's deployment model, a field worker's device will almost always have exactly one flavour installed (they receive a specific APK from their programme). The disambiguation dialog is therefore not a real-world concern.

### Recommended approach: single domain, both flavours in `assetlinks.json`

**Domain:** `https://avniproject.org/open`

**`assetlinks.json`** hosted at `https://avniproject.org/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.openchsclient",
      "sha256_cert_fingerprints": ["<standard_app_SHA256>"]
    }
  },
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.openchsclient.gramin",
      "sha256_cert_fingerprints": ["<gramin_app_SHA256>"]
    }
  }
]
```

Both flavours' `AndroidManifest.xml` declare the **same intent filter** (both claim the same domain):

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW"/>
  <category android:name="android.intent.category.DEFAULT"/>
  <category android:name="android.intent.category.BROWSABLE"/>
  <data android:scheme="https" android:host="avniproject.org" android:pathPrefix="/open"/>
</intent-filter>
```

Android's App Links verification then associates the installed flavour with the domain automatically.

### Browser fallback: flavour-specific Play Store redirect

When the app is not installed, the link opens in a browser. The browser landing page at `https://avniproject.org/open` needs to redirect to the correct Play Store listing. Because Android handles routing to the installed app automatically, the browser fallback is only reached when no flavour is installed.

The recommended approach is to pass a `flavor` query parameter in the generated URL:

| Flavour | Link sent in WhatsApp message |
|---|---|
| Standard | `https://avniproject.org/open?flavor=standard` |
| Gramin | `https://avniproject.org/open?flavor=gramin` |

The browser landing page reads `?flavor` and redirects:

| `?flavor` value | Redirects to |
|---|---|
| `standard` | Play Store: `com.openchsclient` |
| `gramin` | Play Store: `com.openchsclient.gramin` |
| missing/unknown | A generic "Install Avni" page listing both options |

The `?flavor` parameter is **ignored by the Android App Links system** — Android opens whichever flavour is installed regardless of query params. It is used only by the server-rendered browser fallback page.

### Server-side: how the correct URL is generated

The Avni server already knows the organisation for each user. The organisation's flavour is stored in (or can be derived from) its server configuration. At message-send time, the messaging service generates the link with the correct `?flavor` value:

```
org.flavor = "gramin"
→ link = "https://avniproject.org/open?flavor=gramin"
```

No change is needed to the Android-side handling; both flavours handle the URL identically once the app is open.

### Signing certificate fingerprints

Each flavour in `assetlinks.json` must reference the **release** signing key's SHA-256 fingerprint. If a flavour uses the same keystore as standard Avni, both entries will share the same fingerprint but must still have separate package name entries. Fingerprints must be updated in `assetlinks.json` whenever a signing key rotates.

This is an `avni-infra` responsibility — the hosted `assetlinks.json` must be kept in sync with the signing keys used in CI/CD.

### Alternative considered: per-flavour subdomains

An alternative is to use separate subdomains (`app.avniproject.org` for standard, `gramin.avniproject.org` for Gramin), each with its own `assetlinks.json` listing only one package. This gives zero ambiguity and cleaner separation, but requires:

- Two subdomains to maintain
- Two `assetlinks.json` files
- Different URLs in WhatsApp messages for each flavour

This is more complex for no practical benefit given that disambiguation is not a real-world issue. The single-domain approach is preferred.

### Summary table

| Concern | Solution |
|---|---|
| WhatsApp renders link as tappable | Use `https://` (App Links), not custom URI scheme |
| Standard flavour opens correctly | Both flavour packages listed in one `assetlinks.json` |
| Gramin flavour opens correctly | Same — whichever is installed opens directly |
| Disambiguation if both installed | Acceptable; virtually never happens in practice |
| Browser fallback — right Play Store link | `?flavor=gramin` query param read by landing page |
| Server generates correct URL | Org → flavour mapping in server config drives `?flavor` value |
| Signing key changes | `avni-infra` updates `assetlinks.json`; no app code change needed |

---

## Technical details

### Android App Links

WhatsApp only renders `https://` URLs as tappable — custom URL schemes (e.g. `avni://`) appear as plain text. The implementation therefore requires **Android App Links**:

- An intent filter with `autoVerify="true"` must be added to `AndroidManifest.xml`
- A Digital Asset Links file (`assetlinks.json`) must be hosted at `/.well-known/assetlinks.json` on the target domain, referencing the app's package name (`org.lfeteach.openchsclient`) and release signing certificate fingerprint

**Self-hosted constraint:** App Links verification is tied to the domain in the intent filter. Organisations on a custom domain must either host their own `assetlinks.json` or the feature is initially scoped to the canonical cloud domain only.

### React Native Linking — JS layer

- `Linking.getInitialURL()` must be called on app start to retrieve a URL that launched the app
- `Linking.addEventListener('url', handler)` must be registered to handle links tapped while the app is running
- A new deep-link router is needed to translate external URL paths (e.g. `/open/task/{uuid}`) to internal navigation routes
- Post-login deferred navigation is needed: if the user is not authenticated when a deep link arrives, the target must be stored and replayed after login

### Server-side link generation

- The messaging service must generate a deep-link URL for a given entity (Task UUID, Subject UUID) at message send time
- The base URL must be read from a configurable property to support self-hosted deployments

### Affected repositories

| Repository | Change area |
|---|---|
| `avni-client` | AndroidManifest intent filter, JS Linking handlers, router, post-login deferred navigation |
| `avni-server` | Deep-link URL generation in messaging service, configurable base URL |
| `avni-webapp` | Message template UI (deep-link placeholder support) |
| `avni-infra` | Hosting `assetlinks.json` on the cloud domain |

---

## Findings from codebase exploration

| File | Relevance |
|---|---|
| `avni-client/.../AndroidManifest.xml` | Add App Links intent filter; currently only has launcher filter |
| `avni-client/.../MainActivity.java` | ReactActivity base class handles `onNewIntent` forwarding automatically |
| `avni-client/.../src/views/RootView.js` | App entry point — add `Linking.getInitialURL()` call here |
| `avni-client/.../src/utility/CHSNavigator.js` | Add `navigateToDeepLink(url)` method |
| `avni-client/.../src/views/task/TaskListView.js` | Deep-link target for task links |
| `avni-client/.../src/service/task/TaskService.js` | Look up task entity by UUID from deep-link |
| `avni-server/.../messaging/service/MessagingService.java` | Add deep-link URL generation |
| `avni-server/.../messaging/api/MessageController.java` | Expose link-generation if needed |
| `avni-webapp/.../news/whatsapp/WhatsAppUsersTab.jsx` | Surface deep-link placeholder in messaging UI |

---

## Open questions

1. **Navigation target for tasks.** Should a task link open `TaskListView` with the task highlighted, or open a dedicated single-task view? No single-task detail view currently exists separate from the card list.

2. **Which task types need links?** Call tasks and Open Subject tasks behave differently in the UI. Do both types need deep links, or just one?

3. **Self-hosted domain strategy.** Should deep links work only for the cloud deployment (MVP), or must self-hosted orgs be supported from day one? Self-hosted orgs would need to host their own `assetlinks.json` and landing page on their own domain and add a matching intent filter in a custom build. Recommending cloud-only for MVP, with self-hosted documented as a follow-on.

4. ~~**Flavour-specific links.**~~ Resolved — see "Android flavour management" section above. Single domain `https://avniproject.org/open` with both flavour packages in `assetlinks.json`; `?flavor` query param for browser fallback.

4. **Session expiry UX.** If the worker's token has expired when they tap the link, should the app resume at the deep-link destination after re-authentication, or just open on the home screen?

5. **Link expiry / stale targets.** Should deep links be time-limited? What should the app display if the linked task has already been completed or deleted?

6. **Glific flow changes.** Does inserting a URL into Glific message bodies require changes to existing Glific flow configurations managed outside Avni? Who is responsible for those changes?

7. **Browser fallback page.** Is there an existing web page at the target URL path, or does a new landing/install-prompt page need to be built?

8. **Multiple orgs in one APK.** The production APK supports multiple organisations selected at login. Is there a risk that a link from Org A opens in a session currently logged in as Org B?

9. **Analytics.** Should link taps be tracked (e.g. via Firebase Analytics) to measure nudge-to-action conversion rates?
