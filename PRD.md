# Product Requirements Document (PRD)
# NetOps Intelligence: Network Operations Monitoring, Incident Triage & Evidence-Based Troubleshooting

**Document Version:** 1.0.0  
**Phase:** 1 — Product Requirements Definition  
**Domain:** Future of Work & Enterprise Productivity  
**Product Type:** Web application for network operations monitoring, incident triage, and evidence-based troubleshooting assistance  
**Architecture Style:** Modular Monolith (React 19 + TypeScript frontend, Python FastAPI backend, MySQL 8.0 with SQLite fallback)  
**Document Status:** Pending User Review & Approval  

---

## 1. Executive Summary & Competition Context

### 1.1 Competition Context & Foundational Assumption
> [!IMPORTANT]
> **Competition Context Assumption:**  
> No official competition challenge statement or judging rubric document was provided in the repository or prompt.  
> **Working Assumption:** This project is developed to fulfill the domain challenge of **"Future of Work & Enterprise Productivity"** by building a credible, demonstrable, transparent web prototype that assists IT/network operators with monitoring, incident triage, and evidence inspection. No external competition constraints are invented; all requirements derive strictly from the user brief and verified enterprise networking operational standards.

### 1.2 Product Vision
NetOps Intelligence is an operator-centric monitoring and triage console. In modern enterprise environments, network operators are bombarded with fragmented alerts across physical switches, routers, firewalls, and WAN gateways. 

NetOps Intelligence bridges the gap between raw metric overload and actionable remediation. It ingests multi-tier network telemetry, evaluates deterministic rules to surface correlated incidents, calculates explainable priority scores, presents objective forensic evidence, and provides structured, non-destructive troubleshooting playbooks with operator verification at every step.

---

## 2. Problem Statement & Value Proposition

### 2.1 The Problem
1. **Scattered Signals & Alert Fatigue:** Network monitoring tools frequently emit isolated alarms (e.g., interface drop rate high, CPU spike, BGP neighbor down) without showing cross-layer correlation or blast radius.
2. **Delayed MTTR (Mean Time to Resolution):** Operators waste critical minutes manually logging into device CLIs to execute ping, traceroute, and interface statistics queries to determine root cause.
3. **Risk of Destructive Misconfiguration:** Under stressful outage conditions, manual CLI remediation often introduces secondary failures or unexpected service disruptions.
4. **Lack of Evidence Lineage:** Many modern AIOps tools act as opaque "black boxes," asserting root causes without presenting the underlying empirical measurements that justify the claim.

### 2.2 Target Users & Primary Persona
To keep implementation tightly focused and avoid over-engineering, the product specifies one **Primary User** and one **Secondary User**:

* **Primary User (Explicit Target):**  
  **Junior Network Operations Center (NOC) Operator / Tier-1 Support Engineer** (e.g., *Alex*).
  * *Profile:* Works in a student demo, lab, or small-to-mid enterprise IT operations center. Familiar with basic networking concepts (IP addressing, VLANs, CRC errors, ping/traceroute) but lacks decades of senior CLI troubleshooting intuition.
  * *Need:* Needs clear visual indicators, correlated evidence, plain-English explanations of why an incident was flagged, and step-by-step diagnostic checklists that prevent rash or destructive actions.

* **Secondary User (Demo & Governance):**  
  **IT Operations Lead / Hackathon Evaluator** (e.g., *Jordan*).
  * *Profile:* Evaluates operational health, audits incident resolution history, and tests system resilience using controlled anomaly scenario injections.

### 2.3 Value Proposition
* **Observable Clarity:** Consolidates multi-tier telemetry (Core, Aggregation, Access, Firewall, WAN) into a unified visual console.
* **Deterministic, Explainable Prioritization:** Replaces opaque black boxes with deterministic rules and explicit priority scores (0–100) reflecting device criticality and error severity.
* **Audit-Grade Evidence:** Every incident links directly to raw observed measurements, time-series telemetry charts, and rule trigger conditions.
* **Safe, Guided Remediation:** Delivers interactive troubleshooting playbooks with mandatory human verification before any simulated action is recorded.

---

## 3. Safety Boundaries & Core Principles

