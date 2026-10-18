# Coding Agent Rules & Execution Governance (AGENTS.md)
# NetOps Intelligence: Protocols, Quality Gates & Engineering Constraints

**Document Version:** 1.0.0  
**Phase:** 6 — Coding Agent Governance  
**Approved References:** [`PRD.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/PRD.md), [`DESIGN.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/DESIGN.md), [`ARCHITECTURE.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/ARCHITECTURE.md), [`DATABASE.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/DATABASE.md), [`API.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/API.md)  
**Status:** Complete — Pending User Review & Approval  

---

## 1. Purpose & Authority

This document defines the **binding operating rules and engineering governance** for AI implementation agents working on the NetOps Intelligence codebase within Google Antigravity. Every code modification, architectural decision, test execution, and progress report must comply with the rules set forth herein.

---

## 2. Source-of-Truth Hierarchy & Conflict Handling

### 2.1 Precedence Ladder
When requirements, specifications, or code implementations conflict, agents must enforce this exact order of precedence:

```
1. PRD.md            (Highest Authority: Problem, boundaries, functional scope, safety)
   ↓
2. ARCHITECTURE.md   (System topology, modular monolith boundaries, stack, flows)
   ↓
3. DATABASE.md       (Entity definitions, columns, constraints, retention, lineage)
   ↓
4. API.md            (REST endpoints, schemas, error codes, HTTP status codes)
   ↓
5. DESIGN.md         (Visual tokens, multi-channel state encoding, layouts, UX states)
   ↓
6. Existing Code     (Lowest Authority: Code must yield to approved documentation)
```

### 2.2 Conflict Resolution Protocol
1. **Never Silently Resolve:** If an ambiguity or contradiction exists between documents, or between a document and a user prompt, the agent **MUST STOP** before modifying code.
2. **Formulate Explicit Trade-Offs:** Describe the conflicting statements, state the recommended resolution based on the precedence ladder, and ask the user for a decision using standard communication channels.
3. **Document Updates:** Once approved, immediately update the relevant specification documents to maintain perfect documentation integrity.

---

## 3. Strict Serial Phase Execution & Approval Gates

### 3.1 Serial Execution Rules
1. **Single Phase Scope:** Execute **only the currently assigned phase**. Never begin or pre-fetch tasks belonging to the next phase automatically.
2. **Phase Initiation Checklist:**
   - Inspect repository state, file tree, dependencies, and git status.
   - Re-read relevant source-of-truth documents.
   - Summarize planned changes and identify any blocking ambiguities.
3. **Atomic, Focused Changes:** Make surgical, focused edits. Reuse existing code and components. Never execute full-file rewrites of unrelated components.
4. **Preserve Documentation Integrity:** Maintain existing docstrings, technical comments, and licensing headers unless explicitly instructed otherwise.
5. **Explicit Approval Gate:** At the conclusion of every phase, the agent must output the mandatory Phase Report and **HALT execution**. The agent must wait for explicit user approval before touching the next phase.

### 3.2 Mandatory Phase-End Report Structure
Every phase report must present these 6 distinct sections:
```markdown
# Phase <X> Report: <Phase Title>
1. Work Completed (Concrete technical actions taken)
2. Files Created / Changed (Table with file paths, sizes, and descriptions)
3. Commands & Checks Run (Actual execution commands and real outcomes)
4. Acceptance Criteria Status (Checklist: Passed / Failed / Unverified)
5. Known Issues, Risks, Assumptions & Decisions Needing Approval
6. Recommended Next Phase (Exact name and scope, without executing it)
```

---

## 4. Prohibition on Fabricated or Unverified Claims

> [!CAUTION]
> **Zero Tolerance for Unverified Claims:**  
> The agent is strictly prohibited from claiming a feature, test, build, or endpoint works without actual empirical verification run in the terminal.

1. **Proof of Execution:**  
   Code is not "complete" merely because it was written. Completion requires terminal evidence (e.g., `npm.cmd run build` passing with exit code 0; `pytest` reporting all tests green).
2. **Clear Statement of Unverified Items:**  
   If an external dependency, live network link, or database server cannot be verified in the local environment, the agent must state explicitly:  
   *"Feature X was implemented but could not be verified due to environment condition Y."*
3. **No Hallucinated AI Capabilities:**  
   Never claim that NetOps Intelligence uses "autonomous AI root-cause certainty" or live external network monitoring. All anomaly detection in the MVP is deterministic rules-based.

---

## 5. Safety Boundaries & Safe Handling of Network Telemetry

### 5.1 Strictly Non-Destructive Operations
* NetOps Intelligence is an **operator-in-the-loop diagnostic aid**.
* The codebase **MUST NEVER** include network automation modules, scripts, or libraries (e.g., Netmiko, Paramiko, Scrapli) that execute write/configuration commands (e.g., `interface shutdown`, `no ip route`, `delete vlan`, `reload`).
* Troubleshooting playbooks execute **strictly simulated, read-only diagnostic checks** (`show interface transceiver detail`, `show ip bgp summary`, `ping <ip>`).
* Every playbook verification requires explicit human operator sign-off before incident resolution.

### 5.2 Synthetic Telemetry & Data Provenance Integrity
* All telemetry data generated or seeded in the MVP must carry the mandatory metadata tag:
  `data_origin = "SIMULATED"`
* Metric relationships must adhere to physical network realities (e.g., high link utilization induces queuing latency and frame drops; CRC errors induce frame discards).
* Every diagnostic finding must be labeled according to the 3-tier lineage taxonomy:
  - `OBSERVED_MEASUREMENT`: Raw empirical data (e.g. `184 CRC errors/s`).
  - `RULES_BASED_FINDING`: Deterministic threshold violations (e.g. `Rule CR_002 triggered`).
  - `UNVERIFIED_HYPOTHESIS`: Tentative diagnostic idea requiring verification.

---

## 6. Security, Zero Secrets & Environment Configuration

### 6.1 Server-Side Secrets & Configuration
* **Never Commit Credentials:** Passwords, API tokens, secret keys, or private SSH certificates must never appear in source code, committed files, client bundles, screenshots, or logs.
* **Environment Isolation:** All runtime configuration must read from `.env` via Pydantic `BaseSettings` (`backend/app/config.py`).
* [`.env.example`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/.env.example) serves as the safe template with empty/safe defaults.

### 6.2 Synthetic Network Identity Standards
* **No Real IP Addresses:** Monitored network devices must use synthetic documentation IP blocks reserved by RFC 5737:
  - `192.0.2.0/24` (TEST-NET-1)
  - `198.51.100.0/24` (TEST-NET-2)
* Device hostnames must use generic synthetic naming (`COR-RTR01`, `AGG-SW01`, `ACC-SW01`, `FW-EDG01`, `WAN-GW01`). No real corporate hostnames or customer topologies may be stored.

---

## 7. Folder Structure, Naming & Separation of Concerns

### 7.1 Architecture & Directory Boundaries
The project strictly maintains the modular monolith directory structure defined in `ARCHITECTURE.md`:

```
netops-intelligence/
├── docs/                 # Authoritative documentation mirrors
├── frontend/             # React 19 + TypeScript + Vite
│   └── src/
│       ├── components/   # UI Presentation (No direct SQL or raw network calls)
│       ├── services/     # API Client & Mock Store Adapter
│       ├── store/        # Reactive Client State (useNetOpsStore)
│       └── types/        # Strongly Typed TypeScript Domain Interfaces
└── backend/              # Python FastAPI Modular Monolith
    ├── app/
    │   ├── models/       # SQLAlchemy 2.0 ORM Declarations
    │   ├── routers/      # REST API Controllers (No business logic or raw SQL)
    │   ├── schemas/      # Pydantic v2 Request/Response Schemas
    │   └── services/     # Simulation, Rules Engine, Playbooks, Correlation
    └── tests/            # Automated Pytest Suite
```

### 7.2 Naming Conventions
* **Frontend:**
  - Components: `PascalCase.tsx` (e.g., `DeviceCard.tsx`, `EvidenceInspector.tsx`).
  - Hooks & Stores: `camelCase.ts` (e.g., `useNetOpsStore.ts`).
  - Types & Contracts: `kebab-case.ts` (e.g., `device.ts`, `telemetry.ts`).
  - Constants & Enums: `UPPER_SNAKE_CASE` (e.g., `SEVERITY_P1`, `STATUS_RESOLVED`).
* **Backend:**
  - Files & Modules: `snake_case.py` (e.g., `rule_engine.py`, `simulation.py`).
  - Classes: `PascalCase` (e.g., `TelemetrySample`, `IncidentDetail`, `RuleEngine`).
  - Functions & Variables: `snake_case` (e.g., `evaluate_rules()`, `calculate_priority_score()`).

### 7.3 Component Reuse & Separation
* **Check Before Creating:** Before authoring a new visual element, inspect `src/components/common/`. Always reuse shared `MetricCard`, `Badge`, `StatusIndicator`, `Modal`, and `Toast` components.
* **Separation of Concerns:**
  - UI components must never contain business correlation logic or simulation math.
  - API routers must never execute raw SQL queries; all data queries must go through SQLAlchemy models or service layers.
  - Data models must never format presentation HTML or client strings.

---

## 8. TypeScript & Python Type-Safety Standards

### 8.1 TypeScript Standards (Frontend)
* `tsconfig.json` must enforce strict type checking (`"strict": true`, `"noImplicitAny": true`).
* **Zero `any` Policy:** Explicitly forbidden to use `any` or loose `Object` types. All domain models, API payloads, and component props must be explicitly typed.
* Every asynchronous API call must specify its return type (e.g., `Promise<DeviceDetail>`).

### 8.2 Python Standards (Backend)
* **Strict Type Hints:** All function parameters, return values, and class attributes must have type annotations:
  ```python
  def evaluate_window(self, samples: list[TelemetrySample]) -> Optional[IncidentCandidate]:
  ```
* **Pydantic v2 Validation:** All REST API request bodies and query parameters must be validated using Pydantic models. Untyped dictionaries (`dict`) must not be passed across module boundaries.
* SQLAlchemy declarative models must use SQLAlchemy 2.0 type-mapped declarations (`Mapped[str]`, `Mapped[int]`).

---

## 9. Dependency Approval & Lockfile Discipline

### 9.1 Standardized Toolchain & PowerShell Execution
* All development must be fully operable from **Windows PowerShell**.
* **Node.js Package Manager:** Standardized on `npm.cmd` (to avoid PowerShell execution policy blocks with `npm.ps1`).
  - Run commands: `npm.cmd install`, `npm.cmd run dev`, `npm.cmd run build`.
* **Python Runtime & Environment:** Standardized on virtual environment `venv` using host `python.exe`.
  - Run commands: `python -m venv venv`, `.\venv\Scripts\Activate.ps1`, `pip install -r backend\requirements.txt`.

### 9.2 Dependency Approval & Lockfiles
* **No Unapproved Packages:** Do not install heavy state libraries (Redux, MobX), container orchestration packages, or external AI/LLM SDKs without documented architectural approval.
* **Lockfile Integrity:** Never manually delete, edit, or force-regenerate `package-lock.json`. All installations must be reproducible.

---

## 10. Database Access, Migrations & Seed Discipline

### 10.1 Dual-Engine Resilience Strategy
* The database connection manager (`backend/app/database.py`) must always implement the **automatic SQLite fallback rule**:
  1. Attempt connection to local MySQL 8.0 (`127.0.0.1:3306`).
  2. If MySQL connection times out or authentication fails, log a warning and seamlessly fall back to local SQLite (`backend/netops_local.db`).
  3. Never crash the API server on startup due to missing MySQL credentials.

### 10.2 Query & Schema Integrity
* **No Raw SQL Injections:** Raw string formatting (`f"SELECT * FROM {table}"`) is strictly prohibited. All queries must use SQLAlchemy ORM or parameterized queries.
* **Idempotent Seed Script:** `backend/seed_data.py` must support `--reset` to wipe and re-seed clean baseline network data in $<2$ seconds.
* Seeded records must use synthetic private documentation IPs (`192.0.2.0/24`) and have `data_origin = 'SIMULATED'`.

---

## 11. Error Handling, Structured Logging & UX States

### 11.1 API Error Standards (RFC 7807)
* All backend errors must return the standard problem details JSON format defined in `API.md`:
  `status`, `title`, `detail`, `error_code`, `timestamp`.
* Uncaught exceptions must be intercepted by FastAPI global exception handlers and logged with stack traces.

### 11.2 Structured Logging
* Use Python standard `logging` configured for structured JSON output.
* Logs must include ISO UTC timestamps, log level, event name, operator name, and affected device/incident ID.
* No raw `print()` statements in production code.

### 11.3 Mandatory 5 UX States (Frontend)
Every screen and data container must implement the 5 canonical UX states:
1. **Loading State:** Shimmer skeleton placeholders matching component geometry.
2. **Empty State:** Centered graphic, descriptive text, and a call-to-action button.
3. **Error State:** Non-blocking inline banner with semantic red tint and retry button.
4. **Stale Data State:** Amber warning badge when telemetry updates lapse.
5. **Simulated Data State:** Persistent high-visibility header badge (`[SIMULATED DATA]`).

---

## 12. Testing Expectations & Quality Gates

Before declaring any implementation phase complete, the agent must run and report:

| Quality Gate | Tool / Command | Pass Criteria |
| :--- | :--- | :--- |
| **Frontend Compilation** | `npm.cmd run build` | 0 TypeScript errors, 0 Vite build errors. |
| **Frontend Unit Tests** | `npm.cmd test` | All component and store test cases pass. |
| **Backend API Tests** | `pytest backend\tests -v` | All endpoint status codes and schemas validated. |
| **Rules Engine Tests** | `pytest backend\tests\test_rules.py`| Threshold breaches trigger; normal metrics pass. |
| **Database Seed Integrity**| `python backend\seed_data.py` | 9 devices seeded cleanly; all status `HEALTHY`. |
| **Security Audit** | Manual codebase scan | 0 hardcoded credentials, 0 real public IPs. |
