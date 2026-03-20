# Strategic Account Planner

A unified SAP + ODP Strategic Account Planner for tracking accounts, stakeholders, competitive positioning, and multiple opportunities with deal health scoring.

## Features

- **Account Management** — Overview, industry analysis, stakeholder mapping, competitive position
- **Strategy** — Customer strategy map, strength/vulnerability analysis, action planning
- **Multi-Opportunity Tracking** — Create and score unlimited opportunities independently
- **Deal Health** — Pain/Power/Vision/Value/Consensus scoring (0–6 per dimension)
- **Qualification** — 4-dimension scoring across Decision Making, Value Prop, Product/Ops, Commercial Risk
- **Draft/Active Status** — Opportunities auto-promote from Draft to Active when all review fields are complete
- **Dashboard** — Aggregated view of all opportunities with health scores, MRR, TCV totals
- **Collaboration Plans** — Per-opportunity milestone tracking with go/no-go checkpoints
- **Auto-Save** — All data persists in browser localStorage

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Railway

### Option A: One-Click from GitHub

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub Repo**
3. Select your repo — Railway auto-detects the config
4. It will run `npm install && npm run build`, then `node server.js`
5. Done — Railway assigns a public URL

### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Environment

Railway automatically provides the `PORT` environment variable. The server picks it up — no manual config needed.

---

## Deploy Elsewhere

### Docker

```bash
docker build -t strategic-planner .
docker run -p 3000:3000 strategic-planner
```

### Vercel / Netlify (Static)

Since this is a Vite + React SPA:

```bash
npm run build
```

Upload the `dist/` folder. Set the SPA fallback to `index.html`.

### Any Node Host

```bash
npm install
npm run build
npm start
```

Requires Node 18+. The server binds to `0.0.0.0:$PORT` (defaults to 3000).

---

## Project Structure

```
strategic-planner/
├── index.html          # Entry HTML with fonts + global styles
├── src/
│   ├── main.jsx        # React mount point
│   └── App.jsx         # Full application (single-file)
├── server.js           # Production static file server
├── vite.config.js      # Vite build config
├── package.json        # Dependencies and scripts
├── railway.json        # Railway deployment config
├── nixpacks.toml       # Railway Nixpacks config
├── Dockerfile          # Container build (alternative)
├── .gitignore
└── README.md
```

## Data Storage

All data is stored in the browser's `localStorage` under the key `sap-planner-v2`. Data stays on the user's device — nothing is sent to a server.

To reset all data, use the **Reset All Data** button in the sidebar footer.