| Boundary / Principle | Requirement & Enforcement Policy |
| :--- | :--- |
| **Simulated Telemetry First** | All telemetry data in the MVP is synthetically generated via a deterministic, physics-consistent simulation engine. Real external network polling is out of scope for the MVP. |
| **Strict Advisory Safety Boundary** | The application is an **advisory and troubleshooting aid**. It **MUST NOT** execute automated, unattended, or destructive configuration changes (e.g., shutting switchports, reloading hardware, modifying ACLs). All troubleshooting actions are advisory checklists and simulated verification tests requiring operator sign-off. |
| **Data Lineage Transparency** | Every metric, chart, finding, and hypothesis must carry explicit provenance metadata to guarantee intellectual honesty and prevent confusion: <br>• `SIMULATED DATA` — synthetic metrics generated by the local simulator.<br>• `OBSERVED MEASUREMENT` — empirical data points (e.g., 184 CRC errors/s, 94.2% link load).<br>• `RULES_BASED FINDING` — deterministic rule condition breaches.<br>• `UNVERIFIED HYPOTHESIS` — candidate explanations requiring diagnostic verification. |
| **Rules-Based vs. ML Distinction** | The MVP relies exclusively on **deterministic, rules-based incident detection**. Future machine learning / statistical anomaly baselines (Phase 6) are strictly categorized as optional statistical baselines and must never be marketed as infallible "AI root-cause certainty." |
| **Modular Monolith** | Single-repository, modular structure (React/Vite frontend + FastAPI backend). No microservices, distributed message buses, or container orchestrators required for local workstation execution. |

---

## 4. User Journeys

### Journey 1: Inspect Overall Network Health
1. Operator opens the NetOps Intelligence dashboard.
2. Operator observes the **System Health Status Banner** (e.g., `DEGRADED — 2 Active Incidents (1 Critical)`).
3. Operator reviews top-level KPI cards: Total Managed Devices, Online Interfaces, Aggregated Drop Rate, and Average Latency.
4. Operator views the **Topology Tier Summary** to see which network tier (Core, Aggregation, Access, Edge) is experiencing anomalies.

### Journey 2: View a Device & Interface Metrics
1. Operator navigates to the **Device Inventory** tab.
2. Operator filters devices by Role (e.g., `AGGREGATION`) or Status (`DEGRADED`).
3. Operator selects a specific switch (`AGG-SW01`).
4. Device detail modal/drawer opens showing device metadata (hostname, IP, model, rack unit, uptime) and a list of physical interfaces (`HundredGigE0/0/1`, `TenGigE0/1/1`).
5. Operator inspects real-time interface telemetry (bandwidth utilization %, packet drops, error counters).

### Journey 3: Detect & Inspect an Incident
1. Telemetry simulation injects an anomaly (or operator triggers a scenario like *CRC Error Storm*).
2. The **Incident Triage Console** updates in real-time, flashing a new **P1 - Critical** incident: `"High CRC Error Rate on AGG-SW01 Uplink HundredGigE0/0/1"`.
3. Operator clicks the incident to open the **Evidence Inspector**.
4. The Evidence Inspector displays:
   - Summary and Priority Score (`92/100`).
   - Correlated Telemetry Graph showing the time-series surge in CRC frame errors alongside packet drop spikes.
   - Observed Measurements Table contrasting current values with standard baseline thresholds.
   - Rule Finding: `"Rule CR_002 triggered: CRC error rate > 50 errors/sec sustained for > 30s"`.
   - Hypotheses Card: Clearly tagged with `UNVERIFIED HYPOTHESIS: Dirty fiber end-face or failing optical SFP transceiver`.

### Journey 4: Acknowledge, Update & Resolve an Incident
1. Operator clicks **Acknowledge Incident**, transitioning status from `NEW` to `ACKNOWLEDGED` (assigning Alex as operator).
2. Operator clicks **Investigate / Start Playbook**, transitioning status to `INVESTIGATING`.
3. The **Guided Troubleshooting Playbook** guides Alex through step-by-step diagnostic actions:
   - *Step 1: Interface Diagnostics* — operator triggers a simulated diagnostic check (`show interface transceiver detail`); view simulated optical power reading (-18.2 dBm, below -14 dBm threshold).
   - *Step 2: Redundant Path Check* — operator confirms secondary uplink `HundredGigE0/0/2` has capacity and zero drops.
   - *Step 3: Advisory Remediation* — playbook advises: "Schedule physical fiber inspection and SFP replacement. Shift primary transit to redundant uplink."
