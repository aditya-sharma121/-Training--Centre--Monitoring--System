# TCMS – Pitch Deck & 3-Minute Live Demo Script (SIH26245)

## 🎯 5-Slide Pitch Outline

### Slide 1: Problem Statement & Context
- **Title:** The Skill India Governance Gap (SIH26245)
- **Challenge:** Over ₹3,000 Cr allocated annually to vocational skill schemes (PMKVY, DDU-GKY), but 30-40% of centres suffer from ghost attendance, substandard equipment, expired safety certifications, and unannounced trainer absence.
- **Root Cause:** Paper rosters, delayed manual inspections, and disconnected state-level tracking.

### Slide 2: The Solution – TCMS Ecosystem
- **What is TCMS?** An automated, end-to-end monitoring platform connecting National Authorities, District Officers, Centre Managers, Trainers, and Trainees.
- **Core Pillars:**
  1. **Geo-Fenced Biometric Attendance:** Haversine verification within 250m perimeter + 24-hr edit lock.
  2. **12-Category Weighted Inspection Engine:** Dual-layer audit (Centre Self-Assessment vs Officer Verification) scoring from 0 to 100%.
  3. **Automated Escalation Rule Engine:** Unresolved violations auto-escalate to District Officer after 48 hours.
  4. **Phase 2 AI Suite (Feature-Flagged):** Vision AI photo asset verification and proxy attendance anomaly detection.

### Slide 3: Unique Selling Proposition (USP)
- **Zero-Friction Adoption:** Lightweight mobile PWA with offline queue for rural areas with spotty internet.
- **Tamper-Proof Audit Trail:** Every attendance alteration or checklist change is recorded in immutable audit logs.
- **Dual-Perspective Validation:** Cross-checks self-reported infrastructure against unannounced officer inspections.
- **National GIS Heatmap:** Real-time visibility into high-risk districts across all states.

### Slide 4: Real-World Impact & Measurable Outcomes
- **Eliminate Ghost Candidates:** Saves up to 25% of training subsidy leakages by preventing fraudulent biometric batch marking.
- **Standardized Labs:** Guarantees candidates receive hands-on training with verified 1:1 computer ratios and functional machinery.
- **Immediate Response:** Reduces violation turnaround time from 45 days (paper notices) to under 48 hours.

### Slide 5: Scalability & Technical Architecture
- **Tech Stack:** Next.js 14 App Router, TypeScript, Prisma ORM, NextAuth RBAC, Leaflet GIS, Recharts.
- **Database Flexibility:** Instant zero-downtime transition from SQLite (local demo) to Neon Serverless PostgreSQL or Supabase.
- **Multi-lingual:** Native English + Hindi localization for nationwide grassroot adoption.

---

## ⏱️ 3-Minute Live Hackathon Demo Script

> **Setting:** Open `http://localhost:3000` with the demo login accounts ready.

### [0:00 - 0:40] The Problem & National Command Center (Super Admin)
- *"Good morning respected evaluators. Under SIH problem statement SIH26245, monitoring training center compliance has historically suffered from manual paperwork, fake batch logs, and safety lapses."*
- Click **"Sign In"** -> Click **"Super Admin (Govt Authority)"** (1-click auto-fill) -> Click **"Sign In"**.
- *"Here is the National Monitoring Command Center. You immediately see 25 live training centres across 5 states mapped with real GPS pins. Green pins represent compliant centres, amber is partial, and red pins highlight critical non-compliance."*
- *"Notice the national KPIs: 84.2% average attendance, 76% infrastructure compliance, and 4 urgent open alerts requiring district action."*

### [0:41 - 1:25] District Officer Oversight & 12-Category Weighted Inspection
- Switch to **District Officer (Jaipur)** via the role switcher or login.
- *"Now let's switch to Smt. Sunita Verma, IAS, District Officer for Jaipur. She monitors all jurisdictional centers and sees an escalated alert that has remained unresolved for over 48 hours."*
- Click **"Start Official Centre Inspection"**.
- *"When an officer visits a centre, they fill this standardized 12-category weighted checklist—covering everything from Fire Safety and Computer 1:1 ratios to Divyangjan wheelchair ramps."*
- Change Fire Safety or Computer Lab to **"Non-Compliant"**; point to the **Live Score Pill** dropping from 90% to 58% (CRITICAL) in real-time!
- *"The system automatically recalculates the centre's official grade and triggers an automated remediation notice."*

### [1:26 - 2:10] Master Trainer: Geo-Fence Guard & QR Code Attendance
- Switch to **Master Trainer (Er. Rajesh Kumar)**.
- Point to the **Geo-Fence Guard Banner**: *"The trainer cannot mark attendance from home. Our Haversine algorithm validates their GPS coordinates within 250m of the registered center."*
- Click **"Check-In with GPS & Selfie"** -> instant biometric check-in recorded.
- Click **"Display Batch QR Code"** -> show the student QR scan token.
- Mark attendance for students; click **"Save Daily Attendance"**. Show the **24-hour edit lock** notice that prevents retroactive tampering.

### [2:11 - 2:45] AI Intelligence Suite (Pluggable Phase 2)
- Click **"AI Compliance Suite"** from sidebar.
- Run the **Vision AI Infrastructure Inspector**: *"Our vision model analyzes uploaded evidence photos, automatically recognizing fire extinguisher pressure gauges in the green zone and 25 desktop monitors."*
- Point to the **Attendance Anomaly Detection**: *"The machine learning model flags suspicious proxy patterns—such as 28 students marked within 1.4 seconds or 100% attendance streaks without a single leave."*
- Show the **Natural Language Query**: *"Show centres in Rajasthan with attendance below 70%"* -> instant dynamic filter conversion!

### [2:46 - 3:00] Reports Export & Conclusion
- Navigate to **Reports & Defaulter Audits**.
- Click **"Download PDF"** and **"Download Excel"** to demonstrate instant, ready-to-print official government rosters.
- *"TCMS is production-ready, mobile-friendly via PWA, bilingual in English and Hindi, and ready to be deployed nationwide across NSDC and state skill missions. Thank you!"*
