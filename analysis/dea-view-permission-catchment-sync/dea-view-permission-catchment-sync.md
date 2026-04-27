### Primary purpose

The Data Entry App (DEA) is a web-based data entry interface for Avni, used when field workers or supervisors have internet access and do not need to rely on the Android offline app. Currently, DEA enforces **edit restrictions** based on a user's catchment and sync settings — users cannot create or modify records for subjects outside their assigned area. However, DEA does not enforce **view restrictions**: a user can search for and view any subject record in the entire organisation, regardless of their catchment assignment or sync settings.

This creates a data privacy and access control gap. In most implementations, a field worker should only be able to see data for subjects within their assigned area. This is enforced on the mobile app through sync filtering (data outside the catchment never reaches the device), but there is no equivalent filter in DEA.

The feature addresses this gap by applying the same catchment- and sync-setting-based filtering to **read/view access** in the DEA, not just to edit operations.

---

### Current state

**Mobile app (avni-client):**
Sync is the natural access barrier. The server only sends subjects to a device if the subject's registered location falls within the user's catchment, and (when applicable) if sync attribute values match. Data outside the user's scope simply never reaches the device. This is implemented in `ScopeBasedSyncService.java` which applies catchment and sync attribute filters during every sync.

**DEA (avni-webapp):**
The DEA queries the server directly in real-time — it does not rely on a local Realm database. Currently, view/search endpoints return data without applying catchment or sync attribute filters. The server enforces edit restrictions based on catchment when the user attempts a save, but the retrieval layer does not restrict what is readable.

**Ignore sync settings in DEA:**
There is an existing user-level flag `ignoreSyncSettingsInDEA` (column `ignore_sync_settings_in_dea` on the `users` table, added in migration `V1_339_7`). When `true`, sync attribute filters are bypassed in the DEA. This flag was introduced to allow supervisors or admins to see a wider data set in DEA. It currently applies only to edit restrictions. Once view restrictions are introduced, this flag must also control whether view restrictions based on sync settings are bypassed.

**Existing models and services:**
- `User.java` — holds `catchment` (FK), `syncSettings` (JSON), and `ignoreSyncSettingsInDEA` (boolean)
- `Catchment.java` — maps a user to a set of `AddressLevel` locations
- `UserSyncSettings.java` — models per-subject-type sync attribute filters (`syncConcept1`, `syncConcept1Values`, `syncConcept2`, `syncConcept2Values`)
- `ScopeBasedSyncService.java` — implements catchment + sync-attribute scoping used for mobile sync
- `OperatingIndividualScope.java` — enum: `ByCatchment` | `None`