4. Operator records resolution notes (`"Verified SFP optical degradation on AGG-SW01 port 1. Shifted active traffic to secondary link."`).
5. Operator clicks **Mark Incident Resolved**, transitioning status to `RESOLVED`.

### Journey 5: Review Incident History & Audit Trail
1. Operator switches filter to `RESOLVED` or views the **Incident Audit History** tab.
2. Operator inspects MTTR (Mean Time to Resolution), timeline of state transitions, operator notes, and diagnostic verification results.

---

## 5. Functional Requirements

### 5.1 Overview Dashboard
* **FR-1.1 Global Status Summary:** Display overall network health state (`HEALTHY`, `DEGRADED`, `CRITICAL`), active incident counts grouped by severity (P1, P2, P3, P4), and managed device counts.
* **FR-1.2 Tiered Topology Overview:** Visual representation of network tiers (Core $\rightarrow$ Aggregation $\rightarrow$ Access $\rightarrow$ WAN/Firewall) with color-coded health badges.
* **FR-1.3 Recent Incident Feed:** Live stream of the most recent alerts and incidents.
* **FR-1.4 Data Lineage Banner:** Persistent banner in the header stating: `SIMULATION MODE — Synthetic Telemetry Active`.

### 5.2 Device Inventory & Status
* **FR-2.1 Device Registry:** Display all managed network devices with attributes: Hostname, IP address, Device Role (`CORE`, `AGGREGATION`, `ACCESS`, `FIREWALL`, `WAN`), Physical Site/Rack, Firmware Version, and Status (`HEALTHY`, `DEGRADED`, `CRITICAL`, `MAINTENANCE`).
* **FR-2.2 Interface Inspection:** For each device, show interface list, operational state (`UP`/`DOWN`), admin state, configured speed, connected peer device, and current throughput.
* **FR-2.3 Device Search & Filter:** Instant search by hostname or IP address; filter by device role and health status.

### 5.3 Metric History & Telemetry Visualization
* **FR-3.1 Time-Series Charts:** Multi-metric telemetry charts over rolling time windows (last 5 min, 15 min, 1 hour):
  - Inbound & Outbound Bandwidth Utilization (%)
  - Packet Drop Rate (%)
  - One-way Latency (ms) and Jitter (ms)
  - Frame Errors & CRC Error Rate (errors/second)
  - Device CPU Utilization (%) and Memory Utilization (%)
* **FR-3.2 Visual Threshold Reference Lines:** Charts must display horizontal reference lines indicating warning and critical rule thresholds.
* **FR-3.3 Data Sampling Frequency:** Default simulated sampling interval is 5 seconds.

### 5.4 Incident Triage Console & Details
* **FR-4.1 Incident Queue:** List of all detected incidents displaying: Incident ID, Title, Severity Badge (`P1 - Critical`, `P2 - High`, `P3 - Medium`, `P4 - Low`), Priority Score (`0–100`), Affected Device/Interface, Age/Timestamp, and Lifecycle Status.
* **FR-4.2 Incident Severity Matrix:**
  - `P1 (Critical)`: Affects Core/WAN tier, severe throughput collapse, or packet drops $> 10\%$.
  - `P2 (High)`: Loss of link redundancy, aggregation tier degradation, or sustained CRC error storm.
  - `P3 (Medium)`: Single access switch degradation, elevated CPU $> 85\%$, or single interface drop rate $> 2\%$.
  - `P4 (Low)`: Transient latency jitter, informational threshold warnings, or non-impacting interface flaps.
* **FR-4.3 Priority Scoring (Explainable):**
  $$\text{Priority Score} = \text{Clamp}_{0}^{100}\Big(\text{Tier Weight} \times 0.4 + \text{Metric Severity} \times 0.4 + \text{Blast Radius} \times 0.2\Big)$$
  where Tier Weight: Core=100, WAN=90, Aggregation=75, Firewall=70, Access=50.

