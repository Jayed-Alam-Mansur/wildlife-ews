

<h1 align="center">🐘 Wildlife Early Warning System</h1>

<p align="center">
  <strong>Real-time wildlife detection and alert system to reduce human–wildlife conflict in Nepal</strong>
</p>


<p align="center">
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=flat-square&logo=socket.io&logoColor=white" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white" alt="Leaflet"/>
</p>

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Current Status](#-current-status)
- [Future Enhancements](#-future-enhancements)
- [Impact & Vision](#-impact--vision)
- [Team](#-team)

---

## 🚨 The Problem

Nepal's protected areas — including **Chitwan National Park**, **Bardia National Park**, and surrounding buffer zones — are home to some of the world's most endangered species: Asian elephants, Bengal tigers, one-horned rhinoceroses, and leopards.

As human settlements expand closer to forest boundaries, **human–wildlife conflict (HWC)** has become one of the most pressing conservation challenges in Nepal:

- 🐘 **Elephants** regularly cross barriers into farmland, destroying crops and endangering lives
- 🐅 **Tigers and leopards** venture into villages, causing livestock loss and human casualties
- 🦏 **Rhinos** stray from park boundaries, leading to dangerous encounters
- 📉 Communities suffer **economic losses**, and retaliatory killings threaten wildlife populations

> **Between 2010–2025, over 800 human casualties and thousands of wildlife deaths were reported due to HWC in Nepal's Terai region alone.**

Current monitoring relies on **manual patrolling** and **delayed reporting**, meaning communities often receive warnings **too late** to take protective action. There is an urgent need for a **real-time, technology-driven early warning system**.

---

## 💡 Our Solution

The **Wildlife Early Warning System (Wildlife EWS)** is a **real-time, end-to-end wildlife monitoring dashboard** that detects animal movements near forest barriers and instantly alerts communities through a live geospatial interface.

The system simulates a network of IoT sensors deployed along forest–settlement boundaries. When a wildlife detection event occurs, it flows through a three-layer distributed pipeline:

```
🔬 IoT Sensor Layer        →    🖥️ Processing Layer       →    🗺️ Visualization Layer
(Python Simulator)               (Node.js + Socket.IO)          (React + Leaflet Map)
                                                                
Detects animal movement     →    Receives & broadcasts     →    Live map markers +
near forest barriers             events in real time             sidebar alert feed
```

**The result**: Communities, park rangers, and conservation teams see wildlife detections **instantly** on a live map — enabling rapid response and preventing dangerous encounters before they happen.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WILDLIFE EARLY WARNING SYSTEM                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────────┐     ┌──────────────────┐     ┌────────────┐ │
│   │  🐍 SIMULATOR    │     │  🖥️ BACKEND       │     │ ⚛️ FRONTEND│ │
│   │                  │     │                  │     │            │ │
│   │  Python script   │────▶│  Node.js/Express │────▶│  React +   │ │
│   │  simulates IoT   │POST │  receives events │WS   │  Leaflet   │ │
│   │  sensor network  │     │  via REST API    │     │  live map  │ │
│   │                  │     │                  │     │            │ │
│   │  Species:        │     │  /api/detection  │     │  Markers + │ │
│   │  • Elephant 🐘   │     │  /api/health     │     │  Popups +  │ │
│   │  • Tiger 🐅      │     │                  │     │  Sidebar   │ │
│   │  • Rhino 🦏      │     │  Socket.IO       │     │  Feed      │ │
│   │  • Leopard 🐆    │     │  broadcasts via  │     │            │ │
│   │                  │     │  "new-detection"  │     │  🟢 LIVE   │ │
│   └──────────────────┘     └──────────────────┘     └────────────┘ │
│                                                                     │
│   Port: one-shot           Port: 5001               Port: 5173     │
│   Protocol: HTTP POST      Protocol: WS + HTTP      Protocol: HTTP │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 🔄 Data Flow

```
Python Simulator
       │
       │  POST /api/detection
       │  { species, location, direction, timestamp }
       ▼
Node.js Backend (Express)
       │
       │  io.emit("new-detection", event)
       │  (Socket.IO WebSocket broadcast)
       ▼
React Frontend (Vite)
       │
       │  socket.on("new-detection") → setState
       │
       ▼
┌─────────────────────────────────┐
│  🗺️ Live Leaflet Map            │
│  ┌───────────┐ ┌──────────────┐ │
│  │ Animated  │ │ Sidebar Feed │ │
│  │ Species   │ │ with alerts  │ │
│  │ Markers   │ │ & timestamps │ │
│  └───────────┘ └──────────────┘ │
│  🟢 LIVE connection indicator    │
└─────────────────────────────────┘
```

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Live Map Dashboard** | Full-screen Leaflet map centered on Chitwan National Park with dark theme and OpenStreetMap tiles |
| 📡 **Real-Time Streaming** | Zero-refresh updates via Socket.IO WebSocket — detections appear instantly on the map |
| 🐘 **Multi-Species Tracking** | Color-coded animated markers for Elephant (cyan), Tiger (amber), Rhino (purple), and Leopard (rose) |
| 🎯 **Smart Markers** | Custom emoji markers with pulsing glow animations and species-specific color rings |
| 📋 **Live Sidebar Feed** | Glassmorphic scrollable alert panel showing species, barrier location, direction, and timestamp |
| 🟢 **Connection Status** | Real-time "LIVE" / "Offline" indicator with auto-reconnect capability |
| 📍 **Rich Popups** | Click any marker to see species, location, compass direction, timestamp, and GPS coordinates |
| 🌙 **Dark Theme** | Premium dark UI with gradient header, Inter typography, and subtle micro-animations |
| 📱 **Responsive Design** | Adapts to different screen sizes for field use on tablets and mobile devices |
| 🔄 **Auto-Reconnect** | Socket.IO client automatically reconnects with exponential backoff if connection drops |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | Component-based UI with hooks for real-time state management |
| **Vite 5** | Lightning-fast dev server and build tool (Node 18 compatible) |
| **Leaflet 1.9** | Interactive map rendering with OpenStreetMap tiles |
| **react-leaflet 5** | React bindings for declarative Leaflet map components |
| **socket.io-client 4** | WebSocket client for real-time event streaming |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js 18** | Server-side JavaScript runtime |
| **Express 5** | RESTful API framework for detection ingestion |
| **Socket.IO 4** | Real-time bidirectional WebSocket communication |
| **CORS** | Cross-origin resource sharing for frontend–backend communication |

### Simulator
| Technology | Purpose |
|-----------|---------|
| **Python 3** | IoT sensor simulation scripting |
| **requests** | HTTP client for sending detection events to backend |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (recommended via [nvm](https://github.com/nvm-sh/nvm))
- **Python 3.8+**
- **npm** (comes with Node.js)

### Installation & Setup

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/wildlife-ews.git
cd wildlife-ews
```

#### 2️⃣ Start the Backend Server

```bash
cd backend
npm install
node index.js
```

✅ You should see:
```
Server running on http://localhost:5001
```

Verify the health endpoint:
```bash
curl http://localhost:5001/api/health
# → {"status":"OK","message":"Wildlife EWS Backend is running 🚀"}
```

#### 3️⃣ Start the Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
```

✅ You should see:
```
VITE v5.4.21  ready in ~800ms
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser — you should see the dark-themed map dashboard with the **🟢 LIVE** indicator.

#### 4️⃣ Run the Python Simulator

```bash
cd simulator
pip install requests    # if not already installed
python3 simulator.py
```

✅ You should see:
```
Sent: {'species': 'Tiger', 'location': 'Barrier B2', 'direction': 'North', ...}
Response: {'success': True, 'message': 'Detection received', ...}
```

🎉 **A new marker will appear instantly on the map dashboard!**

---

## 📁 Project Structure

```
wildlife-ews/
├── backend/                    # 🖥️ Node.js API + Socket.IO server
│   ├── index.js                # Express server, REST endpoints, Socket.IO setup
│   ├── package.json            # Backend dependencies
│   └── node_modules/
│
├── frontend/                   # ⚛️ React + Vite dashboard
│   ├── index.html              # HTML entry with Inter font, meta tags
│   ├── vite.config.js          # Vite 5 configuration
│   ├── package.json            # Frontend dependencies
│   ├── src/
│   │   ├── main.jsx            # React entry, Leaflet CSS import
│   │   ├── App.jsx             # Main app: Socket.IO + Map + Sidebar
│   │   ├── index.css           # Dark theme design system
│   │   └── App.css             # Component-specific styles
│   └── node_modules/
│
├── simulator/                  # 🐍 Python IoT simulator
│   └── simulator.py            # Sends randomized detection events
│
└── README.md                   # 📋 This file
```

---

## 📊 Current Status

| Component | Status | Details |
|-----------|--------|---------|
| ✅ Backend API | **Working** | Express + Socket.IO on port 5001, health + detection endpoints active |
| ✅ Frontend Dashboard | **Working** | React + Vite on port 5173, dark Leaflet map rendering correctly |
| ✅ Socket.IO Pipeline | **Working** | Real-time event streaming with auto-reconnect |
| ✅ Python Simulator | **Working** | Sends detection events, receives success responses |
| ✅ End-to-End Flow | **Working** | Simulator → Backend → Socket.IO → Live Map — fully verified |
| ✅ Multi-Species Markers | **Working** | Animated markers for Elephant, Tiger, Rhino, Leopard |
| ✅ Sidebar Alert Feed | **Working** | Glassmorphic panel with live species alerts |
| ✅ Connection Indicator | **Working** | 🟢 LIVE / 🔴 Offline with real-time status |

---

## 🔮 Future Enhancements

### Phase 2 — Alert & Communication Layer
| Enhancement | Description |
|-------------|-------------|
| 📲 **SparrowSMS Integration** | Send SMS alerts to nearby communities via [SparrowSMS API](https://sparrowsms.com) when high-risk species (Tiger, Elephant) are detected near settlements |
| 🔔 **Push Notifications** | Browser push notifications for park rangers and field officers |
| 📧 **Email Alert Digest** | Periodic summary reports for conservation managers |

### Phase 3 — Advanced Monitoring
| Enhancement | Description |
|-------------|-------------|
| 📷 **Camera Network Visualization** | Display IoT camera positions as green dots on the map with status indicators (active/offline) |
| 📊 **Statistics Dashboard** | Real-time stats panel showing total alerts, active cameras, species breakdown, and hourly trends |
| 📜 **Alert History Table** | Searchable, sortable log of all detection events with export functionality |
| 🗺️ **Movement Heatmaps** | Overlay heatmaps showing animal movement patterns over time |

### Phase 4 — Intelligence & Prediction
| Enhancement | Description |
|-------------|-------------|
| 🤖 **ML-Based Prediction** | Use historical movement data to predict likely crossing points and timing |
| 🖼️ **Species Image Recognition** | Integrate camera feeds with image classification for automated species ID |
| 🎨 **Enhanced Popup UI** | Rich popups with species illustrations (SVG), images, and behavioral context |
| 📈 **Trend Analysis** | Seasonal and temporal analysis of wildlife movement patterns |

---

## 🌍 Impact & Vision

### How Wildlife EWS Helps

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  🐘 Animal approaches    →   📡 Sensor detects    →   🗺️ Map      │
│     forest barrier             movement                 updates    │
│                                                        instantly   │
│                           →   📲 SMS alert sent    →   🏘️ Community│
│                                to nearby village        takes      │
│                                (Future Phase)           action     │
│                                                                    │
│  Result: Fewer human casualties, fewer retaliatory wildlife kills  │
│          Safer communities, thriving wildlife populations           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Conservation Goals Supported

- 🛡️ **Protect Endangered Species** — Reduce retaliatory killings by providing timely community warnings
- 👨‍👩‍👧‍👦 **Safeguard Communities** — Enable farmers and villagers to take preventive action before wildlife arrives
- 📊 **Data-Driven Conservation** — Build a longitudinal database of wildlife movement patterns for researchers
- 🌐 **Scalable Architecture** — Designed to scale from a single park to Nepal's entire protected area network
- 🤝 **Community Engagement** — Empower local communities as active participants in conservation

