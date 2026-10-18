# REST API Contract Specification (API.md)
# NetOps Intelligence: Operations Monitoring, Incident Triage & Telemetry API

**Document Version:** 1.0.0  
**Phase:** 5 — API Contract Specification  
**Approved PRD Reference:** [`PRD.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/PRD.md)  
**Approved Architecture Reference:** [`ARCHITECTURE.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/ARCHITECTURE.md)  
**Approved Database Reference:** [`DATABASE.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/DATABASE.md)  
**Status:** Complete — Pending User Review & Approval  

---

## 1. Global API Standards & Conventions

### 1.1 Base URL & Content Negotiation
* **Base URL:** `http://localhost:8000/api` (versioned alias: `/api/v1`)
* **Content-Type:** `application/json; charset=utf-8` for all requests and responses
* **Character Encoding:** UTF-8 strictly enforced

### 1.2 Timestamps, Units & Provenance Standards
* **Timestamps:** All timestamps are strictly formatted in ISO 8601 UTC with a trailing `Z`:  
  `YYYY-MM-DDTHH:mm:ssZ` (e.g., `2026-10-18T11:24:00Z`).
* **Metric Units:** Explicitly typed and documented on all telemetry payloads:
  - Bandwidth: Utilization percentage `0.0–100.0%` (`bandwidth_util_pct`) and throughput `Mbps` (`bandwidth_mbps`).
  - Packet Drops: Percentage `0.0–100.0%` (`packet_drop_pct`).
  - Latency & Jitter: Milliseconds (`ms`).
  - Frame Errors: Errors per second (`crc_errors_per_sec`).
  - Resource Usage: Percentage `0.0–100.0%` (`cpu_util_pct`, `memory_util_pct`).
* **Provenance Standards:** Every telemetry and incident record carries explicit provenance metadata:
  - `data_origin`: Always `'SIMULATED'` in current prototype.
  - `confidence_tier`: `'OBSERVED_MEASUREMENT'`, `'RULES_BASED_FINDING'`, or `'UNVERIFIED_HYPOTHESIS'`.

### 1.3 Error Response Format (RFC 7807 Problem Details)
All client (4xx) and server (5xx) errors return a standardized RFC 7807 JSON structure:

```json
{
  "status": 404,
  "title": "Device Not Found",
  "detail": "Device with ID 'dev-agg-99' does not exist in the inventory.",
  "error_code": "DEVICE_NOT_FOUND",
  "timestamp": "2026-10-18T11:24:00Z",
  "invalid_params": []
}
```

#### Stable Error Codes Catalog

| Error Code | HTTP Status | Description |
| :--- | :---: | :--- |
| `VALIDATION_ERROR` | 422 | Request body or query parameters failed Pydantic schema validation. |
| `DEVICE_NOT_FOUND` | 404 | Specified device ID does not exist in inventory. |
| `INTERFACE_NOT_FOUND` | 404 | Specified interface ID does not exist. |
| `INCIDENT_NOT_FOUND` | 404 | Specified incident ID does not exist. |
| `INVALID_STATE_TRANSITION`| 409 | Attempted invalid incident lifecycle transition (e.g. `NEW` $\rightarrow$ `RESOLVED` directly). |
| `PLAYBOOK_NOT_FOUND` | 404 | Specified playbook ID does not exist. |
| `INVALID_SCENARIO` | 400 | Specified demo scenario identifier is unrecognized. |
| `DATABASE_ERROR` | 500 | Database read/write failure (triggers automatic SQLite fallback log). |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception. |

### 1.4 Operator Attribution & Authentication Scope
* **Authentication:** Dedicated passwords, tokens, and login endpoints are **out of scope for MVP**.
* **Operator Attribution:** The active operator persona is sent via the optional request header:
  `X-Operator-Id: Alex (NOC Tier-1)` (or `Jordan (IT Lead)`).
  If omitted, defaults to `'Alex (NOC Tier-1)'`.

---

## 2. Endpoint Catalog & Specifications

```
+--------------------------------------------------------------------------------------------------+
| CATEGORY       | METHOD | PATH                                 | SUMMARY                         |
+----------------+--------+--------------------------------------+---------------------------------+
| System Health  | GET    | /api/health                          | Health, Readiness & DB Status   |
| Devices        | GET    | /api/devices                         | List Devices with Filters       |
|                | GET    | /api/devices/{id}                    | Detailed Device & Interfaces    |
|                | GET    | /api/devices/{id}/interfaces         | List Interfaces for Device      |
| Telemetry      | GET    | /api/telemetry/live                  | Real-Time Metric Snapshot       |
|                | GET    | /api/telemetry/history               | Rolling Time-Series Window      |
| Incidents      | GET    | /api/incidents                       | Filterable Incident Queue       |
|                | GET    | /api/incidents/{id}                  | Single Incident Detail          |
|                | PATCH  | /api/incidents/{id}/status           | Transition Lifecycle State      |
|                | GET    | /api/incidents/{id}/evidence         | Correlated Evidence Package     |
|                | GET    | /api/incidents/{id}/history          | Status Transition Audit Trail   |
| Playbooks      | GET    | /api/playbooks/{id}                  | Fetch Troubleshooting Steps     |
|                | POST   | /api/playbooks/{id}/execute-step     | Execute Simulated Diagnostic    |
| Demo Scenarios | GET    | /api/scenarios                       | List Demo Scenarios & Active    |
|                | POST   | /api/scenarios/inject                | Inject Network Anomaly Scenario |
|                | POST   | /api/scenarios/reset                 | Reset to Normal Baseline        |
+--------------------------------------------------------------------------------------------------+
```

---

### 2.1 System Health & Readiness

#### `GET /api/health`
* **Purpose:** Local readiness check verifying API service, database connectivity mode, and simulation engine.
* **Authentication:** None.
* **Status Codes:** `200 OK`, `503 Service Unavailable`.
* **Response Schema (`HealthResponse`):**
  ```json
  {
    "status": "HEALTHY",
    "version": "1.0.0",
    "timestamp": "2026-10-18T11:24:00Z",
    "uptime_seconds": 3600,
    "database": {
      "connected": true,
      "engine": "MySQL 8.0",
      "is_fallback": false,
      "latency_ms": 1.2
    },
    "simulation": {
      "active": true,
      "active_scenario": "NORMAL_BASELINE",
      "sampling_interval_seconds": 5
    }
  }
  ```

---

### 2.2 Devices & Interfaces

#### `GET /api/devices`
* **Purpose:** List all managed network devices with optional role and status filters.
* **Query Parameters:**
  - `role` (string, optional): Filter by role (`CORE`, `AGGREGATION`, `ACCESS`, `FIREWALL`, `WAN`).
  - `status` (string, optional): Filter by status (`HEALTHY`, `DEGRADED`, `CRITICAL`, `MAINTENANCE`).
  - `search` (string, optional): Substring match against `hostname` or `ip_address`.
* **Status Codes:** `200 OK`.
* **Response Schema (`List[DeviceSummary]`):**
  ```json
  [
    {
      "id": "dev-agg-01",
      "hostname": "AGG-SW01",
      "ip_address": "192.0.2.11",
      "role": "AGGREGATION",
      "status": "DEGRADED",
      "model": "Cisco Nexus 9300-FX3",
      "rack_location": "DC1-Rack-04-U28",
      "uptime_seconds": 864200,
      "total_interfaces": 4,
      "online_interfaces": 3,
      "active_incidents_count": 1,
      "updated_at": "2026-10-18T11:23:55Z"
    }
  ]
  ```

#### `GET /api/devices/{id}`
* **Purpose:** Fetch detailed device metadata including physical interface table.
* **Path Parameters:**
  - `id` (string, required): Unique device ID (e.g. `dev-agg-01`).
* **Status Codes:** `200 OK`, `404 Not Found`.
* **Response Schema (`DeviceDetail`):**
  ```json
  {
    "id": "dev-agg-01",
    "hostname": "AGG-SW01",
    "ip_address": "192.0.2.11",
    "role": "AGGREGATION",
    "status": "DEGRADED",
    "model": "Cisco Nexus 9300-FX3",
    "rack_location": "DC1-Rack-04-U28",
    "uptime_seconds": 864200,
    "interfaces": [
      {
        "id": "intf-agg01-01",
        "name": "HundredGigE0/0/1",
        "speed_gbps": 100,
        "admin_status": "UP",
        "oper_status": "UP",
        "connected_peer": "COR-RTR01:HundredGigE0/0/1",
        "current_bandwidth_util_pct": 74.2,
        "current_packet_drop_pct": 6.8,
        "current_crc_errors_per_sec": 184
      }
    ],
    "created_at": "2026-10-18T10:00:00Z",
    "updated_at": "2026-10-18T11:23:55Z"
  }
  ```

---

### 2.3 Telemetry & Metrics

#### `GET /api/telemetry/live`
* **Purpose:** Snapshot of the most recent telemetry sample across all active interfaces.
* **Status Codes:** `200 OK`.
* **Response Schema (`List[TelemetrySlice]`):**
  ```json
  [
    {
      "interface_id": "intf-agg01-01",
      "device_id": "dev-agg-01",
      "device_hostname": "AGG-SW01",
      "interface_name": "HundredGigE0/0/1",
      "timestamp": "2026-10-18T11:24:00Z",
      "bandwidth_util_pct": 74.2,
      "bandwidth_mbps": 74200.0,
      "packet_drop_pct": 6.8,
      "latency_ms": 28.4,
      "jitter_ms": 4.2,
      "crc_errors_per_sec": 184,
      "cpu_util_pct": 42.0,
      "memory_util_pct": 58.5,
      "data_origin": "SIMULATED"
    }
  ]
  ```

#### `GET /api/telemetry/history`
* **Purpose:** Sliding-window time-series telemetry data for rendering Recharts graphs.
* **Query Parameters:**
  - `interface_id` (string, optional): Specific interface ID filter.
  - `device_id` (string, optional): Filter all interfaces for a device.
  - `window` (string, optional, default: `'5m'`): Rolling window (`'5m'`, `'15m'`, `'1h'`).
  - `limit` (int, optional, default: `30`, max: `300`): Maximum samples returned.
* **Status Codes:** `200 OK`, `400 Bad Request`.
* **Response Schema (`TelemetryHistoryResponse`):**
  ```json
  {
    "query": {
      "interface_id": "intf-agg01-01",
      "window": "5m",
      "returned_samples": 30
    },
    "samples": [
      {
        "timestamp": "2026-10-18T11:21:30Z",
        "bandwidth_util_pct": 45.1,
        "packet_drop_pct": 0.0,
        "latency_ms": 8.2,
        "jitter_ms": 1.1,
        "crc_errors_per_sec": 0,
        "cpu_util_pct": 32.0,
        "data_origin": "SIMULATED"
      },
      {
        "timestamp": "2026-10-18T11:24:00Z",
        "bandwidth_util_pct": 74.2,
        "packet_drop_pct": 6.8,
        "latency_ms": 28.4,
        "jitter_ms": 4.2,
        "crc_errors_per_sec": 184,
        "cpu_util_pct": 42.0,
        "data_origin": "SIMULATED"
      }
    ]
  }
  ```

---

### 2.4 Incidents & Triage

#### `GET /api/incidents`
* **Purpose:** Filterable, sortable, paginated incident queue for the Incident Triage Console.
* **Query Parameters:**
  - `status` (string, optional): Filter by lifecycle state (`NEW`, `ACKNOWLEDGED`, `INVESTIGATING`, `RESOLVED`, or `active` for non-resolved).
  - `severity` (string, optional): Filter by severity (`P1`, `P2`, `P3`, `P4`).
  - `device_id` (string, optional): Filter by affected device ID.
  - `search` (string, optional): Text search against title or device hostname.
  - `sort_by` (string, optional, default: `'priority_score'`): Sort field (`priority_score`, `detected_at`, `severity`).
  - `order` (string, optional, default: `'desc'`): Sort direction (`asc`, `desc`).
  - `limit` (int, optional, default: `20`, max: `100`): Pagination limit.
  - `offset` (int, optional, default: `0`): Pagination offset.
* **Status Codes:** `200 OK`.
* **Response Schema (`IncidentListResponse`):**
  ```json
  {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "items": [
      {
        "id": "INC-2026-001",
        "title": "High CRC Error Rate on AGG-SW01 Uplink HundredGigE0/0/1",
        "severity": "P1",
        "status": "NEW",
        "priority_score": 92,
        "device_id": "dev-agg-01",
        "device_hostname": "AGG-SW01",
        "interface_id": "intf-agg01-01",
        "interface_name": "HundredGigE0/0/1",
        "detected_at": "2026-10-18T11:22:15Z",
        "assigned_operator": null,
        "active_scenario": "SCENARIO_CRC_STORM"
      }
    ]
  }
  ```

#### `GET /api/incidents/{id}`
* **Purpose:** Retrieve full incident detail record.
* **Path Parameters:**
  - `id` (string, required): Incident identifier (e.g. `INC-2026-001`).
* **Status Codes:** `200 OK`, `404 Not Found`.
* **Response Schema (`IncidentDetail`):**
  ```json
  {
    "id": "INC-2026-001",
    "title": "High CRC Error Rate on AGG-SW01 Uplink HundredGigE0/0/1",
    "severity": "P1",
    "status": "INVESTIGATING",
    "priority_score": 92,
    "priority_score_breakdown": {
      "tier_weight": 75,
      "metric_severity": 100,
      "blast_radius": 95,
      "formula": "Clamp(75*0.4 + 100*0.4 + 95*0.2) = 92"
    },
    "device_id": "dev-agg-01",
    "device_hostname": "AGG-SW01",
    "interface_id": "intf-agg01-01",
    "interface_name": "HundredGigE0/0/1",
    "detected_at": "2026-10-18T11:22:15Z",
    "acknowledged_at": "2026-10-18T11:23:00Z",
    "resolved_at": null,
    "assigned_operator": "Alex (NOC Tier-1)",
    "resolution_notes": null,
    "active_scenario": "SCENARIO_CRC_STORM",
    "playbook_id": "PB-SFP-CRC"
  }
  ```

#### `PATCH /api/incidents/{id}/status`
* **Purpose:** Advance incident lifecycle state. Enforces strict state machine:  
  $$\text{NEW} \longrightarrow \text{ACKNOWLEDGED} \longrightarrow \text{INVESTIGATING} \longrightarrow \text{RESOLVED}$$
* **Request Body (`IncidentStatusUpdate`):**
  ```json
  {
    "new_status": "ACKNOWLEDGED",
    "notes": "Acknowledged alarm. Initial inspection underway.",
    "operator_name": "Alex (NOC Tier-1)"
  }
  ```
* **Validation Rules:**
  - `new_status` must be valid enum value.
  - Direct transition from `NEW` to `RESOLVED` is rejected with `409 Conflict`.
  - Marking `RESOLVED` requires non-empty `notes`.
* **Status Codes:** `200 OK`, `400 Bad Request`, `404 Not Found`, `409 Conflict`.
* **Response Schema:** Returns updated `IncidentDetail`.

#### `GET /api/incidents/{id}/evidence`
* **Purpose:** Fetch forensic evidence package substantiating why an incident was triggered.
* **Path Parameters:**
  - `id` (string, required): Incident identifier.
* **Status Codes:** `200 OK`, `404 Not Found`.
* **Response Schema (`EvidencePackageResponse`):**
  ```json
  {
    "incident_id": "INC-2026-001",
    "captured_at": "2026-10-18T11:22:15Z",
    "rules_triggered": [
      {
        "rule_id": "CR_002",
        "rule_name": "Optical Physical Layer CRC Storm",
        "condition": "crc_errors_per_sec > 50 sustained for > 30s",
        "confidence_tier": "RULES_BASED_FINDING"
      }
    ],
    "observed_measurements": [
      {
        "metric_name": "crc_errors_per_sec",
        "observed_value": "184 errors/sec",
        "threshold_value": "< 5 errors/sec",
        "unit": "errors/sec",
        "confidence_tier": "OBSERVED_MEASUREMENT"
      },
      {
        "metric_name": "packet_drop_pct",
        "observed_value": "6.8%",
        "threshold_value": "< 0.1%",
        "unit": "%",
        "confidence_tier": "OBSERVED_MEASUREMENT"
      }
    ],
    "hypotheses": [
      {
        "hypothesis": "Dirty fiber end-face or failing optical SFP transceiver on HundredGigE0/0/1.",
        "confidence_tier": "UNVERIFIED_HYPOTHESIS",
        "recommended_action": "Execute Playbook PB-SFP-CRC to inspect optical Rx power before physical replacement."
      }
    ]
  }
  ```

#### `GET /api/incidents/{id}/history`
* **Purpose:** Fetch the complete state-transition audit log for an incident.
* **Status Codes:** `200 OK`, `404 Not Found`.
* **Response Schema (`List[StatusHistoryItem]`):**
  ```json
  [
    {
      "id": "HIST-001",
      "incident_id": "INC-2026-001",
      "previous_status": "NEW",
      "new_status": "ACKNOWLEDGED",
      "operator_name": "Alex (NOC Tier-1)",
      "transition_timestamp": "2026-10-18T11:23:00Z",
      "transition_notes": "Acknowledged alarm. Initial inspection underway."
    }
  ]
  ```

---

### 2.5 Guided Troubleshooting Playbooks

#### `GET /api/playbooks/{id}`
* **Purpose:** Retrieve step-by-step diagnostic checklist for an incident type.
* **Path Parameters:**
  - `id` (string, required): Playbook identifier (e.g. `PB-SFP-CRC`).
* **Status Codes:** `200 OK`, `404 Not Found`.
* **Response Schema (`PlaybookResponse`):**
  ```json
  {
    "id": "PB-SFP-CRC",
    "title": "Optical Transceiver & Physical Layer CRC Triage",
    "target_incident_type": "CRC_STORM",
    "safety_level": "NON_DESTRUCTIVE_READ_ONLY",
    "steps": [
      {
        "step_number": 1,
        "title": "Check Optical Rx Power",
        "diagnostic_command": "show interface HundredGigE0/0/1 transceiver detail",
        "expected_baseline": "Rx Power between -3.0 dBm and -14.0 dBm",
        "requires_operator_verification": true
      },
      {
        "step_number": 2,
        "title": "Verify Redundant Path Status",
        "diagnostic_command": "show interface HundredGigE0/0/2 status",
        "expected_baseline": "Port HundredGigE0/0/2 connected, 0 drops",
        "requires_operator_verification": true
      },
      {
        "step_number": 3,
        "title": "Advisory Remediation Recommendation",
        "diagnostic_command": "N/A (Advisory Guideline)",
        "expected_baseline": "Shift transit to secondary link; schedule SFP replacement.",
        "requires_operator_verification": true
      }
    ]
  }
  ```

#### `POST /api/playbooks/{id}/execute-step`
* **Purpose:** Execute a simulated read-only diagnostic command and return synthetic terminal output.
* **Request Body (`StepExecutionRequest`):**
  ```json
  {
    "incident_id": "INC-2026-001",
    "step_number": 1,
    "operator_name": "Alex (NOC Tier-1)"
  }
  ```
* **Status Codes:** `200 OK`, `400 Bad Request`, `404 Not Found`.
* **Response Schema (`StepExecutionResponse`):**
  ```json
  {
    "step_number": 1,
    "command_executed": "show interface HundredGigE0/0/1 transceiver detail",
    "simulated_output": "HundredGigE0/0/1 Transceiver Diagnostic:\n  Tx Power: -1.82 dBm [NORMAL]\n  Rx Power: -18.42 dBm [CRITICAL - LOW OPTICAL POWER (Threshold: -14.00 dBm)]\n  Laser Temp: 38.2 C [NORMAL]\n  Voltage: 3.28 V [NORMAL]\n  Conclusion: Severe optical signal attenuation detected on Rx fiber pair.",
    "finding_summary": "Optical Rx power is -18.42 dBm (breached -14.0 dBm threshold).",
    "is_verification_passed": true,
    "recorded_at": "2026-10-18T11:23:45Z"
  }
  ```

---

### 2.6 Demo Scenarios & Simulation Controls

#### `GET /api/scenarios`
* **Purpose:** List available network failure scenarios and the currently active simulation state.
* **Status Codes:** `200 OK`.
* **Response Schema (`ScenarioListResponse`):**
  ```json
  {
    "active_scenario": "SCENARIO_CRC_STORM",
    "scenarios": [
      {
        "id": "NORMAL_BASELINE",
        "name": "Normal Baseline",
        "description": "All devices healthy, bandwidth < 40%, 0 CRC errors, 0% drops."
      },
      {
        "id": "SCENARIO_CRC_STORM",
        "name": "SFP Optical Degradation & CRC Storm",
        "description": "Induces CRC errors (>150/s) and frame discards on AGG-SW01 uplink."
      },
      {
        "id": "SCENARIO_WAN_SATURATION",
        "name": "WAN Link Saturation & Buffer Drops",
        "description": "Induces 98% bandwidth utilization and 12% drop rate on WAN-GW01."
      },
      {
        "id": "SCENARIO_BGP_FLAP",
        "name": "BGP Route Peering Flapping",
        "description": "Induces intermittent peering resets on Core router COR-RTR01."
      }
    ]
  }
  ```

#### `POST /api/scenarios/inject`
* **Purpose:** Safely inject a demo scenario into the simulated telemetry stream.
* **Request Body (`ScenarioInjectRequest`):**
  ```json
  {
    "scenario_id": "SCENARIO_CRC_STORM"
  }
  ```
* **Status Codes:** `200 OK`, `400 Bad Request`.
* **Response Schema (`ScenarioStatusResponse`):**
  ```json
  {
    "success": true,
    "active_scenario": "SCENARIO_CRC_STORM",
    "message": "Scenario injected. Telemetry stream will exhibit CRC storm on AGG-SW01 within 5 seconds.",
    "injected_at": "2026-10-18T11:24:00Z"
  }
  ```

#### `POST /api/scenarios/reset`
* **Purpose:** Revert all telemetry generators and active incidents back to a healthy normal baseline.
* **Status Codes:** `200 OK`.
* **Response Schema (`ScenarioStatusResponse`):**
  ```json
  {
    "success": true,
    "active_scenario": "NORMAL_BASELINE",
    "message": "Simulation reset to normal healthy baseline. All active incidents marked resolved.",
    "injected_at": "2026-10-18T11:24:00Z"
  }
  ```

---

## 3. Database Failure Behavior & Logging Requirements

### 3.1 Dual-Engine Fallback Behavior
1. The backend tests MySQL connectivity on every request transaction.
2. If MySQL emits an operational error (e.g. connection refused, authentication lost), the backend:
   - Emits a structured log event: `{"level": "WARN", "event": "MYSQL_DISCONNECTED", "fallback": "SQLITE"}`.
   - Activates local SQLite connection pool (`backend/netops_local.db`).
   - Fulfills the API request without returning a 500 Internal Server Error to the client.
3. The `/api/health` endpoint reflects `"is_fallback": true`.

### 3.2 Audit Logging Requirements
* Every status change (`PATCH /api/incidents/{id}/status`) and playbook execution (`POST /api/playbooks/{id}/execute-step`) must emit a structured audit log entry to standard out:
  ```json
  {
    "timestamp": "2026-10-18T11:24:00Z",
    "level": "AUDIT",
    "operator": "Alex (NOC Tier-1)",
    "action": "INCIDENT_STATUS_CHANGE",
    "incident_id": "INC-2026-001",
    "from_status": "INVESTIGATING",
    "to_status": "RESOLVED",
    "notes": "Verified optical power attenuation. Rerouted transit."
  }
  ```

---

## 4. Security, CORS, Environment Variables & Rate Limiting

### 4.1 CORS Policy
* The FastAPI backend configures `CORSMiddleware` restricted to:
  ```python
  allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"]
  allow_methods=["GET", "POST", "PATCH", "OPTIONS"]
  allow_headers=["*"]
  ```

### 4.2 Environment Variables (`.env`)
The API strictly pulls runtime configuration from environment variables via Pydantic `BaseSettings`:

| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `API_HOST` | `127.0.0.1` | Host interface to bind server |
| `API_PORT` | `8000` | Port for FastAPI server |
| `DEBUG` | `True` | Enables debug logging & OpenAPI `/docs` |
| `DB_HOST` | `127.0.0.1` | MySQL server host |
| `DB_PORT` | `3306` | MySQL server port |
| `DB_NAME` | `netops_db` | Primary database name |
| `DB_USER` | `root` | MySQL user account |
| `DB_PASSWORD` | `""` | MySQL password (empty by default) |
| `USE_SQLITE_FALLBACK`| `True` | Enables automatic SQLite fallback |
| `SQLITE_DB_PATH` | `./backend/netops_local.db` | Local SQLite file path |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed CORS origins |

### 4.3 Rate Limiting Strategy
* Since this application is an unauthenticated local workstation prototype, heavy token-bucket rate limiters are unnecessary.
* **Lightweight In-Memory Burst Protection:**
  - Standard telemetry polling endpoints: Uncapped (expected 1 request every 5s per client).
  - Scenario injection endpoints (`/api/scenarios/inject`): Capped at 10 requests per minute to prevent presentation click-spamming.