### 5.5 Filtering, Sorting & Search
* **FR-5.1 Multi-Dimensional Filtering:** Filter incidents by Severity (P1–P4), Lifecycle Status (`NEW`, `ACKNOWLEDGED`, `INVESTIGATING`, `RESOLVED`), and Device Role.
* **FR-5.2 Sorting:** Sort incident queue by Priority Score (descending/ascending), Detected Timestamp (newest/oldest), or Severity.
* **FR-5.3 Quick Text Search:** Filter incidents by device name, interface, or keyword in the title.

### 5.6 Evidence Inspector
* **FR-6.1 Correlated Evidence View:** A dedicated inspector view that gathers all empirical proof associated with an incident.
* **FR-6.2 Observed Measurements Card:** Key-value table showing exact measurements recorded at trigger time vs. expected baselines.
* **FR-6.3 Trigger Rule Explanation:** Human-readable rule explanation (e.g., `Triggered by Rule CR_002: Sustained CRC error rate exceeded 50/s for 3 consecutive sampling cycles`).
* **FR-6.4 Hypothesis & Confidence Tagging:** Prominently display candidate hypotheses tagged with `CONFIDENCE: UNVERIFIED HYPOTHESIS` to ensure the operator validates facts before deciding on remediation.

### 5.7 Guided Troubleshooting Playbooks (Advisory)
* **FR-7.1 Playbook Catalog:** Pre-configured diagnostic playbooks mapped to specific incident types:
  - *Playbook A: Optical Physical Layer & CRC Storm Triage*
  - *Playbook B: WAN Uplink Congestion & Buffer Saturation*
  - *Playbook C: BGP Neighbor Flap & Peering State Verification*
  - *Playbook D: Switch Control-Plane CPU Spike & Broadcast Storm*
* **FR-7.2 Step-by-Step Diagnostic Verification:** Each playbook provides clear, sequential steps:
  1. Inspect physical layer metrics (`show interface detail`).
  2. Execute simulated ping / latency reachability check.
  3. Validate alternate / redundant path capacity.
  4. Formulate non-destructive operational recommendation.
* **FR-7.3 Operator Checklists & Sign-Off:** Operator must interactively check off verification steps and enter resolution notes before incident closure.

### 5.8 Incident Lifecycle & State Changes
* **FR-8.1 State Transitions:** Enforce valid state progression:
  $$\text{NEW} \longrightarrow \text{ACKNOWLEDGED} \longrightarrow \text{INVESTIGATING} \longrightarrow \text{RESOLVED}$$
* **FR-8.2 Reopen Capability:** Resolved incidents can be reopened if the simulation scenario re-triggers.
* **FR-8.3 Resolution Audit Log:** Persist timestamp, operator name, duration in each state, and final resolution notes.

### 5.9 Demo Scenario Controls
* **FR-9.1 Live Scenario Injection Toolbar:** A dedicated control bar allowing demo presenters to inject real-world network failure conditions instantly:
  - *Scenario 1: Normal Baseline* (all metrics healthy, low jitter, zero CRC errors).
  - *Scenario 2: SFP Optical Degradation / CRC Error Storm* on Aggregation uplink.
  - *Scenario 3: WAN Link Congestion & Packet Drops* on Edge Gateway.
  - *Scenario 4: BGP Peering Flap & Route Instability* on Core Router.
* **FR-9.2 Simulation Reset:** One-click button to reset all telemetry to normal healthy baseline.

---

## 6. Data Definitions & Provenance Taxonomy

### 6.1 Entities & Attributes

#### `Device`
- `id` (string, UUID or slug, e.g. `dev-cor-01`)
- `hostname` (string, e.g. `COR-RTR01`)
- `ip_address` (string, IPv4 management address)
- `role` (enum: `CORE`, `AGGREGATION`, `ACCESS`, `FIREWALL`, `WAN`)
- `model` (string, e.g. `Catalyst 9500-48Y4C`)
- `rack_location` (string, e.g. `DC1-Rack-04-U12`)
- `status` (enum: `HEALTHY`, `DEGRADED`, `CRITICAL`, `MAINTENANCE`)
- `uptime_seconds` (integer)
- `created_at` (datetime ISO 8601 UTC)

