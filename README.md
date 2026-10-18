# NetOps Intelligence

> **Enterprise Network Operations Monitoring, Incident Triage & Evidence-Based Troubleshooting**  
> *Domain: Future of Work & Enterprise Productivity*

NetOps Intelligence is an enterprise-grade web application prototype designed to assist Network Operations Center (NOC) engineers in monitoring multi-tier network topologies, detecting anomalies, inspecting objective evidence, and executing safe, operator-in-the-loop troubleshooting workflows.

---

## Key Capabilities

- **Multi-Tier Topology & Device Health:** Live status across Core (`COR`), Aggregation (`AGG`), Access (`ACC`), Firewall (`FW`), and Edge WAN devices.
- **Physics-Consistent Simulated Telemetry:** Realistic metrics for bandwidth utilization, frame drop rates, latency, jitter, CRC errors, and CPU/memory load.
- **Explainable Incident Prioritization:** Deterministic severity levels (P1–P4) with transparent blast-radius scoring.
- **Evidence Inspector:** Correlated time-series telemetry charts, observed measurements table, and rule triggers.
- **Data Lineage Transparency:** Clear badging distinguishing `SIMULATED DATA`, `OBSERVED MEASUREMENTS`, `RULES_BASED FINDINGS`, and `UNVERIFIED HYPOTHESES`.
- **Human-in-the-Loop Playbooks:** Step-by-step diagnostic verification checklists without dangerous automated destructive changes.
- **Interactive Scenario Controller:** Live toggles to inject real-world network failure scenarios (CRC storm, WAN congestion, BGP flap).

---

## Architecture & Technology Stack

- **Architecture:** Modular Monolith
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend:** Python 3.14, FastAPI, Pydantic v2, SQLAlchemy 2.0
- **Database:** MySQL 8.0 with automatic local SQLite fallback for seamless zero-setup testing
- **Operating Environment:** Windows 10/11 PowerShell

---

## Local Development (Windows PowerShell)

### Prerequisites
- Node.js (v20+) & npm
- Python (v3.10+)
- MySQL 8.0 (Optional; local SQLite fallback is enabled by default)

### 1. Environment Setup
```powershell
# In project root:
Copy-Item .env.example .env
```

### 2. Frontend Setup & Run
```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Backend Setup & Run (Phase 2+)
```powershell
# Create & activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r backend\requirements.txt

# Run FastAPI server
uvicorn backend.app.main:app --reload --port 8000
```
Interactive API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Documentation Links

- [Product Requirements Document (PRD)](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/docs/PRD.md)
- [System Architecture Specification](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/docs/ARCHITECTURE.md)
- [Phased Implementation Plan & Acceptance Criteria](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/docs/PHASED_PLAN.md)

---

## Verification & Status

Refer to the current phase status in [docs/PHASED_PLAN.md](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/docs/PHASED_PLAN.md).
