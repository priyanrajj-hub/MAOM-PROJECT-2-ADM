# 🏛️ Mahābhārata: Adaptive Digital Mastery (ADM) Platform

[![CI Pipeline](https://github.com/priyanrajj-hub/MAOM-PROJECT-2-ADM/actions/workflows/ci.yml/badge.svg)](https://github.com/priyanrajj-hub/MAOM-PROJECT-2-ADM/actions/workflows/ci.yml)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel&logoColor=white)](https://maom-project-2-adm.vercel.app)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

An interactive, research-grade e-learning platform and digital humanities pipeline exploring the strategic, ethical, and leadership dimensions of the **Mahābhārata** through modern pedagogical frameworks.

---

## 🌟 Key Highlights

- **📖 Complete 15-Chapter Scholarship**: Authentic curriculum titles and deep-dive synopses derived directly from core manuscripts (e.g., *Vyādha Gītā*, *Pratijñā*, *Karṇa*, *Rājadharma*, *Extraordinary Peace Mission*, *Sanatsujātīya*, *Svargārohaṇa*).
- **🔍 Point-by-Point In-Depth Explanations**: Structured card breakdowns for each chapter featuring thematic section titles, detailed bullet analyses, Sanskrit ethical dilemmas, and strategic leadership takeaways.
- **🤖 24/7 Resilient AI Tutor**: Integrated Gemini-powered pedagogical assistant with deterministic, knowledge-grounded fallback mechanisms—ensuring uninterrupted uptime even under 429 quota exhaustion.
- **🗺️ Interactive Flowcharts & Mindmaps**: Dynamic Mermaid.js conceptual graphs illustrating ethical conflicts, systemic chain reactions, and dharmic decision matrices.
- **🎯 Adaptive Assessment & Spaced Repetition**:
  - Randomized multiple-choice quizzes with distractor explanations and difficulty ratings.
  - Flashcard-based active recall drilling weak concepts (*Review Mode*).
  - Learning analytics tracking multidimensional proficiency across Dharma, Strategy, Karma, and Statecraft.

---

## 🏗️ Project Architecture

```
MAOM-PROJECT-2-ADM/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI (Type check, lint, build, data audit)
├── data/
│   ├── chapters/              # Chapter master data schemas (15 chapters)
│   ├── concepts/              # Core philosophical & Vedic concept definitions
│   ├── lessons/               # Full enriched lessons with point-by-point breakdowns
│   └── questions/             # Comprehensive question pools with explanations
├── frontend/                  # React 18 + TypeScript + Vite Web Application
│   ├── api/
│   │   └── chat.js            # Serverless AI tutor endpoint with resilient fallback
│   ├── src/
│   │   ├── components/        # Chatbot, Mindmap, Navigation, Header, Layout
│   │   ├── data/              # Synced lesson, chapter, and question JSONs
│   │   ├── lib/               # QuizEngine (Fisher-Yates) and spaced repetition helpers
│   │   └── pages/             # Dashboard, Lesson, Quiz, Review, Analytics
│   ├── package.json           # Frontend dependencies & npm scripts
│   ├── vercel.json            # Production routing, security headers & rewrites
│   └── vite.config.ts         # Vite configuration & dev server chat middleware
├── manuscripts/               # Original chapter Word documents (.docx) & teaching decks (.pptx)
└── scripts/                   # Data pipeline and content enrichment automation
    ├── audit_data.py          # Schema and data integrity validator for CI
    ├── generate_content.py    # Pipeline to parse manuscripts and extract curriculum
    ├── sync_to_frontend.py    # Synchronizes datasets between pipeline and frontend
    └── tools/                 # Auxiliary transcription and PDF parsing utilities
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: 3.10+ (for data pipeline scripts)

### 1. Clone & Install

```bash
git clone https://github.com/priyanrajj-hub/MAOM-PROJECT-2-ADM.git
cd MAOM-PROJECT-2-ADM/frontend
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build & Quality Check

```bash
# Type check and build production bundle
npm run build

# Run TypeScript linting
npm run lint
```

---

## 🤖 AI Tutor & Resilience Engine

The AI Tutor is engineered for high availability and scholarly accuracy:

1. **Primary Provider**: Google Gemini API (`gemini-flash-latest`) via serverless function or Vite dev middleware.
2. **Quota Resilience (429 Fallback)**: If rate limits or API key constraints are encountered, the engine switches to a deterministic knowledge-grounded response engine covering the 15 chapters, characters, and decision frameworks.
3. **Environment Setup**: Set `GEMINI_API_KEY` in your environment or Vercel Settings to activate live model generation:

   ```bash
   GEMINI_API_KEY="your_google_ai_key"
   ```

---

## 📜 Curriculum Overview

| Ch # | Chapter Title | Core Philosophical Focus |
| :---: | :--- | :--- |
| **01** | *A Preamble to the Grand Itihāsa* | Historical context, cosmic scale, authorship of Vyāsa |
| **02** | *Mahābhārata: A Brief Summary* | Structural narrative arc from Genesis to Great War |
| **03** | *Mahābhārata: What's and Whatnots* | Distinguishing cosmic Dharma from rigid dogmatism |
| **04** | *Dharmic Insights of a Butcher (Vyādha Gītā)* | Svadharma, humility, and filial piety over ascetic pride |
| **05** | *The Unbroken Legacy* | Cultural continuity and timeless transmission of wisdom |
| **06** | *A Timeless Itihāsa for Timely Needs* | Relevance of the epic in modern ethical leadership |
| **07** | *Pratijñā: The Ethics of Vows* | Teleological ethics, Bhīṣma's oath, and systemic fallout |
| **08** | *Karṇa: The Maestro Who Went Wide of the Mark* | Gratitude vs. righteousness, toxic loyalty, and hubris |
| **09** | *Kingship and Polity Acumen (Rājadharma)* | Governance, statecraft, justice, and the welfare state |
| **10** | *Mahābhārata in Adages* | Distilled aphorisms and practical worldly maxims |
| **11** | *Popular Regional Tales* | Folk traditions and cultural retellings across India |
| **12** | *Extraordinary Peace Mission* | Diplomacy, strategic exhaustion of peaceful recourse |
| **13** | *Yājñasenī: A Woman Born from Fire* | Draupadī's agency, justice, dignity, and resistance |
| **14** | *Death and Deathlessness (Sanatsujātīya)* | Overcoming spiritual heedlessness (*Pramāda*) and ego |
| **15** | *The Goal of Life (Mokṣa & Svargārohaṇa)* | Transcending the four Puruṣārthas, final liberation |

---

## 🧪 Continuous Integration & Verification

The repository runs automated GitHub Actions on every push to `main`:

- **TypeScript Typecheck**: Validates strict typing across all components.
- **Lint Check**: Enforces static code quality.
- **Production Build**: Ensures zero bundling errors.
- **Data Audit (`scripts/audit_data.py`)**: Asserts schema validity and question completeness across all 15 chapters.

---

## 📄 License

This project is licensed under the MIT License — see the repository for details.
