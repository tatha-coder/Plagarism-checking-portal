# Plagiarism Checking Portal

> **Institutional Academic Similarity & Plagiarism Detection Platform**  
> **Student:** Tathagata Chakraborty  
> **Roll Number:** UG/SOET/30/24/144  
> **Section:** G  
> **Program:** B.Tech Computer Science & Engineering (SOET)

---

## 🌟 Overview

The **Plagiarism Checking Portal** is an academic-grade SaaS application designed to analyze academic papers, research articles, laboratory reports, and student assignments for verbatim and structural similarity against an institutional corpus.

### ✨ Core Features

1. **Authentication & Authorization:**
   - Role-based Access Control (Student & Administrator).
   - Secure HTTP-Only cookie session management and JWT verification.
   - Demo 1-Click Fast Login for Student (*Tathagata Chakraborty*) and Admin.

2. **Document Upload & Multi-Format Text Extraction:**
   - Native parsing for **PDF**, Microsoft Word (**DOCX**), and plain text (**TXT**).
   - Drag-and-drop file upload with real-time size validation (up to 10MB).
   - Direct text editor with live word and character counting + test sample pre-fill buttons.

3. **Deterministic Plagiarism Engine (Modular Service):**
   - **Sentence Segmentation & Character Offset Tracking:** Pinpoints exact match locations.
   - **N-Gram Shingling (N=3):** Computes Jaccard similarity across word shingles.
   - **TF-IDF Vector Space & Cosine Similarity:** Computes semantic text overlap.
   - **Composite Multi-Algorithm Scoring:** Weighted deterministic score without random numbers or AI hallucinations.
   - **Risk Classification:**
     - `0% – 15%`: Low Risk (Acceptable scholarly originality)
     - `16% – 30%`: Moderate Risk (Minor overlap, check citations)
     - `31% – 50%`: High Risk (Substantial passage borrowing)
     - `> 50%`: Critical Risk (Severe verbatim plagiarism)

4. **Interactive Plagiarism Report:**
   - Color-coded circular score gauge and breakdown statistics.
   - **Interactive Document Reader:** Click on any highlighted text to open the **Passage Inspector** side-by-side with the matched reference source.
   - Ranked matching sources list with percentage contribution.
   - **Official Plagiarism Clearance Certificate:** Ready to export or print with university header, verification timestamp, student roll number, and digital certificate ID.

5. **Submissions Archive & History:**
   - Search by title, filter by risk level, and sort by date or similarity score.
   - Safe document deletion with confirmation dialog.

6. **Admin Control Center:**
   - Institutional analytics (Total Submissions, System Mean Similarity, High-Risk Flags).
   - Student leaderboard and role management.
   - **Reference Corpus Manager:** Add and manage benchmark papers in the active comparison database.
   - **Engine Calibration:** Adjust N-gram window size, risk thresholds, and algorithm weights.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or newer)
- npm

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

| Role | Email | Password | Details |
|------|-------|----------|---------|
| **Student** | `student@portal.edu` | `password123` | Tathagata Chakraborty (Roll: `UG/SOET/30/24/144`, Sec: `G`, `B.Tech CSE`) |
| **Admin** | `admin@portal.edu` | `admin123` | System Administrator (Faculty of Engineering) |

*(You can also use the 1-click demo login buttons directly on the Login screen and navigation bar!)*

---

## 📐 Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Login, Register, Logout, Me, Profile
│   │   ├── documents/     # Upload, Extraction, Deletion
│   │   ├── reports/       # Report Generation & Retrieval
│   │   ├── dashboard/     # Student Analytics
│   │   └── admin/         # Platform Stats, Corpus & Engine Tuning
│   ├── dashboard/         # Student Dashboard
│   ├── upload/            # Document Upload & Real-time Progress
│   ├── reports/[id]/      # Interactive Highlighted Report & Certificate
│   ├── history/           # Submissions Search & Archive
│   ├── profile/           # Academic Profile
│   ├── admin/             # Admin Control Center
│   ├── login/ & register/ # Authentication Screens
│   └── page.tsx           # Academic Landing Page
├── components/
│   └── layout/            # Academic Navbar & Footer
├── lib/
│   ├── db.ts              # Relational Database Manager & Seeder
│   ├── auth.ts            # JWT & Session Cookie Helpers
│   ├── AuthContext.tsx    # Client-side Auth Provider & Switcher
│   └── plagiarism/        # Modular Plagiarism Engine
│       ├── preprocessor.ts# Tokenizer, Stopwords, Sentence Segmentation
│       ├── algorithms.ts  # TF-IDF Cosine, N-Gram Jaccard, Levenshtein
│       ├── extractor.ts   # PDF, DOCX, TXT Binary Buffer Parsers
│       ├── highlighter.ts # Non-overlapping Offset Highlight Mapper
│       └── engine.ts      # Multi-Source Orchestrator & Composite Scoring
└── types/                 # TypeScript Data Models
```

---

## 📜 Compliance & Attribution

Built for the **School of Engineering & Technology (SOET)**.  
Candidate: **Tathagata Chakraborty** (`UG/SOET/30/24/144`), Section **G**, **B.Tech Computer Science & Engineering**.
