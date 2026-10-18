# UX and Design System Specification (DESIGN.md)
# NetOps Intelligence: Visual & Interaction Design Source of Truth

**Document Version:** 1.0.0  
**Phase:** 2 — UX and Design System  
**Approved PRD Reference:** [`PRD.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/PRD.md)  
**Status:** Complete — Pending User Review & Approval  

---

## 1. Visual Direction & Aesthetic Philosophy

NetOps Intelligence is an **enterprise Network Operations Center (NOC) and incident triage console**. The design rejects generic, airy consumer SaaS templates in favor of a **high-density, low-glare, information-dense operational workstation**.

### 1.1 Core Design Pillars
1. **Console-Grade Density:** Maximize screen real estate efficiency. Operators need multi-device telemetry, active alarms, and interface statuses visible simultaneously without excessive scrolling or giant whitespace padding.
2. **Never Color Alone (Multi-Channel Encoding):** Every critical operational state (health, severity, lifecycle) must be conveyed through **at least three distinct sensory channels**:
   - Color tint (e.g., Red `#EF4444`)
   - Geometric icon glyph (e.g., Octagonal Alert Triangle or Shield)
   - Explicit text label (e.g., `CRITICAL`, `P1 - Critical`)
3. **Data Provenance Prominence:** Because this system is a credible demonstration prototype, synthetic data and hypotheses are never hidden. Visual provenance badges (`[SIMULATED DATA]`, `[UNVERIFIED HYPOTHESIS]`) are anchored at predictable visual coordinates.
4. **Dark NOC Palette (Low Visual Fatigue):** Designed for multi-hour operational shifts with deep midnight/slate backgrounds (`#0B0F19`, `#111827`), subtle borders (`#1F2937`), and high-contrast foreground text (`#F9FAFB`).

---

## 2. Color Tokens & Semantic System

All colors are defined as CSS variables and Tailwind design tokens. Hex codes are rigorously selected to guarantee WCAG 2.1 AA contrast ratios ($\ge 4.5:1$ against dark surfaces).

### 2.1 Base & Surface Palette

| Token Name | Hex Value | Usage / Description |
| :--- | :--- | :--- |
| `--bg-canvas` | `#080B11` | Root application background; deepest black-slate. |
| `--bg-surface-0` | `#0E1420` | Primary app shell, sidebar, and header background. |
| `--bg-surface-1` | `#141C2E` | Card, container, and table header background. |
| `--bg-surface-2` | `#1D283E` | Hovered rows, active tab backgrounds, drawer panels. |
| `--bg-surface-3` | `#273552` | Selected list items, active state fills, modal surfaces. |
| `--border-subtle` | `#1E293B` | Standard divider lines and card borders. |
| `--border-strong` | `#334155` | Focused inputs, emphasized table borders, modal edges. |
| `--text-primary` | `#F8FAFC` | Main headings, primary metric values, device hostnames. |
| `--text-secondary`| `#94A3B8` | Column headers, descriptions, timestamps, metadata. |
| `--text-muted` | `#64748B` | Helper captions, disabled states, inactive indicators. |

### 2.2 Semantic Status Palette (Health & Operations)

| Semantic Role | Background Tint | Border Color | Foreground Text | Geometric Glyph |
| :--- | :--- | :--- | :--- | :--- |
| **Healthy / Normal** | `#064E3B` (15% opacity) | `#059669` | `#34D399` | Filled Circle `●` / Checkmark `✓` |
| **Degraded / Warning**| `#78350F` (20% opacity) | `#D97706` | `#FBBF24` | Warning Triangle `▲` |
| **Critical / Outage** | `#7F1D1D` (25% opacity) | `#DC2626` | `#F87171` | Alert Octagon `⬡` / Cross `✕` |
| **Maintenance** | `#1E293B` (40% opacity) | `#64748B` | `#94A3B8` | Wrench / Pause `❚❚` |
| **Active / Info** | `#1E3A8A` (20% opacity) | `#2563EB` | `#60A5FA` | Info Circle `ℹ` |

### 2.3 Incident Severity Tokens (P1 to P4)

| Severity Token | Background | Border | Text Color | Icon Glyph | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--sev-p1` | `#450A0A` | `#EF4444` | `#FCA5A5` | `AlertCircle` (Solid) | **P1 - Critical:** Outage, core link drop, packet drop $> 10\%$ |
| `--sev-p2` | `#431407` | `#F97316` | `#FDBA74` | `AlertTriangle` (Solid) | **P2 - High:** Redundancy loss, sustained CRC storm |
| `--sev-p3` | `#422006` | `#EAB308` | `#FDE047` | `AlertTriangle` (Outline) | **P3 - Medium:** Single switch degradation, CPU $> 85\%$ |
| `--sev-p4` | `#172554` | `#3B82F6` | `#93C5FD` | `Info` (Outline) | **P4 - Low:** Transient jitter, informational warnings |

### 2.4 Data Lineage & Provenance Tokens

| Lineage Token | Pill Background | Border | Text Color | Mandatory Prefix |
| :--- | :--- | :--- | :--- | :--- |
| `--prov-simulated` | `#172554` | `#3B82F6` | `#93C5FD` | `SIMULATED DATA` |
| `--prov-observed` | `#064E3B` | `#10B981` | `#6EE7B7` | `OBSERVED MEASUREMENT` |
| `--prov-rule` | `#312E81` | `#6366F1` | `#A5B4FC` | `RULES-BASED FINDING` |
| `--prov-hypothesis`| `#4A044E` | `#D946EF` | `#F5D0FE` | `UNVERIFIED HYPOTHESIS` |
| `--prov-verified` | `#14532D` | `#22C55E` | `#86EFAC` | `VERIFIED DIAGNOSTIC` |

---

## 3. Typography, Spacing, Grid & Icons

### 3.1 Typography Scale
The typography system uses a modern geometric sans-serif for UI labels paired with a high-legibility monospace typeface for technical identifiers, IP addresses, interface names, and telemetry numbers.

* **UI Font Family:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
* **Data / Code Font Family:** `JetBrains Mono, Consolas, "Courier New", monospace`

| Style Token | Font Size | Line Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | 24px (1.5rem) | 32px | Bold (700) | -0.02em | Dashboard primary headline |
| `text-h1` | 20px (1.25rem) | 28px | SemiBold (600) | -0.01em | Modal headers, section titles |
| `text-h2` | 16px (1.0rem) | 24px | SemiBold (600) | 0.0em | Card headers, table section titles |
| `text-body` | 14px (0.875rem) | 20px | Regular (400) | 0.0em | Table data, descriptions, forms |
| `text-caption` | 12px (0.75rem) | 16px | Medium (500) | +0.01em | Metadata, timestamp, status tags |
| `text-mono-lg` | 18px (1.125rem) | 24px | Bold (700) | 0.0em | KPI metric numbers (e.g. `98.4%`) |
| `text-mono-md` | 13px (0.8125rem)| 18px | Regular (400) | 0.0em | Hostnames, IPs, interface ports |
| `text-badge` | 11px (0.6875rem)| 14px | Bold (700) | +0.05em | Uppercase status and lineage badges |

### 3.2 Spacing & Density Scale
NetOps Intelligence adheres to a strict 4px grid (`0.25rem` intervals):

* `space-1` (4px): Inner badge padding, icon-text gap.
* `space-2` (8px): Button padding (Y), tight form field gaps, table cell padding (Y).
* `space-3` (12px): Standard component padding, table cell padding (X).
* `space-4` (16px): Card padding, grid gap between sibling cards.
* `space-6` (24px): Major section separation, page margin padding.

### 3.3 Layout Grid & Responsive Breakpoints

| Breakpoint | Minimum Width | Target Layout Behavior |
| :--- | :--- | :--- |
| `sm` | 640px | Single column stacked view; horizontal scrolling for tables. |
| `md` | 768px | 2-column KPI cards; collapsible sidebar navigation. |
| `lg` | 1024px | 4-column KPI cards; side-by-side incident table + drawer. |
| `xl` | 1280px | Primary NOC desktop layout (12-column grid; 4-card KPI row). |
| `2xl` | 1536px | Widescreen NOC display; split-screen topology + triage queue. |

### 3.4 Iconography Standards
Icons are provided by `lucide-react` (stroke width `1.75px` default, `16px` or `18px` size). Every icon must have an `aria-label` or be paired with visible text.

* **Navigation:** `LayoutDashboard`, `Network`, `AlertTriangle`, `History`, `Settings`
* **Network Tiers:** `Server` (Core), `GitFork` (Aggregation), `Layers` (Access), `Shield` (Firewall), `Globe` (WAN)
* **Metrics:** `Activity` (Throughput), `Percent` (Utilization), `Clock` (Latency), `Radio` (Jitter), `AlertCircle` (Errors)
* **Operations:** `CheckCircle2` (Resolve), `UserCheck` (Acknowledge), `Search` (Investigate), `Play` (Playbook)

---

## 4. Chart & Telemetry Conventions

### 4.1 Time-Series Telemetry Charts
* **Dimensions:** Standard card height `240px` (dashboard overview) or `320px` (Evidence Inspector).
* **Color Assignment:**
  - Inbound Bandwidth: Emerald `#10B981` (Solid stroke `2px`, area fill 10% opacity)
  - Outbound Bandwidth: Blue `#3B82F6` (Solid stroke `2px`, area fill 10% opacity)
  - Packet Drops: Rose `#F43F5E` (Solid stroke `2px`, bar or line)
  - Latency / Jitter: Amber `#F59E0B` (Dashed stroke `1.5px`)
  - CRC Error Rate: Crimson `#EF4444` (Step-after line stroke `2px` with alert points)
* **Threshold Reference Lines:**
  - Warning Threshold: Amber dashed horizontal line (`strokeDasharray="4 4"`) with label (e.g. `Warn: >75%`).
  - Critical Threshold: Red dashed horizontal line (`strokeDasharray="4 4"`) with label (e.g. `Crit: >90%`).
* **Crosshair Tooltip:** High-contrast dark tooltip (`#0E1420` border `#334155`) displaying exact ISO UTC timestamp, exact numeric values with units, and active scenario annotation if triggered.
* **Rolling Time Horizon:** Fixed rolling window of 30 samples (default 2.5 minutes at 5s sampling), with a manual time-window toggle (`[5m]`, `[15m]`, `[1h]`).

---

## 5. Navigation & Application Shell Structure

The application shell provides a persistent, multi-tiered operational framework:

```
+--------------------------------------------------------------------------------------------------+
| NetOps Intelligence  [SIMULATED TELEMETRY]  |  NOC Status: DEGRADED (1 P1)  | 11:24:00 UTC | [Alex] |
+--------------------------------------------------------------------------------------------------+
| SCENARIO INJECTION: [ Normal Baseline ] [ SFP CRC Storm ] [ WAN Saturation ] [ BGP Flap ] [Reset] |
+--------------------------------------------------------------------------------------------------+
| [ Dashboard ]      [ Devices & Topology ]      [ Incident Triage (3) ]      [ Audit History ]    |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|  PAGE CONTENT AREA (Dashboard / Devices / Incidents / Evidence Inspector)                        |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
```

### 5.1 Top Navigation Bar (Header)
* **Left:** Brand Logo + Product Title (`NetOps Intelligence`) + High-visibility lineage badge (`[SIMULATED DATA]`).
* **Center:** Global System Health Pill (e.g., `● DEGRADED — 2 Active Incidents`).
* **Right:** Live UTC Clock (format: `HH:mm:ss UTC`), Host Status Indicator (`Local Host`), and Operator Persona Switcher Pill (`Alex (NOC Tier-1)` with click-to-toggle to `Jordan (IT Lead)`).

### 5.2 Scenario Injection Bar (Persistent Banner)
* Positioned directly beneath the header.
* Shows active demo scenario badge and quick-toggle scenario buttons:
  - `Normal Baseline` (Green)
  - `SFP CRC Storm` (Red)
  - `WAN Saturation` (Orange)
  - `BGP Peering Flap` (Purple)
  - `Reset to Healthy` (Grey button with reload icon)

### 5.3 Primary Tab Navigation
* Horizontal tabs with active bottom border (`#3B82F6`) and badge count for active incidents:
  - `Dashboard`
  - `Devices & Topology`
  - `Incident Triage (3)` *(Pill reflects active un-resolved incident count)*
  - `Audit History`

---

## 6. Reusable Component Specifications

### 6.1 KPI Metric Card
* **Purpose:** Summarize high-level network vitals at a glance.
* **Layout:**
  - Header: Metric Title (`text-caption`, text-secondary) + Context Icon + Provenance tag (`[SIM]`).
  - Body: Main Value (`text-mono-lg`, 24px bold) + Unit (e.g. `98.4 Mbps`, `0.02%`).
  - Footer: Trend indicator (e.g. `↑ 12% vs 5m baseline` with semantic arrow) + mini sparkline graph.
* **Border State:** If metric violates threshold, card border changes from `--border-subtle` to semantic status color (Amber or Red glow).

### 6.2 Device-Status Indicator
* **Format:** Multi-channel badge containing an icon + text:
  - `HEALTHY`: Green dot `●` + Green text `HEALTHY` + subtle green border.
  - `DEGRADED`: Amber triangle `▲` + Amber text `DEGRADED` + amber border.
  - `CRITICAL`: Red hexagon `⬡` + Red text `CRITICAL` + pulsing red border.
  - `MAINTENANCE`: Blue wrench `🔧` + Slate text `MAINTENANCE` + slate border.

### 6.3 Severity Badge
* Rendered in tables and headers:
  - `P1 - Critical`: Dark red background `#450A0A`, bright red border `#EF4444`, text `#FCA5A5`, solid alert icon.
  - `P2 - High`: Dark orange background `#431407`, orange border `#F97316`, text `#FDBA74`, triangle icon.
  - `P3 - Medium`: Dark yellow background `#422006`, yellow border `#EAB308`, text `#FDE047`, warning icon.
  - `P4 - Low`: Dark blue background `#172554`, blue border `#3B82F6`, text `#93C5FD`, info icon.

### 6.4 Topology Node & Edge Visualizer
* **Tier Grouping:** Visual hierarchy clearly dividing:
  - Tier 1: Core Routers (`COR-RTR01`, `COR-RTR02`)
  - Tier 2: Aggregation Switches (`AGG-SW01`, `AGG-SW02`)
  - Tier 3: Access Switches (`ACC-SW01`, `ACC-SW02`, `ACC-SW03`)
  - Perimeter: Firewalls & WAN Gateways (`FW-EDG01`, `WAN-GW01`)
* **Node Card:** Compact card showing hostname, management IP, operational status pill, and active error count.
* **Edge / Link:** Connecting lines with bandwidth utilization color code (Green $<70\%$, Amber $70\text{--}90\%$, Red $>90\%$ or CRC errors). Hovering a link displays interface names at both endpoints.

### 6.5 Incident Triage Table
* **Columns:**
  1. `Severity`: Badge (`P1`, `P2`, `P3`, `P4`)
  2. `Priority Score`: Visual meter (`0-100`) with color gradient bar (e.g. `92/100`)
  3. `Incident Summary`: Title + affected device hostname & port (`font-mono`)
  4. `Status`: Lifecycle pill (`NEW`, `ACKNOWLEDGED`, `INVESTIGATING`, `RESOLVED`)
  5. `Age / Detected`: Relative time (`2m ago`) with UTC hover tooltip
  6. `Assigned Operator`: Name (`Alex`) or `Unassigned`
  7. `Actions`: Button `Inspect & Triage`
* **Interaction:** Hovering row highlights surface (`--bg-surface-2`); clicking row opens the Evidence Inspector drawer.

### 6.6 Evidence Inspector (Detail Drawer / Modal)
* **Header:** Incident Title, Severity Badge, Priority Score Breakdown pill, Close (`✕`) button.
* **Section 1: Lineage & Rule Finding Card:**
  - Badge: `[RULES-BASED FINDING]`
  - Text explanation of the rule that fired (e.g., `Rule CR_002: CRC frame rate exceeded 50/sec for 30 consecutive seconds`).
* **Section 2: Observed Measurements Table:**
  - Key-value table comparing Current Observed vs Baseline Threshold (e.g., CRC errors: `184/s` vs `<5/s`; Packet Drops: `6.4%` vs `<0.1%`).
  - Explicit badge: `[OBSERVED MEASUREMENT]`.
* **Section 3: Correlated Telemetry Charts:**
  - Synchronized dual time-series charts displaying the anomaly window.
* **Section 4: Diagnostic Hypotheses Card:**
  - Clearly badged: `[UNVERIFIED HYPOTHESIS]`.
  - Explanatory text: `Physical SFP transceiver degradation or dirty optical fiber connector.`
  - Callout: `Operator verification required. Run Playbook diagnostic check before taking action.`
* **Section 5: Actions Bar:**
  - `Acknowledge Incident` button
  - `Start Troubleshooting Playbook` primary button
  - `Resolve Incident` button (enabled once playbook verification is completed)

### 6.7 Guided Troubleshooting Playbook Runner
* **Modal / Panel View:**
  - Stepper navigation: Step 1 (Physical Layer Check) $\rightarrow$ Step 2 (Redundant Path Verification) $\rightarrow$ Step 3 (Advisory Remediation) $\rightarrow$ Step 4 (Resolution Sign-Off).
  - Simulated Diagnostic Terminal: Monospace console window showing simulated CLI output (e.g. `show interface HundredGigE0/0/1 transceiver detail`).
  - Verification Checkbox: Mandatory operator confirmation (*"I have inspected the simulated optical readings and confirmed power is below -14 dBm"*).
  - Operator Notes Input: Text area for Alex to record findings.
  - Final Action: Complete Playbook & Resolve Incident.

### 6.8 Toast Notifications & Confirmation Dialogs
* **Toasts:** Fixed at bottom-right (`bottom-4 right-4`). Maximum 3 visible simultaneously. Auto-dismiss after 4 seconds with manual close button.
* **Confirmation Dialog:** Accessible modal with backdrop blur for high-consequence state changes (e.g., resolving an active P1 incident or triggering scenario reset). Requires explicit confirmation click.

### 6.9 Loading, Empty & Error State Patterns
* **Loading:** Shimmering skeleton placeholders matching the exact geometry of cards, table rows, and charts.
* **Empty:** Centered empty state graphic with title *"No Incidents Found"*, description *"All network devices are operating within normal baseline parameters"*, and a button to inject a demo scenario.
* **Error:** Non-blocking top inline alert banner with red tint, warning icon, error description, and a *"Retry Connection"* button.

---

## 7. Page-Level Layout Specifications

### 7.1 Dashboard Layout (`/`)
* **Row 1:** 4 KPI Cards (Total Managed Devices, Online Interfaces, Aggregated Drop Rate, Average Latency).
* **Row 2 (Split 70/30):**
  - Left (70%): Network Topology Health Map (Tiered visualizer with Core, Aggregation, Access, and WAN nodes).
  - Right (30%): Live Incident Feed (Top 5 active incidents with one-click inspect button).
* **Row 3:** Global Telemetry Sparklines (24-hour baseline vs live simulated streams for Core aggregate throughput).

### 7.2 Devices & Topology Layout (`/devices`)
* **Header Bar:** Search input (`Filter devices by hostname or IP...`), Role filter buttons (`All`, `Core`, `Agg`, `Access`, `Perimeter`), Health Status filter (`All`, `Healthy`, `Degraded`, `Critical`).
* **Main Area (Split or Grid):**
  - Device Grid: 3-column grid of device cards displaying hostname, model, rack unit, IP, status badge, and interface count.
  - Drawer / Detail Modal: Clicking a device reveals its complete physical interface table, admin/oper states, connected peers, and live interface bandwidth sparklines.

### 7.3 Incident Triage Layout (`/incidents`)
* **Top Filter Bar:** Search input + Severity filter pills (`All`, `P1`, `P2`, `P3`, `P4`) + Status filter pills (`All Active`, `New`, `Acknowledged`, `Investigating`, `Resolved`) + Sort dropdown (`Priority Score: High to Low`, `Time: Newest`).
* **Main Area (Split-View):**
  - Left Side (60%): Incident Queue Table.
  - Right Side (40%): Dedicated Evidence Inspector & Playbook panel (updates instantly when selecting an incident row).

### 7.4 Audit History Layout (`/history`)
* **Header:** Summary metrics: Total Resolved Incidents, Average MTTR (Mean Time to Resolution: e.g. `4m 12s`), Most Frequent Incident Category.
* **Table:** Historical timeline of all resolved incidents, complete with resolving operator name, resolution notes, and duration in each state.

---

## 8. Interaction States, Accessibility & Responsiveness

### 8.1 Focus & Keyboard Navigation
* **Focus Indicator:** High-visibility double ring on all interactive elements: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900`.
* **Keyboard Shortcuts:**
  - `?`: Toggle keyboard shortcut modal.
  - `/`: Focus search input.
  - `J` / `K`: Move selection down / up in incident table.
  - `Enter`: Open Evidence Inspector for currently selected incident.
  - `Esc`: Close open modal or drawer.
  - `R`: Refresh / trigger telemetry sampling cycle.

### 8.2 Accessibility (WCAG 2.1 AA)
* **Contrast Compliance:** All text and interactive icon elements meet or exceed the 4.5:1 contrast requirement against their respective dark backgrounds.
* **Screen Reader Optimization:** Form fields have programmatic `<label>` associations; charts include an accessible data table summary accessible via screen reader (`sr-only`).
* **Reduced Motion:** If `prefers-reduced-motion: reduce` is detected, all CSS transitions, chart entry animations, and pulsing indicator animations are disabled immediately.

### 8.3 Mobile & Tablet Responsiveness
* On screens $<1024\text{px}$, the split-view Incident Triage switches automatically to a full-screen drawer or stacked view.
* Data tables allow horizontal scrolling with sticky headers and pinned primary columns (Hostname / Incident ID).

---

## 9. Terminology & Formatting Standardization

To ensure absolute operational consistency across UI components, charts, and audit logs:

| Domain Concept | Approved UI Display Term | Forbidden / Deprecated Terms |
| :--- | :--- | :--- |
| **Data Provenance** | `SIMULATED DATA` | `Fake Data`, `Test Data`, `Dummy Data` |
| **Diagnostic Hypothesis**| `UNVERIFIED HYPOTHESIS` | `AI Conclusion`, `Root Cause Certainty` |
| **Observation** | `OBSERVED MEASUREMENT` | `Raw Fact`, `Telemetry Guess` |
| **Rule Output** | `RULES-BASED FINDING` | `AI Finding`, `Black-box Result` |
| **Severity 1** | `P1 - Critical` | `Sev-1`, `Emergency`, `Fatal` |
| **Severity 2** | `P2 - High` | `Sev-2`, `Major` |
| **Severity 3** | `P3 - Medium` | `Sev-3`, `Minor` |
| **Severity 4** | `P4 - Low` | `Sev-4`, `Warning`, `Notice` |
| **Lifecycle State 1** | `NEW` | `Open`, `Triggered` |
| **Lifecycle State 2** | `ACKNOWLEDGED` | `Seen`, `Claimed` |
| **Lifecycle State 3** | `INVESTIGATING` | `In Progress`, `Diagnosing` |
| **Lifecycle State 4** | `RESOLVED` | `Closed`, `Fixed`, `Done` |
| **Timestamp Display** | `2m ago` (relative) / `2026-10-18 11:24:00 UTC` | Undefined local time without timezone |
| **Bandwidth Unit** | `%` utilization and `Mbps` or `Gbps` | `bps`, `bytes/sec` |
| **Latency Unit** | `ms` | `s`, `microseconds` |
| **Error Rate Unit** | `err/s` | `errors`, `counts` |

---

## 10. Mismatch Review with PRD.md

Every requirement and component specified in this `DESIGN.md` document was cross-referenced with [`PRD.md`](file:///C:/Users/lenovo/.gemini/antigravity/scratch/netops-intelligence/PRD.md):

| PRD Section | DESIGN.md Mapping | Alignment Status | Notes / Confirmations |
| :--- | :--- | :---: | :--- |
| **FR-1 Overview Dashboard** | Section 5 & 7.1 (Dashboard Layout) | **ALIGNED** | Matches KPI cards, topology summary, recent incident stream. |
| **FR-2 Device Inventory** | Section 7.2 (Devices & Topology Layout) | **ALIGNED** | Matches device registry, role filters, interface table. |
| **FR-3 Metric History** | Section 4 (Chart & Telemetry Conventions) | **ALIGNED** | Matches 5-second sampling, bandwidth/drop/latency/CRC error charts. |
| **FR-4 Incident Triage** | Section 6.5 & 7.3 (Incident Triage Layout)| **ALIGNED** | Matches P1–P4 severity, priority score meter, lifecycle states. |
| **FR-5 Filtering & Search** | Section 6.5 & 7.3 (Top Filter Bar) | **ALIGNED** | Matches multi-filter by severity, status, and search string. |
| **FR-6 Evidence Inspector** | Section 6.6 (Detail Drawer / Modal) | **ALIGNED** | Matches correlated charts, observed values, rule explanation. |
| **FR-7 Guided Playbooks** | Section 6.7 (Playbook Runner) | **ALIGNED** | Matches step-by-step diagnostic verification, advisory only. |
| **FR-8 Lifecycle & History**| Section 7.4 (Audit History Layout) | **ALIGNED** | Matches state transitions and MTTR audit trail. |
| **FR-9 Demo Controls** | Section 5.2 (Scenario Injection Bar) | **ALIGNED** | Matches persistent scenario switcher for live demonstrations. |
| **Safety Boundaries** | Section 1.1 & 6.7 | **ALIGNED** | Strictly advisory; zero automated destructive device changes. |
| **Roles & Auth Scope** | Section 5.1 (Operator Switcher Pill) | **ALIGNED** | Auth is out of scope; persona toggle (`Alex`/`Jordan`) used. |

> [!NOTE]
> **Zero Mismatch Found:**  
> There are no discrepancies or feature creep between `PRD.md` and `DESIGN.md`. All visual components and page layouts strictly substantiate the approved product requirements.
