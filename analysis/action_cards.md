### Primary purpose
[Cards](https://avni.readme.io/docs/offline-reports) are an existing feature in the Avni Android app. In the current form, cards go to a listing that they are linked to. We also have custom cards, but when clicked, the only behaviour supported is to open the Subject Profile. Standard report cards each have their own defined views, and actions.  

In many scenarios, we do not want the default action to be performed. For example, when a card only displays one subject, and the reason the card is there is known in advance, we would want the card to directly perform the action. An example would be a form that needs to be filled, and there are one, or a handful of subjects available. This will reduce two clicks, and make the user experience much better. 

We also have a scenario where the action to be done once an action is performed would be to come back to the place where the action loop started. For example, if there is only one subject, and the form is filled, the user would want to come back to the home screen. If there are multiple subjects, they might want to go to the listing screen. 

This epic introduces these features into the system. In order to perform this, the following needs to be done. 

### The feature
- On the report card, the following fields need to be added
  - Action: An action means what needs to be performed when clicking on a card, when the action is not already defined. Typical actions are - Show subject (default), Enrol, Perform Visit, Exit program
  - Action Detail: When Enrol is the action, a program needs to be present.
  - On Action Completion: When the action is completed, there are a few screens to which the user can be redirected to. Right now, the default is the Subject Profile. We would also want to have "Home" as an action (we might add more options here later)
- When performing a visit, we look for a scheduled visit. If it is present, we use it. If not, then we start an unscheduled visit.
- Validity of actions
  - For Due and Overdue visit cards, the app shows links to both the visit as well as the subject. This stays as-is, with default action being performed only when there is just a single visit.
  - Actions will never be supported in Approval cards (Approved, overdue, Pending, Rejected), Tasks (Call and Open Subject), and Comments. It will, however, be available on all other standard reporting cards
- MVP: We will currently only support Perform Visit in this version (in addition to Show Subject, which will be the default) 
- When there is only one subject in a report card listing, perform the action on the subject


### Technical details
- Action, Action Detail, and On Action Completion will be added as new columns on the Report Card
- Export zip needs to include the new fields
- Reporting is out of scope since this is only UI configuration
- Details need to be added to readme. This needs a separate card

### Findings from codebase exploration

**Repositories affected (confirmed):**
- `avni-server` — ReportCard JPA entity + migration + CardService + ReportCardBundleContract (export)
- `avni-webapp` — CreateEditReportCard.jsx + WebReportCard.js model + reducer
- `avni-models` — ReportCard.js Realm schema (this is a separate repo, `openchs-models`, consumed by avni-client; must be updated here first)
- `avni-client` — CustomDashboardActions.js (navigation) + ReportCardService.js (execution)

**Current StandardReportCardType values (from StandardReportCardTypeType.java):**
`PendingApproval`, `Approved`, `Rejected`, `ScheduledVisits`, `OverdueVisits`, `Total`, `Comments`, `CallTasks`, `OpenSubjectTasks`, `DueChecklist`, `RecentRegistrations`, `RecentEnrolments`, `RecentVisits`

**Cards where actions are excluded (confirmed via code):**
- Approval types: `PendingApproval`, `Approved`, `Rejected`
- Task types: `CallTasks`, `OpenSubjectTasks`
- Comment type: `Comments`
- `DueChecklist` — status unclear, needs decision (see questions)

**Current navigation flow on card press (CustomDashboardActions.js):**
- Custom query cards → `IndividualSearchResultPaginatedView`
- Default types (ScheduledVisits, OverdueVisits, etc.) → `IndividualListView`
- Approval types → `ApprovalListingView`
- Comment type → `CommentListView`
- Task types → `TaskListView`
- Checklist type → `ChecklistListingView`

**Scheduled vs unscheduled visit logic (IndividualService.js):**
- Scheduled visits query: `earliestVisitDateTime <= now <= maxVisitDateTime`, not yet done, not cancelled
- Overdue visits: `maxVisitDateTime < now`, not yet done
- The analysis says "if a scheduled visit is present, use it; otherwise start an unscheduled visit" — the unscheduled path requires knowing which encounter type to create (not yet specified)

**For ScheduledVisits/OverdueVisits cards specifically:**
- The listing view currently shows both a subject link and a visit link per row
- The analysis states "default action is performed only when there is just a single visit" for these card types — this is a special case distinct from the general single-subject rule

**avni-models is a separate npm package** (`openchs-models`) that must be updated and re-linked before avni-client can consume the new fields. The Realm schema in `ReportCard.js` needs the three new fields added.