#### `Interface`
- `id` (string, UUID, e.g. `intf-agg01-01`)
- `device_id` (string, foreign key referencing `Device.id`)
- `name` (string, e.g. `HundredGigE0/0/1`)
- `speed_gbps` (integer, e.g. `100`)
- `admin_status` (enum: `UP`, `DOWN`)
- `oper_status` (enum: `UP`, `DOWN`)
- `connected_peer` (string, e.g. `COR-RTR01:HundredGigE0/0/2`)

#### `TelemetrySample`
- `id` (integer / bigint, auto-increment)
- `interface_id` (string, foreign key referencing `Interface.id`)
- `timestamp` (datetime ISO 8601 UTC)
- `bandwidth_util_pct` (float, 0.0 to 100.0)
- `packet_drop_pct` (float, 0.0 to 100.0)
- `latency_ms` (float, milliseconds)
- `jitter_ms` (float, milliseconds)
- `crc_errors_per_sec` (integer, frame error rate)
- `cpu_util_pct` (float, 0.0 to 100.0)
- `memory_util_pct` (float, 0.0 to 100.0)
- `data_origin` (string, constant: `SIMULATED`)

#### `Incident`
- `id` (string, e.g. `INC-2026-001`)
- `device_id` (string, foreign key referencing `Device.id`)
- `interface_id` (string, optional foreign key)
- `title` (string, summary description)
- `severity` (enum: `P1`, `P2`, `P3`, `P4`)
- `status` (enum: `NEW`, `ACKNOWLEDGED`, `INVESTIGATING`, `RESOLVED`)
- `priority_score` (integer, 0 to 100)
- `detected_at` (datetime ISO 8601 UTC)
- `acknowledged_at` (datetime ISO 8601 UTC, nullable)
- `resolved_at` (datetime ISO 8601 UTC, nullable)
- `assigned_operator` (string, e.g. `Alex (NOC Tier-1)`)
- `resolution_notes` (text, nullable)
- `active_scenario` (string, e.g. `SCENARIO_CRC_STORM`)

#### `IncidentEvidence`
- `id` (string, e.g. `EVID-001`)
- `incident_id` (string, foreign key referencing `Incident.id`)
- `metric_name` (string, e.g. `crc_errors_per_sec`)
- `observed_value` (string, e.g. `184 errors/sec`)
- `threshold_value` (string, e.g. `> 50 errors/sec`)
- `confidence_tier` (enum: `OBSERVED_MEASUREMENT`, `RULES_BASED_FINDING`, `UNVERIFIED_HYPOTHESIS`)
- `details_json` (JSON string / payload containing chart point slices and rule trigger parameters)
- `recorded_at` (datetime ISO 8601 UTC)

#### `Playbook` & `PlaybookStep`
- `playbook_id` (string, e.g. `PB-SFP-CRC`)
- `title` (string)
- `target_incident_type` (string)
- `steps` (array of step objects: `step_number`, `instruction`, `diagnostic_command`, `simulated_output`, `requires_verification`)

### 6.2 Data Lineage Taxonomy Standards
Every data record displayed on the frontend or returned via API must adhere to this classification:
* **`DATA_ORIGIN`:** Always `SIMULATED` in the current prototype.
* **`OBSERVED_MEASUREMENT`:** Concrete numerical data points obtained from the telemetry stream.
* **`RULES_BASED_FINDING`:** Logical evaluation resulting from a deterministic rule match.
* **`UNVERIFIED_HYPOTHESIS`:** Suggested root cause prior to operator diagnostic validation.
* **`VERIFIED_DIAGNOSTIC`:** Finding validated after diagnostic checklist execution.

---

## 7. Roles, Permissions & Authentication Scope

> [!IMPORTANT]
> **Authentication Scope Decision:**  
> In accordance with the serial execution rules and boundary guidelines ("Do not add authentication, external AI APIs, real device polling, containers, or extra infrastructure unless the PRD establishes a real need"), **Authentication, User Login, and Complex Multi-Tenant RBAC are explicitly OUT OF SCOPE for the MVP**.

* **Operational Persona Switcher:** The application operates in single-operator demo/evaluator mode. The UI provides a simulated operator badge (defaulting to `Alex (NOC Tier-1)`) with a quick toggle to `Jordan (IT Lead)` to demonstrate audit trails without authentication overhead.
* **Audit Logging:** Every state change and playbook verification records the active operator profile name and timestamp directly into the incident record.

---