**DEA documented limitations** (from [Avni docs](https://avni.readme.io/docs/data-entry-app)):
Dashboards and offline report cards are explicitly not supported in DEA. View restriction enforcement is not listed as a supported feature.

---

### The feature

When a user accesses the DEA, all data retrieval (subject search, subject profile, enrolments, encounters, etc.) must be filtered using the same scoping rules as mobile sync:

1. **Catchment filter**: Only subjects registered at locations within the user's assigned catchment are visible.
2. **Sync attribute filter**: If the user has sync settings configured for a subject type (syncConcept1/2 and their allowed values), only subjects whose registration form observation matches those values are visible. This mirrors how mobile sync restricts which subjects are downloaded.
3. **`ignoreSyncSettingsInDEA` override**: If this flag is `true` on the user, sync attribute filters (rule 2 above) are bypassed — the user sees all subjects within their catchment regardless of sync attribute values. Catchment filtering (rule 1) still applies.
4. **Users with no catchment**: If a user has no catchment assigned (`operatingIndividualScope = None` or no catchment FK), view behaviour should be defined — likely no data visible, or a configurable fallback.
5. **Admin / all-privileges users**: Users whose group has `hasAllPrivileges = true` should be exempt from view restrictions (consistent with how other privilege checks work).

The feature does not change the edit restriction behaviour — that already exists and should remain unchanged.

---

### Out of scope

- Reporting app (Metabase / Jasper / ETL) — access controls are explicitly not enforced there.
- Dashboards and offline report cards in DEA — these are already unsupported in DEA.
- Field-level access control — permissions remain at the subject/enrolment/encounter level.
- Multi-catchment assignment — users still have a single catchment; this feature does not change that.
- Mobile app sync behaviour — unchanged.
- Changes to the `ignoreSyncSettingsInDEA` flag's scope for edit operations — only view operations are new.

---

### Technical details

**Server-side query layer:**
The primary change is in how the DEA data retrieval endpoints (subject search, profile fetch, enrolment listing, encounter listing) build their queries. Currently they either return all org data or apply only a user-group privilege check. They need to additionally apply:
- A catchment-based location filter (matching the `ScopeBasedSyncService` logic used for sync).
- A sync attribute filter (unless `ignoreSyncSettingsInDEA` is true).

The existing scoping logic in `ScopeBasedSyncService.java` should be reusable or extractable into a shared utility so it can be applied to both sync and DEA query paths without duplication.

**Data model:**
No schema changes are expected. All the required data (`catchment_id`, `sync_settings`, `ignore_sync_settings_in_dea`) already exists on the `users` table.

**API surface:**
The DEA-facing search and retrieval endpoints need to be identified and updated. It is important to audit which endpoints the webapp uses for DEA subject access vs admin/configuration access — admin endpoints (used for bulk operations, report setup, etc.) should not be silently restricted.

**Backward compatibility:**
This is a tightening of access — users who previously could view all data will now see a reduced set. This may surface as a breaking change for existing DEA users in implementations where supervisors rely on cross-catchment visibility. The `ignoreSyncSettingsInDEA` flag partially mitigates this for sync-attribute-based restrictions, but there is no equivalent override for catchment-based view restriction today.

**Performance — key concern:**
Unlike mobile sync (which is a scheduled batch operation), DEA queries are interactive and user-driven, so per-query latency matters. Adding catchment and sync-attribute joins to every subject search, listing, and profile fetch could introduce noticeable overhead, particularly for large organisations or complex catchments with many address levels. While the indices that support `ScopeBasedSyncService` queries may carry over, this assumption needs validation before committing to an API-level approach.

Three implementation strategies are worth evaluating:

1. **Application-layer filtering** *(current proposal)*: Extend each DEA query in the service/repository layer to apply catchment and sync-attribute predicates, reusing logic from `ScopeBasedSyncService`. Simplest to implement but adds a join on every request.

2. **PostgreSQL Row Level Security (RLS)**: Avni already uses RLS for multi-tenancy via `SetOrganisationJdbcInterceptor`. Catchment-based scoping could be added as an additional RLS policy on subject tables, applied transparently to every query without application-layer changes. Keeps filtering in the DB engine and avoids per-endpoint changes, but RLS policies are harder to debug and must be maintained alongside schema migrations. Performance impact depends on PostgreSQL's ability to push the policy predicate into query plans efficiently.

3. **Pre-materialised location set**: On user login or session start, resolve the full set of `address_level_id` values in the user's catchment and cache them (in the session or a short-lived cache). Pass this as an `IN (...)` filter parameter to subject queries. Avoids recomputing the catchment join on each request; trades one upfront resolution for cheaper per-query filtering. Adds cache invalidation complexity if a user's catchment changes mid-session.

The preferred approach and its performance characteristics should be decided before speccing begins.

---

### Findings from codebase exploration

| Artifact | Location | Relevance |
|---|---|---|
| `User.java` | `avni-server-data/.../domain/User.java` | `catchment`, `syncSettings`, `ignoreSyncSettingsInDEA` fields |
| `Catchment.java` | `avni-server-data/.../domain/Catchment.java` | Geographic scoping entity |
| `UserSyncSettings.java` | `avni-server-data/.../domain/syncAttribute/UserSyncSettings.java` | Sync attribute filter model |
| `ScopeBasedSyncService.java` | `avni-server-api/.../service/ScopeBasedSyncService.java` | Existing catchment+sync filter logic (reusable) |
| `OperatingIndividualScope.java` | `avni-server-data/.../domain/OperatingIndividualScope.java` | `ByCatchment` \| `None` enum |
| `AccessControlService.java` | `avni-server-api/.../service/accessControl/AccessControlService.java` | Privilege check patterns to follow |
| `GroupPrivilege.java` | `avni-server-data/.../domain/accessControl/GroupPrivilege.java` | Group-based privilege model |
| Migration `V1_339_7` | `avni-server-api/.../db/migration/` | Adds `ignore_sync_settings_in_dea` column |
| `user.jsx` | `avni-webapp/src/adminApp/user.jsx` | User admin form (catchment + group assignment UI) |

---

### Open questions

1. **Supervisor / cross-catchment use case**: Are there known implementations where DEA users legitimately need to view data outside their catchment (e.g., a supervisor reviewing all field workers' data)? If so, should there be a separate per-user flag like `ignoreCatchmentInDEA`, analogous to `ignoreSyncSettingsInDEA`?

2. **Users with no catchment**: What should happen when a user has no catchment assigned and tries to view subjects in DEA? Show nothing? Show all? Return an error? Should this be configurable?

3. **Which DEA endpoints need updating**: Has a full audit of DEA-facing API endpoints been done? Some endpoints (e.g., concept lookup, form metadata) must remain unrestricted. Subject search and retrieval must be restricted. A clear list of in-scope endpoints is needed before speccing.

4. **Admin user exemption**: Should users in a group with `hasAllPrivileges = true` be automatically exempt from view restrictions? This is the pattern used elsewhere in the system and seems appropriate, but needs confirmation.

5. **Migration / rollout**: For existing deployments, will this be a flag-gated rollout (off by default, turned on per org) or a hard cutover? A hard cutover could break existing supervisor workflows.

6. **Is `ignoreSyncSettingsInDEA` sufficient for the override story**: This flag bypasses sync-concept filters but not catchment filters. If supervisors need full access, a broader override may be needed. Should this be extended, or should a new flag be introduced for catchment override?

7. **Search UX in DEA**: If view restrictions apply, the subject search results will be silently narrowed. Should DEA display a visible indicator that results are filtered by catchment? Or is silent filtering acceptable?

8. **Implementation strategy for filtering**: Given the performance concern with adding catchment/sync-attribute joins to every interactive DEA query, which approach is preferred — application-layer filtering, PostgreSQL RLS extension, or pre-materialised location set on login? Each has different tradeoffs in complexity, debuggability, and performance. This decision should be made before speccing the server-side changes.
