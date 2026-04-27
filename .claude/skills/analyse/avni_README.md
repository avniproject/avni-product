# Avni Documentation

This is a comprehensive documentation for Avni, automatically generated from all documentation sources.

---

# General

## Getting Started

Avni is an open-source platform for on-field service delivery and data collection. Designed for the development sector, Avni strengthens field capacity for non-profits and governments across sectors - like health, water, education, and social welfare.

This documentation site is geared to introduce Avni to those who would like to implement their program workflows using this system.

**Avni consists of 4 major components which perform various functions as explained below:**

1. **Avni Field App (Mobile)** : This is an Android app designed to be used in the field for data entry and collection. It can work in offline mode and can sync data whenever it has internet connectivity.  One can install the field app easily from the Google Play Store or from an APK file.

2. **Avni Web App**: This is the **Administration** Interface where you can configure and set up the Avni server,  for example configuring master data for Locations, Hierarchies, Users, designing the Program Forms, etc. It can also be used for Data Imports, Exports, and Data-Entry. It runs in a web browser.

3. **Avni Reporting and Dashboard**: This connects to the Avni server to pull out custom reports and dashboards that can be viewed in the web browser, or exported as PDFs and emailed.

4. **Avni Hosted Service**: The central instance of the Avni server running on the cloud, which stores all the master data, configuration, and field-entered data. If you don't want to use the cloud instance, then you can set up your own local instance of Avni in your data center/server. Avni is fully Open-Source.

See [Avni Hosted Service](doc:avni-hosted-service) for details of the Avni hosted service

**See Diagram Below**

![](https://files.readme.io/feb07ae-Avni_6.png "Avni (6).png")

# Documentations

1. [Implementer's guide](doc:implementers-concept-guide-introduction)
2. [Production Environment Setup guide](doc:environment-setup-guides)
3. [Design Documentation](doc:architecture)
4. [Avni Code of Conduct](doc:avni-code-of-conduct)
## Architecture

### Terms And Their Definitions

There is some terminology that has a specific meaning within Avni listed here. Understanding this will be useful to understand some of the documentation on this site. 

## SYSTEM-WIDE Terminology:

* **Organisation** - Avni has a multi-tenant architecture where multiple organisations can share the same server. A tenant in an Avni installation is called an organisation. Under an organisation one can have users, configuration (like programs, forms, settings, etc) and data (like subjects, visits, etc). 
* **Implementation** - Technically, this means the implementation of an organisation within Avni. However, this term is usually used interchangeably with Organisation. 
* **Subject** - Users in an organisation usually record data about one or more "subject types". A subject type could be a *person*, a *building*, a *dam*, or anything against which long-term data is to be recorded. 
* **Individual** - In earlier versions of Avni, there could be only one subject type - an individual. *Subject types* were introduced to the system later so that data can be recorded not just for people, but for any entity (or Subject). You might still find the term called individual in some places in Avni. All these will be replaced by the appropriate Subject term soon. Avni is already being used in places where the Subject being monitored is not a person, but an entity - like a "dam", etc. 
* **Location** - In Avni, it is mandatory to associate a subject to a location. A location could be geographic (state, village, etc) or class-rooms, etc. Locations have hierarchy support. 
* **Catchment** - A catchment is a group of locations that are monitored by a user. If there are multiple users assigned to a single catchment, they will all have access to the same data about subjects and their information under that catchment area. 
* **Form** - All information captured during registration, encounter, program enrolment, program encounter, program encounter cancellation, program exit, etc are captured through forms defined through the admin app. 
* **Concept** - This is the underlying meaning of a question asked in a form. It can be the same as the form question but can be different as well. For example, the question asked could be "*Please enter the height of a person*", while the underlying connected concept to this question could be "*Height*". Concepts provide a level of indirection between the visual form and the underlying data model and allow for validation and reporting or aggregation.

## USERS & ENCOUNTERS Terminology

* **User** - A person who can log in to the Avni system is a user. 
* **Organisation Admin** - A high-privilege User who can log in to the Avni Administration Web App for their organisation, and perform Admin functionality. 
* **Registration** - The process of creating a new *Subject* in the system is called Registration. A subject registration is usually associated with a form that can be customized to the subject type and the implementation. 
* **Encounter** - All observations about a subject recorded at a specific point in time is called an encounter. The term is interchangeably used for visits as well. 
* **Encounter Type** - Represents the type of encounter. This helps determine the set of questions that need to be asked during an encounter. For example, there might be a *monthly* visit where some questions are asked, while different questions are asked during a *quarterly* visit. 
* **Visit** - Alias to encounter

## PROGRAM Terminology

* **Program** - Information about a subject can be structured into different programs that they can be enrolled in. eg: pregnancy program, vaccination program, etc. A program comprises a name, forms for program enrolment, encounter types and their related forms, and visits scheduling logic. 
* **Program Enrolment** - is the process by which a subject enrolls into a program. Enrolment is usually associated with a form that is used for baseline information when starting a program. 
* **Program Exit** - is the process by which a subject exits from a program. An exit is usually associated with a form. 
* **Program Encounter** - is an encounter that is related to an enrolment. 
* **Program Visit** - is the same as program encounter
* **Visit Schedule** - is usually defined for a program. It can be dynamically calculated after a program enrolment or a program encounter. Logic to define a visit schedule is usually specific to the implementation and is defined using the visit scheduling extension point. 

## DOMAIN MODEL - DIAGRAM

A nice view of the domain and usage is provided in the [Implementer's concept guide - Introduction](doc:implementers-concept-guide-introduction). Head over there for a more detailed view of the system in action.
### Component Architecture

## The Avni suite includes the following components:

* Field app (Android)
* Administration app and App Designer (Web)
* Media app (Web)
* Avni server
* Rules server
* ETL Server
* Media Server
* Integration Server
* BI Tools

## Avni components

<Image align="center" src="https://files.readme.io/601f4e4-Avni_Components.png" />

### Field app (android)

The **Field app** is the primary interface for field workers. It provides the ability to fill forms and record observations from the field. The app can work completely offline and allows for sync of data to a central server (Avni server) when the field-worker is at a place with good internet. 

The login credentials of authorised users are maintained in AWS Cognito - a third-party identity server that is integrated with Avni.

### Administration app and App Designer

The **Administration app and App Designer** is a web-based interface that is used to configure organisations in Avni. Login is allowed to all organisation administrators. In this, you can configure and setup Avni server, for example configuring master data for Locations, Hierarchies, Users, design the Program Forms, etc. It can also be used for Data Imports, Exports and Data-Entry. It runs in a web browser.

### Avni Server

The **Avni server** exists for the following reasons

* A centralized place to keep data persistent and to enable sharing of data between different devices.
* Enable creation of organisation workflows and forms centrally through metadata.
* Enable availability of aggregate data that can be accessed by the Reports server. 

The Avni server is multitenant, which means that the same server can be used for multiple organisations/locations/programs. Multitenancy is achieved through *row-level security policies* within the database. This is important for Avni to achieve operational efficiency. For further in-depth details on multi-tenancy please refer [Multitenancy](doc:multitenancy-1)

### Rules Server

Avni uses JavaScript-based rules to provide configurability for each implementation of the platform. For details please refer to [Rules concept guide](doc:rules-concept-guide). These rules are executed primarily on the android device when used in the field in offline mode. Since Avni also has data entry web application which is used in the online mode, for performance reasons these rules cannot be executed in the browser. To run these rules, closer to the database, Avni provides a node-based rule server which executes the same rules on the server-side.

**Security** is handled through JWT tokens obtained from the Identity Server. More details are available here:  [Security](doc:security).

### ETL Server

Avni ETL server is a homegrown solution that creates and updates the data in an implementation specific schema (instead of generic forms data that is same for all implementation - as maintained in the main database). ETL Server keeps the data upto date at configured frequency. It works by connecting directly to the production database and uses generated SQL to create/update implementation data at a very high speed.

### Media app (web)

Media app allows the users to view the media and other type of files like Google Photos (with previews, download). These files are saved to Avni  using the field app. It also allows filtering of media files based on Avni metadata like program, subject types, dates, form fields etc.

### Integration Server

Integration server provides a platform for developer to write Java modules to integrate Avni with any implementation specific system - moving data in both directions. The platform has modules to support integration reusable products like Bahmni, Glific, Exotel. Apart from these products Avni is also integrated with customer specific systems using this platform.

### BI Tools

Avni team uses [Jasper Reports](https://www.jaspersoft.com/), [SuperSet](https://superset.apache.org/), & [Metabase](https://www.metabase.com/) as a reporting interface running on top of the ETL schema created using ETL Server. Avni allows for navigating from BI tool to Avni web app for zooming into the beneficiary/subject specific data. Other BI tools can be also used - as Avni uses Postgres database supported by most if not all BI tools.
### Multitenancy 1

The reason why Avni is multitenant is explained in [Avni service on the cloud](doc:openchs-service-on-the-cloud)  This section explains the implementation of multitenancy in Avni. 

Multitenancy in Avni is built into the database using row-level multitenancy ([RLS](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html)). All data and metadata tables that are specific to organisations are secured using RLS policies. The Avni server and the Reporting Server are multitenant aware. 

Every new organisation that is set up in Avni gets a database role. This database role is limited to access only those rows that belong that their organisation. The definition of an organisation and the database role corresponding to the organisation is in the organisation table. 

### Avni server

When an http request reaches Avni, the user is first authenticated. Based on the authenticated user's organisation, the database role of the user querying the database is set to a role that is built purely for that organisation. This limits access of data to just the organisation that the user belongs to. Below is a sample request-response cycle. 

![](https://files.readme.io/2a03d9f-Avni_multitenancy.png "Avni multitenancy.png")

### Reporting server

\[Deprecated]In the reporting server, each organisation is defined as a new database, authenticated by their corresponding database role. This limits access to data to their organisation alone. Users are assigned to groups, one group per organisation. Each group is provided access to the database that they have access to.

### Further Reading

Read this excellent blog by Vinay, from the Avni Team, on Multi-tenancy: [Creating a cost-effective multi-tenant platform - Medium.com](https://medium.com/samanvay-on-tech/creating-a-cost-effective-multi-tenant-platform-24b2ed7d0bad)
### Offline Operations And Sync

## Offline-first Avni Android App

In most places where field work happens, there is usually no or quite poor internet connectivity. Therefore Avni has been designed group up to support robust offline capabilities, so that field work can easily happen offline, and data & photos, etc. can be synced whenever there is decent internet connectivity. Avni is already being used in production in this mode.

This page provides some of the details on Avni's offline-mode support. 

## Sync mechanism

Data in Avni is broken down into transactional data, reference data and media. We first discuss sync of transactional and reference data. This is called a data server sync. Then we talk about media, and then telemetry around sync. 

### Data server sync

The sync mechanism involves both push of transactional data from the android app to the server, and pull of both reference and transactional data from the server. 

First, transactional data in the android app is pushed to the server. Then the app pulls reference data from the server. Finally, transactional data is pulled from the server. 

The EntityQueue table is used to track data that has been created or updated in the app, These are then ordered based on their relationships and then pushed to the server. The app also maintains the last updated entity of each entity type in the EntitySyncStatus table. This is used to pull all changes for each entity type after the last sync. 

### Media sync

Media in Avni is usually some image/video that is associated to an observation. Media upload happens directly to S3 from the android app. Once upload is complete, the observation is modified to store the S3 url. Since this means a change in the observation a data server sync is performed once again. 

### Telemetry (for debugging issues)

Telemetry around sync is also synced as an entity to the server so that they can be used for monitoring of sync issues of users.
### Openchs Service On The Cloud

Avni is multi-tenant and cloud-ready because it helps both the software providers and the end-users, by using a common instance of Avni Server for multiple programs / locations / organisations / etc.  

You can optionally easily deploy Avni Server on your own servers as Avni is OpenSource, but it is far economical, maintenance-free and future-proof if you choose to use Avni-on-Cloud.

## Ability to support multiple implementations

Many (not all surely) organisations that provide services on the field are often small. There are several organisations that have around 5 to 20 field workers (app users). Supporting Avni needs a sysadmin that can manage Linux, Java application, Postgres, Metabase,  networks, backups/restores, security that has significant ongoing costs associated to it. Larger organisations may already have servers and people handling them, but even for them, the cost of hosting Avni on the cloud is much lower than hosting themselves. Along with the costs, the system administrator needs to perform these activities well. Find such system administrators is not quite easy for organizations that do not have much of an IT department.

## Availability of service by health-workers

Most on-premise installations mean the server is available only in a central location over their local area network. Health workers usually come to this central location, which has internet, to sync at regular intervals. Whereas with the cloud this access is available from anywhere in the field. Of course, the in-premise deployment can also setup a VPN and acquire public IP. Both of these require maintenance and/or cost.

## Software management and Upgrades

Avni, like most products, will remain in active development for very long time. New features continuously get added, releases come out once or twice a month, patches for defects are fixed many times a month. If one runs it on-premise, the servers would need to be updated with the latest changes. As the product evolves the way it is installed also evolves. If one is not frequently updating the product, the cost of upgrade starts accumulating. On-premise deployment, also means that the app on Android PlayStore cannot be used and one needs build, host and version their own apk. 

## Economy of scale because of shared common

There are two types of economy of scale that one gets with cloud deployment.

* Shared infrastructure - Most server infrastructures are poorly utilised, with servers running much below their capacity. With cloud infrastructure since the servers are shared.
* Common services - All activities related to management of the infrastructure and the services, benefits everyone.\
  While cost component is intuitively understood. The quality component is no so much. The shared common improves in its quality because it receives inputs from all the customers and all their users.

## Benefiting from infrastructure service provides

When servers are hosted on the cloud, many of the infrastructure services like backup, restore, data encryption, server, secure access, firewalls, monitoring are implemented is a high quality fashion for you, by the provider. Replicating this at each in-premise deployment is difficult.

## Q\&A

Here are some common questions regarding cloud services that organisations ask. 

* ***Who will own my data?***\
  A big reason for organisations to not use cloud services is the worry that they might lose ownership of data. The service automatically provides reports and a complete download of data on-demand. Ownership of data **always belongs to the subscribing organization (you!)**. The hosting organisation does not have privileges to use the actual data for their own purposes, enforceable legally and also technically. 

* ***How safe is data in the cloud?***\
  Most organisations that run servers on their own are also aware of how their data is being backed up. Not knowing the mechanisms of backup causes that feeling of loss of control. 
  * The cloud provider has redundancies to ensure disk failures do not cause loss of data or downtime. 
  * Prior to software upgrade full database backup can be taken (or snapshotted) by the service provider.
  * Additionally when the database is encrypted, the cloud provider cannot read data stored in their infrastructure. All transport of data is also encrypted uses the https protocol. So, nobody can read the data when it travels between the server and the client.

* ***Who else can see my organization's data?***\
  The multi-tenant design of Avni **disallows** organizations from viewing data of other organizations. The separation of data is built into the software and the database access. Additionally when the database is encrypted, the cloud provider cannot read data stored in their infrastructure. All transport of data is encrypted uses the https protocol. So, nobody can read the data when it travels between the server and the client.

**Technical support staff** - For resolving bugs or issues during production, a limited set of Technical support staff do require access to the data, with appropriate checks and audit control in place. The best (and probably only) way to handle this problem would be to ask the support staff to sign a non-disclosure agreement - and ensure access to systems is logged and auditable.
### Reporting In Avni

#### Self Service Reports Guide For Avni

## Table of Contents

* [Introduction](#introduction)
* [Prerequisites](#prerequisites)
* [Setup Process](#setup-process)
* [User Management](#user-management)
* [Navigation](#navigation)
* [Reporting Features](#reporting-features)
* [Troubleshooting](#troubleshooting)
* [Refresh Process](#refresh-process)
* [Teardown Process](#teardown-process)
* [Appendix](#appendix)

## Introduction

### What is Metabase?

Metabase is a powerful open-source analytics and visualization tool that Avni integrates to provide comprehensive reporting capabilities. It allows you to create custom dashboards, run ad-hoc queries, and share insights across your organization with simple drag-and-drop operations.

### Self-Service Reports in Avni

Self-service Reports is a feature in Avni that allows users to create and manage reports without requiring technical expertise. It provides a user-friendly interface for creating and managing reports, and allows users to schedule and distribute reports via email.\
In Avni, we make use of Metabase to power Self-Service Reports.

> **Note:** This guide provides comprehensive documentation for setup, user management, and administration of Self-Service Reports. For hands-on training with practical exercises for using Metabase on your Avni Data, please refer to the [Getting started with Avni Metabase reports](getting-started-with-avni-reports) guide.

### Benefits of Metabase

* **User-friendly interface**: Create visualizations with simple drag-and-drop operations
* **Customizable dashboards**: Build tailored views for different stakeholders
* **Automated reporting**: Schedule and distribute reports via email
* **Data exploration**: Empower users to find insights without technical expertise
* **Secure access control**: Manage permissions at granular levels

### Inbuilt Capabilities of Self-Service Reports

Self-service Reports in Avni provides the following capabilities:

1. Creates a dedicated database user with appropriate permissions
2. Establishes a connection between Metabase and your Avni database
3. Sets up user groups and permission structures
4. Create standard Questions
5. Create collection with default dashboard

## Prerequisites

* ETL has to be enabled for your organisation, contact Avni-support team for any help regarding this.
* You need to be logged-in as a user, who belongs to a UserGroup with Analytics Privilege for your organization in Avni

<Image align="center" className="border" width="420px" border={true} src="https://files.readme.io/08e4962e2a1df9c5d3b5967ca92e0c5ac18acf0ee573971b547a4562f78e1c51-Screenshot_2025-05-20_at_7.25.43_PM.png" />

## Setup Process

### 1. Enabling Self-Service Reports

Self-Service Reports is managed at the organization level in Avni:

1. Log in to your Avni webapp
2. Navigate to Reports section
3. Click on "Self-service Reports" tab
4. Click on "Setup Reports" button

![Initial Setup State](https://files.readme.io/cdaa0376b8d1b7fbe8a1d776681b23a8f4643cbbc44c290888e5fcf356b23dd4-metabase_initial_state.png)\
*Figure 2: Initial state before Self-Service Reports setup with "Setup Reports" button*

### 2. Setup Process Stages

The setup process goes through several stages:

#### Initial Setup

When you first enable Self-Service Reports, you'll see the "Setup Reports" button. Clicking this button initiates the setup process.

#### Setup in Progress

During the setup process, you'll see a loading indicator:

![Setup in Progress](https://files.readme.io/34792bee15afc7e3ddf4a88a31e62ba4c23a8131971377c52df7a81c624c599d-metabase_loading_state.png)\
*Figure 3: Setup in progress with loading spinner*

The setup process typically takes 15-30 minutes to complete and involves:

* Database connection setup
* Initial schema synchronization
* Permission configuration
* Default Collection and Dashboard creation
* Default questions creation

#### Partial Setup

Sometimes, the setup may complete partially with only some resources available:

![Partial Setup](https://files.readme.io/61242bf6bcce5582259ac4ba46363b9cd90a102be6511728d18b6623e4417ada-metabase_partial_setup.png)\
*Figure 4.a: Partial setup with only Database resource available*

In this state, you can either:

* Wait for the remaining resources to be created automatically
* Click "Setup Reports" again to retry the setup process

### 3. Verifying Setup Completion

You can verify the setup was successful by:

1. Confirming the "Explore Your Data" button is available
2. Testing access with a user that has been added to the "Metabase Users" group in Avni

<Image align="center" src="https://files.readme.io/f0c5a313f302629bfa838cfcbbc368aac06d42a079c016331de3295e7df915a0-metabase_refresh_reports.png" />

*Figure 4.b : Successfully completed setup\
(Note: Delete button only available in development environments)*

## User Management

### User Group Synchronization

Avni automatically synchronizes users between the Avni platform and Metabase. This synchronization ensures that users added to the "Metabase Users" group in Avni can access analytics in Metabase.

#### Adding Users in Avni

To grant users access to Metabase analytics:

1. Navigate to User Groups Management in Avni Admin App
2. Select the "Metabase Users" group
3. Add the user(s) you want to grant access to the group
4. Save changes
5. User added to "Metabase Users" group, will receive an email with an account activation link

Note: Removing users from the "Metabase Users" group will remove their access to Metabase analytics.

![Avni User Groups](https://files.readme.io/5c483f0cd5480029f298a23961dfb5248f633d13195022546bc8af4248cddac7-metabase_user_groups.png)*Figure 5: Avni user groups management interface showing Metabase Users group*

#### Verification in Metabase

After adding users to the Metabase Users group in Avni, you can verify their synchronization in the Metabase admin interface:

![Metabase Admin People](https://files.readme.io/cf18e6606710fc311495adec917571095ba46e793afadd92e731a17f192fdaf1-metabase_admin_people.png)*Figure 6: Metabase Admin interface showing synchronized users*

The synchronization process:

1. Creates user accounts in Metabase with the same email addresses as in Avni
2. Includes the User in Metabase Group corresponding to their organization

## Navigation

You can navigate to Self-Service Reports from the Avni Sign-in screen, by clicking on the "METABASE REPORTS" button.

![Self-Service Reports Navigation](https://files.readme.io/5ca645c93da6b8a024963b55c58b245cb12f9c628d5a5e43eafbdf542a520699-metabase_navigate_from_avni.png)\
*Figure 7: Self-Service Reports Navigation via "Self-Service Reports" button available in Avni Sign-in screen*

## Reporting Features

### Canned Reports Dashboard

The Metabase integration includes a pre-configured "Canned Reports" dashboard that provides immediate value without requiring users to build reports from scratch.

![Canned Reports Dashboard](https://files.readme.io/7d99a2dae462bb202090ac6e4e6d73e21c47ce5a00c94c4eae4d2b09eb2ed74a-metabase_canned_reports.png)\
*Figure 8: Overview dashboard with multiple report visualizations*

Key features of the Canned Reports dashboard:

* Filter controls at the top (Date Range, Location filters, etc.)
* Multiple visualizations organized by subject area
* Interactive charts that respond to filter selections
* Donut charts showing distribution of key metrics
* Empty states for sections with no data ("No results!")
* Drill-down ability by clicking on section of Donut (or of any part of different type of vizualizations)

<Image align="center" src="https://files.readme.io/0ce0bacad8d607b479963694e94bcb13656b0f1068583aa0eaa2ed8cbe3b769b-Screenshot_2025-05-22_at_11.15.58_AM.png" />

*Figure 9: Drill-down ability, by clicking on Donut chart section or on other visualizations*

### Collection Structure

Metabase organizes reports and dashboards into collections. The default collection contains various pre-built reports:

![Collection Structure](https://files.readme.io/c62b3bd102960c9bbe38b26d36cd02980dd901cec84c54bba40c96dee98e4adf-metabase_collection.png)\
*Figure 10: Default collection structure showing dashboard and reports*

The collection includes:

* Canned Reports dashboard
* Individual report views (Completed Visits, Due Visits, etc.)
* Other Fundamental Database tables and views that power the reports

### Report Visualizations

Individual reports provide detailed visualizations of specific metrics:

![Completed / Due Visits Report](https://files.readme.io/9af7f3494e2d9173f4d6b4e74acfc9fadca9e606f95684af1f788575c5beaf2b-metabase_completed_visits.png)\
*Figure 11: Detailed visualization of Completed / Due Visits by type*

Visualization features include:

* Interactive donut charts with percentage breakdowns
* Clear labeling of data categories
* Total count displayed in the center
* Color-coded segments for easy differentiation

### Database Tables and Views

Metabase connects to your Avni database and creates optimized views for reporting:

![Database Tables and Views](https://files.readme.io/da4dc45abbb0f349603f03f05b2db26ed74f925793c729aa7199d464559ee17f-metabase_database_tables.png)\
*Figure 12: Database tables and views available in Self-Service Reports*

The database structure includes:

* Base tables (individual, household, address, etc.)
* Derived views (completed\_visits\_view, due\_visits\_view, etc.)
* Relationship tables (household\_individual, etc.)

These tables and views are automatically kept in sync with your Avni database.

### Data Exploration

Metabase allows users to explore raw data through table views:

![Individual Data Table](https://files.readme.io/cfbf4ea42ab9b037e39fc0fa1e23c7f4773c9c24bf0abd7ab598ac193815b637-metabase_individual_table.png)\
*Figure 13: Individual data table showing subject records*

![Child Data Table](https://files.readme.io/37921c0981d9e7914beaa68c5237b17baae544387131caef7ab1a4090476b09b-metabase_child_table.png)\
*Figure 14: Child data table showing specific program records*

Data exploration features include:

* Sortable columns
* Record counts and pagination
* Search functionality
* Filtering options
* Direct access to raw data

## Troubleshooting

### Error Reporting

When errors occur during the Self-Service Reports setup or synchronization process, they are displayed directly in the interface:

![Error Reporting Example](https://files.readme.io/e1e4f12702c93d949a5c05e685d120a159e2a42fee31ca6555dd4464312d883a-metabase_error_example.png)

*Figure 15: Example of an error message during Self-Service Reports setup\
(Note: Delete button only available in development environments)*

The error message includes:

* A clear indication that the attempt failed
* The specific Server error that occurred
* Details about what caused the error (in this example, a missing database table)
* A "Copy error to clipboard" button for easy sharing with support

Common errors include:

* Database connection issues
* Missing tables or schemas due to ETL failure
* ETL not enabled

### Common Issues and Solutions

| Issue                                   | Possible Cause                                                   | Solution                                             |
| --------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| Dashboard shows no data                 | Database sync incomplete, ETL process not completed successfully | Wait for sync / ETL process to complete successfully |
| User cannot access Self-Service Reports | Not in "Metabase Users" group                                    | Add user to the group in Avni                        |
| Missing tables or fields                | ETL not enabled or not completed successfully                    | Contact Support                                      |

## Refresh Process

### When to Use Refresh

The refresh process is to be used, whenever there are new Entity Types created for the organization.

### Performing a Refresh

To refresh Self-Service Reports integration:

1. In Avni admin panel, navigate to Reports section
2. Click "Self-Service Reports" tab
3. Click "Refresh Reports" button

<Image align="center" src="https://files.readme.io/5b4264a93cd8614a6e0eb42c41a84420cb99372c773554667e95ad48d1bcb214-metabase_refresh_reports.png" />

*Figure 16: Refresh Self-Service Reports setup by clicking on "REFRESH REPORTS"\
(Note: Delete button only available in development environments)*

Wait for the process to complete.

The refresh process will:

* Create missing dashboards, cards and questions

## Appendix

### Glossary of Terms

* **Collection**: A group of questions and dashboards in Metabase
* **Dashboard**: A customizable display of multiple visualizations
* **Question**: A saved query that produces a visualization or data table
* **Sync**: The process of updating Metabase's understanding of your organization's database structure
* **Card**: An individual visualization on a dashboard
#### Getting Started With Avni Reports

## What This Guide Will Help You Do

This guide will help you learn how to create reports and visualize your Avni data in Metabase, even if you've never worked with data tools before! We'll walk through real examples with step-by-step instructions.

<Callout icon="💡" theme="default">
  ### **Quick Tip:** This guide focuses on practical everyday tasks. If you need information about setup or administration, please refer to the [Self-Service Reports Guide for Avni](self-service-reports-guide-for-avni). If needed, contact Avni support team for further guidance.
</Callout>

## The Basics: Understanding Metabase

### What is Metabase and why should I care?

Metabase is a simple tool that helps you look at your organisation's data in Avni, without needing technical skills. Think of it like a smart photo editor for your data - it helps you:

* See overall Avni organisation data at a glance
* Create charts and graphs easily
* Share insights with your team
* Make better decisions based on actual numbers
* Identify trends and patterns in your data

### How to Log In 🔑

1. Open your web browser and go to [https://reporting.avniproject.org/](https://reporting.avniproject.org/)
2. Enter your email address
3. Enter your password
4. Click the "Log in" button

<Image align="center" src="https://files.readme.io/95b3cfa20f75003a170accb2312b13b1ff51752a37ffbeb1130366d044e37d8f-Screenshot_2025-05-26_at_12.07.51_PM.png" />

### Help! I Can't Log In 🆘

Don't worry! Try these steps:

1. Click the "Forgot Password" link on the login page
2. Enter your email address to receive reset instructions
3. If that doesn't work, contact your Avni support team for help

### Who Can See My Reports? 👁️

Only people from your organization can see your data and reports:

* Team members in your organization
* System administrators who help manage the platform

### Where Does This Data Come From? 📱→💾

All the data you see in reports comes from information collected by field workers using:

* The Avni mobile app on phones and tablets
* The Avni web application on computers

This information is automatically organized into easy-to-use tables via the ETL service, that you can explore in Metabase.

## Understanding Your Data

### What Are Data Tables?

In Avni, your information is organized in **tables** - think of them like Excel spreadsheets or organized lists. Each table contains specific information about your program. The Avni ETL service creates special reporting-friendly tables that make it easy to build reports and visualizations.

<Image alt="Example of a data table" align="center" src="https://files.readme.io/668dae0c3299f96b27bc34928466b31a2baff73ca24c4c9c38b98c7d9c3ad01e-metabase_database_tables.png">
  Example of organisation specific tables
</Image>

### Your Main Tables Explained

Here are all the important tables you'll work with in Metabase:

#### 1. Subject Tables

These tables contain information about the main people or things you track:

* **Example:** `Individual`, `Household`, `Facility`
* Each row represents one person or entity in your program
* Contains basic information like name, ID, registration date, address details
* Table names follow the pattern: `<subjectType>`

#### 2. Encounter Tables

These tables show visits or interactions that happened outside any program:

* **Example:** `Individual_Baseline`, `Household_Annual_Visit`
* Each row represents one visit or interaction
* Contains all the information collected during that encounter
* Table names follow the pattern: `<subjectType>_<encounterType>`
* Cancelled encounters are in separate tables named: `<subjectType>_<encounterType>_cancel`

#### 3. Program Tables

These tables show which people are enrolled in which programs:

* **Example:** `Individual_Nutrition_Program`, `Individual_Pregnancy`
* Each row represents one person's enrollment in a program
* Contains enrollment details like date joined, date exited
* Table names follow the pattern: `<subjectType>_<programName>`
* Program exits are in separate tables named: `<subjectType>_<programName>_exit`

#### 4. Program Encounter Tables

These tables show visits that happened within specific programs:

* **Example:** `Individual_Nutrition_Program_Monthly_Visit`
* Each row represents one program visit
* Contains all information collected during that program visit
* Table names follow the pattern: `<subjectType>_<programName>_<encounterType>`
* Cancelled program encounters are in separate tables named: `<subjectType>_<programName>_<encounterType>_cancel`

#### 5. Supporting Tables

Additional tables that help with specific data types:

* **Address Table:** Contains detailed address information for all subjects
* **Media Table:** Stores all media files (images, documents) in your system
* **Repeatable Group Tables:** For information that can appear multiple times
  * Table names follow the pattern: `<parentTable>_<question_group_concept_name>`

### Try It Yourself: Exploring Tables

Let's explore these tables together:

1. **Open the Data Browser:**
   * Click on "Browse Data" at the top of the screen
   * Find and click on the folder labeled with your Organisation Name, Ex: "BI DEMO"

2. **Look at any of the Subject Type Table:**
   * Click on any of the Subject Type Table, Ex: "beneficiary" table
   * Notice each person has a unique ID number
   * Browse through the information like names and addresses

3. **Understand How Tables Connect:**
   * Open any ProgramEnrolment / ProgramEncounter Table,"participation" table
   * Find the "Individual ID" column
   * This ID connects to the ID numbers in the "beneficiary" table
   * Similarly, the "Program ID" connects to IDs in the program table

> **Understanding Connections:** Tables connect through ID numbers. Think of it like this: if beneficiary #123 appears in the participation table with program #456, it means that person is enrolled in that specific program.

## Finding Exactly What You Need

### Filtering: Zooming In On Specific Information

Filtering lets you focus on exactly the information you care about - like looking at beneficiaries from only certain states or programs started after a specific date.

<Image alt="Example of filtering" align="center" src="https://files.readme.io/3d93f33b5a5a65a883c866755c4e25bf7928d30d28fa70ced336140c87aa5460-Screenshot_2025-05-26_at_12.20.49_PM.png">
  Example of Filters configuration screen for a table
</Image>

### Try It Yourself: Simple Filtering

**Exercise 1: Filter by State**

1. Open any of the Subject Type Table, Ex: "beneficiary" table
2. Find any address related column, Ex: "state" column and click on it
3. Choose "Filter by this column" from the menu
4. Select a few addresses (states) you're interested in
5. Click "Add Filter" to see only people from those states

**Exercise 2: Create Custom Filters**

1. Open any of the ProgramEnrolment / ProgramEncounter Table, Ex: "participation" table
2. Look for the "Filter" button at the top right of the screen
3. Add criteria Ex: "Role equals Caregiver"
4. Click "Apply Filter" to see the results

### Saving Your Work For Later

When you create a useful report:

1. Click the "Save" button
2. Give your report a clear name (add your name to avoid confusion)
3. Choose where to save it (your personal collection or a shared folder)

> **Why Save?** Save your reports so you don't have to recreate them every time. It's like bookmarking a webpage you want to visit again!

### Creating Summaries: The Big Picture

### Creating Summary Reports: Counting and Grouping

Summarizing helps you count things by categories - like how many beneficiaries are in each state or how many people are in each program.

<Image alt="Example of a summary" align="center" src="https://files.readme.io/a2de7339d09d2e80d4e7bd3167c95b171df2c27033acc8848889fc995daa2e30-Screenshot_2025-05-26_at_12.22.33_PM.png">
  Example of Summarization of a table
</Image>

**Try It: Create Your First Summary**

1. **Start with filtering:**
   * Open any of the ProgramEnrolment / ProgramEncounter Table, Ex: "participation" table
   * Click "Filter" at the top
   * Choose "Last Visit Date" and select "Last month"
   * Click "Apply" to see only recent visits

2. **Then create a summary:**
   * Click the "Summarize" button
   * Under "Group by" select "State"
   * Watch how your data transforms into a count by state!

3. **Create a visualization:**
   * Look at the bottom left for "Visualization"
   * Click and choose "Pie Chart"
   * Click "Done" to see your beautiful chart

> **What Did We Just Do?** We created a report showing how many beneficiaries from each state had visits in the last month. This helps you see which states are most active!

### Bringing Different Information Together: Using Joins

**What is a Join?** 

A join lets you combine information from different tables. Think of it like putting two spreadsheets side by side and connecting matching rows.

For example, you might want to see beneficiary names alongside their program enrolments, even though this information is stored in separate tables.

<Image alt="Illustration of a join concept" align="center" src="https://files.readme.io/761b483d4b5dffb3867f47eed8e460645879b9819abf4572feb7032248cc4436-Screenshot_2025-05-26_at_12.24.02_PM.png">
  Illustration of a join in Metabase
</Image>

**Try It: Joining Tables Step by Step**

1. **Start with the basic table:**
   * Open any of the ProgramEnrolment / ProgramEncounter Table, Ex: "participation" table
   * Look for the button next to "Summarize" (it's labeled "View")
   * Click it to enter editing mode

2. **Select which columns you want:**
   * Keep only the columns you're interested in
   * For example: keep "Role" and "Beneficiary ID"

3. **Connect to another table:**
   * Find and click "Join Data"
   * Select the related Subject Type table, Ex: "beneficiary" table
   * Click the join button

4. **Tell Metabase how to connect the tables:**
   * Choose ProgramEnrolment / ProgramEncounter Table -> Subject Type Table, Ex: "participation" -> "beneficiary"
   * Match ProgramEnrolment / ProgramEncounter Table Reference ID column with Subject Type Table ID column, Ex: "beneficiary\_id" with "ID"
   * Click "Join these columns"

5. **Clean up your view:**
   * Remove any extra columns you don't need
   * Click "Visualize" to see your combined data

**Make It Look Nice:**

* Go to the "Visualization" section
* Click the gear icon above the table
* Rename columns to make them easier to understand
* For example, change "beneficiary\_id" to "Person ID"

> **Why This Matters:** By joining tables, you can see complete information in one view. For instance, you can see a person's name and address along with which programs they're enrolled in, even though that information comes from different tables.

### Practice Activities: Try It Yourself

Now that you've learned how to join tables, try these exercises to build your skills:

1. **Create a Summary Chart by Category:**
   * Use any joined data you've created
   * Click "Summarize"
   * Group by any category field of your choice (like Role, Gender, Age Group, etc.)
   * Switch to a bar graph visualization
   * See the distribution across your chosen category!

2. **Create a Program Enrolment Chart:**
   * Join any Program Enrolment table with its related Program table
   * Group by "Program Name" or another program attribute
   * Create a bar graph showing counts by program

3. **Build a Complete Profile View:**
   * Create a table with address fields (like "State", "District"), person details, program information, and other relevant attributes
   * Use the Sort feature to organize your data logically (e.g., by location)
   * This gives you a complete view of who is enrolled where!

## Creating Your Own Calculations

### Adding Custom Columns

Sometimes you need information that isn't directly in your data. Metabase lets you create your own calculations!

<Image alt="Example of a custom column" align="center" width="250px" src="https://files.readme.io/f51d52859d073fc002b91aa87b3a99332b880592c05e99963ebe302fc4b30c1e-Screenshot_2025-05-26_at_12.30.07_PM.png">
  Example of a custom column
</Image>

**Try It: Calculate Address Length**

Let's say you want to see how long each person's address is:

1. Open any of the Subject Type Table, Ex: "beneficiary" table
2. Click "Edit Query" (near the top of the screen)
3. Find and click the "+ Add custom column" button
4. For the formula, type: `length([Address])`
5. Name your column: "Address length"
6. Click "Done" then "Visualize" to see your new column!

### Advanced Analysis: Grouping and Averaging

**What if you want to see the average address length for each district?**

This is where grouping comes in - it's like organizing your data into buckets and then calculating something about each bucket.

**Try It: Calculate Averages by Group**

1. Start with your table that has the Address length column

2. Click "Summarize"

3. Set up your grouping:
   * Group by "State" and "District"
   * For the calculation, choose "Average of" → "Address length"

4. Add filters if needed:
   * Maybe filter where "Address is not empty"

5. Use "Sort" to organize by state and district

6. Click "Visualize" to see your results

### Visualize Your Results

**Try creating different visualizations:**

<Image align="center" src="https://files.readme.io/1e7745387046fb5bbf15f45ad3d7524914fd92b6597c7e2725f9bd85ab7681e1-Screenshot_2025-05-26_at_12.32.38_PM.png" />

1. Try a line graph for the address length data
2. Try a bar chart comparing districts
3. Try a map visualization if geographical data is available

> **Final Tip:** The best reports answer specific questions. Before creating a report, ask yourself: "What exactly do I want to know?" Then build your report to answer that question!

## Additional Information regarding behind the Scenes: How Your Data Gets generated for use in Reporting 🔧

### Why We Need Special Reports Tables

You might wonder why you're using special tables for reporting instead of the regular Avni database. Here's a simple explanation:

**The Challenge:**\
The main Avni database is designed for collecting and storing data efficiently across organizations, not for creating reports. This creates several challenges:

1. **Complex Data Structures:** Some information is stored in specialized formats that are hard to query
2. **Performance Issues:** Running reports directly on the main database would be very slow
3. **Address Complexity:** Address information has many levels (state, district, etc.) that are difficult to work with
4. **Data Volume:** Analyzing all the data at once would be overwhelming

### How Avni Solves This: The ETL Service 🔄

Avni uses a standard process (called ETL - Extract, Transform, Load) that:

1. Copies data from the main database into a separate organization-specific database
2. Reorganizes it into formats better suited for reporting
3. Updates this reporting-friendly data periodically every hour or so)

### The Special Tables Created For You

The ETL service creates several easy-to-use tables:

* **Subject Tables:** One table for each type of person or thing you track (Ex: `Individual` or `Household`)
* **Encounter Tables:** Tables that show visits or interactions (Ex: `Individual_Baseline` or `Individual_Annual_Visit`)
* **Program Tables:** Information about program enrollment (Ex: `Individual_Nutrition_Program`)
* **Program Encounter Tables:** Records of visits within programs (Ex: `Individual_Nutrition_Program_Monthly_Visit`)
* **Supporting Tables:** Special tables for addresses, images, and repeated information

<Callout icon="💡" theme="default">
  ### **Technical Note:** Table names follow patterns like `<subjectType>_<encounterType>` or `<subjectType>_<programName>_<encounterType>` to make them easy to identify.
</Callout>

### What This Means For You

* You get faster reports
* You can easily create visualizations
* Your data is organized in a way that makes sense for analysis
* Everything updates automatically every hour or so

All of this happens behind the scenes so you can focus on getting insights from your data rather than worrying about database structures!
#### Index

Avni supports Data analytics in 2 different modes:

1. Extract data using Longitudinal exports (Old and new) and analyze it using applications such as SAS/SPSS.
2. Use Avni Platform Hosted Reporting Service instances of JasperReports, Superset or Metabase to analyze data in near real time.

## Longitudinal exports

Avni has a section to retrieve longitudinal exports of data that is analysis friendly with applications such as SAS/SPSS. This is also available in the browser if you login to the Avni web application.

<Image alt="Old Longitudinal exports" align="center" src="https://files.readme.io/327a38b7ee76e06144331079639ab99b7e70f3fb9723509cc2af4f2fec1d8cbf-old_longitudinal_export.png">
  Old Longitudinal exports
</Image>

<Image alt="New Longitudinal exports" align="center" src="https://files.readme.io/552ab3fac1f97a83dc533b3bb7c70d8dc406702c515f089bf93ef72e433256bf-new_longitudinal_export.png">
  New Longitudinal exports
</Image>

## Avni hosted Reporting services

As part of [Avni Hosted Service](doc:avni-hosted-service) we provide three different reporting systems using open source tools Metabase, Superset and Jasper Reports. There are links to access these in the Avni Web-application [login page](https://app.avniproject.org). 

Alternatively, you can directly go to the various reporting tools via following links:

* Metabase - [https://reporting.avniproject.org/](https://reporting.avniproject.org/)
* Jasper Reports - [https://reporting-jasper.avniproject.org/jasperserver/login.html](https://reporting-jasper.avniproject.org/jasperserver/login.html)
* Superset - [https://reporting-superset.avniproject.org/](https://reporting-superset.avniproject.org/)

### Self-Service Reports

Avni provides a Self-Service Reports feature that allows users to create and manage reports without requiring technical expertise. We uses Metabase for this purpose. You can read up more about it [here](self-service-reports-guide-for-avni).

<Image alt="Self-Service Reports" align="center" src="https://files.readme.io/0ffb57d71344858fd1f3fb5018f7af9425cc23fa9fb2ac517b741ea0322c7727-self_service_reports.png">
  Self-Service Reports
</Image>
### Integration Architecture

Avni was first integrated with Bahmni and is now being integrated with multiple other systems. Since there is a lot of common work and code involved in integrating Avni with other systems, the Avni integration service, and its management application are also designed to be reusable, open-source, and multi-tenant. This means that this can be deployed in the cloud to service multiple implementations of Avni or it can be deployed in customer-specific infrastructure. In this document, some of the core/common concepts of avni integration service have been described.

<Image title="Avni Integration.jpg" alt={960} width="100%" src="https://files.readme.io/91732cc-Avni_Integration.jpg">
  Avni Integration Architecture Diagram
</Image>

### Multi-tenant

Avni integration framework is multi-tenant. All the concepts described below are sandboxed for each tenant. A tenant can be considered on an instance of Avni's integration of implementation with another project system. The framework has been made multi-tenant so that they can reuse the same framework and can be hosted as a single service like Avni's main service can be hosted.

### Metadata Data Mapping

In Avni, the administrators (users) can define their own data model (via form element, coded answers) and master data (via location). There are scenarios in which Avni has to integrate with another system where the users may do the same. For example: in Bahmni there is a similar concept of forms and coded answers where the data model is managed by. Similarly, other EMR or data collection systems will have the same. Hence, for example, if an Avni Subject (or any other Avni entity) has to be saved as a Patient or a similar entity in another system (and vice-versa) then such data needs to be mapped.

Due to this hardcoding of every field in the integration code will require manual mapping to be done and on changes, this mapping has to be maintained. Such maintenance will require code deployment every time such fields are introduced.

Avni integration solution allows administrators (users) to manage this mapping themselves via a user interface instead of depending on a development cycle. A mapping has two main fields - avni\_id and integrating\_system\_id. Avni id is the UUID of concept, location, etc and intergrating\_system\_id is either a string or number corresponding to another system's id.

Avni integration framework allows one to organize this mapping using mapping group and mapping type. This data can be set up per integration and it is left to the developer of a specific integration to use it in the way it is useful.

### Guaranteed to process

Most Avni implementations require guaranteed processing of all records. Any failure in processing due to software availability issues needs to be retried to ensure that they are processed (the failures could be due to defects in source, destination, or integrator which needs to be rectified and the failures need to be reprocessed). Note that: approaches like webhooks but without the ability to retry do not work.

Avni integrator uses [sync status records](https://github.com/avniproject/integration-service/blob/main/integration-data/src/main/java/org/avni_integration_service/integration_data/domain/IntegratingEntityStatus.java) for each process. In case of any unexpected failures, the integration process can use the readUpto information to proceed next time.

Avni integration framework allows the developer to define their entity types and can maintain their sync information (watermark, or readUpto information) as they see fit.

### Application error handling

The integration processes can encounter errors that can be fixed only by the intervention of the end users/administrators. For some of these errors, you may not want to stop the processing of other records. Along with this, you may want to reprocess these records later in case the users have fixed the issue. In order to handle both of these, you can use [ErrorRecords](https://github.com/avniproject/integration-service/blob/bdbadf96c79096f746398b69d1faddadc50820e6/integration-data/src/main/java/org/avni_integration_service/integration_data/domain/error/ErrorRecord.java). Along with logging the record you will also have to define error processes which can reprocess them at regular intervals.

For more detail on error handling please see [Error handling](doc:error-handling)]

### Integration Schedule

Since the time taken by different implementation integration processes can be variable, it is expected that each implementation can independently choose its schedule of running integration processes. Avni integration service allows for the running of multiple integrations in parallel at the same time.
### Index

This section outlines the design of Avni.

[Terminology](doc:terms-and-their-definitions)\
[Component Architecture](doc:component-architecture)\
[Multitenancy](doc:multitenancy-1)\
[Offline operations and sync](doc:offline-operations-and-sync)\
[Why is Avni multitenant?](doc:openchs-service-on-the-cloud)
## Database Guide

### Form Mapping

**What does form mapping do?**\
Forms are an important part of Avni. Before trying to understand forms it is required to understand what are key entities which hold the transaction data in Avni.

* Individual (or Subject)
* Encounter
* Program Enrolment
* Program Encounter
* Program Exit

Each of these entities has some core data and configurable data. Configurable or dynamic data is modelled using forms.

* **Individual** has one form (for Registration) for each subject type.
* **Encounter** can be of multiple encounter types and for each encounter type, there is one form.
* An individual can be enrolled in multiple programs hence for each **Program Enrolment** there will be a form. Corresponding to each enrolment there is usually exit data which is captured via forms.
* An individual can be registered in different programs, and within each program, there can be multiple types of **Program Encounters** (hence forms).

Form Mapping tries to model this relationship between Programs, ProgramEncounters or NonProgram Encounters and their Forms. Form Mapping has the following key fields. In the column header for Program and Encounter Type, we have the current name for the database columns and domain class fields in the brackets which will be renamed to more understandable names, soon.

This is depicted in tabular form below (with an added Form Type dimension). 

<Table align={["left","left","left","left"]}>
  <thead>
    <tr>
      <th>
        Form Type
      </th>

      <th>
        entity_id
      </th>

      <th>
        observations_type_entity_id
      </th>

      <th>
        subject_type_id
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        Individual
      </td>

      <td>
        null
      </td>

      <td>
        null
      </td>

      <td>
        subject\_type.id
      </td>
    </tr>

    <tr>
      <td>
        Encounter
      </td>

      <td>
        null
      </td>

      <td>
        encounter\_type.id
      </td>

      <td>
        subject\_type.id
      </td>
    </tr>

    <tr>
      <td>
        Program Enrolment
      </td>

      <td>
        program.id
      </td>

      <td>
        null
      </td>

      <td>
        subject\_type.id
      </td>
    </tr>

    <tr>
      <td>
        Program Encounter
      </td>

      <td>
        program.id
      </td>

      <td>
        encounter\_type.id
      </td>

      <td>
        subject\_type.id
      </td>
    </tr>

    <tr>
      <td>
        Program Exit
      </td>

      <td>
        program.id
      </td>

      <td>
        null
      </td>

      <td>
        subject\_type.id
      </td>
    </tr>
  </tbody>
</Table>
### Observation Data Model

Avni is a platform that allows its user to define their own data model via forms. But Avni doesn't define table at runtime every time you define a new form. When the field user or data entry user create actual data using these forms - Avni stores data for entire in [JSONB](https://www.postgresql.org/docs/9.5/functions-json.html) column. The data is stored as **key values**.

## Key

Each form element is linked to a concept. The key is the UUID of the concept.

## Value

### Primitive value

Primitive values as stored as is. e.g. \{"09c852a1-56ae-431a-b0b8-3207cea15dfb": 10, "a9cb0768-1fd7-4f69-ad9b-53a0517c3ae9": "This is a string value"} where 10 and "This is a string value" are values. The keys are the UUID of corresponding concepts.

### Coded value

Since Avni supports multiple select for coded answers. It stores the answers in an array. e.g. \{"4aacd6f8-7ee2-4df5-ad77-137b941c128b": \["e3b05c49-c0fa-4d8f-bc42-f2c291c59f4d", "baa65cfe-38fe-4116-96e7-8902ed6e9aef"]}. The UUIDs inside the array those of concepts which have been chosen as answers.
### Manual Database Update

> 🚧 Manually updating database to fix visit schedules is not recommended. See section below for why?

Updating production database directly must be the last resort. Using support API, bulk uploads are better option. But if you are unlucky enough that you have to do database update directly then...

* For everyone's sanity the SQL should be present in [https://github.com/avniproject/data-fixes](https://github.com/avniproject/data-fixes) repository, so that we can checkout only one repo for all implementations to review.

* Ensure that the database updates SQL is checked in another environment and end to end testing has been done after the update.
  * For getting a dump of a specific organisation please follow the tunne&#x6C;*, dump*, restore\* and create-local-db-impl-user targets from here - [https://github.com/avniproject/avni-server/blob/master/makefiles/externalDB.mk](https://github.com/avniproject/avni-server/blob/master/makefiles/externalDB.mk)

* Ensure that code review has been done for the SQLs.

* For transaction data last modified date time should be modified. Increment like the following (any data reported by database like number of rows updated can be put into comment when the queries are run).

* ```sql
  update individual set 
  	last_modified_date_time = current_timestamp + (random() * 5000 * (interval '1 millisecond'))
  where foo = bar;
  ```
  <br />

* If the number of rows updated exceed 10000 records then we should ideally go for downtime.

* In transaction tables a manual update history is maintained for troubleshooting. This column should not be updated directly rather use the\
  *append\_manual\_update\_history*\
   function to update. This function maintain the previous history records and appends the new value, maintaining date of update.

* ```sql
  update program_enrolment 
  	set manual_update_history = append_manual_update_history(program_enrolment.manual_update_history, 'avni-server#676')
   where foo = bar;
  ```
  <br />

* Use data-fixes Github project for SQL scripts.

* If ETL is enabled for the org for which the updates are being run, disable it before executing the updates and re-enable it after the updates are committed to avoid issues with the ETL tables not being updated.

* In the SQL script follow the following pattern. 

* Avoid using specific ids in these SQLs as they may lead to errors - as the records may get updated between writing and final run. Better to include select in the update and other queries.

* **When running in production:**

  * **always run sql script within manual transaction**
  * **verify counts**
  * **only if changed count is as expected, do the commit**

* ```sql
  set role org;

  begin transaction; -- so that you can rollback if something is goes wrong

  -- Before queries
  select count(*) from individual where observations->>'dfds' > 2; -- example. enter the data that you see here in test environment in comment

  -- DML statements
  -- insert/update etc

  -- After queries
  select count(*) from individual where observations->>'dfds' > 2; -- example. enter the data that you see here in test environment in comment


  -- rollback;
  commit;
  ```

  <br />

* If your SQL script is likely to update a lot of rows in the database and the users may also be updating the data at the same time then the data update should be done in production by bringing down the server first. Note that this approach is not valid for API based update. How to handle the concurrent update, when updating via API - has to be figured out.
  * For smaller number of rows but with concurrency `Select for update` or higher transaction isolation level can be used.

## Fixing visit schedule

Visit/encounter schedules work like state machine. e.g. cancelling one encounter schedules another encounter; performing enrolment is schedules another encounter. This behaviour is unlike other data behaviour in Avni - requiring us to look at how we should manage this data distinctly from other transaction and non-transaction data. For example - updating an observation value mostly has no impact on another data point. Sometimes updating weight requires updating the calculated value as well - but scope is often simple to understand and limited. But cancelling a visit from backend means also determining what else should happen as a side-effect of that change.

There are major risks in "fixing" visit schedules by fixing the data, as it is quite complex to do it right and quite complex to test and verify. It is difficult to know when and whether you are done. **Hence this is not prudent strategy.**

### How should we solve for this?

The core idea is:

* Empower users to manage the wrongly scheduled visits and be able to do the right visits.
* Improve scheduling and encounter eligibility rules to cover new scenarios that are encountered. If required write unit tests to verify.
* Provide offline reports if required to let users figure the cohort of subjects that have problematic state.
* Fixing visit schedules via data fix is not a cost effective approach as well.
### Index

Avni uses PostgreSQL as the database. It particularly depends on a couple of features quite heavily - JSONB data type and [row-level security](https://www.postgresql.org/docs/9.5/ddl-rowsecurity.html). [JSONB](https://www.postgresql.org/docs/9.5/functions-json.html) allows for user-defined schema and row-level security for achieving multi-tenancy. If you planning to do Avni server-side, product development then reading up on these two concepts is highly recommended. But if you plan to use Avni to implement for your organisation then these two concepts are not necessary reading.

Avni's database schema documentation is available [here](https://dbdocs.io/petmongrels/Avni-with-description), but if you are here for the first time then do read the rest of the documentation here before browsing through the schema documentation. Please also note that since this schema definition is handwritten after generation some of the fields in the table may be absent. For full schema definition, but without description, you may see [this](https://dbdocs.io/petmongrels/Avni-database-schema-dump).

Avni database can be logically broken down into a smaller-cohesive group of tables - which for our purposes of understanding could be called **modules** (to reiterate, this is only for understanding purposes - Avni database doesn't have these modules in the database in any form). The functions of the tables and key-columns are provided in dbdocs.

**An explanation for a few columns which are repeated across the tables**

* organisation\_id: This column indicates the organisation to which a row belongs (since Avni uses row-level multi-tenancy.
* is\_voided or active: This is used to perform soft delete of data
* id: the primary key of a table
* uuid: identifier via which an externally integrating system can refer to records in Avni. id should not be used for this purpose.
* version: although this column is present, please ignore it because this column is not used as the functionality around it has not been developed fully.

# Foundational modules

## Framework

**audit**

## Organisation

Avni is multi-tenant with multiple organisation's data residing within the same schema - protected by row-level security. Avni also supports a group of organisations with one master organisation.

**organisation, organisation\_group, organisation\_group\_organisation**

## Work area

For more about work-area please refer to [this](https://avni.readme.io/docs/avnis-domain-model-of-field-based-work#1--architecture-of-the-service-delivery-organisation).

**address\_level\_type, address\_level, location\_location\_mapping, catchment, catchment\_address\_mapping**

## Master data tables

For few commonly required entities recognised, hence recognised by the platform.

**gender, individual\_relation, individual\_relationship\_type, individual\_relation\_gender\_mapping**

## User-defined data model

These tables allow the user of the platform (aka implementer) to define their data model. These tables could be further sub-grouped into for&#x6D;*, concept* and *types tables. Concept tables describe your data independent of how it has been captured. Form* tables describe how the data should be captured. \*Types tables allow you to define the high-level relationship between your data entities, as explained in section 2 and 4 [here](doc:avnis-domain-model-of-field-based-work).

**concept, concept\_answer, subject\_type, operational\_subject\_type, program, operational\_program, encounter\_type, group\_role, operational\_encounter\_type, form, form\_element\_group, form\_element, non\_applicable\_form\_element, form\_mapping**

<hr/>

# Transaction data

## Transaction data

**individual, program\_enrolment, encounter, program\_encounter, group\_subject, individual\_relationship**

<hr/>

# Functional modules

Note that here tables for transaction and meta/master data are grouped together.

## Identifiers

Identifiers have been documented [here](doc:creating-identifiers).

**identifier\_assignment, identifier\_source, identifier\_user\_assignment**

## Checklist

checklist, checklist\_detail, checklist\_item,  checklist\_item\_detail

<hr/>

# Application behaviour

## Rules

**deps\_saved\_ddl, rule, rule\_dependency**

## User

**users, user\_group, user\_facility\_mapping**

## Application settings

**organisation\_config**

## Access Control

**privilege, group\_privilege, groups**

<hr/>

# Others

## Translations

**platform\_translation, translation**

## Account

**account, account\_admin**

## Telemetry and logs

**rule\_failure\_log, rule\_failure\_telemetry, sync\_telemetry, video\_telemetric**

## Task

**Task, Task\_Status, Task\_Type, Task\_Unassignment**

## Messaging

**Manual\_Message, Message\_Receiver, message\_request\_queue, message\_rule, msg91\_config, news**

## Documentation

documentation, documentation\_item

## Comment

comment, comment\_thread

## Offline/mobile dashboard

**dashboard, dashboard\_card\_mapping, dashboard\_filter, dashboard\_section, dashboard\_section\_card\_mapping, standard\_report\_card\_type, group\_dashboard, report\_card**

## ETL

**table\_metadata, column\_metadata, scheduled\_job\_run**

# Media Viewer - Database

* **download\_jobs**
  * Contains information about the downloads done by the user
## Roadmap

An active roadmap for Avni is maintained in the [Project board](https://github.com/orgs/avniproject/projects/2/views/7).
## Avni Hosted Service

5Avni is available as a hosted service provided by [Samanvay Foundation](https://www.samanvayfoundation.org/). More details are available at the [Avni Project website](https://avniproject.org/).

If you are an existing user of the Avni hosted services, you can

1. Download the application from the Android Play Store [here](https://play.google.com/store/apps/details?id=com.openchsclient)
2. Login to the web-based data entry app or app designer [here](https://app.avniproject.org/#/)

If you have configured reports via Metabase, they will be available [here](https://reporting.avniproject.org/)  
If you have configured reports via Jasper Reports, they will be available [here](https://reporting-jasper.avniproject.org/jasperserver/login.html).

<br />

# <Anchor label="Avni Hosted Service Status Page" target="_blank" href="https://ap-south-1.console.aws.amazon.com/cloudwatch/home?region=ap-south-1#dashboards/dashboard/HealthChecks_Alarms">Avni Hosted Service Status Page</Anchor>

<br />
## Avni Code Of Conduct

### Faq Avni Code Of Conduct

This FAQ attempts to address common questions and concerns around the Avni community's Code of Conduct. If you still have questions after reading it, please feel free to contact us at [avni-project-conduct@googlegroups.com](mailto:avni-project-conduct@googlegroups.com).

## Why have you adopted a Code of Conduct?

If you're familiar with the Avni community, you'll probably notice that the Code basically matches what we already do. Think of this as documentation: we're taking implicit expectations about behaviour and making them explicit.

We're doing this because the Avni community is growing. This is on balance a very positive thing, but as we've grown past the point where it's possible to know the whole community we think it's very important to be clear about our values.

We know that the Avni community is open, friendly, and welcoming. We want to make sure everyone else knows it too.

## What does it mean to "adopt" a Code of Conduct?

For the most part, we don't think it means large changes. We think that the text does a really good job describing the way the Avni community already conducts itself. We expect that most people will simply continue to behave in the awesome way they have for years.

However, we do expect that people will abide by the spirit and words of the CoC when in "official" Avni spaces. That means that it'll apply both in community spaces and at Avni events.

## What happens if someone violates the Code of Conduct?

Our intent is that the anyone in the community can stand up for this code, and direct people who're unaware of this document. If that doesn't work, or if you need more help, you can contact [avni-project-conduct@googlegroups.com](mailto:avni-project-conduct@googlegroups.com). For more details please see our Reporting Guidelines.

## Why do we need a Code of Conduct? Everyone knows how to behave well.

Sadly, not everyone knows this.

However, even if everyone was kind, everyone was compassionate, and everyone was familiar with codes of conduct it would still be incumbent upon our community to publish our own. Maintaining a code of conduct forces us to consider and articulate what kind of community we want to be, and serves as a constant reminder to put our best foot forward. But most importantly, it serves as a signpost to people looking to join our community that we feel these values are important.

## This is censorship! I have the right to say whatever I want!

You do -- in your space. If you'd like to hang out in our spaces (as clarified above), we have some simple guidelines to follow. If you want to, for example, form a group where Avni is discussed using language inappropriate for general channels then nobody's stopping you. We respect your right to establish whatever codes of conduct you want in the spaces that belong to you. Please honour this Code of Conduct in our spaces.
### Avni Code Of Conduct Committee

The Code of Conduct Committee deals with violations in the Avni Code of Conduct.

**Committee Members**

* Arjun Khandelwal
* Hiren Thacker
* Garima Dosar

You can contact [avni-project-conduct@googlegroups.com](mailto:avni-project-conduct@googlegroups.com). For more details please see the [Reporting Guide](doc:avni-code-of-conduct-reporting-guide).
### Avni Code Of Conduct Reporting Guide

If you believe someone is violating the code of conduct we ask that you report it to the Avni Community by emailing [avni-project-conduct@googlegroups.com](mailto:avni-project-conduct@googlegroups.com). All reports will be kept confidential. In some cases, we may determine that a public statement will need to be made. If that's the case, the identities of all victims and reporters will remain confidential unless those individuals instruct us otherwise.

If you believe anyone is in physical danger, please notify appropriate law enforcement first. If you are unsure what law enforcement agency is appropriate, please include this in your report and we will attempt to notify them.

If you are unsure whether the incident is a violation, or whether the space where it happened is covered by this Code of Conduct, we encourage you to still report it. We would much rather have a few extra reports where we decide to take no action, rather than miss a report of an actual violation. We do not look negatively on you if we find the incident is not a violation. And knowing about incidents that are not violations, or happen outside our spaces, can also help us to improve the Code of Conduct or the processes surrounding it.

In your report please include:

* Your contact info (so we can get in touch with you if we need to follow up)
* Names (real, nicknames, or pseudonyms) of any individuals involved. If there were other witnesses besides you, please try to include them as well.
* When and where the incident occurred. Please be as specific as possible.
* Your account of what occurred. If there is a publicly available record (e.g. a mailing list archive or a public IRC logger) please include a link.
* Any extra context you believe existed for the incident.
* If you believe this incident is ongoing.
* Any other information you believe we should have.

## What happens after you file a report?

You will receive an email from the Avni Code of Conduct Working Group acknowledging receipt immediately. We promise to acknowledge receipt within 24 hours (and will aim for much quicker than that).

The working group will immediately meet to review the incident and determine:

* What happened.
* Whether this event constitutes a code of conduct violation.
* Who the bad actor was.
* Whether this is an ongoing situation, or if there is a threat to anyone's physical safety.

If this is determined to be an ongoing incident or a threat to physical safety, the working groups' immediate priority will be to protect everyone involved. This means we may delay an "official" response until we believe that the situation has ended and that everyone is physically safe.

Once the working group has a complete account of the events they will make a decision as to how to respond. Responses may include:

* Nothing (if we determine no violation occurred).
* A private reprimand from the working group to the individual(s) involved.
* A public reprimand.
* An imposed vacation (i.e. asking someone to "take a week off" from a mailing list or Gitter).
* A permanent or temporary ban from some or all Avni spaces (mailing lists, Gitter, etc.)
* A request for a public or private apology.

We'll respond within one week to the person who filed the report with either a resolution or an explanation of why the situation is not yet resolved.

Once we've determined our final action, we'll contact the original reporter to let them know what action (if any) we'll be taking. We'll take into account feedback from the reporter on the appropriateness of our response, but we don't guarantee we'll act on it.

## What if your report concerns a possible violation by a committee member?

If your report concerns a current member of the Code of Conduct committee, you may not feel comfortable sending your report to the committee, as all members will see the report.

In that case, you can make a report directly to any or all of the current (vice/co) chairs of the Code of Conduct committee. Their e-mail addresses are listed on the Code of Conduct Committee page. The chairs will follow the usual enforcement process with the other members but will exclude the member(s) that the report concerns from any discussion or decision making.
### Avni Code Of Conduct Enforcement Manual

This is the enforcement manual followed by Avni's Code of Conduct Committee. It's used when we respond to an issue to make sure we're consistent and fair. It should be considered an internal document, but we're publishing it publicly in the interests of transparency.

## The Code of Conduct Committee

All responses to reports of conduct violations will be managed by a Code of Conduct Committee ("the committee").

## How the committee will respond to reports

When a report is sent to the committee they will immediately reply to the report to confirm receipt. This reply must be sent within 24 hours, and the committee should strive to respond much quicker than that.

See the reporting guidelines for details of what reports should contain. If a report doesn't contain enough information, the committee will obtain all relevant data before acting.

The committee will then review the incident and determine, to the best of their ability:

* what happened
* whether this event constitutes a code of conduct violation
* who, if anyone, was the bad actor
* whether this is an ongoing situation, and there is a threat to anyone's physical safety

This information will be collected in writing, and whenever possible the committee's deliberations will be recorded and retained (i.e. Gitter transcripts, email discussions, recorded voice conversations, etc).

The committee should aim to have a resolution agreed upon within one week. In the event that a resolution can't be determined in that time, the committee will respond to the reporter(s) with an update and projected timeline for resolution.

## Acting Unilaterally

If the act is ongoing (such as someone engaging in harassment on Gitter), or involves a threat to anyone's safety (e.g. threats of violence), any committee member may act immediately (before reaching consensus) to end the situation. In ongoing situations, any member may at their discretion employ any of the tools available to the committee, including bans and blocks.

If the incident involves physical danger, any member of the committee may -- and should -- act unilaterally to protect safety. This can include contacting law enforcement (or other local personnel).

In situations where an individual committee member acts unilaterally, they must report their actions to the committee for review within 24 hours.

## Resolutions

The committee must agree on a resolution by consensus.

## Possible responses may include

* Taking no further action (if we determine no violation occurred).
* A private reprimand from the committee to the individual(s) involved. In this case, a committee member will deliver that reprimand to the individual(s) over email, cc'ing the committee.
* A public reprimand. In this case, a committee member will deliver that reprimand in the same venue that the violation occurred (i.e. in Gitter for a Gitter violation; email for an email violation, etc.). The committee may choose to publish this message elsewhere for posterity.
* An imposed vacation (i.e. asking someone to "take a week off" from a mailing list or Gitter). A committee member will communicate this "vacation" to the individual(s). They'll be asked to take this vacation voluntarily, but if they don't agree then a temporary ban may be imposed to enforce this vacation.
* A permanent or temporary ban from some or all Avni spaces (mailing lists, Gitter, etc.). The committee will maintain records of all such bans so that they may be reviewed in the future.
* A request for a public or private apology. a committee member will deliver this request. The committee may, if it chooses, attach "strings" to this request: for example, the committee may ask a violator to apologize in order to retain his or her membership on a mailing list.\
  Once a resolution is agreed upon, but before it is enacted, the committee will contact the original reporter and any other affected parties and explain the proposed resolution. The committee will ask if this resolution is acceptable, and must note feedback for the record. However, the committee is not required to act on this feedback.

The committee will never publicly discuss the issue.

## Conflicts of Interest

In the event of any conflict of interest, a committee member must immediately notify the other members, and recuse themselves if necessary. If a report concerns a possible violation by a current committee member, this member should be excluded from the response process. For these cases, anyone can make a report directly to any of the committee chairs, as documented in the reporting guidelines.
### Index

Avni team and community is made up of a mixture of professionals and volunteers, working on different aspects of the product.

Team diversity can lead to communication issues and unhappiness. To that end, we have a few ground rules that we ask people to adhere to. This code applies equally to everyone involved.

This isn’t an exhaustive list of things that you can’t do. Rather, take it in the spirit in which it’s intended - a guide to make it easier to enrich all of us and the communities in which we participate as Avni team member.

This code of conduct applies to all spaces managed by the Avni project. This includes Gitter, the mailing lists, the issue tracker, documentation, website, and any other forums created by the project team which the community uses for communication. In addition, violations of this code outside these spaces may affect a person's ability to participate within them.

If you believe someone is violating the code of conduct, we ask that you report it by emailing [avni-project-conduct@googlegroups.com](mailto:avni-project-conduct@googlegroups.com). For more details please see our Reporting Guidelines.

* **Be friendly and patient.**
* **Be welcoming.** We strive to be a community that welcomes and supports people of all backgrounds and identities. This includes, but is not limited to members of any race, ethnicity, culture, national origin, colour, immigration status, social and economic class, educational level, sex, sexual orientation, gender identity and expression, age, size, family status, political belief, religion, and mental and physical ability.
* **Be considerate.** Your work will be used by other people, and you, in turn, will depend on the work of others. Any decision you take will affect users and colleagues, and you should take those consequences into account when making decisions. Remember you might not be communicating in someone else's primary language.
* **Be respectful.** Not all of us will agree all the time, but disagreement is no excuse for poor behaviour and poor manners. We might all experience some frustration now and then, but we cannot allow that frustration to turn into a personal attack. It’s important to remember that a community where people feel uncomfortable or threatened is not a productive one. Members of the Avni community should be respectful when dealing with other members as well as with people outside the Avni community.
* **When we disagree, try to understand why.** Disagreements, both social and technical, happen all the time and Avni is no exception. It is important that we resolve disagreements and differing views constructively. Remember that we’re different. The strength of Avni comes from its varied community, people from a wide range of backgrounds. Different people have different perspectives on issues. Being unable to understand why someone holds a viewpoint doesn’t mean that they’re wrong. Don’t forget that it is human to err and blaming each other doesn’t get us anywhere. Instead, focus on helping to resolve issues and learning from mistakes.
* **Be careful in the words that you choose.** We are a community of professionals, and we conduct ourselves professionally. Be kind to others. Do not insult or put down other participants. Harassment and other exclusionary behaviour aren't acceptable. This includes, but is not limited to:
* Violent threats or language directed against another person.
* Discriminatory jokes and language.
* Posting sexually explicit or violent material.
* Posting (or threatening to post) other people's personally identifying information ("doxing").
* Personal insults, especially those using racist or sexist terms.
* Unwelcome sexual attention.
* Advocating for, or encouraging, any of the above behaviour.
* Repeated harassment of others. In general, if someone asks you to stop, then stop.

*Original text courtesy of the Django! project.*

**Questions?**\
If you have questions, please see the FAQ. If that doesn't answer your questions, feel free to contact us at [avni-project-conduct@googlegroups.com](mailto:avni-project-conduct@googlegroups.com).

[FAQ - Avni Code of conduct](doc:faq-avni-code-of-conduct)\
[Avni Code of Conduct Committee](doc:avni-code-of-conduct-committee)\
[Avni Code of Conduct Reporting Guide](doc:avni-code-of-conduct-reporting-guide)\
[Avni Code of Conduct Enforcement Manual](doc:avni-code-of-conduct-enforcement-manual)
## Contact

Website: [https://avniproject.org/](https://avniproject.org/)

Chat: [https://discord.gg/JVEpdaMt](https://discord.gg/JVEpdaMt)
# Implementers

## Implementers Concept Guide Introduction

Implementer's concept guide is for anyone who would like to implement Avni for any field-based program. We recommend this guide to be the first one to be read by anyone wanting to understand Avni.

While internally there are many parts of the system, if you are an implementer and using the hosted instance then these are the components you will be using. Some of the functions are intended for the end-users but you will use them for testing the application.

<Image title="Avni (4).png" alt={1089} width="80%" src="https://files.readme.io/9fa4f1f-Avni_4.png">
  User/Implementer components of Avni
</Image>
## Basic Feature Guide

### Avnis Domain Model Of Field Based Work

To understand how Avni works lets first understand the domain model of field-based work. Any field-based work can be broadly subdivided into three components.

1. **Service delivery organisation** - The organisation, with providers and the geographical area where they work.
2. **Services (or schema of data to be collected)** - The actual set of services provided by the above organisation to the people (or data to be collected about something in a said geographical area).
3. **Service encounter** - Each service is broken down into a discrete set of type of encounters that providers of the organisation have with the people.

Now lets further explore each one of the above one by one and how Avni models it into the software system.

# 1.  The architecture of the service delivery organisation

Avni allows for modelling of the work geography of the organisation and mapping of service providers to their geographical units. In avni, one can set up the complete geographical area into multiple levels and locations at the same level.

Lets first identify the key domain concepts with their names. A service delivery organisation consists of the following:

* An **organisation** (e.g. NGO, or government department, university), the entity that provides the service or collects some data.
* In order to provide this service or collect data, this organisation employs, hires or engages service providers. They can be called field workers, frontline worker, health worker, etc - we will simply call them **provider or user**.
* The service provided by the organisation via the providers is received by *beneficiaries, citizens, patients, students, children* so on. In the case where the work is data collection, the provider may be additionally or only collecting data for non-living objects like *water body, school, health centre*, etc. Since Avni is a generic platform, let's call of them by a rather imaginative name **subject**.
* In most Avni use cases, the subjects may be spread across a geographical area such that one provider cannot service (or collect data from) all subjects. Hence each provider is assigned a specific area that is called **catchment** in Avni. A catchment could be a block, a cluster of slums, etc.
* Each catchment may have one or more geographical units which are called **location**s in Avni. A location could a village, slum, subcenter area so on.

Each user **must** to be associated with at least one catchment.

![1918](https://files.readme.io/4343bff-Screenshot_2019-11-15_at_5.17.05_PM.png "Screenshot 2019-11-15 at 5.17.05 PM.png")

<Image title="Screenshot 2020-11-16 at 11.50.38 AM.png" alt={2372} src="https://files.readme.io/514028d-Screenshot_2020-11-16_at_11.50.38_AM.png">
  An example of service delivery organisation
</Image>

In Avni system, the organisation, provider, catchment and location are setup via web application by the implementer, IT or program administrator. When a subject is created/registered in the system, they are assigned a location. This is usually done by the field user using their mobile device

# 2.  Modelling the services provided into Avni

Avni allows for modelling of the services provided (or data collected) via a three-level configurable data structure. Avni allows for setting up subjects, enrolment of subjects in programs, and defining encounters for enrolments/subjects. There can be multiple programs per subject type and multiple encounter types per program.

* An organisation may have one or more **subject types** to which they provide service (or collect data for).
* To each subject type, the organisation may be providing one or more service types (or have the purpose of data collection). In Avni, each service type is called a **program**.
* Each service type may involve one or more types of interactions which are called **encounter type**s. Avni also allows one to avoid the service type completely and define encounter types directly for the subject types - allowing for modelling of interactions which are not required to be grouped under services.

![2084](https://files.readme.io/b63d3c9-Screenshot_2019-11-15_at_5.26.15_PM.png "Screenshot 2019-11-15 at 5.26.15 PM.png")

![1942](https://files.readme.io/93a551a-Screenshot_2019-11-15_at_5.27.48_PM.png "Screenshot 2019-11-15 at 5.27.48 PM.png")

![1906](https://files.readme.io/3ca82d4-Screenshot_2020-09-23_at_6.00.45_PM.png "Screenshot 2020-09-23 at 6.00.45 PM.png")

# 3. Groups and relationships

Avni allows for creating groups of subjects and more specifically a special type of group called household or family whereby another subject types (created to represent people) can be members of the household. These members can also be linked to each other via relationships. Do note though that in Avni we have modelled group and households via attributes on subject types. The subjects of such types can be linked as child elements of the parent subject. Please the diagrams below. Avni application behaves differently for groups and households.

<Image title="Screenshot 2020-04-28 at 11.20.04 AM.png" alt={2374} src="https://files.readme.io/a5fd36e-Screenshot_2020-04-28_at_11.20.04_AM.png">
  Group also can behave like subjects also, along with being a group of subjects.
</Image>

<Image title="Screenshot 2020-04-28 at 11.16.09 AM.png" alt={2750} src="https://files.readme.io/740185f-Screenshot_2020-04-28_at_11.16.09_AM.png">
  Household is a special type of group, which has persons as members. The persons can be related to each other via human relationship types.
</Image>

# 4.  Design of a service encounter

Service encounter is an encapsulation of a type of interaction between the service provider and the beneficiary - as explained above. Each service encounter consists of the following:

* observation made by the service provider (field workers)
* answer is given by the beneficiary for a question asked by the provider
* information/suggestion/recommendation made by provider
* computed or preset information provided by the avni app to the provider
* photos/videos taken by the provider

Avni allows you to arrange these sequentially and including based on conditions set by you. It also allows to schedule next service encounters based on a rule set by you. This is modelled using form, rules and content. Each service encounter can be defined in this way.

<Image title="Screenshot 2019-11-15 at 5.30.31 PM.png" alt={2040} src="https://files.readme.io/d7f0b31-Screenshot_2019-11-15_at_5.30.31_PM.png">
  Anatomy of an encounter type (or a subject registration form)
</Image>

<Image title="Screenshot 2019-11-15 at 1.53.16 PM.png" alt={1814} border={true} src="https://files.readme.io/5fdb3eb-Screenshot_2019-11-15_at_1.53.16_PM.png">
  Example of a few form element groups.
</Image>

<Image title="Screenshot 2019-11-15 at 1.55.34 PM.png" alt={2180} border={true} src="https://files.readme.io/2c87d92-Screenshot_2019-11-15_at_1.55.34_PM.png">
  Example of form elements within a form element group.
</Image>
### Key System And Data Flows

Now that we understand the [three key components of fieldwork](doc:avnis-domain-model-of-field-based-work) i.e. Organisation, Services and Service Encounter - let's try to understand how Avni works and achieves various functions.

# How implementation-specific mobile application is created?

Avni is a generic platform that allows any organisation doing field-based work to use it for their specific purpose. The diagram below explains the steps involved in creating an organisation-specific application from a generic platform.

<Image title="Screenshot 2019-11-15 at 5.33.27 PM.png" alt={1440} align="center" src="https://files.readme.io/8932d2e-Screenshot_2019-11-15_at_5.33.27_PM.png">
  Data flow of organisation, services and service encounter definition.
</Image>

# How does avni field user gets all the subject data on his/her device?

As we saw earlier, given the organisation work physically consists of catchments and locations. The subjects are living or located at these locations.

<Image title="Screenshot 2019-11-15 at 5.35.21 PM.png" alt={1726} align="center" src="https://files.readme.io/0f59c92-Screenshot_2019-11-15_at_5.35.21_PM.png">
  During organisation setup the implementer or customer IT person sets up catchments with locations and assigns them to the provider (field user)
</Image>

The diagram below shows how the subjects and the subjects's complete data, which is required by the field user (and only those subjects) are made available.

<Image title="Screenshot 2019-11-15 at 6.07.48 PM.png" alt={1580} align="center" src="https://files.readme.io/8e8be68-Screenshot_2019-11-15_at_6.07.48_PM.png">
  Subjects belonging to the catchment of the user downloaded to their device
</Image>

# How Avni works in an offline mode

Avni maintains a database on the mobile device. All the data downloaded from the server is kept on this device. When the user is using the application, all the data is served from this device to the user and all the new data created by the user is stored in the mobile database. When the synchronisation happens this new data is sent to the server.

# How does the generic avni mobile application behave as if it has been developed for a specific organisation?

The diagram below explains how avni app customises itself based on the complete organisational setup (explained earlier).

<Image title="Screenshot 2019-11-15 at 5.52.34 PM.png" alt={1792} align="center" src="https://files.readme.io/8033619-Screenshot_2019-11-15_at_5.52.34_PM.png">
  Avni app customises itself based on the organisation data setup present in the mobile database on the device
</Image>
### Subject Types

Subject Types define the subjects that you collect information on. Eg: Individual, Tractor, Water source, Classroom session. Service Providers in an organisation could be 

* taking action "Against" or "For" beneficiaries, citizens, patients, students, children, etc.
* collecting data for non-living objects like Water-body, School, Health Centre, etc.

## Different types of Subject in Avni

Avni allows for creating multiple Subject Types, each of which can be of any one of the following kind: 

* **Group** - Used for representing an entity which constitutes a group of another subject type. Ex: A group of Interns enrolled for a specific Program for the Year 2023
* **Household** - Special kind of Group, which usually refers to a Household of beneficiaries living in a single postal address location. Ex: A household consisting of a family of Father, Mother and children. Additionally, has a feature to assign one of the members as Head of the Household.
* **Individual** - Generic type of Subject to represent a Place, Person, Thing, Action. etc.. Ex: School, Student, Pocelain Machine, Distribution of Materials, etc.
* **Person** - Special kind of Individual, to specifically indicate a Human Being. Additionally has in-built capability to save First and Last Names, Gender and Date of Birth.
* **User** - A type of Subject used to provide self-refer to the Service Providers in Avni. Read more about [User Subject Types](doc:user-subject-types)
### Encounter Type

Encounter Types (also called Visit Types) are used to determine the kinds of encounters/visits that can be performed. An encounter can be scheduled for a specific encounter type using rules. Here, we define that encounter type and the forms associated with the encounter type.

An encounter type is either associated directly with a Subject type or is associated with a Program type, which in-turn would be associated with a subject type. It need not always be associated with programs (you can perform an annual survey of a population using encounter types not associated with programs, and use this information to enrol subjects into a program).

## Immutable encounter type

The encounter type can be made immutable by switching on the immutable flag on the encounter type create/edit screen. If the encounter type is marked as immutable then data from the last encounter is copied to the next encounter. Since the encounter is immutable, the edit is not allowed on these encounters.
### Concepts

**Concepts** define the different pieces of information that you collect as part of your service delivery.

For example, if you collect the blood pressure of a subject in a form, then "_Blood Pressure_" should be defined as a concept. You would notice that every question in a form requires a concept.

The _datatype_ of a concept determines the kind of data can be stored against a concept, and therefor against the form question or form element. Using concepts with datatypes ensures incorrect answers are not captured in a form question, and is helpful for eventually data aggregation, validation and reporting.

## Supported DataTypes in Concepts

The following datatypes are supported while defining concepts to be used in forms:

<Table align={["left","left"]}>
  <thead>
    <tr>
      <th>
        Concept DataType
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        **Numeric concepts**
      </td>

      <td>
        Numeric concepts are used to capture numbers. When creating a numeric concept, you can define normal ranges and absolute ranges. In the field application, if an observation for a concept collected goes beyond the normal range, then it is highlighted in red. Values above the absolute range are not allowed.  For instance for concept: Blood Pressure (Systolic), you can choose a Numeric concept with ranges.
      </td>
    </tr>

    <tr>
      <td>
        **Coded concepts (and NA concepts)**
      </td>

      <td>
        Coded concepts are those that have a fixed set of answers. For instance for Blood Group you would choose a coded concept with values: A+, B+, AB+, etc.

        These answers are also defined as concepts of NA datatype.
      </td>
    </tr>

    <tr>
      <td>
        **ID datatype**
      </td>

      <td>
        A concept of Id datatype is used to store autogenerated ids. See [Creating identifiers](doc:creating-identifiers) for more information on creating autogenerated ids.  For instance PatientIDs, TestIDs, etc.
      </td>
    </tr>

    <tr>
      <td>
        **Media concepts (Image, Video and Audio, File, ImageV2)**
      </td>

      <td>
        Images and videos can be captured using Image and Video concept datatypes. To capture Images with geotagging and other metadata associated, ImageV2 datatype can be used.

        For audio recording, Audio datatype can be used.

        For other generic file types, File datatype can be used.
      </td>
    </tr>

    <tr>
      <td>
        **Text (and Notes) concepts**
      </td>

      <td>
        The _Text_ data type helps capture one-line text while the _Notes_ datatype is used to capture longer **form** text.
      </td>
    </tr>

    <tr>
      <td>
        **Date and time concepts**
      </td>

      <td>
        There are different datatypes that can be used to capture date and time.

        * _Date_* - A simple date with no time
        * _Time_* - Just the time of day, with no date
        * _DateTime_* - To store both date and time in a single observation
        * _Duration_* - To capture durations such as 4 weeks, 2 days etc.
      </td>
    </tr>

    <tr>
      <td>
        **Location concepts**
      </td>

      <td>
        * Location_ concepts can be used to capture locations based on the location types configured in your implementation.

        Location concepts have 3 attributes:

        1. Within Catchment - Denotes whether the location to be captured would be within the catchment already assigned to your field workers. This attribute defaults to true and is mandatory.

        2. Lowest Level(s) - Denotes the lowest location type(s) you intend to capture via form elements using this concept. This attribute is mandatory.

        3. Highest Level - Denotes the highest location type that you would like to capture via form elements using this concept. This attribute is optional.
      </td>
    </tr>

    <tr>
      <td>
        **Subject concepts**
      </td>

      <td>
        * Subject_ concepts can be used to link to other subjects.

        Each Subject concept can map to a single subject type.

        Any form element using this concept can capture one or multiple subjects of the specified subject type.
      </td>
    </tr>

    <tr>
      <td>
        **Phone Number concepts**
      </td>

      <td>
        For capturing the phone number. It comes with a 10 digit validation. OTP verification can be enabled by turning on the "Switch on Verification" option. Avni uses msg91 for OTP messages, so msg91 `Auth key` and `Template` need to be step up using the admin app.
      </td>
    </tr>

    <tr>
      <td>
        **Group Affiliation concepts**
      </td>

      <td>
        Whenever automatic addition of a subject to a group is required  Group Affiliation concept can be used. It provides the list of all the group subjects in the form and choosing any group will add that subject to that group when the form is saved.
      </td>
    </tr>

    <tr>
      <td>
        **Encounter**
      </td>

      <td>
        * Encounter_ concepts can be used to link an encounter to any form.

        Each Encounter concept can map to a single encounter type.  It should also provide the scope to search that encounter. Also, name identifiers can be constructed by specifying the concepts used in the encounter form.

        Any form element using this concept can capture one or multiple encounters of the specified encounter type.
      </td>
    </tr>
  </tbody>
</Table>

<br />

## Showing counselling points in Forms

For showing counselling points in a form, always create a Form Element, using below coded Concept:

* Concept UUID: b4e5a662-97bf-4846-b9b7-9baeab4d89c4
* Concept Name: Placeholder for counselling form element
* Answers: \<None, no answers, to avoid showing them any options>

Specify counselling point as the Form Element Name, add numbering if needed.

Note: **You can reuse the same "Placeholder for counselling form element" multiple times in a single form**, without worrying about uniqueness constraint breach concerns.

***

## Location Concept Configuration

### General Location Concept Behavior

#### When "Within Catchment" is set to FALSE

When using a "Location" type concept with "Within Catchment" set to false:

* You must ensure that you perform update of the form(s) using that concept
* So that on form save, the `organisation_config` settings gets auto-modified to sync locations outside catchment to the user's device
* This ensures all locations are accessible while filling the form

#### When "Within Catchment" is set to TRUE (default)

When this option is enabled:

**Requirements:**

* Every user's catchment configuration must contain all required "Highest Level" type locations
* Without this, the form will not display any locations for selection

**Display Behavior:**

* Even if some users' catchments have locations higher than the Location concept's "Highest Level" type, those higher levels will not be shown
* The listing will start from the "Highest Level" type
* All locations across different lineages will be bunched together in a single list

### CSJ Organization - Important Notes

#### Catchment Configuration Requirements

**Note for CSJ org support:** Please keep the following details for future reference:

1. **Catchment Level**: For CSJ org, User Catchments must be configured at **District Level and above**. This is due to the `HighestAddressLevelType` configuration set for:
   * "Address of Applicant" in "Case" Registration
   * "Address of applicant - Claim" in "Claim" Registration

2. **Location Hierarchy**: User Catchments should include both "Administrative State" and "State" hierarchy locations.

#### Known Limitation

Due to the form concept configuration restriction mentioned above:

* State information will **not be shown on the app** while filling in the address fields
* This applies **irrespective of the catchment configuration** for a user
* For users with large catchments, all districts across different states will appear in a single listing
* There is **no ability to categorize** districts by their respective states
### Rules Concept Guide

Avni uses rules, or more accurately snippets of code (functions are written in JavaScript) in multiple places to provide flexibility to the implementers/developers to customise what Avni can do for the users. One can think of the rule system of Avni as a set of hooks that can be used by the rule authors to plug their own data/behaviour/logic to the app when it is used in the field and in the data entry application.

The rules are simple JavaScript functions that receive all the data via function parameters and they should return to the platform what it wants to get done. There is no state that needs to be maintained by JavaScript functions across invocations.

## Why are rules needed in Avni?

Since Avni is a general-purpose platform it doesn't know certain details about your problem domain. Wherever Avni doesn't know this - it leaves a hook for the implementer to provide the missing functionality.

## Overview of various rules

Complete programmatic reference is provided in the [Writing rules](doc:writing-rules), the following diagram explains how most of the rules are used. It displays navigation between the different screens and shows the rules that are triggered in the yellow boxes.

<Image align="center" className="border" width="80%" border={true} src="https://files.readme.io/37b4a00-Screenshot_2024-02-21_at_8.51.57_PM.png" />

In most rules, the rule has access to all the data of the subject and any data that is logically linked to the subject. e.g. In an encounter form level rule, one can access its subject form data, subject's relatives data, subject's relatives encounter data and so on.

#### Validation Rule

Validate the entire form. Last page of the form wizard. One per form.

#### Decision Rule

Add additional system generated observations. Last page of the form wizard. One per form.

#### Visit (Encounter) Schedule Rule

Create scheduled encounters with only due dates and no data.

#### Worklist Updation Rule

To display next forms on completion of one form. For comprehensive documentation on worklists, see the [Avni Worklist Documentation](https://avni.readme.io/update/docs/worklist-configuration).

#### Subject/Enrolment Summary

Display chosen information to summarise subject/enrolment on Subject dashboard screen.

#### Encounter/Enrolment Eligibility Check Rule

Before displaying list of forms that the user can fill check and filter out forms.

#### Manual Enrolment Eligibility Check Rule

If this rule is present, a custom form is shown to the user when the user starts enrolment. Based on the data filled and other subject data the rule decides which programs to display.

#### Edit Form Rule

If defined it can disallow editing of any form based on the rule. This rule is applied after access control is checked. This is available for: Registration, Enrolment, Enrolment Exit, Program Encounter, Program Encounter Cancel, General Encounter, General Encounter Cancel, Group Subject Registration, Form Element Group Edit and Checklist Item. It is not available/applicable for:

* Location
* Task (as there is no edit screen for it)
* SubjectEnrolmentEligibility, ManualProgramEnrolmentEligibility (these are unused features as of now)
* Encounter Drafts, Scheduled Encounters - should always be editable/fillable unless controlled by access control.
### Writing Rules

#### Helper Functions

**Audience**: Rule developers, implementers, and technical teams

## 📋 Table of Contents

* [Observation Access Methods](#observation-access-methods)
  * [`getObservationReadableValue()`](#getobservationreadablevalueconceptnameoruuid-parentconceptnameoruuid)
  * [`getObservationValue()`](#getobservationvalueconceptnameoruuid-parentconceptnameoruuid)
  * [`findObservation()`](#findobservationconceptnameoruuid-parentconceptnameoruuid)
  * [`findLatestObservationInEntireEnrolment()`](#findlatestobservationinentirenrolmentconceptnameoruuid-currentencounter)
  * [`hasObservation()`](#hasobservationconceptnameoruuid)
* [Age and Time Calculation Methods](#age-and-time-calculation-methods)
  * [`getAgeInYears()`](#getageinyearsasondate-precise)
  * [`getAgeInMonths()`](#getageinmonthsasondate-precise)
  * [`getAgeInWeeks()`](#getageinweeksondate-precise)
  * [`getAge()`](#getageasondate)
* [Cancel Encounter Methods](#cancel-encounter-methods)
  * [`findCancelEncounterObservation()`](#findcancelencounterobservationconceptnameoruuid)
  * [`findCancelEncounterObservationReadableValue()`](#findcancelencounterobservationreadablevalueconceptnameoruuid)
* [Encounter Navigation Methods](#encounter-navigation-methods)
  * [`getEncounters()`](#getencountersremovecancelledencounters)
  * [`findLatestObservationFromEncounters()`](#findlatestobservationfromencountersconceptnameoruuid-currentencounter)
  * [`findLastEncounterOfType()`](#findlastencounteroftypecurrentencounter-encountertypes)
  * [`scheduledEncounters()`](#scheduledencounters)
  * [`scheduledEncountersOfType()`](#scheduledencountersoftypeencountertypename)
* [Individual and Subject Methods](#individual-and-subject-methods)
  * [`isFemale()`](#isfemale)
  * [`isMale()`](#ismale)
  * [`isPerson()`](#isperson)
  * [`isHousehold()`](#ishousehold)
  * [`isGroup()`](#isgroup)
  * [`getMobileNumber()`](#getmobilenumber)
  * [`nameString`](#namestring)
* [Location and Address Methods](#location-and-address-methods)
  * [`lowestAddressLevel`](#lowestaddresslevel)
  * [`lowestTwoLevelAddress()`](#lowesttwoleveladdressi18n)
  * [`fullAddress()`](#fulladdressi18n)
* [Relationship and Group Methods](#relationship-and-group-methods)
  * [`getRelatives()`](#getrelativesrelationname-inverse)
  * [`getRelative()`](#getrelativerelationname-inverse)
  * [`getGroups()`](#getgroups)
  * [`getGroupSubjects()`](#getgroupsubjects)
* [Validation and Status Methods](#validation-and-status-methods)
  * [`hasBeenEdited()`](#hasbeenedited)
  * [`isCancelled()`](#iscancelled)
  * [`isScheduled()`](#isscheduled)
  * [`isRejectedEntity()`](#isrejectedentity)
* [Media and Utility Methods](#media-and-utility-methods)
  * [`findMediaObservations()`](#findmediaobservations)
  * [`getProfilePicture()`](#getprofilepicture)
  * [`getEntityTypeName()`](#getentitytypename)
  * [`toJSON()`](#tojson)

***

## 📊 Quick Reference

| Category             | Most Used Methods               | Purpose                             |
| -------------------- | ------------------------------- | ----------------------------------- |
| **Observations**     | `getObservationReadableValue()` | Get formatted values for display    |
| **Observations**     | `getObservationValue()`         | Get raw values for calculations     |
| **Age Calculations** | `getAgeInYears()`               | Calculate age in years              |
| **Age Calculations** | `getAgeInMonths()`              | Calculate age in months (pediatric) |
| **Encounters**       | `getEncounters()`               | Get encounter history               |
| **Individual Info**  | `isFemale()` / `isMale()`       | Gender checks                       |
| **Individual Info**  | `getMobileNumber()`             | Get contact number                  |
| **Validation**       | `hasObservation()`              | Check if data exists                |
| **Validation**       | `hasBeenEdited()`               | Check encounter completion          |

***

## Observation Access Methods

### `getObservationReadableValue(conceptNameOrUuid, parentConceptNameOrUuid)`

**Available on**: Individual, ProgramEnrolment, AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Gets the human-readable/display value of an observation, automatically formatting based on concept type.

**Parameters**:

* `conceptNameOrUuid` (String): Name or UUID of the concept to find
* `parentConceptNameOrUuid` (String, optional): Parent concept for grouped observations

**Returns**: String, Number, Date, Array, or undefined - The readable representation of the observation value

***

```javascript
// Basic usage on different entities
const treatmentDate = programEnrolment.getObservationReadableValue("Treatment Start date");
const childWeight = programEncounter.getObservationReadableValue('Weight of Child');
const mobileNumber = individual.getObservationReadableValue('Mobile Number');

// For coded concepts - returns answer names instead of UUIDs
const status = individual.getObservationReadableValue('Treatment Status'); 
// Returns: "Completed" instead of "uuid-12345"

// With grouped observations
const systolic = encounter.getObservationReadableValue('Systolic', 'Blood Pressure');

// Null-safe usage with fallback
const value = individual.getObservationReadableValue('Optional Field') || 'Not specified';

// Date formatting example
const dueDate = programEnrolment.getObservationReadableValue("Expected Date of Delivery");
// Returns: "15/03/2024" (formatted date) instead of Date object
```

***

### `getObservationValue(conceptNameOrUuid, parentConceptNameOrUuid)`

**Available on**: Individual, ProgramEnrolment, AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Gets the raw value of an observation without formatting.

**Parameters**:

* `conceptNameOrUuid` (String): Name or UUID of the concept to find
* `parentConceptNameOrUuid` (String, optional): Parent concept for grouped observations

**Returns**: Raw value (String, Number, Date, Array, concept UUID for coded) or undefined

***

```javascript
// Get raw values for calculations
const weight = programEncounter.getObservationValue("Weight");
const height = individual.getObservationValue("Height in cm");

// For coded concepts - returns concept UUIDs
const genderUUID = individual.getObservationValue("Gender");
// Returns: "uuid-male-concept" instead of "Male"

// Use in mathematical calculations
if (height && weight) {
    const bmi = weight / ((height / 100) * (height / 100));
}

// Date comparisons with raw dates
const dueDate = programEnrolment.getObservationValue("Expected Date of Delivery");
if (dueDate && moment().isAfter(dueDate)) {
    // Pregnancy is overdue
}

// Multi-select coded values return arrays of UUIDs
const symptoms = encounter.getObservationValue("Symptoms");
// Returns: ["fever-uuid", "cough-uuid", "headache-uuid"]
```

***

### `findObservation(conceptNameOrUuid, parentConceptNameOrUuid)`

**Available on**: Individual, AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Finds and returns the observation object itself, allowing access to all observation properties and methods.

**Parameters**:

* `conceptNameOrUuid` (String): Name or UUID of the concept to find
* `parentConceptNameOrUuid` (String, optional): Parent concept for grouped observations

**Returns**: Observation object or undefined

***

```javascript
// Find observation object
const mobileObs = individual.findObservation('Mobile Number');
const weightObs = encounter.findObservation('Weight');

// Check existence and access properties
if (mobileObs) {
    const value = mobileObs.getValue();
    const readableValue = mobileObs.getReadableValue();
    const isAbnormal = mobileObs.isAbnormal();
}

// Using with concept UUIDs
const obs = individual.findObservation('a1b2c3d4-e5f6-7890-abcd-ef1234567890');

// Grouped observations
const systolicObs = encounter.findObservation('Systolic', 'Blood Pressure Group');

// Chain operations
const weight = encounter.findObservation('Weight')?.getValue() || 0;
```

***

### `findLatestObservationInEntireEnrolment(conceptNameOrUuid, currentEncounter)`

**Available on**: ProgramEnrolment, ProgramEncounter

**Purpose**: Finds the most recent observation for a concept across the entire program enrolment lifecycle, including all encounters.

**Parameters**:

* `conceptNameOrUuid` (String): Name or UUID of the concept to find
* `currentEncounter` (ProgramEncounter, optional): Current encounter to exclude from search

**Returns**: Observation object or undefined

***

```javascript
// Track treatment progression
const latestPhase = programEnrolment.findLatestObservationInEntireEnrolment("Treatment phase type");
if (latestPhase) {
    const currentPhase = latestPhase.getReadableValue();
}

// Monitor compliance over time
const compliance = programEnrolment.findLatestObservationInEntireEnrolment("Compliance of previous month");

// Compare with previous values (excluding current encounter)
const previousWeight = programEncounter.findLatestObservationInEntireEnrolment("Weight", programEncounter);
const currentWeight = programEncounter.getObservationValue("Weight");
if (previousWeight && currentWeight) {
    const weightChange = currentWeight - previousWeight.getValue();
}

// Historical data for decision making
const lastTestResult = programEnrolment.findLatestObservationInEntireEnrolment("Lab Test Result");
const daysSinceTest = lastTestResult ? 
    moment().diff(lastTestResult.encounterDateTime, 'days') : null;
```

***

### `hasObservation(conceptNameOrUuid)`

**Available on**: AbstractEncounter (Encounter, ProgramEncounter), ProgramEnrolment

**Purpose**: Checks if an observation exists for the given concept without retrieving the value.

**Parameters**:

* `conceptNameOrUuid` (String): Name or UUID of the concept to check

**Returns**: Boolean

***

```javascript
// Conditional logic based on data availability
if (programEnrolment.hasObservation("Comorbidity")) {
    const comorbidity = programEnrolment.getObservationReadableValue("Comorbidity");
    // Process comorbidity data
}

// Form completion validation
if (!encounter.hasObservation("Blood Pressure")) {
    validationErrors.push("Blood pressure measurement is required");
}

// Check multiple required fields
const requiredFields = ['Weight', 'Height', 'Temperature'];
const missingFields = requiredFields.filter(field => !encounter.hasObservation(field));
if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
}
```

***

## Age and Time Calculation Methods

### `getAgeInYears(asOnDate, precise)`

**Available on**: Individual

**Purpose**: Calculates age in years from the individual's date of birth.

**Parameters**:

* `asOnDate` (Date, optional): Date to calculate age as of (defaults to current date)
* `precise` (Boolean, optional): Whether to use precise calculation (defaults to false)

**Returns**: Number (age in years)

***

```javascript
// Basic usage - current age
const currentAge = individual.getAgeInYears();

// Age at specific date (enrollment, encounter, etc.)
const ageAtEnrolment = individual.getAgeInYears(programEnrolment.enrolmentDateTime);
const ageAtEncounter = individual.getAgeInYears(encounter.encounterDateTime);

// Eligibility rules
return individual.isFemale() && individual.getAgeInYears() >= 15 && individual.getAgeInYears() <= 49;

// Age-based protocols
if (individual.getAgeInYears() < 18) {
    // Pediatric protocols
    return "Pediatric dosage required";
} else if (individual.getAgeInYears() >= 65) {
    // Geriatric considerations
    return "Monitor for age-related complications";
}

// Precise calculation when needed
const preciseAge = individual.getAgeInYears(moment(), true);

// Validation
if (individual.getAgeInYears() > 120) {
    return ValidationResult.failure("age", "Age seems unrealistic");
}
```

***

### `getAgeInMonths(asOnDate, precise)`

**Available on**: Individual

**Purpose**: Calculates age in months from the individual's date of birth, particularly useful for pediatric care.

**Parameters**:

* `asOnDate` (Date, optional): Date to calculate age as of (defaults to current date)
* `precise` (Boolean, optional): Whether to use precise calculation (defaults to false)

**Returns**: Number (age in months)

***

```javascript
// Basic usage for infants and children
const ageInMonths = individual.getAgeInMonths();

// Pediatric age categories
if (individual.getAgeInMonths() < 6) {
    return "Newborn (0-6 months)";
} else if (individual.getAgeInMonths() < 12) {
    return "Infant (6-12 months)";
} else if (individual.getAgeInMonths() < 24) {
    return "Toddler (12-24 months)";
}

// Immunization scheduling
const currentMonths = individual.getAgeInMonths();
if (currentMonths >= 9 && currentMonths <= 11) {
    return "9-11 month vaccinations due";
}

// Growth monitoring protocols
if (individual.getAgeInMonths() < 24) {
    return "Monthly weight monitoring required";
} else if (individual.getAgeInMonths() < 60) {
    return "Quarterly growth assessment";
}

// Nutritional guidelines
const months = individual.getAgeInMonths();
if (months >= 6 && months < 24) {
    return "Complementary feeding period";
}
```

***

### `getAgeInWeeks(asOnDate, precise)`

**Available on**: Individual

**Purpose**: Calculates age in weeks from the individual's date of birth, useful for newborn care.

**Parameters**:

* `asOnDate` (Date, optional): Date to calculate age as of (defaults to current date)
* `precise` (Boolean, optional): Whether to use precise calculation (defaults to false)

**Returns**: Number (age in weeks)

***

```javascript
// Newborn care protocols
const ageInWeeks = individual.getAgeInWeeks();

if (ageInWeeks < 2) {
    return "First 2 weeks - daily monitoring required";
} else if (ageInWeeks <= 6) {
    return "6-week pediatric checkup due";
}

// Early immunization schedule
if (ageInWeeks >= 6) {
    return "6-week vaccinations (DPT, OPV, Hepatitis B) due";
} else if (ageInWeeks >= 10) {
    return "10-week vaccinations due";
}

// Breastfeeding support
if (ageInWeeks < 26) { // Less than 6 months
    return "Exclusive breastfeeding recommended";
}
```

***

### `getAge(asOnDate)`

**Available on**: Individual

**Purpose**: Returns age as a Duration object with appropriate units, providing smart formatting.

**Parameters**:

* `asOnDate` (Date, optional): Date to calculate age as of (defaults to current date)

**Returns**: Duration object with smart unit selection

***

```javascript
// Smart age display
const ageDuration = individual.getAge();
console.log(ageDuration.toString()); // "25 years" or "8 months" or "3 weeks"

// Use in summary strings
const summary = `${individual.name}, Age: ${individual.getAge().toString()}, ${individual.gender.name}`;

// Duration object automatically chooses appropriate units:
// - Years if age > 1 year
// - Months if age < 1 year but > 0 months  
// - Zero years if age < 1 month

// Access duration properties
const age = individual.getAge();
if (age.isInYears()) {
    // Handle adult protocols
} else if (age.isInMonths()) {
    // Handle infant protocols
}
```

***

## Cancel Encounter Methods

### `findCancelEncounterObservation(conceptNameOrUuid)`

**Available on**: AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Finds observation from cancelled encounter data.

**Parameters**:

* `conceptNameOrUuid` (String): Name or UUID of the concept to find

**Returns**: Observation object or undefined

***

```javascript
// Find cancellation reason
const cancelReason = encounter.findCancelEncounterObservation('Cancellation reason');
if (cancelReason) {
    const reason = cancelReason.getReadableValue();
}

// Find next steps from cancelled encounter
const nextStep = programEncounter.findCancelEncounterObservation('Select next step');

// Rescheduling logic based on cancellation data
const cancelObs = encounter.findCancelEncounterObservation('Cancel reason UUID');
if (cancelObs) {
    const value = cancelObs.getValue();
    if (value === 'patient-not-available-uuid') {
        // Schedule follow-up
    }
}

// Analyze cancellation patterns
const cancelDate = encounter.findCancelEncounterObservation('Cancel date');
const cancelReason = encounter.findCancelEncounterObservation('Cancel reason');
```

***

### `findCancelEncounterObservationReadableValue(conceptNameOrUuid)`

**Available on**: AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Gets the readable value from cancelled encounter observation.

**Parameters**:

* `conceptNameOrUuid` (String): Name or UUID of the concept to find

**Returns**: String (readable value) or undefined

***

```javascript
// Get readable cancellation information
const nextStep = programEncounter.findCancelEncounterObservationReadableValue("Select next step");
const cancelReason = encounter.findCancelEncounterObservationReadableValue('Why was visit cancelled?');

// Conditional rescheduling logic
if (cancelReason === 'Patient not available') {
    return {
        name: "Follow-up Visit",
        earliestDate: moment().add(3, 'days').toDate(),
        maxDate: moment().add(7, 'days').toDate()
    };
} else if (cancelReason === 'Medical emergency') {
    return {
        name: "Emergency Follow-up",
        earliestDate: moment().add(1, 'day').toDate(),
        maxDate: moment().add(2, 'days').toDate()
    };
}

// Display cancelled visit summary
const cancelDetails = {
    reason: encounter.findCancelEncounterObservationReadableValue('Cancel reason'),
    nextAction: encounter.findCancelEncounterObservationReadableValue('Next action'),
    rescheduled: encounter.findCancelEncounterObservationReadableValue('Rescheduled for')
};
```

***

## Encounter Navigation Methods

### `getEncounters(removeCancelledEncounters)`

**Available on**: Individual, ProgramEnrolment

**Purpose**: Retrieves encounters sorted by date (most recent first), with option to exclude cancelled encounters.

**Parameters**:

* `removeCancelledEncounters` (Boolean):
  * `true` - Return only completed encounters
  * `false` - Return all encounters including cancelled ones

**Returns**: Array of Encounter/ProgramEncounter objects sorted by encounter date (descending)

***

```javascript
// Get completed encounters only
const completedEncounters = individual.getEncounters(true);
const completedProgramEncounters = programEnrolment.getEncounters(true);

// Get all encounters including cancelled
const allEncounters = individual.getEncounters(false);

// Find most recent encounter
const latestEncounter = individual.getEncounters(true)[0];

// Filter by encounter type
const ancEncounters = individual.getEncounters(true)
    .filter(enc => enc.encounterType.name === 'ANC');

// Count encounters
const visitCount = programEnrolment.getEncounters(true).length;

// Find encounters in date range
const recentEncounters = individual.getEncounters(true)
    .filter(enc => moment(enc.encounterDateTime).isAfter(moment().subtract(30, 'days')));

// Check if any encounters exist
if (individual.getEncounters(true).length === 0) {
    return "No completed visits found";
}
```

***

### `findLatestObservationFromEncounters(conceptNameOrUuid, currentEncounter)`

**Available on**: Individual

**Purpose**: Finds the latest observation for a concept from all individual encounters (across all programs).

**Parameters**:

* `conceptNameOrUuid` (String): Name or UUID of the concept to find
* `currentEncounter` (Encounter, optional): Current encounter to exclude from search

**Returns**: Observation object or undefined

***

```javascript
// Find latest vital signs across all visits
const latestBP = individual.findLatestObservationFromEncounters('Blood Pressure');
const latestWeight = individual.findLatestObservationFromEncounters('Weight');

// Exclude current encounter from search
const previousWeight = individual.findLatestObservationFromEncounters('Weight', currentEncounter);
const currentWeight = currentEncounter.getObservationValue('Weight');

if (previousWeight && currentWeight) {
    const weightChange = currentWeight - previousWeight.getValue();
    if (weightChange > 5) {
        return "Significant weight gain since last visit";
    }
}

// Cross-program data access
const techStatus = individual.findLatestObservationFromEncounters('Tech Mahindra Status');
const statusValue = techStatus ? techStatus.getReadableValue() : "No previous status";

// Trend analysis
const latestHbA1c = individual.findLatestObservationFromEncounters('HbA1c');
if (latestHbA1c) {
    const daysSinceTest = moment().diff(latestHbA1c.encounterDateTime, 'days');
    if (daysSinceTest > 90) {
        return "HbA1c test overdue (last test " + daysSinceTest + " days ago)";
    }
}
```

***

### `findLastEncounterOfType(currentEncounter, encounterTypes)`

**Available on**: Individual

**Purpose**: Finds the most recent encounter of specified types before the current encounter.

**Parameters**:

* `currentEncounter` (Encounter): Current encounter to exclude from search
* `encounterTypes` (Array): Array of encounter type names to search for

**Returns**: Encounter object or undefined

***

```javascript
// Find last ANC visit
const lastANC = individual.findLastEncounterOfType(currentEncounter, ['ANC']);

// Find last follow-up of any type
const lastFollowUp = individual.findLastEncounterOfType(currentEncounter, 
    ['Follow-up 1', 'Follow-up 2', 'Follow-up 3']);

// Calculate interval between visits
if (lastANC) {
    const daysSinceLastVisit = moment(currentEncounter.encounterDateTime)
        .diff(lastANC.encounterDateTime, 'days');
    
    if (daysSinceLastVisit > 28) {
        return "Visit interval exceeded recommended 4 weeks";
    }
}

// Access data from previous visit
if (lastFollowUp) {
    const previousCompliance = lastFollowUp.getObservationReadableValue('Treatment Compliance');
    const currentCompliance = currentEncounter.getObservationReadableValue('Treatment Compliance');
    
    if (previousCompliance === 'Good' && currentCompliance === 'Poor') {
        return "Compliance has declined since last visit";
    }
}
```

***

### `scheduledEncounters()`

**Available on**: Individual

**Purpose**: Gets all scheduled encounters that haven't been completed or cancelled.

**Returns**: Array of scheduled encounters

***

```javascript
// Check for pending visits
const pendingVisits = individual.scheduledEncounters();

// Count overdue visits
const overdueVisits = individual.scheduledEncounters()
    .filter(enc => moment().isAfter(enc.maxVisitDateTime));

if (overdueVisits.length > 0) {
    return `${overdueVisits.length} visits are overdue`;
}

// Find next due visit
const nextVisit = individual.scheduledEncounters()
    .sort((a, b) => a.earliestVisitDateTime - b.earliestVisitDateTime)[0];

if (nextVisit) {
    const daysUntilDue = moment(nextVisit.earliestVisitDateTime).diff(moment(), 'days');
    return `Next visit due in ${daysUntilDue} days`;
}
```

***

### `scheduledEncountersOfType(encounterTypeName)`

**Available on**: Individual

**Purpose**: Gets scheduled encounters of a specific type.

**Parameters**:

* `encounterTypeName` (String): Name of the encounter type to filter by

**Returns**: Array of scheduled encounters of the specified type

***

```javascript
// Check for scheduled ANC visits
const scheduledANC = individual.scheduledEncountersOfType('ANC');

// Check if delivery is scheduled
const scheduledDelivery = individual.scheduledEncountersOfType('Delivery');
if (scheduledDelivery.length > 0) {
    const deliveryDue = moment(scheduledDelivery[0].earliestVisitDateTime);
    return `Delivery scheduled for ${deliveryDue.format('DD/MM/YYYY')}`;
}

// Immunization scheduling
const scheduledVaccination = individual.scheduledEncountersOfType('Vaccination');
if (scheduledVaccination.length === 0 && individual.getAgeInMonths() >= 6) {
    return "6-month vaccination overdue";
}
```

***

## Individual and Subject Methods

### `isFemale()`

**Available on**: Individual

**Purpose**: Checks if the individual's gender is female.

**Returns**: Boolean

**Examples**:

```javascript
// Basic gender check
if (individual.isFemale()) {
    // Female-specific logic
}

// Eligibility for reproductive health programs
return individual.isFemale() && individual.getAgeInYears() >= 15 && individual.getAgeInYears() <= 49;

// Pregnancy program eligibility
if (programName === 'Pregnancy Care' && !individual.isFemale()) {
    return {
        eligible: false,
        message: "Only females are eligible for pregnancy care program"
    };
}

// Gender-specific screening
if (individual.isFemale() && individual.getAgeInYears() >= 21) {
    return "Eligible for cervical cancer screening";
}

// Combined conditions
if (individual.isFemale() && individual.getAgeInYears() > 10 && individual.getAgeInYears() < 19) {
    return "Eligible for adolescent girl program";
}
```

***

### `isMale()`

**Available on**: Individual

**Purpose**: Checks if the individual's gender is male.

**Returns**: Boolean

**Examples**:

```javascript
// Basic gender check
if (individual.isMale()) {
    // Male-specific logic
}

// Male-specific screening eligibility
if (individual.isMale() && individual.getAgeInYears() >= 50) {
    return "Eligible for prostate screening";
}

// Program exclusion validation
if (programName === 'Maternal Health' && individual.isMale()) {
    return {
        eligible: false,
        message: "Males cannot enroll in maternal health program"
    };
}

// Age and gender combined rules
if (individual.isMale() && individual.getAgeInYears() >= 40) {
    return "Consider cardiovascular risk assessment";
}
```

***

### `isPerson()`

**Available on**: Individual

**Purpose**: Checks if the subject type is a person (as opposed to household, group, etc.).

**Returns**: Boolean

**Examples**:

```javascript
// Person-specific logic
if (individual.isPerson()) {
    const genderText = individual.gender.name;
    const ageText = individual.getAge().toString();
} else {
    // Handle non-person subjects (groups, households)
}

// Display formatting
const subtitle1 = individual.isPerson() ? individual.gender.name : "";
const subtitle2 = individual.isPerson() ? individual.getAge().toString() : "";

// Validation rules
if (individual.isPerson()) {
    // Apply person-specific validation
    return individual.isFemale() && individual.getAgeInYears() >= 15;
} else {
    // Handle group/household validation
}
```

***

### `isHousehold()`

**Available on**: Individual

**Purpose**: Checks if the subject type is a household.

**Returns**: Boolean

**Examples**:

```javascript
// Household-specific rules
if (individual.isHousehold()) {
    // Apply household-level validation and logic
}

// Filter household subjects
const households = subjects.filter(subject => subject.isHousehold());

// Check if individual belongs to households
const belongsToHousehold = _.some(individual.groups, group => 
    group.groupSubject.isHousehold());

// Household member count validation
if (individual.isHousehold()) {
    const memberCount = individual.groupSubjects.length;
    if (memberCount === 0) {
        return "Household must have at least one member";
    }
}
```

***

### `isGroup()`

**Available on**: Individual

**Purpose**: Checks if the subject type is a group.

**Returns**: Boolean

**Examples**:

```javascript
// Group-specific processing
if (individual.isGroup()) {
    // Handle group operations
    const memberCount = individual.groupSubjects.length;
}

// Group validation
if (individual.isGroup() && individual.groupSubjects.length < 5) {
    return "Self-help group must have at least 5 members";
}
```

***

### `getMobileNumber()`

**Available on**: Individual

**Purpose**: Gets mobile number from observations using mobile number concept.

**Returns**: String (mobile number) or undefined

**Examples**:

```javascript
// Get mobile number for notifications
const mobileNumber = individual.getMobileNumber();
if (mobileNumber) {
    // Send SMS notification
    console.log(`Sending SMS to ${mobileNumber}`);
}

// Validation
const mobile = individual.getMobileNumber();
if (!mobile && isRequired) {
    return ValidationResult.failure("mobile", "Mobile number is required");
}

// Display with fallback
const displayNumber = individual.getMobileNumber() || "Not provided";
```

***

### `nameString`

**Available on**: Individual

**Purpose**: Gets formatted name string based on subject type.

**Returns**: String (formatted name)

**Examples**:

```javascript
// Get formatted name
const displayName = individual.nameString;

// For persons: "John Doe Smith"
// For users: "Admin(You)" 
// For other subjects: "Group Name"

// Use in displays
const summary = `Patient: ${individual.nameString}, Age: ${individual.getAge()}`;

// Name with unique identifier (for specific subject types like Farmer)
const uniqueName = individual.nameStringWithUniqueAttribute;
// Returns: "John Doe (9876543210)" if mobile number exists
```

***

## Location and Address Methods

### `lowestAddressLevel`

**Available on**: Individual

**Purpose**: Gets the lowest (most specific) address level for the individual.

**Returns**: AddressLevel object

**Examples**:

```javascript
// Access address information
const addressLevel = individual.lowestAddressLevel;
const villageName = addressLevel.name;
const addressType = addressLevel.type;

// Get address lineage
const titleLineage = addressLevel.titleLineage;

// Check for web application context
const webapp = individual.lowestAddressLevel.titleLineage;
if (webapp) {
    // Web application specific logic
    // Skip location-based validations
} else {
    // Mobile application logic
}

// Address-based rules
if (individual.lowestAddressLevel.name === "High Risk Village") {
    return "Apply high-risk protocols";
}
```

***

### `lowestTwoLevelAddress(i18n)`

**Available on**: Individual

**Purpose**: Gets formatted address string with the lowest two levels of address hierarchy.

**Parameters**:

* `i18n` (Object): Internationalization object for translation

**Returns**: String (formatted address)

**Examples**:

```javascript
// Display compact address
const compactAddress = individual.lowestTwoLevelAddress(i18n);
// Returns: "Village Name, Block Name"

// Use in summaries with fallback
const location = individual.lowestTwoLevelAddress(i18n) || 'Address not specified';

// Address validation
const address = individual.lowestTwoLevelAddress(i18n);
if (!address || address.trim() === '') {
    return ValidationResult.failure("address", "Address is required");
}
```

***

### `fullAddress(i18n)`

**Available on**: Individual

**Purpose**: Gets complete address lineage from lowest to highest level.

**Parameters**:

* `i18n` (Object): Internationalization object for translation

**Returns**: String (complete address hierarchy)

**Examples**:

```javascript
// Full address hierarchy
const fullAddr = individual.fullAddress(i18n);
// Returns: "Village, Block, District, State"

// Use for detailed address display
const addressDetail = {
    compact: individual.lowestTwoLevelAddress(i18n),
    full: individual.fullAddress(i18n)
};

// Geographic analysis
const addressComponents = individual.fullAddress(i18n).split(', ');
const state = addressComponents[addressComponents.length - 1];
```

***

## Relationship and Group Methods

### `getRelatives(relationName, inverse)`

**Available on**: Individual

**Purpose**: Gets all relatives by relation name.

**Parameters**:

* `relationName` (String): Name of the relation to find
* `inverse` (Boolean, optional): Whether to check inverse relation (default: false)

**Returns**: Array of Individual objects

**Examples**:

```javascript
// Get all children (inverse of parent relation)
const children = individual.getRelatives('Parent', true);

// Get all siblings
const siblings = individual.getRelatives('Sibling');

// Family size calculation
const spouse = individual.getRelative('Spouse');
const children = individual.getRelatives('Parent', true);
const familySize = 1 + children.length + (spouse ? 1 : 0);

// Child immunization tracking
children.forEach(child => {
    const childAge = child.getAgeInMonths();
    if (childAge >= 6 && childAge < 24) {
        // Track immunization status
    }
});

// Family history analysis
const parents = individual.getRelatives('Child', true); // Get parents
const familyHistory = [];
parents.forEach(parent => {
    const diabetes = parent.getObservationReadableValue('Diabetes History');
    if (diabetes === 'Yes') {
        familyHistory.push('Parental diabetes');
    }
});
```

***

### `getRelative(relationName, inverse)`

**Available on**: Individual

**Purpose**: Gets the first relative by relation name.

**Parameters**:

* `relationName` (String): Name of the relation to find
* `inverse` (Boolean, optional): Whether to check inverse relation (default: false)

**Returns**: Individual object or undefined

**Examples**:

```javascript
// Get spouse
const spouse = individual.getRelative('Spouse');
if (spouse) {
    const spouseAge = spouse.getAgeInYears();
}

// Get mother
const mother = individual.getRelative('Mother');

// Get primary child (useful for parent-child relationships)
const primaryChild = individual.getRelative('Parent', true);

// Conditional logic based on relationships
if (spouse && spouse.isFemale() && spouse.getAgeInYears() >= 15) {
    // Include spouse in reproductive health program
}

// Family contact information
const emergencyContact = individual.getRelative('Emergency Contact');
const emergencyNumber = emergencyContact ? emergencyContact.getMobileNumber() : null;
```

***

### `getGroups()`

**Available on**: Individual

**Purpose**: Gets all non-voided groups that this individual belongs to.

**Returns**: Array of GroupSubject objects

**Examples**:

```javascript
// Get household information
const household = individual.getGroups().filter(grp => 
    grp.groupSubject.subjectType.type === 'Household')[0];

if (household) {
    const householdName = household.groupSubject.name;
    const householdMembers = household.groupSubject.groupSubjects.length;
}

// Check group membership
const groups = individual.getGroups();
if (groups.length > 0) {
    // Individual belongs to groups
    const groupNames = groups.map(g => g.groupSubject.name);
}

// Self-help group membership
const shgMembership = individual.getGroups().find(g => 
    g.groupSubject.subjectType.name === 'Self Help Group');

if (shgMembership) {
    // Access SHG-specific benefits
}
```

***

### `getGroupSubjects()`

**Available on**: Individual

**Purpose**: Gets all non-voided group subjects where this individual is a member.

**Returns**: Array of GroupSubject objects

**Examples**:

```javascript
// Get all group memberships
const groupMemberships = individual.getGroupSubjects();

// Find specific group type membership
const shgMembership = individual.getGroupSubjects()
    .find(gs => gs.groupSubject.subjectType.name === 'SHG');

// Check member role
groupMemberships.forEach(membership => {
    if (membership.groupRole.isHeadOfHousehold) {
        // Individual is head of household
    }
});

// Count group memberships
const membershipCount = individual.getGroupSubjects().length;
if (membershipCount === 0) {
    return "Individual is not part of any group";
}
```

***

## Validation and Status Methods

### `hasBeenEdited()`

**Available on**: AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Checks if encounter has been edited (filled with data).

**Returns**: Boolean

**Examples**:

```javascript
// Check if encounter is completed
if (encounter.hasBeenEdited()) {
    // Encounter has been filled with data
    const completionDate = encounter.encounterDateTime;
} else {
    // Encounter is still scheduled/pending
}

// Validation for editing
if (encounter.hasBeenEdited() && !userCanEditCompletedEncounters) {
    return {
        editable: false,
        message: "Cannot edit completed encounters"
    };
}

// Cancellation eligibility
if (!encounter.hasBeenEdited() && !encounter.isCancelled()) {
    // Can be cancelled
}
```

***

### `isCancelled()`

**Available on**: AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Checks if encounter has been cancelled.

**Returns**: Boolean

**Examples**:

```javascript
// Check cancellation status
if (encounter.isCancelled()) {
    const cancelReason = encounter.findCancelEncounterObservationReadableValue('Cancel Reason');
    const cancelDate = encounter.cancelDateTime;
}

// Filter active encounters
const activeEncounters = individual.encounters.filter(enc => 
    !enc.isCancelled() && enc.hasBeenEdited());

// Rescheduling logic
if (encounter.isCancelled()) {
    const reason = encounter.findCancelEncounterObservationReadableValue('Cancel Reason');
    if (reason === 'Patient unavailable') {
        // Automatic rescheduling
        return {
            name: "Rescheduled Visit",
            earliestDate: moment().add(7, 'days').toDate()
        };
    }
}
```

***

### `isScheduled()`

**Available on**: AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Checks if encounter is scheduled (not filled and not cancelled).

**Returns**: Boolean

**Examples**:

```javascript
// Check if visit is pending
if (encounter.isScheduled()) {
    const daysUntilDue = moment(encounter.earliestVisitDateTime).diff(moment(), 'days');
    if (daysUntilDue < 0) {
        return "Visit is overdue";
    } else {
        return `Visit due in ${daysUntilDue} days`;
    }
}

// Count scheduled visits
const pendingVisits = individual.encounters.filter(enc => enc.isScheduled()).length;

// Overdue visit check
const overdueVisits = individual.encounters.filter(enc => 
    enc.isScheduled() && moment().isAfter(enc.maxVisitDateTime));
```

***

### `isRejectedEntity()`

**Available on**: Individual, AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Checks if entity has been rejected in the approval workflow.

**Returns**: Boolean

**Examples**:

```javascript
// Check individual approval status
if (individual.isRejectedEntity()) {
    return "Individual registration has been rejected";
}

// Check encounter approval status
if (encounter.isRejectedEntity()) {
    const rejectionReason = encounter.latestEntityApprovalStatus.comment;
    return `Encounter rejected: ${rejectionReason}`;
}

// Filter approved entities
const approvedEncounters = encounters.filter(enc => !enc.isRejectedEntity());
const approvedIndividuals = individuals.filter(ind => !ind.isRejectedEntity());

// Conditional processing
if (!individual.isRejectedEntity()) {
    // Process approved individual
}
```

***

## Media and Utility Methods

### `findMediaObservations()`

**Available on**: Individual, AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Finds all media observations (images, videos, audio files).

**Returns**: Array of media observations

**Examples**:

```javascript
// Get all media attachments
const mediaObs = individual.findMediaObservations();

// Process different media types
mediaObs.forEach(obs => {
    if (obs.concept.datatype === 'Image') {
        // Handle image observation
        const imageUrl = obs.getValue();
    } else if (obs.concept.datatype === 'Video') {
        // Handle video observation
    }
});

// Check for profile pictures or documents
const profileImages = individual.findMediaObservations()
    .filter(obs => obs.concept.name.includes('Profile'));

// Count media attachments
const mediaCount = encounter.findMediaObservations().length;
if (mediaCount === 0) {
    return "No supporting documents attached";
}
```

***

### `getProfilePicture()`

**Available on**: Individual

**Purpose**: Gets the profile picture path/URL.

**Returns**: String (image path) or undefined

**Examples**:

```javascript
// Display profile picture
const profilePic = individual.getProfilePicture();
if (profilePic) {
    // Show image in UI
    console.log(`Profile picture: ${profilePic}`);
} else {
    // Show default avatar
}

// Validation
const hasPicture = !!individual.getProfilePicture();
if (requiresPhoto && !hasPicture) {
    return ValidationResult.failure("photo", "Profile picture is required");
}
```

***

### `getEntityTypeName()`

**Available on**: Individual, AbstractEncounter (Encounter, ProgramEncounter)

**Purpose**: Gets the entity type name for identification and logging.

**Returns**: String

**Examples**:

```javascript
// Get type for logging
const entityType = individual.getEntityTypeName(); // Returns subject type name like "Person", "Household"
const encounterType = encounter.getEntityTypeName(); // Returns encounter type name like "ANC", "Delivery"

// Conditional logic based on type
if (individual.getEntityTypeName() === "Household") {
    // Household-specific logic
} else if (individual.getEntityTypeName() === "Person") {
    // Person-specific logic
}

// Logging and auditing
console.log(`Processing ${entity.getEntityTypeName()}: ${entity.uuid}`);
```

***

### `toJSON()`

**Available on**: Individual, ProgramEncounter

**Purpose**: Gets JSON representation of the entity for serialization.

**Returns**: Object (JSON representation)

**Examples**:

```javascript
// Serialize for logging or transmission
const individualData = individual.toJSON();
const encounterData = programEncounter.toJSON();

// Log for debugging
console.log("Individual data:", JSON.stringify(individual.toJSON(), null, 2));

// Data export
const exportData = {
    individual: individual.toJSON(),
    encounters: individual.encounters.map(enc => enc.toJSON ? enc.toJSON() : enc)
};
```

***

## 📚 Additional Resources

* [Writing Rules Guide](../docs/writing-rules#/) - Complete guide to writing Avni rules
* [Concept Reference](../docs/concepts#/) - Working with concepts and observations

<br />
#### Index

> 🚧 Important Update on Rules Execution
>
> Please be informed that all existing rules stored in the rules table will become obsolete by the end of this year, 2024. This means that starting January 1, 2025, these rules will no longer be executed.
>
> However, any rules added through the App Designer and avni-health-modules will continue to work as expected.
>
> If you have any questions or need assistance with migrating your rules, please contact our support team.

# Contents:

[Introduction](/docs/writing-rules#introduction)  
[Rule types](/docs/writing-rules#rule-types)  
[Using service methods in the rules](/docs/writing-rules#using-service-methods-in-the-rules)  
[Using other group/household individuals' information in the rules](/docs/writing-rules#using-other-grouphousehold-individuals-information-in-the-rules)  
[Types of rules and their support/availability in Data Entry App](/docs/writing-rules#types-of-rules-and-their-supportavailability-in-data-entry-app)  
[Types of rules and their support/availability in transaction data upload](/docs/writing-rules#types-of-rules-and-their-supportavailability-in-transaction-data-upload)

## Introduction:

Rules are just normal JavaScript functions that take some input and returns something. You can use the full power of JavaScript in these functions. We also provide you with some helper libraries that make it easier to write rules. We will introduce you to these libraries in the examples below.

All rule functions get passed an object as a parameter. The parameter object has two properties: 1. imports 2. params. The imports object is used to pass down common libraries. The params object is used to pass rule-specific parameters. In params object, we pass the relevant entity on which rule is being executed e.g. if a rule is invoked when a program encounter is being performed then we pass the ProgramEncounter object. The entities that we pass are an instance of classes defined in [avni-models](https://github.com/avniproject/avni-models)

### Shape of common imports object:

```javascript
{
  rulesConfig: {}, //It exposes everything exported by rules-config library. https://github.com/avniproject/rules-config/blob/master/rules.js.
  common: {}, // Library we have for common functions https://github.com/avniproject/avni-client/blob/master/packages/openchs-health-modules/health_modules/common.js
  lodash: {}, // lodash library
  moment: {}, // momentjs library
  motherCalculations: {}, //mother program calculations https://github.com/avniproject/avni-health-modules/blob/master/src/health_modules/mother/calculations.js
  log: {} //console.log object
}
```

### Shape of common parameters in all params object

Note there are other elements in params object which are specific to the rule hence have been described below.

```javascript
{    
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects, to which the User is assigned to 
}
```

User: [https://github.com/avniproject/avni-models/blob/master/src/UserInfo.js](https://github.com/avniproject/avni-models/blob/master/src/UserInfo.js)

Group: [https://github.com/avniproject/avni-models/blob/master/src/Groups.js](https://github.com/avniproject/avni-models/blob/master/src/Groups.js)

#### Entities passed to the rule

All rule receives an entity from the `params` object. Depending on the rule type an entity can be one of [Individual](https://github.com/avniproject/avni-models/blob/master/src/Individual.ts), [ProgramEncounter](https://github.com/avniproject/avni-models/blob/master/src/ProgramEncounter.js), [ProgramEnrolment](https://github.com/avniproject/avni-models/blob/master/src/ProgramEnrolment.js), [Encounter](https://github.com/avniproject/avni-models/blob/master/src/Encounter.js), or [ChecklistItem](https://github.com/avniproject/avni-models/blob/master/src/ChecklistItem.js). The shape of the entity object and the supported methods can be viewed from the above links on each entity.

## Rule types

1. [Enrolment summary rule](/docs/writing-rules#1-enrolment-summary-rule)
2. [Form element rule](/docs/writing-rules#2-form-element-rule)
3. [Form element group rule](/docs/writing-rules#3-form-element-group-rule)
4. [Visit schedule rule](/docs/writing-rules#4-visit-schedule-rule)
5. [Decision rule](/docs/writing-rules#5-decision-rule)
6. [Validation rule](/docs/writing-rules#6-validation-rule)
7. [Enrolment eligibility check rule](/docs/writing-rules#7-enrolment-eligibility-check-rule)
8. [Encounter eligibility check rule](/docs/writing-rules#8-encounter-eligibility-check-rule)
9. [Checklists rule](/docs/writing-rules#9-checklists-rule)
10. [Work list updation rule](/docs/writing-rules#10-work-list-updation-rule) - _See [comprehensive worklist guide](https://avni.readme.io/update/docs/worklist-configuration)_
11. [Subject summary rule](/docs/writing-rules#11-subject-summary-rule)
12. [Hyperlink menu item rule](/docs/writing-rules#12-hyperlink-menu-item-rule)
13. [Message rule](https://avni.readme.io/docs/writing-rules#13-message-rule)
14. [Dashboard Card rule](https://avni.readme.io/docs/writing-rules#14-dashboard-card-rule)
15. [Manual Programs Eligibility Check Rule](https://avni.readme.io/docs/writing-rules#15-manual-programs-eligibility-check-rule)
16. [Member Addition Eligibility Check Rule](https://avni.readme.io/docs/writing-rules#16-member-addition-eligibility-check-rule)
17. [Edit Form Rule](https://avni.readme.io/docs/writing-rules#17-edit-form-rule)
18. [Global reusable code rule](https://avni.readme.io/docs/writing-rules#18-global-reusable-code-rule-alpha)

<br />

<Image alt="Invocation of different rule types" border={false} src="https://files.readme.io/2284f79-Screenshot_2020-07-03_at_9.33.55_AM.png" />

<br />

<Image border={false} src="https://files.readme.io/baad794-Screenshot_2020-07-03_at_9.59.42_AM.png" />

<br />

<hr />

## 1. Enrolment summary rule

* Logical scope = Program Enrolment
* Trigger = Before the opening of a subject dashboard with default program selection. On program change of subject dashboard.
* In designer = Program (Enrolment Summary Rule)
* When to use = Display important information in the subject dashboard for a program

You can use this rule to highlight important information about the program on the Subject Dashboard in table format. It can pull data from all the encounters of enrolment and the enrolment itself. You can use this when the information you want to show is not entered by the user in any of the forms and is also not required for any reporting purposes (hence you wouldn't also generate this data via decision rule).

### Shape of params object:

```javascript
{ 
  summaries: [],
  programEnrolment: {}, // ProgramEnrolment model
	services,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

You need to return an array of summary objects from this function.

### Shape of the summary object:

```
{
  "name": "name of the summary concept",
  "value": <text> | <number> | <date> | <datetime> | <concept list in case of Coded question>
}
```

### Example:

```
({params, imports}) =>  {
    const summaries = [];
    const programEnrolment = params.programEnrolment;
    const birthWeight = programEnrolment.findObservationInEntireEnrolment('Birth Weight');
    if (birthWeight) {
      summaries.push({name: 'Birth Weight', value: birthWeight.getValue()});
    }
    return summaries;
};
```

<Image border={false} src="https://files.readme.io/4f29afe-Screenshot_2020-05-19_at_3.09.44_PM.png" />

<br />

<Image border={false} src="https://files.readme.io/6fdb1f3-4bf85d9-encounter-scheduling-2.png" />

<br />

<hr />

## 2. Form element rule

* Logical scope = Form Element
* Trigger = Before display of form element in the form wizard and on any change done by the user in on that page
* In designer = Form Element (RULES tab)
* When to use =
  * Hide/show a form element
  * auto calculate the value of a form element
  * reset value of a form element

### Shape of params object:

```javascript
{
  entity: {}, //it could be one of Individual, ProgramEncounter, ProgramEnrolment, Encounter and ChecklistItem depending on what type of form is this rule attached to
  formElement: {}, //form element to which this rule is attached to
  questionGroupIndex,
  services,
  entityContext,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

This function should return an instance of [FormElementStatus](https://github.com/avniproject/avni-models/blob/master/src/application/FormElementStatus.js) to show/hide the element, show validation error, set its value, reset a value, or skip answers.

To reset a value, you can use FormElementStatus._resetIfValueIsNull() method.  
You can either use FormElementStatusBuilder or use normal JavaScript to build the return value. FormElementStatusBuilder is a helper class provided by Avni that helps writing rules in a declarative way.

### Examples using FormElementStatusBuilder.

```javascript Registration Form
'use strict';
({params, imports}) => {
  const individual = params.entity;
  const formElement = params.formElement;
  const statusBuilder = new imports.rulesConfig.FormElementStatusBuilder({individual, formElement});
  statusBuilder.show().when.valueInRegistration("Number of hywas required").is.greaterThan(0);
  return statusBuilder.build();
};
```
```javascript Program Enrolment Form 1
({params, imports}) => {
  const programEnrolment = params.entity;
  const formElement = params.formElement;
  const statusBuilder = new imports.rulesConfig.FormElementStatusBuilder({programEnrolment, formElement});
  statusBuilder.show().when.valueInEnrolment('Is child getting registered at Birth').containsAnswerConceptName("No");
  return statusBuilder.build();//this method returns FormElementStatus object with visibility true if the conditions given above matches
};
```
```javascript Program Enrolment Form 2
({params, imports}) => {
    const gravidaBreakup = [
        'Number of miscarriages',
        'Number of abortions',
        'Number of stillbirths',
        'Number of child deaths',
        'Number of living children'
    ];
    const computeGravida = (programEnrolment) => gravidaBreakup
        .map((cn) => programEnrolment.getObservationValue(cn))
        .filter(Number.isFinite)
        .reduce((a, b) => a + b, 1);
    
    const [formElement, programEnrolment] = params.programEnrolment;
    const firstPregnancy = programEnrolment.getObservationReadableValue('Is this your first pregnancy?');
    const value = firstPregnancy === 'Yes' ? 1 : firstPregnancy === 'No' ? computeGravida(programEnrolment) : undefined;
    return new FormElementStatus(formElement.uuid, true, value);
};
```
```javascript Program Encounter Form
'use strict';
({params, imports}) => {
  const programEncounter = params.entity;
  const formElement = params.formElement;
  const statusBuilder = new imports.rulesConfig.FormElementStatusBuilder({programEncounter, formElement});
  const value = programEncounter.findLatestObservationInEntireEnrolment('Have you received first dose of TT');
  statusBuilder.show().whenItem( value.getReadableValue() == 'No').is.truthy;
  return statusBuilder.build();
};
```
```javascript Encounter Form
'use strict';
({params, imports}) => {
  const encounter = params.entity;
  const formElement = params.formElement;
  const statusBuilder = new imports.rulesConfig.FormElementStatusBuilder({encounter, formElement});
  statusBuilder.show().when.valueInEncounter("Are machine start and end hour readings recorded").is.yes;
  return statusBuilder.build();
};
```
```Text AffiliatedGroups
//In-order to fetch affiliatedGroups set as part of GroupAffiliation Concept in the same form,
//one needs to access params.entityContext.affiliatedGroups variable.

// Old Rule snippet
// const phulwariName = _.get(_.find(programEnrolment.individual.affiliatedGroups, ({voided}) => !voided), ['groupSubject', 'firstName'], '');

// New Rule snippet
const phulwariName = _.get(_.find(params.entityContext.affiliatedGroups, ({voided}) => !voided), ['groupSubject', 'firstName'], '');

```

<Image border={false} src="https://files.readme.io/ece1355-Screenshot_2020-07-02_at_6.21.43_PM.png" />

<br />

<Image border={false} src="https://files.readme.io/abb6bcf-4692c21-SkipLogic.gif" />

Please note that form element rules are not transitive and cannot depend on the result of another form element's form element rule. The rule logic for a particular element will need to cater to this.

i.e. If rule C on element C depends on value of element B and rule B depends on value of element A, updating A will only update B's value and not C's value.

<br />

<hr />

## 3. Form element group rule

* Scope = Form Element Group
* Trigger = Before display of form element group to the user (including previous or next)
* In designer = Form Element Group (RULES tab)
* When to use = Hide/show a form element group

Sometimes we want to hide the entire form element group based on some conditions. This can be done using a form element group (FEG) rule. There is a rules tab on each FEG where this type of rule can be written. Note that this rule gets executed before form element rule so if the form element is hidden by this rule then the _form element rule_ will not get executed.

### Shape of params object:

```javascript
{
  entity: {}, //it could be one of Individual, ProgramEncounter, ProgramEnrolment, Encounter and ChecklistItem depending on what type of form is this rule attached to
  formElementGroup: {}, //form element group to which this rule is attached to
  services,
  entityContext,
  user, //Current User's UserInfo object
  myUserGroups //List of Group objects
}
```

This function should return an array of  [FormElementStatus](https://github.com/avniproject/avni-models/blob/master/src/application/FormElementStatus.js)

### Example:

```
({params, imports}) => {
    const formElementGroup = params.formElementGroup;
    return formElementGroup.formElements.map(({uuid}) => {
        return new imports.rulesConfig.FormElementStatus(uuid, false, null);
    });
};
```

<br />

<hr />

## 4. Visit schedule rule

* Logical scope = Encounter (aka Visit), Subject, or Program Enrolment
* Trigger = On completion of an form wizard before final screen is displayed
* In designer = Form (RULES tab)
* When to use = For scheduling one or more encounters in the future

### Shape of params object:

```javascript
{
  entity: {}, //it could be one of ProgramEncounter, ProgramEnrolment, Encounter depending on what type of form is this rule attached to.
  visitSchedule: []// Array of already scheduled visits.
  entityContext
  services,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

You need to return an array of visit schedules from this function.

### Shape of the return value

```
[
  <visit schedule object>
  ...
]
```

### visit schedule object

```
{
	name: "visit name", 
	encounterType: "encounter type name", 
	earliestDate: <date>, 
	maxDate: <date>,
	visitCreationStrategy: "Optional. One of default|createNew",
	programEnrolment: "<Optional. Used if you want to create a visit in a different program enrolment. If the program enrolment is tied to another subject, the visit will be schedule for that subject. Do not pass this parameter if you want to schedule a general encounter.>",
	subjectUUID: "<Optional UUID string. Used if you want to create a general visit for another subject.>"
}
```

### Example

```
({ params, imports }) => {
  const programEnrolment = params.entity;
  const scheduleBuilder = new imports.rulesConfig.VisitScheduleBuilder({
    programEnrolment
  });
  scheduleBuilder
    .add({
      name: "First Birth Registration Visit",
      encounterType: "Birth Registration",
      earliestDate: programEnrolment.enrolmentDateTime,
      maxDate: programEnrolment.enrolmentDateTime
    })
    .whenItem(programEnrolment.getEncounters(true).length)
    .equals(0);
  return scheduleBuilder.getAll();
};
```

### Example 2 - Schedule a general visit on a household when a member completes a program enrolment

```
.
.
  scheduleBuilder.add({
      name: "TB Family Screening Form",
      encounterType: "TB Family Screening Form",
      earliestDate: imports.moment(programEnrolment.encounterDateTime).toDate(),
      maxDate: imports.moment(programEnrolment.encounterDateTime).add(15, 'days').toDate(),
      subjectUUID: programEnrolment.individual.groups[0].groupSubject.uuid
  });
.
.
```

<Image border={false} src="https://files.readme.io/42b7d6b-Screenshot_2020-05-19_at_7.04.19_PM.png" />

<br />

<Image border={false} src="https://files.readme.io/cbaef6a-4fff50b-encounter-scheduling-1.png" />

### Strategies that Avni uses.

For all the visit schedules that are returned, Avni evaluates how to create a visit. Assume you provide the default visitCreationStrategy (this is the default behaviour). Avni checks if there is already a scheduled visit for the given encounter type. If it is there, then it is updated with the incoming scheduled visit's name and other parameters. This strategy works well in most cases.

* Remember that the VisitSchedule rule gets called whether you create a visit, or edit it.
* Remember not to send multiple visit schedule objects for the same encounter type. If you do, the last one will overwrite the previous objects.

### Using the "createNew" visit strategy

Do this only if you know what you are doing. If you add visitCreationStrategy of "createNew", then a new visit will be created no matter what.

You need to be careful while using this strategy because, in edit scenarios, we might end up creating the same kind of visits multiple times.

### Using the VisitScheduleBuilder.getAllUniqueVisits

VisitSchedulBuilder class has a getAllUniqueVisits method that provides some shortcuts to reduce the cruft you might have to do while creating scheduled visits. It mostly does the right thing, so you don't have to worry about its logic. However, if you think it is doing something you didn't intend, then you can replace it with your own implementation. Look up the [code](https://github.com/avniproject/rules-config/blob/master/src/rules/builder/VisitScheduleBuilder.js) for more details.

<br />

<hr />

## 5. Decision rule

* Logical scope = Encounter (aka Visit), Subject, or Program Enrolment
* Trigger = On completion of an form wizard before final screen is displayed
* In designer = Form (RULES tab)
* When to use = To create any additional observations based on all the data filled by the user in the form

Used to add decisions/recommendations to the form. The decisions are displayed on the last page of the form and are also saved in the form's observations.

### Shape of params object:

```javascript
{
	entity: {}, //it could be ProgramEncounter, ProgramEnrolment or Encounter depending on what type of form is this rule attached to.
 	entityContext,
  services,
  user, //Current User's UserInfo object  
  myUserGroups, //List of Group objects  
  decisions: {
     	"enrolmentDecisions": [],
    	"encounterDecisions": [],
      "registrationDecisions": []
  } // Decisions object on which you need to add decisions. 
}
```

### Shape of decisions parameter:

```javascript
{
  "enrolmentDecisions": [],
  "encounterDecisions": [],
  "registrationDecisions": []
}
```

You need to add `<decision object>` to decisions parameter's appropriate field and return it back.  
Inside the function, you will build decisions using ComplicationsBuilder and push the decisions to the decisions parameter's appropriate field. The return value will be the modified decisions parameter. You can also choose to not use ComplicationsBuilder and directly construct the return value as per the contract shown below:

### Shape of the return value

```
{
  "enrolmentDecisions": [<decision object>, ...],
  "encounterDecisions": [<decision object>, ...],
  "registrationDecisions": [<decision object>, ...]
}
The shape of <decision object>
{
  "name": "name of the decision concept",
  "value": <text> | <number> | <date> | <datetime> | <name of anwer concepts in case of Coded question>
}
```

### Example

```
({params, imports}) => {
    const programEncounter = params.entity;
    const decisions = params.decisions;
    const complicationsBuilder = new imports.rulesConfig.complicationsBuilder({
        programEncounter: programEncounter,
        complicationsConcept: "Birth status"
    });
    complicationsBuilder
        .addComplication("Baby is over weight")
        .when.valueInEncounter("Birth Weight")
        .is.greaterThanOrEqualTo(8);
    complicationsBuilder
        .addComplication("Baby is under weight")
        .when.valueInEncounter("Birth Weight")
        .is.lessThanOrEqualTo(5);
    complicationsBuilder
        .addComplication("Baby is normal")
        .when.valueInEncounter("Birth Weight")
        .is.lessThan(8)
        .and.when.valueInEncounter("Birth Weight")
        .is.greaterThan(5);
    decisions.encounterDecisions.push(complicationsBuilder.getComplications());
    return decisions;
};
```

<Image border={false} src="https://files.readme.io/f0f898a-Screenshot_2020-05-19_at_7.09.58_PM.png" />

<br />

<Image border={false} src="https://files.readme.io/4b488cc-4fff50b-encounter-scheduling-1.png" />

<br />

<hr />

## 6. Validation rule

* Logical scope = Encounter (aka Visit), Subject, or Program Enrolment
* Trigger = On completion of an form wizard before final screen is displayed
* In designer = Form (RULES tab)
* When to use = To provide validation error(s) to the user that are not specific to one form element but involved data in multiple form elements.

Used to stop users from filling invalid data

### Shape of params object:

```
{
  entity: {}, //it could be ProgramEncounter, ProgramEnrolment or Encounter depending on what type of form is this rule attached to.
  entityContext,
  services,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

The return value of this function is an array with validation errors.

### Example:

```
({params, imports}) => {
  const validationResults = [];
  if(programEncounter.getObservationReadableValue('Parity') > programEncounter.getObservationReadableValue('Gravida')) {
    validationResults.push(imports.common.createValidationError('Para Cannot be greater than Gravida'));
  }
  return validationResults;
};
```

<Image border={false} src="https://files.readme.io/fb8e5df-Screenshot_2020-05-19_at_7.14.05_PM.png" />

<br />

<hr />

## 7. Enrolment Eligibility Check Rule

* Logical scope = Subject
* Trigger = On launch of program list when user enrols a subject into program
* In designer = Program page
* When to use = To restrict the programs which are available for enrolment based on subject's data (e.g. not allowing males to enrol in pregnancy programs)

### Shape of params object:

```
{
  entity: {}//Subject will be passed here.
  program,
  services,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

### Shape of the return value

The return value of this function should be a boolean.

### Example:

```
({params, imports}) => {
  const individual = params.entity;
  return individual.isFemale() && individual.getAgeInYears() > 5;
};
```

**Notes**: The eligibility check is triggered only when someone tries to create a visit manually. Form stitching rules can override this default behaviour.
<Image border={false} src="https://files.readme.io/bc76050-Screenshot_2020-05-20_at_3.57.52_PM.png" />

<br />

<Image border={false} src="https://files.readme.io/ba63cb1-cbe944e-Screenshot_2019-11-20_at_6.51.40_PM.png" />

<br />

<hr />

## 8. Encounter Eligibility Check Rule

* Logical scope = Subject or Program Enrolment
* Trigger = On launch of new visit (encounter) list
* In designer = Encounter page
* When to use = To restrict the encounters which are available based on subject's full data (e.g. not showing postnatal care form if the delivery form has not been filed yet)

Used to hide some visit types depending on some data. If there existed scheduled encounters for that subject or program enrolment, clicking on an ineligible visit type, will fill up the scheduled encounter.

### Shape of params object:

```javascript
{
  entity: {}//Subject will be passed here.
  services,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

### Shape of the return value

The return value of this function should be a boolean.

### Example:

```
({params, imports}) => {
  const individual = params.entity;
  const visitCount = individual.enrolments[0].encounters.filter(e => e.encounterType.uuid === 'a30afe96-cdbb-42d9-bf30-6cf4b07354d1').length;
  let visibility = true;
  if (_.isEqual(visitCount, 1)) visibility = false;
  return visibility;
};
```

**Notes**: The eligibility check is triggered only when someone tries to create a visit manually. Form stitching rules can override this default behaviour.
<Image border={false} src="https://files.readme.io/0d034b9-Screenshot_2020-05-20_at_4.02.24_PM.png" />

<br />

<hr />

## 9. Checklists rule

Used to add a checklist to an enrolment

### Shape of params object:

```javascript
{
  entity: {} //ProgramEnrolment
  checklistDetails: [] // Array of ChecklistDetail
  services,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

### Example

```
({params, imports}) => {
  let vaccination = params.checklistDetails.find(cd => cd.name === 'Vaccination');
  if (vaccination === undefined) return [];
  const vaccinationList = {
    baseDate: params.entity.individual.dateOfBirth,
    detail: {uuid: vaccination.uuid},
    items: vaccination.items.map(vi => ({
      detail: {uuid: vi.uuid}
    }))
  };
  return [vaccinationList];
};
```

<br />

<hr />

## 10. Work List Updation rule

* Logical scope = Subject, Program Enrolment, or Encounters
* Trigger = On display of system recommendation's page in form wizard
* In designer = Main Menu
* When to use = Stitch together multiple forms which can be filled back to back

<Callout icon="📖" theme="default">
  ### **Comprehensive Worklist Documentation Available**

  For detailed information about worklists, including concepts, implementation patterns, examples, and troubleshooting, see the [**Avni Worklist Documentation**](https://avni.readme.io/update/docs/worklist-configuration).
</Callout>

The System Recommendations screen of Avni can be configured to direct a user to go to the next task to be done. Typically, if a new encounter is scheduled for a person on the same day, then the system automatically prompts the user to perform that encounter.

This is performed using **worklists** - a powerful feature that enables sequential form workflows by automatically chaining multiple forms together. A worklist is an array of [work items](https://github.com/avniproject/avni-models/blob/master/src/application/WorkItem.js) that represent individual forms/tasks in the sequence.

The **WorkListUpdation rule** is used to customize this flow. The WorkLists object is passed to this rule just before showing the System Recommendations screen. Any modification in the worklists is applied immediately to the flow.

### Quick Reference

For a complete understanding of worklists, including:

* **What are worklists and when to use them**
* **Detailed WorkItem types and parameters**
* **Real-world implementation examples**
* **Advanced patterns and best practices**
* **Limitations and troubleshooting**

Please refer to the [**comprehensive worklist guide**](https://avni.readme.io/update/docs/worklist-configuration).

### Shape of params object:

```javascript
{
  workLists: {}, // WorkLists object containing current worklist
  context: {},   // Form completion context with entity information
  services,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

### Basic Example

```javascript
({params, imports}) => {
    const workLists = params.workLists;
    const context = params.context;
    const WorkItem = imports.models.WorkItem;
    
    // Add health survey after individual registration
    if (context.entity && context.entity.individual) {
        const healthSurvey = new WorkItem(
            imports.common.randomUUID(), 
            WorkItem.type.ENCOUNTER,
            {
                encounterType: 'Health Survey',
                subjectUUID: context.entity.individual.uuid
            }
        );
        
        // Insert before the last item
        const totalItems = workLists.currentWorkList.workItems.length;
        workLists.currentWorkList.workItems.splice(totalItems - 1, 0, healthSurvey);
    }
    
    return workLists;
}
```

### Additional Resources

* [External example gist](https://gist.github.com/hithacker/d0fe89107b974797fbb11ced1feda146)
* [**Complete worklist documentation with advanced examples**](https://avni.readme.io/update/docs/worklist-configuration)

<Image border={false} src="https://files.readme.io/ef3535d-Screenshot_2020-05-21_at_3.25.33_PM.png" />

<br />

<hr />

## 11. Subject summary rule

* Logical scope = Subject registration
* Trigger = Before the opening of the subject dashboard profile tab.
* In designer = Subject (Subject Summary Rule)
* When to use = Display important information in the subject's profile. It can be used to show the summary if there are no programs.

This rule is very similar to the Enrolment summary rule. Except its scope is the Subject's registration.

### Shape of params object:

```
{ 
  individual: {}, // Subject model,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

You need to return an array of summary objects from this function.

### Shape of the summary object:

```
{
  "name": "name of the summary concept",
  "value": <text> | <number> | <date> | <datetime> | <concept list in case of Coded question>
}
```

### Example:

```
({params, imports}) =>  {
    const summaries = [];
    const individual = params.individual;
    const mobileNumber = individual.findObservation('Mobile Number'); 
    if(mobileNumber) {
      summaries.push({name: 'Mobile Number', value: mobileNumber.getValueWrapper()});
    }
    return summaries;
};
```

<br />

<hr />

## 12. Hyperlink menu item rule

* Logical scope = User
* Trigger = When More navigation is opened in the mobile app
* In designer = Coming very soon...
* When to use = When a dynamic link has to be provided to the user (these links cannot be specific to subjects)

### Shape of params object:

```
{
  user: {}, // User
  moment: {}, // moment. note other parameters are not supported yet,
  token, //Auth-token of the logged-in user
  myUserGroups //List of Group objects  
}
```

User: [https://github.com/avniproject/avni-models/blob/master/src/UserInfo.js](https://github.com/avniproject/avni-models/blob/master/src/UserInfo.js)

You need to return a string that is the full URL that can be opened in a browser.

### Example:

```
({params}) => {return `https://reporting.avniproject.org/public/question/11265388-5909-438e-9d9a-6faaa0c5863f?username=${encodeURIComponent(user.username)}&name=${encodeURIComponent(user.name)}&month=${imports.moment().month() + 1}&year=${imports.moment().year()}`;}
```

<br />

<hr />

## 13. Message rule

* When to use =  To configure sending Glific messages
* Logical scope = User, Subject, General and Program Encounter, Program Enrolment
* Trigger =
  * For User : Only on creation of an User .
  * For Subject, General and Program Encounter, Program Enrolment : On every save (create / update)
* In designer = "User Messaging Config", "Subject Type" , "Encounter type" and "Programs" page

Message Rule can be configured only when 'Messaging' is enabled for the organisation. Its configuration constitutes specifying following details:

* **Name** identifier name for the Message Rule
* **Template** Used to indicate the Skeleton of the message with placeholders for parameters
* **Receiver Type** Used to indicate the target audience for the Glific Whatsap message
* **Schedule** date and time configuration should return the time to send the message.
* **Message** content configuration should return the parameters to be filled in the Glific message template selected under 'Select Template' dropdown.

Any number of message Rules can be configured.

### Example configuration:

Say, 'common_otp' Glific message template is 'Your OTP for `{{1}}` is `{{2}}`. This is valid for `{{3}}`.' If we want to send a OTP message that says 'Your OTP for receiving books is 1458. This is valid for 2 hours.' to a student after 1 day of their registration, then we need to configure for student subject type as shown in the below image (Note the shape of the return objects):
<Image border={false} src="https://files.readme.io/2e3e442-Screenshot_2023-12-27_at_6.15.54_PM.png" />

```Text Schedule
'use strict';  
({params, imports}) => ({  
  scheduledDateTime: new Date("2023-01-05T10:10:00.000+05:30")  
});
```
```text Message
'use strict';  
({params, imports}) => {  
  const individual = params.entity;  
  return {  
    parameters: ['Verify user phone number', '0123', '1 day']  
  }  
};
```

### Shape of params object:

```
{
  entity: {}, //it could be one of User, Individual, General Encounter, ProgramEncounter or Program Enrolment depending on the type of form this rule is attached to
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
}
```

## 14. Dashboard Card Rule

The shape of dashboard card rule

```javascript
{
  db: "the realm db instance",
  user,
  myUserGroups,
  // ruleInput object can be null
  ruleInput: {
    type: "string. see 14.1 below",
    dataType: "values can be Default or Range",
    subjectType: "SubjectType model object. The subject type of the subjects to query and display to the user",
    groupSubjectTypeFilter: {
      subjectType: "SubjectType. The group subject type to filter by"
    },
    observationBasedFilter: {
      scope: "string. See 14.2 below",
      concept: "Concept. the observation value being referred to by the filter value",
      programs: {
         "UUID of the program": "Program model object"
      },
      encounterTypes: {
         "UUID of the encounter type": "Encounter Type model object"
      }
    },
    // filterValue can be null or empty array when there are no filters chosen by the user
    filterValue: "value chosen by the user. the type of data depends on the type of the filter"
  }
}
```

### Filter Value Shapes

**Address Filter**

```json
{
  "uuid":"924674dc-d32b-4276-b7b5-fb782f5511f2",
  "name":"Kerala",
  "level":4,
  "type":"State",
  "parentUuid":null,
}
```

<br />

14.1) [https://github.com/avniproject/avni-models/blob/8613b53edbf88e9b19150eda9e13da573e2a59ba/src/CustomFilter.js#L2](https://github.com/avniproject/avni-models/blob/8613b53edbf88e9b19150eda9e13da573e2a59ba/src/CustomFilter.js#L2)

14.2) [https://github.com/avniproject/avni-models/blob/8613b53edbf88e9b19150eda9e13da573e2a59ba/src/CustomFilter.js#L30](https://github.com/avniproject/avni-models/blob/8613b53edbf88e9b19150eda9e13da573e2a59ba/src/CustomFilter.js#L30)

<br />

<hr />

### 15. Manual Programs Eligibility Check Rule

This rule is used when the user fills a form based on which the eligibility of given program is determined by this rule.

#### Shape of Input Object

```javascript
params: {
  entity: typeof SubjectProgramEligibility,
  subject: typeof Individual,
  program: typeof Program,
  services,
  user, //Current User's UserInfo object  
  myUserGroups //List of Group objects  
},
imports: {}
```

#### Return

_boolean_

### 16. Member Addition Eligibility Check Rule

This rule is used to determine whether an **existing** member can be added to a group or household. The rule is configured at the subject type level and is executed when a user attempts to add an existing member to a group/household.

* Logical scope = Group/Household and Individual
* Trigger = On attempt to add a member to a group/household
* In designer = Subject Type (Member Addition Eligibility Check Rule)
* When to use = To validate if an **existing** individual can be added as a member to a specific group/household based on custom business rules

#### Shape of Input Object

```javascript
params: {
  member: typeof Individual, // The individual being added as a member
  group: typeof Individual, // The group/household to which the member is being added
  context: Object, // The execution context
  services,
  user, // Current User's UserInfo object  
  myUserGroups // List of Group objects  
},
imports: {}
```

#### Return

This rule should return an object that follows the ActionEligibilityResponse format, with the following structure:

```javascript
// For allowing addition
{
  eligible: {
    value: true
  }
}

// For disallowing addition with a reason
{
  eligible: {
    value: false,
    message: "Reason why the member cannot be added" //Value of message has translation support.
  }
}
```

#### Example

**Use Case:**

While adding members to a "Self-help" group, we need to validate that the person is an adult, in-which case we would come up with the following

**Member Addition Eligibility Check Rule:**

```javascript
"use strict";
({params, imports}) => {
  const member = params.member;
  const group = params.group;
  
  // Example: Only allow adding members who are above 18 years of age
  const age = member.getAgeInYears();//As on current date
  
  if (age < 18) {
    return {
      eligible: {
        value: false,
        message: "Only individuals above 18 years can be added to this group"
      }
    };
  }
  
  return {
    eligible: {
      value: true
    }
  };
};
```

**Reference Screenshot, when Member Addition Eligibility Check Rule fails:**
<Image border={false} src="https://files.readme.io/aaa48f09aa4c5bcaebf2d9ae72f19c0777e719bd463b213b43e011796fd8db0a-Screenshot_2025-06-27_at_7.41.28_PM.png" />

#### Error Handling

When a Member Addition Eligibility Check rule fails (throws an exception), the error is logged and stored in the RuleFailureTelemetry with the following information:

* source_type: 'MemberAdditionEligibilityCheck'
* source_id: UUID of the subject type
* entity_type: 'Individual'
* entity_id: UUID of the group/household to which a member is being added
* individual_uuid: UUID of the individual being added to the group/household

### 17. Edit Form Rule

This rule is used when the user tries to edit a form. If non-boolean value is returned in the value, or the rule fails, then it would be treated as true and edit will be allowed. To check the places where it is available, not available, & not applicable - [https://avni.readme.io/docs/rules-concept-guide#edit-form-rule](https://avni.readme.io/docs/rules-concept-guide#edit-form-rule).Value of message has translation support.

#### Sample Rule

```
"use strict";
({params, imports}) => {
    const {entity, form, services, entityContext, myUserGroups, userInfo} = params;

    const output = {
      eligible : {
        value: false, //return false to disallow, true to allow;
        message: 'Edit access denied: <Specify reason here>.' //optional
      } 
    }; 

    return output;
};
```

#### Shape of Input Object

```javascript
params: {entity, services, form, myUserGroups,user},
imports: {}
```

#### Shape of return object

```javascript
// Previous format (still supported)
const output = {
  editable : {
    value: true/false,
    messageKey: 'foo'
  }
};

// New format (generic for all rule based access control)
const output = {
  eligible : {
    value: true/false,
    message: 'foo'
  }
};
```

### 18. Global reusable code rule (Alpha)

This rule is intended maintaining reusable JavaScript functions across implementations. While this could also be used within implementation only but that is not the purpose of this. If you want to create reusable JavaScript code within an implementation only, please check with the product management team to get it prioritised.

> 📘 Not supported in Data entry app. Feature available from 11.0 version.

#### Shape of Input Object

```javascript
// Get handle to the reusable function
const globalFunction = imports.globalFn;
// invoke your function, two examples below.
globalFn().hello();
globalFn().sum(1,2);
```

Note that you can define the signature of your new function (like hello, sum). It is not determined by the global function.

#### How to deploy global function (TBD)

1. Use `make deploy-global-rule`.
   1. Provide the origin and token
   2. The token will determine the organisation to which it is deployed. Rerunning it will update the previous rule.
2. Run sync in the mobile app

## Accessing Address Level Properties :

Old Way is to get the address level properties and extract from the json object. In new way, get the address level and access its observation value as per location attribute form.

```Text JavaScript
'use strict';
({params, imports}) => {
  const programEncounter = params.entity;
  const moment = imports.moment;
  const formElement = params.formElement;
  const _ = imports.lodash;
  let visibility = false;
  let value = 'No';
  let answersToSkip = [];
  let validationErrors = [];
  
  const address_level = programEncounter.programEnrolment.individual.lowestAddressLevel;  
  
  const gHighRisk = address_level.getObservationReadableValue("Geographically hard to reach village");

  if(gHighRisk === "Yes"){
      value = 'Yes';
  }

  
  return new imports.rulesConfig.FormElementStatus(formElement.uuid, visibility, value, answersToSkip, validationErrors);
};
```

<br />

## Handling rule-evaluation across Mobile and Web Applications

This section provides guidelines for handling rule-evaluation across Mobile and Web Applications in Avni implementations. It includes practical examples from the Goonj implementation.

### Detecting Web Application Context

To determine if the application is running in a web context, you can check the `titleLineage` property of the lowest address level:

```javascript
const webapp = individual.lowestAddressLevel.titleLineage;
```

This pattern is used to identify if the application is running in a web context and adjust behavior accordingly.

### Handling Webapp-Specific Scenarios

When working with web applications, consider the following:

* Some validations might need to be bypassed in web context
* UI/UX might need adjustments for web vs mobile
* Performance considerations might differ between platforms

#### Basic Pattern

```javascript
function handleWebappContext(individual) {
    const webapp = individual.lowestAddressLevel.titleLineage;
    
    // Apply webapp-specific logic
    if (webapp) {
        // Webapp-specific code here
    } else {
        // Mobile-specific code here
    }
}

try {
    handleWebappContext(individual);
} catch (error) {
    console.error('Error handling webapp context:', error);
}
```

#### Examples

In the Goonj implementation, we encountered an issue where certain validations were failing in the web context but were not applicable to web users.

##### 1. Webapp Detection and Validation Bypass

```javascript
function validateForm(individual, formData) {
    const webapp = individual.lowestAddressLevel.titleLineage;
    const errors = [];
    
    // Skip webapp-specific validations for web users
    if (!webapp) {
        // Mobile-only validations go here
        if (!formData.requiredField) {
            errors.push('This field is required for mobile users');
        }
    }
    
    // Common validations for both web and mobile
    if (!formData.commonField) {
        errors.push('This field is required for all users');
    }
    
    return errors.length ? errors : null;
}
```

##### 2. Location Validation Example

```javascript
function validateLocation(individual, locationData) {
    const webapp = individual.lowestAddressLevel.titleLineage;
    
    // Skip location validation for webapp
    if (webapp) {
        return null;
    }
    
    // Mobile location validation logic
    if (!locationData || !locationData.coordinates) {
        return ['Location is required for mobile users'];
    }
    
    return null;
}
```

<br />

## Accessing audit fields when writing rules

#### When writing rules, you often need to access information about who created or modified entities, and when these actions occurred. Avni provides several audit fields that can be accessed through the entity object in your rules.

Available Audit Fields

The following audit fields are available :

* createdByUUID
* lastModifiedByUUID
* createdBy
* lastModifiedBy
* filledBy (only for program and general encounters)
* filledByUUID (only for program and general encounters)

```coffeescript JS
//SAMPLE EDIT FORM RULE
  "use strict";
({params, imports}) => {
const {entity} = params;
console.log("params.entity.createdByUUID:", params.entity.createdByUUID);
console.log("params.entity.lastModifiedByUUID:", params.entity.lastModifiedByUUID);

console.log("params.entity.createdBy:", params.entity.createdBy);
console.log("params.entity.lastModifiedBy:", params.entity.lastModifiedBy);

console.log("params.entity.filledBy:", params.entity.filledBy);
console.log("params.entity.filledByUUID:", params.entity.filledByUUID);

return output;
};
```

<br />

## Using params.db object when writing rules

In many of the rules params db object is available to query the offline database directly. The db object is an instance of type [Realm](https://www.mongodb.com/docs/realm-sdks/js/latest/classes/Realm-1.html) on which [objects](https://www.mongodb.com/docs/realm-sdks/js/latest/classes/Realm-1.html#objects) is first method that will get called. This returns [Realm Results](https://www.mongodb.com/docs/realm-sdks/js/latest/classes/Results.html) instance, on which one may further call the [filtered](https://www.mongodb.com/docs/realm-sdks/js/latest/classes/Results.html#filtered) method one or more times each time returning realm results. Realm result a list with each item being of type (model object's schema name) originally passed in objects method.

```coffeescript JS
'use strict';
({params, imports}) => {
  //...
  
  const db = params.db;
  const farmers = db.objects("Individual").filtered(`voided = false AND subjectType.uuid = "73271784-512d-4435-8dc8-0f102b99d682"`);
  console.log('Found farmers with count', farmers && farmers.length > 0 && farmers.length);

  //...
  return new imports.rulesConfig.FormElementStatus(formElement.uuid, visibility, value, answersToSkip, validationErrors);
};
```

<br />

**Realm Query Language Reference** - [https://www.mongodb.com/docs/realm/realm-query-language](https://www.mongodb.com/docs/realm/realm-query-language)

### Difference between filter and filtered

`filtered` method is like running SQL query executed closer or in the database process and hence it orders of magnitude faster than `filter` - which is JavaScript method ran by constructing model object for each item is JS memory and then passing it through the filter function. As much as possible filtered should be used for best performance and user experience.

### Example of filtered

```javascript
({params}) => {
  const db = {params};
  return db.objects("Individual").filtered(`voided = true AND subjectType.name = "Foo"`);
}
```

## Using service methods in the rules

Often, there is the need to get the context of implementation beyond what the models themselves provide. For example, knowing other subjects in the location might be necessary to run a specific rule. For such scenarios, Avni provides querying the DB using the services passed to the rules.

The services object looks like this

```javascript
{
    individualService: '',
}
```

Right now only individual service is injected into all the rules. One method which is implemented right now returns an array of subjects in a particular location. The method looks like the following, it takes address-level object and subject type name as its parameters and returns a list of all the subjects in that location.

```javascript
getSubjectsInLocation(addressLevel, subjectTypeName) {
  const allSubjects = ....;
  return allSubjects;
}
```

Note that this function is not implemented for the data entry app and throws a "method not supported" error for all the rules when run from the data entry app.

### Service methods available are:

* [https://github.com/avniproject/avni-client/blob/master/packages/openchs-android/src/service/facade/IndividualServiceFacade.js](https://github.com/avniproject/avni-client/blob/master/packages/openchs-android/src/service/facade/IndividualServiceFacade.js)
* [https://github.com/avniproject/avni-client/blob/master/packages/openchs-android/src/service/facade/AddressLevelServiceFacade.js](https://github.com/avniproject/avni-client/blob/master/packages/openchs-android/src/service/facade/AddressLevelServiceFacade.js)

### Examples

The view-filter rule is for the subject data type concept that displays all the subjects of type 'Person' in the passed location.

```
'use strict';
({params, imports}) => {
  const encounter = params.entity;
  const formElement = params.formElement;
  const statusBuilder = new imports.rulesConfig.FormElementStatusBuilder({encounter, formElement});
  const individualService = params.services.individualService;
  const subjects = individualService.getSubjectsInLocation(encounter.individual.lowestAddressLevel, 'Person');
  const uuids = _.map(subjects, ({uuid}) => uuid);
  statusBuilder.showAnswers(...uuids);
  return statusBuilder.build();
};
```

<br />

#### Fetch Subjects by Subject Type with Custom Filtering

For business reasons, you may need to fetch subjects of a specific type with additional filtering criteria.

##### Using IndividualServiceFacade "getSubjects" method

Use IndividualServiceFacade`getSubjects(subjectTypeName, realmFilter)` method to get subjects by type with optional filtering.

##### Method Signature

* subjectTypeName (string): The name of the subject type (e.g., 'Volunteer', 'Patient', 'Household')
* realmFilter (string, optional): Realm query filter string for additional filtering

```js

  const individualService = params.services.individualService;
  const volunteers = individualService.getSubjects('Volunteer');
  console.log('volunteers:', volunteers.length);

  const subjectsWithObservation = individualService.getSubjects(
    'Patient',
    'SUBQUERY(observations, $obs, $obs.concept.uuid == "concept-uuid-here").@count > 0'
  );
  console.log('Patients with specific observation:', subjectsWithObservation.length);

  
```

## Using other group/household individuals' information in the rules

Say, an individual belongs to a group A. Sometimes, there is a need to use data of other individuals in the group A.  For example, to auto-populate caste information in an individual's registration form (say, when navigated to individual's registration form when tried to add a member to group/household A), we might need to know the caste information of other individuals in that group/household. For such scenarios, Avni provides a way to access `group` object from `params.entityContext`.

### Example

The below rule is for the case when an individual's concept named `Caste` needs to be auto-populated based on other member's data in the same group.

```
'use strict';
({params, imports}) => {
  const individual = params.entity;
  const moment = imports.moment;
  const formElement = params.formElement;
  const _ = imports.lodash;
  let visibility = true;
  let value = null;
  let answersToSkip = [];
  let validationErrors = [];
  
  const groupSubject = params.entityContext.group;
  if(groupSubject.groupSubjects.length > 0) {
     const ind = params.entityContext.group.groupSubjects[0].memberSubject;
     const caste = ind.getObservationReadableValue('Caste');
     value = caste; 
  }
  
  return new imports.rulesConfig.FormElementStatus(formElement.uuid, visibility, value, answersToSkip, validationErrors);
};
```

## Handling special scenarios while updating value using FormElementStatus rule

### How to reset value using FormElement Rule logic

When the FormElementStatus value is set to null, by default it is treated as a No-action operation and hence we do not reset the value of the concept.

But instead, if we are trying to say that "I am not setting the value", and any previous value has to be reset, then we need to specify the resetValueIfNull argument to be **true** in the FormElementStatus constructor, used to generate response during the rule execution.

```
'use strict';
({params, imports}) => {

//Rule content
  
//FormElementStatus Constructor signature
return new imports.rulesConfig.FormElementStatus(formElementUUID, visibility, value, answersToSkip = [], validationErrors = [], answersToShow = [], resetValueIfNull = false);
}
```

<br />

### Handle set of Select Coded Concepts Outside Question Group

In-order to init a modifiable Select Coded Concept FormElement's Value in a form, you can specify the AnswerConcept **Name** as the value, which should be enough to set the initial value as expected.

### Handle set of Read-Only Select Coded Concepts Within QuestionGroup

There were 2 issues that were preventing implementation team from reliably setting a **Read-only** SingleSelectCodeConcept's value via FormElement Rules:

1. Selection of a AnswerConcept
2. Stablizing the selected value over multiple execution of FormElement rule due to changes elsewhere in the FormElementGroup

#### Recommended solution

To resolve these issues, we only needed to make following adjustments in the FormElement Rule:

1. Selection of a AnswerConcept => Make use of AnswerConcept's UUID instead of name as value
2. Stablizing the selected value  =>
   > * Mark the SelectedCodedConcept value as ReadOnly
   > * For Multi-select: Return a FormElementStatus object with only the difference between previous valueArray and new valueArray. If no change in value, then return empty array.
   > * For Single-select: Return a FormElementStatus object with selected value, only if previousValue was null. If not, return null.

This would toggle the answers as expected and result in only the expected value(s) being shown as selected.

#### Example Rule for SingleSelect FormElement set via Rule

```javascript
'use strict';
({params, imports}) => {
  const individual = params.entity;
  const moment = imports.moment;
  const formElement = params.formElement;
  const _ = imports.lodash;
  let visibility = true;
  let value = null;
  let answersToSkip = [];
  let validationErrors = [];
    
    const condition11 = triue; //some visibility condition
    visibility = condition11;
     
    if (condition11) {
       //some business logic
          if(someCondition) {
             value = "conceptUUID1";
          }
          else{
             value = "conceptUUID2";
          }
       }
    }
    let que = individual.findGroupedObservation('bafb80ac-6088-4649-8ed3-0501e1296c6e')[params.questionGroupIndex];
    if(que){
      let obs = que.findObservationByConceptUUID('ef952d55-f879-4c34-99e2-722c680ed2e2');
      if(obs && obs.getValue() === value) {//i.e obs.getValue() are both same answerConcept
         return null;//Old value is retained
       }   
    }
    else {
       return new imports.rulesConfig.FormElementStatus(formElement.uuid, visibility, value, answersToSkip, validationErrors); //new value is updated
    }
};
```

### Handle Uniqueness validation for Read-Only Text field

As the value for the ReadOnly TextFormElement is set via Rule of some sort, the validation for enforcing uniqueness too has to be done during the same rule execution.

#### Example FE rule for enforcing Uniqueness validation on Read-only Text field

```Text Javascript
'use strict';
({params, imports}) => {
    const individual = params.entity;
    const moment = imports.moment;
    const _ = imports.lodash;
    const formElement = params.formElement;
    let visibility = true;
    let value = null;
    let validationErrors = [];
    let nameNotUnique = false;
    
    
   //Business logic to set value
   value = '[dummy3]as';


    //Execute some business logic to update nameNotUnique 
    nameNotUnique = (value === '[dummy3]as');
    
    if(nameNotUnique) {
       validationErrors.push('Another Work Order has same value');
    }
   
    return new imports.rulesConfig.FormElementStatus(formElement.uuid, visibility, value, null, validationErrors);
};

```

<br />

### Handle Fetch of Individuals with specific Phone Numbers for duplicates validation

For business reasons, we might need to verify that there are **No / Limited number of** duplicate Subjects with the same Phone Number. To do this, we have 2 possible approaches:

#### 1. Use IndividualServiceFacade "findAllSubjectsWithMobileNumberForType" helper method

Use IndividualServiceFacade.findAllSubjectsWithMobileNumberForType(mobileNumber, subjectTypeUUID) method to get subjects with same phone number.

**Requires the PhoneNumber concept to have, KeyValue (primary_contact : yes) or (contact_number : yes)**
<Image border={false} src="https://files.readme.io/f48da098be8218e797e7dd841e023036199eb0b7aa696ece422a6974e0b3f56f-421821795-e7b7766d-3865-4a66-a66e-93f4ddc8b13d.png" />

```js

  const individualService = params.services.individualService;
  const subjects = individualService.findAllSubjectsWithMobileNumberForType('<phone_number>', "<subject_type_uuid>");
  console.log('found subjects with number', subjects && subjects.length > 0);
  
```

#### 2. [Using params.db object to find duplicates with custom filter logic](/docs/writing-rules#using-paramsdb-object-when-writing-rules)

## Types of rules and their support/availability in Data Entry App

| Not supported                          | Supported via rules-server       | Supported in browser     |
| :------------------------------------- | :------------------------------- | :----------------------- |
| Global reusable function               | Enrolment eligibility check rule | Form Element Rule        |
| Dashboard Card rule (NA)               | Encounter eligibility check rule | Form Element GroupRule   |
| Checklists rule                        | Visit schedule rule              | Enrolment Summary Rule   |
| Work list updation rule                | Message rule                     | Hyperlink menu item rule |
| Hyperlink menu item rule               | Decision rule                    |                          |
| Validation rule                        |                                  |                          |
| Edit Form rule                         |                                  |                          |
| Member addition eligibility check rule |                                  |                          |

## Types of rules and their support/availability in transaction data upload

| Not supported | Supported via rules-server | Not Applicable                   |
| :------------ | :------------------------- | :------------------------------- |
| Message rule  | Visit schedule rule        | Hyperlink menu item rule         |
|               | Decision rule              | Enrolment Summary Rule           |
|               | Validation rule            | Form Element GroupRule           |
|               |                            | Form Element Rule                |
|               |                            | Encounter eligibility check rule |
|               |                            | Enrolment eligibility check rule |
|               |                            | Hyperlink menu item rule         |
|               |                            | Work list updation rule          |
|               |                            | Checklists rule                  |
|               |                            | Dashboard Card rule              |
### Setting Up Your Data Model

As explained in [Implementer's concept guide - Introduction](doc:implementers-concept-guide-introduction) - subject, program and encounter are the three key building blocks you have - using which you can model almost all field-based work. Groups (households) that are a special type of subject will be treated as the fourth building block.

In the web application, you would see three menus which map to above - subject types, programs and encounter types. You must be assigned an organisation admin role to be able to do this. If you are, then you can see these options under the Admin section. Each one of the following is linked to their respective forms which you can navigate from the user interface.

![](https://files.readme.io/f4090d7-Screenshot_2020-04-28_at_11.30.58_AM.png "Screenshot 2020-04-28 at 11.30.58 AM.png")

When setting up your model you will be defining the concepts and forms. The diagram below explains the relationship between entities above, form and concepts. Currently, in the application, you may need to go to the concept's view to edit it fully. Soon we would provide seamless editability of the underlying concept via form editing.

![](https://files.readme.io/f678cdd-Screenshot_2020-04-28_at_6.44.23_PM.png "Screenshot 2020-04-28 at 6.44.23 PM.png")

An example form below of name "Child Enrolment", with one form element group called "Child Enrolment Basic Details". This form element group has 6 form elements.

![](https://files.readme.io/eb3a4bf-Screenshot_2020-04-28_at_7.13.21_PM.png "Screenshot 2020-04-28 at 7.13.21 PM.png")

One of the form element is displayed below with all the details. The concept used by the form element is also displayed like allow data range values. From this screen, as of now, it is not editable you need to go to the concepts tab to edit it.

![](https://files.readme.io/f968766-Screenshot_2020-04-28_at_7.17.04_PM.png "Screenshot 2020-04-28 at 7.17.04 PM.png")

You can specify the skip logic for under the rule tab within the form element. This currently is done only using JavaScript, but in future, one would be able to do it using the UI directly. For more on rules please see the [Writing rules](doc:writing-rules).

![](https://files.readme.io/661ab7b-Screenshot_2020-05-19_at_4.49.43_PM.png "Screenshot 2020-05-19 at 4.49.43 PM.png")
### Sync Strategies

Sync strategies define the way a subject should sync to the user's device. Sync strategies can be defined for each subject type. Each subject type can have different/same sync strategies based on the use case.\
Setting up a sync strategy is a two-step process.

* Defining sync strategy for a subject type.
* Assigning the value of the defined strategy to the user.

## Defining sync strategy for a subject type

For defining sync strategy edit the subject type and under the advance settings configure the sync settings. Below are the different sync strategies available.

| Sync strategy               | Description                                                                                                                                                     |
| :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sync by location            | This is the default strategy and the subject is synced by their registered location.                                                                            |
| Sync by direct assignment   | When this is enabled only subjects assigned to the user will get synced to the user's device.                                                                   |
| Sync registration concept 1 | Any mandatory form element's concept from the registration form can be selected. Subjects get synced based on the values assigned to the user for this concept. |
| Sync registration concept 2 | Similar to `Sync registration concept 1`, this is to support once more concept for the same subject type.                                                       |

![](https://files.readme.io/ad013a1-sync-settings.png "sync-settings.png")

## Assigning the value of the defined strategy to the user

Once the sync strategy is defined for a subject type, values can be assigned to the user so that only those values get synced to the user's device. This can be done by editing an existing user or while creating a new user.

| Sync strategy               | Supported values                   |
| :-------------------------- | :--------------------------------- |
| Sync by location            | Catchment                          |
| Sync by direct assignment   | Already registered subjects        |
| Sync registration concept 1 | Concept values (Code/Text/Numeric) |
| Sync registration concept 2 | Concept values (Code/Text/Numeric) |

![](https://files.readme.io/f215814-Sync_settings.png "Sync settings.png")

**Note** 

* In case of any catchment changes/direct assignment changes user needs to delete the old data and sync as per the newly assigned values.

## Handling on Data Entry App (DEA)

Starting August 2024 ([v9.3.0](https://github.com/avniproject/avni-product/releases/tag/v9.3.0)), sync strategy is also respected for updates made via DEA. DEA users will be able to search for and view all data but will be restricted from creating new / updating existing entities that do not match their sync settings.

If the update the DEA user is making involves changing the value of the attribute controlling sync, the user will be blocked from doing so unless the sync setting allows the user access to both the original value as well as the changed value. i.e. if the DEA user is updating the address of a subject from 'Delhi' to 'Mumbai', the catchment for the DEA user needs to contain both 'Delhi' and 'Mumbai' 

### Override to ignore sync registration concepts

A user-level setting is available to ignore the user's sync registration concept settings for updates made via DEA. Location and Assignment strategies will continue to be respected. In the Avni admin app, navigate to Users -> Search for / Select the user to be modified -> Edit -> Toggle the setting 'Ignore below listed sync settings in the Data Entry app'

![](https://files.readme.io/2f475037479d5e87ded6067331bc01566e0a94bac10d7e896d6725043ea1e44f-image.png)
### Sync

## Sync data between Avni Client and Server

Sync between Avni Client and Server is initiated by the Client and could be of following types:

### Manual Sync(User triggered, upload and fetch data)

> 📘
>
> As part of manual sync, we'll first replace the "background-sync" job with a "dummy sync" job, perform manual-sync and then, replace the "dummy sync" job again with "background-sync" job.\
> In react-native-background-worker, when we schedule a job with same jobKey(Name) as an existing job, it replaces the old one with new one. Therefore, above specified steps are supposed to fulfill our need to NOT run background-sync in parallel with manual-sync.\
> This is done, as we do not have a way to cancel jobs by name directly in react-native-background-worker. We could only cancel by id, but we do not want to store job id in db.\
> ![](https://files.readme.io/2dcc00c-ManualAndDummySync.png)

### Automatic Sync

1. Complete Sync (Both upload and fetch data)
2. Partial Sync (Only upload of data)\
   ![](https://files.readme.io/d567681-Screenshot_2023-10-30_at_12.08.26_PM.png)
### Internal Details Of Avni Sync

Synchronization (sync) of data from the Avni server to the client is a complex procedure. This document tries to explain it in detail. 

Note that this is an advanced topic that can be skipped for those who are not very familiar with Avni. 

### The primary assumptions related to data collection in Avni

A single User effects a change in data stored on the server for a particular Individual at any given point of time. After this all clients subscribing to that Individual's data are supposed to fetch the latest information from the server and only then perform any other actions related to that Individual. This is implemented through means of providing Idempotent POST Apis for all major entity types in Avni.

This is done, so that, there are no concurrent conflicting changes applied for the same Individual by different users, which would results in indeterminate state for the Individual's data.

### The different objectives of sync

During sync, the primary objective is to push all local changes to the server, and fetch all changes from the server to the device. However, there are a few other side-effects that take place during the sync. 

* #### Handling of change of permissions

When there is a change in the permissions of a user, new entities may need to be synced, or existing entities may need to be deleted from the device. This is handled on the fly during the sync. 

* #### Migration of beneficiaries

Sometimes beneficiaries are migrated from one catchment to another. To handle this, we might either have to retrieve all records of a beneficiary that moved in, or remove all records of a beneficiary that moved out. This is handled through a subject\_migration sync mechanism

**It is highly recommended that any correction to an Individual or its related entities "SyncConcept observations" be made using Individual (POST/PUT/PATCH) External API calls**, so that we perform a holistic update of the Individual and all its related entities( Enrolments, Encounters, Program-encounters, Checklists, EntityApprovalStatus, IndividualRelationships, etc..). We would also be creating the SubjectMigration entities, which are essential in removing the beneficiary records from Users who should no longer have the entity.

* #### Reset of sync

If the catchment of a beneficiary changes (either via change of a user's catchment, or a change in the catchment itself), the existing database becomes invalid and needs a complete resync to ensure the right beneficiaries are present. This is called a sync reset. 

There are partial resets that happen due to change of sync attributes of a particular subject type. This is also handled through smaller sync resets. 

* #### Fast sync

When a user is syncing for the first time, some implementations create an existing Realm database for that catchment that has been synced upto a certain point. The app downloads this pre-created database and syncs everything since that point. This is useful when there are multiple users sharing a catchment, or when a user wants to login from another device. 

### Sync specific data storage

Each app maintains its status of sync through three tables - EntityQueue (for push), EntitySyncStatus (for pull) and SyncTelemetry (for telemetry). 

* #### EntityQueue

There are actually 2 tables that are maintained in Avni for entities that have been either created or changed. These are 

* EntityQueue
* MediaQueue

Before syncing media, observations are stored with the name of the media file. During sync, it is assumed that internet is present. 

During this time, the sync service does the following

1. For each of the media queue items:
   1. It pushes the media to S3 and
   2. On Success, replaces the corresponding observation with the S3 url
   3. Otherwise, for failures, it creates a "Media '$\{Entity}' Error" entry in the EntitySyncStatus, to highlight issues during upload of Media content. These entries get cleaned up only when those exact Media content get synced successfully to the server. If in-case the media gets deleted from the device or did not exist even before the first sync attempt, then those "Media '$\{Entity}' Error" entries remain as is till User does a fresh sync 
2. Only if all Media are uploaded successfully, do the modified Avni entities (with observations having the S3 url) get pushed to the server

At the end of sync, a sync telemetry entries are pushed to the server. 

* #### EntitySyncStatus

The EntitySyncStatus table keeps a pointer of each kind of entity to be synced and the last time it was synced. This helps the sync process to start from where it left off last time. Rows will contain the entity type (Subject, Encounter etc), the specific entity type (Individual, Household, ANC etc. essentially the subject type, program or encounter type) and the last sync time. 

The server api provides a paginated service to pull from the last sync time. The table is updated on each page synced. 

* #### EntityMetadata

This is maintained in code, and provides the following for each kind of entity

* Name of the entity
* url to fetch the entity from the server
* Type of entity - entity can be divided into metadata and transactional data
* Order of sync - The sync is dependent on a specific order. Subjects need to be synced before program encounters etc. 

Sync uses EntityMetadata in conjunction with EntitySyncStatus (for pull) or EntityQueue (for push) to identify the exact order in which entities need to be synced. 

* #### Sync Telemetry

Sync Telemetry notes down the details of each sync - the kind of sync, start time, end time, number of entities synced, app details etc and pushes it to the server for analysis. 

### Detailed sync steps

The sync process can be broadly divided into two activities

1. Data Server sync
2. Media sync\
   In the Data Server sync, all data except media is synced to the server. This is a 2-way sync\
   In the Media sync, media observations are taken from the MediaQueue and uploaded. Observations are modified to match the new S3 urls. 

In our current sync process, if there is media, we do a media sync first and then a data server sync. If there is no media, then we do a single data server sync. 

Once the data server sync and media sync is complete, sync telemetry is uploaded to the server. 

#### Data Server Sync

Here are the steps for a data server sync

1. Retrieve /syncDetails. This sends the existing EntityMetadata to the server to identify all the entities that have changed since the last sync. Only relevant entities are then synced to the client. 
2. Upload all entities marked in the EntityQueue
3. Verify if a data reset is required. If it is, then perform necessary resets
4. Get all reference data
5. Update database to account for new privileges if any (privileges are part of reference data)
6. Get all transactional data
7. Perform any migrations necessary (migration data is part of transactional data. New subjects are downloaded in one-shot with all transactions of a subject retrieved using the /subject/$\{subjectUUID}/allEntities endpoint)
8. Download images linked to news broadcasts
9. Download extensions if any
10. Download icon images of subject types

#### Media server sync

Media content are taken from the MediaQueue and uploaded to S3. Once this is done, these observations are modified to have the S3 url as part of the observation instead of the local file name. The next data server sync syncs these new entities back to the server. 

### Automated sync

Since release 3.36, there is now an automated sync mechanism. With this, entities are synced automatically on a timed basis. This happens once every hour, only if a sync was not run within the last half an hour. Normally, this only includes uploading entities that have been changed on the client. If it has been more than 12 hours since we have had a full sync, then the app does a full sync instead. From release 4.0.0, automated sync can be disabled from user settings in both field app and  webapp.

### Sync from a server's perspective

#### Sync strategy

While the app does not worry too much about the data that is being downloaded, the server ensures that only the right data is being sent to the app. Each subject is synced to the app of a user based on a few conditions

1. If the catchment of the subject matches the catchment of the user
2. If the sync attributes on the registration form of the subject matches the sync attributes of a user
3. If the subject is assigned to the user

The exact sync strategy is defined in a subject type. 

You can read more about the different Sync strategies supported in Avni [here](https://avni.readme.io/docs/sync-strategies).

#### Other tidbits

All transactional data except entity approval status is synced based on catchment. From release 3.38, entity approval status is also synced based on catchment. All reference data except locations is completely synced to the app. Locations are filtered by catchment of the user. 

The /syncDetails call is used to ensure that only relevant entities are requested by the app for a sync. This greatly reduces the number of calls on unchanged entities (there could be about 100 different entities present for an implementation, and only about less than 10 change frequently). 

Only data that has been in the server for more than 10 seconds from the time of the start of sync is provided to the app. This is to prevent in-process transactions from being missed out, and ensures that partial transactions that happen during the sync do not cause any errors
### Performance Expectations

In the table below different performance items have been listed with the rough expectations of how long they should take. If during your testing you see response times not inline with the following table, please get it verified by the platform team or technical leads in your team, if indeed the response time is OK.

### Implementation

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Performance Item
      </th>

      <th style={{ textAlign: "left" }}>
        General Expectation
      </th>

      <th style={{ textAlign: "left" }}>
        Raise red flag
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        **SuperSet/Metabase Dashboard**
        (with or without filters)
      </td>

      <td style={{ textAlign: "left" }}>
        \< 10 seconds
      </td>

      <td style={{ textAlign: "left" }}>
        > 20 seconds
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        **SuperSet/Metabase Line list download**
      </td>

      <td style={{ textAlign: "left" }}>
        \< 60 seconds
      </td>

      <td style={{ textAlign: "left" }}>
        > 3 minutes
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        **Offline mobile dashboard**\
        (with or without filter values,\
        for any catchment size; on any device)
      </td>

      <td style={{ textAlign: "left" }}>
        \<= 2 seconds
      </td>

      <td style={{ textAlign: "left" }}>
        > 5 seconds
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        * \*Summary and Recommendations\
          Screen\*\* (mobile app; on any device)
      </td>

      <td style={{ textAlign: "left" }}>
        \<= 2 seconds
      </td>

      <td style={{ textAlign: "left" }}>
        > 5 seconds
      </td>
    </tr>
  </tbody>
</Table>

### Platform

These are platform issues, but may have been caused by some specific configuration of the organisation, hence may not be a known issue. So please feel free to report them.

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Performance Item
      </th>

      <th>
        General Expectation
      </th>

      <th>
        Raise red flag
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        **Incremental sync**
        (on wifi network; on any device)
      </td>

      <td>
        \< 20 seconds
      </td>

      <td>
        > 1 minute
      </td>
    </tr>

    <tr>
      <td>
        * \*Subject search\*\* (mobile app; on any device)
      </td>

      <td>
        \<= 3 seconds
      </td>

      <td>
        > 5 seconds
      </td>
    </tr>

    <tr>
      <td>
        * \*DEA subject search\*\* (after release 10)\
          with/without filters
      </td>

      <td>
        \<= 5 seconds
      </td>

      <td>
        > 10 seconds
      </td>
    </tr>

    <tr>
      <td>
        **All admin / app designer screens**\
        (Except CSV, bundle uploads)
      </td>

      <td>
        \<= 5 seconds
      </td>

      <td>
        > 10 seconds
      </td>
    </tr>
  </tbody>
</Table>
### Templates

## Overview
The template-based setup allows implementers to quickly bootstrap their Avni instance with pre-configured settings, forms, and metadata that closely match common use cases. This significantly reduces the time and effort required for initial configuration.

## Details
Applying a template deletes all data and configuration in the organisation to avoid conflicts with the template being applied. Due to this, templates are not allowed to be applied to any UAT or Production orgs so there is no accidental deletion of data.

If any configurations that might be useful have been setup, create a backup using the Bundle download (**App Designer** -> **Bundle**) feature.

You can change the configuration that the template provides after the setup is complete to suit your organisation's needs.

The operation takes a few minutes to complete.

## Privileges required
The following privileges are required to use this feature:
- UploadMetadataAndData
- EditOrganisationConfiguration
- DeleteOrganisationConfiguration

## How to Apply a Template

1. Navigate to **Create App** -> **Templates**
2. Select your desired template from the available options
3. Click **Apply Template**
### Index

Implementers read this first. This section is essential in understanding how to set up Avni for an organisation.
## Advanced Feature Guide

### Flavouring Avni

There are can be several reasons for rolling out your own app from the play store.

* You have a different deployment of Avni
* You want your own branding (icons, logos, etc)

You can change the following

1. App logo
2. App name
3. Splash screen (Splash screen is done through [extensions](doc:extension-points))

You may be required to change the following, if your hosting is not managed by Samanvay or not planned to be managed by Samanvay in future.

1. Firebase configuration
2. Bugsnag configuration
   1. Create an account in Bugsnag and create a project of type React Native.
   2. Get the Notifier API key from the project settings

A new app is called a flavor of the app (terminology from [Android flavors](https://developer.android.com/build/build-variants)). There are a few flavors already configured today. This configuration is done in the [avni-client](https://github.com/avniproject/avni-client) repository.

## Steps:

1. [Create new flavor in android-client](https://avni.readme.io/docs/flavouring-avni#steps-to-create-a-new-flavor-in-client)
2. [Configure to get build from circle-ci](https://avni.readme.io/docs/flavouring-avni#steps-to-do-in-to-get-build-via-circle-ci)
3. [Steps to follow in google playstore](https://avni.readme.io/docs/flavouring-avni#steps-to-do-in-google-play-store)

### Steps to create a new flavor in client:

* Under `packages/openchs-android/android/app/src`, create a folder with the flavor name.
  * Flavor naming conventions:
    * Use camelCase for flavor name, since it is used in the android [docs](https://developer.android.com/build/build-variants).  This is also inline with the folder names generated during the build process.
    * The flavor name, need not have org name, just app name will suffice. 
    * Eg: for `Teach Nagaland` app from LFE, the flavor name can be `teachNagaland` and not `teach_nagaland` or `lfeTeachNagaland`.
  * Under `assets` folder add `logo.png`. The file needs to be in `png` format for the animation in the screensaver to work and for the logo to appear in the Login page.
    * To resize the logo to a reasonable size, `Preview` app can be used. Open the file and go to `Tools -> Adjust Size`.
    * To convert the logo from say, jpg to png format, open the file, then go to `File -> Export -> Change the format to png -> Save`.
  * Under `res` folder, create folders for each resolution. This images in this folder is used to display launcher icon in android app. This [website](https://icon.kitchen/) can be used to generate circle and square icons for each resolution.
  * To integrate with firebase analytics, copy `google-services.json` from [firebase console](https://console.firebase.google.com/u/0/) by creating a project specific to the flavor or an app within an existing project as per need. To view data of an app within a project, you can : Add comparison > Dimension = "Stream name" > Match Type = "exactly matches" > Value: select your app via checkbox
  * When some resources are common across flavors, add it under `packages/openchs-android/android/app/src/main` folder (instruction for Avni product team only)
  * Add a flavor specific privacy policy under `docs` to be linked to from the play store app listing using the Avni privacy policy as a reference and make changes specific to the flavor such as app name.
* Changes to be made in `build.gradle`
  * Add the `signingConfig` for the new flavor. To create keystore, check [here](https://developer.android.com/studio/publish/app-signing#generate-key) or use the following command.
    * `keytool -genkey -v -keystore <flavor>-release-key.keystore -storepass <keystorepassword> -alias <alias> -keypass <keypassword> -keyalg RSA -keysize 2048 -validity 10000`
  * In `packages/openchs-android/android/app/build.gradle`, under `productFlavors` add the key value pairs for the new flavor. 
    * For applicationId, use the format, `com.openchsclient.{client_name}.{region_name}`, where `region_name` need to be given if different flavors of the app exists for different regions.
    * create new bugsnag app, and add its API key.
  * Using `sourceSets` config in the `build.gradle`, modules specific to flavors can be configured.
* In `flavor_config.json` add the config for the new flavor. The values here are used by make tasks.
  * super admin password of the server url need to be mentioned as value for `prod_admin_password_env_var_name` .

### Steps to do to get build via circle-ci:

* Update `.circleci/config.yml` to add flavor to enum of valid `flavors`.
* Add environment variables.
  * Go to `Project Settings -> Environment variables` in circleci.
  * Add values for key password (`<flavor>_KEY_PASSWORD`), key store password (`<flavor>_KEYSTORE_PASSWORD`), key alias (`<flavor>_KEY_ALIAS`), bugsnag api key.
* Refer this [link](https://avni.readme.io/docs/release-process-for-the-cloud#circleci-build) to know how to generate apks and aab from circle-ci for specific flavor.

### Steps to do in google play store:

* Create app on google play console.
* Under `Grow -> Store Presence -> Main store listing` and enter the details. For phone and tablet screenshots, same screenshots can be uploaded.
* Under `Grow -> Store settings`, enter the details similar to other app.
* Go to `Publishing overview` and finish the steps mentioned to be able to publish for review.
  * For privacy policy, make sure the privacy policy mentions the name of the app instead of `Avni`.
  * To complete the steps take the help of already filled values of other apps. For that refer, `Policy and programmes -> App content -> Actioned` 
* Create release. 
  * As per this [link](https://stackoverflow.com/questions/73132752/i-dont-use-ads-in-my-flutter-app-then-why-this-message-is-showing-in-my-play-co), seems like Firebase Analytics plugin needs permission `com.google.android.gms.permission.AD_ID`. Hence click `Yes` for `AD_ID` permissions and check `Analytics` for usage.
  * Upload the bundle downloaded from the playstore.
* Send the changes made above for review.

### How to use a specific flavor:

By default, generic flavor without organisation branding will be picked up . When need to run make tasks for specific flavor, pass the flavor variable to the make task.

Eg: ` make run_app_staging flavor='apf'`

### Other branding changes in Avni that are relevant

There are other places where icons/colours can be configured. Below is a table that summarizes the changes that are possible. All changes can be performed through the App Designer.

| Type   | Item              | Specifications                                                                                                |
| :----- | :---------------- | :------------------------------------------------------------------------------------------------------------ |
| Icon   | Subject Type Icon | jpg/png square images 75 \* 75 px                                                                             |
| Icon   | Report card       | jpg/png square images 75 \* 75 px                                                                             |
| Icon   | Menu Item         | Material Community Icon from [https://pictogrammers.com/library/mdi/](https://pictogrammers.com/library/mdi/) |
| Colour | Program           | RGB                                                                                                           |
| Colour | Report Card       | RGB                                                                                                           |
| Colour | Form Header       | RGB                                                                                                           |
### Record Location Of A Subjectindividual

Avni allows users to capture the location of a beneficiary during their visit. This recorded location helps make follow-up visits easier, especially when the visit is conducted by a different user.

The same capability can also be used to record the location of non-living subjects (for example, dams or other physical assets) when Avni is used to track them.

### Steps to record location and navigate

* When you are at a beneficiary’s residence, tap the Add Location icon.
* If prompted, grant the required permissions to capture and save the beneficiary’s location.
* Once saved, you can tap the location to navigate to it or edit it.
* You may recapture the location to improve accuracy.

<Image align="center" border={false} src="https://files.readme.io/ba843bb409bdcd1eaf16d89ce47e83f156bd435ec48875310e40b09a34c7cad9-location.gif" />

<br />

#### Steps to download offline maps

You can download offline maps for an area to ensure you can navigate to a beneficiary’s location even when you are not connected to the internet.  On Google Maps you can `search for the location`, click on `more` and then click on `Download offline map`.

<Image align="center" border={false} src="https://files.readme.io/189153253f92ffad6007b0b8ff461388c5eed2c00eea5fe0a5b802fe035cb258-offline.gif" />

<br />
### Documentation

Custom documentation can be created in Avni. Documentation supports rich text and can be written in different\
languages supported by an organization. Right now you can also link particular documentation to a form element and it'll show up in the mobile app. This is useful where more context is required for any question.

## Steps to configure and link documentation

The below GIF displays how documentation can be created and linked to a form element.

<Image title="Documentation-linking.gif" alt={1851} src="https://files.readme.io/d2a237f-Documentation-linking.gif">
  Configuring and linking documentation
</Image>

Once documentation is linked to the form element, it'll start appearing in the mobile app. Users can expand and close the documentation while filling out the form.

<Image title="form-element-documentation.png" alt={568} src="https://files.readme.io/542e811-form-element-documentation.png">
  Documentation on the mobile app.
</Image>
### Timed Questions

Questions can be timed in Avni. If you want the user to fill some set of questions after a particular time then you can mark the page as a timed page and specify the time when the questions on the page should be visible. You also set the stay time which forces user to fill all those questions in the mentioned time frame.

## Steps to configure timed questions

Any page can be marked as timed. It is important that you specify the start time and stay time for the timed pages. The start time indicates that the page should start at the provided time and the stay time will keep the question visible till the specified time. Once the stay time is over screen automatically moves to the next page.

<Image title="timed_page.png" alt={1809} src="https://files.readme.io/cf86f77-timed_page.png">
  Example of the timed page in the form
</Image>

There are some assumptions that must be followed to make timed questions work properly.

1. Questions inside the timed page should not be mandatory.
2. If any page is marked as timed then it should not have any visibility rule to hide the entire page. The visibility rule might get ignored.
3. Timer only runs for the first time when filling up the form. Once users have filled in all the timed questions they can go back and edit the entries. Also, the edit flow does not show any timer for the timed questions.
4. If multiple pages are timed and are placed one after the other then the same timer is used for all the pages. Only when there is at least one non-timed page in between two timed page app asks the user to start the timer again.
### Repeatable Question Group

A repeatable question group is an extension of the question group form element. A Question group is like any other data type in Avni. The only difference is it allows implementers to group similar fields together and show those questions like a group. Now there are cases where you want to repeat the same set of questions(group) multiple times. This can be easily done by just marking the question group as repeatable.

## Steps to configure repeatable Question group

1. Create a form element having a question group concept.
2. This will allow you to add multiple questions inside the question group.
3. Once all the questions are added, mark it repeatable and finally save the form.

<Image title="Repeaable-question-group.png" alt={1495} align="center" src="https://files.readme.io/ae26aab-Repeaable-question-group.png">
  Notice how the question group is marked repeatable.
</Image>

<Image title="repeatable-question.gif" alt={585} align="center" src="https://files.readme.io/61bee14-repeatable-question.gif">
  Repeatable questions in mobile app
</Image>

### Limitations

At this time, the following elements that are part of the forms are not yet supported. 

* Nested Groups
* Encounter form element
* Id form element
* Subject form element with the "Show all members" option (Regular subject form elements are supported)

  * To get this working within a Question-Group/ Repeatable-Question-Group, for a Non "Group" Subject Type, please select the **"Search Option"** in the Subject FormElement while configuring the Form inside **App Designer**

  <Image align="center" src="https://files.readme.io/c5c15ae-Screenshot_2024-06-10_at_2.35.04_PM.png" />
### Styling The Name Of The Page

Implementers can provide the custom background color and text color to the page header(form element group). Although the implementer can choose from any color present in the color palette, we suggest choosing the contrast colors for the background and text so that the page header is visible properly.

Background and text color can be chosen from the option available at the bottom of each page. Once the colors are chosen and the form is saved, it'll be visible in the observation table in the subject dashboard and also while filling the form.

![585](https://files.readme.io/54b0c74-colourful-groups.gif "colourful-groups.gif")
### Quick Form Edit And Jump To Summary

This feature allows users to jump directly to any page in the form and then quickly save the form skipping the middle questions. This will save a lot of time as now users don't have to go through all the pages.\
There is no configuration required for the quick form edit feature however, one need to enable jump to summary feature

## Enabling jump to summary

In the admin app go to "Organisation Details" and enable the "Show summary button" option. 

<Image title="Jump to summary.png" alt={1832} src="https://files.readme.io/19f3021-Jump_to_summary.png">
  Enabling Jump to summary feature
</Image>

After enabling the "jump to summary feature", sync the field app. The user will see the Summary button at the top right corner in the form.

<Image title="quick-form-edit(1).gif" alt={176} src="https://files.readme.io/aea853d-quick-form-edit1.gif">
  Quick form edit in action
</Image>

**Note**: This feature is only supported in the mobile application.
### Draft Save

Sometimes we have huge forms and all the information is not available when you start capturing the data of such forms. Avni gives you the facility to save the half-filled form as a draft. These draft forms are not synced to the server, and once you fill the form completely draft is automatically deleted.

## Enabling Draft save

You can enable draft to save for your organization using the admin app. Simply go to "organisation Details" and enable "Draft save".

![](https://files.readme.io/d824dc2-draft_save.png "draft save.png")

Once the "draft save" feature is enabled you can see the half-filled forms in the field app. Please note that these drafts will get deleted if the draft is left untouched for more than 30 days.

If a draft is opened up and the form is saved, it becomes an item that will be synced to the server.

![](https://files.readme.io/8386271-d.png "d.png")

## Key points

* **Applicability:** Currently, this feature works for Registration, Enrolment and Encounter forms. Cancellation and Exit forms are not supported as drafts.
* **Display:** Registration drafts are displayed on the Register screen. Encounter drafts are displayed under the on the 'General' tab on the Subject Dashboard. Unscheduled encounter drafts are displayed under the 'Drafts' section and scheduled encounter drafts are accessible by tapping 'Do' on encounters under the 'Visits Planned' section. Enrolment drafts are displayed with the previously provided values on attempting enrolment again. Program encounters are displayed similar to Encounters on the 'Program' tab.
* **Save Checkpoint:** A draft save action is performed on clicking "Next" or "Previous" buttons while filling in a form, therefore, if User fills in a page but does not click on "Next" or "Previous" buttons, then the Draft saved would have content only till the previous page (On which "Next" button was clicked)
* **Exiting a form:** To exit from a form in-between, user may click on the "Header" "Back" button or click on "Footer" "Home" buttons**
* **Stale Drafts clean-up:** Usually drafts get deleted once you perform a final save operation to convert it to an actual entity. Along with that we have a periodic drafts clean-up which gets executed once a day, to delete drafts that were last updated more than 30 days ago.
### Fast Sync

When setting up Avni freshly on an android device the first-time sync can take a lot of time, especially if you have a lot of transactional data for the catchment. To make this process faster Avni provides an option to set up fast sync for a catchment.

The performance of syncing data from the server to the local mobile database is dependent on the volume of data - hence cannot be improved significantly. Hence fast sync depends on using the already synced mobile database file as the starting database for other users. This significantly improves the sync duration to less than 5 minutes in most cases.

There are few things to note before we start setting up fast sync.

* Fast sync is set up for a catchment, so if there is a new user in a catchment called "a" then any existing user of the catchment "a" should set up the fast sync from their device.
* Fast sync does not update automatically, which means if the user has set up fast sync one month earlier, then all the data filled after that will get downloaded by the regular sync. So it is recommended to update the fast sync whenever any user is freshly setting up the Avni on their device.
* Fast sync is triggered only when the user is syncing for the first time. So if the user has not logged in for a long time, then it is recommended to delete all the app data and log in again to use the fast sync.

## Setting up fast sync

.Setting up fast sync is very easy and it requires an active internet connection. Existing users can go to "More -> Setup fast sync" and then click "Yes". This will take a while depending on the data in the device. This uploads the database file from the user's device to Avni storage as fast sync file for this catchment.

<Image title="fast sync.png" alt={568} align="center" src="https://files.readme.io/125e0b2-fast_sync.png">
  Fast sync setup option.
</Image>

Once it is done, the new user from the same catchment will get an option to use the fast sync when he logs in for the first time.

<br />

## Verification of Existence of Fast-Sync file

Steps to follow:

1. Figure out Catchment UUID corresponding to the User facing the issue
2. Login into AWS and open up the S3 Console 
3. Navigate to "s3/buckets/\<env\>-user-media/\<org\_media\_bucket\_name\>"
4. There the FastSync files will have prefix of "MobileDbBackup-" followed by Catchment UUID Ex: "MobileDbBackup-b9103c96-7ed7-4798-a866-89419103d361"
5. Download the file and unzip if needed to check size / content

<br />

<Image align="center" src="https://files.readme.io/f6786a7c51e3bdc43bdb24a7960bc74cd7b38af163ec88dc8685f7fe46c395f2-Screenshot_2025-04-03_at_1.14.45_PM.png" />

<br />

## Perils of Fast Sync

"Fast sync" speed up the initial sync and improves new user onboarding experience. But the flip-side of setting up "Fast Sync" are as follows:

* "Fast Sync", if setup using a newer version of app, prevent fresh logins from older version of the app
* "Fast Sync", is setup per Catchment basis, so, if there are restrictions due to Sync-Concept-Values or UserGroup Privileges for one set of users and they have the FastSync Setup for them, then the other set of Users with conflicting Sync-Concept-Values or UserGroup Privileges might end up receiving invalid data / missing data during sync
* "Fast Sync", when setup, assumes that the Catchment constituent Locations are fixed, any change to the catchment results in a "Reset Sync" being created for all users which are associated with that catchment. But new users who get assigned to that Catchment, will not have the "Reset Sync" configured appropriately in all cases, this could result in missed / extraneous data sync happening to the new users.
* "Fast Sync" data cannot be modularly distributed to users of different catchment with overlapping location boundaries. You would have to spearately setup Fast sync for each catchment.
* There is no easy way for Organisation users to remove a "Fast Sync" setup for a Catchment, he should either over-write it with a new "Fast Sync" file, or contact Support team for deletion of old one. To be able to overcome the Sync failure error, you would need to do:
  * Either do "Fresh login" after that(Deletion / overwrite of FastSync file)
  * Or continue and "Perform Slow Sync"

<Image alt="Fast Sync Failure due to Version mismatch" align="center" width="450px" src="https://files.readme.io/a2bce3187fea665854c9d179dc43c9597a0dfff81f3eec23b77626bb5af2aacd-Screenshot_20250410_184143.jpg">
  Fast Sync Failure due to Version mismatch
</Image>
### New Longitudinal Export

## Introduction

The “New Longitudinal export” feature allows for an Implementation Admin user to extract data in Longitudinal format for a specific Subject Type. All invoked requests are listed at the bottom of the “New Longitudinal export” screen, which also includes Status information. The export requests are processed asynchronously in the backend and upon completion they are uploaded to cloud and are available for download in the same screen in-line with the request status details.

New longitudinal export fixes the following issues with old export.

* Inability to fetch data across different forms for the same subject. eg: Fetch data from two different encounter types on the same program
* Inability to fetch group/household information
* Inability to fetch only selected fields from different forms

### Limitations

* There is a limit of maximum of 10,000 Individuals data that could be exported at once, as part of a single Longitudinal export request

## Presupposition

In-order for an Implementation admin user to be able to successfully invoke a “New Longitudinal export” request, he / she would need to have the following:

* Basic understanding of JSON syntax
* Understanding of Avni Entity Types and their inter-relationships

## Preparation

Implementation Admin would need to come up with a list of UUIDs corresponding to Entity Types and Concepts whose data should be included in the exported file.

In-order to fetch this, the most accessible approach is the Avni Webapp. The concept uuid is shown in the address bar, where-as the Entity type (Individual) UUIDs are available on inspecting the network response, as shown in the screenshot below.

![Reference Screen-shot for fetching UUID for Subject type](https://files.readme.io/487a1fa-Screenshot_2023-05-30_at_6.43.42_PM.png)

For Avni Internal team members, they can connect to the DB and invoke appropriate SQL queries to fetcht the UUID information.

```Text SQL
#Query to fetch concept names and UUIDs
set role <org_db_user>;
select
    f.name  as FormName
    -- ,fm.entity_id
    -- ,fm.observations_type_entity_id
    -- ,fm.organisation_id
        ,
    feg.name,
    fe.name as "Form Element",
    c2.name as "Concept"
from form f
         inner join form_element_group feg on feg.form_id = f.id
         inner join form_element fe on fe.form_element_group_id = feg.id
         inner join concept c2 on fe.concept_id = c2.id
order by
    f.name
       , feg.display_order asc
       , fe.display_order asc;
```

## Request Payload Format

```sql JSON
{
  "individual": {
    "uuid": "<Specify Subject Type's UUID>",
    "fields": [
      "id",
      "uuid",
      "firstName",
      "registrationDate",
      "gender",
      "dateOfBirth"
    ],
    "filters": {
      "addressLevelIds": [],
      "date": {
        "from": "2020-01-12",
        "to": "2022-05-04"
      }
    },
    "encounters": [
      {
        "uuid": "<Specify Encounter type's UUID>",
        "fields": [
          "id",
          "encounterDateTime",
          "cancelDateTime",
          "uuid",
          "name",
          "voided",
          "<Specify Encounter's Concept UUID>"
        ],
        "filters": {
          "includeVoided": true,
          "date": {
            "from": "2020-01-12",
            "to": "2022-05-04"
          }
        }
      }
    ],
    "groups": [
      {
        "uuid": "<Specify Group Subject Type's UUID>",
        "fields": [
          "id",
          "uuid",
          "firstName"
        ],
        "encounters": [
          {
            "uuid": "<Specify Group Subject's Encounter Type UUID>",
            "fields": [
              "id"
            ]
          }
        ]
      }
    ],
    "programs": [
      {
        "uuid": "<Specify Program's UUID>",
        "fields": [
          "id",
          "uuid",
          "enrolmentDateTime"
        ],
        "encounters": [
          {
            "uuid": "<Specify Program Encounter's UUID>",
            "fields": [
              "id",
              "uuid",
              "name",
              "encounterDateTime",
              "cancelDateTime",
              "voided",
              "<Specify Program Encounter's Concept 1 UUID>",
              "<Specify Program Encounter's Concept 2 UUID>"
            ],
            "filters": {
              "includeVoided": true
            }
          }
        ]
      }
    ]
  },
  "timezone": "Asia/Calcutta"
}

```

## Description of elements that can be used to compose a Export request

```c <ROOT> (The root JSON element)
- "individual" : "<Specify Subject Type request details>"
- "timezone" : "<Specify timezone to adhere while displaying date fields>"
```

```c "individual” (Request details of the Subject Type for which data has to be extracted)
- "uuid" : "<Specify Subject Type's UUID>"
- "fields" : "<Specify fields on subjects to be included in the export>"
- "filters" : "<Specify filters applicable on subjects to be included in the export>"
- "encounters" : "<Specify General Encounter Types request details>"
  -- "uuid" : "<Specify Encounter Type's UUID>"
  -- "fields" : "<Specify fields on Encounters to be included in the export>"
  -- "filters" : "<Specify filters applicable on Encounters to be included in the export>"
  -- "maxCount" : "<Specify maximum count of Encounters to be included in the export>"
- "groups" : "<Specify Group Subject request details>"
  -- "uuid" : "<Specify Group Subject’s UUID>"
  -- "fields" : "<Specify fields on Group Subject’s to be included in the export>"
  -- "filters" : "<Specify filters applicable on Group Subject to be included in the export>"
  -- "maxCount" : "<Specify maximum count of Group to be included in the export>"
  -- "encounters" : "<Specify Group Subject Encounter Type’s request details>"
- "programs" : "<Specify Program request details>"
  -- "uuid" : "<Specify Program's UUID>"
  -- "fields" : "<Specify fields on Program Enrolment’s to be included in the export>"
  -- "filters" : "<Specify filters applicable on Program Enrolments to be included in the export>"
  -- "maxCount" : "<Specify maximum count of Program Enrolment to be included in the export>"
  -- "encounters" : "<Specify Program Encounter Types request details>"
```

### Allowed list of Individual fields that could be included in the export file ("fields" within “individual” or "groups" element )​

```c Fields
"id"  
"uuid"  
"firstName"  
"middleName"  
"lastName"
"dateOfBirth"  
"registrationDate"  
"gender"  
"createdBy"  
"createdDateTime"  
"lastModifiedBy"  
"lastModifiedDateTime"  
"voided"  
"registrationDate"  
"registrationLocation"
"gender"  
"dateOfBirth"  
"concept_uuid" : "<Specify Individual’s Concept UUID>"
```

### Allowed list of filters that could be applied to an entity ( "filters" within any entity “individual”, “encounters”, “groups”, “programs”)

```c Filters
"addressLevelIds" : "<Specify Array of Address Level Ids>"  
"date" : "<Specify date range to filter data>"  
"includeVoided" : "<Specify whether voided fields should be included, Allowed values are a. true and b.false >"
```

### Allowed fields with-in "date" element nested inside other entities(Used to restrict the data fetch to have registrationDate or encounterDateTime within the range specified)

```c Date
"from" : Format => "yyyy-MM-dd" Ex: "2020-01-12" (Mandatory)  
"to" : Format => "yyyy-MM-dd" Ex: "2020-01-12" (Mandatory)
```

### Allowed list of Encounter fields that could be included in the export file  ("fields" within "encounters", "program encounters" and  "group subject encounters" element)

```c Fields
"id"  
"uuid"  
"name"  
"earliestVisitDateTime"  
"maxVisitDateTime" 
"encounterDateTime"  
"encounterLocation"
"cancelLocation"
"cancelDateTime"
"createdBy"  
"createdDateTime"  
"lastModifiedBy"  
"lastModifiedDateTime"  
"Voided"
"concept_uuid" : "<Specify Encounter’s Concept UUID>"
```

### Allowed list of enrolment fields that could be included in the export file ("fields" within "enrolment" element )

```c Fields
"id"  
"uuid"  
"name"  
"enrolmentDateTime"  
"programExitDateTime"
"enrolmentLocation"
"exitLocation"
"createdBy"  
"createdDateTime"  
"lastModifiedBy"  
"lastModifiedDateTime"  
"Voided"
"concept_uuid" : "<Specify Enrolment’s Concept UUID>"
```

## Sample Payload

```c JSON
{
   "individual": {
       "uuid": "d22027ff-e019-4d1c-9352-bd740efccc38",
       "fields": ["id", "uuid", "firstName", "registrationDate", "gender", "dateOfBirth"],
       "filters": {
           "addressLevelIds": [],
           "date": {
               "from": "2020-01-12",
               "to": "2022-05-04"
           }
       },
       "encounters": [
           {
               "uuid": "16a3be1b-18a1-45e9-bfc8-f7915898abef",
               "fields": ["id", "encounterDateTime", "cancelDateTime", "uuid", "name", "voided",
                               "1f51e7f7-6db0-41ea-a372-e7b553ccb857",
                               "a6a6d4c0-4339-4ef0-b152-6d1c23eaf7c2",
                               "a44678fd-ee6d-4dc5-b103-f5534eb0f338",
                               "ab095140-b090-4f59-98ac-89b6479df471"],
               "filters": {
                           "includeVoided": true,
                           "date": {
                               "from": "2020-01-12",
                               "to": "2022-05-04"
                           }
                       }
           }
       ],
       "groups": [
           {
               "uuid": "e524b328-c0ad-4232-9fcb-2cf8c126a2c6",
               "fields": ["id", "uuid", "firstName"],
               "encounters": [
                   {
                       "uuid": "0c823f64-b2ec-420b-9e28-5e953b66b6d1",
                       "fields": ["id"]
                   }
               ]
           }
       ],
       "programs": [
           {
               "uuid": "9d6cd285-fb85-48f0-badc-6f004b9024d8",
               "fields": ["id", "uuid", "enrolmentDateTime"],
               "encounters": [
                   {
                       "uuid": "b2f419dc-209a-4285-b74c-29d93f2a628e",
                       "fields": ["id", "uuid", "name","encounterDateTime", "cancelDateTime","voided",
                           "45f02196-217b-4772-8085-3d17c41244da",
                           "d1774f83-ee28-41b8-9cb8-309098ee0f16",
                           "82efa85a-46a9-4c75-8c53-c488b8c48c54",
                           "84a99b8c-f9bb-4436-9d83-d79a60a0b450",
                           "74745370-ee9e-4f58-b25e-57ebac69d75d",
                           "2da75202-7f70-4a76-a8eb-cd9b289cdf8a",
                           "d9f8ee0c-960f-43d7-9b02-aa2557a9aa10",
                           "3e092c91-8e32-42b1-ac26-045b846e3893",
                           "80d88c23-1e44-423a-96bf-5ddaf105042e",
                           "e9190320-3211-4d9f-a72c-288f42cf830c",
                           "1cae9bd0-0dba-4479-954a-2d569c58d711",
                           "ac4d5664-0b5f-467f-a3c9-c0e4c8c221b7",
                           "8f67d53a-07bf-4652-b7ad-f2f6ef6bdfa2",
                           "44a608f8-54d3-4a8b-96b8-7175c65e1d01",
                           "a9f45a38-99a7-4fd8-8e28-1291434eace0",
                           "dfdc75c1-5a47-4aae-887c-3ee9f050d75e",
                           "c78e883a-60de-4629-8d85-8e4512cd13d5",
                           "0fc3b733-0ee0-4554-b316-e5e29c1978d2",
                           "83f01615-04b1-4115-84a5-48e89c9aff54",
                           "5e4d8a9d-28a5-49ec-a4c9-cd9cfd4dd134",
                           "89bf3601-d8ab-4353-85a3-8070a959394e",
                           "8263f129-5851-4f9d-a909-818dacacd862",
                           "5592def2-fe5e-4234-9253-ca5fd0322e26"],
                       "filters": {
                           "includeVoided": true
                       }
                   }
               ]
           }
       ]
   },
   "timezone": "Asia/Calcutta"
}

```
### Application Menu

The customizable "Application menu" feature helps you add a new menu item that will show up on the "More" option of the Android app. 

This new menu item can either be an http link, or a whatsapp number. Popular apps that can be used with this linking scheme are available [here](https://gist.github.com/imbudhiraja/5b0a485fb7f36fb16c9d7d5f19b6ee40)

eg: 

* To open Whatsapp for a number, you would use a url like "whatsapp\://send?text=hello\&phone=xxxxxxxxxxxxx"
* To open a link on youtube, you would use this - youtube://watch?v=dQw4w9WgXcQ
* To open the Avniproject website on the browser, you would use [https://avniproject.org](https://avniproject.org)

### Configuration

In order to set this up, add a row to the menu\_item table. 

```sql Add new menu iterm
INSERT INTO public.menu_item (organisation_id, uuid, is_voided, version, created_by_id, last_modified_by_id,
                              created_date_time, last_modified_date_time, display_key, type, menu_group, icon,
                              link_function)
VALUES (156, uuid_generate_v4(), false, 0, 1, 1, '2022-08-25 11:05:57.791 +00:00',
        now(), 'Support', 'Link', 'Support', 'whatsapp',
        '() => "whatsapp://send?phone=+919292929292"');
```

The link\_function is a function that can create a dynamic url. See [here](https://avni.readme.io/docs/writing-rules#12-hyperlink-menu-item-rule) for more information on how these functions can be written.
### Call Masking

When a contact number is configured in an implementation (through concept attributes), then the user gets a "Call" button on the subject's dashboard. It is used to open the dialler and make a call to the beneficiary.

With the call masking feature, an implementation can choose to convert this call button into a masked call. There is a user settings toggle to turn this on or off. Under the wraps, Avni can use the Exotel Masked Call feature to make this happen. 

To use this feature, a user needs to purchase an Exophone and configure this in Avni. Configuration is currently done by adding a row to the external\_api table. 

### User flow

* User goes to a subject's dashboard.
* User clicks on the call button
* If call masking is enabled for this user, then the call button makes a call to the server to connect their phone to the beneficiary's number. The user and the beneficiary will get a call from Exotel through which they can talk.
* The user gets a message that the call request was made successfully, and to wait for a call back.
* If call masking is not enabled for this user, then the call button makes a direct call through the dialler.
### Comment Workflow

This is an issue resolution mechanism provided by Avni which helps to fix the mistakes in the record. Comment workflow helps to pinpoint the exact subject for which data correction is required. This saves a lot of time the user spends searching for that subject.

## Enabling comment workflow

Comment workflow can be enabled from the admin app. Simply go to organisation details and switch on "enable comments" option.

<Image title="comment.png" alt={1848} src="https://files.readme.io/548038c-comment.png">
  Enable comments option in the admin app
</Image>

Once this feature is enabled users will start seeing the comment icon on the subject dashboard. They can click on the icon to open all the comment threads of the subject. They can perform the following operations on the comment screen.

* Open a comment thread and read all the comments on that thread.
* Reply to a comment thread.
* Mark a comment thread as resolved, if the issue is resolved.
* Open a new comment thread by pressing add icon.

<Image title="comment screen.png" alt={574} src="https://files.readme.io/f1a3a13-comment_screen.png">
  Comment screen showing one open thread. Users can see all the comments in a thread by clicking on that thread.
</Image>

**Useful tips** 

* When comment workflow is enabled, ensure that a standard report card of type "comments" is added to the dashboard. This will help users to see only the comments threads which are open and they need to work on.
### News Broadcast

Sometimes it is important to share some important information with all the field users. Avni provides this facility using the News broadcast feature. This feature helps in easy communication with the field users.

## Creating a news broadcast

Creating a news broadcast is very simple, follow the below steps.

* Go to the home page of the Avni web app and open the News Broadcast app.

<Image title="News Broadcast.png" alt={1839} align="center" src="https://files.readme.io/2623e59-News_Broadcast.png">
  Click on the news broadcast to see all the news set up in the organisation
</Image>

* Click on "Create a news broadcast".

<Image title="Create News.png" alt={1846} align="center" src="https://files.readme.io/e42cb0c-Create_News.png">
  The new broadcast can be created by clicking on Create a new broadcast
</Image>

* Provide all the details like image, title, and content and click on "Save news".

<Image title="new news.png" alt={1854} align="center" src="https://files.readme.io/e79d8b2-new_news.png">
  New broadcast screen
</Image>

* Once the news is saved, we need to publish it so that field users can see it on their device. For publishing the news click on "see details" and click on "Publish news".
* Once the news is published field user can see it on their android app.

## News option on android app

After the news is published, the field user can go to "More -> News" to see all the published news. News details can be read by pressing any of the news card.
### Whatsapp Integration

## Purpose

Being able to communicate to your beneficiaries through Whatsapp is very powerful in many scenarios of field work. It can be used to provide reminders for important events or your field-worker's visit. You can provide nudges for those who need to be follow a routine. 

#### Use cases

1. Remind everyone in a village about an upcoming Village Health and Nutrition Day (VHND)
2. Remind pregnant mothers about an upcoming ANC visit
3. Send motivational videos to all users enrolled into a de addiction programme
4. Inform a student about an upcoming interview
5. Remind a teacher and their principal about an observation session the next day
6. Remind field-workers to submit their monthly reports

## How it works

<Image align="center" width="350px" src="https://files.readme.io/5faa756-Screenshot_2023-10-13_at_1.28.13_PM.png" />

Avni uses [Glific](https://glific.org/) to send Whatsapp messages to beneficiaries and users. Glific is not just a way to connect to Whatsapp. It also provides rich communication between beneficiaries through chatbots. Glific also provides a neat way for two-way communication between beneficiaries. 

If an organisation uses Avni, a lot of information about the user is available in Avni. More importantly, Avni also understands when an important event has either happened, or is about to happen. Due to this reason, Avni is well-placed to provide reminders and nudges where they are necessary. Avni-Glific integration has three pieces. 

1. Sending of a message on a trigger. Triggers can be registration of a user, enrolment into a program or completion of a visit. When such a trigger happens, Avni can send a message to Glific at a scheduled time. 
2. Bulk send of messages for a group of users. Sometimes, the organisation needs to share a piece of information to their entire set of beneficiaries, or a sub-group within it. This can be done through a web-based mechanism
3. Sending of messages to an individual and viewing sent messages on the Avni field-app

**PS**: Interested organisations must create an account in Glific and configure Glific in Avni in order to use this functionality

### Sending messages on a trigger

In the application designer, there is an option within subject types, programs and encounter types to provide 

1. A schedule rule that specifies the time in which the message needs to be sent (once the event is triggered)
2. A message rule that helps figure out the parameters required for the message

The messages are scheduled when the event is synced to the server (or at save if you are using the Data Entry Application). 

#### Setup

First, you need to enable messaging in the Organisation Settings on the Admin page

![](https://files.readme.io/69637ed-image.png)

Next, provide details to connect to Glific into the external\_api table. This currently does not have a UI. Entries need to be made in the format. 

`insert into external_system_config(organisation_id, version, created_by_id, last_modified_by_id, created_date_time, last_modified_date_time, system_name, config)
values (2, 1, 1, 1, now(), now(), 'Glific', '{"baseUrl": "API URI field value from password manager", "phone": "Login for API field value from password manager", "password": "Password field value from password manager", "avniSystemUser": "maha@test"}'::jsonb);`

Ensure that atleast one of your form fields is marked as a phone number. This can be done by going to a **Text** or **PhoneNumber** concept, and marking its "contact\_number" value to "yes". Use this concept in the form to register the subject. It is to the value of this field, that the whatsapp message will be sent.

<Image align="center" className="border" border={true} src="https://files.readme.io/4f4f325-Screenshot_2022-11-14_at_7.07.26_PM.png" />

Once this configuration is complete, go over to the App Designer and create rules to send messages. 

There are 2 rules to be configured here. The first (Schedule rule) determines the time when the message needs to be sent. The second (Message rule) gives the parameters on the message. These parameters can be fetched from any part of the entity. The message rule should return the computed array of parameters for this entity. 

You can choose to send the message to either the subject/beneficiary or the user who made the entry. 

You can also have multiple rules defined for the same trigger. In this case, you can have a message to be sent immediately, and another to be sent after a week.

You also have the ability to not schedule a message if required by setting the `shouldSend` parameter in the response of the Schedule Rule to false. If this parameter is not set, it defaults to true i.e. the message will be scheduled.

![](https://files.readme.io/cbed815-image.png)For sending messages, for the entities(subject/encounter/enrolment) created in mobile app, the created data in mobile app should have been synced to the server.

### Bulk send of messages for a group of users

![](https://files.readme.io/958a89d-image.png)

Under Broadcast section of the Avni web application, you will now see a new option - WhatsApp. This can be used to send messages to beneficiaries, users or groups. 

Check [this](https://drive.google.com/file/d/1J2qt1s2ltJoOjQoWXdmq1GZA171usPsq/view?usp=share_link) video out, to know how to manage groups and send messages to groups.

Currently only name of the subject/user is supported as dynamic parameter. To use this, enter `@name` in the parameter input field.

### Limitations

Currently, only HSM messages is in scope of this integration. Eventually, the integration will also include triggering workflows in Glific.

### Viewing messages for a Subject, User or a Group

Currently, through the web-app, we are able to look at the Sent and Scheduled messages for a Subject, User or a Group, with a caveat that only the latest 100 messages are fetched. This is due to performance constraints in Avni-Glific data fetch.

### Debugging

* To understand the db design for debugging, checkout [this](https://avni.readme.io/docs/understanding-whatsapp-integration-tables#to-understand-the-status-of-automatic-messages) and [this](https://dbdiagram.io/d/63bb840e7d39e42284e9a83d) link.
* To view the logs printed when executing message rule or schedule rule execute the following after ssh-ing into the server machine:

  ```
  sudo su - rules-server-user
  pm2 logs --lines 1000
  ```
* If expected message not delivered, can check in the glific webapp (credentials in keeweb) to see if any error displayed beside the message in the chat. Sometimes say, when the phone no is invalid or the expected no of parameters not mentioned, an error message stating the reason for inability to deliver the message gets displayed in the chat.
* The background job that runs for sending messages from message\_request\_queue table is currently configured to run once in 5 mins.
* In order to handle scenarios where either system is unavailable, the background job retries messages that were not successfully sent. Messages older than a certain period are not retried. Default: 4 (days); Configuration: `AVNI_SEND_MESSAGES_SCHEDULED_SINCE_DAYS`
### Approval Workflow

Avni gives you the ability to review data filled by the field users using approval workflow. Data of each form can be reviewed by the supervisor and comments can be provided to correct the data. Even field users can track what all data filled by them was approved or rejected.

Approval can be configured separately for following Avni entities:

* Individual
* Encounter
* Program Enrolment
* Program Encounter
* Checklists

## Enabling approval workflow

You can enable approval workflow for your organization using the "App Designer" app. Simply go to "Forms" tab and search for the relevant form corresponding to the Entity of interest. Ex: To enable workflow for Subject Type "Demand", we would be clicking on the Gear icon for "Subject Registration" row for Subject "Demand".

<Image alt="Click on Gear Icon of the " align="center" src="https://files.readme.io/1ab51a8-Screenshot_2023-05-31_at_3.09.59_PM.png">
  Click on the "Gear Icon" of the "Subject Registration" Form
</Image>

After that toggle the  "Enable Approval" button to enable / disable the Approval workflow specific to the Entity. Avni gives you the ability to enable this feature at each form level. So if you want you can enable it for some forms and disable it for others.

<Image alt="Toggle the &#x22;Enable Approval&#x22; button" align="center" src="https://files.readme.io/a5e98cf-Screenshot_2023-05-31_at_3.07.47_PM.png">
  Toggle the "Enable Approval" button
</Image>

Apart from enabling the feature we also need to create a custom dashboard so that we can track which all forms are pending, approved, and rejected. You can also mark this dashboard as the primary dashboard from the admin app -> "user groups" -> "dashboard".

<Image title="da.png" alt={1845} align="center" src="https://files.readme.io/a72577b-da.png">
  Approval dashboard to track the forms filled by the field users. All these are standard cards and no custom query is required.
</Image>

Once the approval dashboard is ready and approval workflow is active, every time user fills a form it'll be visible under pending items in the dashboard. The supervisor/reviewing person can review these pending forms and can either approve or reject them. If rejected, the field user will see the rejected form under rejected items and can correct the entries in the form based on the rejection comment provided by the supervisor. After correction, the form will again go for approval and once it is approved it'll start showing under approved items.

<Image title="ada.png" alt={572} align="center" src="https://files.readme.io/e85a870-ada.png">
  Approval dashboard showing pending, approved, and rejected forms.
</Image>

<Image title="ar.png" alt={567} align="center" src="https://files.readme.io/71d38c6-ar.png">
  The supervisor can approve or reject a form after reviewing the details.
</Image>

<Image title="rc.png" alt={576} align="center" src="https://files.readme.io/730dc72-rc.png">
  A rejection comment can be provided to the field user using which they can correct the information.
</Image>

Please note that you can tract the forms only when the approval workflow feature is turned on. If you turn off this feature in between then all the forms filled after that will not get tracked.

### Updates to the Approval Status UI (in development)

Approval items will be grouped by Subjects and arranged in alphabetical order.

[https://github.com/avniproject/avni-client/releases/download/untagged-ccaaf92c54fc9ece8238/Screen.Recording.2023-12-12.at.3.36.38.PM.mov](https://github.com/avniproject/avni-client/releases/download/untagged-ccaaf92c54fc9ece8238/Screen.Recording.2023-12-12.at.3.36.38.PM.mov)

![]()
### Offline Reports

Avni allows you to create different indicator reports that are available offline to the field users. These reports help field users to derive more insights on the captured data. 

Creating an offline report is a two-step process. First, we need to create a report card that holds the actual query function. Second, we group multiple cards into to a dashboard.

## Creating a Report Card

Creating a new report card is no different than creating any other Avni entity. Open app designer and go to the report card tab. Click on the new report card and provide the details like name description, etc.

### Report Card Types

Report cards can be of 2 types - 'Standard' and 'Custom'. The logic used to display the values in 'Standard' type cards are already implemented in Avni whereas the logic needs to be written by the implementer for 'Custom' type cards.

1. Standard Report Cards, the different types of which are as follows (Entity specified in brackets indicates the type of entity listed on clicking on the card):

   * Pending approval (Entity Approval Statuses)

   * Approved (Entity Approval Statuses)

   * Rejected (Entity Approval Statuses)

   * Scheduled visits (Subjects)

   * Overdue visits (Subjects)

   * Recent registrations (Subjects)

   * Recent enrolments (Subjects)

   * Recent visits (Subjects)

   * Total (Subjects)

   * Comments (Subjects)

   * Call tasks (Tasks)

   * Open subject tasks (Tasks)

   * Due checklist (Individuals)

   <Image align="center" src="https://files.readme.io/5093034-Screenshot_2023-12-11_at_4.55.48_PM.png" />
2. Custom Report cards: Report card with configurable **Query**, which returns a list of Individuals as the response. Length of the list is shown on the card and on clicking the card, the list of Individuals returned is shown. Please note that the query function can return a list of Individuals or an object with these properties, ` { primaryValue: '20', secondaryValue: '(5%)',  lineListFunction  }`, here `lineListFunction` should always return the list of subjects.

![](https://files.readme.io/387d221-Report_card.png "Report card.png")

#### Standard Report Card Type Filters

Filters can be added at the report card level for certain standard report types. The following filters are supported:

1. Subject Type
2. Program
3. Encounter Type
4. Recent Duration

Subject Type, Program and Encounter Type filters are supported for 'Overdue Visits', 'Scheduled Visits', 'Total' and 'Recent' types ('Recent registrations', 'Recent enrolments', 'Recent visits').

![](https://files.readme.io/c2f3eb0a468c1e8e3efb808ccb831cf87e19c5da5ba92ae9ed99a0af619d528f-image.png) 

<br />

Filters can also be configured at the dashboard level (covered below). If a filter is configured both at the report card level and the dashboard level, the filter at the report card level is applied first. Hence, mixing of the same type of filter at both levels should be avoided as it could lead to the unintuitive behaviour of the field user selecting a value, say 'Household' for the subject type filter at the dashboard level but still seeing the numbers for the 'Individual' subject type which is configured at the report card level.

## Creating a Dashboard

After all the cards are done it's time to group them together using the dashboard. Offline Dashboards have the following sub-components:

* Sections : Visual Partitions used to club together cards of specific grouping type
* Offline (Custom) Report Cards : Usually Clickable blocks with count information about grouping of Individuals or EntityApprovals of specific type
* Filters : Configurable filters that get applied to all "Report Cards" count and listing

Users with access to the "App Designer" can Create, Modifiy or Delete Custom Dashboards as seen below. 

![](https://files.readme.io/824878a-image.png)

### Steps to configure a Custom Dashboard

* Click on the dashboard tab on the app designer and click on the new dashboard.
* This will take you to the new dashboard screen. Provide the name and description of the dashboard.
* You can create sections on this screen and
* Select all the cards you need to add to the section in the dashboard.
* After adding all the cards, you can re-arrange the cards in the order you want them to see in the field app.

<Image align="center" src="https://files.readme.io/b6a8b74-Screenshot_2023-12-11_at_4.45.34_PM.png" />

### Dashboard Filters

You can also create filters for a dashboard on the same screen by clicking on "Add Filter". This shows a popup as in the below screenshot where you can configure your filter and set the filter name, type, widget type and other values based on your filter type.

![](https://files.readme.io/91f1aa1-image.png)

Once all the changes are done. Save the dashboard.

#### For the filters to be applied to the cards in the dashboard, the code for the cards will need to handle the filters.

Sample Code for handling filters in report card:

```
'use strict';
({params, imports}) => {
//console.log('------>',params.ruleInput.filter( type => type.Name === "Gender" ));
//console.log("params:::", JSON.stringify(params.ruleInput));
  let individualList = params.db.objects('Individual').filtered("voided = false and subjectType.name = 'Individual'" )
     .filter( (individual) => individual.getAgeInYears() >= 18 && individual.getAgeInYears() <= 49  &&  individual.getObservationReadableValue('Is sterilisation done') === 'No');
  
  if (params.ruleInput) {

       let genderFilter = params.ruleInput.filter(rule => rule.type === "Gender");
       let genderValue = genderFilter[0].filterValue[0].name;
      
        console.log('genderFilter---------',genderFilter);
        console.log('genderValue---------',genderValue);        
        
      return individualList
     .filter( (individual) => {
     console.log("individual.gender:::", JSON.stringify(individual.gender.name));
     return individual.gender.name === genderValue;
     });
     }
     else return individualList;
};
```

### Assigning custom Dashboards to User Groups

Custom Dashboards created need to be assigned specifically to a User Group, in-order for Users to see it on the Avni-client mobile app. You may do this, by navigating to the "Admin" app -> "User Groups" -> (User\_GROUP) -> "Dashboards" tab, and assigning one or more Custom Dashboards to a User-Group.

In addition, You can also mark one of these Custom Dashboards as the Primary (Is Primary: True) dashboard from the "Admin" app -> "User Groups" -> (User\_GROUP) -> "Dashboards".

<Image align="center" src="https://files.readme.io/54b6434-Screenshot_2024-06-26_at_12.14.37_PM.png" />

## Using the Dashboard in the Field App

After saving the dashboard sync the field app, and from the bottom "More" tab click on the "Dashboards" option. It will take you to the dashboard screen and will show all the cards that are added to the dashboard.

<Image title="dashboard-field-app.png" alt="Report cards only passing List of subjects." align="center" width="400px" src="https://files.readme.io/8b37cf6-Screenshot_2024-06-26_at_12.15.37_PM.png">
  Report cards only passing List of subjects.
</Image>

<Image title="offline-dashboard.png" alt={566} align="center" width="400px" src="https://files.readme.io/548f99d-offline-dashboard.png">
  Report cards  returning `primaryValue` and `secondaryValue` object
</Image>

Clicking any card will take the user to the subject listing page, which will display all the subject names returned by the card query.

<Image align="center" width="400px" src="https://files.readme.io/18fb944-Subject-list-field-app.png" />

Users can click on any subject and navigate to their dashboard.

## Secondary Dashboard

### Web app configuration

As part of Avni release 8.0.0, a new feature of a secondary dashboard is added which can be configured at user group level to populate an additional option on the Avni mobile app bottom drawer to navigate to a secondary dashboard. This configuration has to be done in the user group in Avni web app. 

* By navigating to the dashboard section in a particular user group where dashboards can be added to user groups, the secondary dashboard can be defined apart from the home dashboard. As shown in the screenshot below, any dashboard can be selected as the secondary dashboard.

<Image align="center" width="1500px" src="https://files.readme.io/68ac5d9-Screenshot_2024-06-26_at_12.14.37_PM.png" />

<Image align="center" width="15px" src="https://files.readme.io/a5640e1-Se.png" />

### Secondary dashboard in mobile app

The configuration mentioned above would display the particular dashboard in the mobile app as given below. This would allow users to access the home and secondary dashboard from the bottom drawer of the mobile app instead of navigating to the more page. 

<Image align="center" width="400px" src="https://files.readme.io/d95166d-Screenshot_2024-06-26_at_12.17.40_PM.png" />

### Clash in Dashboards configuration across different UserGroups

In-case a User belongs to multiple UserGroups, where-in each has a different Primary and/or Secondary Dashboards, then the behaviour is undeterministic. I.e, any of the possible Primary Dashboards across the various UserGroups, would show up as the Primary on the app. Similar behaviour should be expected of the Secondary Dashboard as well.

## Report card query example

As mentioned earlier query can return a list of Individuals or an object with properties, ` { primaryValue: '20', secondaryValue: '(5%)',  lineListFunction  }`. DB instance is passed using the params and useful libraries like lodash and moment are available in the imports parameter of the function. Below are some examples of writing the `lineListFunction`.

The below function returns a list of pregnant women having any high-risk conditions.

```javascript High risk condition women
'use strict';
({params, imports}) => {
    const isHighRiskWomen = (enrolment) => {
        const weight = enrolment.findLatestObservationInEntireEnrolment('Weight');
        const hb = enrolment.findLatestObservationInEntireEnrolment('Hb');
        const numberOfLiveChildren = enrolment.findLatestObservationInEntireEnrolment('Number of live children');
        return (weight && weight.getReadableValue() < 40) || (hb && hb.getReadableValue() < 8) ||
            (numberOfLiveChildren && numberOfLiveChildren.getReadableValue() > 3)
    };
    return {
      lineListFunction: () => params.db.objects('Individual')
        .filtered(`SUBQUERY(enrolments, $enrolment, SUBQUERY($enrolment.encounters, $encounter, $encounter.encounterType.name = 'Monthly monitoring of pregnant woman' and $encounter.voided = false).@count > 0 and $enrolment.voided = false and voided = false).@count > 0`)
        .filter((individual) => individual.voided === false && _.some(individual.enrolments, (enrolment) => enrolment.program.name === 'Pregnant Woman' && isHighRiskWomen(enrolment)))
    }
};
```

It is important to write optimised query and load very less data in memory for processing. There will be the cases where query can't be written in realm and we need to load the data in memory, but remember more data we load into the memory slower will be the reports. As an example consider below two cases, in the first case we directly query realm to fetch all the individuals enrolled in Child program, but in the second case we first load all individuals into memory and then filter those cases. 

```javascript Query in Realm context (better performance)
'use strict';
({params, imports}) => ({
    lineListFunction: () => params.db.objects('Individual')
        .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and voided = false).@count > 0`)
});
```
```javascript Query in app context (poor performance)
'use strict';
({params, imports}) => {
    return params.db.objects('Individual')
        .filter((individual) => individual.voided === false && _.some(individual.enrolments, (enrolment) => enrolment.program.name === 'Child'))
};
```

For using the filters in the rules also check section on Dashboard Card Rule here - [Writing rules](doc:writing-rules)

## Performance of queries

The report cards requires one to return a list individuals. This can be done by:

1. Performing db.objects on Individual and filtering them down.
2. Performing db.objects on descendants of Subject (like encounter, enrolment), filter them down, then return list of Individuals from each filtered object. Example is given below.

## Implementation Patterns for writing performant queries

Please refer to [this reference for Realm Query Language](https://www.mongodb.com/docs/atlas/device-sdks/realm-query-language/).

To understand difference between filter and filtered that is referred below, please see, [https://avni.readme.io/docs/writing-rules#difference-between-filter-and-filtered](https://avni.readme.io/docs/writing-rules#difference-between-filter-and-filtered)

Please also get in touch with platform team if you identify a new pattern and a new type of requirement where none of the following fits.

1. Filter based on chronological data
   1. The matching has to be done on specific chronological descendant entity. e.g. `first` encounter of a specific type, `recent` encounter of specific type.
   2. In this case performing `db.objects` on Individual will lead to either very complex queries or will demand performing filtering in memory using JS.
   3. In this case one can do `db.objects` on descendant entity and then use something like `.filtered('TRUEPREDICATE sort(programEnrolment.individual.uuid asc , encounterDateTime desc) Distinct(programEnrolment.individual.uuid)')` to get the chronological relevant entity at the top in each group. Distinct keyword picks only the first entity in the sorted group.
   4. After performing `filtered`, one can return Subjects by performing `list.map(enc => enc.programEnrolment.individual)`
2. Filter based exact observation value
   1. Matching observations by loading them in memory and calling JS functions will lead to slower reports.
   2. A combination of `subquery` and realm query based match will have much better performance. For example: matching observation that has a specific value - `SUBQUERY(observations, $observation, $observation.concept.name = 'Phone number' and $observation.valueJSON CONTAINS '7555795537'`
3. Filter based on exact specific coded observation value
   1. Matching coded value using its name will require one to load data in memory and perform the match. But this could result in sub-optimal performance. Hence the readability of the report should be sacrificed here for performance.
   2. The query will be like `SUBQUERY(observations, $observation, $observation.concept.uuid = 'Marital Status' and $observation.valueJSON CONTAINS 'fb1080b4-d1ec-4c87-a10d-3838ba9abc5b'`
   3. Please note here that multiple observations can be matched here using OR, AND etc.
4. Filter based on a custom observation value expression.
   1. Instead of matching against a single value match using numeric expression. e.g. match BMI greater than 20.0.
   2. This kind of match cannot be done using realm query and implementing them in JS may result in poor performance.
   3. In such cases we should find out the significance of magic number 20.0. Usually we also have a coded decision observation associated that has meaning behind 20.0, like malnutrition status, BMI Status etc. If there is one then we should match against that using pattern 3 above. If such observation is not present then consider adding them to decisions.
   4. In requirements where such associated coded observation are not present and cannot be added, the performance will depend on the number of observations and entities being matched. If this number is large the performance is expected to be slow, it is better to avoid making reports, or move such reports to their own dashboard - so that they don't impact the usability of other reports.

### Detailed examples

#### DEPRECATED: Avoid using generic functions:

* The following is deprecated cause we should use `Filter based on chronological data` pattern from above.
* To find observation of a concept avoid using the function `findLatestObservationInEntireEnrolment` unless absolutely necessary since it searches for the observation in all encounters and enrolment observations. Use specific functions.
* Eg: To find observation in enrolment can use the function `enrolment.findObservation` or to find observations in specific encounter type can get the encounters using `enrolment.lastFulfilledEncounter(...encounterTypeNames)` and then find observation. Refer code examples for the below 3 usecases.
* ```text Usecase 1
  Find children with birth weight less than 2. Birth weight is captured in enrolment
  ```
  ```javascript Recommended way
  'use strict';
  ({params, imports}) => {
      const isLowBirthWeight = (enrolment) => {
          const obs = enrolment.findObservation('Birth Weight');
          return obs ? obs.getReadableValue() <= 2 : false;
      };
      return params.db.objects('Individual')
          .filtered(`voided = false and SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false).@count > 0`)
          .filter((individual) => _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && _.isNil(enrolment.programExitDateTime) && !enrolment.voided && isLowBirthWeight(enrolment)))
  };
  ```
  ```javascript Not recommended way
  'use strict';
  ({params, imports}) => {
      const isLowBirthWeight = (enrolment) => {
          const obs = enrolment.findLatestObservationInEntireEnrolment('Birth Weight');
          return obs ? obs.getReadableValue() <= 2 : false;
      };
      return params.db.objects('Individual')
          .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false and SUBQUERY($enrolment.observations, $observation, $observation.concept.uuid = 'c82cd1c8-d0a9-4237-b791-8d64e52b6c4a').@count > 0 and voided = false).@count > 0`)
          .filter((individual) => individual.voided === false && _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && isLowBirthWeight(enrolment)))
  };
  ```
  ```Text How optimized
  do voided check first in realm instead of JS - helps in filtering ahead
  Check for concept where it is used - no need to check in all encounters and enrolment
  ```
  ```Text Usecase 2
  Find MAM status from value of Nutritional status concept captured in Child Followup encounter
  ```
  ```javascript Recommended way
  // While this example is illustrating the right JS function to use, but it may be better to filter(ed)
  // encounter schema than to start with Individual
  // i.e. someting like db.objects("ProgramEncounter").filtered("programEnrolment.individual.voided = false AND programEnrolment.voided = false AND ...")
  // then return Individuals using .map(enc => enc.programEnrolment.individual) after filtering all program encounters
  'use strict';
  ({params, imports}) => {
      const isUndernourished = (enrolment) => {
          const encounter = enrolment.lastFulfilledEncounter('Child Followup'); 
          if(_.isNil(encounter)) return false; 
         
         const obs = encounter.findObservation("Nutritional status of child");
         return (!_.isNil(obs) && _.isEqual(obs.getValueWrapper().getValue(), "MAM"));
      };
      
      return params.db.objects('Individual')
          .filtered(`voided = false and SUBQUERY(enrolments, $enrolment,$enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false and SUBQUERY($enrolment.encounters, $encounter, $encounter.encounterType.name = 'Child Followup' and $encounter.voided = false).@count > 0).@count > 0`)
          .filter((individual) => individual.getAgeInMonths() > 6 && _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && _.isNil(enrolment.programExitDateTime) && !enrolment.voided && isUndernourished(enrolment)))
  };
  ```
  ```javascript Not recommended way
  'use strict';
  ({params, imports}) => {
      const isUndernourished = (enrolment) => {
          const obs = enrolment.findLatestObservationInEntireEnrolment('Nutritional status of child');
          return obs ? _.includes(['MAM'], obs.getReadableValue()) : false;
      };
      return params.db.objects('Individual')
          .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false and SUBQUERY($enrolment.encounters, $encounter, $encounter.encounterType.name = 'Child Followup' and $encounter.voided = false and SUBQUERY($encounter.observations, $observation, $observation.concept.uuid = '3fb85722-fd53-43db-9e8b-d34767af9f7e').@count > 0).@count > 0 and voided = false).@count > 0`)
          .filter((individual) => individual.voided === false && individual.getAgeInMonths() > 6 && _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && isUndernourished(enrolment)))
  };
  ```
  ```Text How optimized
  Check only in specific encounter type
  ```
  ```Text Usecase 3
  Find sick children using the presence of value for concept 'Refer to the hospital for' which is not a mandatory concept
  ```
  ```javascript Recommended way
  // also see comments in Recommended way for use case 2
  'use strict';
  ({params, imports}) => {
      const isChildSick = (enrolment) => {
        const encounter = enrolment.lastFulfilledEncounter('Child Followup', 'Child PNC'); 
        if(_.isNil(encounter)) return false; 
         
        const obs = encounter.findObservation('Refer to the hospital for');
        return !_.isNil(obs);
      };
      
      return params.db.objects('Individual')
          .filtered(`voided = false and SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false).@count > 0`)
          .filter(individual => _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && _.isNil(enrolment.programExitDateTime) && !enrolment.voided && isChildSick(enrolment)))
  };
  ```
  ```javascript Not recommended way
  'use strict';
  ({params, imports}) => {
      const isChildSick = (enrolment) => {
           const obs = enrolment.findLatestObservationFromEncounters('Refer to the hospital for');    
           return obs ? obs.getReadableValue() != undefined : false;
      };
      
      return params.db.objects('Individual')
          .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false).@count > 0`)
          .filter((individual) => individual.voided === false && (_.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && isChildSick(enrolment))) )
  };
  ```
  ```Text How optimized
  Check only in last encounter, not all encounters since the concept is not a mandatory concept. 
  Using findLatestObservationFromEncounters will check in all encounters and mark child has sick even if the concept value had represented sick in any of the previous encounters, resulting in bug, since the concept is not a mandatory concept.
  ```

#### Based on the use case decide whether to write the logic using realm query or JS.

* Not always achieving the purpose using realm queries might be efficient/possible. 

  * **DEPRECATED** cause we should use `Filter based on chronological data` pattern from above. Eg: consider a use case where a mandatory concept is used in a program encounter. Now to check the latest value of the concept, its sufficient to check the last encounter and need not iterate all encounters. Since realm subquery doesn't support searching only in the last encounter, for such usecases, using realm queries not only becomes slow and also sometimes inappropriate depending on the usecase. So in such cases, using JS code for the logic, is more efficient. (refer the below code example)

    * ```Text Usecase
      Find dead children using concept value captured in encounter cancel or program exit form.
      ```
      ```javascript Recommended way
      'use strict';
      ({params, imports}) => { 
         const moment = imports.moment;

         const isChildDead = (enrolment) => {
            const exitObservation = enrolment.findExitObservation('29238876-fbd8-4f39-b749-edb66024e25e');
            if(!_.isNil(exitObservation) && _.isEqual(exitObservation.getValueWrapper().getValue(), "cbb0969c-c7fe-4ce4-b8a2-670c4e3c5039"))
              return true;
            
            const encounters = enrolment.getEncounters(false);
            const sortedEncounters = _.sortBy(encounters, (encounter) => {
            return _.isNil(encounter.cancelDateTime)? moment().diff(encounter.encounterDateTime) : 
            moment().diff(encounter.cancelDateTime)}); 
            const latestEncounter = _.head(sortedEncounters);
            if(_.isNil(latestEncounter)) return false; 
             
            const cancelObservation = latestEncounter.findCancelEncounterObservation('0066a0f7-c087-40f4-ae44-a3e931967767');
            if(_.isNil(cancelObservation)) return false;
            return _.isEqual(cancelObservation.getValueWrapper().getValue(), "cbb0969c-c7fe-4ce4-b8a2-670c4e3c5039")
          };

      return params.db.objects('Individual')
              .filtered(`voided = false`)
              .filter(individual => _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && isChildDead(enrolment)));
      }
      ```
      ```javascript Not recommended way
      'use strict';
      ({params, imports}) => {

      return params.db.objects('Individual')
              .filtered(`subquery(enrolments, $enrolment, $enrolment.program.name == "Child" and subquery(programExitObservations, $exitObservation, $exitObservation.concept.uuid ==  "29238876-fbd8-4f39-b749-edb66024e25e" and ( $exitObservation.valueJSON ==  '{"answer":"cbb0969c-c7fe-4ce4-b8a2-670c4e3c5039"}')  ).@count > 0 ).@count > 0 OR subquery(enrolments.encounters, $encounter, $encounter.voided == false and subquery(cancelObservations, $cancelObservation, $cancelObservation.concept.uuid ==  "0066a0f7-c087-40f4-ae44-a3e931967767" and ( $cancelObservation.valueJSON ==  '{"answer":"cbb0969c-c7fe-4ce4-b8a2-670c4e3c5039"}')  ).@count > 0 ).@count > 0`)
              .filter(ind => ind.voided == false)
      };
      ```
      ```Text How optimized
      Moving to JS since realm query iterates through all encounters which can be avoided in JS
      In this cases since the intention is to find if child is dead, hence it can be assumed to be captured in the last encounter or in program exit form based on the domain knowledge

      ```
  * Please also refer to `Filter based on a custom observation value expression` pattern above, before using this. Consider another use case, where observations of numeric concepts need to be compared. This is not possible to achieve via realm query since the solution would involve the need for JSON parsing of the stored observation. Hence JS logic is appropriate here. (refer below code example)
    * ```Text Usecase
      Find children with birth weight less than 2. Birth weight is captured in enrolment
      ```
      ```javascript Recommended way
      'use strict';
      ({params, imports}) => {
          const isLowBirthWeight = (enrolment) => {
              const obs = enrolment.findObservation('Birth Weight');
              return obs ? obs.getReadableValue() <= 2 : false;
          };
          return params.db.objects('Individual')
              .filtered(`voided = false and SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false).@count > 0`)
              .filter((individual) => _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && _.isNil(enrolment.programExitDateTime) && !enrolment.voided && isLowBirthWeight(enrolment)))
      };
      ```
      ```javascript Not recommended way
      'use strict';
      ({params, imports}) => {
          const isLowBirthWeight = (enrolment) => {
              const obs = enrolment.findLatestObservationInEntireEnrolment('Birth Weight');
              return obs ? obs.getReadableValue() <= 2 : false;
          };
          return params.db.objects('Individual')
              .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false and SUBQUERY($enrolment.observations, $observation, $observation.concept.uuid = 'c82cd1c8-d0a9-4237-b791-8d64e52b6c4a').@count > 0 and voided = false).@count > 0`)
              .filter((individual) => individual.voided === false && _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && isLowBirthWeight(enrolment)))
      };
      ```
      ```Text How optimized
      Moving to realm query for checking birth weight was not possible. If it were a equals comparison it can be achieved using 'CONTAINS' in realm
      ```
* But in cases where time complexity is the same for both cases, writing realm queries would be efficient to achieve the purpose. (refer below code example). Also refer to `Filter based on a custom observation value expression` pattern above.

  * ```Text Usecase
    Find 13 months children who are completely immunised
    ```
    ```javascript Recommended way
    'use strict';
    ({params, imports}) => {        
       return params.db.objects('Individual')
            .filtered(`voided = false and SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false and SUBQUERY(checklists, $checklist, SUBQUERY(items, $item, ($item.detail.concept.name = 'BCG' OR $item.detail.concept.name = 'Polio 0' OR $item.detail.concept.name = 'Polio 1' OR $item.detail.concept.name = 'Polio 2' OR $item.detail.concept.name = 'Polio 3' OR $item.detail.concept.name = 'Pentavalent 1' OR $item.detail.concept.name = 'Pentavalent 2' OR $item.detail.concept.name = 'Pentavalent 3' OR $item.detail.concept.name = 'Measles 1' OR $item.detail.concept.name = 'Measles 2' OR $item.detail.concept.name = 'FIPV 1' OR $item.detail.concept.name = 'FIPV 2' OR $item.detail.concept.name = 'Rota 1' OR $item.detail.concept.name = 'Rota 2') and $item.completionDate <> nil).@count = 14).@count > 0).@count > 0`)
            .filter(individual => individual.getAgeInMonths() >= 13)     
    };
    ```
    ```javascript Not recommended way
    'use strict';
    ({params, imports}) => {
        const isChildGettingImmunised = (enrolment) => {
            if (enrolment.hasChecklist) {
                const vaccineToCheck = ['BCG', 'Polio 0', 'Polio 1', 'Polio 2', 'Polio 3', 'Pentavalent 1', 'Pentavalent 2', 'Pentavalent 3', 'Measles 1', 'Measles 2', 'FIPV 1', 'FIPV 2', 'Rota 1', 'Rota 2'];
                const checklist = _.head(enrolment.getChecklists());
                return _.chain(checklist.items)
                    .filter(({detail}) => _.includes(vaccineToCheck, detail.concept.name))
                    .every(({completionDate}) => !_.isNil(completionDate))
                    .value();
            }
            return false;
        };

        return params.db.objects('Individual')
            .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false).@count > 0`)
            .filter((individual) => individual.voided === false && individual.getAgeInMonths() >= 13 && _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && isChildGettingImmunised(enrolment)))
    };
    ```
    ```Text How optimized
    Moving to realm query since no of children with age < 13 months were less
    ```
* In most cases, filtering as much as possible using realm queries (for cases like voided checks) and then doing JS filtering on top of it if needed, would be appropriate. (refer the below code example)

  * ```Text Usecase
    Find dead children using concept value captured in encounter cancel or program exit form.
    ```
    ```javascript Recommended way
    'use strict';
    ({params, imports}) => { 
       const moment = imports.moment;

       const isChildDead = (enrolment) => {
          const exitObservation = enrolment.findExitObservation('29238876-fbd8-4f39-b749-edb66024e25e');
          if(!_.isNil(exitObservation) && _.isEqual(exitObservation.getValueWrapper().getValue(), "cbb0969c-c7fe-4ce4-b8a2-670c4e3c5039"))
            return true;
          
          const encounters = enrolment.getEncounters(false);
          const sortedEncounters = _.sortBy(encounters, (encounter) => {
          return _.isNil(encounter.cancelDateTime)? moment().diff(encounter.encounterDateTime) : 
          moment().diff(encounter.cancelDateTime)}); 
          const latestEncounter = _.head(sortedEncounters);
          if(_.isNil(latestEncounter)) return false; 
           
          const cancelObservation = latestEncounter.findCancelEncounterObservation('0066a0f7-c087-40f4-ae44-a3e931967767');
          if(_.isNil(cancelObservation)) return false;
          return _.isEqual(cancelObservation.getValueWrapper().getValue(), "cbb0969c-c7fe-4ce4-b8a2-670c4e3c5039")
        };

    return params.db.objects('Individual')
            .filtered(`voided = false`)
            .filter(individual => _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && isChildDead(enrolment)));
    }
    ```
    ```javascript Not recommended way
    'use strict';
    ({params, imports}) => {

    return params.db.objects('Individual')
            .filtered(`subquery(enrolments, $enrolment, $enrolment.program.name == "Child" and subquery(programExitObservations, $exitObservation, $exitObservation.concept.uuid ==  "29238876-fbd8-4f39-b749-edb66024e25e" and ( $exitObservation.valueJSON ==  '{"answer":"cbb0969c-c7fe-4ce4-b8a2-670c4e3c5039"}')  ).@count > 0 ).@count > 0 OR subquery(enrolments.encounters, $encounter, $encounter.voided == false and subquery(cancelObservations, $cancelObservation, $cancelObservation.concept.uuid ==  "0066a0f7-c087-40f4-ae44-a3e931967767" and ( $cancelObservation.valueJSON ==  '{"answer":"cbb0969c-c7fe-4ce4-b8a2-670c4e3c5039"}')  ).@count > 0 ).@count > 0`)
            .filter(ind => ind.voided == false);
    };
    ```
    ```Text How optimized
    Moving to JS since realm query iterates through all encounters which can be avoided in JS
    In this cases since the intention is to find if child is dead it can be assumed to be captured in the last encounter or in program exit form based on the domain knowledge

    ```

Also check - [https://avni.readme.io/docs/writing-rules#using-paramsdb-object-when-writing-rules](https://avni.readme.io/docs/writing-rules#using-paramsdb-object-when-writing-rules)

#### DEPRECATED. Use Concept UUIDs instead of their names for comparison

Please check - `Filter based on a custom observation value expression` pattern above.

Though not much performance improvement, using concept uuids(for comparing with concept answers), instead of getting its readable values did provide minor improvement(in seconds) when need to iterate through thousands of rows. (refer below code example)

* ```Text Usecase
  Find children with congential abnormality based on values of certain concepts
  ```
  ```javascript Recommended way
  'use strict';
  ({params, imports}) => {
      const isChildCongenitalAnamoly = (enrolment) => {
         const _ = imports.lodash;
      
         const encounter = enrolment.lastFulfilledEncounter('Child PNC'); 
         if(_.isNil(encounter)) return false; 
         
         const obs1 = encounter.findObservation("Is the infant's mouth cleft pallet seen?");
         const condition2 = obs1 ? obs1.getValueWrapper().getValue() === '3a9fe9a1-a866-47ed-b75c-c0071ea22d97' : false;
           
         const obs2 = encounter.findObservation('Is there visible tumor on back or on head of infant?');
         const condition3 = obs2 ? obs2.getValueWrapper().getValue() === '3a9fe9a1-a866-47ed-b75c-c0071ea22d97' : false;
           
         const obs3 = encounter.findObservation("Is foam coming from infant's mouth continuously?");
         const condition4 = obs3 ? obs3.getValueWrapper().getValue() === '3a9fe9a1-a866-47ed-b75c-c0071ea22d97' : false;
                    
           return condition2 || condition3 || condition4;
      };
      
      const isChildCongenitalAnamolyReg = (individual) => {
           const obs = individual.findObservation('Has any congenital abnormality?');
           return obs ? obs.getValueWrapper().getValue() === '3a9fe9a1-a866-47ed-b75c-c0071ea22d97' : false;
      };
      
      return params.db.objects('Individual')
          .filtered(`voided = false and SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false).@count > 0`)
          .filter((individual) => (isChildCongenitalAnamolyReg(individual) || 
              _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && _.isNil(enrolment.programExitDateTime) && !enrolment.voided && isChildCongenitalAnamoly(enrolment) )) )
  };
  ```
  ```javascript Not recommended way
  'use strict';
  ({params, imports}) => {
      const isChildCongenitalAnamoly = (enrolment) => {
           
           const obs1 = enrolment.findLatestObservationInEntireEnrolment("Is the infant's mouth cleft pallet seen?");
           const condition2 = obs1 ? obs1.getReadableValue() === 'Yes' : false;
           
       const obs2 = enrolment.findLatestObservationInEntireEnrolment('Is there visible tumor on back or on head of infant?');
           const condition3 = obs2 ? obs2.getReadableValue() === 'Yes' : false;
           
           const obs3 = enrolment.findLatestObservationInEntireEnrolment("Is foam coming from infant's mouth continuously?");
           const condition4 = obs3 ? obs3.getReadableValue() === 'Yes' : false;
                    
           return condition2 || condition3 || condition4;
      };
      
      const isChildCongenitalAnamolyReg = (individual) => {
           const obs = individual.getObservationReadableValue('Has any congenital abnormality?');
           return obs ? obs === 'Yes' : false;
      };
      
      return params.db.objects('Individual')
          .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Child' and $enrolment.programExitDateTime = null and $enrolment.voided = false).@count > 0`)
          .filter((individual) => individual.voided === false && (isChildCongenitalAnamolyReg(individual) || 
              _.some(individual.enrolments, enrolment => enrolment.program.name === 'Child' && isChildCongenitalAnamoly(enrolment) )) )
  };
  ```
  ```Text How optimized
  Use concept uuid instead of readableValue to compare and check for value only in specific encounter type where the concept was used
  ```

## Nested Report Cards

Frequently there are cases where across report cards very similar logic is used and only a value used for comparison, changes. Eg: in one of our partner organisations, we load 'Total SAM children' and 'Total MAM children'. For rendering each takes around 20-30s. And hence the dashboard nos doesn't load until both the report card results are calculated and it makes the user to wait for a minute. If the logic is combined, we can render the results in 30s since it would need only retrieval from db and iterating once.\
The above kind of scenarios also lead to code duplication across report cards and when some requirement changes, then the change needs to be done in both.

In-order to handle such scenarios, we recommend using the Nested Report Card. This is a non-standard report card, which has the ability to show upto a maximum of **9** report cards, based on a single Query's response.

The query can return an object with "reportCards" property, which holds within it an array of objets with properties, ` { cardName: 'nested-i', cardColor: '#123456', textColor: '#654321', primaryValue: '20', secondaryValue: '(5%)',  lineListFunction: () => {/*Do something*/} }`. DB instance is passed using the params and useful libraries like lodash and moment are available in the imports parameter of the function. 

```javascript Nested Report Card Query Format
'use strict';
({params, imports}) => {
    /*
    Business logic
    */
    return {reportCards: \[
        {
            cardName: 'nested-i',
            cardColor: '#123456',
            textColor: '#654321',
            primaryValue: '20',
            secondaryValue: '(5%)',
            lineListFunction: () => {
                /*Do something*/
            }
        },
        {
            cardName: 'nested-i+1',
            cardColor: '#123456',
            textColor: '#654321',
            primaryValue: '20',
            secondaryValue: '(5%)',
            lineListFunction: () => {
                /*Do something*/
            }
        }
    ]
	}
};
```
```Text Mandatory Fields
- primaryValue
- secondaryValue
- lineListFunction
```
```Text Optional fields
- cardName
- cardColor
- textColor
```

```javascript Sample Nested Report card Query
// Documentation - https://docs.mongodb.com/realm-legacy/docs/javascript/latest/index.html#queries

'use strict';
({params, imports}) => {
const _ = imports.lodash;
const moment = imports.moment;

const substanceUseDue = (enrolment) => {
    const substanceUseEnc = enrolment.scheduledEncountersOfType('Record Substance use details');
    
    const substanceUse = substanceUseEnc
    .filter((e) => moment().isSameOrAfter(moment(e.earliestVisitDateTime)) && e.cancelDateTime === null && e.encounterDateTime === null );
    
    return substanceUse.length > 0 ? true : false;
    
    };
const indList = params.db.objects('Individual')
        .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Substance use' and $enrolment.programExitDateTime = null and $enrolment.voided = false and SUBQUERY($enrolment.encounters, $encounter, $encounter.encounterType.name = 'Record Substance use details' and $encounter.voided = false ).@count > 0 and voided = false).@count > 0`)
        .filter((individual) => _.some(individual.enrolments, enrolment => substanceUseDue(enrolment)
        )); 
        
const includingVoidedLength = indList.length;
const excludingVoidedLength = 6;  
const llf1 = () => { return params.db.objects('Individual')
        .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Substance use' and $enrolment.programExitDateTime = null and $enrolment.voided = false and SUBQUERY($enrolment.encounters, $encounter, $encounter.encounterType.name = 'Record Substance use details' and $encounter.voided = false ).@count > 0 and voided = false).@count > 0`)
        .filter((individual) => _.some(individual.enrolments, enrolment => substanceUseDue(enrolment)
        ));    
        };
           

return {reportCards: [{
      cardName: 'nested 1',
      textColor: '#bb34ff',
      primaryValue: includingVoidedLength,   
      secondaryValue: null,
      lineListFunction: llf1
  },
  {
      cardName: 'nested 2',
      cardColor: '#ff34ff',
      primaryValue: excludingVoidedLength,   
      secondaryValue: null,
      lineListFunction: () => {return params.db.objects('Individual')
        .filtered(`SUBQUERY(enrolments, $enrolment, $enrolment.program.name = 'Substance use' and $enrolment.programExitDateTime = null and $enrolment.voided = false and SUBQUERY($enrolment.encounters, $encounter, $encounter.encounterType.name = 'Record Substance use details' and $encounter.voided = false ).@count > 0 and voided = false).@count > 0`)
        .filter((individual) => individual.voided === false  && _.some(individual.enrolments, enrolment => substanceUseDue(enrolment)
        ));}
  }]}
};
```

### Screenshot of Nested Custom Dashboard Report Card Edit screen on Avni Webapp

<Image align="center" src="https://files.readme.io/ecdd996-Screenshot_2024-01-25_at_5.15.20_PM.png" />

### Screenshot of Nested Report Cards in Custom Dashboard in Avni Client

<Image align="center" width="576px" src="https://files.readme.io/dca68e5-Screenshot_2024-01-25_at_5.19.04_PM.png" />

![]()

Note: If there is a mismatch between the count of nested report cards configured and the length of reportCards property returned by the query response, then we show an appropriate error message on all Nested Report Cards corresponding to the Custom Report Card.

<Image align="center" width="576px" src="https://files.readme.io/82d8ca0-Screenshot_2024-01-25_at_5.23.56_PM.png" />

<br />

## Default Dashboard and Report Cards

Starting in release 10.0, any newly created organisation will have a default dashboard created with the following sections, standard cards and filters.

Default Dashboard (Filters: 'Subject Type' and 'As On Date')

1. Visit Details Section
   1. Scheduled Visits Card
   2. Overdue Visits Card
2. Recent Statistics Section
   1. Recent Registrations Card (Recent duration filter configured as - 1 day)
   2. Recent Enrolments Card (Recent duration filter configured as - 1 day)
   3. Recent Visits Card (Recent duration filter configured as - 1 day)
3. Registration Overview Section
   1. Total Card

This default dashboard will also be assigned as Primary dashboard on the 'Everyone' user group. 

## Reference screen-shots of Avni-Client Custom Dashboard with Approvals ReportCards and Location filter

<Image alt="Default state of Approvals Report Cards without any filter applied" align="center" border={true} src="https://files.readme.io/e35888a-Screenshot_2023-12-12_at_12.46.46_PM.png">
  Default state of Approvals Report Cards without any filter applied
</Image>

***

<Image alt="Custom Dashboards filter page" align="center" border={true} src="https://files.readme.io/576efec-Screenshot_2023-12-12_at_12.47.01_PM.png">
  Custom Dashboards filter page
</Image>

***

<Image alt="State of Approvals Report Cards after the Location filter was applied" align="center" border={true} src="https://files.readme.io/c5ac6f6-Screenshot_2023-12-12_at_12.47.25_PM.png">
  State of Approvals Report Cards after the Location filter was applied
</Image>

***
### Etl Schema And Reporting

The public datamodel is not suited for easy reporting because of a few reasons. 

1. jsonb fields 
   1. Cannot be indexed because GIN index and RLS do not work well with each other
   2. Cannot be easily explored because of the way it is setup
2. Analytic queries typically require full table scans, and reducing the data to just one organisation makes it easier
3. Address fields are hierarchical, and are not easy to handle for reports. Especially when we need grouping by different levels of address
4. Many times, pre-created rollups might help make reports easier

### The ETL service

The Avni ETL service fixes the above problems by moving data to a denormalized database that is suited for reporting. It creates tables of the form

* For all subject types, a table called \<subjectType\>
* For all general encounters, a table called \<subjectType\>\_\<encounterType\> and \<subjectType\>\_\<encounterType>\_cancel
* For all programs, a table called \<subjectType\>\_\<programName\> and \<subjectType\>\_\<programName\>\_exit
* For all program encounters, a table called \<subjectType\>\_\<programName\>\_\<encounterType\> and \<subjectType\>\_\<programName\>\_\<encounterType\>\_cancel
* An address table for all addresses
* A media table for all media
* For every Repeatable Question Group present for an entity(Subject, Encounter, ProgramEnrolment or ProgramEncounter), we'll have a separate secondary table called  \<parentTable\>\_\<question\_group\_concept\_name\>

#### Other details of the service

* Data is moved from the public schema to a schema defined by the schemaName of the organisation
* Data is moved incrementally every hour
* Analytics needs to be enabled for an organisation in order for it to work (from the Organisation edit screen of Admin)

### Management of ETL process for an organisation

ETL management for an organisation is only available for support users and not to the users of the organisation itself including administrators. You require super admin login to perform these activities.

* ETL can be enabled or disabled from the organisation edit screen.
* In organisation listing the enable disable status is displayed. One can also open an organisation to check the status. Note: that in listing the status is sometimes shown as blank. This is a defect but we have not been able to fix it. In such a case please check organisation show screen.
* If you want to run the ETL process immediately for an organisation (for which it is already enabled) - then you need to disable and enable. The rescheduling of the job will cause it to run after 10 seconds of enabling.

### Checking error of ETL job of an organisation

GET `{{origin}}/etl/job/{{orgUUID}}` with `auth-token` in header for super admin user.

e.g. [https://app.avniproject.org/etl/job/392bcc3e-0b04-495c-861a-64589d2692b4](https://app.avniproject.org/etl/job/392bcc3e-0b04-495c-861a-64589d2692b4)

You can find replace \\n\\t with newline to get a clearer stack trace.
### Access Control

Before the introduction of Access Control, organisation users with access to the field app could access all functions (i.e. registration, enrolments, search etc.) in the app. There was a need for some implementations to limit access to specific functions in order to reduce the number of options visible to end users and simplify the workflow for them while also providing a mechanism for access control.

Access Control is implemented via User Groups to facilitate this need. This functionality is available to Organisation admins in the Admin section of the Web app under the User Groups menu.

# Applicability

* The access control rules are applicable in the field app, data entry app, and the web app.
* Access control is not applicable to the reporting app.

# User Groups

User Groups represent a collection of users and a set of privileges allowed to these users. User with EditUserGroup and EditUserConfiguration privilege can define as many groups as they need to define the access control required for their organisation. Each group can be assigned a set of privileges (or all privileges using the switch available at the top).

Each user can be added to multiple groups.

## Privileges are Additive

If any of the groups that a user belongs to allows a particular privilege, the user will have access to that function.

## Default Groups

By default, the system creates an `Everyone` and an `Administrators` group. `Everyone` group includes all the users in the organisation. `Administrators` group grants all the privileges to allow access to all the functionality.

<Image align="center" width="500px" src="https://files.readme.io/9c003c1-Screenshot_2023-08-08_at_3.46.23_PM.png" />

Users cannot be removed from `Everyone` group but the privileges associated with this group can be modified. The has all privileges flag cannot be reset for `Administrators` group.

## Privileges

The following privileges are available in order to allow organisation admins to configure fine-grained access to functions for the org users. These privileges are configurable per entity type i.e. a group could have the 'View subject' privilege allowed for subject type 'abc' but disallowed for subject type 'xyz'.

* The Subject level privileges are configurable for each Subject Type setup in your organisation.
* The Enrolment level privileges are configurable for each program setup in your organisation.
* The Encounter level privileges are configurable for each Encounter Type (General or Program) setup in your organisation.
* The Checklist level privileges are configurable for each Program containing checklists for your organisation. 

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Entity Type
      </th>

      <th>
        Privilege
      </th>

      <th>
        Explanation
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        Subject
      </td>

      <td>
        View subject
      </td>

      <td>
        Controls whether field users can see subjects of a particular subject type in the app.  

        All other privileges are dependent on this privilege. If disallowed, field users cannot see or access any functionality for the specific subject type.
      </td>
    </tr>

    <tr>
      <td>
        Subject
      </td>

      <td>
        Register subject
      </td>

      <td>
        Allows field users to register new subjects.
      </td>
    </tr>

    <tr>
      <td>
        Subject
      </td>

      <td>
        Edit subject
      </td>

      <td>
        Allows field users to edit previously registered subjects.
      </td>
    </tr>

    <tr>
      <td>
        Subject
      </td>

      <td>
        Void subject
      </td>

      <td>
        Allows field users to void previously registered subjects.
      </td>
    </tr>

    <tr>
      <td>
        Subject
      </td>

      <td>
        Add member\*
      </td>

      <td>
        Allows field users to add a member to household subject.
      </td>
    </tr>

    <tr>
      <td>
        Subject
      </td>

      <td>
        Edit member\*
      </td>

      <td>
        Allows field users to edit previously added household members.
      </td>
    </tr>

    <tr>
      <td>
        Subject
      </td>

      <td>
        Remove member\*
      </td>

      <td>
        Allows field users to remove previously added household members.
      </td>
    </tr>

    <tr>
      <td>
        Enrolment
      </td>

      <td>
        Enrol subject
      </td>

      <td>
        Allows field users to enrol a subject into a program.
      </td>
    </tr>

    <tr>
      <td>
        Enrolment
      </td>

      <td>
        View enrolment details
      </td>

      <td>
        Allows field users to view the program enrolment details for a subject.
      </td>
    </tr>

    <tr>
      <td>
        Enrolment
      </td>

      <td>
        Edit enrolment details
      </td>

      <td>
        Allows field users to edit the program enrolment details for a subject.
      </td>
    </tr>

    <tr>
      <td>
        Enrolment
      </td>

      <td>
        Exit enrolment
      </td>

      <td>
        Allows field users to exit a subject from a program.
      </td>
    </tr>

    <tr>
      <td>
        Encounter
      </td>

      <td>
        View visit
      </td>

      <td>
        Allows field users to view encounters for a subject.
      </td>
    </tr>

    <tr>
      <td>
        Encounter
      </td>

      <td>
        Schedule visit
      </td>

      <td>
        Allows field users to schedule encounters for a subject.
      </td>
    </tr>

    <tr>
      <td>
        Encounter
      </td>

      <td>
        Perform visit
      </td>

      <td>
        Allows field users to perform encounters for a subject.
      </td>
    </tr>

    <tr>
      <td>
        Encounter
      </td>

      <td>
        Edit visit
      </td>

      <td>
        Allows field users to edit previously saved encounter details.
      </td>
    </tr>

    <tr>
      <td>
        Encounter
      </td>

      <td>
        Cancel visit
      </td>

      <td>
        Allows field users to cancel a previously scheduled encounter.
      </td>
    </tr>

    <tr>
      <td>
        Encounter
      </td>

      <td>
        Void visit\*\*
      </td>

      <td>
        Allows field users to void an encounter
      </td>
    </tr>

    <tr>
      <td>
        Checklist
      </td>

      <td>
        View checklist
      </td>

      <td>
        Allows field users to view checklist.
      </td>
    </tr>

    <tr>
      <td>
        Checklist
      </td>

      <td>
        Edit checklist
      </td>

      <td>
        Allows field users to edit checklist.
      </td>
    </tr>
  </tbody>
</Table>

`*` Only for 'Household' subject types

`**` Only available as part of Avni 4.0 release (not a full list)

Some of these privileges imply others. For example, allowing the 'Register Subject' privilege implies that the group will also have 'View Subject' allowed. The system handles these dependencies automatically.

## What if I have a simple setup with no separate users?

You can add all your users to the `Administrators` group.

## Is some data with no access control?

Yes some of the app designer and admin user interface (or non-operational data) is open to all users with read access. This data is not confidential in any of the implementations of Avni, hence this has been kept open for any user with login to the organisation.

## Can users update metadata using the API

No, the server also check for the access privileges of the user.

## Super admin access

Access of super admin is restricted to non-operational data of the organisations. Operational data cannot be viewed as well by super admin. This is to provide visibility to the organisations about who can view their data.
### Custom Fields In Search Results

Avni app has the capability to setup [custom search filters](https://avni.readme.io/docs/my-dashboard-and-search-filters), but the results do not show any of these fields. Using this feature one can add additional fields to the search result.

## Setting up custom fields in search results

1. In the app designer go to Search Result Fields and select the subject type for which you want to setup the custom search result fields.
2. Next From the dropdown choose the concept name.
3. You can reorder the custom search fields by drag and drop and finally save the changes.
4. Sync the mobile app and you should see the newly added concept in the search result field.

![1031](https://files.readme.io/8c14b56-custom-search-result-fields2.gif "custom-search-result-fields(2).gif")

**Note**: Only concepts in the registration form are supported.\
**Supported data types**: Text, Id, coded, numeric, and date.
### My Dashboard And Search Filters

Avni allows the display of custom filter in **Search** and **My Dashboard filter** page. These settings are available within App designer. Filter settings are stored in organisation\_config table.  You can define filters for different subject types. Please refer to the table below for various options.

# Filter Types

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Type
      </th>

      <th style={{ textAlign: "left" }}>
        Applies on Field
      </th>

      <th style={{ textAlign: "left" }}>
        Widget Types
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        Name
      </td>

      <td style={{ textAlign: "left" }}>
        Name of the subject
      </td>

      <td style={{ textAlign: "left" }}>
        Default (Text)
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Age
      </td>

      <td style={{ textAlign: "left" }}>
        Age of the subject
      </td>

      <td style={{ textAlign: "left" }}>
        Default : Numeric field. Fetches result matching records with values +/- 4.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Gender
      </td>

      <td style={{ textAlign: "left" }}>
        Gender of the subject
      </td>

      <td style={{ textAlign: "left" }}>
        Default : Multiselect with configured gender options.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Address
      </td>

      <td style={{ textAlign: "left" }}>
        Address of the subject
      </td>

      <td style={{ textAlign: "left" }}>
        Default : Multiselect option to choose the address of the subject. Nested options appear if multiple levels of address are present. e.g. District -> Taluka -> Village.
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Registration Date
      </td>

      <td style={{ textAlign: "left" }}>
        Date of Registration of the subject
      </td>

      <td style={{ textAlign: "left" }}>
        Default : Fixed date\
        Range : Options to choose Start date and End date
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Enrolment Date
      </td>

      <td style={{ textAlign: "left" }}>
        Date of Enrolment in any program
      </td>

      <td style={{ textAlign: "left" }}>
        Default : Fixed date\
        Range : Options to choose Start date and End date
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Encounter Date
      </td>

      <td style={{ textAlign: "left" }}>
        Date of Encounter in any Encounter
      </td>

      <td style={{ textAlign: "left" }}>
        Default : Fixed date\
        Range : Options to choose Start date and End date
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Program Encounter Date
      </td>

      <td style={{ textAlign: "left" }}>
        Date of Program Encounter in any Program Encounter
      </td>

      <td style={{ textAlign: "left" }}>
        Default : Fixed date\
        Range : Options to choose Start date and End date
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Search All
      </td>

      <td style={{ textAlign: "left" }}>
        Text fields in all the core fields and observations in Registration and Program enrolment
      </td>

      <td style={{ textAlign: "left" }}>
        Default : Text Field
      </td>
    </tr>
  </tbody>
</Table>

#### Limitation: Right now we cannot have multiple scopes for a filter, i.e. we cannot search a concept in program encounter and encounter with the same filter.

# Users need to sync the app for getting any of the above changes.
### Extension Points

Extensions are points in Avni where custom html can be used to enhance functionality. There are a few such predefined points where custom html can be inserted. 

In Data Entry App

* Subject Dashboard
* Subject Dashboard for a specific program
* Search Results page

In the Field-App

* Splash Screen

## Creating Extensions

### Creating the extension

In order to create an extension, first you need to create a web app. For each extension point, there will be parameters that you will receive that can be used for custom behaviour. Data can be fetched from the database using the Avni API.

Parameters

* Subject Dashboard - subjectUUIDs (subject's uuid), token (auth token)
* Search Results page - subjectUUIDs (Comma separated list of subjects that have been selected), token
* Splash screen - nothing

The token field must be added as a header AUTH-TOKEN in case you need to use the public API to interact with the Avni server.

### Adding the extension on the App Designer

Extensions can now be added to Avni through the app designer ([https://app.avniproject.org/#/appdesigner/extensions](https://app.avniproject.org/#/appdesigner/extensions)).\
All your extensions must be zipped and uploaded on this screen. You can enter the name of the extension, the file name in the zip file that must be rendered (use relative paths if your HTML file is within a directory), and the type of extension (called Extension Scope). 

![](https://files.readme.io/e772f7d-Screenshot_2021-10-27_at_10.58.02_AM.png "Screenshot 2021-10-27 at 10.58.02 AM.png")
### Upload Checklist

#### Checklist Requirements Capture Guide

Checklists in Avni are scheduled Immunization activities for children. This guide helps you capture complete and accurate business requirements for implementing checklists in Avni.

***

## Understanding Checklist Components

### 1. Checklist Definition

A checklist is a collection of scheduled items that need to be completed within specific timeframes.

**Key Attributes:**

* **Checklist Name**: E.g., "Child Immunization Schedule"
* **Applicable Program/Subject Type**: Which subjects this checklist applies to
* **Trigger Event**: What event starts the checklist (e.g., child birth)

### 2. Checklist Items

Individual items within a checklist that need to be tracked.

**Key Attributes:**

* **Item Name**: E.g., "BCG", "OPV 1"
* **Timing Information**: When the item is due (see timing details below)
* **Dependencies**: Items that must be completed before this one
* **Status Logic**: How the system determines if item is completed, overdue, expired, etc.

***

## Requirement Collection Format

### Basic Format (Simplified)

Use this format for simple checklists without complex dependencies:

| Name of Vaccine | Due by (days) | Critical (days) | Overdue (days) | Expired (days) | Notes                             |
| --------------- | ------------- | --------------- | -------------- | -------------- | --------------------------------- |
| BCG             | Birth         | 56              | 365            | 366            | Given at birth                    |
| OPV 0           | Birth         | 7               | 15             | 16             |                                   |
| OPV 1           | 42            | 49              | 365            | 1826           |                                   |
| Penta 1         | 42            | 49              | 365            | 366            |                                   |
| Measles 1/MR 1  | 252-365       | 280             | 365            | 366            | Can be given between 252-365 days |

**Column Definitions:**

* **Due by (days)**: Number of days from the trigger event when the item is due
  * Can be a single value (e.g., `42`) or a range (e.g., `252-365`)
  * Use "Birth" for items due immediately at the trigger event
* **Critical (days)**: Last day when the item can be completed with normal effectiveness
* **Overdue (days)**: Beyond this day, the item is considered overdue but still valid
* **Expired (days)**: After this day, the item is expired and cannot/should not be completed

### Advanced Format (Comprehensive)

Use this format for complex checklists with dependencies, multiple time units, and gaps:

| Name of Vaccine | # Doses of vaccination | Days | Weeks | Months | Start Days at the age of child | Expiry after (days) | Weeks (completed) During the Months | Minimum gap in days from previous vaccination | Dependencies           | Special Notes                    |
| --------------- | ---------------------- | ---- | ----- | ------ | ------------------------------ | ------------------- | ----------------------------------- | --------------------------------------------- | ---------------------- | -------------------------------- |
| Polio           | Polio-0                | 0    | 0     | 0      | At birth                       | 15                  | 0                                   | 0                                             | None                   | Given at birth                   |
| Polio           | Polio-1                | 42   | 6     | 2      | 42                             | 365                 | 6                                   | 28                                            | dependent on Polio-0   | 28 days after Polio-0            |
| Polio           | Polio-2                | 70   | 10    | 3      | 70                             | 365                 | 10                                  | 28                                            | dependent on Polio-1   | 28 days after Polio-1            |
| BCG             | BCG                    | 0    | 0     | 0      | At birth                       | 1095                | 0                                   | 0                                             | None                   | Within 3 years of age when given |
| Measles         | Measles-1              | 270  | 39    | 9      | 270                            | 365                 | 39                                  | 0                                             | None                   | Between 9-12 months              |
| Measles         | Measles-2              | 540  | 78    | 18     | 540                            | 730                 | 78                                  | 180                                           | dependent on Measles-1 | 180 days after Measles-1         |
| Hepatitis       | Hep-B                  | 0    | 0     | 0      | At birth                       | 2                   | 0                                   | 0                                             | None                   | Within 24 hours of birth         |
| Vitamins        | Vitamin A-1            | 270  | 39    | 9      | 270                            | 365                 | 39                                  | 0                                             | None                   | First dose at 9 months           |

**Additional Column Definitions:**

* **Name of Vaccine**: The vaccine or immunization name (e.g., "Polio", "BCG", "Measles")
* **# Doses of vaccination**: If the same vaccine has multiple doses, specify which dose (e.g., "Polio-0", "Polio-1", "Measles-1", "Measles-2")
* **Days**: Number of days from the trigger event (usually date of birth) when this vaccine is due - helps with precise calculations
* **Weeks**: Same timing represented in weeks - helps with verification and cross-checking
* **Months**: Same timing represented in months - helps with verification and cross-checking
* **Start Days at the age of child**: The age (in days) when the vaccine becomes eligible/due. Can be "At birth" for birth vaccines or a specific number of days (e.g., 42, 70, 270)
* **Expiry after (days)**: Number of days after which the vaccine is no longer valid or recommended (e.g., 15 days, 1095 days). Leave empty if the vaccine doesn't expire within the program timeline
* **Weeks (completed) During the Months**: For monthly tracking systems, indicates which week within the month the vaccine should be completed (e.g., week 6, week 10, week 39)
* **Minimum gap in days from previous vaccination**: Minimum number of days that must pass since the dependent vaccination before this one can be given (e.g., 28 days between Polio doses, 180 days between Measles doses)
* **Dependencies**: Which checklist items must be completed before this one can be administered (e.g., "dependent on Polio-0", "dependent on Measles-1")
* **Special Notes**: Any additional business logic, contraindications, special handling instructions, or clarifications (e.g., "Within 3 years of age", "28 days after Polio-0")

### When to Use Each Format

**Use Basic Format when:**

* Simple vaccination schedules with minimal dependencies
* Straightforward timing (single due dates, not ranges)
* Limited cross-validation needed between different time units
* Small number of vaccines with clear scheduling

**Use Advanced Format when:**

* Complex vaccination schedules with multiple dependencies
* Need to track timing in multiple units (days, weeks, months) for verification
* Monthly reporting requirements that need week-based tracking
* Multiple doses of the same vaccine with specific gap requirements
* Need to capture detailed business rules and special handling

**Example Conversion:**
The basic format entry:

```
| BCG | Birth | 56 | 365 | 366 | Given at birth |
```

Becomes this in advanced format:

```
| BCG | BCG | 0 | 0 | 0 | At birth | 1095 | 0 | 0 | None | Within 3 years of age when given |
```

***

## Step-by-Step Requirements Gathering

### Step 1: Identify Checklist Type and Scope

**Questions to Ask:**

1. What is the name of this checklist?
2. What subject type does it apply to? (Individual, Household, Group)
3. What program or enrollment triggers this checklist?
4. What event starts the checklist timeline? (e.g., date of birth, date of enrollment, date of diagnosis)

**Example:**

* **Checklist Name**: Child Immunization Schedule
* **Subject Type**: Individual (Child)
* **Program**: Child Health Program
* **Trigger Event**: Date of Birth

### Step 2: List All Checklist Items

**Questions to Ask:**

1. What are all the items that need to be tracked?
2. Are there multiple doses/visits of the same item?
3. What is the official/medical name for each item?
4. Are there alternative names or abbreviations used?

**Example:**

```
- BCG (Bacillus Calmette-Guérin)
- Hepatitis B (Hep B)
- OPV (Oral Polio Vaccine) - Doses: 0, 1, 2, 3, Booster
- Pentavalent (Penta) - Doses: 1, 2, 3
- Rotavirus - Doses: 1, 2, 3
- IPV (Inactivated Polio Vaccine) - Doses: 1, 2
- Measles/MR - Doses: 1, 2
- Vitamin A - Multiple doses
- DPT Booster - Doses: 1, 2
- TT Booster - Doses: 1, 2
```

### Step 3: Define Timing for Each Item

**Questions to Ask for Each Item:**

1. **When is it due?**
   * Days/weeks/months from trigger event?
   * Specific age?
   * Range of acceptable timing?
2. **When does it become critical?**
   * Last day for optimal effectiveness
   * Last day within recommended window
3. **When is it overdue?**
   * When should the system alert that it's late?
   * Is it still valid if overdue?
4. **When does it expire?**
   * After what point should it not be given?
   * Are there medical reasons for expiration?

**Example - OPV 1:**

* **Due**: 42 days after birth (6 weeks)
* **Critical**: 49 days (7 weeks) - last day of recommended window
* **Overdue**: 365 days (1 year) - still valid but late
* **Expired**: 1826 days (5 years) - no longer applicable

### Step 4: Document Dependencies

**Questions to Ask:**

1. Are there items that must be completed before this one?
2. What is the minimum gap required between dependent items?
3. Are there items that must be completed together?
4. Are there alternative dependencies (either A or B must be done first)?

**Example:**

* Polio-1 depends on Polio-0
* Polio-2 depends on Polio-1 (minimum 28 days gap)
* Measles-2 depends on Measles-1 (minimum 180 days gap)
* DPT Booster 1 depends on Penta 3

### Step 5: Capture Business Rules

**Questions to Ask:**

1. Are there conditions when an item should be skipped?
2. Are there alternative items (e.g., Measles OR MR)?
3. How is completion determined? (observation, form submission, external verification)
4. What data should be captured when completing an item?
5. Are there any special calculations or validations?

**Example Rules:**

```javascript
// Skip Vitamin A if child is severely malnourished
if (child.nutritionStatus === 'SAM') {
  skipVitaminA = true;
}

// BCG scar verification after 3 months
if (daysSinceBCG > 90 && !scarVerified) {
  showScarVerificationTask = true;
}

// Calculate next due date based on last completed dose
nextDueDate = lastCompletedDate + minimumGapDays;
```

### Step 6: Define Status Colors and Alerts

**Questions to Ask:**

1. How should each status be displayed to field workers?
2. What alerts/notifications should be triggered?
3. Should there be reminders before due date?

**Example:**

| Status    | Color  | Display           | Alert/Action            |
| --------- | ------ | ----------------- | ----------------------- |
| Upcoming  | Blue   | Due in X days     | No alert                |
| Due       | Green  | Due today         | Show in today's tasks   |
| Critical  | Orange | Due (last day)    | High priority alert     |
| Overdue   | Red    | Overdue by X days | Daily reminder          |
| Expired   | Gray   | Expired           | Remove from active list |
| Completed | Black  | Done on [date]    | No alert                |

***

## Example: Complete Requirements Document

### Checklist: Child Immunization Schedule

**Metadata:**

* **Checklist Name**: Child Immunization Schedule
* **Applicable Subject Type**: Individual (Child)
* **Applicable Program**: Child Health Program
* **Trigger Event**: Date of Birth (DOB)
* **Timeline Unit**: Days from DOB
* **Active Duration**: 0-7000 days (approximately 19 years)

**Checklist Items:**

| Name of Vaccine | Due by (days) | Critical (days) | Overdue (days) | Expired (days) | Min Gap (days) | Dependencies  | Notes                             |
| --------------- | ------------- | --------------- | -------------- | -------------- | -------------- | ------------- | --------------------------------- |
| BCG             | Birth (0)     | 56              | 365            | 366            | -              | None          | Given at birth or within 2 months |
| Hep B           | Birth (0)     | 1               | 2              | 10             | -              | None          | Must be given within 24 hours     |
| OPV 0           | Birth (0)     | 7               | 15             | 16             | -              | None          | Birth dose                        |
| OPV 1           | 42            | 49              | 365            | 1826           | 28             | OPV 0         | 28 days after OPV 0               |
| OPV 2           | 70            | 77              | 365            | 1826           | 28             | OPV 1         | 28 days after OPV 1               |
| OPV 3           | 98            | 105             | 365            | 1826           | 28             | OPV 2         | 28 days after OPV 2               |
| Penta 1         | 42            | 49              | 365            | 366            | -              | None          | Can be given with OPV 1           |
| Penta 2         | 70            | 77              | 365            | 366            | 28             | Penta 1       | 28 days after Penta 1             |
| Penta 3         | 98            | 105             | 365            | 366            | 28             | Penta 2       | 28 days after Penta 2             |
| Rotavirus 1     | 42            | 49              | 365            | 366            | -              | None          | Given with Penta 1                |
| Rotavirus 2     | 70            | 77              | 365            | 366            | 28             | Rotavirus 1   | Given with Penta 2                |
| Rotavirus 3     | 98            | 105             | 365            | 366            | 28             | Rotavirus 2   | Given with Penta 3                |
| IPV 1           | 42            | 49              | 365            | 366            | -              | None          | Given with Penta 1                |
| IPV 2           | 98            | 105             | 365            | 366            | 56             | IPV 1         | Given with Penta 3                |
| Measles 1/MR 1  | 252-365       | 280             | 365            | 366            | -              | None          | Between 9-12 months               |
| Measles 2/MR 2  | 448-730       | 504             | 730            | 731            | 180            | Measles 1     | Between 16-24 months              |
| Vit. A          | 252           | 280             | 1825           | 1826           | -              | None          | Every 6 months after 9 months     |
| DPT Booster 1   | 448-730       | 504             | 730            | 731            | -              | Penta 3       | Between 16-24 months              |
| DPT Booster 2   | 1825          | 2190            | 2191           | 2500           | -              | DPT Booster 1 | At 5-6 years                      |
| OPV Booster     | 448           | 504             | 1825           | 1826           | -              | OPV 3         | At 16-18 months                   |
| TT Booster 1    | 3650          | 5475            | 6570           | 7000           | -              | DPT Booster 2 | At 10 years                       |
| TT Booster 2    | 5840          | 7300            | 8760           | 9000           | -              | TT Booster 1  | At 16 years                       |

**Business Rules:**

1. **Completion Logic:**
   * Item is marked complete when the corresponding encounter form is submitted
   * Completion date is the date of vaccine administration (not form submission date)

2. **Alternative Vaccines:**
   * Measles and MR are alternatives - completing either satisfies the requirement
   * If MR is given, mark it as Measles 1 or Measles 2 as appropriate

3. **Vitamin A Recurring:**
   * After initial dose at 9 months, Vitamin A should be given every 6 months
   * Create recurring checklist items or handle via rules

4. **Late Vaccination Protocol:**
   * If OPV 1 is given after expiry, don't create subsequent OPV items
   * If Measles 1 is given after 365 days, adjust Measles 2 due date accordingly

5. **Scar Verification:**
   * BCG scar should be verified 3 months after vaccination
   * If no scar is visible, refer to health facility for re-vaccination

6. **Concurrent Administration:**
   * Multiple vaccines can be given on the same day if they are due
   * Document all vaccines given in a single visit

***

## Data Format for Upload

### Checklist Configuration JSON Structure

Based on the Avni checklist format, your requirements will be translated into JSON like this:

```json
{
  "name": "Child Immunization Schedule",
  "uuid": "unique-uuid-here",
  "items": [
    {
      "name": "BCG",
      "uuid": "item-uuid-1",
      "scheduleOnExpiryOfDependency": false,
      "minDaysFromStartDate": 0,
      "maxDaysFromStartDate": 56,
      "expiresAfter": 366,
      "dependentOn": null
    },
    {
      "name": "OPV 1",
      "uuid": "item-uuid-4",
      "scheduleOnExpiryOfDependency": false,
      "minDaysFromStartDate": 42,
      "maxDaysFromStartDate": 49,
      "expiresAfter": 1826,
      "dependentOn": "OPV 0"
    }
  ]
}
```

### Concept Definitions

Vaccines also need to be defined as concepts:

```json
{
  "name": "BCG",
  "uuid": "concept-uuid-1",
  "dataType": "Coded",
  "answers": [
    {
      "name": "Given",
      "uuid": "answer-uuid-1"
    },
    {
      "name": "Not Given",
      "uuid": "answer-uuid-2"
    }
  ]
}
```

***

## Validation Checklist

Before finalizing requirements, verify:

* [ ] All checklist items are listed with unique names
* [ ] All timing values (due, critical, overdue, expired) are defined
* [ ] Dependencies between items are clearly documented
* [ ] Minimum gaps between dependent items are specified
* [ ] Alternative items (if any) are identified
* [ ] Business rules for special cases are documented
* [ ] Completion criteria for each item is defined
* [ ] Status colors and alerts are specified
* [ ] Any recurring items are handled (separate checklist or rules)
* [ ] Edge cases and late administration scenarios are covered
* [ ] Data to be collected on completion is defined
* [ ] Integration with other program schedules is considered

***

## Common Patterns and Best Practices

### 1. Use Clear Naming Conventions

* **Good**: "OPV 1", "OPV 2", "OPV 3"
* **Avoid**: "OPV First Dose", "Second OPV", "OPV III"

### 2. Document Ranges Explicitly

* If an item can be given in a range (e.g., 252-365 days), specify:
  * Earliest acceptable date (252)
  * Latest optimal date (365)
  * Overdue cutoff
  * Expired cutoff

### 3. Handle Dependent Chains

* For chains like OPV 0 → OPV 1 → OPV 2 → OPV 3:
  * Each item depends on the previous one
  * Specify minimum gaps between each
  * Consider what happens if the chain is broken (late vaccination)

### 4. Account for Real-World Scenarios

* What if a child misses the window for a vaccine?
* What if a child comes for catch-up vaccination?
* What if vaccines are given in a different order?
* What if there are stock-outs or unavailability?

### 5. Recurring Items

* For items like Vitamin A (every 6 months):
  * Option 1: Create multiple checklist items (Vit A 1, Vit A 2, etc.)
  * Option 2: Use rules to create new checklist items after completion
  * Document which approach is preferred

***

## Additional Resources

* **Avni Checklist Documentation**: [https://avni.readme.io/docs/upload-checklist](https://avni.readme.io/docs/upload-checklist)
* **Checklist Rules Guide**: [https://avni.readme.io/docs/writing-rules#/9-checklists-rule](https://avni.readme.io/docs/writing-rules#/9-checklists-rule)
* **Example Vaccination Concepts**: [https://github.com/avniproject/avni-health-modules/blob/master/src/health\_modules/child/metadata/vaccinationConcepts.json](https://github.com/avniproject/avni-health-modules/blob/master/src/health_modules/child/metadata/vaccinationConcepts.json)
* **Example Checklist JSON**: [https://github.com/avniproject/calcutta-kids/blob/master/child/checklist.json](https://github.com/avniproject/calcutta-kids/blob/master/child/checklist.json)

***

## Template for Stakeholder Discussions

Use this template when meeting with program managers, doctors, or other stakeholders:

```
Meeting Date: __________
Stakeholders Present: __________

1. Checklist Overview
   - Name: __________
   - Purpose: __________
   - Applies to: __________
   - Starts when: __________

2. List of Items (one per row)
   Name of Vaccine | Due by (days) | Critical (days) | Overdue (days) | Expired (days) | Notes

3. Special Rules or Conditions
   - 
   - 
   - 

4. Questions/Clarifications Needed
   - 
   - 
   - 

5. Next Steps
   - 
   - 
```

***
#### Index

Avni allows you to upload checklist items from web interface. Before uploading checklist make sure you have already created checklist Item form and checklist rule is already in place. As other forms in Avni, each checklist item need to be a concept and should be uploaded/created before uploading checklist json. A sample concept file for vaccination item looks like [this](https://github.com/avniproject/avni-health-modules/blob/master/src/health_modules/child/metadata/vaccinationConcepts.json). You can directly upload these concepts using metadata upload UI.

Once all the dependencies required by checklist are deployed, you can create a checklist json in the UI editor and upload it. A sample Vaccination checklist looks like [this](https://raw.githubusercontent.com/avniproject/calcutta-kids/master/child/checklist.json).

Click [here](https://docs.google.com/spreadsheets/d/e/2PACX-1vS1Xq4cVi1pDn8B78g_BEdQOcqr5p2hTCeuyhXtpZGKGMHCyba7enJop29zYJy9UyEVYeg523lIutQC/pubhtml#) to see more examples.

### Structure of Checklist json file

```json
{
    "name": "Vaccination",
    "uuid": "uuid of this checklist. We support only single checklist in the system right now so don't change this uuid after you save the file for the first time",
    "items": [
        `<item-object>`
    ]
}
```

### Structure of item-object

```json
{
    //uuid of checklist item
    "uuid": "uuid of checklist item",
    //uuid of a form used to mark the vaccine as completed
    "formUUID": "uuid of a form used to mark the vaccine as completed",
    //uuid of a dependency. This item will get due only after the dependency is marked as completed
    "dependentOn": "uuid",
    //Set this when the dependency can expire and you want this item to be scheduled even then
    "scheduleOnExpiryOfDependency": `<boolean>`,
    //Number of days from base date of checklist after which the item becomes due. Put this only if you are also making this item dependent on another item.
    "minDaysFromStartDate": `<integer>`,
    //Number of days from completion date of dependency after which the item becomes due. Put this only if you are also making this item dependent on another item.
    "minDaysFromDependent": `<integer>`,
    //If an item can expire then you can use this to specify it. It's relative from the base date of the checklist.
    "expiresAfter": `<integer>`,
    //Array of status objects. We use this to specify different phases an item can be in. E.g. You may want to define that it's Due from day 2 to day 30, Critical from Day 30 to 60, and Overdue after day 60. 
    "status": "array of `<status-object>`",
    "concept": `<concept-object>`
}
```

### Structure of status-object

```json
{
  //Looks like an unused field right now. Set it in increasing order for now inside status array
  "displayOrder": 1,
  //Days after which this state should be active
  "start": 270,
  //Days after which this state will not be active
  "end": 291,
  //Name of state
  "state": "Due",
  //Color that the item is displayed in when this state is active
  "color": "#FBF9DA"
}   
```

### Strucuture of concept-object

```json
{
  "uuid": "uuid of the concept that should be used for this item",
  "comment": "Put the name of the concept here for readability"
}
```

### Overview

You can use checklist json file to build the checklist. You can do add list of items and for each item define a state like Due, Critical, Overdue. You can also set depedencies between vaccines so the depedent will get scheduled only after dependency is marked as completed.

## Important Questions:

#### How to test?

Change the device date in future. Don't edit date of birth in profile of the subject.

#### How to add a new item?

Add an item-object in items array

#### How to remove an existing item?

Add voided attribute to an item with value true.

#### How do you add a depedency?

Add dependentOn field

#### How is due date calculated when there is a depedency?

A dependent item goes into it's first state after completion date of it's depedency + specified value of minDaysFromDependent. But there can also be a necessity that an item has to be scheduled only after minimum number of days from base date of the checklist. In the case where we have specified both minDaysFromDependent and minDaysFromStartDate then we compute the **max** of both start dates.

```Text Example
max(dependentCompletionDate + minDaysFromDependent + item.start, 
dependentCompletionDate + minDaysFromStartDate + item.start), 
and move the item to it's first state on that date.
```

#### What will happen if my computed due date is after the expiry date.?

An item's due date based on computations of dependent's completion\_date, minDaysFromDependent and item.start, if exceeds the "expiresAfter" value, then we give priority to "expiresAfter" and mark it as expired.

### Flowchart for determining the Vaccination state:

<Image align="center" src="https://files.readme.io/815c13987e5ad6616202a18db078663bae5ec8000d94680642a418ff4e2ca2f3-Flowcharts_2.png" />

### <span style={{ color: "blue" }}>TODOS:</span>

* [ ] It is not clear if there is any default ordering in displaying status groups and is it possible to change it. E.g. we may want to show all due items in first row, all critical in second, overdue in third, expired in fourth and completed in fifth.
### Creating Identifiers

### Identifiers

Identifiers are unique strings generated by the system, which can be used to identify a beneficiary. Usually, these have special patterns - prefixes, suffixes, special numbering patterns etc, which aid users in understanding a beneficiary. 

### ID Generation in Avni

In usual systems, identifiers are generated from a central place because we need them to be unique. However, the Avni Android app is expected to work offline. Offline ID generation is possible, but is done differently. IDs in Avni are generated in batches and sent to a user. 

There is a special form element type called ID. If you configure a form element to be of ID type, then the Avni android app will automatically retrieve the next ID from this batch and assign it as the value. 

*Advanced* - It is also possible to create rules that modify the final ID that is stored for the beneficiary. For example, if there is the need of adding a date to the final ID being generated, you would write a ViewFilter rule that will use the generated ID and append a date to it. 

### Identifier sources

It is possible to have multiple IDs being generated at the same time. Each ID type is called an identifier source. An identifier source will have a certain type (discussed later), prefix (optional), minimum and maximum lengths and can be assigned to a  catchment.\
The type of an identifier source determines the strategy used to generate IDS of that source. There are currently two types available. The only difference between them is the place where the prefix is stored. 

1. User pool based identifier generation - Here, a pool of users within a catchment share the same prefix. The prefix is stored within the identifier source within options. Every user asking for ids is provided with a set of ids prefixed with this value. 
2. User based identifier generation - Here, the prefix is stored in the "idPrefix" value of the user's settings.

### Rules

1. User pool based identifier generation - overlaps in ID for the same identifier source not allowed.
2. User based identifier generation - Two users in the same organisation cannot have same prefix. This check is case in-sensitive.

Queries to analyse existing data is available here - [https://github.com/avniproject/avni-webapp/issues/1022#issuecomment-1693064436](https://github.com/avniproject/avni-webapp/issues/1022#issuecomment-1693064436)

### Tutorial

#### 1. Create Identifier Source from admin section:

1. Give name
2. Choose type - User pool based identifier generator or User based identifier generator. Difference between the two is explained above.
3. Choose catchment
4. Choose batch generation size. This is the number of identifiers that will be generated at once and be sent to client app on sync. If your field users can not sync for a long time then you should estimate how many identifiers they may need.
5. Choose minimum balance. This is useful to make sure that your users get a warning to sync before they run out of identifiers.
6. Choose Min length and max length. This specifies the min and max length of the generated identifiers.
7. You will get an option to add Prefix if you chose User Pool Based Identifier Generator in the Type field(1.2). This prefix will be shared by all identifiers generated for users sharing the same identifier source.

#### 2. Create Identifier User Assignment from admin section:

1. Choose User. The user that you select will start getting auto-generated ids  once they Sync.
2. Choose Identifier Source. This is the resource that you created in Step 1 above(Create Identifier Source from admin section).
3. Enter initial identifier to be generated for this user. It should also include the prefix. E.g. if you had set the prefix to be ANC and min length to be 3, and you want the identifiers to start from 100 then the value of this field could ANC100.
4. Enter last identifier to be generated for this user. System will not generate any identifiers beyond this. E.g. If your prefix is ANC, max length is 4 and you want identifiers only till 2000 then this could be ANC2000.

#### 3. Create a question in the form with concept type Id

1. In the form where you want the auto generated identifier, do create a question with concept type Id and select the identifier source.
### Upload Data

### Purpose

* Prepare data in bulk, review, and upload.
* Migrating away from an existing implementation, and need to seed with existing data.
* Your organization has a separate component where data is collected outside Avni, but you still need this data to be present with field workers using Avni.

### Using the Admin app to upload data

The Admin app of the web console has an upload option. Currently, this supports

* Upload subjects
* Upload program enrolment (excluding exit information and observations)
* Upload program encounters (excluding cancel information and observations)
* Upload encounters (excluding cancel information and observations)
* [Upload locations](location-and-catchment-in-avni)
* Upload users and catchments
* Upload metadata zip file downloaded from a different implementation

Sample files are available in the interface. Download the file, fill in values and then upload. The file is in a [CSV](https://www.howtogeek.com/348960/what-is-a-csv-file-and-how-do-i-open-it/) format.

### Form validations and rules

* All the entries in CSV are validated before saving to the database. Suppose a field is marked mandatory in the form and value is not provided in the CSV then upload fails giving the error that the mandatory field cannot be empty. 
* All form element and form element group rules are run during CSV upload, so if there is a value for any form element which is hidden then that value is ignored. This behaves similarly to how data entry is done from the web or mobile app.
* New visits get saved based on the visit schedule logic.
* Decisions are saved along with the observations based on the decision rule logic.

### Questions and Answers

#### What is the Id field in every file?

* The Id is an identifier for the row you are uploading. This is important to ensure that if you upload the same file twice, we do not create duplicate records. For import, this usually should map to the id from your previous system. For updates, you can specify the value for the Id field as the id from your previous system or the uuid generated by Avni when creating the record. If you have two different individuals or encounters to be uploaded, please ensure they are uploaded using different ids. If not, they will be overwritten. The Id can be any string. 

#### What if I have a comma in my observation?

* Wrap your observation in quotes. 

##### What if I need to upload an observation whose concept is not specified in the sample file?

* It is possible you have a computed value that is not part of the form that needs to be uploaded. Just add the concept name in the header, and it will be added to the observations. 

##### Is the order of values important?

* No. Columns can be in any order. 

##### What if I have a concept called "Id"? This will mean there are two headers in the same file with the same name.

* Unfortunately, the upload process does not support this scenario. You can potentially change the name of the concept for a little while until the upload is complete, and then change it back (if you are doing an initial import, this makes sense). If not, try changing the name of the concept (we do an exact case-sensitive string match, so you can change the concept name to something like "ID", and it should work fine).

#### How to upload data for the grouped form elements?

* Columns for the grouped form elements are labeled as "Parent|Child". One can fill in the values for all the child form elements and it'll get saved as grouped observation.

#### How do I upload images?

* For images, use a url that the avni server can download. Ensure that
  * The images are a direct download link (not a redirect to a page that uses javascript to download)
  * The image urls end with the image type. eg: [https://somedomain.com/images/abc.png](https://somedomain.com/images/abc.png)
### Bulk Data Upload V2

## Purpose

* Prepare data in bulk, review, and upload.
* Migrating away from an existing implementation, and need to seed with existing data.
* Your organization has a separate component where data is collected outside Avni, but you still need this data to be present with field workers using Avni.

## Using the Admin app to upload data

The Admin app of the web console has an upload option. Currently, this supports the following. Essentially for each form present in you organisation there is a corresponding upload option in the dropdown, with a sample file.

* Upload subjects
* Upload program enrolment (excluding exit information and observations)
* Upload program encounters (excluding cancel information and observations)
* Upload encounters (excluding cancel information and observations)
* [Upload locations](location-and-catchment-in-avni)
* Upload users and catchments
* Upload metadata zip file downloaded from a different implementation

## Sample file

Sample files are available in the interface. Download the file, fill in values and then upload. The file is in a [CSV](https://www.howtogeek.com/348960/what-is-a-csv-file-and-how-do-i-open-it/) format.  
Sample file acts as an up-to-date documentation on the following.

* fields
* whether they are mandatory for upload
* possible values
* format of the value

> 📘 Since above has already been documented and maintain in the sample file these are not documented here again, please refer to it as a reference documentation.

## Mandatory fields in the form

The mandatory fields in the form element are not applicable when uploading the data via CSV files - since we have seen when made mandatory especially for the legacy data, the users are force to upload some junk information (this may be added in the future).

## Rules

No rules are run as part of CSV upload. This implies that:

* field values created automatically via form element rules will not get created (such columns are present in the sample hence can be uploaded manually)
* observations created by decision rules will not be created automatically (such columns are present in the sample hence can be uploaded manually)
* Validation rule is not applied
* Edit rule is not applied

> 📘 Avni currently doesn't have a robust framework to run these rules on the server side. This may be added in future, if we observe that users need these.

## Identifiers

The primary purpose of these identifiers is for the users to be able to link different CSV file types upload data to each  other - in the same way as foreign key linkages between different records. These linkages can be created using identifiers of user's choosing. Lets try to understand this via an example. Lets assume there are three forms.

* Woman Registration (Subject)
* Pregnancy Program Enrolment (Program Enrolment)
  * links to woman
* Ante Natal Visit Form (Program Encounter)
  * links to pregnancy program

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Form
      </th>

      <th>
        Columns
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        Woman Registration
      </td>

      <td>
        Id from previous system
      </td>

      <td>
        Any unique identifier that you may want to use. Note that you can make this up if you don't already have one. e.g. WOMAN-100001, WOMAN-100002
      </td>
    </tr>

    <tr>
      <td>
        Pregnancy Program Enrolment
      </td>

      <td>
        Id from previous system
      </td>

      <td>
        Any unique identifier that you may want to use. It should unique for all program enrolments. They can be same as woman registration id, but we recommend you use something like e.g. WOMAN-100001-01, WOMAN-100001-02 so that you can use multiple enrolments for the same woman.

        It is possible that at the time of preparing this data, you are don't plan to upload woman registration via CSV and it is already present in Avni. In such a case you should use the Avni UUID value of the woman registration in this field.
      </td>
    </tr>

    <tr>
      <td>
        Pregnancy Program Enrolment
      </td>

      <td>
        Subject Id from previous system
      </td>

      <td>
        This should be used to match the pregnancy enrolment record woman registration record. Hence, for our example used so far, this field would have values like - WOMAN-100001, WOMAN-100002
      </td>
    </tr>

    <tr>
      <td>
        Ante Natal Visit Form
      </td>

      <td>
        Id from previous system
      </td>

      <td>
        You can leave this blank, if you intention is to create new records only and not edit them.
      </td>
    </tr>

    <tr>
      <td>
        Ante Natal Visit Form
      </td>

      <td>
        Program Enrolment Id
      </td>

      <td>
        This should be used to match the program ante natal visit form record with woman registration record. Hence, for our example used so far, this field would have values like - WOMAN-100001-01, WOMAN-100002-01

        It is possible that at the time of preparing this data, you are don't plan to upload pregnancy enrolment data via CSV and it is already present in Avni. In such a case you should use the Avni UUID value of the woman registration in this field.
      </td>
    </tr>
  </tbody>
</Table>

> 📘 The identifiers used above, for Id from previous system, are saved in Avni but is not visible in Avni after uploading, it is used only for matching records during CSV upload.

## Scheduling a visit and Upload visit details

Please note that sample file for uploading visit details and scheduling a visit are different. These two options allow for  either creating a scheduled encounter/visit or completed encounter/visit. Note that scheduling a visit and then uploading the visit details for the same visit is not supported (as that is similar to edit).

<Image align="center" border={true} src="https://files.readme.io/30f7062dbe6572554955d88df13530e6e45c5a4cd5986fd81499661a294f78a2-image.png" className="border" />

## Important Notes / Gotchas

* **Limited Concept Support in CSV Upload**: Not all concepts are supported when uploading data via CSV. Specifically, the following are not supported:
  * GroupAffiliation
  * Id
  * File
* **Id Confusion**: The identifiers (used in Id from previous system) are different from Id elements in the form, if you have them.
* **Form Data Editing**: Editing previously submitted form data is not currently supported through the CSV upload process.
* **No Metadata Rollback**: For metadata zip uploads, uploading an older zip file version does not restore a previous version of the metadata. The result of uploading an older version will be an attempted merge of the old version over the current version which might not be what is expected. Avni does not support rolling back of the metadata configuration to a previous state. One can only move forward from the current configuration.

# Questions

### What if I have a comma in my observation value?

* Wrap your value in quotes.

### Why are decision concepts not appearing the sample file

If you are using decision concepts in the rule but not linked those concepts then this will happen.

### Is the order of values important?

* No. Columns can be in any order.

### How do I upload images?

* For images, use a url that the avni server can download. Ensure that
  * The images are a direct download link (not a redirect to a page that uses javascript to download)
  * The image urls end with the image type. eg: [https://somedomain.com/images/abc.png](https://somedomain.com/images/abc.png)
### Translation Management Old

Avni allows the management of translations using the Admin web interface. Below are the steps to manage translations.

## 1. Add Languages to Organisation Config

First languages have to be added to organisation config. Only the languages that are added in the organisation config are made available to the translation framework

## 2. Download Keys

From the translations page of the Avni Admin app, download the keys after choosing the platform. For the mobile app choose 'Android'. This will download a zip file containing one JSON file per language available in the organisation config. The JSON file will contain keys for both platforms as well as implementation covering all labels in the app, form fields, and any other concepts created in the implementation. The file will contain values for any existing translations. 

## 3. Updating files with translations

The JSON files can be edited with any tool that the implementer is comfortable with. For use cases, where multiple translators are involved or a lot of keys are to be translated we recommend using an external translation management system (TMS) like [Lokalise](https://lokalise.com) which provides a sophisticated editor for performing translations. The TMS provides the ability to import/export JSON files and support a variety of use cases related to translations. Avni has an enterprise-free plan of Lokalise. If you would like to use Lokalise, please request the Avni team to create your account and project to get started.

## 4. Uploading Translations

When downloading translations to a JSON file in Lokalise, under `Advanced settings`, select `Don't export` as value for `Empty translations` field. Once the JSON files are available with updated translations, upload the file in the Avni admin interface by choosing an appropriate language. Be careful about choosing the correct language.

![](https://files.readme.io/d92456b-Screen_Shot_2019-10-21_at_5.58.47_PM.png "Screen Shot 2019-10-21 at 5.58.47 PM.png")

## Translation Dashboard

Once the translations have been uploaded, the translations dashboard will reflect the status. 

The users need to sync their devices to get the new translations.
### Tasks

Most activities in Avni are modeled as encounters with subjects, sometimes linked to a program. However, there are other kinds of data collection that happens in field work that is not related to any subject.\
eg: A list of contacts that need to be contacted first before creating subjects etc.  

To handle such flows, Avni now has a new mechanism called tasks. Tasks can currently be created only through the external API. They can be assigned to people, who can change the status of a task. 

## Task Configuration

Task configuration is handled currently through SQL inserts since there are no mechanisms on the App Designer. Given below are the new concepts introduced in the task configuration. 

### Task types

A task can have a type. There are currently two kinds of task types - Call and Open Subject. A Call type task helps the user call the user, while the open subject task allows the user to navigate to the subject assigned to the task. 

### Task status

A number of statuses can be configured for a task. This helps in moving these calls into buckets. Some of these cards can be marked as "terminal" tasks. A terminal task indicates that the task is complete. 

### Task search fields

If you configure a list of concepts as task search fields, they are available in the Assignment screen for filtering. This is configured per task type

### Task metadata

Some metadata (concept:value array) can be set on a task when creating it. This will help users get more information on a task before taking actions on them. 

### Task observations

Task observations are filled in when completing a task. A new form type called "Task" is configured for this purpose. The user will be given the option to fill in the form when completing a task. 

### Standard report cards for task

There is a standard report card that can be configured for tasks. This is currently the only way tasks will be visible on the Avni android app. 

## Task assignment

The web application provides a new option - "Assignment" to assign users to a task. Only one user can be assigned to a task at this time. If you assign a new user, the old user is unassigned. 

### Caveats

* Task type configuration does not have an interface on the App Designer. 
* Tasks can only be created through the external API
* Tasks can be assigned through the Assignment feature on the web application
* Tasks are not currently supported on the Data Entry App
### Program

Each subject type can have multiple programs within them. If these programs are defined, the user can enroll subjects of these subject types into these programs.

Number of enrolments per subject

* Typically and hence by default, a subject can have only one active enrolment for a program. This implies that for a subject to be enrolled again the previous enrolment must be exited. e.g. Pregnancy program. Sometimes for chronic diseases, a person may remain in a program forever like diabetes. In such cases, the subject is never exited.
* Starting release 3.37, Avni also supports multiple active enrolments in a program. This can be done by switching on this per program. When this is switched on the above condition is relaxed by Avni.

<Image align="center" className="border" width="300px" border={true} src="https://files.readme.io/62b1f10-image.png" />
### Reporting Views

Avni has a generic data model to support the dynamic creation of forms. For new implementers wanting to write custom reports, this can be overwhelming and complex.\
To ease the creation of reports, Avni generates simplified database views with one view corresponding to each form.

## Creating / Refreshing Reporting Views

You can create views for reporting by going to the `Reporting Views` option in the app designer and clicking on `create/refresh view`. For each form, one view is created with all the questions as the columns in the view. 

<Image title="Screen Shot 2020-09-04 at 9.28.47 AM.png" alt={3356} src="https://files.readme.io/f47db05-Screen_Shot_2020-09-04_at_9.28.47_AM.png">
  App Designer Reporting Views Screen
</Image>

You can see the view definition by clicking on the expand button, and delete the view by clicking on the delete button.

The views would be accessible in Metabase or any other reporting tool the implementation may be using.

## Naming convention

As PostgreSQL doesn't allow identifiers of length more than 63 bytes, we follow these naming conventions as long as the view name is below 63 characters.

<Table align={["left","left"]}>
  <thead>
    <tr>
      <th>
        Form type
      </th>

      <th>
        View name
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        Registration
      </td>

      <td>
        `{UsernameSuffix}_{SubjectTypeName}`
      </td>
    </tr>

    <tr>
      <td>
        Encounter
      </td>

      <td>
        `{UsernameSuffix}_{SubjectTypeName}_{encounterTypeName}`
      </td>
    </tr>

    <tr>
      <td>
        Encounter Cancellation
      </td>

      <td>
        `{UsernameSuffix}_{SubjectTypeName}_{encounterTypeName}_cancel`
      </td>
    </tr>

    <tr>
      <td>
        Program Enrolment
      </td>

      <td>
        `{UsernameSuffix}_{SubjectTypeName}_{ProgramName}`
      </td>
    </tr>

    <tr>
      <td>
        Program Exit
      </td>

      <td>
        `{UsernameSuffix}_{SubjectTypeName}_{ProgramName}_exit`
      </td>
    </tr>

    <tr>
      <td>
        Program Encounter
      </td>

      <td>
        `{UsernameSuffix}_{SubjectTypeName}_{ProgramName}_{EncounterTypeName}`
      </td>
    </tr>

    <tr>
      <td>
        Program Encounter Cancellation
      </td>

      <td>
        `{UsernameSuffix}_{SubjectTypeName}_{ProgramName}_{EncounterTypeName}_cancel`
      </td>
    </tr>
  </tbody>
</Table>

If the view name exceeds 63 characters we trim some parts from different entity type names to keep it below 63 characters. For trimming, we follow the below rule.

*\{UsernameSuffix}*\{First 6 characters of SubjectTypeName}*\{First 6 characters of ProgramName}\_\{First 20 characters of EncounterTypeName}*

Some view names exceed the character limit even after the above optimisation. In such a case we take away the last few characters and replace them with the hashcode of the full name. Hashcode is used so that the name remains unique.
### Structure Import Metadata Excel Excel

> ❗️ Avni does not support Excel based import any longer, please refer to Admin App based approach to upload data [Bulk Data Upload page](https://avni.readme.io/docs/upload-data#is-the-order-of-values-important)

<br />

We can Import transactional data from excel files. Data can be Subject Registration, Enrolment, Encounters, relationships between Subjects, Vaccinations, etc. The data file, ideally, should have columns like RegistrationDate, FirstName, LastName, DOB, .. in case of Registration, and SubjectUUID, DateOfEnrolment, Program, .. in case of Enrolment, and SubjectUUID, EnrolmentUUID, EncounterType, Name, .. for Encounters. Along with these default fields, all the observations specific to the implementation should be present in the data file.

The definition of those forms cannot be imported this way. Only the data recorded against those forms can be imported this way.

We need a metaData.xlsx file that would work as an adapter between the data.xlsx file and the avni system.  
The data.xlsx file will be provided by the org-admin which should have consistent and tabular data. The metaData.xlsx file defines the relationship between each column and its corresponding field in the avni system/implementation.

## Structure of metaData.xlsx file:

The following are the various spreadsheets within a metaData.xlsx file.

### Sheets

Sheets represent a logical sheet of data. A physical sheet of data can be mapped to multiple logical sheets of data.

<table>
<thead>
<tr>
  <th>Column</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><p>File Name</p></td>
  <td><p>The data migration service is used by supplying the metadata excel file, a data excel file, and a fileName (since the server reads the data excel file via a stream it doesn&#39;t know the name of the file originally uploaded hence it needs to be explicitly provided).  </p>
<p>Only the sheets which have the file name matching the fileName via the API would be imported.</p></td>
</tr>
<tr>
  <td><p>User File Type</p></td>
  <td><p>This is the unique name given to the file of specific types. There can be more than one physical file of the same type, in which case the user file type will be the same but file names will be different.</p></td>
</tr>
<tr>
  <td><p>Sheet Name</p></td>
  <td><p>This is the name of the actual sheet in the data file uploaded where the data should be read.</p></td>
</tr>
<tr>
  <td><p>Entity Type, Program Name and Visit Type, Address</p></td>
  <td><p>Core but optional data to be provided depending on the type of data being imported</p></td>
</tr>
<tr>
  <td><p>Active</p></td>
  <td><p>During data migration, it is possible that there are a lot of files and mapping metadata definition for those files may not be complete. Active flag (Yes or No) can be used to disable sheets that need not be considered for migration when uploaded.</p></td>
</tr>
<tr>
  <td><p>Name of fields</p></td>
  <td><p>One can add multiple columns after this such that it matches the name of a System Field and provides the default value for the entire virtual sheet.</p></td>
</tr>
</tbody>
</table>

#### Sample

| File Name                          | User File Type | Sheet Name | Entity Type      | Program Name | Visit Type | Active | Date of Birth Verified | SubjectTypeUUID                          | Registration Date | Enrolment Date |
| ---------------------------------- | -------------- | ---------- | ---------------- | ------------ | ---------- | ------ | ---------------------- | ---------------------------------------- | ----------------- | -------------- |
| master\_data\_district\_wise\.xlsx | Registration   | AhmedNagar | Individual       |              |            | No     |                        | 8a9b0ef8\-325b\-4f75\-8453\-daeaf59df29d | YYYY\-MM\-DD      |                |
| master\_data\_district\_wise\.xlsx | Enrolment      | AhmedNagar | ProgramEnrolment | GDGS 2019    |            | No     |                        |                                          |                   | YYYY\-MM\-DD   |

### Fields

The mapping for non-calculated fields

<table>
<thead>
<tr>
  <th>Column</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><p>User File Type</p></td>
  <td><p>This is the same as in Sheets.</p></td>
</tr>
<tr>
  <td><p>Form Type</p></td>
  <td><p>[IndividualProfile, Encounter, ProgramEncounter, ProgramEnrolment, ProgramExit, ProgramEncounterCancellation, ChecklistItem, IndividualRelationship]</p></td>
</tr>
<tr>
  <td><p>System Field</p></td>
  <td><p>The concept name is specified in the form.<br/>Or Default field (this can be seen in different importers, See below ).</p></td>
</tr>
<tr>
  <td><p>User Field</p></td>
  <td><p>Name of the column from data.xlsx file</p></td>
</tr>
</tbody>
</table>

#### Default fields for each entity as of Dec 2019

| Subject Registration   | Encounter          | Enrolment       | ProgramEncounter | Checklist       | Relationship     |
| ---------------------- | ------------------ | --------------- | ---------------- | --------------- | ---------------- |
| First Name             | Individual UUID    | Enrolment UUID  | Enrolment UUID   | Enrolment UUID  | EnterDateTime    |
| Last Name              | UUID               | Individual UUID | UUID             | Base Date       | ExitDateTime     |
| Age                    | Visit Type         | Enrolment Date  | Visit Type       | Checklist Name  | IndividualAUUID  |
| Date of Birth          | Encounter DateTime | Address         | Visit Name       | Item Name       | IndividualBUUID  |
| Date of Birth Verified | User               | Exit Date       | Earliest Date    | Completion Date | RelationshipType |
| Gender                 | Voided             | User            | Actual Date      | User            | User             |
| Registration Date      |                    | Voided          | Max Date         | Voided          | Voided           |
| Address Level          |                    |                 | Address          |                 |                  |
| AddressUUID            |                    |                 | Cancel Date      |                 |                  |
| Individual UUID        |                    |                 | User             |                 |                  |
| Catchment UUID         |                    |                 | Voided           |                 |                  |
| SubjectTypeUUID        |                    |                 |                  |                 |                  |
| User                   |                    |                 |                  |                 |                  |
| Voided                 |                    |                 |                  |                 |                  |

Along with these, the implementation-specific observations are also to be mapped.

#### Sample

| User File Type | Form Type         | System Field                         | User Field                     |
| -------------- | ----------------- | ------------------------------------ | ------------------------------ |
| Registration   | IndividualProfile | Individual UUID                      | SiteUUID                       |
| Registration   | IndividualProfile | First Name                           | Site                           |
| Registration   | IndividualProfile | AddressUUID                          | VillageUUID                    |
| Registration   | IndividualProfile | Type of waterbody                    | Type                           |
| Registration   | IndividualProfile | Concerned Govt\. Dept\.              | Concerned Govt\. Dept\.        |
| Enrolment      | ProgramEnrolment  | Silt Estimation as per the work plan | Estimated quantity of Silt cum |
| Enrolment      | ProgramEnrolment  | Individual UUID                      | SiteUUID                       |
| Enrolment      | ProgramEnrolment  | Enrolment UUID                       | EnrolmentUUID                  |

[An example of Metadata.xlsx file](https://docs.google.com/spreadsheets/d/1M0QvcgZ7TagcHvMnTSo3qt-sZHwUDHEiN0T2hlKTn9Y/edit?usp=sharing)  
[An example of Data.xlsx file](https://docs.google.com/spreadsheets/d/19aCEIlODNvJMR68_mGl4Q-Kx6n3qI0Dk4hL0aQ8dwAo/edit?usp=sharing)

> 🚧 UUIDs in Data.xlsx file
> 
> Note that
> 
> - Individual UUID (aka Subject UUID, in this example called SiteUUID), EnrolmentUUID, or any `<Transactional-data UUID>` will have to be manually assigned by the developer before import.
>   - Use tools like uuid: `npm i -g uuid`.
>   - `for n in {1..100}; do uuidgen -r; done` `#to get 100 uuids from CLI`
> - AddressUUID (or Village UUID) will not be available when the data file is provided by the Implmentation. And has to be determined from the `Full Address details` (see example Data.xlsx).
>   - For this get all locations and it's uuid into a `Ref Sheet` in data.xlsx file
>   - do vlookup for uuid by `full address details`

### Google Drive Files

For uploading files (images/documents) you can put the URL of the file. Please follow the following steps:

- Ensure the drive file is shared without any restrictions
- Copy the file link and use this website to get the link that can be put into the excel file to be uploaded - [https://sites.google.com/site/gdocs2direct/?pli=1](https://sites.google.com/site/gdocs2direct/?pli=1)
- Copy the link generated by the above website for your file and put it in the excel/CSV cell.

**Technical link for Avni Team**

_The above website uses the following http request behind the scenes_

`curl 'https://www.google-analytics.com/g/collect?v=2&tid=G-KV5S9LK4WB&gtm=2oe1a1&_p=437198370&gdid=dZWRiYj&cid=1650660276.1673947139&ul=en-gb&sr=1440x900&uaa=x86&uab=64&uafvl=Not%253FA_Brand%3B8.0.0.0%7CChromium%3B108.0.5359.124%7CGoogle%2520Chrome%3B108.0.5359.124&uamb=0&uam=&uap=macOS&uapv=10.14.6&uaw=0&_s=1&sid=1673947138&sct=1&seg=1&dl=https%3A%2F%2Fsites.google.com%2Fsite%2Fgdocs2direct%2F%3Fpli%3D1&dr=https%3A%2F%2Fwww.google.com%2F&dt=Google%20Drive%20Direct%20Link%20Generator&en=page_view&_ee=1' 
  -X 'POST' 
  -H 'authority: www.google-analytics.com' 
  -H 'accept: _/_' 
  -H 'accept-language: en-GB,en;q=0.9,hi-IN;q=0.8,hi;q=0.7,en-US;q=0.6,de;q=0.5' 
  -H 'content-length: 0' 
  -H 'dnt: 1' 
  -H 'origin: https://sites.google.com' 
  -H 'referer: https://sites.google.com/' 
  -H 'sec-ch-ua: "Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"' 
  -H 'sec-ch-ua-mobile: ?0' 
  -H 'sec-ch-ua-platform: "macOS"' 
  -H 'sec-fetch-dest: empty' 
  -H 'sec-fetch-mode: no-cors' 
  -H 'sec-fetch-site: cross-site' 
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' 
  --compressed`
### Importing Excel Data

> ❗️ Avni does not support Excel based import any longer, please refer to Admin App based approach to upload data [Bulk Data Upload page](https://avni.readme.io/docs/upload-data#is-the-order-of-values-important)

> 🚧 Introduction
>
> Read [https://avni.readme.io/v2.0/docs/structure-import-metadata-excel-excel](https://avni.readme.io/v2.0/docs/structure-import-metadata-excel-excel)

**Note: dates get parsed incorrectly sometimes while converting from CSV to XLSX in Google Sheets (Eg. 12-01-2018 (dd-mm-yyyy) gets parsed as 01/12/2018) which may not be easy to spot. One solution is to download the CSV file and convert to XLSX in LibreOffice.**

[An example of Metadata.xlsx file](https://docs.google.com/spreadsheets/d/1M0QvcgZ7TagcHvMnTSo3qt-sZHwUDHEiN0T2hlKTn9Y/edit?usp=sharing)\
[An example of Data.xlsx file](https://docs.google.com/spreadsheets/d/19aCEIlODNvJMR68_mGl4Q-Kx6n3qI0Dk4hL0aQ8dwAo/edit?usp=sharing)
### Encryption Of Data On The Android App

Some implementations require a higher level of security, which includes encryption of the database on Android. 

### How to enable encryption:

To have all the users field app database encrypted, the option for encryption need to be enabled under `Organisation Details`  as shown in the image below. Users would be in need to sync the app, to reflect the encryption setting change.

<Image align="center" src="https://files.readme.io/e132e70-Screenshot_2023-08-14_at_4.24.22_PM.png" />

### Side-effects of using the feature:

* As shown in the warning message in the image above, enabling this feature will not permit the user to use [fast sync](https://avni.readme.io/docs/fast-sync) and upload db feature from the Menu options on the field app.
* After the option is enabled, it can be disabled anytime on change of mind. 

### Developer debug notes:

* To see the data of encrypted realm db, print out the commented out line that calculates `hexEncodedKey` in the `EncryptionService`. And use the printed value to open the realm db when it asks for the encryption key as shown in the image below.

<Image align="center" src="https://files.readme.io/e79ad32-Screenshot_2023-08-09_at_4.41.56_PM.png" />
### Integration Service Operations

Please refer to the [Integration design and developer guide](doc:integration-developer-guide) for - how to develop integration code. This guide describes how to operate and support the integration service

### Managing Metadata Mapping

When new fields or sometimes entity types come up in the system or incorrect mapping needs to be fixed, then the one can use the Metadata Mapping tab to do so. For all entities and fields in Avni name/title is used. For other system it could be UUID or some other identifier. When providing the field mapping one should provide the parent entity type of the field.

### Integration job monitoring

* Background jobs can be monitored via [https://healthchecks.io/](https://healthchecks.io/). The failure here indicates that the background job didn't complete in time. It could be because the job didn't run, or it hung, or it failed with error. A ticket can be raised or product team support can be taken when this happens.
  * If it failed for error then the error can be checked in Bugsnag. The stack trace and link to the error can be put in the ticket. Usually these should be urgent tickets.

### Business Error monitoring

The integration module is coded to handle business errors. These are also called classified errors. The errors can be viewed from the Error tab in the admin app. The operations team should ignore these errors when the system is handed over to the customer. The customer is responsible for looking at classified errors and fixing them by fixing the data.

The classified errors are due to data in Avni or the integrated system - never in the integration service module. If this is not the case then product team should be informed.

For each classified error the required action must be available in the document as to how to rectify them.

In most integration systems, these errors are frequent - hence no specific monitoring has been put up for this. But it can be if required.

### Frequency of scheduled job

Each module has two scheduled jobs - for regular and error processing. The regular job performs synchronising in both directions (if applicable). These jobs can be run more or less frequently via the system environment variable of the integration service.
### Organisation Group

If an organisation works with other sub-organisations performing same activity and if it wants each sub-organisation to be able to view/manage only their data - then one can check organisation group feature to solve for:

* Same app definition shared across partner organisations
* Each partner organisation get their own dashboard and reports without being able to see data from other partner organisations.
* Super organisation to be able to have a dashboard where they can view all sub-organisation data.

> 🚧 Should not be used when the number of partner organisations can grow a large number over time.

### Organisation and organisation groups

1. Mainline Organisation - for maintaining the trunk of source bundle
2. Release Organisation - for maintaining the released branch of source bundle
3. One production organisation for each partner organisation. One production organisation group.
4. Two UAT organisations. One organisation group consisting of these two organisations)
   1. Two organisations allow us to replicate the organisation group.

### Testing Deployment

Active development take places on mainline organisation.

### Release Deployment

1. The bundle from mainline organisation is released to release organisation and sanity testing can be done on this.
2. The bundle from release organisation is uploaded to each production organisation.

### Managing locations

There are two options.

1. There is one location set that is used by all partner organisations. These locations are to be imported in each organisation.
2. Each organisation has their own locations. In this case if the same logical location is used by multiple organisations, then Location should suffixed like Location1 (Org 1), Location2 (Org 1) when uploading. See the filters section below for the trade-off.

### Reporting

Metabase is not right tool for such setup and SuperSet should be used.

#### How to create separation between different partner organisations so that they do not see each other's data.

1. All reports should connect using the organisation group db\_user to the database. ETL should be enabled for only organisation group.
2. Setup row level security and roles for each organisation (feature of Superset).
3. Assign correct role to the user when provisioning users from any partner organisation
4. For users who can see the reports for all organisations no role level security role is required.

### Filters

1. Filters like dates and hardcoded values there is nothing different to be done.

2. (Assumes row-level security works for filter queries as well) Filters that display drop downs like any concept's coded values, location types query with distinct clause should be used. Distinct clause is required for super organisation users, other wise they will see repeated values from each organisation.
   1. In query match against the concept, location type name and not ID or UUID.

3. (Assumes row-level security works for filter queries as well) Filters displaying location
   1. If approach 2 has been taken the users will be required to select all locations for same logical location.

## Access control

1. App Designer, Location Types - Recommended that these edit access is not provided for these to the customer.
2. Location - In Approach 1 (in Managing Locations), the access should not be given to the customer. In approach 2 one can do that with some training on naming if required.
3. User Groups - If access has to be given to customers then the tradeoff is in giving up on centralised source bundle management and it should excluded from bundles every time.

## Activities to consider when creating multiple organisations

1. Setup of organisations as described above
2. Release is more complex than for regular organisation
3. Each partner addition will require release activities like org setup, bundle upload, location setup and administrator training, row-level security / roles creation in superset, higher support required due to lack of access control that can be provided to the customers.
### About Audit Information

In Avni mobile app the user can see certain audit information. The app displays:

1. Created by user for subjects and program enrolments.
2. Filled by user for program encounters and general encounters. This is the user who filled the form. For scheduled encounters - this is the person who filled the form and not the person who was instrumental in scheduling the encounter.
3. Where ever the audit information is not available (see below), no audit information will be shown. In other words if the audit information is not shown then it will be due to the following.

### When is the audit information not shown.

1. Since this feature has been introduced only now, release 7.0, all audit information are not available for older records and it will start showing up only for the newer records.
### Sync Capabilities

## Offline

Avni works completely in offline mode except during login and sync. The first time sync runs just after login.

## About Sync

* Download - Get data meant for the user from the server onto the device. It is incremental after first sync after login.
* Upload - Uploads any new data created by the user.

| Sync Initiation | Function         | Frequency      |
| :-------------- | :--------------- | :------------- |
| Login           | Download, Upload | NA             |
| Manual Sync     | Download, Upload | NA             |
| Auto Sync       | Upload           | Every hour     |
| Auto Sync       | Download         | Every 12 hours |

<br/>

## More about Auto Sync

Auto sync needs to run in the background when the user is not using the app for data integrity and app availability to the user.

* Battery usage - Upload sync should have minimal device resource usage as it will do anything only if the user has captured any new data. Download sync will run twice in a day and the duration for which it runs depends on Internet quality and amount of incremental data it has to get from the server. Also, if the internet quality is poor the device is mostly be CPU idle during the sync.
  * The users may report unusual battery usage using the Battery Usage in the settings for a period of time > 1 day.
### User Subject Types

A user subject type is a type that can be used to manage information about users of the system. Each user will have one subject created based on a User type SubjectType. This subject and any data collected against it's encounters and enrolments correspond only to that particular user.

## Special Characteristics

* **Subject Type Create / Edit**: Once a User type SubjectType is created, Avni doesnot allow Administrators to modify the basic configurations of the SubjectType. Ensure that you configure the Subject as needed at the outset. Contact Avni Support if you need any modifications to be done for the User type SubjectType.

  * Registration Date for the subject will be same as User Creation DateTime
  * Toggle of 'Allow empty location' is disabled and is always set to true
  * User's username is inserted as Subject's Firstname
* **Subject Type Create / Edit**: You may only edit the below shown properties post SubjectType creation.

<Image align="center" width="600px" src="https://files.readme.io/ba11a11-Screenshot_2024-05-17_at_3.40.56_PM.png" />

* **Sync**: By default, User type Subjects follow their own Sync strategy, which is currently, to sync a User type Subject only to its corresponding User
* **Subject Creation**: On creation of a "User" type SubjectType, we **automatically** create User type subjects :
  * for every new User created thereafter via the "Webapp" 
  * for new Users created via "CSV Uploads", by triggering a Background Job
  * for all existing Users, by triggering a Background Job
* **Registration disallowed for User type SubjectTypes**: 
When a User type SubjectType is created, the default registration form mapping is not created and hence subjects for this subject type cannot be registered.

* **Access to User type Subject on the client**: Users cannot make use of "Subject Search" capability to access the User type Subject on the Client. They would always have to make use of "Filter" button on "My Dashboard" to select the User type Subject, as shown below.

<Image alt="Select User type in the Subject Filter" align="center" width="500px" border={true} src="https://files.readme.io/f265252-Screenshot_2024-05-17_at_4.23.24_PM.png">
  Select User type in the Subject Filter
</Image>

For organisations that use a Custom Dashboard as the Primary Dashboard, they can easily configure a Offline Report card to provide access to User type Subject.

* **Actions allowed on the User type Subject**: Avni allows organisation to configure a User type Subject similar to the way they would configure a "Person" / "Individual" type Subject types. i.e. they are free to setup Program, Encounter, VisitScheduleRules and so on. They can also configure Privileges in-order to restrict these actions across different UserGroups. A sample screen recording of the client, which has full access to a User type Subject is attached below for reference.

<Image align="center" className="border" width="500px" border={true} src="https://files.readme.io/d966e6d-output.gif" />
### Child Growth Charts

## Introduction to Child Growth Indicators

Growth charts are essential tools for monitoring the physical development of children. They help healthcare providers assess whether a child is growing properly according to established standards.

Refer to WHO's [child-growth-standards](https://www.who.int/tools/child-growth-standards/standards) for in-depth coverage on all indicators used to assess the growth of a child. These indicators are intended for interpretation primarily by healthcare providers to:

* Investigate causes of growth problems 
* Counsel caregivers on recovery 
* Intervene in urgent high-risk scenarios to avert permanent damage or mortality

The child's age, sex, and measurements of weight and length or height are used to calculate the following growth indicators as per WHO standards for children aged 0 to 5 years:

* **Weight-for-age (WFA)**: Helps identify underweight or overweight conditions
* **Length/height-for-age (HFA)**: Helps identify stunting (low height for age)
* **Weight-for-length/height (WFH)**: Helps identify wasting (low weight for height) or obesity

These measurements should be taken and recorded whenever an infant or child visits a healthcare provider, such as for immunization, well-baby visits, or care during illness.

## Growth Chart Features in Avni

### Supported Indicators

The Avni client application provides growth charts for the following indicators by default:

* Weight-for-age (WFA)
* Length/height-for-age (HFA)
* Weight-for-length/height (WFH)

### Automatic Enablement

In Avni, growth chart monitoring is automatically enabled when a program with the name "Child" or "Phulwari" is created for an organization.

### Manual Enablement

For any other Program, Growth Chart monitoring can be enabled by toggling the "Show Growth Chart" widget to the Program Dashboard.

<Image align="center" src="https://files.readme.io/8e5736a641553e404b24d0ef935974afe08256a0d1a549e3f4e16d22c743bbb8-Screenshot_2025-05-29_at_6.16.30_PM.png" />

### Required Configuration

It is essential for at least a few forms of the types listed below to include concepts with the names **"Weight" and "Height"**. The values recorded for these concepts are then automatically used by the Avni application to plot the Growth Charts.

* Individual   
* Program  
* Program-Encounter     
* Encounter 

## Accessing Growth Charts

Growth Charts are available only in the Avni Client application for:

* Individuals between ages 0 to 5 years AND
* Individuals enrolled in either a program named "Child" or "Phulwari" OR any other Program that has the "Show Growth Chart" widget enabled for it

For eligible children, a "Growth Chart" button will appear on the Program Dashboard.

<Image alt="Growth Chart Button on Dashboard" align="center" width="320px" src="https://files.readme.io/16d426511ff8c27feacc0843fa7a88b1d4fd04e7af7b120fc3897146acc304c1-Screenshot_2025-05-29_at_6.29.01_PM.png">
  Screenshot showing the Growth Chart button on the Program Dashboard
</Image>

Clicking the "Growth Chart" button displays the growth chart with selector buttons at the top, allowing users to choose which specific growth indicator to display for that child.

<Image alt="Weight-for-Age Chart" align="center" width="320px" src="https://files.readme.io/4c985dc341f4e6e2548e784d742da8fba12de51699cdd7487f64f48482bf18a6-Screenshot_2025-05-29_at_6.28.39_PM.png">
  Screenshot of Weight-for-Age growth chart
</Image>

<Image alt="Height-for-Age Chart" align="center" width="320px" src="https://files.readme.io/e0d418b61e5fbd95c51651467c2c3f23f086021fea95bb9ed3ee5eda5a7b3575-Screenshot_2025-05-29_at_6.28.47_PM.png">
  Screenshot of Height-for-Age growth chart
</Image>

<Image alt="Weight-for-Height Chart" align="center" width="320px" src="https://files.readme.io/70cbcdfe31ed6d76c00445dadbfa747db32e6b75af17d9c1cd07c681abbcd262-Screenshot_2025-05-29_at_6.28.51_PM.png">
  Screenshot of Weight-for-Height growth chart
</Image>

## Understanding Growth Charts

### Chart Components

* **Reference Lines**: Standard deviation lines (typically -3SD, -2SD, -1SD, Median, +1SD, +2SD, +3SD) showing expected growth ranges based on WHO standards
* **Data Points**: Plotted points representing the individual's measurements at different ages
* **Connecting Line**: Line connecting the individual's data points to show growth trajectory
* **X-Axis**: Typically represents age in months/years
* **Y-Axis**: Represents the measurement value (weight, height, etc.)

### Color Indicators

Growth Charts use color coding to help quickly identify growth status:

* **Red Zone**: Indicates measurements below -3SD (severe malnutrition or growth faltering)
* **Yellow/Orange Zone**: Indicates measurements between -2SD and -3SD (moderate malnutrition)
* **Green Zone**: Indicates measurements above -2SD (normal/healthy ranges)

## Interpreting Growth Charts

When viewing a growth chart in Avni:

### Weight-for-Age (WFA)

* Measures overall growth and can identify underweight children
* Below -2SD: Moderately underweight
* Below -3SD: Severely underweight
* Current Status: The position of the most recent data point relative to reference lines indicates current nutritional status

### Height-for-Age (HFA)

* Measures linear growth and can identify stunting
* Below -2SD: Moderately stunted
* Below -3SD: Severely stunted
* Growth Trajectory: The direction of the connecting line shows if height growth is improving, maintaining, or declining

### Weight-for-Height (WFH)

* Measures body weight relative to height and can identify wasting
* Below -2SD: Moderate wasting
* Below -3SD: Severe wasting
* Above +2SD: Overweight
* Above +3SD: Obese
* Pattern Recognition: Multiple data points help identify patterns like wasting or weight gain relative to height

## Using Growth Chart Data for Interventions

Based on the growth chart visualization, field workers can:

1. **Identify Growth Patterns**:
   * Normal growth: Data points consistently follow a growth channel
   * Growth faltering: Flattening or downward trajectory of the curve
   * Catch-up growth: Upward trajectory after a period of growth faltering

2. **Take Appropriate Actions**:
   * Normal Growth: Continue regular monitoring and standard care
   * Moderate Concerns (between -2SD and -3SD): Implement nutritional counseling and follow-up monitoring
   * Severe Concerns (below -3SD): Refer for specialized care, nutritional interventions, or further assessment

## Technical Implementation Details

* Growth charts are dynamically rendered based on recorded encounter data
* Charts require accurate recording of birth date and measurement values
* Reference data follows WHO Child Growth Standards
* Charts are available offline once data is synced to the device
* The implementation follows Avni's offline-first architecture, ensuring charts are available even without internet connectivity
* Data points are automatically plotted based on encounter data containing Weight and Height measurements
* Growth charts interface adapts to different screen sizes on mobile devices

## Troubleshooting

If growth charts are not displaying correctly:

1. Verify that concepts named exactly "Weight" and "Height" are included in encounter forms
2. Ensure measurements are recorded in the correct units (kg for weight, cm for height)
3. Confirm the child's date of birth is recorded accurately. Current implementation supports display of Growth Chart only for children aged 0-5 years
4. Check that multiple encounters with measurements exist for proper trend visualization
5. Sync your device to ensure you have the latest program configuration
6. Verify that the program name is either "Child" or "Phulwari" to enable Growth Chart functionality automatically. For other programs, Growth Chart functionality can be enabled by toggling the "Show Growth Chart" widget to the Program Dashboard

## Summary

Avni's Growth Chart functionality provides a powerful tool for field workers to monitor and assess child growth in accordance with WHO standards. The offline-first implementation ensures that these critical assessment tools are available even in areas with limited connectivity, aligning with Avni's core mission of supporting field workers in remote areas.

By following the simple configuration requirements and understanding how to interpret the charts, organizations can effectively track child growth and development, enabling timely interventions when needed.
### App Storage Management And Sync Disable

### Need

After an organisation has run Avni for a few years, the amount of data collected over time can be sizeable depending on the scale of the program, number of subjects registered, number of times they were visited etc. Depending on the program objectives and especially for organisations where catchment based division of data is not used or is not effective, all of this historical data may not be of use to a field user who has just joined the organisation and is starting to use Avni. This unnecessary data causes longer initial sync time, slower dashboard loads and increases the storage used by the Avni app on the user's device.

### Solution

In order to address this, implementers can now configure an SQL query which returns the subject ids of subjects which should be disabled from being synced when a sync from the android app is performed.

This configuration can be made via the 'App Designer -> [App Storage Config](https://app.avniproject.org/#/appdesigner/appStorageConfig)' menu. 
**Note: To configure this feature, the user must have the "Edit organisation configuration" permission.** 
This query is validated to ensure it returns a single numeric column (the subject id) as output.

The query configured via this screen is picked up by a job that runs on a daily basis (configured to run at 2AM IST) which finds subjects based on this query and disables **subsequent sync to android app on user devices** for these subjects and the related entities for these subjects (visits, program visits, entity approval status, subject migration, user subject assignments, relationships, groups, checklists, comments, subject program eligibility etc).

### Example

To disable sync for subjects that were created more than 2 years ago, the query would look like:

`select i.id from public.individual i where i.created_date_time < now() - interval '2 years';`

Remember that this job runs every night so it will keep disabling sync for records that match the criteria on a continuing basis if the condition specified in the query is relative.

### Notes

1. If the subjects (and related entities) are already present on the user device (from a previous sync or via fast sync etc), they are not deleted from the device and the user will be able to view and update them. Updates made to such subjects on the android app will be updated on the server when synced. Other users with access to these subjects will however, not receive these updated records on the android app when they sync.
2. Dashboards on the android app may differ between users having the same sync settings depending on when the respective users synced.
3. DEA users will continue to see these records and will be able to update them and see the updates.
4. No impact to existing reports and exports (sync disabled records will be included).
5. There are constraints in place to prevent the sync disabled value for related entities from becoming different from the sync disabled field for the subject. In order to prevent sync errors, `sync_disabled` should never be updated via SQL query for any entity.
6. Writing a query that looks up tables from the ETL org-specific schema might not have the intended result as the ETL schema is not guaranteed to be in sync with the public schema when the job executes.
### When To Use Translations

Since the issue of change in concept name has come up a few times - in terms of what impact it would have on rules. Also, we use uuid for concept as the name can change - but this reduces readbility of the rule.\
Here is a mental model to think about this.

Concept name, form element name should be considered programming keywords - representing an idea.\
e.g. Mother's name\
When we name a concept/element in app designer we are defining a name for it in the programming realm not in the user realm.

How this idea is presented to user is using an English translation or another language translation.\
What does English translation represent?\
It represents a mapping from the idea to a view for the user.

So two realms - programming and user.\
What is the benefit of this?

As long the the core idea doesn't change, there is no need to change the name of the concept/element.\
e.g. if the customer says we want to call it - Name of mother - then it is a change only in the user's realm not programming realm.

So we can simply change/add a translation for it based on the user/customer's preference. The translation feature offers a decoupling between programming and user realm.

Following from this, there is no need to use UUID of the concept in the rule. Why? Because once the concept/element name is defined, there is no need to change it based on what user/customer wants it to be named.

Concept/element should be renamed only if there is a semantic change in the idea behind it - this happens very rarely.

If there a typo in the name, then you can change it, but remember there is cost to it - which may or may not be worth paying - depending on how deep you have been in the cycle of the project.\
Avni has been designed such that almost everything can be shown to the user in their own language.\
But what also follows from this is - everything is also defined separately in the programmer and user realms.
### Worklist Configuration

## Overview

Worklists in Avni are a powerful feature that enables **sequential form workflows** by automatically chaining multiple forms together. When a user completes one form, the system can automatically present the next form in the sequence, creating smooth data collection workflows for field workers.

## Table of Contents

1. [What are Worklists?](#what-are-worklists)
2. [Basic Concept](#basic-concept)
3. [Writing Worklist Updation Rules](#writing-worklist-updation-rules)
4. [Limitations and Gotchas](#limitations-and-gotchas)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices Summary](#best-practices-summary)

***

## What are Worklists?

A **Worklist** is a sequence of forms that are presented to the user one after another. Each item in the worklist is called a **WorkItem**. When a user completes a form, Avni can automatically:

* Navigate to the next form in the sequence
* Pass context/data between forms
* Show appropriate "Save and Proceed" buttons
* Handle different types of forms (Registration, Encounters, Program Enrolment, etc.)

### Key Components

* **WorkList**: Container holding multiple WorkItems
* **WorkItem**: Individual form/task in the sequence
* **WorkItem Types**: REGISTRATION, ENCOUNTER, PROGRAM_ENCOUNTER, PROGRAM_ENROLMENT, PROGRAM_EXIT, ADD_MEMBER, HOUSEHOLD, REMOVE_MEMBER, CANCELLED_ENCOUNTER
* **Worklist Updation Rule**: JavaScript code that modifies the worklist dynamically

***

## Basic Concept

Think of a worklist as a **to-do list for forms**. Instead of manually navigating between forms, the system automatically takes you to the next form when you complete the current one.

### Simple Example: Family Registration + Health Survey

**Scenario**: When registering a new family member, you want to automatically conduct a health survey.

**What happens**:

1. User starts family member registration
2. User fills registration form and clicks "Save and Proceed"
3. System automatically opens health survey form
4. User completes survey and saves
5. User returns to dashboard

**Benefits**:

* Reduces navigation time
* Ensures data collection completeness
* Improves user experience
* Maintains data consistency

### When to Use Worklists

✅ **Good Use Cases**:

* Registration followed by baseline survey
* Multi-step enrollment processes
* Sequential health checkups
* Family member registration workflows
* Program enrollment with immediate first encounter

❌ **Not Suitable For**:

* Independent forms that don't need to be linked
* Complex branching workflows (use form rules instead)
* Forms that require external data validation between steps

***

## Writing Worklist Updation Rules

Worklist Updation Rules are JavaScript functions that modify worklists dynamically based on form data, user context, or business logic.

#### Rule Structure

```javascript
({params, imports}) => {
    const workLists = params.workLists;
    const context = params.context;
    const WorkItem = imports.models.WorkItem;
    
    // Your logic here
    
    return workLists; // Always return modified workLists
}
```

#### Available Parameters

```javascript
// params object contains:
{
    workLists: WorkLists,     // Current worklist container
    context: {                // Form completion context
        entity: Individual,   // The entity that was just saved
        // Additional context based on form type
    }
}

// imports object contains:
{
    models: {                 // Avni model classes
        WorkItem,
        WorkList,
        WorkLists,
        Individual,
        // ... other models
    },
    rulesConfig,             // Rule configuration utilities
    common,                  // Common utility functions
    lodash,                  // Lodash library
    moment,                  // Moment.js for dates
    globalFn                 // Global rule functions
}
```

### WorkItem Types and Parameters

#### 1. REGISTRATION

```javascript
new WorkItem(uuid, WorkItem.type.REGISTRATION, {
    subjectTypeName: "Individual",  // Required
    uuid: existingSubjectUuid      // Optional: for editing
    // Note: subjectUUID is NOT required for REGISTRATION
})
```

#### 2. ENCOUNTER

```javascript
new WorkItem(uuid, WorkItem.type.ENCOUNTER, {
    encounterType: "Health Survey",  // Required
    subjectUUID: individual.uuid,    // Required
    uuid: existingEncounterUuid     // Optional: for editing
})
```

#### 3. PROGRAM_ENCOUNTER

```javascript
new WorkItem(uuid, WorkItem.type.PROGRAM_ENCOUNTER, {
    encounterType: "ANC Visit",              // Required
    programEnrolmentUUID: enrolment.uuid,    // Optional
    subjectUUID: individual.uuid,            // Required
    name: "ANC 1",                          // Optional: encounter name
    uuid: existingEncounterUuid             // Optional: for editing
})
```

#### 4. PROGRAM_ENROLMENT

```javascript
new WorkItem(uuid, WorkItem.type.PROGRAM_ENROLMENT, {
    programName: "Maternal Health",  // Required
    subjectUUID: individual.uuid     // Required
})
```

#### 5. PROGRAM_EXIT

```javascript
new WorkItem(uuid, WorkItem.type.PROGRAM_EXIT, {
    programName: "Maternal Health",     // Required
    programEnrolmentUUID: enrolment.uuid, // Optional
    subjectUUID: individual.uuid        // Required
})
```

#### 6. ADD_MEMBER

```javascript
new WorkItem(uuid, WorkItem.type.ADD_MEMBER, {
    uuid: existingMemberUuid,           // Optional: for editing
    groupSubjectUUID: household.uuid,   // Required
    subjectTypeName: "Individual",      // Required
    member: memberObject,               // Required
    individualRelative: relativeObject, // Required
    headOfHousehold: false,             // Required
    relativeGender: gender              // Required
    // Note: subjectUUID is NOT required for ADD_MEMBER
})
```

#### 7. HOUSEHOLD

```javascript
new WorkItem(uuid, WorkItem.type.HOUSEHOLD, {
    saveAndProceedLabel: 'saveAndAddMember', // Required
    household: '2 of 5',                     // Required
    headOfHousehold: false,                  // Required
    currentMember: 2,                        // Required
    groupSubjectUUID: household.uuid,        // Required
    message: 'newMemberAddedMsg',           // Required
    totalMembers: 5                         // Required
    // Note: subjectUUID is NOT required for HOUSEHOLD
})
```

#### 8. REMOVE_MEMBER

```javascript
new WorkItem(uuid, WorkItem.type.REMOVE_MEMBER, {
    groupSubjectUUID: household.uuid,  // Required
    memberSubjectUUID: member.uuid,    // Optional
    subjectTypeName: "Individual"      // Optional
})
```

#### 9. CANCELLED_ENCOUNTER

```javascript
new WorkItem(uuid, WorkItem.type.CANCELLED_ENCOUNTER, {
    encounterType: "ANC Visit",              // Required
    programEnrolmentUUID: enrolment.uuid,    // Optional: for program encounters
    subjectUUID: individual.uuid,            // Required
    uuid: existingEncounterUuid             // Required: for cancellation
})
```

### WorkItem Validation Rules

Each WorkItem type has specific validation requirements enforced by the system:

#### Required Parameters by Type:

* **REGISTRATION**: `subjectTypeName`
* **ENCOUNTER**: `encounterType`, `subjectUUID`
* **PROGRAM_ENCOUNTER**: `encounterType`, `subjectUUID`
* **PROGRAM_ENROLMENT**: `programName`, `subjectUUID`
* **PROGRAM_EXIT**: `programName`, `subjectUUID`
* **ADD_MEMBER**: `groupSubjectUUID` (subjectUUID NOT required)
* **HOUSEHOLD**: No subjectUUID required
* **REMOVE_MEMBER**: `groupSubjectUUID`
* **CANCELLED_ENCOUNTER**: `encounterType`, `subjectUUID`

#### Special Validation Rules:

* `subjectUUID` is **NOT required** for: `REGISTRATION`, `ADD_MEMBER`, `HOUSEHOLD`
* All other WorkItem types require `subjectUUID`
* Missing required parameters will cause validation errors during WorkItem creation

### Available API Methods

#### WorkLists Methods

```javascript
// Get current WorkItem
const currentItem = workLists.getCurrentWorkItem();

// Add WorkItems to current WorkList (Recommended approach)
workLists.addItemsToCurrentWorkList(workItem1, workItem2, workItem3);

// Preview next WorkItem without moving
const nextItem = workLists.peekNextWorkItem();

// Add parameters to current WorkItem
workLists.addParamsToCurrentWorkList({
    additionalData: 'value'
});
```

#### WorkList Methods

```javascript
// Find WorkItem by ID
const workItem = currentWorkList.findWorkItem(workItemId);

// Find WorkItem index (useful for insertion)
const index = currentWorkList.findWorkItemIndex(workItemId);

// Add multiple WorkItems
currentWorkList.addWorkItems(workItem1, workItem2);

// Get next WorkItem
const next = currentWorkList.nextWorkItem();
```

### Real-World Examples

#### Example 1: Registration + Health Survey (Recommended API)

```javascript
({params, imports}) => {
    const workLists = params.workLists;
    const context = params.context;
    const WorkItem = imports.models.WorkItem;
    const _ = imports.lodash;
    
    // Add health survey after individual registration
    if (_.get(context, 'entity.individual.subjectType.name') === 'Individual') {
        const healthSurvey = new WorkItem(
            imports.common.randomUUID(), 
            WorkItem.type.ENCOUNTER,
            {
                encounterType: 'Health Survey',
                subjectUUID: _.get(context, 'entity.individual.uuid')
            }
        );
        
        // RECOMMENDED: Use the proper API
        workLists.addItemsToCurrentWorkList(healthSurvey);
    }
    
    return workLists;
}
```

#### Example 2: Age-Based Conditional Workflows

```javascript
({params, imports}) => {
    const workLists = params.workLists;
    const context = params.context;
    const WorkItem = imports.models.WorkItem;
    const _ = imports.lodash;
    
    const individual = _.get(context, 'entity.individual');
    const age = individual.age;
    
    if (individual.subjectType.name === 'Individual') {
        let encounterType;
        
        // Different surveys based on age
        if (age < 5) {
            encounterType = 'Child Health Survey';
        } else if (age >= 5 && age < 18) {
            encounterType = 'Adolescent Health Survey';
        } else {
            encounterType = 'Adult Health Survey';
        }
        
        const survey = new WorkItem(
            imports.common.randomUUID(),
            WorkItem.type.ENCOUNTER,
            {
                encounterType: encounterType,
                subjectUUID: individual.uuid
            }
        );
        
        // RECOMMENDED: Use the proper API
        workLists.addItemsToCurrentWorkList(survey);
    }
    
    return workLists;
}
```

#### Example 3: Program Enrollment with Immediate First Visit

```javascript
({params, imports}) => {
    const workLists = params.workLists;
    const context = params.context;
    const WorkItem = imports.models.WorkItem;
    const _ = imports.lodash;
    
    const enrolment = _.get(context, 'entity');
    
    // After ANC program enrollment, add first ANC visit
    if (enrolment && enrolment.program.name === 'Maternal Health') {
        const firstVisit = new WorkItem(
            imports.common.randomUUID(),
            WorkItem.type.PROGRAM_ENCOUNTER,
            {
                encounterType: 'ANC Visit',
                programEnrolmentUUID: enrolment.uuid,
                subjectUUID: enrolment.individual.uuid,
                name: 'ANC 1'
            }
        );
        
        // RECOMMENDED: Use the proper API
        workLists.addItemsToCurrentWorkList(firstVisit);
    }
    
    return workLists;
}
```

#### Example 4: Household Member Addition

```javascript
({params, imports}) => {
    const workLists = params.workLists;
    const context = params.context;
    const WorkItem = imports.models.WorkItem;
    const _ = imports.lodash;
    
    const individual = _.get(context, 'entity.individual');
    
    // For household head registration, add member addition workflows
    if (individual.subjectType.isHousehold()) {
        const totalMembers = _.get(context, 'totalMembers', 3); // Default 3 members
        
        for (let i = 2; i <= totalMembers; i++) {
            const addMember = new WorkItem(
                imports.common.randomUUID(),
                WorkItem.type.ADD_MEMBER,
                {
                    groupSubjectUUID: individual.uuid,
                    subjectTypeName: 'Individual',
                    household: `${i} of ${totalMembers}`,
                    headOfHousehold: false,
                    currentMember: i,
                    totalMembers: totalMembers,
                    saveAndProceedLabel: 'saveAndAddMember',
                    message: 'newMemberAddedMsg'
                }
            );
            
            // RECOMMENDED: Use the proper API
            workLists.addItemsToCurrentWorkList(addMember);
        }
    }
    
    return workLists;
}
```

#### Example 5: Complex Conditional Workflow (Advanced Pattern)

```javascript
({params, imports}) => {
    const workLists = params.workLists;
    const context = params.context;
    const WorkItem = imports.models.WorkItem;
    const _ = imports.lodash;
    
    const addChildRegistrationWorkflow = () => {
        const currentWorkList = workLists.currentWorkList;
        
        // Find position after current WorkItem for insertion
        const currentWorkItem = workLists.getCurrentWorkItem();
        const splicePosition = currentWorkList.findWorkItemIndex(currentWorkItem.id) + 1;
        
        // Insert child registration and enrollment
        currentWorkList.workItems.splice(
            splicePosition,
            0,
            new WorkItem(imports.common.randomUUID(), WorkItem.type.REGISTRATION, {
                subjectTypeName: "Individual",
                saveAndProceedLabel: "registerAChild"
            }),
            new WorkItem(imports.common.randomUUID(), WorkItem.type.PROGRAM_ENROLMENT, {
                programName: "Child"
            })
        );
    };
    
    const reorderPNCEncounter = () => {
        const workItems = workLists.currentWorkList.workItems;
        const pncIndex = workItems.findIndex(item => 
            item.parameters.encounterType === "PNC"
        );
        const neonatalIndex = workItems.findIndex(item => 
            item.parameters.encounterType === "Neonatal"
        );
        
        if (pncIndex !== -1 && neonatalIndex !== -1) {
            // Move PNC encounter before Neonatal encounter
            const [pncWorkItem] = workItems.splice(pncIndex, 1);
            const newNeonatalIndex = workItems.findIndex(item => 
                item.parameters.encounterType === "Neonatal"
            );
            workItems.splice(newNeonatalIndex, 0, pncWorkItem);
        }
    };
    
    // Main workflow logic
    const currentWorkItem = workLists.getCurrentWorkItem();
    
    if (currentWorkItem.type === WorkItem.type.PROGRAM_ENCOUNTER) {
        switch (currentWorkItem.parameters.encounterType) {
            case "Delivery": {
                addChildRegistrationWorkflow();
                break;
            }
            case "Monthly needs assessment": {
                // Add conditional enrollment based on assessment
                const programEncounter = context.entity;
                const isPregnant = _.some(programEncounter.observations, 
                    obs => obs.concept.name === "Whether currently pregnant" && 
                           obs.getValue() === "Yes"
                );
                
                if (isPregnant) {
                    workLists.addItemsToCurrentWorkList(
                        new WorkItem(imports.common.randomUUID(), 
                            WorkItem.type.PROGRAM_ENROLMENT, {
                                programName: "Mother",
                                subjectUUID: programEncounter.programEnrolment.individual.uuid
                            }
                        )
                    );
                }
                break;
            }
        }
    }
    
    if (currentWorkItem.type === WorkItem.type.PROGRAM_ENROLMENT) {
        if (currentWorkItem.parameters.programName === "Child") {
            reorderPNCEncounter();
        }
    }
    
    return workLists;
}
```

### WorkItem Management Approaches

#### Method 1: Using WorkLists API (Recommended)

```javascript
// This is the preferred approach used in the codebase
workLists.addItemsToCurrentWorkList(
    new WorkItem(imports.common.randomUUID(), WorkItem.type.ENCOUNTER, {
        encounterType: 'Health Survey',
        subjectUUID: individual.uuid
    })
);
```

#### Method 2: Direct Array Manipulation

```javascript
// This also works but is more manual
const totalItems = workLists.currentWorkList.workItems.length;
workLists.currentWorkList.workItems.splice(totalItems - 1, 0, newWorkItem);

// Or append to end
workLists.currentWorkList.workItems.push(newWorkItem);
```

#### Method 3: Using WorkList API

```javascript
// For direct WorkList manipulation
const currentWorkList = workLists.currentWorkList;
currentWorkList.addWorkItems(workItem1, workItem2, workItem3);
```

#### Method 4: Precise Insertion Using findWorkItemIndex

```javascript
// Insert at specific position (advanced pattern)
const currentWorkItem = workLists.getCurrentWorkItem();
const insertPosition = workLists.currentWorkList.findWorkItemIndex(currentWorkItem.id) + 1;
workLists.currentWorkList.workItems.splice(insertPosition, 0, newWorkItem);
```

### Advanced Patterns

#### 1. Conditional Worklist Items

```javascript
// Add items based on form responses
const responses = individual.observations;
const hasDisease = responses.some(obs => 
    obs.concept.name === 'Disease Status' && obs.getValue() === 'Positive'
);

if (hasDisease) {
    // Add follow-up encounter
}
```

#### 2. Dynamic Parameters

```javascript
// Pass data between forms
const workItem = new WorkItem(uuid, type, {
    encounterType: 'Follow-up',
    subjectUUID: individual.uuid,
    previousVisitData: {
        weight: getObservationValue(individual, 'Weight'),
        height: getObservationValue(individual, 'Height')
    }
});
```

#### 3. Worklist Modification

```javascript
// Remove items conditionally
workLists.currentWorkList.workItems = workLists.currentWorkList.workItems
    .filter(item => shouldKeepItem(item));

// Reorder items
workLists.currentWorkList.workItems.sort((a, b) => 
    getPriority(a) - getPriority(b)
);
```

***

## Limitations and Gotchas

### What's NOT Possible

#### ❌ Multiple Simultaneous Buttons

```javascript
// This is NOT supported:
// - Show 2 buttons: "Save and Go to Survey A" and "Save and Go to Survey B"
// - User cannot choose between different next forms
```

**Why**: Worklists are linear sequences. For branching logic, use form element rules or decision rules instead.

**Alternative**: Use form element rules to show/hide different form sections, or decision rules to determine the next form programmatically.

#### ❌ Hiding Save Button

```javascript
// This is NOT supported:
// - Hide the "Save" button and only show "Save and Proceed"
// - Force users to continue the workflow
```

**Why**: Users must always have the option to save and exit the workflow.

**Alternative**: Use validation rules to encourage completion, or show clear messaging about the workflow benefits.

#### ❌ Complex Branching Workflows

```javascript
// This is NOT supported:
// - If condition A, go to Form X, else if condition B, go to Form Y, else go to Form Z
// - Multiple parallel workflows
```

**Why**: Worklists are designed for sequential, not branching workflows.

**Alternative**: Use multiple worklist rules with different conditions, or implement branching logic in form element rules.

#### ❌ Cross-Subject Worklists

```javascript
// This is NOT supported:
// - Register Individual A, then register Individual B
// - Workflows that span multiple subjects
```

**Why**: Worklists are tied to a single subject context.

**Alternative**: Can be used with household/group subject types and their Member Subject Types, or separate worklists for each subject.

#### ❌ Async/External API Calls

```javascript
// This is NOT supported in worklist rules:
// - await fetch('/api/external-data')
// - Database queries to external systems
// - Long-running operations
```

**Why**: Worklist rules must execute synchronously and quickly.

**Alternative**: Use validation rules for async operations, or pre-fetch data during sync.

### Technical Limitations

#### 1. Rule Execution Context

* Worklist rules execute **after** form completion
* Cannot modify the current form being filled
* Cannot prevent form submission
* Limited to modifying the upcoming workflow

#### 2. Performance Considerations

* Rules should execute quickly (\< 100ms)
* Avoid complex calculations or large data processing
* Be mindful of memory usage on mobile devices

#### 3. Error Handling

```javascript
// Always wrap risky operations
try {
    // Your worklist logic
} catch (error) {
    console.log('Worklist rule error:', error);
    // Return original workLists to prevent crashes
    return params.workLists;
}
```

#### 4. Data Availability

* Only data from the just-completed form is guaranteed to be available
* Related entity data might not be fully synced
* Use defensive programming with null checks

### Common Gotchas

#### 1. WorkItem Insertion Position

```javascript
// WRONG: This adds to the end, after the "continue registration" item
workLists.currentWorkList.workItems.push(newItem);

// BETTER: Insert before the last item
const totalItems = workLists.currentWorkList.workItems.length;
workLists.currentWorkList.workItems.splice(totalItems - 1, 0, newItem);

// BEST: Use the proper API (recommended)
workLists.addItemsToCurrentWorkList(newItem);
```

#### 2. UUID Generation

```javascript
// WRONG: Using Date or Math.random
const uuid = new Date().toString();

// RIGHT: Using Avni's UUID generator
const uuid = imports.common.randomUUID();
```

#### 3. Context Entity Access

```javascript
// WRONG: Assuming entity structure
const name = context.entity.name;

// RIGHT: Defensive access
const name = _.get(context, 'entity.individual.name', 'Unknown');
```

#### 4. WorkItem Parameters

```javascript
// WRONG: Missing required parameters
new WorkItem(uuid, WorkItem.type.ENCOUNTER, {
    encounterType: 'Survey'
    // Missing subjectUUID!
});

// RIGHT: All required parameters
new WorkItem(uuid, WorkItem.type.ENCOUNTER, {
    encounterType: 'Survey',
    subjectUUID: individual.uuid
});
```

#### 5. Rule Return Value

```javascript
// WRONG: Forgetting to return
({params, imports}) => {
    const workLists = params.workLists;
    // ... modify workLists
    // Missing return statement!
}

// RIGHT: Always return workLists
({params, imports}) => {
    const workLists = params.workLists;
    // ... modify workLists
    return workLists;
}
```

***

## Troubleshooting

### Common Issues

#### 1. Worklist Rule Not Executing

**Symptoms**: Rule seems to be ignored, no new items added to worklist

**Possible Causes**:

* JavaScript syntax errors in the rule
* Rule not saved properly in Organisation Configuration
* Missing return statement
* Exception thrown during execution

**Debug Steps**:

```javascript
({params, imports}) => {
    console.log('Worklist rule executing');
    console.log('Context:', params.context);
    console.log('Current workLists:', params.workLists);
    
    try {
        // Your rule logic here
        const result = params.workLists;
        console.log('Returning workLists:', result);
        return result;
    } catch (error) {
        console.log('Rule error:', error);
        return params.workLists;
    }
}
```

#### 2. Wrong Form Opens Next

**Symptoms**: Unexpected form opens after completing current form

**Possible Causes**:

* Incorrect WorkItem type
* Wrong parameters in WorkItem
* Form mapping issues
* Multiple rules conflicting

**Debug Steps**:

* Check WorkItem type matches intended form type
* Verify encounterType/programName parameters
* Check form mappings in admin interface
* Review all active worklist rules

#### 3. "Save and Proceed" Button Missing

**Symptoms**: Only "Save" button visible, no workflow continuation

**Possible Causes**:

* No next WorkItem in the worklist
* WorkItem has invalid parameters
* Form mapping not configured
* User lacks permissions for next form

**Debug Steps**:

* Check if worklist has remaining items
* Verify WorkItem parameters are correct
* Check user permissions for next form type
* Review form mappings

#### 4. App Crashes During Workflow

**Symptoms**: App crashes when proceeding to next form

**Possible Causes**:

* Invalid WorkItem parameters
* Missing required entities (subject, program, etc.)
* Memory issues with large worklists
* Null reference errors

**Debug Steps**:

* Add try-catch blocks in worklist rules
* Validate all WorkItem parameters
* Check entity existence before creating WorkItems
* Test with smaller worklists

#### 5. WorkItem Validation Errors

**Symptoms**: "Work item must be one of WorkItem.type" or field validation errors

**Possible Causes**:

* Invalid WorkItem type
* Missing required parameters for the WorkItem type
* Incorrect parameter names
* Using hardcoded UUIDs incorrectly

**Debug Steps**:

```javascript
// Validate WorkItem before adding
try {
    const workItem = new WorkItem(
        imports.common.randomUUID(), 
        WorkItem.type.ENCOUNTER, 
        {
            encounterType: 'Health Survey',
            subjectUUID: individual.uuid
        }
    );
    
    // This will throw if invalid
    workItem.validate();
    
    workLists.addItemsToCurrentWorkList(workItem);
} catch (error) {
    console.log('WorkItem validation failed:', error.message);
    console.log('WorkItem details:', {
        type: WorkItem.type.ENCOUNTER,
        parameters: workItem.parameters
    });
    
    // Don't add invalid WorkItem
    return params.workLists;
}
```

**Common Validation Issues**:

* Missing `subjectUUID` for ENCOUNTER, PROGRAM_ENCOUNTER types
* Missing `encounterType` for encounter-based WorkItems
* Missing `programName` for PROGRAM_ENROLMENT, PROGRAM_EXIT
* Missing `groupSubjectUUID` for REMOVE_MEMBER
* Providing `subjectUUID` for REGISTRATION, ADD_MEMBER, HOUSEHOLD (not required)

## Best Practices Summary

### ✅ Do's

* Always return the workLists object
* Use `workLists.addItemsToCurrentWorkList()` for adding WorkItems (recommended API)
* Use `workLists.getCurrentWorkItem()` to get current WorkItem
* Use `imports.common.randomUUID()` for generating WorkItem IDs
* Validate WorkItems using `workItem.validate()` before adding
* Use defensive programming with null checks (`_.get()`)
* Add comprehensive error handling with try-catch blocks
* Test rules thoroughly before deployment
* Use descriptive WorkItem parameters with comments
* Keep rules simple and focused
* Add logging for debugging
* Consider offline scenarios and mobile constraints
* Follow Avni's error handling patterns (rethrow in views)

### ❌ Don'ts

* Don't use hardcoded UUIDs (use `imports.common.randomUUID()`)
* Don't create complex branching logic in worklist rules
* Don't make external API calls in rules
* Don't assume entity data structure without null checks
* Don't forget error handling
* Don't create circular worklist dependencies
* Don't ignore performance implications on mobile devices
* Don't modify entities in worklist rules
* Don't create infinite worklist loops
* Don't provide `subjectUUID` for REGISTRATION, ADD_MEMBER, HOUSEHOLD WorkItems
* Don't forget required parameters (use validation rules as reference)

### 🎯 Key Takeaways

1. **Worklists are for sequential workflows**, not complex branching
2. **Rules execute after form completion**, not during
3. **Always handle errors gracefully** to prevent app crashes
4. **Test extensively** with different scenarios and data
5. **Keep rules simple** for maintainability and performance
### Coded Concepts With Media Content Support In Metadata

## Overview

Avni supports adding **media content** (videos and images) to coded concepts through metadata. This feature allows concepts to reference media files that are synced to field devices and can be displayed within forms.

## Feature Description

Media content support to concept metadata enables:

* Adding video and image references via "App Designer" 
* Automatic syncing of media files to field devices
* Inline display of media content within forms
* Offline access of the synced media files

## Use Cases

### Counselling and Guidance

* Display instructional videos showing correct procedures or techniques
* Show visual examples to help beneficiaries understand health concepts
* Provide image references for medication identification or usage instructions

### Training and Reference

* Include training videos for field workers to reference during data collection
* Display procedural demonstrations to standardize how tasks are performed
* Provide visual guides for complex decision-making processes

### Quality Assurance

* Ensure consistent information delivery across all field workers
* Reduce errors by providing visual reference materials at point of data entry

## Configuration

### Adding Media to Concepts

1. Navigate to **Concepts** tab, in Avni admin interface, "App Designer" section
2. Create a new concept or edit an existing one
3. In the concept editor, locate the media upload sections:
   * **Image (max 150 KB)**: Upload JPG or PNG image files
   * **Video (max 10 MB)**: Upload MP4 video files
4. Upload the desired media file(s)
5. Save the concept

Media files are automatically synced to field devices during the regular sync process and become available offline.

> <Image align="center" alt="Concept editor showing media upload fields for image and video" border={false} src="https://files.readme.io/f73a540a8823356f68a3f751f8a7a56dbbb70d832816e815a3185a0746c9f293-ConceptsWithMediaEdit.png" />

### Using Media-Enabled Concepts in Forms

Media added to a concept can be used in forms as follows:

* **Answer options**: Display images or videos alongside answer choices to guide user selection
* **Question explanations**: Show supplementary media to clarify what information is being collected

> <Image align="center" alt="App Designer showing media-enabled concepts integrated into form questions and answer options" border={false} src="https://files.readme.io/dd576e833fcaa2057680c629419ec653f8e629cd9a28a5dea6f08579062d5000-ConceptsWithMediaView.png" />

### Supported Media Types

* **Videos**: MP4 format - max 10 MB
* **Images**: JPG, PNG formats - max 150 KB

### Technical Considerations

* Media playback depends on device capabilities
* Test on target devices before deployment
* Storage constraints may limit media file quantities on field devices
* Network connectivity required for initial sync
* Media files are cached locally after sync for offline access

## Mobile application capability

### Sync and Storage

* Media files are downloaded during standard Avni sync process
* Files are cached locally for offline access
* Storage management follows Avni's existing file handling patterns

### Field Worker Experience

When a form contains media-enabled concepts, field workers see:

1. **Media Icons**: Small media icons (video or image) appear next to the question or answer options
2. **Accessing Media**: Tap the media icon to view the content
3. **Video Playback**: Videos open in the device's default video player or play inline
4. **Image Display**: Images open in the device's image viewer or display inline
5. **Offline Access**: All synced media is available even without internet connection
6. **Guided Answers**: Visual media helps field workers understand and select the correct answer options

> <Image align="center" alt="Mobile app view showing media icons next to answer options (video and image icons visible)" border={false} src="https://files.readme.io/9c17f25cadff6372d7fd31839c47342888a8087696c1c221a93938de532a8c78-FormEdit.png" />

<br />
### Index

This section delves deeper into the purpose and ways to use features of Avni
## How Do I

### Choosing Android Device For Avni

We are listing down some criteria which could help you in deciding which device to choose. The price range kept in this analysis is between 7000 to 10000 Indian Rupees.

**OS Version**: While Avni will work on version >= 7.0, but if you are purchasing a new device then it is better to go for a more recent version. Realistically though setting the bar too high will reduce your options. Hence we recommend version >= 11.

**RAM**: Primary memory >= 4 GB is minimum requirement for quick response during app launch or screen transitions. Recommend devices with memory >= 6GB.

**CPU Speed**: Minimum requirement is a 64-bit ARM processor, with atleast 4 cores clocked at 2.0 GHz. Recommend Octa-core devices clocked at >= 2.0 GHz.

**Storage**: >= 64 GB is required for ensuring Phone OS version and all installed app versions are up to date, while retaining enough space to store media content for extended period of time.

**SD Card**: Avni in future may allow for keeping an additional backup of the data on the SD card. This is to protect against corruption of main data on internal storage which is not completely synced up with the server. Required only if your device has less than 64GB of Storage on itself.

**Screen Size**: For users who will use the application quite often, we recommend 6 inches as ideal, also considering the ability to carry it. You can, of course, go for higher or lower based on your preference.

**Camera**: A minimum of a 8MP camera will be required for good resolution images of the field work. Higher is also fine, but keep in mind that, the higher resolution requires more network bandwidth to upload. The storage of device will also need to support.

**Network Support**: Avni just needs a network connection. It could even work on 2G connectivity, but again, given that you are buying a new device go for devices which can work with 4G networks. Devices with 5G support are also fine, if they are tuned to work with 4G networks in low network availability scenarios.

**Battery Life**: Once you have multiple devices that you can compare, look for their mAh rating. Higher is better.
### How To Guide Installing Avni Field App And Basic Set Up On Your Mobile Phone

### **Step 1: Install the Avni app from Google Play Store**

1. Go to the Google Play Store on your mobile device
2. Type **Avni** on the search bar
3. Click on **Install** to download the app

<br />

<Image align="left" border={true} width="250px" src="https://files.readme.io/b2ec7c3-Playstore.JPEG" className="border" />

<Image align="left" border={true} width="250px" src="https://files.readme.io/e07f14d-Avni.JPEG" className="border" />

<Image align="center" border={true} width="250px" src="https://files.readme.io/daf3937-Install.JPEG" className="border" />

<br />

### **Step 2: LOGIN**

1. LOGIN to the app by entering your User ID and Password
2. Click on the LOGIN button

Note: The User ID and Password is sent to the registered mobile number via SMS once the user is created in Avni Web Console

<br />

<Image align="center" border={true} width="300px" src="https://files.readme.io/99d67fd-LOGIN.JPEG" className="border" />

<br />

### **Step 3: Basic Set - Up**

#### **Sync data**

It is important to sync the app whenever an internet connection is available for the new data to get stored and reflect in the app Dashboard. This can be done by clicking on the Sync button at the top right

<br />

<Image align="center" border={true} width="300px" src="https://files.readme.io/4f2e86b-Sync2.JPEG" className="border" />

<br />

#### **Select Language**

By clicking on the Edit Settings button at the top, you can select the language in which you want to see the app content. The default language selected is English

<br />

<Image align="left" border={false} width="250px" src="https://files.readme.io/75ffcfa-Edit_Lang.JPEG" />

<Image align="center" border={false} width="250px" src="https://files.readme.io/f9de6e9-1712641958848.JPEG" />

<br />

#### **Change Password**

If you wish to change your password, you can do so, by clicking on the Change Password button and entering the new password details.

<br />

<Image align="left" border={true} width="250px" src="https://files.readme.io/5b1f088-Change_Pass.JPEG" className="border" />

<Image align="center" border={true} width="250px" src="https://files.readme.io/69adaa1-Password.JPEG" className="border" />

<br />
### Updating Rules In Bulk

```sql
set role <organisation_db_user>;

-- Subject Type
update subject_type set
    program_eligibility_check_rule = replace(program_eligibility_check_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
    last_modified_date_time = current_timestamp
    where program_eligibility_check_rule like '%ruleServiceLibraryInterfaceForSharingModules%';
update subject_type set subject_summary_rule = replace(subject_summary_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                        last_modified_date_time = current_timestamp
    where subject_summary_rule like '%ruleServiceLibraryInterfaceForSharingModules%';

-- Encounter Type
update encounter_type set encounter_eligibility_check_rule = replace(encounter_eligibility_check_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                          last_modified_date_time = current_timestamp
    where encounter_eligibility_check_rule like '%ruleServiceLibraryInterfaceForSharingModules%';

-- Program
update program set enrolment_summary_rule = replace(enrolment_summary_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                          last_modified_date_time = current_timestamp
    where enrolment_summary_rule like '%ruleServiceLibraryInterfaceForSharingModules%';
update program set enrolment_eligibility_check_rule = replace(enrolment_eligibility_check_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                          last_modified_date_time = current_timestamp
    where enrolment_eligibility_check_rule like '%ruleServiceLibraryInterfaceForSharingModules%';
update program set manual_enrolment_eligibility_check_rule = replace(manual_enrolment_eligibility_check_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                          last_modified_date_time = current_timestamp
    where manual_enrolment_eligibility_check_rule like '%ruleServiceLibraryInterfaceForSharingModules%';

-- Form
update form set decision_rule = replace(decision_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                   last_modified_date_time = current_timestamp
where decision_rule like '%ruleServiceLibraryInterfaceForSharingModules%';
update form set validation_rule = replace(validation_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                   last_modified_date_time = current_timestamp
where validation_rule like '%ruleServiceLibraryInterfaceForSharingModules%';
update form set visit_schedule_rule = replace(visit_schedule_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                   last_modified_date_time = current_timestamp
where visit_schedule_rule like '%ruleServiceLibraryInterfaceForSharingModules%';
update form set checklists_rule = replace(checklists_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                   last_modified_date_time = current_timestamp
where checklists_rule like '%ruleServiceLibraryInterfaceForSharingModules%';
update form set task_schedule_rule = replace(task_schedule_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                   last_modified_date_time = current_timestamp
where task_schedule_rule like '%ruleServiceLibraryInterfaceForSharingModules%';

-- Form element

update form_element set "rule" = replace("rule", 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
					last_modified_date_time = current_timestamp 
where rule like '%ruleServiceLibraryInterfaceForSharingModules%';

-- Form element group

update form_element_group set "rule" = replace("rule", 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
					last_modified_date_time = current_timestamp 
where rule like '%ruleServiceLibraryInterfaceForSharingModules%';

-- Report Card
update report_card set query = replace(query, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                last_modified_date_time = current_timestamp
where query like '%ruleServiceLibraryInterfaceForSharingModules%'

-- Organisation Config
update organisation_config set worklist_updation_rule = replace(worklist_updation_rule, 'ruleServiceLibraryInterfaceForSharingModules', 'imports'),
                last_modified_date_time = current_timestamp
where worklist_updation_rule like '%ruleServiceLibraryInterfaceForSharingModules%';
```

One example is illustrated here, one can change the text and replace with something else.
### Accessing Media In Reports

Data in Avni is stored in two different data sources. The first is the postgres database, which are easily connected to the reporting servers that are being used by hosting. The second is an S3 database where media is stored. 

In reporting tools, there is a mechanism to show data by connecting to a data source. However, S3 access is usually not provided. In case you need to expose media through reports, here is what you need to do. 

1. Provide users access to Avni. 
2. In reports, observations are usually of the form "[https://prod-user-media.s3.ap-south-1.amazonaws.com/org\_name/file\_name.png"](https://prod-user-media.s3.ap-south-1.amazonaws.com/org_name/file_name.png"). This will be stored in observations of the form. To provide a link that shows this, change it to the form " [https://app.avniproject.org/web/media?url=https://prod-user-media.s3.ap-south-1.amazonaws.com/org\_name/file\_name.png"](https://app.avniproject.org/web/media?url=https://prod-user-media.s3.ap-south-1.amazonaws.com/org_name/file_name.png"). 

Doing this will send the user to app.avniproject.org, which will redirect the user to the corresponding media once they have authenticated themselves on avniproject.
### Upload Local Database

Many times, the local database of the Android app provides clues to an issue happening on that device. Avni provides a mechanism to send a backup of the local database to Avni so that a developer can recreate this issue and perform fixes if required. 

To upload your local database, go to the "More" section on the home page and press on the "Upload Database" menu item. 

<Image align="center" width="500px" src="https://files.readme.io/be788e5-Upload_Database.png" />
### Migrate Location Of Subject

# Please refer to API Doc

[https://editor.swagger.io/?url=https://raw.githubusercontent.com/avniproject/avni-server/master/avni-server-api/src/main/resources/api/external-api.yaml](https://editor.swagger.io/?url=https://raw.githubusercontent.com/avniproject/avni-server/master/avni-server-api/src/main/resources/api/external-api.yaml)

# Documentation Deprecated

Since there are multiple entities that need to be changed, the migration should not be done by making changes directly to the database using SQL commands. In order to migrate a subject use the follow API.

### Endpoint

`{{origin}}/subjectMigration/bulk`

e.g. [https://app.avniproject.org/subjectMigration/bulk](https://app.avniproject.org/subjectMigration/bulk)

### Headers

`auth-token`

### Body

* destinationAddresses is a map of source address level id and destination address level id.
* subject type ids is an array of subject types that you want migrated

```Text JSON
{
    "destinationAddresses": {
        "330785": "330856",
        "334657": "335043",
        "331106": "331466"
    },
    "subjectTypeIds": [
        672,
        671
    ]
}
```

### Also know

* if you have a lot of addresses then the request may timeout, but the server will continue to process
* Each source to destination mapping for each subject type, will be done in its own transaction. So for above example there will be 6 transactions (3 address mapping multiplied by 2 subject types).
### Validate A New Implementation For User Acceptance Test Purposes

<br/>

**UAT Test Scenarios** 

**Step 1: Download the Avni App** from Playstore to proceed with the test cases given below.

![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.001.png)

**Step 2: Login :**

* **Valid User Login:** Verify that a user can successfully log in with a valid username and password. (Ex. Username: xyza\@ProjectName, Password: xyza7988)

* **Invalid User Login:** Confirm that the system handles login attempts with invalid usernames and passwords.

* Test Ex. 1:** With an invalid username and valid password (Authentication error)

  Username: xy\@ProjectName, Password: xyza7988

* Test Ex. 2: With an invalid username with space applied anywhere in the user (Error should be displayed as incorrect username)

  User name: xyza\@cini\_uat, Password: xyza7988

* Test eg 3: When the user name is incorrect, it does not exist in the system. It will give an authentication error

* ` `Username: dinesh or dineshProjectName, Password: dine7988

* Test eg 4:** With a valid username and invalid password (Authentication error)

  Username: xyza\@cini\_uat, Password: xyza798

* Test eg 5:** With a valid username and invalid password special characters (Authentication error)

  Username: xyza\@cini\_uat, Password: xyza\@7988

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.002.png)

* **Password Visibility**: Ensure the password field can be shown or hidden upon using the ‘show password’ toggle.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.003.png)

* **Forgot Password:** Forgot password option on the login page allows the user to generate a new password.

* By clicking on the forgot password, user can see the page where the registered user ID needs to be submitted. On providing the correct user ID, a pop-up will be displayed ‘We have sent an OTP on your registered Mobile Number’.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.004.png)![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.005.png)

* With that, the next page will be displayed with 3 fields to enter the one-time password received on the mobile number, the old password, and the new password.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.006.png)

* By successfully submitting all the details, the user can change the password and log in with the user ID and new password.

**3. Home Page:**

* **Home Dashboard:** The home page would have a dashboard to populate the aggregate (count) of different types of data, Ex. number of registrations, number of visits due, number of visits overdue, number of enrolments in the program, etc. By clicking on any of these cards, a list of individuals or other subjects will be displayed where the user can view profiles and details submitted in the registration form of any individual.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.007.png)

* Home Dashboard can have filters to update the data as per date or any other parameter to display card’s data accordingly.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.008.png)

**Last 24 Hours Statistics:**

* **Last 24 hours registration:** The user should be able to see the count of Registered individuals and click on it to list the details               
* **Last 24 hours visits:** The user should be able to see the count of Visits and click on it to list the details   

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.009.png)

**4. Sync:**

* Sync button available on top right corner of the home page, allows user to sync the registration, enrollments, visits and changes done to the existing data.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.010.png)

* By clicking on the sync button, system syncs the changes done in particular in device’s app with server. Data synced in app can be seen in the reports.

* Number shown on the sync button suggests the changes are which ready to be synced.

* A successful sync would display a pop-up as shown below and If sync isn't done popularly or it displays some error like a Fatal error or Association error we have to contact the administrator ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.011.png)

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.012.png)

* If sync fails with the reason Network request then users have to check the internet connection and try to resync.

**5. Registration:**

* The register section should allow the user to register the subjects as per the project, Ex. Individuals, Anganwadi, Camps, Patients, etc.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.013.png)

* The user should be able to save, register the registration form, and proceed to the next registration form.
* After Registering the individual/any other subject in the mobile app, sync the data and validate that the data is reflected in the web app
* Register the individual/any other subject in the mobile app. Do not sync and validate that the data is not reflected in the web app.
* Register the individual in the mobile app using without turning on the network. Turn on the network, don't sync the data, and validate that the data is automatically synced after 10 minutes.

**6. Search Page:**

* Click on the Search button
* Select the subject (i.e. individual, camp, student, etc.) under Choose type, select other filters and click on Submit.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.014.png)

* On the search page, option called included voided if the user toggles it and clicks on the search it should display all the voided and unvoided data
* The result should display the list of subjects as per the filter provided. Along with the list of subjects, ‘Total matching results will be displayed’ to populate the count of subjects as per the filter provided.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.015.png)

* Please note that user can use any combinations of filter simultaneously to populate the results as required.

**6. More Page:**

* **Edit Settings:** In the ‘More’ section, the user should be able to click on the user icon to open ‘edit settings’. The edit setting should have configuration fields of Language, Location, Dashboard, and Auto-sync as shown below.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.016.png)

* In the **Language,** select the language the app content should be displayed and the app content should be displayed in the selected language. The default language is English

* If the language is not updated as select in the ‘edit settings’, then it is a bug.

* **Track location,** if it is enabled it will ask the user for permission if the user accepts the permission then it will capture the longitude and latitude of the current location

* Track location if it is disabled or they refuse to give the permission then it should not capture the user's location

* **Dashboard Auto-Refresh,** disabling this toggle would restrict the user from seeing updated version automatically

* If the user disables the auto refresh then the dashboard should not update the data on the dashboard automatically.

* **Auto Sync,** if the user enables the auto sync then data should sync automatically for every 10 minutes

* If the user disables the auto sync then data should not be synced automatically.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.017.png)

* **Dashboard,** click on this it should display offline dashboards where aggregate cards of different visits due/overdue, registration, and enrolments are done.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.018.png)

* By opening the aggregate cards given on the dashboard, the user can see the list of individuals/subjects and their profiles which aggregates to a count in the dashboard. (Refer to point#7 Profile more details)![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.019.png)

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.020.png)

* **Entity Sync Status**

* **Setup Fast Sync**

* **Change Password,** click on it directly to the password change page

* Users can enter their current password

* The user should be able to enter the new password

* Password Visibility, ensure the password field can be shown or hidden upon user selection.

* Password Visibility (Toggle): Verify that toggling the password visibility option works as intended.

* Password mismatch if the user gives the current password as invalid then it should display the incorrect password or user ID

* Forgot password, If the user doesn't remember the current password while clicking on it. It will send you the OTP using that user enters the new OTP and also a new password

* Password mismatch if the user gives the mismatch value for Enter a new password and Confirm new password then it should display an error password mismatch

  Eg: Enter a new password: din123, Confirm new password: din321

* Password successfully: if the user gives the match value for Enter new password and Confirm new password then it should display password changed successfully.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.021.png)

* **Logout** should help the user close the current session and return to the login screen. Upon clicking the logout button, the user should be able to see a pop-up to confirm to end the current session and logout.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.022.png)

**7. Profile:**

* **Subject Profile:** The profile should typically contain details submitted in various forms and will populate details of enrollment and forms that are scheduled and filled previously.
* Subject profile would typically have name, gender, age, address on top.
* Profile page would contain the list of program subject enrolled to along with the option to enroll in a new program if eligible but not enrolled yet.
* Profile page would have the summary section to display important details which are filled in different forms.
* Profile would also contain visit planned which would display the visit scheduled along with completed visits section.

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.023.png)![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.024.png)

  ![](Aspose.Words.e7a1731f-5ee8-4023-8075-158ab95af182.025.png)

**Important note:**

**The changes done in the application should be synced to save these changes on the server. Sync can be done manually from the button on the home page's top right corner.**
### Get Bulk Data Out Of Avni

## Transaction data

*i.e. Subjects, Encounters, Enrolments etc.*

There are a few options available suited for different purpose.

### 1. Longitudinal Export

Use this if the purpose is to get all the data associated to a subject in a single row. Also see - [New Longitudinal export](doc:new-longitudinal-export). Note currently there is a limit of 10,000 rows in this export. One can use date ranges to get data in parts.

### 2. Download Metabase tables

Metabase automatically recognises all the tables in the data source that it is pointed to. Hence, on browsing to the implementation specific schema one can see all the ETL tables. Metabase allows the ability to download the data for each table. A few points to consider/know:

a. Although in the display Metabase has limit of 10,000 rows. There is no such limit on downloads.

b. These downloads are per-table with foreign keys to parent tables (e.g. encounter form tables will have foreign keys for program enrolment, subject ETL tables). The consumer of this data will have to join these themselves in their analytics solution.

c. Download operations currently are not metered. This may change in future, if we see performance impact on the reporting database. It is recommended that these downloads are done after hours, lets say after 6 pm - so that it doesn't impact other reporting operations.

### 3. Download custom query data (SuperSet and Metabase)

This can be used to provide custom downloads based on queries. This can get around any limitations of approach 2 above in terms of the shape of downloadable data. e.g. One can join Subject, Enrolment in encounter and provide a report that one can use to download subject, enrolment, identification data along with encounter data.

The point 2(c) applies to this as well.
### Complex Visit Schedule Testing

If we break down the visit schedule complexity into three levels simple to complex, we would notice that the testing mechanism for level 2 & 3 visit schedules are quite wasteful due to long feedback loops. The feedback loop is long mainly because the testing of visit schedule logic requires filling forms to setup data and to see the result. In development mode performing sync the second main reason the feedback loop is long.

It is important to remember that for most (may be not all) bugs the testing of all the scenarios need to be carried our all over again. After certain number iterations of such testing the testing fatigue is likely to kick-in, compromising quality as well.

This feedback loop can be shortened significantly by following age old unit testing written in the form of business specifications. This approach improve quality and reduce waste.

Business specification style will allow for customer, business analyst, developer and testers all to come on the same page about the requirements. Automation of unit tests allows for verification of production code against the specification - repeatedly.

## Business specification style tests

These are tests that are written such that they read close normal english using the language of problem domain, but they can be executed as well. It helps in understanding the basic structure of such tests which is capture in a three step process - **given, when, then**. It would be useful to quickly read about it, if you don't know about this already. One such article is [here](https://www.agilealliance.org/glossary/given-when-then/), but there are many.

### Example

This is one test for scheduling visits on edit of an ANC Visit - [https://github.com/avniproject/apf-odisha-2/blob/main/test/ANCTest.js#L117](https://github.com/avniproject/apf-odisha-2/blob/main/test/ANCTest.js#L117).

**Given** that the for beneficiary ANC-1 visit is completed and ANC-2 visit is scheduled for the next month

**When** ANC-1 is edited

**Then** PW Home or ANC visit should not be scheduled

## QA strategy

Visit schedules for which such unit tests have been written should be tested differently.

* Review the test scenarios already automated via these tests.  If any scenario is missing, request the developer to add those scenarios to the test suite.
* Pick a handful, not too many, of these to verify whether the mobile application is indeed working in the same way as well.
* **Most importantly - do not manually run all the scenarios.**

## For developers

* Jest - [https://jestjs.io/docs/api](https://jestjs.io/docs/api)
* It is important to learn about test lifecycle and setup, teardown, describe, test/it methods. [https://jestjs.io/docs/setup-teardown](https://jestjs.io/docs/setup-teardown)
* It is important the each test (test/it) runs independent of other tests, so that execution of one test doesn't have any impact on another test. To achieve this all variables should be instantiated in each test, i.e. in move all the code common instantiation code (not functions) to beforeEach. Do not instantiate anything outside beforeEach and it/test. Unit tests run super-fast so optimisation is not useful and is in fact counter-productive.
### Move Org To Custom Dashboard From Mydashboard

1. As super admin, call `POST /api/defaultDashboard/create?orgId=[organisationId]` (`organisationId` being the id of the organisation for which you want to create the default dashboard - typically your UAT org)
2. This API will only create the default dashboard for non Prod orgs.
3. Assign the newly created dashboard to the required user groups.
4. Test and verify functionality in UAT org
5. Upload bundle from UAT org to live org.
### Review Implementation Bundle

Avni offers the ability to export the configuration and metadata from an implementation into a bundle ([App Designer -> Bundle](https://app.avniproject.org/#/appdesigner/bundle)). This bundle can then be uploaded into another implementation if it is required to have the same metadata and configuration setup ([Admin -> Upload](https://app.avniproject.org/#/admin/upload) ).

Since this a feature with widespread consequences if the wrong bundle is used on the wrong implementation, the implementer can review the changes that will be affected as a result of uploading a bundle before applying it. The option to review the changes is displayed after selecting the upload type as 'Metadata Zip' on the upload screen and uploading the bundle.

<br />

On clicking 'Review', the uploaded bundle is compared against the implementation that the user is currently logged into and a file by file list of differences is displayed on screen. The file listing categorises the changes as additions (green), modifications (orange), removals (red) or if completely new items will be created if the bundle is applied.

![](https://files.readme.io/2582a6ae1664ad643eb9421b4cd7484d0d8baa00c480a9d13c36b60e6e8d8dbb-image.png)

<br />

On selecting a file, the details of the changes in that file are shown. The implementer can use the 'Back to Upload' option to return to the upload screen after reviewing the changes to change the bundle file used or apply the bundle.

![](https://files.readme.io/312f6da0ac043d3048fc4837f167416132de631a8d193084d809e81a63988fc8-metadata-diff.webp)
### Choose Colours For Offline Report Cards

<Image align="center" src="https://files.readme.io/71e201dc45bef425cb65222621d02e8a698eeef4c2a95033664bd1a5c5d70808-Screenshot_2025-07-28_at_4.58.22_PM.png" />
## Reporting And Business Analytics

### Simplification Of Reports

#### Avni Reporting Standards Best Practices

### **1. Dashboard Structure Standards**

#### **Three-Tier Dashboard Layout:**

```
Row 1: Summary & Description
├── Dashboard title and purpose description
├── Explanation of Filters available
└── Key metrics overview

Row 2: Total Count Cards  
├── Aggregate metrics from base query
└── Apply Conditional filters only where appropriate

Row 3+: Filtered Linelists
├── Detailed records for each count card
└── Conditional filters applied
```

#### **Implementation Guidelines:**

* **Base Query Foundation**: All dashboard elements derive from a single, well-defined base query
* **Hierarchical Information Flow**: Summary → Aggregates → Details
* **Consistent Filtering**: Apply same filter logic across all dashboard components
* **User Journey**: Enable logical progression from high-level insights to detailed records

### **2. Dashboard Purity Principle**

#### **Primary Table Focus:**

* **Single Source of Truth**: Each dashboard should have one primary table as its foundation
* **Controlled Joins**: Join additional tables only for supplementary information, not core metrics
* **Avoid Data Mixing**: Don't combine unrelated data sources in a single dashboard

#### **When to Split Dashboards:**

```
❌ Bad: Combined Dashboard
- Subject registrations + Program enrollments + Encounter data
- Multiple unrelated KPIs in one view
- Mixed time periods and contexts

✅ Good: Separate Dashboards  
- Subject Registration Dashboard (primary: beneficiary table)
- Program Performance Dashboard (primary: beneficiary_pregnancy table)
- Service Delivery Dashboard (primary: beneficiary_pregnancy_anc tables)
```

#### **Benefits of Pure Dashboards:**

* **Performance**: Faster query execution
* **Maintainability**: Easier to debug and modify
* **User Experience**: Clear, focused insights
* **Data Integrity**: Reduced risk of incorrect joins

### **3. Complex Query Management via PostETLSync**

#### **PostETLSync Overview**

PostETLSync enables custom data transformations after standard ETL completion through configurable SQL transformations. This feature supports incremental processing, ordered execution, and organization-specific configurations while ensuring data integrity through transaction management.

#### **When to Use PostETLSync:**

* **Views Persisted Across ETL Schema Recreates**: Maintain custom views and derived tables that survive ETL schema rebuilds
* **Derived Tables**: Create complex aggregated views from multiple source tables
* **Custom Business Logic**: Implement organization-specific calculations and transformations
* **Performance Optimization**: Pre-compute complex queries for faster dashboard loading
* **Incremental Updates**: Process only changed data since last sync using timestamp filtering

#### **Configuration Structure:**

PostETLSync uses JSON configuration files (`post-etl-sync-processing-config.json`) with two main sections:

* **DDL Operations**: Create tables, indexes, and database objects (executed first)
* **DML Operations**: Insert and update data with ordered execution and parameter substitution

#### **Key Features:**

* **Automatic Parameter Substitution**: `:previousCutoffDateTime` and `:newCutoffDateTime` for incremental processing
* **Schema-Qualified Operations**: All table references must include schema names for proper permissions
* **Timestamp Filtering**: Built-in support for processing only modified records
* **Transaction Safety**: Ensures data consistency during transformation processes

#### **Best Practices:**

* Always use both timestamp parameters in data modification queries
* Include `is_voided = false` checks when applicable
* Use descriptive prefixes for SQL script naming
* Apply timestamp filters to all subqueries and CTEs
* Begin DDL scripts with appropriate role setting for permissions

This approach transforms complex reporting requirements into maintainable, performant solutions that integrate seamlessly with Avni's ETL pipeline while providing the flexibility needed for organization-specific reporting needs.

### **4. Implementation Best Practices**

#### **Base Query Design:**

```sql
-- Standard base query structure
SELECT 
    -- Primary identifiers
    subject.uuid,
    subject.first_name,
    subject.last_name,
    
    -- Core metrics
    program.name as program_name,
    enrolment.enrolment_date_time,
    
    -- Derived fields for filtering
    CASE WHEN enrolment.program_exit_date_time IS NULL 
         THEN 'Active' ELSE 'Exited' END as enrollment_status,
    
    -- Location hierarchy for geographic filtering
    village.title as village,
    block.title as block,
    district.title as district

FROM beneficiary subject
JOIN beneficiary_pregnancy enrolment ON subject.id = enrolment.individual_id
JOIN program ON enrolment.program_id = program.id
-- Add location joins as needed
WHERE subject.is_voided = false 
  AND enrolment.is_voided = false
```

#### **Dashboard Card Organization:**

1. **Summary Card**: Dashboard description and key insights
2. **Count Cards**: Total enrollments, active cases, completed visits
3. **Linelist Cards**: Detailed records filtered by each count metric

#### **Filter Strategy:**

* **Consistent Parameters**: Same date ranges, locations, programs across all cards
* **Cascading Filters**: Location hierarchy (State → District → Block → Village)
* **User-Friendly Defaults**: Reasonable default values for common use cases

### **5. Quality Assurance Guidelines**

#### **Dashboard Review Checklist:**

* [ ] Single primary table identified
* [ ] All cards use same base query logic
* [ ] Filters work consistently across all cards
* [ ] Performance acceptable (\< 30 seconds load time)
* [ ] Data accuracy verified against source systems
* [ ] User permissions properly configured

#### **Documentation Requirements:**

* Dashboard purpose and target audience
* Base query explanation and assumptions
* Filter definitions and expected behaviors

### **6. Reference Implementation**

Following the <Anchor label="Avni reporting simplification guidelines" target="_blank" href="https://avni.readme.io/docs/draft-simplification-of-reports">Avni reporting simplification guidelines</Anchor>, these principles ensure:

* **Scalable Architecture**: Reports that perform well as data grows
* **Maintainable Codebase**: Clear separation of concerns
* **User-Centric Design**: Intuitive navigation from summary to detail
* **Data Governance**: Consistent metrics across the organization

This structured approach transforms complex organisational data into actionable insights while maintaining system performance and user experience quality.
#### Index

Since we develop a number of reports for each organisation. As the number of organisations grow maintenance and first time & ongoing testing of these reports can get difficult. This document covers some the ideas that can be employed to simply these two activities.

For this document, will use this example to discuss the points below. Lets take a report which shows:

* The number of children who are under nourished
* These numbers are shown by gender (Individual), age-group (Individual), and land-holding (Observation). Land holding could be `a) less than acre` `b) 1-2 acres` `c) 2-5 acres` `d) 5+ acres` In Avni this will be a coded concept with above four answers.
* The report allows the user to choose from address/location filter and view the numbers
* On clicking any number the user is take to the line list of children

## Report work management

* Reports work ideally should start when there is some good data available to write reports against and verify. This will help avoid manual setup of data - which is time consuming.
* During the period in which new implementation application is in use and there are no reports
  * The data available from data entry app or using master catchment and viewing all data from mobile
  * we will have canned reports in the platform which can support customers during this phase
  * as a last resort - temporarily we can support it via hand written operational reports **if absolutely necessary**
* When there are change requests to the application then there may be impact on reports. During analysis the reports that will be impacted should be identified and only those need to be regressed/tested.

## Report design

* Avoid aggregating on multiple **display dimensions** in a single report. This makes the report queries very large and difficult to understand/maintain. What is a dimension - gender, age-group, land-holding - these are each different dimensions and one may want the counts/averages etc of data across these dimensions.
  * All filters used in reports are typically also dimensions (Location from the example above)
  * **Display dimensions** are the type of dimensions for which the data is displayed to the user
* Put all the necessary fields in the line list on which the aggregates are calculated, so that some of the verification of aggregate numbers. If the under nutrition is decided based on weight, height, age, gender, upper-arm circumference then all these data points should also be available in the line list.
* For each implementation we should prepare a set of dimensions that will be used in reports and give it a name. In stories for line list only the name of set can be given. This will also help in code review to ensure all the dimensions have been included in the line list. For example:
  * Dimension Set 1 - Name = Child - for Child program related line list one has - Name, Age, Gender, Mother's name
  * Dimension Set 2 - Name = Woman - for Woman program related line list one has - Name, Age, Blood Group
  * Dimension Set 3 - Name = Pregnant Woman - Name, Age, Blood Group, LMP, EDD
* It may be useful to identify modules in the application. For example - mother and pregnancy program can one module and child program can be module two in some implementations. These modules may be loosely coupled with each other and hence changing one is **likely to not have any impact** on other modules. Identifying these modules can help with testing of change requests, support defects etc. Instead of testing everything one may restrict the testing to specific modules where change has been made.
  * The modules in a new implementation may or may not be obvious. As we gain more insight during development or change request - we can take advantage of this.

## Developer Checklist

**[Why checklists (a very short read)](https://blog.falcony.io/en/the-checklist-manifesto-book-summary#:~:text=In%20the%20book%2C%20The%20Checklist,applied%20to%20almost%20every%20field.)**

This is to ensure that the same type mistakes do not occur due to over sight. It is important to follow these checklist - since the cost of mistake is high on effort from developer and QA both.

### Code

* Ensure voided, exited, and cancelled are appropriately used for each table that is joined in the report. Ensure this is done for parents also (e.g. checking voided on encounter may not be sufficient as one may also want to check whether the parent i.e. individual or program_enrolment voiding has been checked).
  * Include these fields (whichever is relevant for the report) in the line list in the end so that it is easy to test.
* Have you used inner join and left joins correctly
* If approvals are implemented then add the appropriate checks
* While adding the date filters make sure its on correct date (encounter date, earliest date, registration date, enrolment date).
* Is null or empty string important in any of the where/join clauses?

### BI Tools

* **SuperSet specific**
  * If we are implementing  the row level security then ensure that “$P!\{LoggedInUserAttribute_LocationFilter}” Is added in query for jasper only
* **Metabase specific**
  * Use summarize feature to create the aggregate report so it will give drill down.
* **Jasper specific**
  * Its better to use the Variable in the jasper report to pass the param for drill down report, avoid use of direct passing where clause. refer this report.
  * [https://docs.google.com/document/d/1RXcoZwG0BoJtkR7IGd9weWJWytRAfmdPqJUgSuDwOrw/edit](https://docs.google.com/document/d/1RXcoZwG0BoJtkR7IGd9weWJWytRAfmdPqJUgSuDwOrw/edit)

### Documentation

* Story, doc links in the SQL

### Subjective review

* Code review should look for False-Negatives (see diagram below).

## Reports Testing

* Feedback into the code review process, if the checklist items are getting missed on development complete. Testing team can verify the checklist items **once in a while** to ensure that the checklist and code review process is working well.
* There are certain practices that should be avoided **as much as possible**.
  * Testing reports by changing data as this is slow and time consuming.
  * If above is avoided then it also eliminates the need to keep pointing the reports do database in different environment.
* There are three broad type of tests that we need to carry out with reports - as in the following diagram.

_source:[https://docs.google.com/presentation/d/1skfVtHmyAg2QEyTowcN2eZwIIoDo03s1K7WAWBE4BDc/edit#slide=id.p](https://docs.google.com/presentation/d/1skfVtHmyAg2QEyTowcN2eZwIIoDo03s1K7WAWBE4BDc/edit#slide=id.p)_

<Image border={false} src="https://files.readme.io/5c5156c-image.png" />

> **DEA** = Data Entry App

#### Note 1

The idea of verification using line list is that the logic behind the aggregate numbers can be verified by just looking at the line list. It is preferred because it is the fastest. Both False-Positive and True-Positive can be verified by just looking at the line list (again no reason to fiddle with data).

In case line list is not present then one can use DEA and lastly Mobile App. DEA should be preferred over mobile app because of speed of verification (no sync, back buttons, hyperlinks, etc).

> If any particular bug in DEA is hampering the testing then it could be raised to platform team as blocker, to be fixed.

#### Note 2

False-Negatives can be difficult to verify hence:

* Some of this should get covered by code review (mentioned in checklist). In fact if the developer and code reviewer both check this - it should cover most of such cases.
* In testing one can try any hypothesis on False-Negatives by using different filter values by checking for existing such data.
* Lastly, customers and usage of reports is the best way to identify them - as they will use the data most and will have _much better feel/intuition_ of the numbers.

# To be explored (not recommended yet)

* Use of views to allow for re-usable code across reports

### Examples

[https://reporting.avniproject.org/question/2995-prevalence-of-anemia-linelist](https://reporting.avniproject.org/question/2995-prevalence-of-anemia-linelist)

* Instead of school, boarding, and boarding as different drop down it is better to have Location Type and Location as drop downs. They become `and` query with two items instead of 6 items.
* Use of full join instead of union, with `COALESCE`.
* For haemoglobin entries create `json_each` and `join`. Same for age-group.
### Form Analytics Using Metabase X Ray Feature

Metabase xRay allows for generating basic analytics on click of a button from the database table. Please follow the steps below for setting up table analytics that can be used. The steps below having been provided at a logical level.

> 📘 Note: The dashboard created using this approach cannot be easily migrated to another database hence the development should be done in production database, else it will involve rework.

### Features relevant to us

* Auto generated breakup by coded fields
* Can see line list for each breakup
* Related tables can be mapped to logical names
* Internal columns can be removed
* Related table’s data can be seen from the line list (e.g. by clicking on Individual name)
* In pie-chart form also see the percentage
* Can be used with custom models feature

### Standard ETL table or Custom Model

It is possible that your requirement involves using joins with other table like location for using in filters. To achieve this use Custom Model feature and use the metabase designer to join. Using native query is not recommended - as that requires configuring the columns to make it understanding to metabase features.

In your custom model you may want to take filter out records like voided = true, or exited, cancelled etc.

### Table configuration changes

Available from Admin ->> Table Metadata tab.

Remove visibility of fields that do not concern the user. Some you can remove from **everywhere** and some only in **detail view** (line list view). Discuss with functional people in your team about the exact system fields to change.

### Generate xRay

1. Find a table from data source
2. Click xRay
3. Choose more details
4. Save the dashboard automatically created. You can also move this to the right place using move option. By default they do in the `Automatically Generated Dashboards`. Note - You cannot add filter before generating dashboards.

### Dashboard changes

* Remove any unnecessary generated filters and cards first. With fewer cards the performance of the dashboard during the design process will be better.
* Any field directly on the table/form can be added as filter.
* Only one address filter can be added per table/dashboard (note that table metadata should be changed to map too).

### Table configuration changes to make certain fields more useful

Metabase allows to map a foreign key field such that one can see a logical text instead of seeing a number. For example - individual\_id can be mapped to Individual.first\_name; address\_id can be mapped to Address.Title.

### Known Limitations

* Cannot do percentage only totals (why? - [https://avni.readme.io/docs/form-analytics-using-metabase-x-ray-feature](https://avni.readme.io/docs/form-analytics-using-metabase-x-ray-feature)) in non-pie chart form.
* Once xRay dashboard is generated subsequent addition of fields will have to be manual, otherwise the previous changes will be lost.
### Guide To Export And Import Reports Across Different Jasper Servers

## Reference: [https://community.jaspersoft.com/documentation/jasperreports-server/tibco-jasperreports-server-security-guide/vv900/jasperreports-server-security-guide-\_-keymanagement-\_-import\_and\_export/#Key\_Command\_Line\_Export](https://community.jaspersoft.com/documentation/jasperreports-server/tibco-jasperreports-server-security-guide/vv900/jasperreports-server-security-guide-_-keymanagement-_-import_and_export/#Key_Command_Line_Export)

## Login into Source server

## Execute below commands to export the report

```
## Navigate to scripts dir
cd /home/ubuntu/jasperreports-server-cp-7.5.0-bin/buildomatic  
## Execute the report export script
./js-export.sh --uris /RWB_2023 --output-zip gramin_rwb_2023.zip --secret-key="\<specify_key_value>"  
## Copy the generated export file to home dir
cp gramin_rwb_2023.zip ~/  
## Exit
exit
```

## Transfer file to your system using scp

Ex: from your machine terminal

```shell Shell
scp jasper-reporting-openchs:gramin_rwb_2023.zip ./
```

## Login into Target Jasper server webapp

Import the zip file in target jasper using the "Key Value" option by specifying the key value "\<specify\_key\_value>" used during export.

<Image align="center" src="https://files.readme.io/6ca70fd-Screenshot_2024-03-15_at_4.32.26_PM.png" />
### Ai In Reporting

<Callout icon="❗️">
  This is no longer the recommended approach, please refer to [Simplification of reports development and testing](https://avni.readme.io/docs/simplification-of-reports#/) section
</Callout>

The tool used for this is Cursor which internally uses other AI services. You can download [Cursor](https://www.cursor.com/).

The source code used in this tool is available here [avni-ai-experiment](https://github.com/avniproject/avni-ai-experiment) (private repository as the CSV files used in the context may contain customer specific information). This repository will become a public repository soon.

# Generate aggregate and line list query

### When to use

Excel or spreadsheet contain the requirements for the report all present in a single sheet. This is the input used for generating the SQL. If you do not have this file then the steps below are **not recommended** as it will not be productive approach.

### Setup

1. Open avni-ai-experiment in Cursor.
2. Download the requirement sheet as a CSV file. Copy its contents and put them in any file under `bi-reporting-spike/dataset/workspace` folder. Let's say - `requirement.csv`. An example is present in workspace folder by name `example.csv`.
3. Create one file which contains all the table definition in the `bi-reporting-spike/aggregate/workspace`  or `bi-reporting-spike/linelist/workspace` folder. Let's say - `table-def.sql`. An example is present in workspace folder by name `example-jnpct-def.sql`. This was generated from IntelliJ (select schema and generate).

### Chat

1. Open chat window in Cursor.
2. Prompt to forget everything (line 1 of `aggregate-query-prompt.md` or `linelist-query-prompt.md`)
3. Follow the steps in [https://github.com/avniproject/avni-ai-experiment/blob/main/bi-reporting-spike/aggregate/workspace/aggregate-query-prompt.md](https://github.com/avniproject/avni-ai-experiment/blob/main/bi-reporting-spike/aggregate/workspace/aggregate-query-prompt.md) or [https://github.com/avniproject/avni-ai-experiment/blob/master/bi-reporting-spike/linelist/workspace/line-list-prompt.md](https://github.com/avniproject/avni-ai-experiment/blob/master/bi-reporting-spike/linelist/workspace/line-list-prompt.md)
### Jasper Notes

### Self referential hierarchical reports

1. The contents of JRXML can be manipulated based on the url parameters. The url parameters can be coming from the same report at a higher level.
2. Each report can have filters specific to that level, which cannot be dynamically changed. So this is a blocker.

### Creating new version

This is to avoid changing the production version as it is already in use.

1. Copy can be created using export.
2. All the files are text files so these can be changed in editor and then imported after zipping.
### Post Etl Sync Processing

# Post-ETL Sync Processing

The Post-ETL Sync Processing feature enables custom data transformations after the standard ETL process is completed. This functionality allows organizations to create derived tables, perform complex data aggregations, and implement custom business logic on the ETL data.

## Key Features

* **Configurable Transformations**: Define custom SQL transformations through JSON configuration files
* **Incremental Processing**: Only process data that has changed since the last sync
* **Ordered Execution**: Execute DDL and DML operations in a specified order
* **Schema-specific Configurations**: Support for organization-specific transformations
* **Transaction Management**: Ensures data integrity during the transformation process

## Repository and Setup

This feature is part of the **avni-etl** repository. For complete setup instructions and the main ETL service documentation, refer to:

* **GitHub Repository**: [https://github.com/avniproject/avni-etl](https://github.com/avniproject/avni-etl)
* **ETL Service Documentation**: See the README.md in the avni-etl repository for basic ETL setup and configuration
* Refer <Anchor label="Developer Avni Setup documentation" target="_blank" href="developer-environment-setup-ubuntu">Developer Avni Setup documentation</Anchor> for more information

### Prerequisites

Before setting up Post-ETL Sync Processing, ensure you have:

1. A working ETL service setup (as documented in the avni-etl repository)
2. Organization-specific ETL schema configured
3. Appropriate database permissions for the organization user

### Quick Setup Reference

For detailed setup instructions, refer to the avni-etl repository README.md, but the key steps include:

1. Clone the avni-etl repository
2. Set up the database and ETL schema for your organization
3. Configure the Post-ETL Sync processing as described in this document

## Implementation Details

### Key Components

1. **PostETLConfig**: Domain model for the configuration structure
2. **PostETLSyncService**: Service that orchestrates the execution of post-ETL sync scripts
3. **PostETLSyncStatusRepository**: Manages the sync state and cutoff timestamps
4. **EtlService**: Integration point to trigger post-ETL sync after the main ETL process

### Execution Flow

1. The ETL process completes
2. PostETLSyncService loads the organization-specific configuration
3. DDL scripts are executed in order (if tables don't exist)
4. DML scripts are executed in order, with inserts followed by updates
5. The cutoff timestamp is updated for the next run

## SQL Scripts

SQL scripts are stored in the organization-specific directory and referenced in the configuration file:

1. **DDL Scripts**: Create tables, indexes, and other database objects. These run first and only if the table doesn't already exist.

2. **DML Scripts**: Insert and update data in the tables:
   * **Insert SQL**: Adds new records to the target table
   * **Update SQLs**: Updates existing records in the target table

## Parameter Substitution

The system automatically replaces the following parameters in SQL scripts:

* `:previousCutoffDateTime`: Timestamp of the last successful sync
* `:newCutoffDateTime`: Current timestamp for this sync
* `:param1`, `:param2`, etc.: Custom parameters specified in the `sql-params` array

## Configuration Structure

The Post-ETL Sync process is driven by a JSON configuration file named `post-etl-sync-processing-config.json` located in the organization-specific directory under `src/main/resources/post-etl/{organization}/`.

```json
{
  "ddl": [
    {
      "order": 1,
      "table": "table_name",
      "sql": "create-table-script.sql",
      "exists_check": "optional_custom_check_query"
    }
  ],
  "dml": [
    {
      "order": 1,
      "table": "target_table_name",
      "sqls": [
        {
          "order": 1,
          "sourceTableName": "source_table",
          "insert-sql": "insert-script.sql",
          "update-sqls": [
            "update-script-1.sql",
            "update-script-2.sql"
          ],
          "sql-params": [
            "optional_param1",
            "optional_param2"
          ]
        }
      ]
    }
  ]
}
```

## Configuration Requirements

### DDL Configuration

* `order`: Numeric execution order (starts with 1)
* `table`: Target table name
* `sql`: SQL script filename for table creation
* Optional: `exists_check` for custom table existence verification

### DML Configuration

* `order`: Numeric execution order
* `table`: Target table name
* `sqls`: Array of source table operations with:
  * `order`: Execution order within the DML operation
  * `sourceTableName`: Source table for data
  * `insert-sql`: Script filename for insert operations (can be empty if only updates)
  * `update-sqls`: Array of update script filenames (can be empty if only inserts)
  * Optional: `sql-params` for additional parameters

## Best Practices

### Schema Name Usage

1. **Always qualify table names** with the schema name in all SQL scripts:
   ```sql
   apfodisha.individual_child_growth_monitoring_report
   ```

2. **Begin DDL scripts with role setting** to ensure proper permissions:
   ```sql
   set role apfodisha;
   ```

3. **Use consistent schema names** throughout all related SQL scripts, matching the directory name under `post-etl/`

### Timestamp Filtering

1. **Always use both timestamp parameters** in SQL scripts that modify data:
   ```sql
   WHERE (column_datetime > :previousCutoffDateTime AND column_datetime <= :newCutoffDateTime)
   ```

2. **Apply filters to multiple timestamp columns** when applicable:
   ```sql
   WHERE (created_date_time > :previousCutoffDateTime AND created_date_time <= :newCutoffDateTime)
      OR (last_modified_date_time > :previousCutoffDateTime AND last_modified_date_time <= :newCutoffDateTime)
   ```

3. **Include timestamp filters in all subqueries and CTEs**:
   ```sql
   AND follow_up.last_modified_date_time > :previousCutoffDateTime 
   AND follow_up.last_modified_date_time <= :newCutoffDateTime
   ```

### SQL Script Practices

1. **Use descriptive prefixes** related to the target table (e.g., `icgmr-` for individual_child_growth_monitoring_report)

2. **Use CTEs for complex updates** and include explicit JOINs with proper conditions

3. **Always include `is_voided = false` checks** when applicable

4. **Specify data types and nullability** explicitly in CREATE TABLE statements

### Example SQL Script

```sql
-- Insert script
INSERT INTO schemaname.custom_report_table (field1, field2, field3)
SELECT 
    s.field1,
    s.field2,
    s.field3
FROM schemaname.source_table s
WHERE (s.created_date_time > :previousCutoffDateTime AND s.created_date_time <= :newCutoffDateTime)
   OR (s.last_modified_date_time > :previousCutoffDateTime AND s.last_modified_date_time <= :newCutoffDateTime);
```

## Adding New Transformations

To add new post-ETL transformations:

1. Create SQL scripts for table creation and data manipulation
2. Update the organization's `post-etl-sync-processing-config.json` file
3. Place all files in the organization-specific directory under `src/main/resources/post-etl/{organization}/`

## Current Implementations

The system currently implements transformations for:

* **APF Odisha**: Child growth monitoring reports with derived fields for nutrition status
* **RWB**: Custom reporting tables

## Troubleshooting

### Delete previous version of specific post_etl_sync_processing_config database table

```sql
DELETE FROM public.post_etl_sync_status WHERE db_user = 'apfodisha';
DROP TABLE apfodisha.individual_child_growth_monitoring_report;
```

### Common Issues

* Check application logs for detailed execution information
* Verify SQL scripts use the correct schema and table names
* Ensure parameter placeholders match the expected format
* Confirm the configuration file follows the correct JSON structure

### Security Considerations

* SQL scripts run with the organization's database role
* Each organization's transformations are isolated to their own schema
* The search path is reset after execution to prevent cross-schema access

<br />
## Ai Assisted Project Scoping And Development

This guide describes how to use AI to accelerate Avni project scoping and configuration development. The workflow has two main phases:

1. **Export scoping documents** – Convert Google Sheets scoping/SRS documents to CSV for AI consumption
2. **Generate bundle configuration** – Use AI with the exported CSVs and reference materials to produce production-ready Avni configurations

## Step 1: Export Scoping Documents to CSV

Use this Apps Script to export all sheets from Google Sheets files in a Drive folder as UTF‑8 CSV files.

### Setup

1. Create two folders in Google Drive:
   * One for **input** spreadsheets (source)
   * One for **CSV exports** (target)
2. Copy each folder's ID from its URL (`https://drive.google.com/drive/folders/<ID>`)
3. In any Google Sheet, open **Extensions → Apps Script**
4. Paste the script below and replace `SOURCE_FOLDER_ID` and `TARGET_FOLDER_ID` with your IDs

### Script

```javascript
// App Script to download all sheets as CSV for AI input
function exportAllSheetsFromFolderToCsv() {
  const SOURCE_FOLDER_ID = '1TPP3ZpOasdasdsdsaasa'; // Folder containing Google Sheets
  const TARGET_FOLDER_ID = '1Bcy10UHsKasdasdasdsd'; // Folder to store CSV exports

  const sourceFolder = DriveApp.getFolderById(SOURCE_FOLDER_ID);
  const targetFolder = DriveApp.getFolderById(TARGET_FOLDER_ID);

  // Only Google Sheets files in the source folder (not XLS/XLSX)
  const files = sourceFolder.getFilesByType(MimeType.GOOGLE_SHEETS);

  while (files.hasNext()) {
    const file = files.next();
    const ss = SpreadsheetApp.openById(file.getId());
    const sheets = ss.getSheets();

    sheets.forEach(sheet => {
      const data = sheet.getDataRange().getValues()
        .map(row => row.map(v => v.toString())
          .map(v => (v.includes('\n') || v.includes(',')) ? `"${v}"` : v)
          .join(','))
        .join('\n');

      const name = ss.getName() + ' - ' + sheet.getName() + '.csv';
      // Creates UTF‑8 text CSV in the target folder
      targetFolder.createFile(name, data, MimeType.PLAIN_TEXT);
    });
  }
}
```

### Run the Script

1. In the Apps Script editor, select `exportAllSheetsFromFolderToCsv` and click **Run**
2. Approve permissions when prompted (first time only)
3. Open the target Drive folder to find one `.csv` per sheet, named `<SpreadsheetName> - <SheetName>.csv`

## Step 2: Generate Bundle Configuration with AI

With the scoping CSVs ready, use AI to generate Avni bundle configurations. The **[Avni Bundle Configuration Guide](https://github.com/avniproject/avni-impl-bundles/blob/main/reference/BUNDLE_CONFIG_GUIDE.md)** in the `avni-impl-bundles` repository provides the complete reference for this process.

### What the Guide Covers

* **Analyze SRS Documents** – Map subject types, programs, and form fields from your CSVs
* **Create Concepts** – Define concept structures with proper data types and coded values
* **Create Forms** – Build forms with skip logic, validation rules, and decision rules
* **Configure Form Mappings** – Link forms to subject types and programs
* **Set Up User Groups & Privileges** – Define access control and permissions
* **Configure Report Cards & Dashboards** – Create standard and custom report cards
* **Write Rules** – Implement summary, eligibility, visit schedule, decision and validation rules
* **Validation & Troubleshooting** – Common errors and verification checklists

### Reference Materials

The [`avni-impl-bundles/reference`](https://github.com/avniproject/avni-impl-bundles/tree/main/reference) folder contains additional guidance and examples for AI-assisted configuration generation
# Developers

## Environment Setup Guides

### Setup Avni Pre Release Environment On Aws Cloud

The below steps are written down taking setup of prerelease environment as an example.

# Steps to setup the pre-release avni server on AWS

**Setup Avni Postgresql Database RDS**

1. Make use of a 2-3 day old Production RDS Automatic snapshots to create a pre-release RDS instance. While configuring it ensure the following
   1. **IMPORTANT: Use "t4g.small" type instance (2 cpu, 2 GB ram), it by default selects (m6.xlarge) which is extremely expensive**
   2. Edit Network config and
      1. Assign Prerelease Security-groups (Add db-sg SGs in corresponding VPC)
      2. Enable auto-assign of public ip
   3. Assign only 20GB GP2 storage
   4. disable system backups for this rds
   5. Update the prereelasedb.avniproject.org route to point to this RDS

**Setup Avni Server EC2 instancer**

1. From the pre-release ec2-template launch a new instance. **Use "t3.small" type instance (2 cpu, 2 GB ram). And enure Auto-assign public IP is enabled.**
2. Configure the above ec2 instance to include appropriate storage, network, Security-group, and CPU / RAM configuration

**Setup Network, Routes and permissions**

1. create internet gateway, and add it as target in your VPC route table.
2. create loadbalancer. setup SSL cert. Set target group to the EC2 instance.
3. Create a route for DB (type is cname), ssh, and application using avniproject.org hosted zone. openchs.org is deprecated.
4. create s3 bucket with existing bucket settings created for another env. (if S3 bucket exists, if needed empty it, to avoid using stale dumps)
5. create cognito user pool - there was no way to manua.
6. Create necessary user, iam policy and roles for ec2, s3 bucket and cognito user pool.

**Checklist for remaining setup (not detailed)**

1. setup avni-server
2. setup avni-webapp
3. set up rules server
4. Clean up stale s3 entries in DB
5. Create client pointing to pre-release
6. APK creation
7. login and test apk
8. Share apk

**Steps to setup avni-server, avni-client, avni-webapp, and rules-server with the above created AWS resources:**

1. > 📘 SSH in into pre-release server.
   >
   > Include the following in .bash_profile file:
   >
   > sudo vi ~/.bash_profile  
   > export LANG=en_US.UTF-8  
   > export LANGUAGE=en_US.UTF-8  
   > export LC_COLLATE=C  
   > export LC_CTYPE=en_US.UTF-8

2. run the above on the console as well

3. > 📘 create newRelic and openchs folder
   >
   > [ec2-user@ip-172-1-1-76 ~]$ sudo mkdir -p /opt/newrelic/
   >
   > [ec2-user@ip-172-1-1-76 ~]$ chmod 777 /opt/newrelic/  
   > chmod: changing permissions of ‘/opt/newrelic/’: Operation not permitted  
   > [ec2-user@ip-172-1-1-76 ~]$ sudo chmod 777 /opt/newrelic/  
   > [ec2-user@ip-172-1-1-76 ~]$ sudo mkdir -p /etc/openchs/  
   > [ec2-user@ip-172-1-1-76 ~]$ sudo chmod 777 /etc/openchs/  
   > [ec2-user@ip-172-1-1-76 ~]$ sudo vi /etc/openchs/openchs.conf  
   > ###paste pre-release openchs config from keeweb into this and save###

4. > 📘 Copy new-relic file to server
   >
   > scp newrelic.jar prerelease-server-openchs:/opt/newrelic/ newrelic.jar

5. Configure avni-server to use prerelease instead of prod for bugsnag

6. Trigger deploy of avni-server, ensure all deploy commands circle-ci config.yml of avni-server complete successfully (Triggering deploy will perform setup of the machine as required for backend app)

7. Once the avni-server backend app comes up, register the new instance as target in prerelease-openchs-load-balancer

8. Trigger deploy of avni-webapp, app should be soon available at [https://prerelease.avniproject.org/#/admin/user/6352/show](https://prerelease.avniproject.org/#/admin/user/6352/show)  
   (Triggering deploy will perform setup of the machine as required for web app)

9. Trigger deploy of rules-server (Triggering deploy will perform only initial setup of the machine as required for rules-server app)

10. > 📘 Fix pm2 setup issue for rules-server:
    >
    > a. Become rules user => sudo su - rules
    >
    > b. Follow steps specified in [https://medium.com/monstar-lab-bangladesh-engineering/deploying-node-js-apps-in-amazon-linux-with-pm2-7fc3ef5897bb](https://medium.com/monstar-lab-bangladesh-engineering/deploying-node-js-apps-in-amazon-linux-with-pm2-7fc3ef5897bb)  
    > till it asks for running command  
    > "sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemv -u rules --hp /home/rules"  
    > c. sudo mkdir -p /etc/pm2deamon  
    > d. sudo chmod 777 -R /etc/pm2deamon  
    > e. Run, below command to start rules-server after replacing the placeholders $1 and $2:
    >
    > sudo -H -u rules bash -c "cd /opt/rules-server && OPENCHS_UPLOAD_USER_USER_NAME=$1 OPENCHS_UPLOAD_USER_PASSWORD=$2 NODE_ENV=production pm2 start app.js --name rules-server --update-env"

11. > 📘 Go to Avni-client and run :
    >
    > make clean_all deps release_prerelease_without_clean upload-prerelease-apk
    >
    > Output : Pre-release APK Available at [\<[https://s3.ap-south-1.amazonaws.com/samanvay/openchs/prerelease-apks/prerelease-436d-2022-12-19-20-38-35.apk>](🔗)](🔗)

12. > 📘 In-order to avoid S3 errors during avni-client sync, connect to the DB and run below commands:
    >
    > update public.subject_type  set icon_file_s3_key = null where  icon_file_s3_key is not null;
    >
    > update public.news set hero_image = null where hero_image is not null;

13. Create IAM policy and associate it with IAM_USER
    1. Create a IAM policy prerelease_iam_policy similar to prod_iam_policy, except that the S3 bucket is “prerelease-user-media”.
    2. Associate prerelease_iam_policy with prerelease_iam_user.

14. **IMPORTANT: Never copy S3 content and specifically the Fast-sync files from Production to any other environment. When we apply the fast-sync, it modified the serverUrl, which will end up connecting our APK as client to Production environment.**

15. To setup newrelic agent on the server, refer [their](https://docs.newrelic.com/install/java/) documentation.

## Reference steps to deploy node and pm2 on Amazon linux:

> 📘 Update packages and install node and pm2:
>
> sudo yum update -y  
> Install necessary dev tools:  
> sudo yum install -y gcc gcc-c++ make openssl-devel git  
> Install Node.js:  
> curl --silent --location [https://rpm.nodesource.com/setup_10.x](https://rpm.nodesource.com/setup_10.x) | sudo bash -  
> sudo yum install -y nodejs  
> Install pm2:  
> sudo npm install pm2@latest -g
>
> Install git:  
> sudo yum install git  
> Setup env:  
> sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemv -u rules --hp /home/rules

## Steps specific to prerelease env setup before bugbash:

* Update the db of prerelease with prod db data. Do this before generating the prerelease apk, since generating of the apk is linked with updating platform translations in the server db.
* Stop the prerelease avni app server process - sudo systemctl stop avni_server_appserver.service
* Update the route53 dns entry for prereleasedb.avniproject.org to point to the RDS endpoint if changed
* Apply manual data-fixes if needed
* Trigger build from circleci to deploy app and apply Platform migrations if not already done
* (Only if specifically required to clean up S3 files) Delete all S3 folders within prerelease-user-media bucket, retaining the bucket as is.([https://s3.console.aws.amazon.com/s3/buckets/prerelease-user-media?region=ap-south-1&tab=objects](https://s3.console.aws.amazon.com/s3/buckets/prerelease-user-media?region=ap-south-1\&tab=objects))
* Clean-up Integration-system-config to prevent cross environment usage **Very Important**
  ```sql
  -- Step 1: Void all existing integration configs (safer than delete)
  DELETE FROM integration_system_config WHERE id >= 1;
  UPDATE integration_system SET is_voided = true;
  UPDATE goonj_adhoc_task SET is_voided = true;


  -- Step 2: Later, when setting up prerelease integrations, 
  -- insert new configs with int_env = 'prerelease'
  INSERT INTO integration_system_config (key, value, is_secret, integration_system_id, is_voided, uuid)
  SELECT 'int_env', 'prerelease', false, id, false, 'bea0db7a-719a-4b42-8840-db2047c54071'
  FROM integration_system
  WHERE system_type IN ('Goonj', 'rwb')
    AND is_voided = false;
  ```
  <br />
* Delete the urls of prod s3 icons in prereleasedb by doing the below:
  ```Text SQL
  set role none;
  update report_card set icon_file_s3_key=null where icon_file_s3_key is not null;
  update subject_type set icon_file_s3_key=null where icon_file_s3_key is not null;
  update news set hero_image=null where hero_image is not null;
  update individual set profile_picture = null where profile_picture is not null;
  update concept set media_url = null, media_type = null where media_url is not null;
  ```
* Delete the older prerelease db
### Upgrading Metabase

##

In case of major changes, you should try upgrading the Metabase locally, before directly doing it on production. Once everything works on your local, proceed to deploy it on production. Before doing any deployment on production always remember to take a DB snapshot of the reporting DB. One can follow below steps for doing the Metabase upgrade.

* Take the reporting DB dump from the reporting server and copy it on your local.
* Deploy the DB dump on your local.
* Now deploy the Metabase version which is deployed in production.
* Stop the Metabase and run the version that you want to upgrade to.
* Now test out the Metabase locally to check everything is working fine.
* Once everything is working locally, create a snapshot of reporting DB before the upgrade.
* ssh into the Metabase server. Remove the old jar, and copy the new Metabase jar that you want to deploy.
* run ./reporting.sh, this will stop the old server and start the new server using the jar that you just copied.
* Login to Metabase and confirm the version and test that reports are working fine.
### Test And Production Environment Setup Centos

This page documents, how to set up Avni for **Production** or **Test** environments. Avni uses **Ubuntu Linux 22.04** or upwards for production environments. 

If you only want to set up Avni for *local development* on your own machine, then use this [Local development - Ubuntu](doc:developer-environment-setup-ubuntu). 

### Important information

* The release info with build numbers is published here
* The Github organization for Avni is here - [https://github.com/avniproject](https://github.com/avniproject) which has all the repositories.

This setup documentation assumes that the user knows how to install and use some of the commonly used utilities. There is enough documentation on the Internet for installing and using them. We may link these docs in some places but not always. The exact commands are `indicated as this always`. Please ensure you have the following software configuration already:

* Your OS user has sudo access
* curl, wget
* nvm
* (Optional) Automatically set the node version when you change your directory based on the .nvmrc file present in that directory. Place the function code as it [in the file](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/example-code-files/cd_shell_func.sh).
* Linux user with sudo access

# High-Level Installation Areas

Please follow the steps mentioned below. At a high level, we will cover five broad installation areas:

1. Third-party components like AWS IAM, Cognito, and S3, are needed by Avni.
2. Avni Database and Server Setup.
3. Deploy a specific "Implementation" / "Template".
4. Install the Avni Android app on mobile/emulator.
5. Deploy the Avni Admin Web app

See below for each install area.

# 1. Third-party components

## 1.1 AWS command-line tool setup

* Install the aws cli by following the instructions in their documentation
* You need to have two environment variables set up - AWS\_ACCESS\_KEY\_ID and AWS\_SECRET\_ACCESS\_KEY. You can use AWS's IAM service to set them up.

## 1.2 AWS IAM, Cognito, and S3 setup

Avni uses Cognito and S3 services from AWS. S3 service will be used by Avni only if any of the implementations use photo or video capture functionality in the field app. IAM is the identity and access management service for all AWS services (like Cognito and S3). Users are created in IAM to provide access to various services/resources/actions within AWS. Cognito is also an identity and access management service to be used by AWS customers/users to manage their application users. This can be confusing initially hence, it is important to pause and understand this well.

#### 1.2.1 IAM User Configuration

Since Cognito and S3 are secure services running within AWS - Avni has to authenticate itself before using these services. Hence, create an IAM user (if you are new to AWS then you can find IAM under services in the AWS console) which could be used by Avni to connect to Cognito and S3. For this user create a policy (inline or managed) with the following details:

* Service = S3; Actions = refer [this diagram](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/img/s3-actions.png); Resources = (as per your configuration)
* Service = Cognito; Actions = refer [this diagram](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/img/cognito-pool-access.png); Resources = (to your user pools)

#### 1.2.2 Cognito Setup

Create a user pool. We have left the settings that you may want to change as per the policies of your hosting, up to you. Only the settings which need to be made for Avni to work correctly have been specified below.

* How do you want your end-users to sign in? - *Username*
* Add custom attributes as described in [this diagram](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/img/cognito-custom-attributes.png). Note that you should not put *custom:* in front of the name as this is added automatically.
* Just check the policy tab in Cognito to understand how you need to set passwords.
* MFA and Verifications
* Recovery - using Phone if available
* Attributes to verify - Phone number
* App Clients\
  Create two app clients. **avni-server**, **avni-webapp** with a few changes from default settings. See the screenshot [here](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/img/cognito-app-client.png).

#### 1.2.3 S3 Setup

Avni stores the images, videos, and longitudinal data export in S3.

* Create a bucket to which you will be saving all of the above files. The properties of this bucket can be seen [here](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/img/s3-root-properties.png).
* In openchs.conf provides the bucket name you have given to the property - OPENCHS\_BUCKET\_NAME

#### 1.2.4 Create Admin User

Avni is a multi-tenant system, hence this user is the administrator for all tenants (also referred to as implementation or organization elsewhere).

* Create an *admin* user in your user pool. For userUUID provide the value as *5fed2907-df3a-4867-aef5-c87f4c78a31a*. After you have manually created the user in Cognito you can use the command *aws cognito-idp admin-update-user-attributes --user-pool-id\<YOUR\_POOL\_ID> --username admin --user-attributes Name="custom:userUUID",Value="c8381fe2-7924-4ffd-acbe-14729b3257ed"*
* Set password for admin user and confirm it *aws cognito-idp admin-set-user-password --user-pool-id\<USER\_POOL\_ID> --username admin --password \<PASSWORD> --permanent*

# 2. Server-side components

### 2.1 PostgreSQL Database (version 12.x)

* Install *postgresql-server*, *postgresql-contrib* packages
* Initialize the database and start
* Change postgres login access from *peer to trust* - Edit /var/lib/pgsql/VERSION/data/pg\_hba.conf. As in line 2 and 9 of [this file](https://github.com/avniproject/avni-readme-docs/blob/master/example-code-files/pg_hba.conf).
* Restart postgres - *sudo systemctl restart postgresql-VERSION*
* [Create OpenCHS database, user and install extensions](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/example-code-files/create-database.sh)

### 2.2 Avni Server

* Download the RPM you want to install. You can download it by replacing the build number in the *[https://circleci.com/gh/avniproject/avni-server/](https://circleci.com/gh/avniproject/avni-server/)\<server\_build\_number>#artifacts* by the build server build number you got from release info page. For downloading the build expand CircleCI **node** in the tree. Refer to [this diagram](https://github.com/avniproject/avni-readme-docs/blob/master/img/downloading-build-from-circleci.png) for help.
* Install from the rpm using *sudo yum install \<rpm-file>*
* Create a file update the file /etc/openchs/openchs.conf with the contents [here](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/example-code-files/openchs.conf). The properties are explained below:
  * OPENCHS\_SERVER\_PORT - port on which you want the server to listen on
  * OPENCHS\_SERVER\_OPTS - change the logging properties which are self-explanatory. You can also set JVM properties.
  * OPENCHS\_USER\_POOL - this is the id of Cognito user pool
  * OPENCHS\_CLIENT\_ID - app client id for Cognito
  * OPENCHS\_MODE - should be = live
  * OPENCHS\_SERVER\_BUGSNAG\_API\_KEY - the value of the bugsnag API key if you are using one
  * OPENCHS\_BUGSNAG\_RELEASE\_STAGE - the value of the bugsnag release stage properties if you are using bugsnag service
  * OPENCHS\_BUCKET\_NAME - S3 bucket name (required if the users are using the photo, video features in the forms)
  * OPENCHS\_IAM\_USER, OPENCHS\_IAM\_USER\_ACCESS\_KEY, OPENCHS\_IAM\_USER\_SECRET\_ACCESS\_KEY = AWS IAM user details
* Start Avni Server by running the command `sudo service openchs start`
* Verify Avni server is running - *c`url http\://<server>:<port>/concept`* - should give you a few concepts in the JSON response.

# 3. Deploy Implementation

Avni is a platform and without the deployment of an implementation onto it, it doesn't do anything. If you do not have your own implementation yet, you can clone any of the implementations from [here](https://github.com/avniproject?q=implementation). If you want to understand how the whole system functions (app, web app, server), it is recommended you choose the [sample implementation](https://github.com/avniproject/sample-impl). The sample implementation supports multiple names of environments - staging, prod, uat. You can also use multiple of these keywords if you want to deploy to multiple environments. **The following documentation assumes that you are deploying to staging environment.** Some of the steps below will get automated into simpler steps.

* git Clone the code of the sample implementation repository
* Create a file by name secrets.json in the parent directory of the implementation directory like [here](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/example-code-files/secrets-staging.json). Modify the properties as described below:
* serverUrl - the base URL avni server
* clientId - Cognito's client id
* poolId - Cognito's app pool id
* To install node dependencies run from the implementation directory run - `make deps`
* Each implementation must have at least one implementation administrator. This user is responsible for master data management, modifying forms, etc. This is different from the environment administrator (admin) we created earlier. To create an implementation administrator run - `make deploy-staging-adminUsers`
* run *aws cognito-idp admin-set-user-password --user-pool-id\<POOL\_ID> --username \<ORG\_ADMIN\_USER> --password \<ORG\_ADMIN\_PASSWORD> --permanent*
* run `make deploy-staging-all` (you need to have avni-server running when you run this command)
* Review and edit (this file)\[\<https\://raw\.githubusercontent.com/avniproject/sample-impl/master/create\_gender.sql>] and run it.

# 4. Avni Android App

**Avni mobile app build process currently doesn't support more than one instance of it in the play store. There is a plan to make this available, but if you really want it** no&#x77;**, we can help you with a hack. Please contact us.** Currently, the only option for you is to generate APK from the source code and distribute the APK to your users.

* Clone avni-client from Github (check the [Build numbers](doc:build-numbers) to find the right branch to pull)
* Use nvm to install node version requires - `nvm install` from avni-client directory. It would pick up the .nvmrc file to install the correct version.
* Install node dependencies - `make deps` (this would take some time in installing all the node dependencies)
* Modify packages/openchs-android/config/env/staging.json file to provide the server URL.
* From the avni-client folder, perform `make release_staging` (Note: the released APK would not use unsecured http connections. If you want to connect to your environment you can use `make run_app_staging`).
* Perform `make openlocation_apk` to find the APK file
* To check log output of the avni application, run command - `adb logcat *:S ReactNative:V ReactNativeJS:V`

# 5. Avni Administration Web app

* Download the build.zip file from *[https://circleci.com/gh/avniproject/avni-webapp/](https://circleci.com/gh/avniproject/avni-webapp/)\<build\_number>#artifacts* (to find the build use the similar method as explained in downloading of build for avni-server above)
* (one-time activity) *cd /opt/openchs && ln -s /opt/openchs-webapp static*
* Extract the contents of the build zip to /opt/openchs-webapp folder (clear the folder completely if you are updating the build)
* The web app is also served by avni server from the root (/)

# 6. Avni Rules Server (Optional)

* Required if you would like to use the Data Entry App (DEA) interface included in the Web app to manage data for your deployment. This component executes the rules for data entered through the DEA.
* We use pm2 to manage the rules server process but it can be executed without pm2 as well.
* Download the compressed deployable from *\<[https://circleci.com/gh/avniproject/rules-server/](https://circleci.com/gh/avniproject/rules-server/)>\<build\_number>#artifacts*
* Setup 'upload-user' user - Required if you are planning to upload data using the csv upload feature and would like rules to be executed on the data being uploaded.
  * Login to the webapp using the super admin credentials
  * Go to the 'Admins' menu item and choose the 'Create' option. Create a new user with the username 'upload-user'.
  * Provide the `OPENCHS_UPLOAD_USER_USER_NAME`and `OPENCHS_UPLOAD_USER_PASSWORD` to the rules server process during startup.
* Extract the deployable and execute the following command within the directory to execute the rules server using pm2:
  * ```
    OPENCHS_UPLOAD_USER_USER_NAME={{ openchs_upload_user_user_name }} OPENCHS_UPLOAD_USER_PASSWORD={{ openchs_upload_user_password }} TZ={{ avni_tz }} NODE_ENV=production {{ pm2_path }} start app.js --name {{ application_name }} --update-env
    pm2 save
    ```

# **YOUR SETUP IS COMPLETE !!!**
### Developer Environment Setup Ubuntu

This page documents, how to set up your local development machine so that you can contribute to Avni products. 

This setup documentation assumes that the user knows how to install and use some of the commonly used utilities. There is enough documentation on the Internet for installing and using them (putting in your version of Ubuntu would give you better results). We may link these docs in some places but not always. The exact commands are `indicated as this always`. Please ensure you have the following software setup.

* Git
* GitHub account
* Your OS user has sudo access
* Curl
* nvm
* Flyway command line tool (optional)

### Other information

* The GitHub organization for Avni is here - [https://github.com/avniproject](https://github.com/avniproject) which has all the repositories.
* The Linux user using which installation has to be done is expected to be a sudo user

# Server-Side Components

### PostgreSQL

* Install postgresql-server (version = 16)
* Change postgres login access from *peer to trust* - Edit /etc/postgresql/PG.VER/main/pg\_hba.conf. As in line 2 and 9 of [this file](https://github.com/avniproject/avni-readme-docs/blob/master/example-code-files/pg_hba.conf).
* Restart postgres - `sudo systemctl restart postgresql.service`
* Configure your system user to have all privileges on postgres DB

CMD$>psql -d postgres --u postgres

```Text sql
CREATE ROLE <system_user>;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO <system_user>;

GRANT ALL PRIVILEGES ON DATABASE "postgres" to <system_user>;

ALTER USER <system_user> WITH SUPERUSER;
```

* Create OpenCHS database, user and install extension - make build\_db

### Java

* Install JDK 21
* Set JAVA\_HOME,\
  OR\
  Add installed JDK to `jenv`  using\
   `jenv add /usr/localCellar/openjdk@21/21.0.*`

### Avni Server

* Clone avni-server from Github
* Create the database - make build\_db
* Start Avni Server by running the command `make start_server` from the home directory of the avni-server project. (the first time it may take a few minutes to download Gradle, maven dependencies, and all the database migrations. wait till you see Started OpenCHS....)
* Verify Avni server is running - `curl <http://localhost:8021/concept`> - should give you a few concepts in the JSON response.

### Avni Rules Server

* Clone rules-server from Github
* Use nvm to install node version requires - `nvm install` from the rules-server directory. It would pick up the .nvmrc file to install the correct version.
* Use `make deps` to install dependencies
* Use `make start` for starting the server

### Avni ETL Server

* Clone avni-etl from Github
* Avni ETL uses the same database as avni-server for unit tests. Hence to run the test you need clear/setup test database from the avni-server project.
  * Run `make rebuild_testdb deploy_test_schema` from avni-server, you will need flyway for this. The other way is to run `make test_server` once to setup the latest test database schema.
  * Run `make test` from avni-etl
* `make start_server` from avni-etl

### Avni Media

Avni media has two components - web app and server. Avni Media client and server do not support username based authentication which is currently supported on avni-server for local development. Connecting local avni-media to server/etl on another environment like staging leads to CORS errors.

Thus, for local development on avni-media, other avni components like avni-server and avni-etl need to be running locally with an IDP enabled i.e. Cognito or Keycloak.

I. Ensure that local avni-server and avni-etl have the following environment variables set

```shell
AVNI_IDP_TYPE
OPENCHS_CLIENT_ID
OPENCHS_IAM_USER_ACCESS_KEY
OPENCHS_IAM_USER_SECRET_ACCESS_KEY
OPENCHS_BUCKET_NAME
OPENCHS_USER_POOL
```

```Text Shell
OPENCHS_KEYCLOAK_SERVER
OPENCHS_KEYCLOAK_CLIENT_SECRET
OPENCHS_KEYCLOAK_ENABLED
```

II. Alternately, to work with Staging env IDP and Storage, you may use the following Make command in both avni-server and avni-etl. If required, override the DB and other details, Ex: OPENCHS\_DATABASE\_NAME=avni\_org

````Text Shell
```
## Init below fields in env variables
OPENCHS_STAGING_APP_CLIENT_ID
OPENCHS_STAGING_USER_POOL_ID
OPENCHS_STAGING_IAM_USER
OPENCHS_STAGING_IAM_USER_ACCESS_KEY
OPENCHS_STAGING_IAM_USER_SECRET_ACCESS_KEY

make start_server_staging OPENCHS_DATABASE_NAME=<your_db_name>
```
````

There is a local.staging environment template configured for client and server that help with running avni-media locally. Look at client/middleware.js which takes care of routing the request to local avni-server and avni-etl in this mode.

**Server**

```Text Shell
cd server
nvm use
make deps
make start-local-staging
```

**Client**

```Text Shell
cd client
nvm use
make deps
make start-local-staging
```

### Conceptual note

Avni authenticates against an external system (Cognito User Pools) which is a common resource. In developer environments, we do not use authentication because that would mean creating and sharing users on the user pool. If we use common users across developer machines the token issued and user status (locked, password) become shared data - leading to one developer blocking another user. This can hamper productivity. Hence for now, instead of engineering a solution around it, in developer environments, we can bypass authentication. This is sub-optimal but useful at a small scale (number of developers).

Bypassing authentication leaves one problem behind - how does the server know which user is sending the requests. As you will see later that we tell the server about the user, hence the server assumes that when no user is supplied to it, it should use that default user.

Start the server with the default user as implementation by running it is as: `OPENCHS_USER_NAME=admin@jnpct make start_server`

# Field app components

### Android SDK

* Install Android Studio (for SDK manager and device manager).\
  `brew install android-studio`\
  Note: Genymotion is preferred usually because of a lower resource configuration, but Mac M1 does not support Genymotion.
* Install JDK 17 using brew.
* Use SDK Manager in  android-studio to install latest - *platforms;android-31* and \_build-tools
* Set `ANDROID_HOME` and `ANDROID_SDK_ROOT` environment variables\
  (usually `$HOME/Android/sdk` on linux and `$HOME/Library/Android/sdk`  on Mac)
* Modify PATH to include `$ANDROID_HOME/tools` and `$ANDROID_HOME/tools/bin`\
  OR\
  On a mac  :Install android-platform-tools `brew install android-platform-tools`.\
  This makes android tools executables available on the path

### Android Emulator

* Install Genymotion or Android studio.
* Create a virtual android device and start it\
  TIP: you can start the device without starting studio by using the following command\
  `$ANDROID_SDK_ROOT/emulator/emulator -avd <your-avd-name>`

### Avni Android Client

* Clone avni-client from GitHub
* Use nvm to install node version requires - `nvm install` from the avni-client directory. It would pick up the .nvmrc file to install the correct version. Do read up on nvm if you are not familiar.
* Install node dependencies - `make deps` (this would take some time in installing all the node dependencies)
* Verify unit tests are running fine - `make test`
* Replace "localhost" with "10.0.2.2" in androidDevice.mk and dev.json.template files for "Mac OSX m1" with non-genymotion emulator
* Launch the app on an Android device
  * `cp packages/openchs-android/config/env/dev.json.template packages/openchs-android/config/env/dev.json`.
  * From the avni-client folder, perform the `make run_packager` in one terminal and perform `make run_app` in another terminal. After the app loads up in the emulator, press the sync button in the app. This should download all the configuration and master data that has been set up for this implementation.

# Web app components

* Clone avni-web-app
* Run `nvm install` from root dir of avni-web-app
* Install Yarn. Instructions [here](https://yarnpkg.com/en/docs/install)
* `make deps start` (ensure that you have started the server by providing the user)
* If the command fails with errors about fsevents, then check the version of Python installed and used as default 
* Configure pyenv and install 3.11.3 version of python on the machine and set it as local default
  ```
  #> pyenv versions
  #> pyenv install 2.7.1
  #> pyenv install 3.11.3
  #> pyenv local 3.11.3
  #> pyenv versions
  ```
* Open the app by going to [http://localhost:6010](http://localhost:6010)
* To start the web app as a specific user like admin\@jnpct or dev\@jnpct you can run - `REACT_APP_DEV_ENV_USER=admin@jnpct make start` or `REACT_APP_DEV_ENV_USER=dev@jnpct make start`

# Keycloak

Note: This is optional and is relevant only if you are working on features related to Avni on-premise deployment. We do not require Cognito or Keycloak access for most work (see conceptual note). There is a [makefile](https://github.com/avniproject/avni-infra/blob/master/local/keycloak/Makefile) that most of the following commands as targets.

* Follow the steps given here up to *Login to admin console* - [https://www.keycloak.org/getting-started/getting-started-zip](https://www.keycloak.org/getting-started/getting-started-zip).
* Request for a sample realm file that you can import from the team, using the`bin/kc.sh import --file=basic_realm.json`. Note the server must be stopped to run this command. Post import you can start Keycloak again.
* Log in to the Keycloak console and create a super admin user. This user is set up in the Avni database to be able to access any organization. This user should have an attribute by name=custom:userUUID and the value to be the same as the UUID of this user in the Avni database.
* In the client, settings set the Web Origins to [http://localhost:6010](http://localhost:6010) (this is the origin during development for the Avni web app)

# Setting up an implementation

Avni completed the setup and will create a blank slate. In this blank slate, you can create a new organization and configure the organization by setting up the applications, locations, users, etc. But if that is too much for you to get a feel of what is possible in Avni, then you can apply an implementation after creating the organization and an organization admin user. All the steps to follow below are from avni-web-app.

* Create a new organization (note that you are a super admin when you are doing this)
* Switch to the organization by choosing the org in the dropdown near the top right
* Create an organization admin user (by filling only the mandatory fields and setting the org admin value correctly)
* Get access to bundle export of an existing implementation by downloading it from another environment
* Install the bundle by uploading it

# Common tasks

* Debugging avni-client
  * Use console.log(). You will be able to see the logs by running `make log` or in metro output.
  * Debugging or testing changes done in avni-models
    * Since avni-models is an npm dependency in avni-client, you will have to build it locally and copy over the code in node\_modules. Build it from avni-models repo by running `make deploy-to-avni-client`

* Debugging avni-webapp
  * Use chrome/firefox debugger or console.log().
  * Debugging or testing changes done in avni-models
    * Same as how it's done in avni-client (you can find the target in Makefile of avni-models)

## **SETUP COMPLETE !!!**
### Environment Setup For Front End Product Development Ubuntu

This page documents, how to set up your development machine so that you can contribute to Avni front-end code - mobile app or webapp. This assumes that you have access to some test avni server, with one or more implementations deployed, to which you can connect to from your development environment. If you want to set up a full-stack environment, please use [this](doc:developer-environment-setup-ubuntu).

This setup documentation assumes that the user knows how to install and use some of the commonly used utilities. There is enough documentation on the Internet for installing and using them (putting in your version of Ubuntu would give you better results). We may link these docs in some places but not always. The exact commands are `indicated as this always`. Please ensure you have the following software setup.

* Git
* Github account
* You OS user has sudo access
* Curl
* nvm
* (Optional) Automatically set node version when you change your directory based on the .nvmrc file present in that directory. Place the function code as it [in the file](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/example-code-files/cd_shell_func.sh).

### Other information

* The Github organisation for Avni is here - [https://github.com/avniproject](https://github.com/avniproject) which has all the repositories.

# Field mobile app components

### Android SDK

* Install Android SDK Manager
* Use SDK Manager to install - *platforms;android-28* and *build-tools;28.0.3*
* Set ANDROID\_HOME environment variable
* Modify PATH to include $ANDROID\_HOME/tools and $ANDROID\_HOME/tools/bin

### Android Emulator

* Install Genymotion or Android studio.
* Create a virtual android device and start it

### Avni Android Client

* Clone avni-client from Github
* Use nvm to install node version requires - `nvm install` from the avni-client directory. It would pick up the .nvmrc file to install the correct version.
* Install node dependencies - `make deps` (this would take some time in installing all the node dependencies)
* Verify unit tests are running fine - `make test`
* `cp packages/openchs-android/config/env/dev.json.template packages/openchs-android/config/env/dev.json`
* Modify the value of SERVER*URL in\_packages/openchs-android/config/env/dev.json* file to match your avni server.
* From the avni-client folder, perform *make run\_app* and then press sync button in the app. This should download all the configuration and master data that has been set up for this implementation.

# Web app components

* Clone avni-web-app
* Run `nvm install` from root dir of avni-web-app (to install the required node version)
* Install Yarn. Instructions [here](https://yarnpkg.com/en/docs/install)
* `make deps start` (ensure that you have started the server by providing the user)
* Open the app by going to [http://localhost:6010](http://localhost:6010)
* To start the web app as a specific user like admin\@jnpct or dev\@jnpct you can run - `REACT_APP_DEV_ENV_USER=admin@jnpct make start` or `REACT_APP_DEV_ENV_USER=dev@jnpct make start`

## **SETUP COMPLETE !!!**
### Avni Webapp Setup

# Readme

[![Join the chat at https://gitter.im/avniproject/avni-webapp](https://badges.gitter.im/avniproject/avni-webapp.svg)](https://gitter.im/avniproject/avni-webapp?utm_source=badge\&utm_medium=badge\&utm_campaign=pr-badge\&utm_content=badge)

You will need `yarn` package mananger to be installed globally to run this project. Follow the instructions on [https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install) to install `yarn` if it is not already installed on your machine.\
Once installed you can verify it by running `yarn -v` on terminal. It should return whatever is the latest version mentioned on [https://yarnpkg.com/en/docs/install](https://yarnpkg.com/en/docs/install).

## Install dependencies

Once yarn is installed run the following:

```
make deps
```

## Setup

There are two possible ways to setup Avni Webapp for developement:

1. You can setup the webapp in a way that it directly connects to the hosted API server so you don't have to setup local postgres database and Java API server. This is an easy way to get started as you don't have to worry about having to install Java and API Server. Also this will consume less resources on your system as you are not running API server.
2. You can setup local postgres database and API server also locally and connect the webapp to that server. This is more difficult as it involves having to install Postgres, Java and running Java API Server.

#### 1. Setup to connect to hosted API Server (Samanvay hosted staging server)

1. Create a file named .env.development.local in root directory of avni-webapp
2. Put the below content in this file:

```
REACT_APP_COGNITO_IN_DEV=true
REACT_APP_AWS_REGION=ap-south-1
REACT_APP_COGNITO_USER_POOL_ID=ap-south-1_hWEOvjZUH
REACT_APP_COGNITO_APP_CLIENT_ID=7dbsrgg56mptr4ue1g65nv3s86
```

3. Set the value of "proxy" field in package.json to "[https://staging.avniproject.org"](https://staging.avniproject.org").
4. Run `make start`
5. It will start the app on http\://http\://localhost:6010/. It will ask you for login. If you dont' know the credentials ping us on #openchs channel on Gitter.

#### 2. Setup to connect to your local API Server

1. Start your Java Server. For this refer to [product developement setup document](https://avni.readme.io/docs/developer-environment-setup-ubuntu#server-side-components).
2. Run `make start` in avni-webapp directory.
3. It will assume whatever user you started the Java Server with since we don't do authentication when running the server locally. If you want to change the user then change the value of `devEnvUserName` variable declared in `src/common/constants.js` file. E.g. `export const devEnvUserName = "ihmp-dev";`

## Contributing

#### Pull requests

* Please make sure that your code follows guidelines given in [https://avni.readme.io/v2.0/docs/contribution-guide](https://avni.readme.io/v2.0/docs/contribution-guide).

#### File/folder structure

* Folders per route/feature\
  (See [https://marmelab.com/blog/2015/12/17/react-directory-structure.html](https://marmelab.com/blog/2015/12/17/react-directory-structure.html))
* Reducers and actions in 'ducks' structure (See [https://github.com/erikras/ducks-modular-redux](https://github.com/erikras/ducks-modular-redux))

#### Code Style

* We use Prettier for javascript/jsx formatting. You can use your IDE/Editor specific Plugin to format code using Prettier. Alternatively there is also a command `yarn prettier-all` that will format all files in src folder using Prettier. And there also is a git precommit hook that formats staged files using prettier before commiting.

#### Continuous Integration

All commits are built and tested and deployed to staging if tests succeed. Build status can be seen at [https://circleci.com/gh/OpenCHS/openchs-webapp](https://circleci.com/gh/OpenCHS/openchs-webapp). Please run tests using `yarn test` before you push your code so you don't end up breaking things unnecessarily.
### On Premise Setup Of Avni Without Cloud Services

Avni uses cloud services like AWS Cognito, S3, and ALB for user management, file storage, and reverse proxy respectively - to implement certain functional and technical features. Usage of these services (and other non-functional components like RDS) makes the hosting and operations of Avni simple. In the future, Avni will continue to use such services - for the same reasons. But since Avni is an open-source project, some users of Avni want to deploy it in their own data centers. Avni project therefore also supports integration with open source alternatives to the functional services, and provide automation scripts, and documentation.

While elsewhere in this documentation you may find some Linux commands specific to centos, but Avni is shifting all its OS usage to Ubuntu 20-04. Hence any commands in this document are for Ubuntu.

As we have mentioned elsewhere in the documentation - unless required here we have not put the documentation for installation or setup of standard software packages like Postgres, Java, Ansible, etc - as they are available at so many places on the Internet. 

### Open-source alternatives supported by Avni are as follows:

| Functionality                         | AWS Service               | Open-source alternative |
| :------------------------------------ | :------------------------ | :---------------------- |
| IdentityManagement and Authentication | Cognito                   | KeyCloak                |
| Routing                               | Application Load Balancer | Ngnix                   |
| Storage                               | S3                        | Minio                   |

**Note:** Its important to note that, opting between Cognito or Keycloak for IdentityManagement and S3 or Minio for Storage management is a one-time choice. Once configured, switching to the other alternative could result in access / data loss.

## Pre-requisites

### Knowledge

* Familiarity with Linux Operating system
* Shell Command-line
* Ansible
* SSH
* Basic understanding of Web applications

### Work-machine

A Ubuntu / MacOS Work-system which has following installed:

* Python
* Git
* Ansible

### Target On-premise server specificatins

Target system with 5 different compute nodes, for following purpose with these minimum configurations:

1. Avni-Server (Including webapp and rules-server) : 2 vCPU, 4 GB RAM 
2. Keycloak : 2 vCPU, 4 GB RAM 
3. Minio : 2 vCPU, 4 GB RAM, with 200 GB storage
4. Postgres Server : 2 vCPU, 4 GB RAM, with 100 GB storage
5. Reverse-Proxy : 1 vCPU, 2 GB RAM

## Clone the following GIT Repositories

* [avni-client](https://github.com/avniproject/avni-client/tree/master) : Used for generating an Avni-client APK to use with rest of your Avni application 
* [avni-infra](https://github.com/avniproject/avni-infra/tree/master) : Used for performing installation of all the remote components of Avni application

# Preparation

In Avni, we make use of Ansible scripts available in "avni-infra" repository to setup Avni on an On-premise environment.

You may install Ansible on your work-system, by following instructions specified [here](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)

Navigate to "avni-infra" repository, "configure" directory and perform following steps

1. Search and replace all instances of "security.lfe.avniproject.org" in "avni-infra" repository with your Company/project's domain name. Ex: "dev.mycompany.org"

2. Create a file "configure/group\_vars/onpremise-secret-vars.yml" in "avni-infra" repository using "configure/group\_vars/onpremise-secret-vars.template.yml" as the template and set appropriate values for all values enclosed in "\{\{\<placeholder>}}"

3. Invoke the Encrypt command to save the newly created file, using your own encrytion\_key file

```
make encrypt VAULT_PASSWORD_FILE=~/config/infra-pwd-file  
```

4. To be able to read encrypted file content decrypt it using, decrypting will overwrite the contents of "configure/group\_vars/onpremise-secret-vars.yml", therefore if there are changes in "configure/group\_vars/onpremise-secret-vars.yml", encrypt it and commit before invoking the decrypt command

```
make decrypt VAULT_PASSWORD_FILE=~/config/infra-pwd-file  
```

5. We then use this same encrytion\_key file while invoking ansible playbooks for "Avni" applications installation

```
app_zip_path=~/<path>/rules-server/ make rules-server-onpremise VAULT_PASSWORD_FILE=~/config/infra-pwd-file  
```

# Database

## PostgreSQL Database (version 12.x)

* Install *postgresql-server*, *postgresql-contrib* packages
* Initialize the database and start
* Change postgres login access from *peer to trust* - Edit /var/lib/pgsql/VERSION/data/pg\_hba.conf. As in line 2 and 9 of [this file](https://github.com/avniproject/avni-readme-docs/blob/master/example-code-files/pg_hba.conf).
* Restart postgres - *sudo systemctl restart postgresql-VERSION*
* [Create OpenCHS database, user and install extensions](https://raw.githubusercontent.com/avniproject/avni-readme-docs/master/example-code-files/create-database.sh)

# Keycloak

## Automated setup of KeyCloak using Ansible

We have ansible playbook to automate setup of Keycloak of "21.0.2" version for staging environment. This could be modified to suit change in target servers, Keycloak-version and credentials as per requirement.

* On your machine, clone [avni-infra](https://github.com/avniproject/avni-infra) repository and install ansible and other dependencies required
* Navigate to "configure" folder with-in the repository and trigger following "make" command with credential values as args:
  * keycloak\_db\_password=\<db\_pwd> keycloak\_admin\_pwd=\<admin\_pwd> keycloak\_admin\_api\_secret=\<admin\_api\_secret> **make keycloak-staging**
* Above command internally invokes following ansible playbook command:
  * KEYCLOAK\_DB\_PASSWORD=$(keycloak\_db\_password) KEYCLOAK\_ADMIN\_PWD=$(keycloak\_admin\_pwd) KEYCLOAK\_ADMIN\_API\_SECRET=$(keycloak\_admin\_api\_secret) ansible-playbook staging\_keycloak\_servers.yml --tags=keycloak -i inventory/staging
* For setting up different version of Keycloak on any-other machine in a different environment, update the inventory file and/or targets and/or vars correspondingly

## Setting up KeyCloak manually

* Download and Install JDK 18, as instructed [here](https://www.itzgeek.com/how-tos/linux/ubuntu-how-tos/how-to-install-java-jdk-on-ubuntu.html)
* Download and install keycloak 21 `https://github.com/keycloak/keycloak/releases/download/21.0.2/keycloak-21.0.2.zip` preferrably in `/opt/keycloak-21.0.2/` folder.
* Install Postgres 12 (unless you have a Postgres server running already which can be reused for Keycloak). You may use the instructions [here](https://www.itzgeek.com/post/how-to-install-postgresql-on-ubuntu-20-04/)
* Create a user and database in the Postgres server

```pgsql
create user keycloak with password 'password';
create database keycloak;
GRANT ALL PRIVILEGES ON database keycloak TO keycloak;
```

* Configure keycloak to work with Postgres\
  `bin/kc.sh build --db postgres`

#### Create a certificate, pem file, to run keycloak on TLS

This is recommended even if you are will be putting Nginx or Apache as a reverse proxy. We do not recommend SSL termination - as that will means an unencrypted password in the internal network visible to production support engineers.

* Option 1: Commands for self-generated keys and certificates are given below. You should decide whether self-generated keys and certificate is the right option for you.

```shell
openssl req -newkey rsa:2048 -nodes -keyout domain.key -out domain.csr
openssl x509 -signkey domain.key -in domain.csr -req -days 365 -out domain.crt
```

* Option 2: Commands to generate keys and certificates using Certbot 

```shell
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo apt install net-tools
sudo certbot certonly --standalone -d keycloak-staging.avniproject.org --staple-ocsp -m <user_email> --agree-tos
mkdir -p ${HOME}/.keycloak/certs
cd 
sudo cp /etc/letsencrypt/live/keycloak-staging.avniproject.org/fullchain.pem ${HOME}/.keycloak/certs/public.crt
sudo cp /etc/letsencrypt/live/keycloak-staging.avniproject.org/privkey.pem ${HOME}/.keycloak/certs/private.key
sudo chown ubuntu:ubuntu ${HOME}/.keycloak/certs/public.crt
sudo chown ubuntu:ubuntu ${HOME}/.keycloak/certs/private.key
```

* A [basic starter realm](https://raw.githubusercontent.com/avniproject/infra/master/integration/configure/roles/keycloak/files/starter-realm.json) can be imported into keycloak by using `bin/kc.sh import --file=basic_realm.json`. Note the server must be stopped. The realm which we will use is called On-premise (not master). You can change the name of the realm before/after import too - the name is configurable.
* Each Avni user's authentication details are present in Keycloak, whereas application-specific details are in the Avni database. To ensure consistency and linking of a user entity across these two databases all user modification/creation calls are routed through the Avni server. In order to do this, the Avni server needs client access to Keycloak's realm. This client's name is admin-api, you should be able to find it in the Clients tab. Since in the above step you have imported a common realm file, you must regenerate the client secret. For this, open the admin-api client go to the credentials tab, and then `Regenerate Secret`. This secret value will be provided to the avni-server as described below.
* If you are running keycloak such that you cannot log in via browser from localhost as admin, then you can set two environment variables for first-time access. You should choose a strong password. Also, set KEYCLOAK\_HOME to point to the Keycloak installation directory.\
  Add below lines to /etc/environment file:

```shell
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=<strong-password>
KEYCLOAK_HOME=/opt/keycloak-21.0.2/
```

* Logout user and log back in 

### Configure Web-origins

In keycloak, "clients" tab, edit the "avni-client" client, and set the Settings "Web origins" to the Host Avni-server url.

### Optional Configurations

#### Track Events

In order to show the last login time in the webapp, keycloak events need to be enabled and can be done via keycloak admin at `Realm -> Realm Settings -> Events -> User events settings / Admin events settings`. Also, ensure that one of the roles associated with the`admin-api` client has the `view-events` associated role configured.

#### Password Policy

Password policy can be setup at `Realm -> Authentication -> Policies -> Password Policy`

#### Security Defenses

Security defenses including brute force detection can be configured at `Realm -> Realm Settings -> Security defenses`

### Start keycloak

* Option 1: with configuration passed as CLI parameters:\
  `bin/kc.sh start --hostname-strict=false --db-url-host localhost --db-username keycloak --db-password password --https-certificate-file=./domain.crt --https-certificate-key-file=./domain.key`
* Option 2: with configurations specified in keycloak conf file `conf/keycloak.conf`:\
   `nohup $KEYCLOAK_HOME/bin/kc.sh start &`\
  Find more details [here](https://www.keycloak.org/server/configuration).

## Setup Super Admin User

Assuming that you have started avni-server after deployment at least once, you should have an `admin` user in your database who doesn't belong to any organization and is a super admin. Before you use the web app to log in as this user and create other organizations and users - this first user needs to be added to keycloak.

In Keycloak you can add a user in the same realm (not master). For this user please note the following:

* In server database,
  * create user in users table - set `disabled_in_cognito` to true.
  * Create an entry for the user created above in `account_admin` table.
* In keycloak,
  * User is enabled
  * Email is marked as verified
  * Add a custom attribute called `custom:userUUID` and in the value provide the UUID value from the Avni database for the `admin` user (present in the `users` table).

## Create Org User

In Organisations with Keycloak as the IDP, you need to be logged in as Keycloak Super Admin in-order to create the users. Or, if an org user with admin privileges already exists, use the same to create / update users in that organisation.

## Setup Avni Server to use Keycloak

Avni server by default uses Cognito, hence you need to set up the following environment variables to make it work with Keycloak.

```shell
export OPENCHS_KEYCLOAK_CLIENT_SECRET=dsfhdfdsfh323
export OPENCHS_KEYCLOAK_SERVER=https://keycloak.example.com
export OPENCHS_KEYCLOAK_ENABLED=true
export AVNI_IDP_TYPE=keyclaok
```

For local setups, setting `OPENCHS_KEYCLOAK_SERVER` to `http://localhost:8080 `will not work as react-native in dev mode will not be able to connect to it. Ensure to provide an FQDN or an IP to the keycloak instance being used.

### Test

Launch the avni web app and you must be able to log in using the `admin` user and create organization etc.

### A few more notes

Even though you are not using Cognito you may see the field `disabledInCognito` in Keycloak user attributes and in the REST API contract exchanged between the avni web app and the avni server.

# Minio

## Automated setup of MinIO using Ansible

We have ansible playbook to automate setup of MinIO for staging environment. This could be modified to suit changes in credentials, users, buckets, access and Minio-setup type (Cluster Vs Single Node), etc..

* On your machine, clone [avni-infra](https://github.com/avniproject/avni-infra) repository and install ansible and other dependencies required
* Navigate to "configure" folder with-in the repository and trigger following "make" command with credential values as args:
  ```
  minio_root_user=\<root_user> minio_root_password=\<root_pwd> minio_upload_user=\<upload_user> minio_upload_password=\<upload_pwd> **make minio-staging**
  ```
* Above command internally invokes following ansible playbook command:
  ```
  MINIO_ROOT_USER=$(minio_root_user) MINIO_ROOT_PASSWORD=$(minio_root_password) MINIO_UPLOAD_USER=$(minio_upload_user) MINIO_UPLOAD_PASSWORD=$(minio_upload_password) ansible-playbook staging_minio_servers.yml -i inventory/staging
  ```
* For setting up MinIO on any-other machine in a different environment, update the inventory file and/or targets and/or vars correspondingly

## Setting up MinIO server manually

Refer MinIO Quickstart guide to setup the MinIO server on Ubuntu Machine - [https://docs.min.io/docs/minio-quickstart-guide.html](https://docs.min.io/docs/minio-quickstart-guide.html)

* Generate and apply SSL certificates to the MinIO server - [https://docs.min.io/docs/generate-let-s-encypt-certificate-using-concert-for-minio](https://docs.min.io/docs/generate-let-s-encypt-certificate-using-concert-for-minio)
* Install certbot using snap

```shell
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo apt install net-tools
```

* Generate SSL certificates\
  `sudo certbot certonly --standalone -d minio-staging.avniproject.org --staple-ocsp -m <user_email> --agree-tos`
* Ensure that you configure Minio to have "ap-south-1" as the Region.
* Configure Minio server to use the SSL certificates

```shell
sudo cp /etc/letsencrypt/live/minio-staging.avniproject.org/fullchain.pem ${HOME}/.minio/certs/public.crt
sudo cp /etc/letsencrypt/live/minio-staging.avniproject.org/privkey.pem ${HOME}/.minio/certs/private.key
sudo chown ubuntu:ubuntu ${HOME}/.minio/certs/public.crt
sudo chown ubuntu:ubuntu ${HOME}/.minio/certs/private.key
sudo setcap 'cap_net_bind_service=+ep' ./minio
```

* You also need to set two environment variables for Minio web console app to correctly redirect to server.\
  Add below lines to /etc/environment file and logout and login back to the machine.

```shell
MINIO_BROWSER_REDIRECT_URL="https://minio-staging.avniproject.org"
MINIO_SERVER_URL="https://minio-staging.avniproject.org:442"
```

* Start minio server as a background process\
  `cd ~/minio`\
  `nohup ./minio server ./data --address ":442" --console-address ":443" >> /var/log/minio/minio.log 2>&1 &`

## Setup Avni Server to use Minio

Avni server by default uses local storage in "dev" environment and AWS S3 in Production and Staging environments, therefore you would need to set up the following environment variables to make it work with Minio.

## Configure the organisations to use Keycloak as IDP and Minio for Storage

Configure Organisations to use Keycloak and Minio as IDP and Storage service systems.

```Text SQL
UPDATE public.organisation_config SET settings = '{"languages": ["en"], "useKeycloakAsIDP":  true, "useMinioForStorage": true }' WHERE id in (org_ids);
```

### To ensure it works with Minio, set the following properties in application.properties:

```
avni.bucketName=${OPENCHSBUCKET_NAME:dummy}  
minio.url=${OPENCHS_MINIO_URL:<http://.*minio.*:9000}>  
minio.accessKey=${OPENCHS_MINIO_ACCESS_KEY:dummy}  
minio.secretAccessKey=${OPENCHS_MINIO_SECRET_ACCESS_KEY:dummy}  
avni.connectToS3InDev=true  
minio.s3.enable=true
```

### Important Note: Please ensure that the "minio.url" property has a value with the word "minio" in it. This is required for satisfying SDK requirements for connecting to Minio.

If setting up minio on local (localhost:9000, etc..), then please add a /etc/hostname file entry to map the minio ip and port to a hostname value with the word "minio". Specify that hostname as value for "minio.url".

# Avni Native components deploy

## Automated setup of Avni-server and Avni-webapp using Ansible

We have ansible playbook "avni\_appserver" to automate setup of avni-server for on-premise environment. This could be modified to suit change in target servers, configurations and credentials as per requirement.

Download an avni-server jar file to be used for deployment

* You can download it by replacing the build number in the [https://circleci.com/gh/avniproject/avni-server/](https://circleci.com/gh/avniproject/avni-server/)\<server\_build\_number>#artifacts by the build server number you got from release info page.

Ex: \~/artifacts/avni-server-0.0.1-SNAPSHOT.jar

Download a avni-webapp tar file to be used for deployment

* You can download it by replacing the build number in the [https://circleci.com/gh/avniproject/avni-webapp/](https://circleci.com/gh/avniproject/avni-webapp/)\<server\_build\_number>#artifacts by the build server number you got from release info page.

Ex: \~/artifacts/avni-webapp.tgz

Navigate to "configure" folder with-in the "avni-infra" repository and trigger following "make" command with credential values as args:

```Text Deploy Avni-server and Avni-webapp
web_zip_path=~/<path>/ app_zip_path=~/<path>/ make avni-onpremise VAULT_PASSWORD_FILE=~/config/infra-pwd-file  
```

Above command internally invokes following ansible playbook command:

```
WEBAPP_ZIP_PATH=$(web_zip_path) WEBAPP_ZIP_FILE_NAME=avni-webapp.tgz APPLICATION_ZIP_PATH=$(app_zip_path) APPLICATION_ZIP_FILE_NAME=avni-server-0.0.1-SNAPSHOT.jar ansible-playbook onpremise_avni_servers.yml -i inventory/onpremise  --vault-password-file ${VAULT_PASSWORD_FILE}
```

## Automated setup of Rules-server using Ansible

We have ansible playbook "rules\_server" to automate setup of avni-server for on-premise environment. 

Download a rules-server zip file to be used for deployment

* You can download it by replacing the build number in the [https://circleci.com/gh/avniproject/rules-server/](https://circleci.com/gh/avniproject/rules-server/)\<server\_build\_number>#artifacts by the build server number you got from release info page.

Ex: \~/artifacts/rules-server.tgz

Navigate to "configure" folder with-in the "avni-infra" repository and trigger following "make" command with credential values as args:

```Text Deploy Rules-server
app_zip_path=~/<path>/ make rules-server-onpremise VAULT_PASSWORD_FILE=~/config/infra-pwd-file  
```

Above command internally invokes following ansible playbook command:

```
APPLICATION_ZIP_PATH=$(app_zip_path) APPLICATION_ZIP_FILE_NAME=rules-server.tgz ansible-playbook onpremise_rules_server.yml -i inventory/onpremise  --vault-password-file ${VAULT_PASSWORD_FILE}
```

## Create a flavour of Avni-client for your avni-server instance

Please refer [this](https://avni.readme.io/docs/flavouring-avni#steps-to-create-a-new-flavor-in-client) document on steps to create your own flavour of Avni APK.
### Play Store Tracks

Please use the links below to join and leave the tracks.

## Open Testing

Testers can join Avni Open testing Track:

Google Play on Android : [https://play.google.com/store/apps/details?id=com.openchsclient](https://play.google.com/store/apps/details?id=com.openchsclient)

This should open the play store with the Avni app listed. Use the 'Join the beta' section to join the open testing track.

Google Play on the web : [https://play.google.com/apps/testing/com.openchsclient](https://play.google.com/apps/testing/com.openchsclient)

### For Avni Gramin

To join from Android phone, click [here](https://play.google.com/store/apps/details?id=com.openchsclient.gramin)  and use the 'Join the beta' section to join the open testing track.

To join from Web, click [here](https://play.google.com/apps/testing/com.openchsclient.gramin) 

## Internal testing

**LFE - Internal Testing Track**     --  [https://play.google.com/apps/internaltest/4701004405305691863](https://play.google.com/apps/internaltest/4701004405305691863)

**Avni Main - Internal Testing Track**   -- [https://play.google.com/apps/internaltest/4698826196687720015](https://play.google.com/apps/internaltest/4698826196687720015)
### Using Test Environment Dump Locally

**This facility is available only for the core team members.**

## Take dump

### From IntelliJ choose the database and from pop-up menu choose "Export pg\_dump".

<Image align="center" className="border" border={true} src="https://files.readme.io/42ab63c-Screenshot_2023-07-19_at_2.30.41_PM.png" />

### In Statements choose Copy instead of insert (applying the dump later is faster). Note down the location of the dump.

![](https://files.readme.io/ccb692c-image.png)

## Apply dump.

In avni-server and integration-service there are makefile commands in the file externalDB.mk to restore the dump. In avni-server there is also a command to enable a db user for an implementation organisation.
### Advanced Configuration

### Blacklisting of URLs

You can set the `AVNI_BLACKLISTED_URLS_FILE` environment variable to the JSON file location from the working directory of `avni-server`. The [ant pattern](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/util/AntPathMatcher.html) is used to match the request path and if the path is present then the response will be rejected with 403 HTTP status. The JSON file should have an array of strings - each representing a path pattern.

This file is read at the startup. If a file is specified and there is problem with the file then server wouldn't start.
### Avni Repositories

### Runs in production; For platform features

* [https://github.com/avniproject/avni-server](https://github.com/avniproject/avni-server)
* [https://github.com/avniproject/avni-client](https://github.com/avniproject/avni-client)
* [https://github.com/avniproject/avni-webapp](https://github.com/avniproject/avni-webapp)
* [https://github.com/avniproject/avni-models](https://github.com/avniproject/avni-models)
* [https://github.com/avniproject/avni-etl](https://github.com/avniproject/avni-etl)
* [https://github.com/avniproject/avni-media](https://github.com/avniproject/avni-media)
* [https://github.com/avniproject/rules-server](https://github.com/avniproject/rules-server)
* [https://github.com/avniproject/rules-config](https://github.com/avniproject/rules-config)
* [https://github.com/avniproject/avni-health-modules](https://github.com/avniproject/avni-health-modules)

### Runs in production; Implementation specific

* [https://github.com/avniproject/integration-service](https://github.com/avniproject/integration-service)
* [https://github.com/avniproject/integration-admin-app](https://github.com/avniproject/integration-admin-app)

### Deployer

* [https://github.com/avniproject/avni-infra](https://github.com/avniproject/avni-infra)
* [https://github.com/avniproject/openchs-package](https://github.com/avniproject/openchs-package) (deprecated)
### Index

Avni is required to be set up for various purposes - full-stack product developer, front end developer, testers and production users. Avni can be set up on - mac, windows, ubuntu and centos. Overtime Avni will incrementally provide setup documentation for all these combinations, but currently, the following documentation is available, based on most frequent need seen by us.

### Deployment Diagram

<Image title="Avni (2).png" alt={1038} align="center" src="https://files.readme.io/7fb05b2-Avni_2.png">
  Avni technical components
</Image>

Avni is composed of multiple components connected to each other. Following are a few important points about the deployment diagram.

* Any data analytics solution can be used with Avni, by connecting directly with the database. We have used Metabase and Jasper Reports so far.
* Avni currently uses AWS Cognito service where the users are stored. The management of users happens via the Avni Web Application.
* Avni is developed using ReactNative hence easily portable to iOS app, but currently there is no iOS build generated.
* AWS S3 is required only if you are capturing photos and videos from the field-app or data entry web-app. Avni will work, without errors, if you do not use them.

<hr/>
<br/>

# Local Development Environment Setup (for Avni Product)

[Environment setup for product development - Ubuntu](doc:developer-environment-setup-ubuntu)\
[Environment setup for front end product development - Ubuntu](doc:environment-setup-for-front-end-product-development-ubuntu)

# Production/Test Environment Setup

[Test and production environment setup - CentOS](doc:test-and-production-environment-setup-centos)

# Build information

[Build numbers](doc:build-numbers)

<br/>
## Contribute To Avni

### Development Process

The Development process is slightly different between Core Developers and External Contributors. 

Core Developers are those who work on Avni full-time. They work as a team towards goals stated on the [roadmap](https://github.com/orgs/avniproject/projects/2/views/7) and have full commit access to the repositories. They also work towards predefined deadlines. 

External Contributors usually work on items that they are interested in fixing. There are no timeline expectations for external contributors, but there are code quality requirements. The process for both these groups are mentioned below. 

### Core Developers

* Cards are maintained on the [Project](https://github.com/orgs/avniproject/projects/2) wall
* Developers pick up work from the "Ready" lane for the current release (or past releases if there are any bugs)
* For non-bugs, an estimate is required on the card. This helps us understand a crude average team velocity and helps us plan releases better
* Ensure that commits go to the release branch marked on the card. See [Release Naming and Branching](branching-strategy)section to see more details on the branching strategy
* Follow the Coding Standards and the [Commit Guidelines](commit-guidelines)
* Cards are moved to the "In Progress" lane and assigned to self when development is underway. 
* Once development is complete, ensure CI works, deploy to the correct environment (if not auto deployed) and move the card to "Code Review Ready"
* Current release deployments happen on the staging environment, while minor releases or patch releases are deployed on prerelease before release to production
* Code Review - Any developer who is free picks up cards in "Code Review Ready". Comments that need to be fixed are mentioned on the card and the card moved to "Code Review w/comments". Comments that do not require stopping of card movement are mentioned in the commit as comments. If everything is fine, they are moved to "QA Ready". Any developer can pick up cards to review. The only condition is that they should not have worked on the card
* QAs pick up cards from the QA Ready lane to "In QA". Failed cards go to "QA Failed" from where developers can pick up and address issues. Otherwise they are moved to "Done"
* Around once a month, when the priorities of the release are complete, code is branched out and a release candidate is built. This goes to the "prerelease environment" 
* A bug-bash is conducted where everyone is invited and can try out the new release
* Conducting the bug bash is a signal for the development and implementation teams that the release is complete, and only release regressions will be taken care for this release
* Avni implementers look at the release and test out a few implementations to certify it ready to deploy to the Avni cloud.
* Any bugs found during the bug bash are addressed before the release is finally performed on production. Release process is mentioned [here](doc:pre-release-testing). 

### External Contributors

* Ensure there is an issue in the right repository that describes your issue. If there is none, then create one

![](https://files.readme.io/9acb2d0-image.png)

* Try to avoid picking up cards that are marked for an active release. Core Contributors already have this as their focus, we do not want to duplicate work. You can look at the [roadmap](https://github.com/orgs/avniproject/projects/2/views/7) to identify the current active release(s). The project release will be marked on the card
* Clone the repository that you want to work on
* Follow the General Coding and [Commit guidelines](commit-guidelines)
* Raise a pull request to the main branch once you are done with changes. This will be either the `master` or `main` branch depending on the repository
* A core contributor will review changes and merge them to the codebase. If there are any review comments, work on them and raise the pull request again once you are done
* Once the merge is complete, the issue is marked for the current release and released. If you wish this to be backported to an earlier release, mention this either in the PR or on the issue. Backporting happens to only one major release backwards from the current release at this point.
### Branching Strategy

Starting June 2023, Avni is going to follow the following release naming strategy. The release has three parts - the major version, minor version and the patch fix version. Note that this is not semantic versioning. 

Release Versioning Format: MajorVersionNumber.MinorVersionNumber.PatchVersionNumber.

1. A major release happens every 4-6 weeks. The major version is bumped up during this time. eg: 4.0.0
2. There might be a minor release between two major releases that consists of planned work that might need to be released sooner. This goes in a minor release. eg: 4.1.0
3. Urgent patches go in a patch fix release. eg: 4.0.1

### Branches

<Image align="center" src="https://files.readme.io/701267ec2f229cac03b6f1996472488fb8e37ea9bba2e4ff669aca89d50a4ed2-7d3d36e-branching.png" />

Every branch comes out of the previous parent (4.1.0 comes out of 4.0.0, 5.0.0 comes out of main / master). Branches are merged to their parents, which eventually go up till the mainline (master/main).

### Release branching guidelines

1. Patch version use the corresponding major / minor version branch itself and **not** a separate branch\
   Ex: For 4.0.1, we'll use 4.0 release branch itself
2. Minor version has its own branch, created from previous major/ minor release branch\
   Ex: for 4.1.0, we'll create a new branch 4.1 from 4.0
3. Merge happens from release major / minor branch to all pending Major / minor release branches, as well as to Master/Main branch\
   Ex: During 4.1 release, We'll merge 4.1 to 4.2, 5.0 and Master/Main branches
4. During release create tag with format vMajor.Minor.Patch version in release branch across all repos\
   Ex: For 4.1.0 release, create tag v4.1.0 on all repos, 4.1 branch **head** commit
5. To trigger different Flavor(Gramin) APK generation for an old Patch version in avni-client which already has additional patch versions, you should make use of a separate branch that would only used for APK generation purpose.\
   Ex: For 4.0.1 Patch release, if there is already 4.0.2 release completed, since all changes are on 4.0 branch, create a new branch "apk\_401" from tag v4.0.1 and use "apk\_401" branch for Gramin APK generation.
### Commit Guidelines

* Every commit needs an issue on Github
* There are times where an issue is not very important (minor dev only fixes such as Makefile changes etc). These will be marked as issue number 0. 
* Commit format is `#<issueNumber> | <commitMessage>`. If the issue is in a different repository for some reason, then it is marked appropriately with a message like this - `avniproject/<repo>#issueNumber | <commitMessage>`. eg: `#123 | Fix missing semicolon`, `avniproject/avni-client#123 | Fix missing semicolon`
* Make the first line of the commit concise. If you need to add more context, add a newline and put details there
* Have atomic commits that fix one issue at a time. If there is a lot of formatting changes, then make that a separate commit so it is easy to identify the core change
### Readme Guidelines

Things to remember when picking up cards to improvise [readme](https://avni.readme.io/docs/getting-started)

* Add the below sections (wherever applicable):
  * Intro/Overview/Definition
  * Use case
  * Example (professional and generic without revealing any client data):
    * How to configure
    * How it will display in mobile app
  * Nuances/Different options available
  * Dos and don'ts
* Add relevant GIFs/images/videos
* When adding readme for 'End users/analysts' make sure not to use technical phrases or define them where needed
### Avni Client Coding Guide

Avni client is developed using ReactNative, NativeBase, RealmJS, and Redux. Some of the core concepts for these frameworks and libraries are:

* [ReactNative Basics](https://reactnative.dev/docs/0.65/getting-started) 
* [React main concepts](https://reactjs.org/docs/hello-world.html) be also useful
* Official documentation of RealmJS, NativeBase, and [Redux](https://devdocs.io/redux~3-basics/).

The main building blocks of Avni Client are as follows:

### Views and components

There is one view component class for each screen in the mobile app. These use other reusable components.

Views **get all** their data (state) by dispatching actions that return the state for the view or via the props. Views must not call the service to get data. Typically each view is backed by one redux action function collection (or file). Views should not call services to save data directly. Note that when services are called in render it can lead to performance degradation of the UI as it bypasses the differential UI update based on the state provided by React.

The data used by view can be avni model classes or state objects. Avni models provide business methods where domain logic can be written. The state should have transient data meant for UI, workflows, etc.

Redux dispatches are synchronous calls by themselves.

For long-running redux actions, setTimeout should be used when calling redux actions.

Avoid defining anonymous functions which are more than 2-3 lines in the render method. Define these functions at the class level and then make an anonymous function to call this function. If large functions are defined in render then the function definition is created on every render.

When navigating to a view using the navigator, pass minimal information via query params. The view to which navigation is happening can load the rest of the information from the database. This ensures minimal contract and coupling. e.g. instead of passing programEnrolmentUuid and individualUuid both just pass the former. Also, pass ids instead of objects. e.g. in the previous example do not pass the program enrolment object as ID is sufficient.

### Redux Actions (or Reducers)

Redux actions call services to interact that interacts with the database or to make server calls. Since avni-client is an offline application server calls are made in very few places. SyncService primarily handles server interaction.

Each Redux action has a single top-level state object passed onto the views after mutating.

Realm DB calls are synchronous.

Redux actions call clones in several places. One should be careful about making very deep/large clones as that may affect the performance. Such clones can happen when cloning models. e.g. a deep clone of an individual can end up cloning a very large number of entities - technically the entire database as individuals can be connected to other individuals.

### Services

Services are responsible for the interaction with the database, making server calls, and other IO calls. The service can/should use other services. (Services plus Repository as in DDD).\
Services also manage database transaction boundaries.

Services must not dispatch any action to redux.

### Avni Models

Avni models are objects mapped to the realm database (Entities as in DDD).

### State

Actions call services to fetch data and are responsible for constructing a new state to be returned to the view. Sometimes actions do make use of State classes that encapsulate state manipulation logic specific to one action/view. State classes also make it easy to write unit tests without mocking/stubbing services - that would be required if actions need to be tested.
### Avni Web App Coding Guidelines

(not a complete doc yet)

In functional components try to avoid (**this is not a strict requirement**) creating functions in the body, as these functions get redefined with every state change. There are the following options:

* Use *useCallback* to define memoized functions (note that even these get redefined based on the state change)
* define the function outside the functional component in the same file and pass all the required parameters which may be too many
* create class type component
### Avni Server Coding Guidelines

## Building blocks

Controller, Service, Entity, Value Object, Repository, Contract Object (request/response). These are pretty much as they have been described in [domain driven design](https://matfrs2.github.io/RS2/predavanja/literatura/Avram%20A,%20Marinescu%20F.%20-%20Domain%20Driven%20Design%20Quickly.pdf).

### Transaction Management

@Transaction attribute of spring should be used only on the controller and not on services. This is because for us each controller method makes the scope of one transaction.

For the background (spring batch jobs) jobs where the controller has not invoked the scope of the transaction should be discussed. A very large job should be broken up into smaller transactions and the job should be designed to be idempotent. These transactions can be controlled via a worker layer which is currently not formalized in the Avni server code.

### Entity Lifecycle

In Avni most entities are synchronised to the client, hence their lifecycle must be maintained by the server when it modifies it. The scenario where one needs to be careful about this is when an entity has child entities. Simplest way to manage child entities is to clear previous list in the parent and add the edited ones. This results in new set of child entities being created with new ID and previous ones are deleted. While from data standpoint there is no change - but this will create problem with avni-client local database. When the next sync happens the previous entities will remain and new ones will get added - to the mobile database.

Hence following needs to be done:

* The web app where editing of these entities happen, must always use the UUID or id of each entity it is changing (parent, child, all). It must communicate with the server with these ids.
* The one-to-many mappings on the server, uses Set and we have id based equality on entities (not uuid). On the server one must load the entity from the database and then modified it found or create new.
* For saving the on the server, hibernate maintains cascade from the parent to child - hence one needs to call save only on the parent and not on the child.
### Reporting Issues

All work in Avni happens through Github issues, so if you discover a problem in Avni, please add an issue in the relevant repository. 

### Points to note when raising issues

1. If you know the repository the bug needs to be raised, please raise in that repository. Here is a list of repositories and the link to the issues section

| Application                               | Issue Link                                                                              |
| :---------------------------------------- | :-------------------------------------------------------------------------------------- |
| Avni Server                               | [github.com/avniproject/avni-server/issues](github.com/avniproject/avni-server/issues)  |
| ETL                                       | [github.com/avniproject/avni-etl/issues](github.com/avniproject/avni-server/issues)     |
| Media Viewer                              | [github.com/avniproject/avni-media/issues](github.com/avniproject/avni-server/issues)   |
| Web Application (other than Media Viewer) | [github.com/avniproject/avni-webapp/issues](github.com/avniproject/avni-server/issues)  |
| Android field app                         | [github.com/avniproject/avni-client/issues](github.com/avniproject/avni-server/issues)  |
| Multiple/not sure                         | [github.com/avniproject/avni-product/issues](github.com/avniproject/avni-server/issues) |

2. If the issue affects an end-user of the application, mark the label "user-reported". 
3. If you believe the issue is a bug, then add the label "bug"
4. When reporting a product issue, try to help the developer understand how the issue can be replicated with minimum effort. For example, create a new organisation where you can isolate the issue to its bare minimum. Alternatively, provide steps to reproduce the issue in a clear manner. This helps save a lot of developer time, and cuts down the number of communication hops to understand the issue. 

Once issues are reported, they get triaged and assigned a release. The list of releases and their expected go-live dates are available on the [Roadmap](https://github.com/orgs/avniproject/projects/2/views/7). The [Avni Development Process]\(Avni Development Process)provides a peek into how issues get sorted and move through to be fixed in the product.
### Index

This section lays down guidelines for the Avni code contribution process.
## Release Guide

### Release Process For The Cloud

## Avni release process

### What is the current deployed release?

The current release on production can be identified through the following mechanisms

1. The latest [release notes](https://github.com/avniproject/avni-product/releases/) on avni-product
2. The latest release blog on the [Avni blog](https://avniproject.org/blog/)

### What is the release we are working on?

Releases are marked "Active" on the [Roadmap](https://github.com/orgs/avniproject/projects/2/views/7)

### Release numbering

All versions of below specified end-deployables are marked with a release number that corresponds to the release on the project board, whether they are deployed or not. This makes it easier to understand the right version of the production. For the release, we also mark avni-product with the same release number and provide combined release notes there.

* avni-server
* avni-webapp
* avni-client
* avni-models
* avni-etl
* avni-media
* avni-product
* rules-server
* integration-service
* integration-admin-app

Other smaller packages such as avni-models and rules-config have their own release cycles that do not correspond to anything. We use semantic versioning for these packages.

Any changes if required in avni-infra are done directly on the master branch, the deployment pipeline uses it.

### Overview

We have `make` commands in the [makefile](https://github.com/avniproject/avni-product/blob/master/Makefile) that help with releases and ensure that you haven't missed merging ancestors in the release branch and release branch in master.

### Release Steps

### 1. Update Release Configuration

For example, if you are working on releasing 16.3:

* First, update `src/code.ts` in avni-product [here](https://github.com/avniproject/avni-product/blob/master/src/code.ts)  to include the latest release

### 2. Create Remote Branches

`make create-all-remote-branches-from-mainline`

This will create branches on repos where branches did not exist (because no changes were done in those repos).

We still create those branches and release them to maintain consistency across all repositories. This makes it easier to understand the correct version in production as mentioned before.

### 3. Verify All Branches Exist

`make all-branches-exist`

Run this as a precautionary measure to reconfirm all branches exist.

### 4. Check Merge Status

`make branch-merge-test`

This will tell you what merges are done and what haven't been completed. For example:

* 15.1 is merged into 15.2
* 15.2 is not merged into 15.3
* master is not merged into 15.3

### 5. Merge Branches

`make merge-branches projectName=repoName`

`repoName can be avni-client for example.`

This will go branch by branch asking you to merge or not (y/n). Ideally, it should not ask for branches that are already merged (we can update/fix this later). Since you already know which ones are not merged from  
`make branch-merge-test`, just type 'y' for the ones that need to be merged.

**Note on Conflicts:**

* If there are any conflicts, you will need to manually fix them
* It will specify if their are conflicts
* At the end, it will say "merge complete/done" although there were conflicts  
  (we plan to improve this UX/messaging in future)
* Once conflicts are resolved, push changes manually

### 6. Tag Repositories

Once all merging is complete, execute:

`make tag-all-repos-with-release-version releaseBranch=15.3 releaseTag=v15.3.0`

**Important:** The release tag should be prefixed with 'v' to avoid branch and tag confusion conflicts in git.

### 7. Create GitHub Release

* Go to [https://github.com/avniproject/avni-product/releases](https://github.com/avniproject/avni-product/releases)
* Create a new release
* Specify all the changes that are part of this release

#### 7.1. Find Related GitHub Issues

You can find all GitHub issue cards part of this release by executing:

```shell
gh project item-list -L 3000 --owner avniproject --format json 2 | jq -c '.items[] | select (.release == "<Specify release number, ex:5.1.0>") | [ .title, .content.url]'
```

**Important:** The release number must be suffixed with `.0`. For example:

* ❌ Wrong: `16.3`
* ✅ Correct: `16.3.0`

### 8. Backup Latest PROD DB snapshot for long term use

* Find the Latest System Snapshot for Avni PROD DB RDS, and invoke "Copy snapshot" action on it. Name the snapshot "bkp-$\{Source snapshot name}". Ex: bkp-proddb02-2024-02-13-23-12

## Perform Deploys

### 1. avni-server

* Find the passing circle-ci job for the tag. If the job was triggered more than a week ago, retrigger a fresh build from circleci after selecting the repo and the branch so that the artifacts from the build step are available in the deploy steps.
* Check if there are any running Background jobs on Prod and if needed wait for them to complete
* ```sql Commands to show status of Started and Pending Background jobs that were triggered today
  select users.username, jobs.*
  from (select bje.job_execution_id                                                                                execution_id,
               bje.status                                                                                          status,
               bje.exit_code                                                                                       exit_code,
               bji.job_name                                                                                        "Type of Job",
               bje.create_time                                                                                     create_time,
               bje.start_time                                                                                      start_time,
               bje.end_time                                                                                        end_time,
               string_agg(case when bjep.parameter_name = 'uuid' then bjep.parameter_value else '' end::text, '')  uuid,
               string_agg(case when bjep.parameter_name = 'fileName' then bjep.parameter_value else '' end::text,
                          '')                                                                                      fileName,
               sum(case
                       when bjep.parameter_name = 'noOfLines' then CAST(nullif(bjep.parameter_value, '') AS integer)
                       else 0 end)                                                                                 noOfLines,
               string_agg(case when bjep.parameter_name = 's3Key' then bjep.parameter_value else '' end::text, '') s3Key,
               sum(case
                       when bjep.parameter_name = 'userId' then CAST(nullif(bjep.parameter_value, '') AS integer)
                       else 0 end)                                                                                 userId,
               string_agg(case when bjep.parameter_name = 'type' then bjep.parameter_value::text else '' end::text,
                          '')                                                                                      job_type,
               max(case
                       when bjep.parameter_name = 'startDate' then CAST(nullif(bjep.parameter_value, '') AS timestamp)
                       else null::timestamp end::timestamp)                                                        startDate,
               max(case
                       when bjep.parameter_name = 'endDate' then CAST(nullif(bjep.parameter_value, '') AS timestamp)
                       else null::timestamp end::timestamp)                                                        endDate,
               string_agg(case
                              when bjep.parameter_name = 'subjectTypeUUID' then bjep.parameter_value::text
                              else '' end::text,
                          '')                                                                                      subjectTypeUUID,
               string_agg(case when bjep.parameter_name = 'programUUID' then bjep.parameter_value::text else '' end::text,
                          '')                                                                                      programUUID,
               string_agg(
                       case
                           when bjep.parameter_name = 'encounterTypeUUID' then bjep.parameter_value::text
                           else '' end::text,
                       '')                                                                                         encounterTypeUUID,
               string_agg(case when bjep.parameter_name = 'reportType' then bjep.parameter_value::text else '' end::text,
                          '')                                                                                      reportType,
               max(bse.read_count)                                                                                 read_count,
               max(bse.write_count)                                                                                write_count,
               max(bse.write_skip_count)                                                                      write_skip_count
        from batch_job_execution bje
                 left outer join batch_job_execution_params bjep on bje.job_execution_id = bjep.job_execution_id
                 left outer join batch_step_execution bse on bje.job_execution_id = bse.job_execution_id
                 left join batch_job_instance bji on bji.job_instance_id = bje.job_instance_id
        group by bje.job_execution_id, bje.status, bje.exit_code, bje.create_time, bje.start_time, bje.end_time,
                 bji.job_name
        order by bje.create_time desc) jobs
           join users on users.id = jobs.userId
  where status in ('STARTING', 'STARTED')
    and create_time >= now()::date + interval '1m';
  ```
* Approve deployment to production

### 2. avni-webapp

* Find the passing circle-ci job for the release tag. If the job was triggered more than a week ago, retrigger a fresh build from circleci after selecting the repo and the branch so that the artifacts from the build step are available in the deploy steps.
* Approve deployment to production
* Deploy platform translations for all app flavors.

### 3. rules-server

* Find the passing circle-ci job for the tag.
* Approve deployment to production

### 4. avni-client

Binaries for avni-client can be generated on the local machine or via circleci(Preferred for Avni Production).  
Steps for both are mentioned below.

##### Local Machine Build

Make sure the following environment variables are set (values available in keeweb) for the flavors that are being built:

`<flavor>_KEYSTORE_PASSWORD`

`<flavor>_KEY_ALIAS`

`<flavor>_KEY_PASSWORD`

* For releasing all flavors:

```shell
## Create prod bundles
versionName=3.5.1 versionCode=30501 make release_prod_all_flavors

## Deploy platform translations
make deploy_platform_translations_live_for_all_flavors
```

* To release a particular flavor, say lfe:

```shell Shell
## Create prod bundle
versionName=3.5.1 versionCode=30501 make bundle_release_prod flavor='lfe'

## Deploy platform translations
make deploy_platform_translations_for_flavor_live flavor='lfe'
```

* To release security flavor, follow instructions specified [here](https://avni.readme.io/docs/release-process-for-security-testing)

##### CircleCI Build

* Go to [https://app.circleci.com/pipelines/github/avniproject/avni-client](https://app.circleci.com/pipelines/github/avniproject/avni-client)
* Select the branch that the release is being made from
* Click on the 'Trigger Pipeline' button. Note that Trigger can be done only on HEAD of a branch, if you need to build from one of the previous commits, then create a new branch and use that for build purposes. Merge it back to the parent after build.
* In the popup that is opened, add `flavor`, `versionCode` and `versionName` parameters. `flavor` by default is set to `generic` and can be skipped if generating the generic avni flavor.

<Image border={false} src="https://files.readme.io/ef90846-image.png" />

* Click on 'Trigger Pipeline' in the popup.
* Once the test and build jobs pass, approve the **hold_live** job.
* Trigger platform translation upload for live
  ```shell
  ## Deploy platform translations
  make deploy_platform_translations_for_flavor_live flavor='generic'
  ```
* Once the pipeline completes, AAB and APK files will be available in the artifacts for the release_android_live job. The AAB is meant for uploading to play store. APK can be used for manual testing if required.
  * For some reason the AAB downloaded is in `.zip` format. From terminal, do something like `mv avni.zip avni.aab` before uploading it to google play store.
  * OR, copy the download link for the AAB file and use terminal to download it via wget command (Ex: wget \<url>.aab), upload the same to google play store
* Open the [Google Play console](https://play.google.com/console)
* Open the Avni app and go to Release Menu -> Testing -> Open Testing
* Create a new Beta release and upload AAB generated
* Name the version and provide the release notes. Release notes can be empty.
* Send changes for review
  * On Open-testing track, to 100% of  users
  * On Prod track, partial rollout to 5% of Prod track users
* After we receive Playstore review approval and QA team gives "Go ahead" on performing Sanity testing of Prod APK, manually publish the changes
* Message in the common channel(both team members present) tagging the QA with release notes link, that release is out for sanity testing.
* Wait for 7 days for feedback from users. If none, then increase roll-out to 20% of the production user-base
* Wait for another 7 days(14 days from initial rollout) for feedback from users. If none, then increase roll-out to 100% of the production user-base

### Deployment of secondary applications

Avni secondary components are:

* etl
* integration-service
* integration-admin-app
* media-service(Server and client)

For each of the Avni secondary components listed above, repeat the following steps

1. Find the passing circle-ci job for the tag corresponding to the release
2. Approve deployment to production

Additionally, if there are any changes in Lambda scripts of Avni-media, deploy them to S3.

```c Shell
#> ./deploy-lambda-functions.sh <environment>; // Needs AWS CLI config to be done
```

## Post-deployment

* Message in the common channel(both team members present) tagging the QA with release notes link, that release is out for sanity testing.
* **Optional:** Create a blog on avni-website repository with details of the release. Make sure to include relevant documentation links and videos if necessary. This is meant for a non-technical user while the release notes on Github can be for developers and implementers
* Send brief information on
  * [avni@samanvayfoundation.org](mailto:avni@samanvayfoundation.org),  [avni-users@googlegroups.com](mailto:avni-users@googlegroups.com) (usually with the subject "Avni Release Announcement - release_number")
  * avni-community discord channel
  * avni-community whatsapp group
* If you are sending this communication for the first check past examples.
* Update release version in the [release tracker](https://docs.google.com/spreadsheets/d/1LcyE3_Ht_YztBjfPpedvjUtvzcJezP5dFOZFOyzWs2E/edit?usp=sharing)
### Pre Release Testing

## One time

* Create a new (permanent) user pool called pre-release
* Create users in the same pool for each implementation, with the right organization

## Prepare a new replicated environment

* Replicate production environment and create a temporary environment called pre-release. Following are the steps to do this:

1. Go to infra repo.
2. Update minor\_version file at the path "server/version/minor\_version" with the latest version that you need to deploy. You can get last successful version from "build" job of openchs-server workflow from CircleCI.
3. Run `make plan-prerelease-from-prod`.
4. Create prerelease environment using command `make create-prerelease-from-prod`.
5. Check prerelease server logs to make sure that server has started. 
6. Also make sure from the logs that all migrations have run successfully. 
7. **Warning**: If any migration is failing or taking too long make sure to fix the issue and please don't manually make the server skip a migration. Skipped migration will result in headache during the prod release. 

## Deployment

* Deploy new server build
* Deploy core metadata.
* Deploy all the implementations that you are going to deploy on Production. 
* **Warning**: If you miss out deploying any implementation then you lose the chance to catch errors that may come during prod release.

## Test existing app with existing implementations

* Build the version of the app corresponding to the one available on the play store on your machine or circle-ci pointing to pre-release.
* Use this app. Perform sync. Test the app.

## Test new app with existing/new implementations

* Update the app on the device you are testing
* Test the app for each implementation (Uninstall, Install, Login, Any other testing)
* Ensure that you have run the "Run Rules" if required during the testing for the new customer. 

## Finally

* You are good to go for production release if there are no issues.
* Stop/Destroy the pre-release environment
* Right now, the make task to stop/destroy pre-release env, in infra code base is not fully functional. So terminate EC2 and delete prerelease db from RDS. Be careful while doing it.
### Release Process For Security Testing

In-order to generate a secure apk used for security testing purposes, we currently have only 2 make commands that generate security compliant AAB or APKs. Before running below build commands, ensure the flavor is set correctly, or include flavor info while invoking them.\
Ex:- export flavor=lfeTeachNagalandSecurity

The 2 commands are:

* Universal APK
  * versionName=1.0.0 versionCode=1 make release\_prod\_universal
  * versionName=1.0.0 versionCode=1 make release\_prod\_universal\_without\_clean
* AAB
  * versionName=1.0.0 versionCode=1 make bundle\_release\_prod
  * versionName=1.0.0 versionCode=1 make bundle\_release\_prod\_without\_clean
## Api Guide

### Custom Query Api

Avni allows you to save the implementation-related queries in the `custom_query` table. 

### Points to note:

* Right now, there is no UI, and the implementer needs to insert the query manually into the DB.
* The query gets passed following additional parameters used to set Organisation context, which can be made use of, as per implementation team's requirement in the custom query. 
  * ORG\_ID =>"org\_id"
  * ORG\_DB\_USER => "org\_db\_user"
  * ORG\_SCHEMA\_NAME => "org\_schema\_name"
* Please note that the custom query is executed within the current organisation's db\_user's role context.. therefore, data access would be limited to only that within its organisation.

### Sample insert statement

```sql Adding new custom query
insert into custom_query (uuid, name, query, organisation_id, is_voided, version, created_by_id,
                          last_modified_by_id, created_date_time, last_modified_date_time)

values (uuid_generate_v4(),
        'Individual based on gender',
        'select concat(first_name, '' '', last_name) as "Full name",
               g.name as "Gender"
        from individual
                 join gender g on individual.gender_id = g.id
                 join organisation o on o.id = i.organisation_id
        where g.name = :gender
        and o.id = :org_id
        and registration_date = cast(:date as date)
        limit 100;',
        21,
        false,
        0,
        1,
        1,
        now(),
        now());
```

Once the query is saved in the DB one can fire the post request to `/executeQuery` endpoint with the request body

```json Sample request body
{
    "name": "Individual based on gender",
   "queryParams": {
       "gender": "Male",
       "date": "2020-01-01"
   }
}
```

Below is the output response

```json Response
{
    "headers": [
        "Full name",
        "Gender"
    ],
    "data": [
        [
            "Hetram  Kewat Kewat",
            "Male"
        ],
        [
            "Reesham Kumar Panika",
            "Male"
        ],
        [
            "Ambika Prasad Panika",
            "Male"
        ],
        [
            "Shiv Prasad Panika",
            "Male"
        ],
        [
            "Aman Kumar Panika",
            "Male"
        ],
        [
            "Chandan Prasad Panika",
            "Male"
        ],
        [
            "Suraj Kumar Panika",
            "Male"
        ],
        [
            "Birendra Kumar Panika",
            "Male"
        ],
        [
            "Naresh Prasad Panika",
            "Male"
        ]
    ],
    "total": 9
}
```

### Notes

1. Right now casts need to be handled in the query itself, for example in the above query casting of date param.
### Index

## About the API

Avni API is available at `/api` of your Avni server. Avni offers four resources - **subject**, **enrolment**, **programEncounter** and **encounter**. Currently, Avni supports the only authentication and pulling data. Other APIs will be added over time, but if you need them for your project please contact us.

*Please note that there are many rest endpoints in Avni which are used for communication between avni mobile field app and avni web app. These are not meant for integration with third-party applications/services because they have not been designed for that purpose and hence are not documented.*

If you are unfamiliar with Avni's **domain model** then read the following pages first, but in very short - *subject* is a top-level entity, *enrolments* and *encounters* are children of the *subject* and finally, *programEncounters* are children of *enrolment*.

1. [Terminology](doc:terms-and-their-definitions) 
2. [Implementer's concept guide - Introduction](doc:implementers-concept-guide-introduction) 

### Helpful Reference

1. Swagger documentation is available here:\
   [https://editor.swagger.io/?url=https://raw.githubusercontent.com/avniproject/avni-server/master/avni-server-api/src/main/resources/api/external-api.yaml](https://editor.swagger.io/?url=https://raw.githubusercontent.com/avniproject/avni-server/master/avni-server-api/src/main/resources/api/external-api.yaml)

2. If you use Postman you can use this public collection (it may not have all the API requests in it)\
   [https://www.getpostman.com/collections/cd269030533a58e1c072](https://www.getpostman.com/collections/cd269030533a58e1c072)
   1. For Glific postman collection, check [here](https://drive.google.com/file/d/1juM7NfMevlo50FwIeIVFqtgADlRa2-BF/view?usp=drive_link) - Some of the API endpoints are not exported correctly by postman. Refer the [Glific API guide](https://glific.github.io/slate/#introduction) or server code incase of any confusions.

### Pulling data from Avni

If your objective is to pull data from Avni into your own database then you should use `/api/subjects`, `/api/enrolments`, and so on. These endpoints provide the response in the form of pages of 100 entries each by default (see the swagger documentation). The entities in these pages are arranged chronologically i.e. it will give the oldest entity first followed by newer and so on. The chronology is followed within the page and in page order.

The *lastModifiedDateTime* field is the key. If you are reading the entities for the first time it is advisable that you start from something like *1900-01-01T00:00:00.001Z*. Once you finish reading all the entities you can store the last entry's date, and next time you can start from the value of the field "Last modified at" (not inclusive) in the audit section of the last entity you have successfully read.

Note that entities can be repeated over time if the same entity has been updated by the user.

### Media observations

In order to create /  update media type observations one can pass the URL of the media file (the URL access should not require any login). Avni will download this file and upload it to its own media server. If the URL provides is from the Avni media server then Avni will simply update the observation but not try to move the media file.

To know how to create download URL for media files stored in google drive, refer [here](https://avni.readme.io/docs/structure-import-metadata-excel-excel#google-drive-files)

### Authentication

1. Using the Avni Admin web app set up a user that you will be using to login via the API. This user should have the role *User*. Ensure that the user is not challenged with a change in the password on the first login. You can do that by logging in once from the web application. 
2. Avni uses AWS Cognito for authentication, hence the API code has to authenticate itself too. Please use the following references for authenticating with Cognito for various languages.  
   * **Java** (check the `signIn( )` method in the example) - [Readme](https://gorillalogic.com/blog/java-integration-with-amazon-cognito/)  
   * **JavaScript** - [Readme](https://aws-amplify.github.io/docs/js/authentication#sign-in)  
   * **Python** - [Readme](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cognito-idp.html#CognitoIdentityProvider.Client.initiate_auth)
3. The token provided by Cognito has to be used in the API (as documented in swagger)

### Getting a token for using Avni API via postman, curl etc

A simple way is to login via the web app. Open the Chrome dev tools (or similar in other browser) and follow the following

* go to the Application main tab 
* Local storage sub-tab
* Server inside local storage
* Copy the value of auth-token (this value can be used for auth-token header mentioned in the API swagger doc)

If the web app was open for a while, you should refresh the page and then do the above activities.

### Versioning

Avni API supports two versions 1 and 2. 2 is preferred version as it is the latest.

* 1 - The observation dates are in ISO format `yyyy-MM-dd'T'HH:mm:ss.SSSZ`, e.g. `2000-10-31T01:30:00.000Z`
* Same as 1 but with observation date in`yyyy-MM-dd` format i.e. "2023-10-05". This allows one to get the date as intended by the user and not having to do timezone adjustment.

### Recommendation (not a requirement)

1. If you are pulling the data in a background process, write your code such that it can handle failure elegantly. The failure can happen with the network or in your code. Most likely you would need to save the lastModfiedDateTime value for each entity in your database. So that when the background processes run subsequent times it can read it from the database. If you save in the memory and your server has restarted you may lose the context of how much you have already read.
2. For the background process, consider the transaction boundary carefully between saving the lastModifiedDateTime and the actual entity in your system. A transaction boundary where one entity is processed and lastModifiedDateTime is updated is the best. But you may choose some other solution.
3. This may be obvious but you need to run the background process in a sequence so that you process all the subjects first, followed by their respective programEnrolments and so on.
4. The POST method for Avni entities is an Idempotent operation, which enables the API client to perform Create, as well as Update of an existing entity, without having to go through the trouble of checking for its existence before making an update call. Its currently exposed only for following entity types:
   * Individual
   * Encounter
   * Program Enrolment
   * Program Encounter and
   * Task
## Developer Documentation

### Avni Models Usage

### Context

[Avni Models](https://github.com/avniproject/avni-models) is a reusable JavaScript module used in the avni web app, android app, and rules engine. In these dependent projects, you will find the package dependency by name openchs-models. Similarly, there are other dependencies like rules-config, avni-health-modules, and openchs-idi (all these repositories can be found in the same [Github organization](https://github.com/avniproject))

### Releasing Rules Config

We do not have to do any release of rules config and instead, we use GitHub hash for it. The CI process published a build in the build branch of rules-config.

### Releasing Avni Models and other libraries (not mentioned above)

* `make release` Provide the next version number.
* `make publish` Publishes to Github, where-from the CI picks up and releases to npmjs.com. The package will appear in npmjs.com after a lag.
### Location And Catchment In Avni

**Location Type**

* Example of location type is State, District, and Village. Each a different location type) with a parent location type except for State.
* Each location type has a level. A level is a number. Higher-up location types will have a higher number. So the state, district, and village will have numbers 3,2,1 respectively.

**Location**

* Each location has a location type.
* Location and address\_level are the same things.
* Locations are strictly hierarchical.
* The hierarchy is maintained by the parent\_id column in the address\_level table, location\_location\_mapping, and also via lineage column. Among these three parent\_id columns seems unnecessary.
* location\_location\_mapping is maintained to handle removal of locations from a parent location without deleting the row. In case of delete location\_location\_mapping should be voided and this record is synchronised to offline app so that app can also remove the location from mobile db.
* Lineage column is useful in performing hierarchical queries (as the number of levels are not fixed).

**Catchment**

* The catchment contains a list of locations. The locations can be from different levels also, but usually not.
* Catchment has a list of locations.
* catchment\_address\_mapping is used for maintaining a list of locations within a catchment.
* Ideally this table should be like location\_location\_mapping and have voided field so that instead of deleting a row it can be voided the catchment locations can be synced to the mobile app.
* There is virtual\_catchment\_address\_mapping\_table function (used as read only table in JPA). This provides all the locations (including descedants) in a catchment. This may be redudant as lineage could be used for it.

Subjects are registered to a location.

## Uploading Locations for an Organisation

For an User with "Upload metadata and data" privilege, Avni provides a "Locations" bulk upload feature, which can be used to create a large number of locations at one go.

<Image align="center" src="https://files.readme.io/972587c-Screenshot_2024-05-31_at_4.42.06_PM.png" />

In-addition, through the  "Locations" bulk upload feature, you may also specify additional properties that need to be set for each AddressLevel. These properties could then be used while configuring rules for an entity type's form.

<Image align="center" className="border" border={true} src="https://files.readme.io/b3b6b96-image.png" />

### Location upload modes

Avni supports following modes of Location bulk upload:

1. Create: Used in-order to create a new Location, with or without the Lineage existing before hand. 
2. Edit: Used in-order to edit locations' name, parent(Lineage), GPS coordinates or additional properties.
### Visit Scheduling

## Terminology

**Scheduled Visit** - A visit which is scheduled but not completed.\
**Planned Visit** - A visit which was scheduled and was completed.\
**Unplanned Visit** - A completed visit which was not scheduled.\
**Canceled Visit** - A visit that was canceled.

## Scenarios

1. The user performs a planned visit - leading to a visit (of type within the group) getting scheduled after it
2. User edits a planned visit
3. The user performs a canceled visit (or cancels a scheduled visit)
4. User edits a canceled visit
5. The user performs an unplanned visit before the newest scheduled visit
6. User edits an unplanned visit before the newest scheduled visit
7. The user performs an unplanned visit after the newest scheduled visit
8. The user edits an unplanned visit that is after the newest scheduled visit
9. The user performs an unplanned visit when (because of defect) there is no scheduled visit

## Requirement analysis

* Only **one** visit of a type, can be scheduled at a time (instead of 2 or more). What also follows is that the scheduled visit is always the newest among the scheduled and planned visits for a type, also that cancelation can only happen of the newest visits.
* Cancelation of visits, unless leading to the exit of the person from the program, result in next visit being scheduled. Hence as far visit scheduling is concerned the occurrence of a canceled visit may be same as an occurrence of a planned visit. But there will be exceptions too.
* Potentially the visit scheduling logic could get simpler if we disregard what ACTUAL REAL time is. Which is to say that code can assume *today = encounter(enrolment) date*, making the REAL NOW completely irrelevant :-). Hence all references to past and future can be considered to be only wrt encounter(enrolment) date and not to the REAL NOW.
* Let's assume a simple monthly visit scenario. In such a case lets say if a March's visit is performed in April, should a visit for April be scheduled or not? If yes, then the identity of the visit, in this case, is MARCH (i.e. it is the MARCH's visit was performed in April). If no, and visit for MAY should be scheduled, then the identity of this visit is APRIL (i.e. identity is derived from **when** the visit happens). It appears to be a fundamental question without answering which we cannot write our logic for visit scheduling. But we are not asking this question to our customers hence this remains a matter of guesses for later. Also, let's call these two by names - SCHEDULED DATE BASED PLAN (SDBP) and ACTUAL DATE BASED PLAN (ADBP). It is possible that within a group of visit types, the strategy may vary hence that must also be explored and captured.
* Does the implementation requires unplanned visits. If yes (which is likely to be rare), then we could create a separate visit type for such purpose using the same form. If no then the system could potentially take care of such visits by automatically converting them into planned visits or even easier throw warning to the user with an option of an override, in case of defects. Like above this question also should be asked. In either case, we could assume no unplanned visits as far as scheduling is concerned.

### Solution thinking

It seems that there is a real-world identity of a visit which is not mapped in OpenCHS. In the real world, one can say "August 2019's MONTHLY VISIT" but to pinpoint the same visit in the system one needs to use logic. Something that can be represented with data is better than being inferred via logic.

1. **The user performs a planned visit - leading to a visit (of type within the group) getting scheduled after it** - Schedule the next visit in the sequence based on SDBP and ADBP.
2. **User edits a planned visit** - Find visit next in sequence. If still in scheduled, change the scheduled date, if it is ADBP else do not change.
3. **The user performs a canceled visit (or cancels a scheduled visit)** - Same as 2 (using Canceled date instead of Actual date) unless the visit scheduling overrides this.
4. **User edits a canceled visit** - Same as 3.
5. **The user performs an unplanned visit before the newest scheduled visit** - Give the warning with a message - to use/cancel the already scheduled visit, or to use different visit type created for such purposes. If the user still proceeds, do not touch the visit schedules.
6. **User edits an unplanned visit before the newest scheduled visit** - same as 5.
7. **The user performs an unplanned visit after the newest scheduled visit** - same as 5.
8. **The user edits an unplanned visit that is after the newest scheduled visit** - same as 5.
9. **The user performs an unplanned visit when (because of defect) there is no scheduled visit** - Schedule the next visit using the actual date for the scheduling logic.

There are two ways to handle exit.

1. Allow the user to fill exit as a reason in the cancel visit form and then automatically exit.
2. Do not have the option for the exit in the cancel visit form. The user must exit the person from the program and as a result, the platform cancels all scheduled visits with an exit as a reason for it.

## Scenario

What should use do when retrospective data entry has to be done?\
one major scenario missing is retrospective data entry - when we enroll a person at an earlier date, it generates old visit schedules. In cases where we don't have data in the paper-based system especially for the mandatory fields, it becomes a challenge. Also, a bunch of visits has to be canceled to get it to the current state

## IGNORE

Visit types in each implementation have multiple **groups of visit types**. Each group can have one or more visit types. e.g. In Sewa Rural - Monthly, Quarterly, Half-Yearly, and Annual are part of one group. Or in maternal and child health programs - ANC, PNC, Delivery, Abortion are all part of one group. The grouping is based on fact that they schedule each other. A program may have one or groups of visit types.
### Valuejson Structure

On the front-end the Observation has valueJSON field that stores observation values. The structure of that can be understood from the examples below:

Multiselect (conceptUUID is the uuid of the answer which is a concept)\
`{ answer: [ {conceptUUID: '00828291-c2fe-415f-a51e-ba8a02607da0'}, {conceptUUID: '00828291-c2fe-415f-a51e-ba8a02607da0'} ] }`

SingleSelect\
`{ answer: { conceptUUID: '00828291-c2fe-415f-a51e-ba8a02607da0' } }`

Numeric\
`{ answer: 1}`\
`{ answer : null}`

Boolean Dated\
`{ answer: {value: true, date: DATE}}`
### Testing App Setup

If you want to install a build which is not in production follow the steps below.

## 1. Deploy the server to staging environment

Go to CircleCI, workflows, openchs-server, open. Choose the build (master latest should be fine). Unpause to deploy the build.

You can download the appropriate version of the app directly from [circleci](https://circleci.com/gh/OpenCHS). Since the generation of app installer (the apk) file is done through a manual trigger, you may have to go to the workflow choose a particular build and unpause it. Download the apk file to your file system or to your Android device.

## 2. Setup for health module and implementation deployment - one time

In your bash\_profile or bash\_rc define the environment variable for:\
STAGING\_ADMIN\_USER\_PASSWORD

Install the following pre-requisites\
git, make, node

## 3. Deploy core health modules

You need to have the code for openchs-client checked out.\
If you do not have the code then use:\
git clone [git@github.com](mailto:git@github.com):OpenCHS/openchs-client.git\
If you already have the code just use git pull

To deploy the health modules run the following command from the openchs-client code root folder:\
make deps deploy\_metadata\_staging

## 4. Deploy the implementation you want to test

**Pre-requisites: git, make, node**\
Ensure that the implementation organization has been created in the database. This requires access to the database.

You need to have the code for implementation checked out.\
If you do not have the code then use:\
git clone [git@github.com](mailto:git@github.com):OpenCHS/\<\<?>>.git\
If you already have the code just use git pull

To deploy the implementation run the following command from the implementation code root folder:\
make deps deploy\_staging

## 5. Install the app

Get the apk from someone in your team or download it from CircleCI.\
If you are installing the app on your device, you may have to change the setting of Android to allow install from unknown sources. If you are installing in GenyMotion, just drag and drop the apk file on the running emulator device.

## 6. Sync and choose your user

Run sync to get the reference data, metadata and any transaction data setup for this environment. Before the sync starts you would be asked for login details. Depending on which user you log in as you would be testing that implementation.\
If you are switching from one environment to other then you will have to reinstall the app before changing the setting.
### Reports Cookbook

The objective is to list down commonly used reporting patterns in form of working recipe, that can be reused OpenCHS development team.

## Components of line listing

* Hierarchical service area information (e.g. catchment and village)
* Individual identification details
* Programmatic details (registration date, enrolment date, exit date, number of visit)
* Field data element(s)
* Aggregated to individual data

## Good practices in report design

On a dashboard when there are multiple reports with aggregate information against the same set of dimensions, in such a case from the usability perspective consider keeping the number of rows same.

## Individual level reports

* [RECOMMENDED: List of individuals with their key details pulled up from their health record](https://reporting.openchs.org/question/165?catchment=JSS%20Master%20Catchment\&en_status=Yes)
* [List of individuals with observations from latest program encounter](https://reporting.openchs.org/question/153)
* [List of individuals with their key registration, enrolment, follow-up aggregate details (number of visits, registration date, etc)](https://reporting.openchs.org/question/143)
* [List of individuals with observations between two dates](https://reporting.openchs.org/question/162)

## Aggregate reports

* [Count of program encounter and program enrolment observations by address](https://reporting.openchs.org/question/129)
* [Count of most recent program encounter observation by address](https://reporting.openchs.org/question/145) 

## Sync report

## Immunisation related reports

* [Immunisation details of individuals](https://reporting.openchs.org/question/132)
* [Line list of immunization](https://reporting.openchs.org/question/132?catchment=Ashwini%20Master%20Catchment) 

## Child anthropometry related reports

* [Grade wise statistics by age group](https://reporting.openchs.org/question/156)
* [Gradewise statistics](https://reporting.openchs.org/question/135)
* [Weight gain](https://reporting.openchs.org/question/162?catchment=JSS%20Master%20Catchment)

## Pregnancy related reports

* [ANC and Delivery Statistics](https://reporting.openchs.org/question/129)

## **Reports Nomenclature - Metabase**

**Report Name –**\
`[Not Released/Do not use]`, use this tag for the report if this is not supposed to use by the user.\
Start the name of each report with the implementation name like Phulwari, CK, IHMP etc. (so that we know which report we have created as going forward we are going to train them for ‘Analyze query’ option and this has the option to save the report.)\
A name should be preferably given by Client. (So that they can relate. maybe the same name as they were using in the previous system)\
If not given by client it should have the name of the encounter on which the report is supposed to calculate.\
With every report, we should give a directory in which the column names are defined or elaborated.\
Field Name –\
The column name should be the same throughout all the reports in an implementation. e.g.: DOB, Reg Date, Age etc.

**Definitions:**\
*Registration:* Entering an individual in the system by clicking on the ‘Register’ in the application.

*Enrollment:* There might be the various program running in an organisation. So the registered individual needs to be enrolled in a particular program that s/he is eligible for.

*Encounter:* Any type of visit done in the system is encounter. The individual that is enrolled in any program, there will be few visits that need to be done at a particular time.

*Catchment:* Area of intervention is divided amongst the smaller area that is called catchment. The catchment is the work area for the health worker.

*Individual:* Everyone registered in the system.

*Voided:* The individual that is recorded twice or recorded by mistake. Then we ‘void’ these individuals, so that they are not shown in the reports or in the application to avoid confusion.
### Contribution Guide

These are some principles we try to follow within the Avni codebase. Some of it is just strong beliefs, and some are good practices. Either way, it will be good to follow them for a hassle-free contribution experience. 

### About the code you write

* Styling is best done by the machine. Some repositories have pre-commit hooks that take care of styling, but if there is none, keep a sane style. Don't fuss over it. 
* Keep your code [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). 
* Reuse patterns, conventions and abstractions already available in the codebase as much as possible. 
* Write unit tests for non-trivial business logic. 
* Avoid view tests. They are brittle and don't help much anyway. 

PS: Remember that you might find counter-examples for these principles within the Avni code. We are humans too. If you are up to it, fix them. 

### Raising pull requests

* Ensure you create an issue in the relevant repository in Github. 
* Fork the relevant repository, create a branch and work on it. 
* Keep smaller commits, it makes review easier
* If you are taking too long to work on an issue, keep rebasing from upstream to avoid nasty merge conflicts. Pull requests that cannot be automatically merged might not be picked up. 

### What happens when you submit a pull request

When a pull request is submitted, one of the core developers will pick it up and review them. Reviews must ensure that

* Code does not break the system
* Code is DRY, and contains relevant unit/integration tests
* All tests pass

Once the code is merged, the core developer will move the card status to the appropriate status for testing. Status of your cards will be available either on Github, or on Zenhub (all core developers right now use Zenhub to track issues). 

A QA will pick up the issue for testing. If it does not work, a bug card is raised, which will then be resolved.

### Who are these core developers?

Core developers have direct commit access to the avni codebase. 

If you work on Avni for some time, when it becomes hard for core developers to keep up with the volume of work that you produce, and we like your code, you will automatically be added as a core developer. 

### What if I have a question?

We are at [Gitter](https://gitter.im/OpenCHS/openchs) if you want to chat. Email at [avni-project@googlegroups.com](mailto:avni-project@googlegroups.com).
### Code Review Checklist

## Code Review Checklist(For the Reviewer and Developer both)

This a code review checklist. The reviewer should go through this. But a developer creating the PR should also go through this to avoid obvious things and save the reviewer's time.

### Code Formatting

Reviewer mostly need not worry about code styling since we do automatic code formatting using Prettier. We also use ESLint which shows warnings for code that violate ESLint rules. Make sure that there are no open ESLint warnings.

### Functionality

Does this code implement the functionality correctly? Do you see any missed out cases?\
You can validate the behavior by merging it on your machine. When it's hard to understand the feature by yourself, have the developer give a demo to you.

### PR Size

 Is the pull request too big to review quickly? We prefer small PRs because of multiple reasons like early issue detection, ease of review, etc. Talk to the developer to make sure that they raise small PRs. The way to raise small PRs for them is to not wait for the full feature to complete. If the feature is not complete and they must hide incomplete functionality they can use feature toggles to hide the feature from users. 

### Readability

* Can you as a reviewer clearly understand what the code is doing by yourself?
* Naming
  * Name the system entities by what they are + the intent
    * E.g. name a ProgramEnrolment as programEnrolment or exitedProgramEnrolment
  * Name the array or list as a plural
    * E.g. Array or a list of program enrolments should be called programEnrolments
      * An array of encounters should just be called encounters
  * Name the primitive variable by the role they play
    * E.g. counter, states, state, visitStatus

### Maintainability

Does the code keep maintainability in mind?\
Is the code too complex? If you find it too complex it might be hard for other developers too.\
Few things to consider:

* Loose coupling
* Abstraction
* Polymorphism

### Reusability

Is code easily reusable if it's adding some functionality that looks like something common? Is there any duplication that can be extracted into a class, function, or component? Also, check if code is doing over-abstraction and making code hard to understand. Consider the Rule of Three \[[1](https://en.wikipedia.org/wiki/Rule_of_three_%28computer_programming%29)] \[[2](https://softwareengineering.stackexchange.com/questions/197363/reasoning-to-wait-until-third-time-in-the-rule-of-three)].

### Reliability

The code should be handling all scenarios to protect the user from a bad experience.\
Is it handling all the edge scenarios? Is it handling scenarios when API can return an error?

### Framework specific best practices

We use React and Redux so see that the code follows specific best practices:

* Usage of local state vs redux. 
  * Use the local state when you don't need to use the state in other components. See [Redux vs Local state](https://redux.js.org/faq/organizing-state#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate).
* Breaking down react components
  * See [Thinking in React](https://reactjs.org/docs/thinking-in-react.html#step-1-break-the-ui-into-a-component-hierarchy)
* Naming redux actions
  * Name it so it conveys the intention of the action
    * E.g. SAVE\_FORM, VALIDATE\_FORM, EXIT\_ENROLMENT

### Zoom out

* Are there problems at the architecture level? Is it inefficient, or brittle, or poorly architected? It might feel like it's too late at the code review stage as developers may have worked on it for many days. But it's important to not merge such PRs. It raises a point of small PRs so things can be caught early on.\
  Maybe there are larger issues like lack of training/skills, so it's better to flag off these kinds of things with appropriate people to reduce overall project risk early on.
### Platform Translations Management

The management of translations of the Avni platform that are not implementation specific has been described here.

Translations can be for the web app or mobile app. These translation files are maintained in the avni-webapp and avni-client repositories respectively.

Each of these repositories provides makefile targets that can be used to deploy the translations. Deployment of translations brings the source code in sync with the deployment. Production deployments are done during the release or if there is a patch release of translations. Staging deployment can be done as part of the story development as well.

### Caveat

Although the source code contains translations in all languages, only English is maintained here. The missing platform translations are also uploaded as part of the implementation. This is the current state of affairs but is currently under discussion as to what is the right way forward. **So currently only English translations need to be created and uploaded.**
### Organisation Organisation Group And Etl Schema

In Avni, there is one database called openchs. Within this database, there are several schemas and database users created to support multiple implementations and reporting for them.

### public schema

This has all the core tables and source data for all the organizations/implementations. It also has the ETL metadata and supporting tables and their data.

### organization database users

Each organization has its own database user on which the row-level multitenancy rules are applied, hence restricting their access to their own data.

### organization-specific schema

If ETL reporting is enabled, then such an organization gets its own database schema. In this schema, the tables specific to each form are created - for easy and fast reporting. The above database user is provided access to this schema.

### organization group user and schema

Avni supports the concept of an organization group. An organization group has its own database user. This database user is provided the same access as the organization database user. For reporting a schema can also be created. This schema will hold the ETLed data for all the organizations that it has in its group.
### Understanding Whatsapp Integration Tables

## Description of reflective fields

**Message Rule**

* entityType - see [EntityType](https://github.com/avniproject/avni-server/blob/master/avni-server-api/src/main/java/org/avni/messaging/domain/EntityType.java) enum
* entityTypeId (Avni ID of the entity type like SubjectType, Program, etc)

(From reporting/querying standpoint, these fields provide information about meta entity)

**Message Receiver**

* receiverType (User, Subject, Group)
* receiverId (Avni ID for User and Subject. never populated for Group)
* externalId (for User and Subject this field gets populated when the message is first sent to the external system. for Group this field is always present)

**Message Request (Queue)**

* entityId (Subject ID, Program Enrolment ID, Program Encounter ID, Encounter ID)

### To understand the status of automatic messages

These messages are triggered when an entity like Individual, Enrolment, or Encounter, is saved.

```sql
select o.name, mr.receiver_type, mr.receiver_id, mrq.scheduled_date_time, mrq.delivered_date_time, mrq.delivery_status
from message_request_queue mrq
         join message_receiver mr on mrq.message_receiver_id = mr.id
         join organisation o on mr.organisation_id = o.id
where mrq.is_voided = false
  and mr.is_voided = false and o.is_voided = false
order by o.name, scheduled_date_time desc;
```

### To understand the status of manually triggered messages

```sql
select o.name,
       mr.receiver_type,
       case
           when mr.receiver_id is null then 'External id is used'
           else mr.receiver_id::text
           end
           as receiver,
       mr.external_id, mrq.scheduled_date_time, mrq.delivered_date_time, mrq.delivery_status, mbm.parameters
    from message_request_queue mrq
             join manual_broadcast_message mbm on mbm.id = mrq.manual_broadcast_message_id
             join message_receiver mr on mrq.message_receiver_id = mr.id
             join organisation o on mrq.organisation_id = o.id
    where mrq.is_voided = false
      and mbm.is_voided = false and o.is_voided = false;
```
### Avni Components Compatibility Policy

Avni is a standalone application and is not meant to be used as a library within another piece of software. Therefore, the forwards and backwards compatibility requirements are slightly lower than a software library. However there are deployment considerations that necessitate some level of backwards compatibility. 

This document provides the reasons, and the actual compatibility policy that Avni adheres to. 

### What are the ideas behind backwards compatibility?

The field-app is hosted on Google Play, and therefore we expect users to stay on older versions (sometimes upto 6 month old versions). The server, therefore has to be able to service these apps correctly. 

avni-webapp, however, is completely within our control and therefore does not need any kind of forwards or backwards compatibility. Every released version of avni-webapp is guaranteed to work only with the same released version of avni-server. 

The hosted version of Avni has reports written since 2017, and modifying these reports are extremely hard. Therefore we ensure that there are no changes that will break backwards compatibility at the database level. 

All other applications such as avni-etl, avni-integration, avni-media etc are relatively standalone, and will be released along with a major release if there are compatibility problems. If not, then the last available release of these components will be compatible with any newer release of Avni. 

### How is backwards compatibility achieved in Avni?

All APIs in avni-server that are used by the Android client are append-only. Newer attributes and endpoints can be added to the API, but older ones will be kept intact for at least 6 months. POST requests can take in additional fields, but will always have defaults. If default values are not possible, then a new endpoint is created instead. 

External APIs are handled similar to the Android client. 

Web APIs (those that are used by the web applications of Avni) are compatible to the same released version of avni-server. There are no backward or forward compatibility requirements on these. 

The Avni database will never break a select query that has ever been written before. This is achieved by append-only columns/tables and usage of triggers for older tables/columns so that these are preserved.
### Access Control 1

### Access control on Avni Server

* When a graph of entities are returned then the checking access has to be done for the entire tree. Iterating over the object tree after the construction to check for access which could be error prone (and sematically duplicated) - hence it is applied when entity response graph is constructed.
* Access control service also checks for user's presence, hence no @PreAuthorise methods that only check for PrivilegeType and not entity id. Leaving @PreAuthorise is also fine.
* The non-transaction data read is not controlled hence the Preauthorise is only for the user role.
* Access control service performs null check on entity type (for centralisation of those checks and ensuring it is always done). Null check is required otherwise access security is broken - e.g. if subject type is not present, we return all subjects matching other criteria.
* Currently access checks are not on the endpoints that save data provided by the mobile app. This will be tacked later.
* It is difficult to do access checks on search requests. Hence in such case the basic details for entities matching the search criteria can be seen by all the users. This is a known limitation.
* The assumption is that the number of entities loaded will be handful via a particular REST endpoint. Hence access check is done for each entity in some cases. In places where it is simpler to optimise the number of checks it has been done.

### Scenarios related to collection of entities

* External API call to get a list of transaction entities without providing the type: the user should have access to all types otherwise they would get access error whenever an entity of such a type is encountered while paging through.
* If the user provides a list of entity ids to get their data. The user must have access to all those entities otherwise they will get error.
* User wants to get all the children belong to an TX entity and then it would get those it has access to instead of error.
### Http Status Codes Presentation

### Meant for Avni mobile app

| Status Code                | User Presentation                                                  | Sync Failure |
| :------------------------- | :----------------------------------------------------------------- | :----------- |
| 401                        | Not logged in                                                      |              |
| 403                        | You have performed an unauthorised operation                       |              |
| 408                        | Server took very long to respond, or your network broke in between |              |
| 429, 503, 504              | Server is busy or unavailable                                      |              |
| 3XX, All other 4XX and 5XX | Unknown Error Happened                                             |              |
### Sync Gotchas

1. When the strategy is direct assignment, the last modified date time kept in entity sync status is that of transaction entity like (Subject, Program Enrolment etc) but the date time against which the check is done on the server to find new entities is of User Subject Assignment. This can cause behaviour which may seem puzzling.
   1. Avni client will keep downloading same entities over and over - as the assignment is always done after the creation on individual
2. If user has reset sync set due to location changes to one's catchment and the user ignores it and gets a sync error. After this if the user reports a ticket one will not be able to figure whether user ignored the reset sync prompt.
3. If last modified date time of an entity is in future (due to wrong manual update) then that entity will not be synced. A dependent entity may have last modified date time before "now" - will sync and cause sync error.
4. Sync requires that a program is not used in multiple subject types, encounter type is not used in multiple subject types or programs. This is not enforced by the platform yet. When such mapping exists the sync will fail. The failure happens because when finding the subject type for program enrolment sync it can find a subject type which has different sync strategy like location, sync attributes, etc than one applied for subject sync. You can run the following SQL to find such anomalies. **If these programs are using sync strategy which varies between different subject types then there could be sync problem.**

   ```sql
   -- program used in multiple subject types
   select organisation.name, program.name, form.form_type, count(*)
   from form_mapping
            join subject_type on form_mapping.subject_type_id = subject_type.id
            join program on form_mapping.entity_id = program.id
            join form on form_mapping.form_id = form.id
            join organisation on form.organisation_id = organisation.id
   where form_mapping.is_voided = false
     and observations_type_entity_id is null
   group by 1, 2, 3
   having count(*) > 1;

   -- general encounter types used in multiple subject types
   select organisation.name, encounter_type.name, form.form_type, count(*)
   from form_mapping
            join subject_type on form_mapping.subject_type_id = subject_type.id
            join program on form_mapping.entity_id = program.id
            join form on form_mapping.form_id = form.id
            join encounter_type on encounter_type.id = form_mapping.observations_type_entity_id
            join organisation on encounter_type.organisation_id = organisation.id
   where form_mapping.is_voided = false
     and observations_type_entity_id is not null
     and encounter_type.is_voided = false
    and entity_id is null
   group by 1, 2, 3
   having count(*) > 1;

   -- encounter types used in multiple programs
   select organisation.name, encounter_type.name, form.form_type, count(*)
   from form_mapping
            join subject_type on form_mapping.subject_type_id = subject_type.id
            join program on form_mapping.entity_id = program.id
            join form on form_mapping.form_id = form.id
            join encounter_type on encounter_type.id = form_mapping.observations_type_entity_id
            join organisation on encounter_type.organisation_id = organisation.id
   where form_mapping.is_voided = false
     and observations_type_entity_id is not null
     and encounter_type.is_voided = false
   group by 1, 2, 3
   having count(*) > 1;
   ```
### Cross Environment Bundle Deployment

* Ensure that both the environments have the same build number deployed.
* In the bundle there may be use of S3 files like icons in Subject Type
  * Do find in files for such data and remove it.
  * Manually upload the assets from the application screen (app designer, edit subject type in this case)
* There is bug in platform related to bundle upload/download for GroupPrivilege.
### Learnings From Observation Data Migration To Embedded

* Migrating observations is like migrating (reading and writing) 90% of mobile database
* Large migrations take up memory and likely to go out of memory for medium to large sized data
* There is no flush functionality like hibernate, so keep memory under control one can perform commit and re-open transaction. this pushes data to the file system from memory.
* [https://gist.github.com/petmongrels/354a54ed1d0c3f492688d61c2dd63e55](https://gist.github.com/petmongrels/354a54ed1d0c3f492688d61c2dd63e55)
* removed code available here 
  * [https://github.com/avniproject/avni-models/blob/66f582a25831db424447205ec778c6e78588d797/src/Schema.js](https://github.com/avniproject/avni-models/blob/66f582a25831db424447205ec778c6e78588d797/src/Schema.js)
  * [https://github.com/avniproject/avni-models/blob/180550ab1d0fff8d145813ae8a466107505f8e46/test/SchemaTest.js](https://github.com/avniproject/avni-models/blob/180550ab1d0fff8d145813ae8a466107505f8e46/test/SchemaTest.js)
### Phone Number Formats

### Formats and Usage

1. E164 format (+919455509147)
   1. User phone number in Avni database
   2. Valid user phone number as sent to Cognito
   3. Avni web app display for User
2. National Format (9455509147)
   1. Observation value for phone number data type (used in web app, mobile app, and external API)
3. Glific format (919455509147)
   1. Format used in Glific requests
4. Human format - [examples](https://github.com/avniproject/avni-server/blob/b846c627f7306514f284c6511d7ac8c149f82596/avni-server-api/src/test/java/org/avni/server/domain/framework/PhoneNumberTest.java#L12)
   1. User phone number input on web app and user CSV upload
   2. Phone number observation value in CSV upload (not in mobile app)
### User Provisioning Details

<Image align="center" src="https://files.readme.io/107ca57295d83ef6b3f965f446dd853115393e72c8c6da136001ecb69e1a17ae-Screenshot_2025-01-30_at_8.59.52_PM.png" />

[https://docs.google.com/spreadsheets/d/13K1F2vWHq-BOrBa1G-CSdxcc4VwLiXp5hd8\_1ZApYos/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/13K1F2vWHq-BOrBa1G-CSdxcc4VwLiXp5hd8_1ZApYos/edit?gid=0#gid=0)
### Usersubject Assignment Configuration Behavior Guide

## Overview

UserSubjectAssignment in Avni manages which users have access to which subjects (individuals, groups, and their members). This system ensures proper access control and sync behavior across the application.

## Key Features

### Automatic Member Assignment

When a group is assigned to a user, the system automatically creates individual assignments for all non-voided members of that group. This ensures users have access to both the group and its individual members without requiring separate manual assignments.

### Smart Member Unassignment Constraints

The system prevents data inconsistency by not allowing users to unassign individual members if those members belong to a group that is still assigned to the same user. This maintains logical access control relationships.

### Group Unassignment does not impact Members Assignment

When a Group Subject is unassigned, we do not automatically unassign all member subjects. User would have to manually unassign Members.

### Catchment and Privilege constraints

Only those GroupSubjects and MemberSubjects will sync to User's device that have

* Its Address included in the User's Catchment
* One of the User's UserGroup Privilege should allow for View Privilege for those Subject Types

## Configuration Details

### Subject Type Configuration

* Only subjects marked as `isDirectlyAssignable=true` can be manually assigned
* Groups can be assigned and will automatically include their members as of that moment on the server
* Individual members can also be assigned independently of their groups

### Assignment Rules

* One user can be assigned to multiple subjects
* One subject can be assigned to multiple users
* All assignments must respect the user's designated catchment area

### Database Structure

* `UserSubjectAssignment` table: Tracks user-subject relationships
* `GroupSubject` table: Tracks group-member relationships
* Both tables support soft deletion using the isVoided flag
## Integration Developer Guide

### Integration Process

In a given integration between one Avni implementation and another system, there may be several entity types that need to be processed in one or both directions. One reasonable and commonly followed way, so far in avni integrations, is to integrate by entity types. It may be also reasonable to integrate in one direction and then in another direction (they can be done in parallel also, but the errors may become difficult to reason and resolve). That is, first integrate all subjects, then encounters, and so on. Similarly, there may be entity types in the other integrating system as well.

These entities of each entity type may have a dependency on another entity type's entities. For example: in Avni an encounter is dependent on a subject being there first. Hence in any integration where subject, as well as encounters, are to be created in avni-based entities in the integrating system - this dependency becomes important to recognize. Due to this dependency if subject creation has failed then there is rarely any point in trying to create encounters. Hence the integration of one such cluster of entities can be called *an integration process* within an integration. This concept of the integration process is referred to in [Error handling](doc:error-handling).

### Bookmark

Each integration process (regular and error) manages a bookmark for the last record processed. This is to make sure than if the integration process stops then it can resume from the last processed location.

### Idempotent processes

The integration modules must use idempotent approach for record processing. i.e. if a record is processes multiple times then the state of the destination system is business-wise the same (e.g. the audit records can get updated everything with new time value).

### Avoid complex integration solutions

The integration solution typically may result in data flow from the mobile app, to the Avni database, to the integrated system - and back. The time taken for the data to reach from user of one system to another system cannot be guaranteed due to the offline nature of the mobile app.

Because of the above, Avni doesn't support [offline locks](https://www.baeldung.com/cs/offline-concurrency-control) and hence is also an event based system. Hence any entity must be updated by either Avni or by integration process pull data from another system. Both should not update the same record - otherwise they may update each other data. The entity mapping should take care of this by assigning ownership clearly.

The above rules out entity of any type moving in both directions. The other issue with same entity moving in both directions, in a bi-directional integration scenario, is figuring out when to stop. Reasoning about such workflows can be quite difficult when there are errors. When the bi-directional flow for any entity type is required, for some side use cases, use the synchronous API to make the change to another system directly instead of going via integration service for that (this is not possible or recommended from Avni side only for another system).
### Error Handling

During the integration process, the following types of errors can happen.

1. Business error
2. Availability or defects in the integrated systems
3. Error due to defect in the integration code

When errors happen the integration code there are two choices, whether to move on and process the next record set of records or to stop the integration process completely.

### Business error

These are error scenarios that are known at the time of writing integration code. These errors happen when the two integrated systems and the integrator are working as expected but the error can still happen due to users or known business scenarios. e.g. when a patient is being synchronised from Bahmni to Avni there are two subjects in Avni with the same Sangam number (unique identifier).

Important rule to identify such errors is that - these type of rules can be be fixed by the users of the Avni, integrated systems, or the system admin of the integration service.

### Availability or defects in the integrated systems causing errors during integration

These are errors that the integrator doesn't have any way to recover from, as it is outside the scope of the integrator if even it itself is working as expected.

* one or both of the systems being integrated are not available due to network or other issues
* one or both of the integrated systems have software defects that cause the integration process to work not as expected

### Error due to defect in the integration code or data setup of the integrator

self-evident

## Types of error

### Business error

Integration code should be coded to capture all business errors and log them into the Error Records in the integrator database. The integrator should move to the next record and process it. Since the business error has happened specifically to one record (e.g. patient) the next record can be successfully processed.

### For other types of error

it is difficult to differentiate and tell whether the integrator can process the rest of the records successfully or not. These errors are where the system throws an exception (NPE, IO exception, SQL exception, etc). Just based on exception type usually it is very difficult to tell exactly what is the cause and take corrective action in the code. Hence for such exceptions, the integration module can decide whether it should keep processing or abort. The trade-off is as follows.

#### Continue processing on error

If the error is due to such record-unspecific reason then all the subsequent errors will go and sit in the error records as well. It is also possible that the underlying reason may get rectified while processing of subsequent records. There are issues that one needs to be aware of when taking this approach.

1. When looking at the error records it will become difficult to tell whether which issues one much tackle and which ones one should leave alone (as they would get fixed when the underlying issues get resolved). Hence this approach can have negative consequence on supportability of the system.
2. When taking this approach the integration module **must** ensure that out of order execution of records doesn't create incorrect data and semantically out of order execution **must** always fail - otherwise the records may go in the error log in the reverse order and may never process successfully.
3. If this approach is taken the entire error records must be processed more frequently (almost like the main processing frequency). This may create unpredictable and much higher load for the Avni and the other system. For example if the source system is up and destination system is unavailable then source system will be keep getting requests for all records in each run - while not being able to process them.

(so far Avni integration framework has only been used for the subsequent error processing approach - some of the features like water marking after each record processing is not present)

#### End processing on error

In this case the next run of the process will pick up from the same record and try to process again. The error is notified to Bugsnag. If the error is due to

1. availability then uptime monitoring for these services will also catch them. Hence in bugsnag, such errors should be marked as ignored so that next time they do not raise a trigger.
2. some defect in any of the three systems. The error can be rectified and the bug can be marked as fixed in Bugsnag.

The limitation of this approach is that:

* In case it is a bug in one of the three systems that impact only certain records then other records are also not processed till this issue is resolved by someone manually by changing the code.

## Business error classification

Since the business error needs to be resolved by fixing the data. These errors can be browsed through the Avni integration web application. The integration framework allows the developer to define their own error types and then log the errors against that - to assist in browsing the errors.

## Error records scheduled job

A schedule or task in within the existing schedule can be defined to reprocess these errors. In the data has been corrected then the error corresponding to them will resolve itself.
### Configuration Management

**Where to define the property?**\
All properties must always be defined in the module's main properties file. The modules that depend on this should include the properties file using the `spring.config.import`. This allows for not having to define a property over and over again.

**What to give as property value?**\
Unless it is a secret or change based on context give it the actual value. If you are calling the property value dummy then call it something like amrit-main-dummy so that another developer can figure out where it is being picked from.

**How to manage secrets when running integration tests?**\
Firstly the integration tests that depend on test environments that may or may not be accessible in the future should be disabled before pushing. But since one may want to run these tests from the IDE setting their actual value every time via environment variables can be a pain. The secret properties file comes in here (but should be used only for test environments and not production). You can keep a secret properties file and it should be `git ignored`. The secrets can be maintained in the password managers like KeeWeb. In spring the property which is defined later overrides the property defined earlier.
### Build Deployment And Configuration

# Integration Server

### Build

Code is here: [https://github.com/avniproject/integration-service](https://github.com/avniproject/integration-service)

Currently integration service is configured in CircleCI, so that build has to be done on the local machine. Run `make build-server` and use the file `integrator/build/libs/integrator-0.0.2-SNAPSHOT.jar` file.

### Configuration

There are two applications that needs to be configured. The integration service application and the integration(s). Avni integration service integrates multiple systems with Avni. For each integration there is configuration of the integrated system and Avni. All the configuration is done via the system environment variables.

#### Integration Service Application

Integration service has its own database and it has an admin web application.

```Text Integration Database
AVNI_INT_DATABASE, AVNI_INT_DATABASE_PORT or AVNI_INT_DATASOURCE
AVNI_INT_DB_USER
AVNI_INT_DB_PASSWORD

for default values please check - https://github.com/avniproject/integration-service/blob/main/integration-data/src/main/resources/int-data.application.properties
```

```Text Integration Server
AVNI_INT_SERVER_PORT (port number on which the integration server will run)
BAHMNI_AVNI_IDP_TYPE [Cognito(default) or Keycloak]
```

```Text Integration Application
AVNI_INT_STATIC_PATH (default = /var/www/avni-int-service/), 
  the path from where the front-end admin application is served.
```

#### Integration between Avni and Another System

```Text Avni Configuration
BAHMNI_AVNI_API_URL (base url like https://staging.avniproject.org)
BAHMNI_AVNI_API_USER
BAHMNI_AVNI_API_PASSWORD

NOTE: The Avni configuration will be required per system. Here Bahmni has been used as an example.
```

```Text Bahmni
OPENMRS_BASE_URL
OPENMRS_USER
OPENMRS_PASSWORD
```

There are two background jobs for each integration. One that processes the integration and error record and another than processes only the errors. Usually you can keep the later disabled and run them if you want to process the errors only. By default all jobs are disabled.

```Text Background Job
# You can provide Spring Scheduler's Cron Expression to the following properties
BAHMNI_SCHEDULE_CRON
BAHMNI_SCHEDULE_CRON_FULL_ERROR
```

### Integration DB Migration script sequencing to be followed for different systems

Each system has their own migration series:

| SystemName | Migration Series                  |
| ---------- | --------------------------------- |
| Generic    | V2\_1\_\_XXX\_\<some\_string>.sql |
| Bahmni     | V2\_2\_\_XXX\_\<some\_string>.sql |
| Goonj      | V2\_3\_\_XXX\_\<some\_string>.sql |
| Amrit      | V2\_4\_\_XXX\_\<some\_string>.sql |
| Power      | V2\_5\_\_XXX\_\<some\_string>.sql |

And most importantly, all the generic db schema changes, have to be done in the series\
**V2\_1\_\_XXX\_\<some\_string>.sql**

If we break this behaviour, we'll mess up the Integrations update going forward

### Users, Tenant

Currently these need to be done from the database and using http requests. Hence start the server using `java -jar integrator-0.0.2-SNAPSHOT.jar`. Also, the integration service users have not been integrated with Cognito or Keycloak yet.

```curl User's Password
// Run the following from the same server or over https, so that the request doesn't go out of the network

curl --location 'http://localhost:6013/int/test/passwordHash' \
--header 'Content-Type: application/json' \
--data '{"password": "jdsai2isjd"}'

-- Take the output
```

```sql Create User
select * from integration_system; -- to get all the tenant ids

insert into users (email, password, working_integration_system_id) 
	values ('foo@example.com', 'password has from above', tenant_id);
```

# Integration Admin App

### Build

Code is here - [https://github.com/avniproject/integration-admin-app](https://github.com/avniproject/integration-admin-app)

`make deps build-app` (make sure you have the node version mentioned in the .nvmrc)

### Deploy

You can copy the contents of build folder to your reverse proxy. The homepage name is avni-int-admin-app. You can also copy these files to avni-int-admin-app under the avni-integration-server working directory - if you want the integration admin app to be served by the avni-integration-server.
### Cross System Field Mapping

The core objective of integration service is to move data from Avni and make it available in another customer system and vice-versa. This movement of data internally heavily involves mapping of fields from one system to another. The straightforward way ways one can imagine mapping of fields (and their coded answers) it to do it in the Java code. This work fine - except for the type of data where new fields can come up frequently after the system is deployed to production. If this is too frequent then it would require code change and deployment.

For such type of data fields integration service provides Mapping Metadata entity. It can be used to keep such mapping in the database so that the development & deployment can be avoided. Important to understand that if this is used incorrectly then it can create unnecessary complexity in the integration module by delegating mapping to database instead of doing it in the code.
### Avni Bahmni Integration Specific

Since Avni Bahmni integration is reusable integration, hence this page. Some Avni integration modules are specific to a project, hence they will not be documented here.

### Conceptual Background 

The purpose Avni Bahmni integration is to make the data of Avni available to the hospital users and the Bahmni data available to the field workers using Avni. The integration allows control over which data is made available on the other side. Once the data is available the existing mechanisms present in the both the system can be used to view this data.

The integration respects the concept of immutability of health data - as is present in both Avni and Bahmni. Immutability implies that most patient is not updated over time (the concept of Encounter) and new data is created instead. The integration hence is implemented such that Avni data will not update Bahmni data and vice-versa.

The objective of the integration is not to create work flows across the two systems. e.g. if a person is registered in Bahmni then automatically register the person in Avni. OR, if such an such form is filled in Bahmni then automatically enrol them in Avni is some program. Apart from immutability the reason this has not been done is to:

- Get into conflict resolution of data across two systems
- Keep field program and hospitals decoupled from each other. The field worker and hospital users both can be make use the data but what to do is not dictated by the integration.

### Technical Background

When you start the server, a few metadata will be created by the flyway migration. These are present in mapping_group and mapping_type tables. You will be creating mapping entities using these. Note that you cannot change the name of these (as they are also enums based on which the integration is done). So for this module the Mapping Group and Mapping Type screen in admin app should be treated as read only.

There are four types of conceptual entities - Individual, Program Enrolment/Exit, Program Encounter, and General Encounter across Avni and Bahmni. In OpenMRS - Program Enrolment, Program Encounter and General Encounter are not natively supported. Bahmni provides support for this using convention.

The integrator works over OpenMRS API and not Bahmni. Due to this _the mapping_ between Bahmni and Avni should provide the information about whether an Encounter in Bahmni maps to Program Enrolment, Program Encounter, or General Encounter. (Mapping tab in the web application can be used for finding and creating these mappings.)

# Mapping and MetaData Configuration

**General info about all type of mapping.**

- The mapping should be created via the admin app UI.
- In the instructions below it has been mentioned to create form, encounter types, program etc in Avni or Bahmni - but if you already have them then you can skip those steps.
- There are no separate instruction for addition of new form elements to existing forms
- For concepts, note that you also need to map the answer concepts
- Avni external API uses name, for MetaData, to identify and OpenMRS uses UUID - hence in most places you will be using name for Avni and UUID for OpenMRS when providing mapping etc.

### Constants

Currently there is no user interface in admin app for this - hence these need to be set directly in the database. Following are the name of constant with description of what should be the value.

- **BahmniIdentifierPrefix** - If the patient identifier in Bahmni has any prefix, else this should be empty string.
- **IntegrationBahmniIdentifierType** - Identifier type for above
- **IntegrationBahmniProvider** - The integration doesn't pass the user information from one system to another - hence this constant provides the name of the provider as present in OpenMRS.  Ideally you should create a new provider in OpenMRS for this.
- **IntegrationBahmniEncounterRole** - OpenMRS expects a role name provided along with the provider.
- **IntegrationBahmniLocation** - The UUID of the location in OpenMRS where the visit, encounter, identifiers should be created in.  Ideally you should create a new location in OpenMRS for this.
- **IntegrationBahmniVisitType** - Since all encounters are recorded in OpenMRS under some visit, this is the UUID of the visit type. Ideally you should create a new visit type in OpenMRS for this.
- **OutpatientVisitTypes** - If you are integrating lab results and prescriptions, then this is visit type UUIDs where they can be found and picked from. Since the lab tests are prescriptions can be a lot for in-patient visits - this allows for controlling what doesn't get synced to Avni. Multiple visit type uuids can be provided as multiple rows with the same key.
- **IntegrationAvniSubjectType** - The Avni subject type name that maps to Patient.

### Core mappings

Create following mappings and corresponding meta data in relevant system.

| Mapping Group | Mapping Type                     | Bahmni Value                                                                                                                | Avni Value                                                  |
| :------------ | :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| Common        | BahmniUUID_Concept               |                                                                                                                             | Name of the concept that will hold the OpenMRS entity uuids |
| Common        | AvniUUID_Concept                 | UUID of the concept of data type string that holds the Avni entity uuids                                                    |                                                             |
| Common        | AvniEventDate_Concept            | UUID of the concept that holds event date (like encounter date, registration date etc                                       |                                                             |
| Common        | AvniProgramData_Concept          | UUID of the concept of data type text  that holds program enrolment and exit information. a string formatted text is stored |                                                             |
| Common        | AvniEventDate_VisitAttributeType | UUID of the visit attribute type of type date, where the Avni event date (as described earlier) is stored                   |                                                             |
| Common        | AvniUUID_VisitAttributeType      | UUID of the visit attribute type of type string, where the Avni entity UUID (as described earlier) is stored                |                                                             |

_\*\* A new visit is created for each program enrolment and subject general encounters._

### Map of Concepts

For reference from other points below.

(for each concept in the form) Mapping Group=Observation, Mapping Type=Concept, Avni value=Name of the concept, Bahmni value=UUID of the concept, Select coded if it is a coded concept.

### Map Subject/Patient Identifier

Mapping Group=PatientSubject; Mapping Type=PatientIdentifier_Concept; Avni value=Name of concept; Bahmni value=UUID of patient identifier type

### Map Avni Subject to Bahmni

Avni Subject maps to Bahmni encounters.  
Please note that the integrator also creates a patient in Bahmni with name, date of birth, gender and patient identifier. Other than patient identifier the other fields are mapped from Subject core fields, hence without any mapping required.

- Create a form in Bahmni (using the concept set approach)
- Create an encounter type in Bahmni
- Mapping Group=PatientSubject, Mapping Type=Subject_EncounterType, Avni value=Name of subject type, Bahmni value=UUID of encounter type
- Map concepts in the form

### Map Patient to Avni

Patient maps to Avni general encounter.

- Create an encounter type by the name `Bahmni Patient Registration`, and a form in Avni for the Subject type corresponding to the patient.
- MappingGroup=PatientSubject; MappingType=PersonAttributeConcept; Avni value=Concept name (from the form); Bahmni Value=Person attribute type UUID.

### Map Avni Program Enrolment form

- Create a form in Bahmni (using the concept set approach)
- Create an encounter type in Bahmni

| Mapping Group    | Mapping Type                         | Bahmni Value           | Avni Value   |
| :--------------- | :----------------------------------- | :--------------------- | :----------- |
| ProgramEnrolment | CommunityEnrolment_EncounterType     | UUID of encounter type | Program name |
| ProgramEnrolment | CommunityEnrolment_BahmniForm        | UUID of form concept   | Program name |
| ProgramEnrolment | CommunityEnrolment_VisitType         | Visit type uuid        | Program name |
| ProgramEnrolment | CommunityEnrolmentExit_EncounterType | UUID of encounter type | Program name |
| ProgramEnrolment | CommunityEnrolmentExit_BahmniForm    | UUID of form concept   | Program name |

- map concepts

### Map Avni's program encounter form (or Bahmni encounter to Avni Program Encounter)

- Create a form in Bahmni (using the concept set approach) and Avni
- Create an encounter type in Bahmni and Avni

| Mapping Group    | Mapping Type                     | Bahmni Value           | Avni Value          |
| :--------------- | :------------------------------- | :--------------------- | :------------------ |
| ProgramEncounter | CommunityEncounter_EncounterType | UUID of encounter type | Encounter type name |
| ProgramEncounter | CommunityEncounter_BahmniForm    | UUID of form concept   | Encounter type name |

- map concepts

### Map Avni's subject encounter form (or Bahmni encounter to Avni subject encounter)

- Create a form in Bahmni (using the concept set approach) and Avni
- Create an encounter type in Bahmni and Avni

| Mapping Group    | Mapping Type                     | Bahmni Value           | Avni Value          |
| :--------------- | :------------------------------- | :--------------------- | :------------------ |
| GeneralEncounter | CommunityEncounter_EncounterType | UUID of encounter type | Encounter type name |
| GeneralEncounter | CommunityEncounter_BahmniForm    | UUID of form concept   | Encounter type name |

- map concepts

### Map Drug Prescriptions

| Mapping Group    | Mapping Type           | Bahmni Value | Avni Value                |
| :--------------- | :--------------------- | :----------- | :------------------------ |
| GeneralEncounter | DrugOrderEncounterType |              | Encounter type name       |
| GeneralEncounter | DrugOrderConcept       |              | Concept name of type text |

### Map Lab Results

| Mapping Group    | Mapping Type     | Bahmni Value | Avni Value          |
| :--------------- | :--------------- | :----------- | :------------------ |
| GeneralEncounter | LabEncounterType |              | Encounter type name |

all lab order concepts must be created in Avni and mapped.

## Atom feeds

Avni Bahmni integration module uses atom feeds provided by Bahmni. You can see atom feed client related tables in the database. The failed events are not used as the integration stops at the first failed event. The error handling is managed by the integration module and not the atom feed library.
### Other Faq

### Showing Sync Status

This may be required any entity originating in Avni and then pushed to the other integrated system. The user may want to know whether the entity has been synced to the other system.

* The end user of Avni shouldn't be bothered with the technical status of any data. They should assume that it has been sent where ever it is meant to be sent. If not sent then the support and administration team will handle it.
* The administrator should also assume everything is synced successfully unless it is present in the error records.
* These are likely use cases relevant for development phase of the integration.
### Integration Service Building Blocks

Avni Integration Service follows [domain driven design building blocks](https://medium.com/@mazraara/the-building-blocks-of-domain-driven-design-ddd-af745a53a9eb). Here the responsibility of these building blocks is elaborated.

### Repository

Each integration uses three data sources typically integrating system, Avni and Integration Database. The first two are accessed via REST/HTTP API. But for all these three data access use Repository classes to pull/push data.

### Entity (and Factory, Value Object)

The data coming in-out of repositories are entities (like usual). The responsibility of Value objects and Factories are  as usual.

### Service

Services provide business and data transformation logic. They can use **Mapper**.

## Integration Service has two other building blocks that are not common

### Worker

Workers are like controllers that orchestrate one or more services to process each integration flow. Typically there is one worker method for one integration process.

### Job

These handle the responsibility of scheduling of the [Integration process](doc:integration-process). They invoke workers for the processing.
### Index

Before starting you may want to refer to [Integration architecture](doc:integration-architecture) in the design section.

[Integration process](doc:integration-process)\
[Error handling](doc:error-handling)\
[Configuration management](doc:configuration-management)\
[Build, Deployment, and Configuration](doc:build-deployment-and-configuration)\
[Cross system field mapping](doc:cross-system-field-mapping)\
[Avni Bahmni Integration](doc:avni-bahmni-integration-specific)
## Notes

### Accessing The Servers

## About various shared environments

*Logically* there are following shared environments running OpenCHS backend services.

* **Demo** - The demo environment hosts all the health modules. Certain configurations that are specific to an organization is made up for demonstration purpose. The configuration can be understood by looking at the code [here](https://github.com/OpenCHS/openchs-client/tree/master/packages/demo-organisation).
* **Staging** - Staging is a testing environment. All the builds are automatically deployed here from the continuous integration service (CircleCI).
* **UAT** - UAT is a testing environment for the customers.
* **Production** - As the name suggests.

OpenCHS has following services:

* **Server** - Web service accessed using REST API
* **Reporting and Dashboard** - [Metabase](http://www.metabase.com) based reporting and dashboard platform
* **Health worker application** - Android application
* **Self-Service Application** - Web Application
* **Identity and Access Management** - Amazon's [Cognito](https://aws.amazon.com/cognito/) service

OpenCHS online service runs following physical environments.

* **Production**
* **Staging**
* **UAT**\
  Important to note that demo is not a physical environment and it is configured as an organization (or tenant) in the Production physical environment.\
  Also, because we are using metabase which doesn't allow for a source code based version control, there is only one reporting service running on production and demo as well as staging will be organizations.

## 1. Create PEM file locally

```shell
#If you have the openchs/infra project run the following command.

ENCRYPTION_KEY_AWS=? make install
cp server/key/openchs-infra.pem ~/.ssh/openchs-infra.pem
chown $USER:$USER ~/.ssh/openchs-infra.pem
chmod 0600 ~/.ssh/openchs-infra.pem

#or run the following command
ENCRYPTION_KEY_AWS=? @openssl aes-256-cbc -a -md md5 -in server/key/openchs-infra.pem.enc -d -out server/key/openchs-infra.pem -k ${ENCRYPTION_KEY_AWS}

#ENCRYPTION_KEY_AWS=? 
# is the password which you need to get from the development team
# admin, once you become part of the team.
```

## 2. Use the following server details

User name = ec2-user\
Port = 22\
**Host names**

* ssh.staging.openchs.org (Staging, All builds are deployed here automatically.)
* ssh.uat.openchs.org (Staging, All builds are deployed here automatically.)
* ssh.server.openchs.org (Production. Demo is set up as a tenant here.)
* ssh.reporting.openchs.org (There is a single reporting server which runs staging, demo and production. This is because the way metabase works doesn't allow for version control via source code)

## 3. SSH to a server

ssh -i &lt;location of pem file&gt; ec2-user@&lt;environment-host-name&gt;\
**e.g.**\
ssh -i \~/.ssh/openchs-infra.pem [ec2-user@ssh.staging.openchs.org](mailto:ec2-user@ssh.staging.openchs.org)

You could make entries in your \~/.ssh/config file as follows:

```text OpenCHS Hosts
Host staging-server-openchs
    Hostname ssh.staging.openchs.org
    User ec2-user
    Port 22
    IdentityFile ~/.ssh/openchs-infra.pem

Host uat-server-openchs
    Hostname ssh.uat.openchs.org
    User ec2-user
    Port 22
    IdentityFile ~/.ssh/openchs-infra.pem

Host prod-server-openchs
    Hostname ssh.server.openchs.org
    User ec2-user
    Port 22
    IdentityFile ~/.ssh/openchs-infra.pem

Host reporting-server-openchs
    Hostname ssh.reporting.openchs.org
    User ec2-user
    Port 22
    IdentityFile ~/.ssh/openchs-infra.pem

Host prod-db-openchs
    Hostname serverdb.openchs.org
    User ec2-user
    Port 22
    IdentityFile ~/.ssh/openchs-infra.pem

Host staging-db-openchs
    Hostname stagingdb.openchs.org
    User ec2-user
    Port 22
    IdentityFile ~/.ssh/openchs-infra.pem

Host uat-db-openchs
    Hostname uatdb.openchs.org
    User ec2-user
    Port 22
    IdentityFile ~/.ssh/openchs-infra.pem
```

## 4. Connecting to the databases

Host: serverdb.openchs.org, stagingdb.openchs.org or uatdb.openchs.org\
Database: openchs\
User: openchs\
You would need to use ssh tunneling to the databases, as we haven't installed psql on the servers. Sample commands below to do this:

```shell
# 3333 is local port on your machine
# 5432 is remote port on prod-server
# prod-server alias defined in the config earlier/above
ssh -L 3333:stagingdb.openchs.org:5432 staging-server-openchs
# Once the tunnel is setup you can use below to connect to the database from command line. You can also use the parameters to connect via other tools. Important to note that you do not run the command on the shell that opens after the running the previous commnad. You should run this on the local machine/shell.
psql -h localhost -p 3333 -Uopenchs openchs
```
### Copying Database From Prod To Staging For Testing

```shell
# Copying database from prod to staging for testing.
# these steps cannot be executed as a single bash script.
# make sure you have ssh configuration setup and you are able to ssh into envs.

# ssh into staging box
ssh staging-openchs
# stop server
service openchs stop

# in a different bash session setup tunnel
ssh -T -L 3333:stagingdb.openchs.org:5432 staging-openchs
# in a different bash session connect to staging db
psql -Uopenchs -d openchs -h localhost -p 3333

# drop schema, effectively deleting everything but the database
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
# reset the schema
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
\q;

# in a different bash session login to prod
ssh prod-openchs
# within ssh shell run pg_dump to get prod db.dump
pg_dump -Uopenchs -h serverdb.openchs.org -d openchs > prod-database-dump.sql

# in a different bash session download database dump from prod box to local
scp prod-openchs:~/prod-database-dump.sql ~/prod-database-dump.sql

# apply dump to staging db
psql -Uopenchs -d openchs -h localhost -p 3333 -f ~/prod-database-dump.sql
# once it is complete, start the staging server in staging box
service openchs start
# once it is started and no problem kill the ssh tunnel and delete the temporary dump file from prod box
# exit all the sessions
```
### Troubleshooting And Error Debugging

<br />

### BugSnag Error Monitoring

1. **Access Bugsnag**: Log into the Bugsnag dashboard
2. **Search Inbox**: Navigate to the Bugsnag inbox search functionality
3. **Find Issues**: Search for relevant error reports and stack traces

   <Image align="center" border={false} width="800px" src="https://files.readme.io/f5fc08cab978cdd79540d1bf374f1096f37fa1c348f716c4b54490f921e87f2f-Screenshot_2026-02-02_at_11.49.08_AM.png" />
4. **Analysis**: Use the detailed error information to understand and resolve bugs

   <Image align="center" border={false} src="https://files.readme.io/791d978aff2df65b87669997efc99828003f412ac917a3c1686e83aa18fbe981-Screenshot_2026-02-02_at_11.50.05_AM.png" />

### Reporting an issue

When a user encounters an issue in the application:

1. **Error Alert**: An alert popup is displayed on the screen.
2. **Report issue**: Click the button labelled `Upload issue info`

   <Image align="center" border={false} width="300px" src="https://files.readme.io/4241d4b1377e95253025b07dedfadaa5be2dbfe982c52c2f7bf879e6ecfc49d3-Screenshot_2026-02-02_at_11.16.37_AM.png" />

If the user's face an issue and the alert is not shown or the alert box does not contain `Upload issue info` button, they can click on `More` in the home page, and then click on `Upload app info`.

<Image align="center" border={false} width="300px" src="https://files.readme.io/37733e4cb85d86af34f6ad82ae12053fecbb53728dcf8737541f7537c8c72a9b-Screenshot_2026-02-02_at_11.47.53_AM.png" />

<br />

3. **Fixing by Avni team**: The uploaded information can be accessed from AWS S3 ('env-user-media bucket' -> 'organisation media directory name' -> 'adhoc-dump-as-zip-username-uuid') by the development team to analyze the root cause of the issue and implement appropriate fixes.
### Tools

### nvm

Since we use nvm and our different projects/branches use a different version of node. In order to always use the correct version of the node we have two tools. These set the node version and the default node version. The default node version must be set if one uses the avni client to do react-native run-android, which internally launches the packager or metro bundler. Each project has a .nvmrc file checked in specifying the node version.

* A customized cd command that sets the node version and default node version. You can put this in our bashrc or bash profile files. See the function below.
* When we are in a particular directory and switch the git branch the node version may need to change. To support this we have git checkout hooks.

```Text shell
function cd () {
  builtin cd "$@"  
  if \[[ -f .nvmrc ]]  
  then  
    nvm use > /dev/null  
    nvm alias default current > /dev/null  
  fi  
}
```
### Debugging Avni Client

### Version compatibility (Hermes, Chrome, React Native)

* React Native supports debugging via Chrome Debugger (DevTools)
* Realm doesn't support debugging with JSC only with Hermes
* Since Chrome keeps getting updated on our machines, so even with hermes one needs to be at a certain version for chrome debuggers for specific versions of react native (and maybe realm also).
* The above problem is solved by Flipper (desktop app) which has an embedded chrome debugger - hence at fixed compatible version.
* For our code, Flipper Version 0.176.0 (50.0.0) has been tested to work.

### How to use

When switching the JS engine `make clean_app` is required. `enableHermes`default value is false.

```shell
# switch to hermes
enableHermes=true make clean_app run_app
# continue to use hermes
enableHermes=true make run_app

# switch to JSC
make clean_app run_app
# continue to use JSC
make run_app
```

In the `make run_app` log (not Metro) verify the engine by looking for `[Avni] Hermes Enabled:`

### Flipper screenshot

If you are running JSC you will get a clear error when using the Hermes Debugger menu in Flipper. Do learn about Chrome debugger shortcuts. Command+P in sources to open a file.

![](https://files.readme.io/542790a-Screenshot_2023-02-24_at_9.34.09_AM.png)

### Limitation

Cannot debug the errors that happen on start-up of the app as by the time one attaches the Flipper the application may have crossed the code that one may be interested in debugging.
### How To Use Bugsnag

## Type of errors

### Unfixable errors

If there are errors that are caused by network issues (like network timeout, socket timeout etc) then it is best to ignore those errors. Putting a fix to create more use-friendly error is not a very good use of time because - the number of different type of errors that one may get is very large. Secondly these errors can keep coming from different sources and hence one cannot completely handle them in the code.

DISCARD then IGNORE

### Errors fixed but is not deployed yet

Make a note of this on the Bugsnag issue.

DISCARD

### Errors fixed and is deployed

Note this applies only to web app and server which are online systems. In such cases one should mark it as fixed. This means that if such an issue is reported again then it has not been fixed.

FIXED

### An error is happening too many times

DO NOTHING (as by discarding one may lose the issue after 7 days). Mark Zenhub issue as high priority.

### Errors that should not have been reported

If an error is reported only because the code deals with it as an unhandled exception but it is a normal scenario then in such cases the code should be fixed. e.g. Login Failed because of bad credentials, or access denied, or random requests to the server on endpoints that don't exist (note in this case the client error may be relevant as the client is sending the request to the wrong endpoint but there is nothing to be done on the server).

### Configuration Errors

If an error is reported due to configuration issue then do not ignore the issue. Treat it as normal error.

### Errors without source map (avni-client)

If this happens then perhaps it is due to some miss during the release process. Sourcemap should be uploaded.

Mark as FIXED

## Analysing errors

* We should look at last 30 days, errors happening in production environment and not on developer machines (applies to emulators).
* You can look at additional information available in Bugsnag in its tabs like Release stages, Users, Models etc.
* Usually the higher frequency of error should be paid more attention to, in terms of prioritisation (note this applies across projects i.e. a higher frequency of server error is likely more important to fix than lower frequency client error and vice-versa).
* If an error doesn't have a source map associated with it then raise a bug to get the source map uploaded for that version.
* Use and maintain the bookmark created for analysis called - Production Open Issues.
* Check comment on the issue to check whether the issue is linked to Zenhub issue already. It is not linked via their issue tracking to Github as not sure what that will get us.

## Bugsnag Management

* When ignoring an issue, first discard it and then ignore it.
* Look for issue template in Zenhub/Github and add if necessary.
* Look for Zenhub issue from the comment on BugSnag issue
### Auto Setup Jdk

Every java project in Avni has a .java-version. Developers are encouraged to use `jenv` to automatically configure the right jdk when entering a directory. 

[https://www.jenv.be/](https://www.jenv.be/)
### Bkp And Restore Organisation Database Dump

This document assumes that Postgres server has been setup. It also doesn't list down all the basic steps that are common to any Postgres setup and only lists things that are specific to Avni.

## Overview

The Avni server provides several make targets for creating database backups from different environments. This guide covers how to take organization data backups using the available make commands and then how to restore them.

## Prerequisites

1. **Database Tunnel**: Most backup operations require establishing an SSH tunnel to the remote database first
2. **Database Role**: You need to specify the appropriate database role for the organization
3. **Backup Directory**: Ensure `~/projects/avni/avni-db-dumps/` directory exists

## Database Tunnel Setup

Before taking backups, establish a tunnel to the appropriate environment:

```bash
# Production database
make tunnel-prod-db

# Staging database  
make tunnel-staging-db

# Prerelease database
make tunnel-prerelease-db
```

## Backup Commands

### Production Environment

```bash
# Standard backup (excludes large tables and system tables)
make dump-org-data-prod dbRole=<database_role>
```

### Staging Environment

```bash
# Standard backup
make dump-org-data-staging dbRole=<database_role>
```

### Prerelease Environment

```bash
# Standard backup
make dump-org-data-prerelease dbRole=<database_role>
```

### Local Database Backup

```bash
# Backup local organization database
make backup-org-db orgDbUser=<organization_db_user>
```

## Backup Details

### Standard Backup (`dump-org-data`)

**File Location**: `~/projects/avni/avni-db-dumps/<prefix>-<dbRole>.sql`

**Excluded Tables**:

* `audit` - Audit logs
* `public.sync_telemetry` - Sync telemetry data
* `rule_failure_log` - Rule failure logs
* `batch_*` - Batch job tables
* `scheduled_job_run` - Scheduled job runs
* `qrtz_*` - Quartz scheduler tables

## Usage Examples

```bash
# Example: Backup production data for organization role 'demo_org'
make tunnel-prod-db
make dump-org-data-prod dbRole=demo_org

# Example: Backup staging data with copy tables
make tunnel-staging-db  
make dump-org-data-staging dbRole=test_org

# Example: Backup local organization database
make backup-org-db orgDbUser=demo_user
```

## Output Files

Backup files are saved with the naming convention:

* **Remote backups**: `<prefix>-<dbRole>.sql` (e.g., `prod-demo_org.sql`)
* **Local backups**: `local-<orgDbUser>.sql` (e.g., `local-demo_user.sql`)

## Restoration

### Available Restoration Commands

* **`restore-org-dump`** - For organization databases (full restoration with schema fixes)
* **`restore-dump-only`** - Direct SQL file restoration (simple import)
* **`restore-staging-dump`** - For staging environment restoration

### restore-org-dump Process

The `restore-org-dump` command performs a complete restoration process:

1. **Schema Fixes**: Automatically fixes schema references in the dump file
   * Converts `from form` to `from public.form`
   * Converts `inner join form` to `inner join public.form`

2. **Database Preparation**:
   * Cleans and rebuilds the `avni_org` database
   * Creates the implementation database user with proper permissions

3. **Data Import**: Restores the data from the specified dump file

**Usage**:

```bash
make restore-org-dump dumpFile=<path_to_dump_file> dbRole=<database_role>
```

### Backup Contents

The dump file contains three types of data:

1. **Source Data** - Core application data
2. **ETL Metadata** - Analytics and reporting metadata
3. **ETL Derived Data** - Data that can be regenerated from source data

### Running ETL Service

After restoration, ensure your ETL service is running properly:

1. Start/restart the ETL service
2. Enable and disable analytics database for the organization to retrigger the ETL process
3. Monitor the ETL process for completion

## Important Caveats

### catchment_address Table Issue

The `catchment_address` table has specific considerations:

* **No Row-Level Security**: This many-to-many table lacks row-level security mapping
* **Mixed Data**: Likely contains data not relevant to your organization
* **Manual Cleanup**: Non-relevant data should be manually deleted

**Cleanup Process**:

```sql
-- Delete non-relevant catchment_address data
-- (pseudo code - adapt based on your specific requirements)
DELETE FROM catchment_address 
WHERE catchment_id NOT IN (SELECT id FROM catchment WHERE organisation_id = <your_org_id>)
   OR addresslevel_id NOT IN (SELECT id FROM address_level WHERE organisation_id = <your_org_id>);
```

**Constraint Re-application**:
After cleanup, ensure foreign key constraints are properly applied:

```sql
-- Verify constraints are in place
-- pseudo code
ALTER TABLE catchment_address 
ADD CONSTRAINT fk_catchment_address_catchment 
FOREIGN KEY (catchment_id) REFERENCES catchment(id);

ALTER TABLE catchment_address 
ADD CONSTRAINT fk_catchment_address_address_level 
FOREIGN KEY (addresslevel_id) REFERENCES address_level(id);
```

### Additional Considerations

* **Data Validation**: Verify data integrity after restoration
* **Performance**: Large dumps may require significant restoration time
* **Space**: Ensure adequate disk space for restoration process
* **Permissions**: Confirm database user has necessary permissions

## Troubleshooting

* Ensure the tunnel is established before running remote backups
* Verify the database role exists and is accessible
* Check disk space in the backup directory
* Ensure proper permissions for the backup location
* For restoration issues, check that the dump file path is correct and accessible
## Architecture 1

### Sync 1

## Download and Upload

Uploading data from mobile to server is quite straightforward. Mobile app maintains a realm database based queue as and when entities are changed. During upload process these are uploaded one by one. e.g. when a new individual is registered and then an encounter is performed on the individual - these will be two items in the queue with individual in front (because this is how user will save them).

Downloading entities is far more complex. The type dependency (i.e. Individual should be downloaded after Subject Type is downloaded) is handled in [mobile app code](https://github.com/avniproject/avni-models/blob/0975db9c7fb62849acc1f8887bebf85511ab364f/src/EntityMetaData.js#L426). The main complexity of sync download is partitioning of data described below.

## Strategies to create data partition

An organisation can have a lot of data. All the data may not be required by the field worker. Avni has multiple ways to functionally partition this data and then deliver only the partition(s) that the user should get.

1. Subject location (same applied to child entities)
2. Form types (i.e. subject types, programs, and encounter types)
3. Manual assignment of subjects (same applied to child entities)
4. Based on observations on subjects (same applied to child entities)

## Configuration of the partition

Logically 1,3,& 4 partition types are expressed via Subject Type configuration. One or more of these can be configured and they are ANDed to create narrower (or composite) partition. Form types (2) has been implemented as access control but it has the partitioning effect as far as sync is concerned. It has been implemented technically differently as well.

## Sync Process

Mobile clients downloads in two steps.

1. Get the list of entities types that needs to be synchronised given a timestamp. The timestamp is the last sync time for that entity.
2. Download each of these entity types.

#### Entity Type

These are functional (or implementation) entity types rather than model classes. Functional entity types are same as in code entity types for most entities except those which have sub entity type created by the implementation. e.g. multiple encounter type for which in code there is only one entity type encounter. This can be followed from [here](https://github.com/avniproject/avni-server/blob/436631d6c8ccb935110d498b20102b39ae07eb1c/avni-server-api/src/main/java/org/avni/server/service/SyncDetailsService.java#L42).

## Group Subject Synchronisation

Since group subject is a link between two subject types - hence the sync strategy for both these subject types should be as described below.

* The user should have view access to both the subject types. If group subject type access is present then the sync will expect that view access to member subject type is also present - without checking for it (for now).
* If one the subject types have location based sync strategy then the other should also have this.
* If one of the subject types has sync attributes based sync strategy then other should also have it. The implementation must also make sure that the possible observation values on both group and member subject matches.
* When the group subject is assigned then it implicitly assumed that child subject is also assigned. The other location and/sync attributes based sync strategy of child subject type should completely match the group subject type - if present (so that all entities sync correctly with the client).
### Index

[Sync](doc:sync-1)
## Coding And Internal Design

### Rules Execution In Data Entry Application

One of the key features of Avni is that it allows the execution of rules from various hook points in the mobile app. The same set of rules need to be also run from the data entry app. These rules are written in JavaScript (because of the universality of the language and that front end is also developed in JS using React Native). In a mobile app, the rules can access the complete object graph from the current object (subject, program encounter, encounter and program enrolment) from the offline database. In the web application, this approach cannot be followed without creating terrible user experience and server resource utilisation. This is because one subject could have 200 program encounters, having thousands of observations and referring to hundreds of concepts, in them in some cases which would need to be loaded onto the web app.

The performance gains and resource utilisation be achieved in the following way:

* Do not load all the dependent entities, like program encounter for an enrolment beforehand. Load them lazily. Doing this in the browser is not helpful because each one would require a network round trip - leading to hundreds of calls.
* Run the rules on the server in a separate node process. It cannot be run within Java\*. The web app submits its data to Java server, Java server posts the data to a node process which runs the rule,  returns the result back to Java and that goes back to the web app.
* Node process loads concepts and transactional objects on-demand from the database. Node process will have read-only access to the database.

One of the driving design factor is to keep the knowledge of the rule server's knowledge of avni database to the minimum. Given the size of the JS bundles, it made sense to allow rule server to load from the database instead of serialising from the avni server.

## Responsibilities

**Avni Server (Java)**

* Receives transaction object from the data entry app.
* Loads all the entities required from the database and puts them in objects. These objects have the same contract/data-model as the contract between Avni server and data entry app.\
  The linked objects have to be loaded but which ones? The logic behind loading something and not loading others is that all objects that are likely to influence the rule will be loaded and others won't. A chronological view is taken to decide this. For example - when a subject is created program enrolments are not even created, hence they should not be loaded. It is possible that when the subject is edited the program enrolments exist - but so far we have not tried to support rules which work differently on create and edit. This is because we consider edit to be largely data correction and not part of the workflow. In that sense, Avni transaction objects are all event like and data created are not changed - only new data is created. It is possible that genuine edits of subjects and program enrolments are done - but we work under the limitation that those won't require rules to know the latest data.\
  Lastly, as we are linking subjects to each other, and have individual relationships we would need to modify some of the things below but not too much (this is to keep things simple to develop the first version of this). In absence of that subjects and program enrolments are sandboxes - not dependent on other subjects and program enrolments.\
  In all of the following, the current object is always loaded.
* **Subject** - Nothing else.
* **Program Enrolment** - Parent subject
* **Program Encounter** - Parent enrolment and sibling program encounters of all encounter types, older than current program encounter's DateTime. It should also include sibling planned program encounters. Include canceled also but only the ones which are older than the current program encounter's DateTime.
* **Encounter** - Parent Subject, sibling older encounters (not program encounters) of all types and older program enrolments. It should also include sibling planned encounters. Include canceled also but only the ones which are older than the current encounter's DateTime.
* Load applicable rules database identifier and send it to the node server. Database identifier to be used is UUID and primary key.
* Receives rule execution errors from rule server and saves it to the database.

**Avni Rule Server (node)**

* Maps the data received from Avni server to the data model expected by the rules.
* Loads rule code from the database based on database identifiers provided.
* Executes the rule (of course)
* Puts together rule errors and sends back to the Avni server in the response.

*We tried using Rhino but there was too much mapping code which is not easy to understand. The rules access objects using something like programEncounter.enrolment.observations - implementing which in Rhino is quite difficult. We also noticed that the performance was quite poor. The date values were coming out different. And we were only scratching the surface with a few simple rules.*
### Sagas Middlewares Reducers And Redux Store

Avni web app uses redux-saga, redux stores, and react admin. Redux Store is where everything comes together. It is made of up all different types of middleware and reducers.

**Different types of middlewares and reducers**

* Framework level (React routing, React Admin Form)
* Saga
* Avni Application (thunk middleware)

**About Saga (Saga provides frontend cache)**\
It is composed of React Admin Saga and Avni application sagas.\
Saga (watcher functions) watches for specific redux actions to be dispatched. The watcher calls the mutating reducers which set the data in the store. The watcher could also return the data back if it is already present.

One implication of having multiple functional-only sagas is that each saga can have a different cache and *currently*, there is no way to clear the cache across sagas. If possible there should be common sagas that can be used across modules.

**About Application Reducers**\
One should not that the reducer JS files provide the reducers but also provide convenience functions to invoke the reducers.

### To understand the full wiring - in the source code follow from

*index.js ->> MainApp ->> common/store -> createStore.js*

**createStore.js is the main file to understand the wiring**\
&#x9;sagaMiddleware (generic error handling here)\
&#x9;Redux store with root reducer\
&#x9;Root Saga

### TBD

* What are the different frontend modules?
  * UI and non-UI
* What type of cross-module communication is required?
  * to support workflow that go across modules
  * management of cache across modules
* What is the mapping between modules, redux store, and sagas?
  * Currently, one big store is created. Should this be multiple redux stores?
* Ability to work on only some modules so that the hot loading works faster.
### Avni Model Persistence Framework

### History

There were two ways to register object schema in the realm database.

1. Provide a class (and realm will look for "schema" property in the class to get the definition.
2. Provide a plan JavaScript object describing the object's schema.

In earlier versions of Avni models with Realm, we were using approach 1. This meant that when we did db.objects(...) the objects returned were of model class with all the domain methods on it.

### On upgrade

On the upgrade of Realm to 10.x, taking approach 1 now required that the registered class must have a constructor which takes specific arguments and extends from Realm.Object class (calling it super). This by itself was not an issue but the model class now cannot be constructed outside the realm database context (e.g. db.write taking a code block). One could not simply do new Encounter() anymore.

The above was a huge issue for us since we used our models in service, actions, and rules - in the avni client and in the web app. Avni models were imagined to be plain rich domain objects (like we use with Hibernate). Hence we had to choose option 2 and create the model class objects before handing them over to the rest of the code. Note that the rest of the code uses fields as well as methods of model classes.

### Solution adopted

When an object is loaded from the realm using db.objects(...).filtered(...) we will objects that are not instances of our model classes - as the realm is not aware of the model class. So before these objects are given to the rest of the code to call methods etc, we wrap them under model classes.

Since all objects fetched from the database come from db.objects(...), the db class is proxied. See RealmProxy class which proxies the actual realm class. Other realm classes like RealmResults, RealmList, etc can also be proxied now - so see classes RealmResultsProxy, RealmListProxy, etc. These classes ensure that the object getting back to the caller is model classes or collections that have models.

### What does the model look like?

See ProgramEnrolment ([https://github.com/avniproject/avni-models/blob/master/src/ProgramEnrolment.js](https://github.com/avniproject/avni-models/blob/master/src/ProgramEnrolment.js)) as an example.

* constructor with that argument
* note the getters/setters delegating to that

`that` is the actual object that realm got out from the database. Our proxies when creating model class instances pass `that` to the model class. Model classes in getters for other model object instances (like EncounterType) or model collections (like Encounters) instantiate the model classes backed by realm. You can follow the helper methods in PersistedObject which do this.

`that` is not meant to be used outside these framework classes (PersistedObject, framework classes, etc). See all framework classes here - [https://github.com/avniproject/avni-models/tree/master/src/framework](https://github.com/avniproject/avni-models/tree/master/src/framework)

When model instance classes are saved then we get hold of the underlying object `that` and persist that. `that`s are connected to children `that`. e.g. `that` in program enrolment is connected via program encounters or encounter type property to a `that`(s) correspond to them. Also, model instance ProgramEnrolment is not linked to EncounterType and ProgramEncounter model class instances.

### Pattern of usage

When we do db.objects(...) or db.objects(...).filtered(...) and we want to our model class instances, we can simply do .map(\_.identity)

### Limitations

* We cannot use JS spread operator in model objects
* We cannot use Object.keys on model objects (as it would give back that which is not what we want)
* lodash binds to Array.prototype functions that mutate array ('pop', 'push', 'shift', 'sort', 'splice', 'unshift'). this implies that if lodash is used on RealmListProxy which is an array as it extends from it, our overridden methods will not be called. Hence we cannot use these methods to mutate. We usually don't use lodash to mutate realm lists, but if it is done then we can simply use array methods available to us which have been overridden in RealmListProxy.

### Bypass for performance reasons

When we display a list of objects in the mobile view (like Individual Search Results), we are providing infinite scrolling to the user. Hence we cannot follow the approach of converting all the realm objects to model instance objects and providing it to the <FlatList/>. Hence in this case we can use the function getUnderlyingRealmCollection from our model framework. The underlying collection is provided to FlatList and when renderItem or renderRow etc are called then we materialize it to model class instance.

### More details

* RealmListsProxy is further proxied by JavaScript Proxy which handles length and indexer \[] operator. It can be seen here - [https://github.com/avniproject/avni-models/blob/master/src/framework/RealmResultsProxyHandler.js](https://github.com/avniproject/avni-models/blob/master/src/framework/RealmResultsProxyHandler.js)
* We had to implement custom toJSON as realm toJSON methods on realm objects don't work. They have a fix it seems which works only in hermes version of the JS engine. The code can be seen here - [https://github.com/avniproject/avni-models/blob/d54b6fcd2c8503ba5d5b55b871d93cbcaa8e7bb5/src/PersistedObject.js#L41](https://github.com/avniproject/avni-models/blob/d54b6fcd2c8503ba5d5b55b871d93cbcaa8e7bb5/src/PersistedObject.js#L41). toJSON is required sometimes when we post the models objects to the server.
* We should not declare properties in JS class like this anymore - [https://github.com/avniproject/avni-models/blob/30cdfffa23eb961055875cadd454a133040cfc4f/src/SubjectMigration.ts](https://github.com/avniproject/avni-models/blob/30cdfffa23eb961055875cadd454a133040cfc4f/src/SubjectMigration.ts) as these will come from getters and setters

### TOOL - INTELLIJ LIVE TEMPLATES

**for defining properties (as they can be mistake-prone)**

#### for entity collection properties

```javascript
get $prop$() {
    return this.toEntityList("$prop$", $entity$);
}

set $prop$(x) {
    this.that.$prop$ = this.fromEntityList(x);
}
```

#### for sub-entity properties

```javascript
get $prop$() {
    return this.toEntity("$prop$", $entity$);
}

set $prop$(x) {
    this.that.$prop$ = this.fromObject(x);
}
```

#### for primitive properties

```javascript
get $prop$() {
    return this.that.$prop$;
}

set $prop$(x) {
    this.that.$prop$ = x;
}
```
### Contract Request Response

Avni server internally uses entities or domain model based on hibernate. These domain entities are not directly serialised into or deserialised from external formats, except in some cases. The external formats Avni Server currently has are as follows.

1. Web app request
2. Web app response
3. Bundle line item (both export and import are same)
4. Mobile app request
5. Mobile app response
6. External API request
7. External API response
8. Request made to rule server
9. Response received from rule server
10. Custom formats for integration with external systems like Glific.

<br />

In Avni code while we would like to reuse data transfer object classes as much as possible but currently:

* In order to maintain stability of mobile app, we tend to keep their formats separate.
* Rule server formats are not very well thought out yet, as it may be refactored in future, hence they are also separate. It may become internal to Avni server in future, so separate formats may not be required.
* External API request/responses are designed for external consumption. Their formats look like what one implementation may see their data as and not how Avni represents data.

<br />

Web app request, response, and bundle formats are considered `online`, meaning these can be changed and fixed in more agile fashion. Their are no backward compatibility requirements for these formats.

<br />

### Internal design of web app and bundle formats.

1. Avni Contract (id and uuid). Abstract class. The class is called CHSRequest, but can be renamed.
2. Functionality specific contract. Abstract class. `abstract class ReportCardContract extends AvniContract`. These can contain all the primitive values as their representation doesn't change across bundle, request and response.
3. Concrete classes for request, response, and bundle - each extending from functionality specific contract. e.g. `class ReportCardResponse extends ReportCardContract`. Here we can add all related entity/entities.
   1. Web request should use id or uuid for related entities. In case of collection - list of ids or uuids.
   2. Bundle must use uuid or list of uuids for related entities.
   3. Web response can use full response object for related object(s).

<br />

### Related entity

Related entity is the entity which is required only for reference and are not modified by the client. For example - when editing `ReportCard` in the web app, `StandardReportCardType` is not changed.
### Avni Server Db Changes

## Ensure access for newly created DB tables for all Organisation DB\_Users

In Avni Server, whenever we create a new DB Table using migrations, ensure that you include a `grant_all_on_table` command to make it accessible for all organisation db\_users.

```Text Command
SELECT grant_all_on_table(a.rolname, '<specify table name>') FROM pg_roles a WHERE pg_has_role('openchs', a.oid, 'member');
```
```Text Example
SELECT grant_all_on_table(a.rolname, 'organisation_status') FROM pg_roles a WHERE pg_has_role('openchs', a.oid, 'member');
```

## Whenever a new DB table is created, include it for cleanup during Deletion of Organisation Data

For a newly created DB table, figure out the bucket it should fall under and include the table in corresponding OrganisationService.delete\*\*\*() method. Also recreate the content, if its a basic admin config data for an organisation.

### Definition for classification of Avni DB tables into types

* **Transactional Data**: All DB tables that are used to store Individual(Subject) related details. Ex: Individual, Encounter, ProgramEnrolment, ProgEncounter, Checklist, UserToSubjectAssignment, etc..
* **Admin Config Data**: All data which is accessible from the "Admin" section of the Avni-webapp

<Image align="center" src="https://files.readme.io/3174f36-Screenshot_2024-08-14_at_12.14.14_PM.png" />

* **Metadata**: Rest of the DB tables **specific to an organisation**, that is **not** part of **either "Transactional"** or **"Admin Config"** Data
* **System config data**: Tables corresponding to
  * CRUD of SuperAdmins
  * CRUD of Organisation or OrganisationGroup 
  * Generic System data which is shared across Organisations. Ex: Privilege, ApprovalStatus, etc.

## Use Repeatable migrations for Creation of Views, Functions and Triggers

Always include psql Create/replace views, functions and triggers within respective Repeatable migrations file and not in any version migrations. This is due to the fact that 

* We would need to change the view based on any modifications to the tables its based on 
* And in test DB, we'll recreate the DB and apply creation of views at the end after all the versioned migrations.
# Support

## Configurations From Backend

# How to make the "Total" default report card always appear.

Run the below script

```pgsql
set role <org_name>;

update organisation_config
set settings = settings || '{"hideTotalForProgram": false}' ::jsonb,
    last_modified_date_time = now()
where organisation_id = <org_id>;
```
## Recreate Etl Schema For An Implementation

### Monitoring Status Of Etl Runs For An Environment

In-order to ease the monitoring of ETL runs across all organisations of an environment, we have created following Reports:

## Production

<HTMLBlock>{`
<iframe
    src="https://reporting.avniproject.org/public/question/9935b5fc-da79-4f79-a351-46a8c0222560"
    frameborder="0"
    width="800"
    height="600"
    allowtransparency
></iframe>
`}</HTMLBlock>

## Staging

<HTMLBlock>{`
<iframe
    src="https://reporting.avniproject.org/public/question/b44773b9-fdc5-4527-b08f-d2ed06f4ba1c"
    frameborder="0"
    width="800"
    height="600"
    allowtransparency
></iframe>
`}</HTMLBlock>

## Pre-release

<HTMLBlock>{`
<iframe
    src="https://reporting.avniproject.org/public/question/206aaaff-a782-490b-ae11-b3e5dfa57823"
    frameborder="0"
    width="800"
    height="600"
    allowtransparency
></iframe>
`}</HTMLBlock>

<br />

## RWB Prod

<HTMLBlock>{`
<iframe
    src="https://reporting.avniproject.org/public/question/577f98e4-22eb-461b-a94c-a3528ee68c18"
    frameborder="0"
    width="800"
    height="600"
    allowtransparency
></iframe>
`}</HTMLBlock>

To specifically look at the **Failed** ETL for Production Environment  Live/ UAT orgs, you should make use of following report:

## Production ETL Failures only

<HTMLBlock>{`
<iframe
    src="https://reporting.avniproject.org/public/question/ba0ba126-c94a-4a52-acea-b2f518172527"
    frameborder="0"
    width="800"
    height="600"
    allowtransparency
></iframe>
`}</HTMLBlock>
### Index

## Enabling/Disabling

### Enabling Analytics via Admin view in Webapp

ETL enabling and disabling for an organisation has now been changed to function via APIs called from the webapp. The act of enabling analytics for an org via the webapp admin view also creates the required job and schedules it to run immediately and every hour from then on (on a best effort basis\*).

![](https://files.readme.io/2b4d900-image.png)

#### Ad hoc runs

If there is a need to run ETL for an organisation in an ad hoc fashion (to check if fixes to broken ETL for an org are working for example), you can disable and then enable analytics for that org. This will remove the previously existing job for the org and create a new one that will run immediately (within a minute on a best effort basis\*). 

Note: This does not recreate the ETL schema for the org. Follow the steps below to recreate the schema if required. 

##### Best effort basis

 Subject to available resources on the server and currently running jobs if any.

## Recreating ETL schema for an organisation

Clearing ETL schema and rows corresponding to it in the database. The next run of the ETL process will recreate the schema and database.

Steps: (please note if you are recreating for an organisation that uses reporting views then after recreation also generate the reporting views)

* Disable ETL for the org using the screen in the previous section in the webapp.
* ### For standalone organizations

```Text SQL Function
select delete_etl_metadata_for_schema('$impl_schema', '$impl_db_user', '$impl_db_owner');
```
```sql
set role "$impl_schema";  
drop schema if exists "$impl_schema" cascade;

delete from entity_sync_status where db_user = '$impl_db_user';
delete from entity_sync_status where schema_name = '$impl_schema';

delete from index_metadata where table_metadata_id 
	in (select id from table_metadata where schema_name = '$impl_schema');

delete from column_metadata where table_id 
	in (select id from table_metadata where schema_name = '$impl_schema');

delete from table_metadata  
		where schema_name = '$impl_schema';
```

* ### For organization groups

```Text SQL Function
select delete_etl_metadata_for_org('$impl_schema', '$impl_db_user');
```
```sql
set role openchs;  
drop schema if exists "$impl_schema" cascade;

delete from entity_sync_status where db_user = '$impl_db_user';
delete from entity_sync_status where schema_name = '$impl_schema';

delete from index_metadata where table_metadata_id 
	in (select id from table_metadata where schema_name = '$impl_schema');

delete from column_metadata where table_id 
	in (select id from table_metadata where schema_name = '$impl_schema');

delete from table_metadata where schema_name = '$impl_schema';
```

* Enable ETl for the org using the screen in the previous section in the webapp.

## Subject Type, Program and Encounter Type names

ETL service tries to automatically create the table names based on the subject type, program and encounter type names. Since these are also namespaced the names for these tables are as long as possible in postgres to support uniqueness. But there could still be clash in the names due to which the ETL process may fail to create tables. To ensure that this doesn't happen please ensure that the first six characters for the following are not the same. Please note that it is scoped, i.e. e.g. you can have same starting six characters for two encounter types under different programs.

* two encounter types within same program
* two encounter types within same subject type
* two programs inside the same subject type

### Trimming configuration on ETL table names

Refer to below link for current trimming configuration on ETL table name, when the original name exceeds length of 63 bytes(63 ASCII Code characters).

[https://github.com/avniproject/avni-etl/blob/main/src/main/java/org/avniproject/etl/repository/rowMappers/TableNameGenerator.java#L15](https://github.com/avniproject/avni-etl/blob/main/src/main/java/org/avniproject/etl/repository/rowMappers/TableNameGenerator.java#L15)
## Rule Failure Telemetry

## About rule failure

Avni doesn't stop the users from using the app and filling the forms when the rules triggered fail. These errors get stored on the mobile device's database and then posted to the server as part of the sync process. Only if the Sync completes successfully, do the RuleFailureTelemetry entries on the mobile device get cleaned-up, otherwise, the keep getting created as duplicates as part of every sync there onwards. This behaviour is to ensure, we do not loose RuleFailures before they are successfully synced to the backend server and stored in primary Database.

The app designer displays these errors from the Rule Failures tab. On clicking a RuleFailure entry, the errorMessage details are visible. These can be also closed from there, by selecting corresponding CheckBoxes and clicking on "CLOSE ERRORS" button.

<Image align="center" src="https://files.readme.io/755b159-Screenshot_2024-05-06_at_4.22.58_PM.png" />

## App designer fields of rule failure entry

### Which Rule

* Rule UUID - UUID of the rule (other details can be picked from the database)
* Source - Possible values are present [here](https://github.com/avniproject/avni-server/blob/master/avni-server-api/src/main/java/org/avni/server/domain/enums/ruleFailure/SourceType.java). This should not be null (currently there are some old entries for which it is null). This indicates what is the type of rule for which this error happened.

### On which entity

* Individual UUID - The UUID of the subject on whose data edit/create this error happened. This will be not be present for EntityType=ReportCard - as ReportCard rules span across subjects.
* Entity - `UUID` + `Type of the Entity`. For report card rule errors this field will be null
  * Type of the entity - Possible values are named [here](https://github.com/avniproject/avni-server/blob/master/avni-server-api/src/main/java/org/avni/server/domain/enums/ruleFailure/EntityType.java).
  * UUID - When the type of entity = `Individual` then the UUID and `Individual UUID` field will be same.

### Other details

* Message (database field error\_message + stack trace).
* Error date - The date on which error happened on the user's device. The clock used is that of the device.
* App - Android or Web. null value = Web. This indicates which type of channel on which this error happened.

### Error management

* Status (Open, Closed)
* Closed date - Date on which on the error was closed.
# End User Guide

## How To Guide Setting Up Locations Via Csv Upload

## Definitions

Below is a list of definitions that are essential for understanding this document.

* **Locations:** These can be names of Villages, Schools or Dams, or other such  places which correspond to Geographical locations in the real world.  
* **Location Types:** As its name suggests, Location Types are used to classify Locations into different categories. Ex: Karnataka and Maharashtra are 2 locations that could be classified into a single Location Type called “State”. Additional caveats related to the Location Type are as follows:  
  * You may associate a “Parent” Location Type for it, which would be instrumental in coming up with Location Type Hierarchy  
  * Each location type also has an additional field called “Level” associated with it. This is a Floating point number used to indicate relative position of a Location type in-comparison to others.   
  * There can be more than one location type with the same “Level” value in an organisation.  
  * The value for “Level” should less than the “Parent” Location Type’s “Level” field value  
* **Location Type Hierarchy:** Location types using the “Parent” field can construct a hierarchy of sorts. Ex:  State(3) \-\> District(2) \-\> City(1)\
  A single organisation can have **any** number of Location Type Hierarchies within it. Note that the example is a single hierarchy.  
* **Lineage:** Location Type hierarchy, are in-turn used to come up with Location lineage. Ex: Given a “Location Type Hierarchy” of State(3) \-\> District(2) \-\> City(1) being present, we could correspondingly create Location “Lineage” of the kind “Karnataka, Hassan, Girinagara”, where-in “Karnataka” corresponds to “State” Location-type, “Hassan” to “District” and “Girinagara” to “City”.

## Overview

In Avni, Locations refer to geographical entities which could be a State, Village, Schools, Hospital, etc.. where an organisation provides services. It plays an important role in identifying the “Where” aspect of the data being captured / service that was provided. Locations are also used to group together Avni entities (Subjects, Encounters, GroupSubjects) based on their Geographical proximity, using the Catchments. This simplifies the assignment of Avni entities in the Geographical area of influence of a Field-Worker to him/her as a single composite entity rather than individually allocating each entity to the User.

Avni **“Upload\- Locations”** functionality, allows Avni Admin Users to perform following actions in **bulk**

* Create new locations   
* Update name, GPS coordinates and other properties for existing locations  
* Modify the parent location for an existing location and there-after reflect the change in lineage for it and all its children

This is achieved by means of uploading a CSV(Comma-separated Values) file of a specific format. Please read through the rest of the document to learn more about initializing Location Types and setting up large amounts of Locations for each of those types for specific Location Type Hierarchy.

## Steps to create Location Types Hierarchy

### Navigation to the Bulk Uploads screen

* Login to Avni Web Console 

![](https://files.readme.io/35932d9141d5744753f1730b6b5a4aa04a4b755a9fd18c25586ca98b58639177-image.png)

* Go to **Admin** app

![](https://files.readme.io/b51402bda3d8cf3a6aefd515b8e19cecc2c0200c5c557ae973cb38d3fa4e172e-image.png)

* Click on the **“Location Types”** section

![](https://files.readme.io/b846e3e44e146727fc20ad58b6c881cb8d2a96ac3dcdac90ae90f84b1fc81d2f-image.png)

### Create Location Types Hierarchy

When we start with creation of Location types, we do so from the highest Location type to the lowest in descending order of its level within the Location Hierarchy.

For example, to set up a Location Hierarchy of State(3) \-\> District(2) \-\> City(1), you would repeat the below process 3 times, first for “State”, then “District” and finally for “City”.

#### Create Location Type

1. Click on “CREATE” button on the top right corner, in “Location Types” screen  
2. Initialize “Name” field, to an appropriate String value starting with Upper-case Alphabet  
3. Initialize the “Level” field to appropriate Numeric value, which would be lower than its “Parent” Location Type’s “Level” value. Ex: “2.0”, “3”, “4.5”  
4. Associate “Parent” Location Type, as long as this isn’t the Highest Location type in its hierarchy  
5. Save the Location type, by clicking on the “SAVE” button

![](https://files.readme.io/2c1cb4ff350002b55cb86e570dc8f22baf8f5c5a1738bf1575def95eb6a7e1a3-image.png)

#### About Multiple Location Type Hierarchies within a single organization

Avni allows for an organization to have more than one Location hierarchy. The hierarchies could be linked at a specific location type or otherwise.

##### Example for Multiple Hierarchy joined at a common location type

![](https://files.readme.io/785775716ea75efb92621f34ebf17f014cb5f1b5a478a2c4e7d1ffff90e26b2a-image.png)

##### Example for Multiple Hierarchies not linked with each other

![](https://files.readme.io/4c530ae55ff631715c497aef020ef6591e2189c5df01b3bc034a34797acc6bc4-image.png)

### Review Location Types Hierarchy

Do a quick review of the Location Types Hierarchy, to ensure that its created as per requirement.

![](https://files.readme.io/6fccd280624ae8da4252f2bf7b3bb2bdb4950fabd5f7132f2820cc4849d6b628-image.png)

## Steps to create Form of type Locations (Optional)

For your organization, if there is a need to specify additional details as part of each Location, then Avni allows you to configure a “Location” type Form, which can be configured to store those additional details as Observations for each Location. This is an optional feature to be done only if such need arises.

* Navigate to the App Designer app

  ![](https://files.readme.io/45b6cf059a148183cb5597b2e09a93dc6d705c9af4eb09f99df0c9cdbd246050-image.png)
* Click on Forms in the left side tab, to open up the Forms section.  
* Create a new Form of type “Locations” by clicking on the “CREATE” button on the Top-Right corner of the screen.  

  ![](https://files.readme.io/2ad5b18293dfb28f217f3a87bd633dccb766d962a56c68f2c3fdb4b1611e6237-image.png)
* Setup the Locations type Form in the same way as you do for any other Avni Entity Data collection Forms. See below sample screenshot for reference.

  ![](https://files.readme.io/b5c2e8c75e8660ff5eaa3fba63826e1b2898aab32cf942beeec47d8cba11dd19-image.png)

## Steps to create Locations via CSV upload

### Prerequisites

* **Ensure Location Types Hierarchy already exists**\
  In order to start with the locations upload in the Avni app, organisation needs to have Location Types created in the requisite hierarchical order.  
* **Ensure Location Form if needed, has already been configured**\
  If your organisation needs additional properties to be set during Location creation, then ensure that you have configured a form of type “Locations” in the aforementioned manner 

### Navigation to the Bulk Uploads screen

* Login to Avni Web Console

![](https://files.readme.io/93db597e0607f374895d82942c940eca42ff9954f008e28fb2933b459a2bc280-image.png)

* Go to **Admin** app

![](https://files.readme.io/a0bfd4fcaa19d3275985307bdc624b89237c508ee94eb2a9f6a992c0f3d30348-image.png)

* Click on the **“Upload”** section

![](https://files.readme.io/81b9a7ec02dcba7ee588ceb2c4a6a508e9346610ef43e9b29c2c30ba0fb6b8fa-image.png)

### Download sample CSV file

In the Avni “Admin” app, “Upload” section, we provide the users with an option to download a sample file, which would give you a rough example for coming up with the required “Locations” upload CSV file.

The locations upload file format is different for the “Create” and “Edit” modes, therefore choose the appropriate mode and apply the same, when uploading the file later as well.

If your organization has multiple Location hierarchies, then you would have to select the specific location hierarchy for which you need the sample file. This is applicable only for “Create” mode.\
Finally, click on the “Download Sample” button, to get the sample file.

![](https://files.readme.io/31cbacad108b87cdd4a90ad196fbd4b879761676b333fe0cdfbd7baa6814f30c-image.png)

#### Sample Locations upload csv file screenshot

As part of the sample Locations csv file downloaded, you’ll have following information available to you for quick reference:

* All Headers configurable for the selected Mode and Location hierarchy  
* Descriptor row with guidance and examples on what values should be specified for each of the columns

1. **Create** mode

   ![](https://files.readme.io/00dc42970a69fea2eac1a114935cb3b2cbefe588aa540a5147cd51e7bdc930bc-image.png)
2. **Edit** mode

   ![](https://files.readme.io/42250968ba2ed5feec3e8da58e4c0521e1aa8bbe1418530de90a3f61a4eaf71f-image.png)

### Compose Locations upload CSV file

1. ### "Create" Mode

#### Headers Row

The first row of your upload file should contain Location types, arranged in descending order of their Level, in the selected Location Hierarchy from Left to Right, as comma-separated values.\
Refer Sample Locations Upload documents available [here](https://docs.google.com/spreadsheets/d/1R3l_tRUKZ7_WoZa4QIRctecFqJZoB2jdltyKUPMSD0Q/edit?usp=sharing) for Location Hierarchy of: Block(3) \-\> GP(2) \-\> Village/Hamlet(1). This is followed by “GPS Coordinates” and other Location properties name as column names.

![](https://files.readme.io/1a1dff92a0cb11f31704ee8f6d87ac78013ae49e56e8b878dc8657bb96762ece-image.png)

#### Descriptor Row

The second row of your upload file can optionally be a descriptor row, retained as is from the sample location upload file downloaded earlier. Avni would ignore the row, if its starting text matches the Sample file Descriptor row content’s starting text.

#### Data Rows

Entries provided in each of the address-level-type columns would be created as individual locations. (For example, the “Jawhar” block, “Sarsun” GP, and “Dehere” village will be created as a unique location with the appropriate location lineage, as specified during upload.)\
If the Parent locations already exists during a new location creation, then they are not re-created and are just used as is to build the location lineage.

#### GPS Coordinates

In-case, user would like to set the GPS Coordinates for locations during upload, then they would need to additionally specify values in the "GPS coordinates" column. The value for this column should be of the Format “\<Decimal number\>,\<Decimal number\>”.\
Ex: “123.456789,234.567890”, “12.34,45.67”, “13,77”

#### Additional Location Properties

Avni allows an organisation to configure Forms of Type “FormType.Location” for enabling inclusion of additional properties for each Location. These Forms are made up of the same building blocks of Pages and Questions like Forms of other types.

In-order to configure Location properties, you would need to specify the Concept “name” as the Column Header and specify the value for each of the locations in the corresponding columnar position.

![](https://files.readme.io/d779bbd3674a887c54b1f320d9e7cceb881b841f3360697f9d450c0bbf2795d1-image.png)

2. ### “Edit” Mode

This mode is to be used to perform bulk updates to locations. The type of updates allowed are as follows:

* Update name of existing locations  
* Update GPS coordinates and other properties for existing locations  
* Modify the parent location for an existing location and there-after reflect the change in lineage for it and all its children

#### Headers Row

The first row of your upload file, would usually contain following data as columns headers:

1. Location with full hierarchy  
2. New location name  
3. Parent location with full hierarchy  
4. GPS coordinates  
5. Multiple Location Properties name  

Refer Sample Locations Upload documents available [here](https://docs.google.com/spreadsheets/d/1EFpeMuQe-BEGvghUAeQWsLumfJ88B2Iv8w-lVqzQX4c/edit?usp=sharing).

![](https://files.readme.io/9d903fe0c5fe2d9d8fc93622312ef7e23efbc3fd6c2d811ade340d362c37db39-image.png)

#### Data Rows

Entries provided for the columns listed below would be used as specified here:

* Location with full hierarchy (Mandatory): Used to identify the specific location to be modified  
* New location name (Optional):  Used to specify the new title value for a location  
* Parent location with full hierarchy (Optional):  Used to identify the new parent location to move this location to. Ex: Move “Vil B” to “PHC C, Sub C” from “PHC B, Sub B”  
* GPS coordinates (Optional):  Used to update the GPS coordinates. Format:  “\<Double\>,\<Double\>”. Ex: “123.456789,234.567890”  
* Values for multiple Location Properties columns that are part of the Form of type “FormType.Location”. These again are optional.

#### Edit Row validations

1. If the “Location with full hierarchy” does not exist during location updation, then the update operation fails for that row.  
2. Atleast one among the following columns should have a valid value for the updation operation to be performed successfully for that row:  
   * New location name  
   * Parent location with full hierarchy  
   * GPS coordinates  

### Upload the CSV file

Project team then downloads the sheet in the CSV format. Navigate to the “**Upload”** tab of the Admin section, and perform the following steps to upload the file:

* Select the “Type” to be “Locations”   
* Specify the file to be uploaded using the “CHOOSE FILE” option  
* Select the appropriate “Mod&#x65;**”** of CSV Upload  
  * Create: For creating new locations  
  * Edit: For updating existing location’s Name, Parent, GPS coordinates or other properties  
* Choose appropriate “Location Hierarchy” (Applicable only for “Create” mode)  
* Click on the “Upload” button

![](https://files.readme.io/225211b913de07fb56c6a7676b1b6c88a78aecc2c92f97833c646b304b8ce6c4-image.png)

## Monitoring Progress of the Upload

Avni provides users with an easy way to monitor the progress of the CSV file uploads. In the same “Upload” tab of the Admin section, the bottom-half contains a list of all uploads triggered by users of the organization.

![](https://files.readme.io/ac1a32f7738e8035e5ad076005a218693044cfc7f00348d080bdd3a3e50d2d22-image.png)The “Status” column will indicate the overall status of the specific upload activity. With other columns like “Rows/File read” , “Rows/File completed” and “Rows/File skipped” indicating the Granular row-level progress of the file processing.

The final “Failure” column, will consist of Hyperlinks to Download an Error Information file, which would be present, only upon Erroneous completion of the upload activity.

![](https://files.readme.io/f38defc143785372fa7b8963c14e555d89eaa5feebe009aa7d55a20a40445bbf-image.png)

## Verification of Uploaded content

On successful upload of a file, the Project team can verify from the Locations tab in the “Admin” application, whether the uploaded content was indeed processed successfully as per requirement. Search for the newly created Locations and click on the same to view its details, to confirm that its created with exact configuration as intended.

![](https://files.readme.io/8457449146f1308efc4d6a9e690368dd3818a1ac9d78f329004771e7422d4fb7-image.png)
## Users And Catchments

## How to guide: Creating Users and Catchments from the Avni web-app

To access the features of the Avni app, users need to have a unique username and password to log in to the app and perform the activities as and when required. These login credentials can be created through Avni web-app where certain permission can be provided to each unique user as per the area of work and authority to access the data generated in the app.

### Prerequisites before creating the users:

The following items must be configured in the web app before proceeding with the user creation process.

1. Location Hierarchy, Locations ([Refer to this guide \[TO BE ADDED\]]())
2. Languages
3. User Groups ([Refer to this guide](https://avni.readme.io/docs/user-groups))
4. Catchments

### Creating Catchments:

A catchment is a group of locations that are serviced by a user i.e. the locations that a user works in. Only data captured against the locations within the catchments assigned to the user are synced to the android app of the user. The following steps can be followed to create catchments in the web app:

1. Navigate to the admin console

![alt\_text](https://files.readme.io/d32ed8d-image8.png "image_tooltip")

2. Click on the catchments and create a catchment

![](https://files.readme.io/8c7e39e-image2.png)

<br />

3. Provide a unique name for the catchment in the field given below.

![](https://files.readme.io/537772e-image7.png)

<br />

4. Add the locations which are to be part of the catchment.

![](https://files.readme.io/4220102-image11.png)

<br />

### Creating Users:

Once the above-provided prerequisites have been created successfully, we can proceed with the user creation process.

1. Navigate to the admin console in the Avni web app.

![](https://files.readme.io/d32ed8d-image8.png)

<br />

2. Click on the Users section and Create button as given below.

![](https://files.readme.io/a60ebcd-image9.png)

<br />

3. Provide a unique Login ID for each user. Login ID allows to have alphanumeric values which will be followed by @ProjectName. A Login ID that is already in use cannot be re-used to create another user. **Note:** The login name is a case-sensitive field. The user needs to provide the same login ID while logging in to the Avni app.

![](https://files.readme.io/18b704a-image4.png)

<br />

4. While creating a user, the administrator can provide a custom password by clicking on the toggle button highlighted below. This would populate two additional fields to enter a custom password and verify it by giving the same password again. 

![](https://files.readme.io/ee06b59-image3.png)

<br />

5. In case the custom password toggle button is not on, the system will continue with creating the default password. The default password would have the first four letters of the username followed by the last four digits of the mobile number provided while creating the user.
6. Provide the full name of the user along with mobile number and email address. The same mobile number and email can be used multiple times to create different users.

![](https://files.readme.io/6185872-image5.png)

<br />

7. Catchment created as given in this guide can be set here while creating the user. The system doesn’t allow to assign more than one catchment per user.

![](https://files.readme.io/ef2a51f-image10.png)

<br />

8. Set user groups as per the operational roles of the user. Multiple user groups can be assigned to a user. 

![](https://files.readme.io/511929c-image6.png)

<br />

9. Further settings specific to the user can be setup to customise the user experience 

   1. Preferred Language
   2. Track location - Switches on visit location tracking on the Field App
   3. Beneficiary mode - Enables the Beneficiary mode - a limited mode that allows beneficiaries to use the Field App
   4. Disable dashboard auto refresh - Disables Auto-refresh of MyDashboard of the Field App. Use if the dashboard is slow to refresh
   5. Disable auto sync - Disables automatic background sync. Use it if you want to trigger sync only manually
   6. Register + Enrol - Adds extra quick menu items on the Register tab to register and enrol to programs in a single flow
   7. Enable Call Masking - Enables Exotel call masking for the user
   8. Identifier Prefix - Identifier prefix for ids generated for this user. See[ documentation](https://avni.readme.io/docs/creating-identifiers) for more information
   9. Date Picker Mode - Set default date picker for the Field App
   10. Time Picker Mode - Set default time picker for the Field App

   ![](https://files.readme.io/a73b680-image1.png)

   <br />
## User Groups

### Why are User Groups needed?

Avni users can be grouped into different Users Groups based on their roles and responsibilities and different permissions can be given to them. It ensures that users have the right access levels to perform their tasks effectively while maintaining data integrity:

1. **Role-based Access Control:** User groups ensure each user gets permissions suited to their role. For example, field workers, supervisors, and administrators may need different access levels.
2. **Permission Management:**  Instead of setting permissions individually, administrators can manage them for entire groups, reducing errors and saving time.
3. **Enhanced Security:** User groups help to  define which group can access certain data or perform certain activities in the Avni app like registration, enrolments, edits, and canceling the visit. This 
4. **Customization and Flexibility:** User groups allow for tailored permissions based on specific user roles. A user can have multiple user groups assigned based on their area of work. 
5. **Scalability:** As organizations grow, user groups can adapt to changes in roles and responsibilities, keeping the app aligned with evolving needs.

### Special kind of User Groups

There are 2 User Groups that are automatically created when an Organisation is created. They are:

1. **Everyone**: Default group to which all Users of an Org will always belong to.
2. **Administrators**: A group which would always have all privileges.

### Steps to Create User Groups:

Before creating Users & Catchment, the first step is to create User Groups. Different user groups can have different permissions depending on the roles and responsibilities. Eg. in a project, there are Field Workers who would be using the Avni app, we can create a user group called “Field Workers”

1. **Login to Avni Web Console**

![](https://files.readme.io/ced1805-image4.png)

2. **Go to Admin**

![](https://files.readme.io/172d1bf-image2.png)

3. **Click on User Groups:**

![](https://files.readme.io/6575689-image6.png)

4. **Click on Create Group**\
   Enter the Group name and click on the CREATE NEW GROUP button

![](https://files.readme.io/bb4854b-image5.png)

![](https://files.readme.io/f04a374-image8.png)

5. **Configure Group Users** By clicking on the respective user group, the list of users who are part of the user group is shown along with the permissions given to the user group. User group will show the list of users who are part of this user group along with the user id and registered email.

![](https://files.readme.io/22984c4-image7.png)

6. **Configure Group Permissions:** The permissions section contains a list of permissions which are grouped by subject/entity type. When a subject/entity type is expanded, it will display permissions specific to the subject/entity type like edit, view, perform visit, schedule visit, void any visit or subject registration, cancel visit.

![](https://files.readme.io/1ca8b52-image10.png)

![](https://files.readme.io/2a71433-image9.png)

As shown in the screenshot below, “all privileges” will provide all the permissions and accesses to the entire user group.

When a user is assigned to 2 or more user groups, the union of permissions provided to the assigned user groups will be accessible. (For example, edit access permissions disabled for a form  in one user group and enabled in another user group will allow the user to edit that form)

![](https://files.readme.io/7636af7-image11.png)

7. **Configure Group Dashboards:** This section in user groups allows users to add and provide permission to access the dashboard in the mobile app. Here multiple dashboards added to the user groups will be synced as per the user groups assigned to the user. Out of the dashboards added, primary and secondary dashboards can be defined which would be shown on the user’s mobile screen immediately after logging in. (Refer to the screenshot below)

![](https://files.readme.io/0540e63-image3.png)

Refer to [Offline Report Cards and Custom Dashboards](doc:offline-reports) section for more details regarding this.

### Assign User Groups while creating Users

Once the user groups are updated with the necessary details given above, it should be used while creating users via the Admin -> Users screen.

![](https://files.readme.io/5ea372d-image1.png)
## Media Viewer

If you collect media (images, video, files) as part of your workflow then Avni Media Viewer will help your users to browse through, search and bulk download such media files. Media Viewer is available as an web app on the home page.

<Image alt="Media Viewer app" align="center" border={true} src="https://files.readme.io/697f439-image.png">
  Media Viewer app
</Image>

Media can be filtered by

1. Addresses
2. Subject Types
3. Programs
4. Encounter Types
5. Concepts (numeric, text and coded datatypes are supported)

Media can be downloaded as a zip file with format described [here](https://gist.github.com/vinayvenu/eabbb7c376e32f5bf665c7a0b595f524)

### Important to note

1. Media Viewer can be used only if an organisation has analytics (ETL) enabled
2. The thumbnails are generated seperately as part of AWS Lambda jobs.

### Alternative methods to access media

Other than the Media Viewer app, media can be accessed using the following mechanisms

1. Going to the specific form where the media was collected (either in the web based Data Entry Application or the Android app)
2. Using a [report](https://avni.readme.io/docs/accessing-media-in-reports) to list out a specific media files

### Thumbnails and original image

* **Thumbnails** are shown in the search/filter results. Thumbnails are generated automatically by Avni.
* When you click an image the preview of image is shown, this is the **original image** shown in a fixed size.
* When you download the image the **original image** is downloaded.
* When you click on the name the image **original image** is shown in the new tab.

### Display of non-open formats of images

`heif` and `heic` are two image format (known to Avni team) that cannot be displayed in the browser and cannot be processed by standard libraries to generate thumbnails. These image formats are known to come from some Samsung devices.

Due to this, the thumbnails are not visible in the media viewer web app. But you can only download the full size images for the same.

Currently the users can upload standard images by turning of this feature in Samsung. There are two settings that need to be changed as described in this short video.

<Embed url="https://www.youtube.com/embed/7MLuT-dVuf0?si=B3D3GwQK8_08nXX0" title="How to Fix Android Phone Shooting Picture in HEIC/HEIF Format | Samsung Mobile" favicon="https://www.youtube.com/favicon.ico" image="https://i.ytimg.com/vi/7MLuT-dVuf0/hqdefault.jpg" provider="youtube.com" href="https://www.youtube.com/embed/7MLuT-dVuf0?si=B3D3GwQK8_08nXX0" typeOfEmbed="youtube" html="%3Ciframe%20class%3D%22embedly-embed%22%20src%3D%22%2F%2Fcdn.embedly.com%2Fwidgets%2Fmedia.html%3Fsrc%3Dhttps%253A%252F%252Fwww.youtube.com%252Fembed%252F7MLuT-dVuf0%253Ffeature%253Doembed%26display_name%3DYouTube%26url%3Dhttps%253A%252F%252Fwww.youtube.com%252Fwatch%253Fv%253D7MLuT-dVuf0%26image%3Dhttps%253A%252F%252Fi.ytimg.com%252Fvi%252F7MLuT-dVuf0%252Fhqdefault.jpg%26key%3D7788cb384c9f4d5dbbdbeffd9fe4b92f%26type%3Dtext%252Fhtml%26schema%3Dyoutube%22%20width%3D%22854%22%20height%3D%22480%22%20scrolling%3D%22no%22%20title%3D%22YouTube%20embed%22%20frameborder%3D%220%22%20allow%3D%22autoplay%3B%20fullscreen%3B%20encrypted-media%3B%20picture-in-picture%3B%22%20allowfullscreen%3D%22true%22%3E%3C%2Fiframe%3E" />
## Use Of Media In Forms

Avni allows for adding media like data (image and video) in the forms. It can be in form of single or multiple media files in the same question. These can be added by the user using the camera and the file system. Multiple files can be added too in one go. Please see the following table for the capabilities.

| Media Type  | Selection type | Android Version | Supported?    |
| :---------- | :------------- | :-------------- | :------------ |
| Image/Video | Single         | &lt; 13.0       | Supported     |
| Image/Video | Multiple       | &lt; 13.0       | Not Supported |
| Image/Video | Single         | &gt;= 13.0      | Supported     |
| Image/Video | Multiple       | &gt;= 13.0      | Supported     |

<br />

## Why multi-select is not supported in older versions of android

This capability has been restricted by the react native (framework) library used by us. [https://www.npmjs.com/package/react-native-image-picker](https://www.npmjs.com/package/react-native-image-picker)

## My media is in a folder that is not showing in the albums when I am using Avni

If you have images in android folders (in storage) as archive then it is possible that they are shown when you want to upload images in Avni forms. Please see the following as a way to solve this issue.

Android displays only folders which are **considered** albums. A plain folder with images may not be shown here for this reason.

### Option 1

You can setup a folder you want to upload media in Avni by making it show up as albums. You can do that by setting it as Google Photos backup folder. You can do that by:

* going to `Google Photos` app, then `Settings`, then `Choose backup device` folders option, then choose your folder.
* going to `Google Photos` app, then `Library`, then `Utilities`, then choose `Backup Device Folders`, then choose your folder.

### Option 2

Copy/move the folder which has the media to one of the folders which are picked by the Avni form.

*Please note that Google Photos have storage limits.*

We cannot find any means by which an album be added only locally, without it being backed up on Google Photos. [https://www.reddit.com/r/googlephotos/comments/x331q9/create_albums_that_dont_sync_with_the_cloud/](https://www.reddit.com/r/googlephotos/comments/x331q9/create_albums_that_dont_sync_with_the_cloud/)

## How do apps like Dropbox, Facebook, etc support multi-select and have better album support

Since these are not open source projects we can only guess. But it is likely that they have developed their own screens that uses the android file system API.

## Why does Avni not do the same as other apps

1. It is significant amount of work to develop this from scratch compared to use the android's media picker.
2. About 50% and rapidly growing number of Avni users are already on android 13 or later.

<br />

# Also see

* [Media Viewer](doc:media-viewer)
## Translation Management

## Overview

Since Avni is widely used for Data-collection by field workers, it is most likely to have a need for the Forms to be read and filled-up in their native language. For example, field workers providing health-care services in the remote villages of Gujarat would be most comfortable performing data-collection in Gujarathi, as opposed to English or Hindi.\
For this reason, Avni supports translation of data-collections forms to native language of the user(field worker) in the Avni "client" mobile application and "Data-Entry" Web application.

## Supported Languages

Avni currently supports Translation capabilities from English to following languages:

* Hindi  
* Marathi  
* Gujarathi  
* Tamil  
* Kannada  
* Bengali  
* Telugu  
* Odia  
* Malayalam  
* Punjabi  
* Sanskrit  
* Urdu  
* Assamese

We additionally have some default translations already available for a few of the above languages, that would make it easier for an organisation to get started on its “Translations” journey. The languages that have some baked-in translations in Avni are as follows:

* Hindi  
* Marathi  
* Gujarathi  
* Tamil  
* Kannada

## Prerequisites

In-order to set up translation for any of the aforementioned languages, the organisation should have enabled the language in the Languages section of the Organisation config.

### Steps to enable Languages for the Organisation

1. Navigate to the “Admin” application

   ![](https://files.readme.io/7bf088b321b670a88c9b73d86ed5d50999afb0ea9553067a0c3483c38e53c7b8-image.png)
2. Select the “Languages” section in the left-tab  
3. Add all the languages that are to be made available to the translation framework, using the drop-down and then click on “Save” button

   ![](https://files.readme.io/0dd7d20b674af9c7257ea0b6e3566e31a8f12dc66b8372251c4e8f305210398d-image.png)

## Steps involved in the translation process

Avni allows the management of translations using the Admin web interface. Below are the steps to translate the content of the app from English to the preferred language

### Navigation to ‘Translations’ module

Login to Avni Web Console and go to the ‘Translations’ module. 

![](https://files.readme.io/ebee37b87a4225d75c86d2c0ff612fcb9bd2ca653fd70d3e95a557ddb9c0a697-image.png)

<br />

### Downloading Translation Keys from Avni

* From the “Translations Dashboard”,download the keys after choosing the desired platform. Platforms are:  
  * Web  
  * Android  
* In general, most organisations need translations only for their field users who perform data-collection using their mobile devices. In such cases, the platform of interest is “Android” (Mobile).  
* If additionally, your organisation also wants translations to be done for the Data-Entry App, then also download the keys for the “Web” platform. 

![](https://files.readme.io/9a5030ec956f7983bf2edff00650c0a2d00367fee775375ecafb49957a8e4a6c-image.png)

<br />

* For each platform selection download, the app will download a zip file containing one JSON file per language available in the organisation config.   
* The JSON file will contain keys for both the standard platform app as well as those specific to your implementation, covering all labels in the app, form fields, location names and any other concepts created in the implementation.  
* The file will also contain existing translated values, if any. This is useful when you have to update the translations after a while, as you will already have all previously uploaded translations available for retention or modifications as needed  
* IMPORTANT Note: When organisations do not want Locations to be part of translations, then they need to bundle export without locations, import those into a temporary org and export translations from that temporary organisation. This was required for one of our organisations since they had a very large number of locations (More than 100,000) and hence were in need to translate other things before locations.

### Setting up a project in Translation Management System (TMS)

* The JSON files can be edited with any tool that the implementer is comfortable with, to come up with translated values for the target language.  
* But for most use cases, we would have multiple translators involved and/or a lot of keys are to be translated. In such cases, we highly recommend using an external translation management system (TMS) like [Lokalise](https://lokalise.com/) which provides a sophisticated editor for performing translations. The TMS provides the ability to import/export JSON files and supports a variety of use cases related to translations.  
* Avni has an enterprise-free plan for Lokalise. If you would like to use Lokalise, please request the Avni team to create your account and project to get started.

#### Creating an implementation project in Lokalise

This is an optional step, required only if the implementation project does not already exist. 

1. In the Project section, a new project needs to be created as shown in the screenshot below.   

   ![](https://files.readme.io/cde8ae8c4f81316f321973918c3717b138e529eb0c1bac0e8c305f1c74e4fb98-image.png)

   ![](https://files.readme.io/46fc019a73c69cd626060e89701fba69edf2894fdad9ccb112a85fd58cb08fd3-image.png)

   <br />

2. While creating the project, provide the Project name, Base language (Which will be english always), and target language in which translations are needed.

   ![](https://files.readme.io/3b1d13d3c4ee9db1eb2f247b44fb36b44f98063d143c684a8c620aae8f1d4d96-image.png)

#### Uploading Translation keys to Lokalise

Once the project is ready in TMS and you have downloaded the translation ZIP file(s), log in to [Lokalise](https://app.lokalise.com/projects) with Samanvay's official email address, if not already done.

* Unzip the downloaded translation zip file  

* Before uploading the JSON, please make sure that null values are removed from the json files

  ![](https://files.readme.io/db2521a87f4b27a65fbac3b98fdf384aaf6024f21dd04d864bb95df03bceff93-image.png)

* In your project, navigate to the ‘Upload’ section and import the JSON file from the unzipped folder of the previously downloaded Translations zip file.

  ![](https://files.readme.io/7d26a129395f40bc2e2bbca4a770a27cf61fa0258d5129fd75a95538a51536d6-image.png)

* In the translation zip file that is downloaded, go to the local folder and select the English json file  

* Once the JSON file has been uploaded successfully, you will see the ‘Ready for Import’ message.

  ![](https://files.readme.io/6a0496a0ba800eb383d5b8f8978defe60bbaf01130868d8e2de18ab6f4324fbe-image.png)

* Go to the ‘editor’ section and verify the keys available for the translation.

  ![](https://files.readme.io/775e3003e6a87eade2045a7acf5b844ea1d1f60efac77cd4f74370fc3572c1b0-image.png)

  <br />

#### Inviting Contributors to the project

Next, Navigate to the ‘Contributors’ section to send out invites to other people

![](https://files.readme.io/0903aa35f4aa3b0b7cc8ec50506511d0e99f0dd8b624eeaf5c403d816b204d3c-image.png)

<br />

Perform below mentioned tasks to invite users to collaborate on the project

* Role should be selected as ‘Translator’   
* “Reference language” should have the base language (Usually English) and  
* “Contributable language” should have target language

![](https://files.readme.io/c3a2ff0b427c727aea29a09ff339a6c7a7219079cf034cd76a114b956f0c3ec8-image.png)

<br />

### Guide for translating keys using Lokalise

* All invitees will receive an Email invite from Lokalise with instructions to login and access the project.

  ![](https://files.readme.io/0f9fcf8ad025f5dd50c754a3736618988e51eced350063df791a20145073c8fb-image.png)

* Once logged in, available projects will be shown in the projects tab/ home screen. you can click on the project name to access the translation items.

  ![](https://files.readme.io/29a4f970e6de4969a115870182c25584f55b1fc1a65eaa09a46b2786fc9317f6-image.png)

* The project would display the editor page by default, and the list of keys should be visible at the bottom.

  ![](https://files.readme.io/e0ab4bd3396825a5df93f6cd6f2e39997d51e8a82b9d33c9ff65d10c9f9e7e25-image.png)

* You can select the Bilingual option shown in the screenshot below and search the question or required field names to be translated.

  ![](https://files.readme.io/0de7bfccf120d85d1154466d2ae52a542f12b0ef10eddf0f133b228d3e6a49cf-image.png)

* After giving the keywords in the search bar, you can see the results below which show questions and field names on the left side. against which you need to provide the Kannada translation and save the response.

  ![](https://files.readme.io/914ab3acbc6c6d25788f872ceecca5160f1420ad85d29afc3ff45d3e240d5d16-image.png)

* Additional notes  
  * Keep the required forms handy while you start the translation process, you can refer to the questions from respective and update the values in Lokalise.  
  * In case of questions, the box on the left side might show "empty" and the question would be visible above that in blue fonts. you can provide the appropriate translation against that on the right-hand side box.

#### Translating Keys with Dynamic string having placeholders

Consider the following “Android” Platform keys, which are examples for Dynamic strings with placeholders:

| numberAboveHiAbsolute | "Should be \{\{limit}}, or less than \{\{limit}}" |
| :-------------------- | :------------------------------------------------ |
| enrolmentSavedMsg     | "\{\{programName}} Enrolment Saved"               |

In-order to translate them to Hindi, you would have to specify following in the translated json file:

| numberAboveHiAbsolute | "\{\{limit}} के बराबर या \{\{limit}} से कम" |
| :-------------------- | :------------------------------------------ |
| enrolmentSavedMsg     | "\{\{programName}} एनरोलमेण्ट सेव हुआ"      |

As shown above, ensure that you retain the string placeholder content within “\{\{” and “}}” as is in native english. Ex: “\{\{limit}}”, "\{\{programName}}”

### Uploading Translations

After completing translation for all the required keys, questions and forms you can download the translated values JSON file of the target language.

* Go to the “Downloads” section of the project  

  ![](https://files.readme.io/934b5c2b87ce2127c6983e5f97739abd5aa4381c3c0c884f7d53a040f9c4d8a1-image.png)
* As seen above, select the ‘Don’t Export’ option for the “Empty Translations” field, so as to export only the translated fields.  
* Click on “Build and Download” option to download the Translated values ZIP file

  ![](https://files.readme.io/ae74952cda34852fe4c7d78933624066f83514681cf5fe52ec8d17b53e911303-image.png)
* Please note that the downloaded ZIP file would contain the JSON file of the base language (English) and targeted language JSON.

  ![](https://files.readme.io/f61d4ac05c7f32ff80ce10f556145a89b11b3ef9f0a43ee2509c4515d31c321c-image.png)
* Now the JSON file of the translation language needs to be uploaded into the Avni. Navigate to the “Translations Dashboard“. Using its “Upload Translations” functionality, upload the JSON file, after choosing an appropriate language. Be careful about choosing the target language, it should be same as the language of the translated values.

  ![](https://files.readme.io/1cc8a1416150da1c1961d5b82bb4508b387a4be7a71d4679ad68f4778ce47301-image.png)
* On successful upload of the translated values, you should see a change in the value of the “Keys with translations” column for the corresponding Language, in the “Translations Dashboard”.

## **Using the Avni client application in User’s native Language**

On the Avni client app, users would need to sync their devices in-order to get the new translations.

If the default language for the User hasn’t been set to his/her desired native language, then the user should be able to switch to it, by navigating to the “More” menu and clicking on the “Edit Settings” button at the top, and selecting the language in which he/she wants to see the app content.

<Image align="right" width="45% " src="https://files.readme.io/28964f670ac61932780ce5d1a5d3c2553a005e392960a59852aacc0c130b57b9-image.png" />

<Image align="left" width="45% " src="https://files.readme.io/aed7f494a90af456f84dc6caa5ec5c80c32e9f469b61ec7295d60a7deaa86503-image.png" />
## Data Entry App

The Data Entry App, as the name suggests, is used to view and enter data directly without relying on mobile syncing. It can be accessed by clicking on the 'Data Entry app' tile in the home page.

<Image align="center" border={false} width="10000px" src="https://files.readme.io/be9c75e10c6f8e1eb905f84e0714b46475192e039bac88837f38b62c87cabf91-Screenshot_2025-08-25_at_7.10.40_PM.png" />

### Advantages:

* **Instant access**: When you are on a computer with internet access, you can view and enter data without downloading or syncing data like in the mobile app.
* **Larger data coverage**: On the mobile app, the maximum number of catchment locations that can be synced is 65,535. If you need to view data across more locations, the Data Entry App can be used.

### Features not supported in Data Entry App:

**Rules related limitations:**

* [Edit form rule](https://avni.readme.io/docs/writing-rules#17-edit-form-rule)
* [Member addition eligibility check rule](https://avni.readme.io/docs/writing-rules#16-member-addition-eligibility-check-rule)
* [Manual programs eligibility check rule](https://avni.readme.io/docs/writing-rules#15-manual-programs-eligibility-check-rule)
* [Rules that use service methods to filter across subjects](https://avni.readme.io/docs/writing-rules#using-service-methods-in-the-rules)
* <Anchor label="Accessing logged-in user information" target="_blank" href="https://avni.readme.io/docs/writing-rules#shape-of-common-parameters-in-all-params-object">Accessing logged-in user information</Anchor>

<br />

**Other unsupported features:**

* [User subject type](https://avni.readme.io/docs/user-subject-types)
* [Dashboards and report cards](https://avni.readme.io/docs/offline-reports)
* [Drafts](https://avni.readme.io/docs/draft-save)
* [Approval workflows](https://avni.readme.io/docs/approval-workflow)
* [Vaccination checklist](https://avni.readme.io/docs/upload-checklist)
* [Growth chart](https://avni.readme.io/docs/child-growth-charts)
* Details on who performed a registration, enrolment or visit
* Viewing of data outside of a user's catchment and configured sync attribute cannot be restricted. Only editing can be restricted.
