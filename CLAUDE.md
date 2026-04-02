# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This directory is a multi-repo workspace for the **Avni** platform — an open-source health/social data collection and synchronization system designed for offline-first mobile applications. Each subdirectory is a separate git repository.

Module-specific `CLAUDE.md` files exist in `../avni-server/` and ../`avni-client/` with detailed build/architecture guidance for those modules.

## Repository Map

| Directory                 | Role | Tech |
|---------------------------|---|---|
| `../avni-server/`         | Main backend API server | Java 21, Spring Boot 3.3.5, PostgreSQL |
| `../avni-webapp/`         | Web admin & data entry UI | React 18, Vite, Yarn |
| `../avni-client/`         | Android mobile app | React Native 0.77.3, Realm 12.14.2 |
| `../avni-models/`         | Shared data models (npm: `openchs-models`) | TypeScript, Babel |
| `../avni-etl/`            | ETL data processing service | Java, Spring Batch |
| `../integration-service/` | External integrations (Bahmni, etc.) | Java, Spring Boot |
| `../avni-rule-server/`    | JavaScript rule execution engine | GraalVM |
| `../avni-infra/`          | Infrastructure as Code | Ansible |
| `../avni-product/`        | Release & branch management tool | TypeScript |

## System Architecture

```
Mobile App (avni-client) ←── Sync ──→ API Server (avni-server) ──→ PostgreSQL
Web Admin  (avni-webapp) ────────────────────┘                         ↓
                                                               Rule Engine (avni-rule-server)
Integration Services ──────────────────────────────────────────────────────────────────────
```

**Data flow**: Mobile/web clients sync via REST with avni-server. Server evaluates business rules via the embedded GraalVM rule engine. Offline-first: clients store data locally (Realm on mobile, IndexedDB on web) and sync periodically.

**Shared models**: `avni-models` is published to npm as `openchs-models` and consumed by both `avni-client` and `avni-webapp`. When changing domain models, update this package and re-link/publish before testing in the consuming apps.

## Build Commands by Module

### avni-server (Java/Spring Boot)
```bash
cd ../avni-server
make build_server          # Build JAR without tests
make test_server           # Full test suite (rebuilds test DB)
./gradlew test --tests "org.avni.server.service.SomeTest"  # Single test
make start_server          # Run locally
make rebuild_db            # Create fresh database
make deploy_schema         # Run Flyway migrations
```
See `avni-server/CLAUDE.md` for full details.

### avni-webapp (React/Vite)
```bash
cd ../avni-webapp
yarn install               # Install dependencies
yarn start                 # Dev server against local backend
yarn test                  # Run Jest tests
CI=true yarn run build     # Production build
```

### avni-client (React Native Android)
```bash
cd ../avni-client
source ~/.nvm/nvm.sh && nvm use 20   # Node 20 required
make deps                  # Install + patch dependencies
make run_packager          # Start Metro bundler
make run-app               # Build debug APK + install on device
make test                  # Run Jest unit tests
make create_apk flavor=generic  # Release APK
```
See `avni-client/CLAUDE.md` for full details.

### avni-models (TypeScript npm package)
```bash
cd ../avni-models
yarn install
yarn build                 # Babel + TypeScript compile
yarn test                  # Jest tests
```

## GitHub Issue Management

This repository (`avni-product`) serves as the **hub for analysis and GitHub issue/card creation** across the Avni platform.

- **Primary epics** are created as GitHub issues in this repository (`avni-product`)
- **Repository-specific cards** (tasks, bugs, sub-issues) are created in the relevant individual repository (e.g., `avni-server`, `avni-webapp`, `avni-client`, `avni-etl`) and linked back to the epic in `avni-product`

## Cross-Cutting Concerns

### Authentication
Two supported identity providers (set via `AVNI_IDP_TYPE` env var in avni-server):
- **Keycloak** — on-premise deployments
- **AWS Cognito** — cloud deployments

### Date/Time
- **Backend (Java)**: Always use Joda Time (`org.joda.time`), not `java.time`
- **Frontend/Mobile**: Use standard JS Date or existing utility wrappers

### Sync Protocol
The server exposes paginated sync endpoints ordered by `lastModifiedDateTime ASC, id ASC`. The sync window upper bound is `now - 10 seconds` to handle concurrent DB flush delays. Mobile and web clients use this for incremental sync.

### Multi-tenancy
All server-side data is scoped to an organisation via JDBC interceptor. This is transparent to application code — queries are automatically filtered.
