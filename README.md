# Portfolio — Celia Griffa

A personal portfolio website built with **React** and **Vite**, automatically deployed via **GitHub Actions**.

🌐 **Live:** [celiagriffa.github.io/portfolio](https://celiagriffa.github.io/portfolio)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Build Tool | Vite |
| Styling | CSS |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |

---

## Project Structure

```
portfolio/
├── .github/
│   └── workflows/        # CI/CD pipeline definitions
├── webapp/               # React + Vite application
│   ├── public/           # Static assets (favicon, verification files, etc.)
│   ├── src/              # Components, pages, styles
│   ├── index.html
│   └── vite.config.js
├── .gitignore
└── package-lock.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
git clone https://github.com/celiagriffa/portfolio.git
cd portfolio/webapp
npm install
```

### Development

```bash
npm run dev
```

Starts the local dev server at `http://localhost:5173` with HMR enabled.

### Production Build

```bash
npm run build
```

Outputs the optimized bundle to the `dist/` directory.

### Preview Build Locally

```bash
npm run preview
```

---

## Deployment

Deployment is fully automated via **GitHub Actions**.  
Every push to the `main` branch triggers the pipeline:

1. Install dependencies
2. Run `npm run build`
3. Publish the `dist/` output to GitHub Pages

No manual steps required.

---

## Contact

- **GitHub:** [@erKripad](https://github.com/erKripad)
- **LinkedIn:** *(https://www.linkedin.com/in/daniele-crippa-ab45492b7/)*
- **Email:** *(daniele.crippa.k@gmail.com)*