## 8. UX States & Edge Case Specifications

| State | Visual Treatment & Behavior |
| :--- | :--- |
| **Loading State** | Skeleton loaders for summary KPI cards, topology nodes, and incident rows. Telemetry charts display an animated pulse line until the first telemetry payload loads. |
| **Empty State** | When no incidents match current filter criteria: displays a clean graphic with the message *"No incidents match current filters"* and a one-click button *"Reset Filters"* or *"Inject Demo Incident"*. |
| **Error State** | If a REST endpoint fails or data fails to parse: an inline non-blocking toast/banner appears (*"Unable to retrieve telemetry updates. Operating on cached local data."*) with a *"Retry Connection"* button. |
| **Stale-Data State** | If telemetry updates are not received within 2 sampling intervals (10 seconds): a yellow warning badge appears on charts (*"Telemetry Stale — Polling Interrupted"*). |
| **Simulated-Data State** | High-contrast, persistent badge in the top navigation bar and chart headers labeled `SIMULATED DATA`, ensuring complete transparency during presentations. |

---

## 9. Non-Functional Requirements (NFRs)

### 9.1 Correctness & Network Physical Consistency
- Metric relationships must be realistic: high bandwidth utilization (>95%) must correlate with increased latency and buffer drop rates; CRC errors must correlate with physical frame discard rates.

### 9.2 Maintainability & Architecture Integrity
- Modular Monolith structure strictly separating Presentation (`frontend/`), Business Logic (`backend/app/services`), REST Controllers (`backend/app/routers`), and Persistence (`backend/app/models`).
- Strict TypeScript (`strict: true`) on the frontend; Pydantic v2 validation models on the backend.

### 9.3 Accessibility & Visual Usability
- Professional Dark NOC Theme complying with WCAG 2.1 AA contrast ratios (background `#0B0F19`, high-contrast text `#F3F4F6`, accessible semantic alerts: Emerald `#10B981`, Amber `#F59E0B`, Rose `#F43F5E`, Blue `#3B82F6`).
- Keyboard navigation accessibility for the incident triage queue (arrow keys, Enter to open, Esc to close).

### 9.4 Responsive Layout & Form Factors
- Optimized for standard desktop and laptop displays (1280x720 minimum, 1920x1080 optimal).
- Responsive collapsing navigation drawer for smaller screens.

### 9.5 Local Performance
- Client-side initial page load under 1.5 seconds on standard hardware.
- Telemetry chart re-rendering executes in under 50ms without frame stuttering.
- Total memory footprint under 200MB for the running frontend.

### 9.6 Privacy & Secure Configuration
- Zero real hostnames, internal corporate IP addresses, customer PII, or credentials in source code or sample datasets.
- Configuration isolated to `.env.example` and `.env`.

---

## 10. MVP Scope vs. Out-of-Scope Matrix

| Feature / Capability | In MVP Scope | Out of Scope (Future) | Rationale |
| :--- | :---: | :---: | :--- |
| **Simulated Network Telemetry Engine** | ✅ Yes | — | Critical for credible, repeatable demonstrations. |
| **Multi-Tier Topology Visualizer** | ✅ Yes | — | Essential for blast-radius triage. |
| **Incident Triage Console (P1–P4)** | ✅ Yes | — | Core user value proposition. |
| **Evidence Inspector with Time-Series** | ✅ Yes | — | Essential for evidence-based decision making. |
| **Guided Troubleshooting Playbooks** | ✅ Yes | — | Operator-in-the-loop remediation aid. |
| **Demo Scenario Injection Controls** | ✅ Yes | — | Enables instant live demonstration of failures. |
| **Deterministic Rules-Based Detection** | ✅ Yes | — | Explainable, reliable, zero hallucination. |
| **MySQL 8.0 + SQLite Persistence** | ✅ Yes | — | Preserves incidents and audit history across sessions. |
| **User Authentication / RBAC / SSO** | ❌ No | ✅ Future | Unnecessary overhead for local prototype. |
| **Automated Destructive Device Changes** | ❌ No | ❌ Forbidden | Violates non-destructive safety boundary. |
| **Real Device SNMP/SSH/gNMI Polling** | ❌ No | ✅ Future | Boundary: add real telemetry only after simulated flow is stable. |
| **External AI / LLM API Dependencies** | ❌ No | ✅ Future | Avoids external token costs, latency, and hallucinations. |
| **Container / Kubernetes Orchestration**| ❌ No | ✅ Future | Windows laptop compatibility without Docker requirement. |

