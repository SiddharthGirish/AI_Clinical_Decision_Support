# AI Clinical CDSS - React Frontend Service

[![React Version](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

This directory houses the React user interface for the AI Clinical Decision Support System. It provides a premium, responsive dashboard for diagnostic analysis, visual reports, AI chatbot interactions, and SQLite database history audits.

---

## 🎨 Design & UI features

- **Interactive Symptom Entry**: Textarea fields allowing free-form input alongside quick-select clinical condition presets (COVID-19, Migraine, Flu, Pneumonia) for demonstration.
- **Dynamic Report Visualizations**: Features a custom circular SVG confidence gauge, styled badge indicators for risk severity, and formatted clinical checklist recommendations.
- **Clinical Chatbot Console**: An interactive chat client with quick-prompt tags, message bubbles, and custom regex-based markdown parser for formatting wellness guidance.
- **Local History Inspector**: A tabular/list viewer showing saved SQLite clinical runs. Supports real-time entry removal, batch DB clears, and one-click reloading of past diagnoses.
- **Universal Dark/Light Theme**: A global tailwind-powered theme controller synced directly to local browser storage (`localStorage`) for layout persistency.
- **Toast Notifications**: An overlay notification container triggering animated, timed alerts (success, error, information).

---

## 📂 Frontend Architecture & Modules

```
frontend/
├── src/
│   ├── assets/             # Branding icons, images, and logos
│   │
│   ├── components/         # Layout & Shared UI modules
│   │   ├── Navbar.jsx      # Navigation links, dark-theme toggle, and title locks
│   │   ├── Footer.jsx      # Sticky medical disclaimer notice
│   │   └── Toast.jsx       # Alert popup module (success/error/info)
│   │
│   ├── pages/              # Tab view containers
│   │   ├── Home.jsx        # Landing landing, specs grid, and project info
│   │   ├── SymptomAnalysis.jsx # NLP text complaint parser form and presets
│   │   ├── Results.jsx     # Gauge charts, risk badges, and recommendations
│   │   ├── Chatbot.jsx     # Conversation window and quick-prompts
│   │   └── History.jsx     # SQLite history inspector and controls
│   │
│   ├── App.jsx             # Root layout controller, routing, and dark state
│   ├── index.css           # Global typography, custom scrollbars, and Tailwind directives
│   └── main.jsx            # DOM renderer entry
│
├── index.html              # HTML shell & SEO meta elements
├── package.json            # Script definitions and dependency versions
├── tailwind.config.js      # Tailwind theme specifications (colors, spacing)
├── vite.config.js          # Vite web dev server settings
└── README.md               # This documentation file
```

---

## ⚡ Frontend Local Setup

### 1. Prerequisites
Ensure you have **Node.js 18** (LTS) or higher installed.

### 2. Install Package Dependencies
Navigate to the `frontend/` folder in your terminal and install Node modules:
```bash
npm install
```

### 3. Connection Configuration
The React application communicates with the backend via **Axios**. By default, it sends requests to:
`http://localhost:8000`

Ensure the backend server is running and active on port `8000` so that API calls resolve correctly.

### 4. Run the Dev Server
Launch Vite's hot-reloading dev server on port `5173`:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🏗️ Production Build & Validation

To generate a compiled production-ready bundle, run:
```bash
npm run build
```
This builds static assets (HTML, CSS, JS) into the `dist/` directory, optimized and minified for deployment.
To preview the production build locally:
```bash
npm run preview
```
