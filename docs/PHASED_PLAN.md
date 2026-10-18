# Phased Implementation Plan & Acceptance Criteria
## NetOps Intelligence

**Document Version:** 1.0.0  
**Status:** Approved Source of Truth  
**Execution Strategy:** Strict Serial Execution with Explicit Phase Sign-Off  

---

### Roadmap Summary

| Phase | Title | Primary Objective | Deliverable |
| :---: | :--- | :--- | :--- |
| **0** | **Foundation & Source of Truth** | Establish PRD, Architecture, Phased Plan, Environment config, and project workspace. | Foundation docs, `.env.example`, verified environment. |
| **1** | **Frontend Prototype (Simulated)** | Build fully functional NOC web interface with mock data, topology map, incident console, evidence inspector, and playbooks. | Interactive React/TS/Vite web application. |
| **2** | **Backend & Persistence** | Implement FastAPI REST modular monolith with MySQL 8.0 and SQLite fallback, models, schemas, and seed data. | Working REST API with automated unit tests. |
| **3** | **Full-Stack Integration** | Connect Vite frontend to FastAPI backend via proxy; enable real-time telemetry polling and scenario triggers. | Integrated end-to-end web system. |
| **4** | **Rules Detection & Correlation Engine** | Implement deterministic rules for CRC storms, WAN congestion, BGP flaps, and explainable priority scoring. | Backend detection engine with unit test suite. |
| **5** | **Guided Troubleshooting & Verification** | Add operator-in-the-loop diagnostic verification checklists and hypothesis validation playbooks. | Interactive troubleshooting workflow module. |
| **6** | **Statistical Anomaly Baselines (Opt.)** | Implement rolling Z-score / IQR anomaly baselines for telemetry metrics with explicit lineage badging. | Telemetry anomaly detector with confidence scores. |
| **7** | **Hardening, E2E Testing & Demo Delivery** | Run full verification suite (lint, build, unit, E2E), document runbook, and create interactive demo tour. | Production-grade demonstrable prototype. |

---

### Phase 0: Foundation & Source of Truth (CURRENT)
- [x] Inspect workstation environment: Node.js, npm, Python, MySQL service.
- [x] Create project repository structure under `scratch/netops-intelligence`.
- [x] Author comprehensive `docs/PRD.md` with explicit product boundaries.
- [x] Author comprehensive `docs/ARCHITECTURE.md` confirming modular monolith and stack.
- [x] Author `docs/PHASED_PLAN.md` with verifiable acceptance criteria for all phases.
- [x] Create `.env.example` with safe, non-sensitive defaults.
- [x] Author top-level `README.md` with quickstart instructions.
- [x] Submit Phase 0 report and request user approval before beginning Phase 1.

### Phase 1: Frontend Prototype (Next Phase)
- **Goal:** Create an immediate, demonstrable frontend prototype using simulated network telemetry.
- **Key Deliverables:**
  - Vite + React + TypeScript + Tailwind CSS project initialized in `frontend/`.
  - Design system with high-contrast NOC dark theme and responsive layout.
  - Device Inventory & Topology Visualizer (Core, Aggregation, Access, Firewall, WAN).
  - Incident Triage Console with priority filtering (P1–P4) and state badges.
  - Evidence Inspector displaying time-series telemetry charts, observed measurements, rule triggers, and hypothesis status badges.
  - Guided Troubleshooting Playbook runner with step-by-step diagnostic verification.
  - Scenario Injection Bar allowing the operator to toggle demo scenarios (e.g. CRC storm, BGP flap, WAN congestion).
  - Client-side mock state store with simulated data generator.
- **Acceptance Criteria:**
  - `npm.cmd run build` completes with zero TypeScript or build errors.
  - `npm.cmd run dev` runs locally on `http://localhost:5173`.
  - All views render cleanly without console warnings.
  - Data lineage badges (`SIMULATED DATA`, `UNVERIFIED HYPOTHESIS`) are prominently displayed.

### Phase 2: Backend Architecture & Persistence
- **Goal:** Build the FastAPI REST service and relational persistence layer.
- **Key Deliverables:**
  - Python virtual environment with documented Windows PowerShell setup.
  - FastAPI application structure (`backend/app`).
  - SQLAlchemy models for Devices, Interfaces, TelemetrySamples, Incidents, Evidence, Playbooks.
  - MySQL 8.0 connection with automatic zero-config SQLite fallback if MySQL is unreachable.
  - Realistic database seed script populating a multi-tier network topology.
  - REST endpoints: `/api/devices`, `/api/incidents`, `/api/telemetry`, `/api/health`.
- **Acceptance Criteria:**
  - Automated tests pass with `pytest`.
  - OpenAPI docs available at `http://localhost:8000/docs`.
  - Database seed script executes cleanly and populates device inventory.

### Phase 3: Full-Stack Integration
- **Goal:** Bind the React frontend to the FastAPI REST backend.
- **Key Deliverables:**
  - Vite API proxy configuration routing `/api` requests to `http://localhost:8000`.
  - Frontend API service client with seamless offline fallback.
  - Real-time telemetry polling / simulated stream updating charts every 5 seconds.
  - Scenario toggle from frontend triggers backend state and updates telemetry in real time.
- **Acceptance Criteria:**
  - Frontend displays dynamic data served from FastAPI.
  - Toggling an incident scenario in the UI triggers backend rules and generates live incident records.

### Phase 4: Rules Detection & Correlation Engine
- **Goal:** Deterministic, explainable network incident detection.
- **Key Deliverables:**
  - Rule definitions for CRC error storms, packet drop spikes, latency outliers, and link flapping.
  - Blast-radius priority scoring algorithm (0–100) factoring in topology tier.
  - Automated correlation linking raw telemetry samples to incident evidence objects.
- **Acceptance Criteria:**
  - Unit tests verify rule firing when thresholds are breached.
  - Evidence records clearly capture triggering metric values and timestamps.

### Phase 5: Guided Troubleshooting & Human-in-the-Loop Playbooks
- **Goal:** Interactive diagnostic workflows preventing destructive automation.
- **Key Deliverables:**
  - Interactive playbook wizard for common incidents (e.g., SFP replacement, link reroute, BGP reset).
  - Diagnostic test simulation (simulated ping, traceroute, optical dBm readings).
  - Verification checklist requiring operator confirmation before incident resolution.
  - Incident audit log recording operator decisions.
- **Acceptance Criteria:**
  - Operator can step through a playbook, observe diagnostic feedback, and mark incident as resolved.
  - Zero destructive changes executed without operator sign-off.

### Phase 6: Statistical Telemetry Baselines & Anomaly Detection (Optional)
- **Goal:** Non-hallucinatory statistical anomaly detection on time-series telemetry.
- **Key Deliverables:**
  - Rolling Z-score and interquartile range (IQR) calculation service.
  - Visual baseline bands on frontend telemetry charts (expected vs. observed).
  - Confidence scoring explicitly badged as `STATISTICAL_BASELINE`.
- **Acceptance Criteria:**
  - Anomaly scores correctly highlight deviations from normal operating bounds without ungrounded AI claims.

### Phase 7: Verification, Hardening & Demo Delivery
- **Goal:** Deliver a polished, bulletproof prototype ready for stakeholder demonstration.
- **Key Deliverables:**
  - Comprehensive end-to-end verification across frontend and backend.
  - Production build verification (`npm.cmd run build`).
  - Interactive demo script / guided tour guide (`DEMO_GUIDE.md`).
  - Final project review report adhering to serial execution rules.
- **Acceptance Criteria:**
  - Full demo script executable without errors in under 10 minutes.
  - All test suites passing cleanly.
