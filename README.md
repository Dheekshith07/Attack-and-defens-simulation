# AI-Powered Cyber Range: Attack & Defense Simulator

## 📁 Complete Folder Structure

```
cyber-range-simulator/
├── backend/
│   ├── app.py              ← Flask REST API (entry point)
│   ├── attack_module.py    ← Red Team engine
│   ├── defense_module.py   ← Blue Team engine
│   ├── ai_module.py        ← ML anomaly detection (Isolation Forest)
│   ├── database.py         ← SQLAlchemy ORM models
│   ├── requirements.txt    ← Python dependencies
│   └── cyber_range.db      ← Auto-created SQLite database
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── api.js          ← Axios API client
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── LogFeed.jsx
    │   │   ├── AlertBanner.jsx
    │   │   └── ScoreCard.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── AttackPanel.jsx
    │   │   └── DefensePanel.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 How to Run Locally

### Step 1 — Start the Backend (Flask)

```bash
cd cyber-range-simulator/backend
pip install -r requirements.txt --prefer-binary
python app.py
```

Backend runs at: **http://localhost:5000**

### Step 2 — Start the Frontend (React + Vite)

Open a **second terminal**:

```bash
cd cyber-range-simulator/frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

### Step 3 — Open the App

Go to **http://localhost:5173** in your browser.

**Default login:** `admin` / `admin123`

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login + get JWT token |
| GET  | `/auth/me` | Get current user profile |
| POST | `/attack/start` | Launch a simulated attack |
| POST | `/defense/action` | Perform a defense action |
| GET  | `/defense/status` | Get system threat level |
| GET  | `/defense/blocked-ips` | List blocked IPs |
| GET  | `/defense/actions` | Recent defense actions |
| GET  | `/logs?limit=N` | Fetch attack logs |
| GET  | `/ai/analyze?window=30` | Run ML anomaly detection |
| GET  | `/ai/risk` | Quick AI risk summary |
| GET  | `/score` | Get user score & stats |
| GET  | `/leaderboard` | Top 10 players |
| GET  | `/health` | Backend health check |

### Example API Calls

**Launch a Brute Force attack:**
```bash
curl -X POST http://localhost:5000/attack/start \
  -H "Content-Type: application/json" \
  -d '{"attack_type": "brute_force", "attempts": 5}'
```

**Block an IP:**
```bash
curl -X POST http://localhost:5000/defense/action \
  -H "Content-Type: application/json" \
  -d '{"action": "block_ip", "target": "192.168.1.25", "reason": "Repeated attacks"}'
```

**Run AI Analysis:**
```bash
curl http://localhost:5000/ai/analyze?window=30
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────┐     REST/JSON      ┌─────────────────────┐
│   React Frontend    │ ◄────────────────► │   Flask Backend     │
│   (Vite, port 5173) │                    │   (port 5000)       │
└─────────────────────┘                    └──────────┬──────────┘
                                                      │
                          ┌───────────────────────────┼──────────────────────────┐
                          │                           │                          │
                 ┌────────▼────────┐      ┌──────────▼────────┐   ┌────────────▼────────┐
                 │  Attack Module  │      │  Defense Module   │   │    AI Module        │
                 │  (Red Team)     │      │  (Blue Team)      │   │  Isolation Forest   │
                 └────────┬────────┘      └──────────┬────────┘   └────────────┬────────┘
                          │                          │                          │
                          └──────────────┬───────────┘──────────────────────────┘
                                         │
                              ┌──────────▼──────────┐
                              │    SQLite Database   │
                              │  (cyber_range.db)    │
                              └─────────────────────┘
```

---

## 🎮 Features Guide

### 🗡️ Attack Panel (Red Team)
- **Brute Force** — Fires 1–10 simulated login attempts with common passwords
- **SQL Injection** — Injects classic SQLi payloads into fake endpoints
- **Phishing** — Deploys simulated email/credential harvesting campaigns
- Adjustable attempt slider for brute force
- Live log stream updates after each attack

### 🛡️ Defense Panel (Blue Team)
- **Scan for Threats** — Detects IPs with repeated attacks in the last 10 minutes
- **Run AI Analysis** — Isolation Forest ML model scans last 30 minutes of logs
- **Block IP** — Add any IP to the simulated firewall blocklist
- **Unblock IP** — Remove IPs from the blocklist
- **Reset Simulation** — Clear all logs and restore system state
- Real-time system status (auto-polls every 5 seconds)

### 📊 Dashboard
- Live charts: Attack type pie chart, status bar chart, 8-hour activity timeline
- AI risk level meter (0–100 risk score)
- Performance score card with level progression
- Leaderboard (top 10 players)
- Real-time backend status indicator

### 🤖 AI Module
- **Isolation Forest** (unsupervised ML) trained on recent logs
- Detects: High-frequency attacks, critical severity patterns, mixed anomalies
- 4 defense recommendation categories based on detected pattern
- Quick risk summary endpoint for dashboard polling

### 🏆 Scoring System
| Action | Points |
|--------|--------|
| Launch attack | +5 pts |
| Block an IP | +30 pts |
| Detect threats | +20 pts × threats |
| Levels | Novice → Defender → Expert → Elite → Cyber Guardian |
| Badges | First Responder, Threat Hunter, IP Terminator, Block Master |

---

## ⚠️ Important Notes

- **All attacks are 100% simulated** — no real systems are targeted
- The backend uses SQLite (no external database needed)
- JWT tokens expire after 24 hours
- The defense engine auto-detects IPs with 3+ attacks in 10 minutes
- All data resets when you use "Reset Simulation" in the Defense Panel

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| `pip install` fails for scikit-learn | Use `pip install -r requirements.txt --prefer-binary` |
| Backend won't start | Make sure port 5000 is free: `netstat -ano \| findstr :5000` |
| Frontend can't reach backend | Both must be running; Vite proxy handles API routing automatically |
| Login fails | Default admin: `admin` / `admin123` (auto-created on first run) |
| Emoji encoding error on Windows | Already fixed in app.py — just restart with `python app.py` |
