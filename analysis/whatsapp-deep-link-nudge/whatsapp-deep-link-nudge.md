# WhatsApp Deep-Link Nudge

**Date:** 2026-04-15
**Status:** Draft

---

## Primary purpose

Field workers such as pump operators often need a nudge to take action — record a visit, complete a follow-up, or update a status. Today, even when a WhatsApp message reminds them to act, they must manually unlock their phone, find the Avni app, navigate to the right task, and begin work. This friction reduces compliance, especially for low-digital-literacy users.

This feature allows a WhatsApp nudge message to contain a tappable link. When the field worker taps it, the Avni Android app opens directly — either to the task they need to act on, or to the relevant subject's record — eliminating all manual navigation.

The primary beneficiaries are **field workers** (pump operators, health workers, community volunteers) using the Avni Android app. Secondary beneficiaries are **programme managers** who see improved task completion rates.

---

## Current state

### WhatsApp messaging — server side (implemented)

Avni has a messaging system built on **Glific** (an open-source WhatsApp platform). The integration is fully implemented on the server side:

- `MessagingService.java` — core message scheduling and dispatch logic
- `MessageSenderJob.java` — scheduled job (every 5 minutes) that sends pending messages
- `GlificRestClient.java` — HTTP client to the Glific API
- `MessageController.java` — REST endpoints for sending messages (`POST /web/message/sendMsg`, `POST /web/message/startFlowForContact`)
- The web admin (`WhatsAppHome.jsx`, `WhatsAppUsersTab.jsx`) supports sending messages to users and subjects

Messages today are plain text with a limited `@name` placeholder. There is no mechanism to include a deep-link URL in the message body.

### Tasks feature — mobile (implemented)

The Tasks feature is fully built in the Android app:

- Tasks are created via the external REST API (`POST /api/task`) and assigned to a specific user
- They sync to the device via the standard incremental sync protocol (`GET /task/v2`)
- `TaskListView.js` displays open tasks; `TaskCard.js` renders individual task cards with action buttons
- Two task types exist: **Call** and **Open Subject**

There is no way to navigate directly to a specific task from outside the app.

### Deep linking — mobile (not implemented)

The Android app has **no deep linking support** at all:

- `AndroidManifest.xml` contains only the standard launcher intent filter — no `VIEW` action, no custom URL scheme, no Android App Links configuration
- `MainActivity.java` does not override `onNewIntent()` or handle any inbound URL
- The React Native `Linking` API is used only for **outbound** `openURL()` calls (e.g. opening Metabase reports). There are no calls to `Linking.getInitialURL()` or `Linking.addEventListener('url', ...)` anywhere in the codebase

### Push notifications (not implemented)

Firebase is present (`@react-native-firebase/app`, `@react-native-firebase/analytics`) but only for analytics. `@react-native-firebase/messaging` (FCM) is absent — there is no push notification capability.

---

## The feature

### User-facing behaviour

1. **Nudge message contains a tappable link.** When Avni sends (or triggers via Glific) a WhatsApp message to a field worker, the message body includes an `https://` URL (e.g. `https://app.avniproject.org/open/task/{taskUUID}`).

2. **Tapping the link opens the Avni app.** On Android devices that have Avni installed, tapping the link launches the app directly rather than opening a browser.

3. **The app opens on the right screen.** Depending on the link type:
   - A task link (`/open/task/{uuid}`) opens the app on `TaskListView` with that task highlighted or directly on the task card
   - A subject link (`/open/subject/{uuid}`) opens the app on that subject's dashboard
   - If no specific target is recognised, the app opens on its home screen

4. **Unauthenticated users are redirected gracefully.** If the worker is not logged in, the app shows the login screen. After successful login, the app navigates to the intended destination.

5. **Fallback for non-Android / app not installed.** If Avni is not installed, the link opens in a browser. The browser page should either prompt the user to install the app (Play Store link) or display a graceful "please open the Avni app" message. No data is exposed in the browser.

### Configuration changes

6. **Message templates support a deep-link placeholder.** Programme configurers can include a `@deepLink` (or similar) placeholder in a message rule or message template, which the messaging service resolves to the appropriate URL at send time.

7. **Deep-link URL pattern is configurable per deployment.** Organisations using a self-hosted Avni instance will have a different base URL than the cloud deployment. The base URL should be an org-level or environment-level configuration rather than hard-coded.

---

## Out of scope

- **iOS / iPhone support.** The Avni mobile app is Android-only. Universal Links (iOS equivalent) are not in scope.
- **Push notifications (FCM).** Delivering nudges via Firebase Cloud Messaging is a separate capability. This feature is specifically about WhatsApp messages with tappable links.
- **Web app deep linking.** The Avni web app (`avni-webapp`) is not in scope for this feature.
- **Creating or scheduling nudge messages.** The existing Glific-based messaging configuration in `avni-webapp` is used as-is. This feature only adds link generation and app-side handling.
- **In-app notification inbox.** No notification history UI is in scope.
- **Automatic task creation triggered by the tap.** The task must already exist and be assigned to the user before a link to it is meaningful.

---

## Technical details

### Android App Links (required for WhatsApp)

WhatsApp renders only `https://` URLs as tappable links — custom URL schemes (e.g. `avni://`) are converted to plain text. Therefore, the implementation must use **Android App Links**:

1. **`AndroidManifest.xml`** — add an intent filter with `android:autoVerify="true"`:
   ```xml
   <intent-filter android:autoVerify="true">
       <action android:name="android.intent.action.VIEW"/>
       <category android:name="android.intent.category.DEFAULT"/>
       <category android:name="android.intent.category.BROWSABLE"/>
       <data android:scheme="https"
             android:host="app.avniproject.org"
             android:pathPrefix="/open/"/>
   </intent-filter>
   ```

2. **Digital Asset Links file** hosted at `https://app.avniproject.org/.well-known/assetlinks.json`:
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "org.lfeteach.openchsclient",
       "sha256_cert_fingerprints": ["<release-signing-cert-fingerprint>"]
     }
   }]
   ```
   This file must be served with `Content-Type: application/json` and no redirect.

3. The app's current package name is `org.lfeteach.openchsclient`. This must match `assetlinks.json` exactly.

### React Native Linking — JS layer

- On app start (in `RootView.js` or the top-level `App.js`), call `Linking.getInitialURL()` to retrieve the URL that launched the app
- Register `Linking.addEventListener('url', handler)` to handle links tapped while the app is already running
- Parse the URL path (e.g. `/open/task/{uuid}`) and translate it into the appropriate `TypedTransition` navigation call via `CHSNavigator.js`
- The current router (`PathRegistry.js`) uses internal string paths — a new `deepLinkRouter` mapping is needed from external URL paths to internal routes

### Deferred navigation post-login

- If `Linking.getInitialURL()` returns a URL but the user is not authenticated, the deep link target must be stored (e.g. in a module-level variable or lightweight async storage) and replayed after successful login in `LoginView.js`

### Link generation — server side

- The `MessagingService.java` (or a new `DeepLinkService`) must be able to generate a URL for a given entity (Task UUID, Subject UUID)
- The base URL (`https://app.avniproject.org`) must be a configurable property, not hard-coded, to support self-hosted deployments
- Message rules or templates need a way to include this URL in the message body sent via Glific

### Self-hosted deployments

- Each self-hosted organisation uses its own domain. App Links require the `assetlinks.json` to be hosted at **the exact domain** in the intent filter. This means either:
  - All deep links use the canonical `app.avniproject.org` domain as a redirect proxy, or
  - Each custom domain deployment must host its own `assetlinks.json` (documented as a deployment step)
- This is a significant constraint for multi-tenant self-hosted setups.

---

## Findings from codebase exploration

| File | Relevance |
|---|---|
| `avni-client/.../android/app/src/main/AndroidManifest.xml` | Add App Links intent filter here |
| `avni-client/.../android/app/src/main/java/org/lfeteach/openchsclient/MainActivity.java` | ReactActivity's `onNewIntent` handles forwarding automatically; may need override for specific cases |
| `avni-client/.../src/views/RootView.js` | Entry point for JS navigation — add `Linking.getInitialURL()` call here |
| `avni-client/.../src/utility/CHSNavigator.js` | Add new `navigateToDeepLink(url)` method |
| `avni-client/.../src/views/task/TaskListView.js` | Deep link target for task-type links |
| `avni-client/.../src/views/task/TaskCard.js` | May need to accept a `selectedTaskUuid` prop to highlight a specific task |
| `avni-client/.../src/service/task/TaskService.js` | `findByUUID(uuid)` to look up the task entity from the deep link UUID |
| `avni-server/.../messaging/service/MessagingService.java` | Add deep link URL generation |
| `avni-server/.../messaging/api/MessageController.java` | Possibly expose link-generation endpoint |
| `avni-webapp/.../news/whatsapp/WhatsAppUsersTab.jsx` | May surface generated links in the messaging UI |

---

## Open questions

1. **What is the intended navigation target?** Should a task link open the `TaskListView` with that task highlighted, or open a dedicated `TaskDetailView` directly? The current UI has no single-task detail view separate from the card list.

2. **Which task types need deep links?** Call tasks and Open Subject tasks behave differently. Do both need dedicated links, or only one type?

3. **Self-hosted domain strategy.** How should deep links work for organisations on a custom domain (e.g. `app.myorg.example.com`)? Should there be a central redirect proxy at `app.avniproject.org`? Or is this cloud-only for now?

4. **Authentication UX.** If the worker's session has expired (token refresh failed) and they tap a link, what should happen? Should the app auto-resume at the deep link destination after re-authentication, or just open on the home screen?

5. **Link expiry.** Should deep links be time-limited (e.g. valid for 48 hours)? If a task is completed or deleted before the link is tapped, what should the app show?

6. **Glific message template changes.** Does inserting a URL in Glific message bodies require changes to existing Glific flow configurations managed outside Avni? Who is responsible for updating those flows?

7. **Play Store / browser fallback page.** Is there an existing web page at the target URL that can serve as the fallback, or does a new landing page need to be built?

8. **Multiple organisations in one app build.** The production APK supports multiple organisations selected at login. The `assetlinks.json` is tied to the package name (same for all orgs). Is there a risk of one org's deep links opening another org's session?

9. **Analytics / tracking.** Should link taps be tracked (e.g. via Firebase Analytics) to measure nudge effectiveness?