---

## 11. Technical Risks & Mitigation Strategies

| Risk | Impact | Likelihood | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **MySQL Local Authentication Friction** | High | Medium | Implement automatic SQLite database fallback (`SQLITE_DB_PATH`) in `backend/app/database.py` so the application runs immediately without MySQL configuration. |
| **Windows PowerShell Script Execution Policy** | Medium | High | Standardize all scripts to use `npm.cmd` and provide explicit execution commands. |
| **Telemetry UI Re-render Overhead** | Medium | Low | Limit client-side chart history to 30 data points per metric window; use lightweight SVG rendering. |
| **Ambiguity Between Hypothesis & Fact** | High | Low | Enforce explicit visual color coding and badge labels (`VERIFIED MEASUREMENT` vs `UNVERIFIED HYPOTHESIS`). |

---

## 12. Success Criteria & Measurable Acceptance Tests

| # | Acceptance Test Case | Execution Steps | Expected Outcome |
| :-: | :--- | :--- | :--- |
| **TC-1** | **Health Overview Visibility** | Open home dashboard. | KPI cards, topology tiers, and data lineage banner render within 1.5s with zero errors. |
| **TC-2** | **Device Filtering & Inspection** | Navigate to Devices; filter by `AGGREGATION`. | List filters to aggregation switches; clicking a switch displays its interface table and status. |
| **TC-3** | **Scenario Injection (CRC Storm)** | In the Scenario Bar, select `SFP Optical Degradation / CRC Storm`. | Within 5s, CRC error rate spikes on `AGG-SW01:HundredGigE0/0/1`; a **P1 Critical** incident appears. |
| **TC-4** | **Incident Prioritization** | Check incident queue order. | The new incident receives a Priority Score $\ge 85$ and ranks at the top of the queue. |
| **TC-5** | **Evidence Inspection** | Click incident row to open Evidence Inspector. | Evidence view shows time-series spike graph, observed CRC value (`>150/s`), and rule `CR_002` trigger explanation. |
| **TC-6** | **Hypothesis Badging** | Inspect hypothesis card in Evidence Inspector. | Clearly displays badge `CONFIDENCE: UNVERIFIED HYPOTHESIS` with prompt for optical diagnostic check. |
| **TC-7** | **Incident State Progression** | Click *Acknowledge*, then *Investigate*. | Status transitions `NEW` $\rightarrow$ `ACKNOWLEDGED` $\rightarrow$ `INVESTIGATING` with updated operator name and timestamp. |
| **TC-8** | **Guided Playbook Execution** | Execute Playbook Step 1 (Simulated Optical Test), confirm findings, add note, click *Resolve*. | Diagnostic output displays simulated optical reading; incident transitions to `RESOLVED` with audit entry. |
| **TC-9** | **Safety Boundary Verification** | Verify network devices after playbook execution. | No destructive configuration changes or port shut commands are executed. |
| **TC-10**| **Scenario Reset** | Click *Reset to Normal Baseline*. | All metrics return to normal; active incident count returns to 0. |

---

## 13. Open Decisions Requiring Approval

The following design decisions are documented as sensible working defaults and flagged for explicit stakeholder approval:

1. **Authentication Scope:**  
   *Default Decision:* Authentication is completely **out of scope** for the MVP. A lightweight persona switcher (`Alex (NOC Tier-1)` vs `Jordan (IT Lead)`) provides operator attribution without login barriers.
2. **Persistence Strategy:**  
   *Default Decision:* Dual-mode database connection. The backend defaults to local MySQL 8.0 (`mysql+pymysql://root@127.0.0.1:3306/netops_db`), but automatically falls back to SQLite (`backend/netops_local.db`) if MySQL is unreachable, ensuring uninterrupted development.
3. **Frontend Prototype First Execution Sequence:**  
   *Default Decision:* Next Phase (Phase 2 in serial execution) will be the **Architecture & System Design** (confirming data schemas and API contracts), followed immediately by the **Frontend Prototype** with a self-contained simulated store.
