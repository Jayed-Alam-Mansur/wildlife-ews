import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// ───── Socket.IO connection with auto-reconnect ─────
const socket = io("http://localhost:5001", {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// ───── Species config: icons, colors, base coordinates ─────
const SPECIES_CONFIG = {
  Elephant: { emoji: "🐘", color: "#22d3ee", label: "Elephant" },
  Tiger:    { emoji: "🐅", color: "#f59e0b", label: "Tiger" },
  Rhino:    { emoji: "🦏", color: "#a78bfa", label: "Rhino" },
  Leopard:  { emoji: "🐆", color: "#f43f5e", label: "Leopard" },
};

// Base coordinates for barrier locations (Chitwan National Park area)
const LOCATION_COORDS = {
  "Barrier B1": { lat: 27.5246, lng: 84.3542 },
  "Barrier B2": { lat: 27.5685, lng: 84.4273 },
  "Barrier B3": { lat: 27.4912, lng: 84.5001 },
};

const DEFAULT_CENTER = { lat: 27.53, lng: 84.42 };

// ───── Create a custom colored marker icon ─────
function createMarkerIcon(species) {
  const config = SPECIES_CONFIG[species] || { emoji: "🐾", color: "#94a3b8" };
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 36px; height: 36px;
        display: flex; align-items: center; justify-content: center;
        background: radial-gradient(circle, ${config.color}33 0%, ${config.color}11 70%);
        border: 2px solid ${config.color};
        border-radius: 50%;
        font-size: 18px;
        box-shadow: 0 0 12px ${config.color}66, 0 2px 8px rgba(0,0,0,0.4);
        animation: marker-pulse 2s ease-in-out infinite;
        position: relative;
      ">
        <span>${config.emoji}</span>
        <div style="
          position: absolute; inset: -4px;
          border: 1px solid ${config.color}44;
          border-radius: 50%;
          animation: marker-ring 2s ease-out infinite;
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -22],
  });
}

// ───── Add simulated coordinate jitter ─────
function getCoords(location) {
  const base = LOCATION_COORDS[location] || DEFAULT_CENTER;
  const jitter = () => (Math.random() - 0.5) * 0.03;
  return { lat: base.lat + jitter(), lng: base.lng + jitter() };
}

// ───── Format timestamp for display ─────
function formatTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return ts;
  }
}

// ───── Auto-pan map to latest marker ─────
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], map.getZoom(), {
        duration: 0.8,
      });
    }
  }, [position, map]);
  return null;
}

// ───── Inject marker pulse animation ─────
function injectAnimationCSS() {
  if (document.getElementById("marker-animations")) return;
  const style = document.createElement("style");
  style.id = "marker-animations";
  style.textContent = `
    @keyframes marker-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    @keyframes marker-ring {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.6); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ───── Main App ─────
function App() {
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const [latestPos, setLatestPos] = useState(null);
  const listRef = useRef(null);

  const handleDetection = useCallback((data) => {
    console.log("🚨 Live Alert:", data);
    const coords = getCoords(data.location);
    const enriched = {
      ...data,
      id: Date.now() + Math.random(),
      lat: coords.lat,
      lng: coords.lng,
    };
    setAlerts((prev) => [enriched, ...prev]);
    setLatestPos(coords);
  }, []);

  useEffect(() => {
    injectAnimationCSS();

    socket.on("connect", () => {
      console.log("✅ Connected to backend:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from backend");
      setConnected(false);
    });

    socket.on("new-detection", handleDetection);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new-detection", handleDetection);
    };
  }, [handleDetection]);

  // Auto-scroll sidebar to top on new alert
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [alerts.length]);

  return (
    <div className="app-container">
      {/* ── Header ── */}
      <header className="header" id="app-header">
        <div className="header-left">
          <span className="header-logo">🐘</span>
          <h1 className="header-title">Wildlife Early Warning System</h1>
        </div>
        <div className="header-right">
          <div className="alert-counter" id="alert-count">
            <span>🚨</span>
            <span>{alerts.length} Alert{alerts.length !== 1 ? "s" : ""}</span>
          </div>
          <div
            className={`connection-badge ${connected ? "connected" : "disconnected"}`}
            id="connection-status"
          >
            <span className="connection-dot"></span>
            <span>{connected ? "Live" : "Offline"}</span>
          </div>
        </div>
      </header>

      {/* ── Map + Sidebar ── */}
      <div className="map-wrapper" id="map-area">
        <MapContainer
          center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
          zoom={12}
          zoomControl={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater position={latestPos} />

          {alerts.map((alert) => (
            <Marker
              key={alert.id}
              position={[alert.lat, alert.lng]}
              icon={createMarkerIcon(alert.species)}
            >
              <Popup>
                <div className="popup-content">
                  <div className="popup-species">
                    <span>{(SPECIES_CONFIG[alert.species] || {}).emoji || "🐾"}</span>
                    <span>{alert.species}</span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-row-icon">📍</span>
                    <span className="popup-row-value">{alert.location}</span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-row-icon">🧭</span>
                    <span className="popup-row-value">{alert.direction}</span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-row-icon">⏱</span>
                    <span className="popup-row-value">{formatTime(alert.timestamp)}</span>
                  </div>
                  <div className="popup-row">
                    <span className="popup-row-icon">📐</span>
                    <span className="popup-row-value">
                      {alert.lat.toFixed(4)}°N, {alert.lng.toFixed(4)}°E
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* ── Sidebar Alert Feed ── */}
        <aside className="sidebar" id="alert-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">🚨 Live Detection Feed</span>
          </div>
          <div className="sidebar-list" ref={listRef}>
            {alerts.length === 0 ? (
              <div className="sidebar-empty">
                <span className="sidebar-empty-icon">📡</span>
                <span>Waiting for detections...</span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>
                  Run the simulator to see live events
                </span>
              </div>
            ) : (
              alerts.map((alert) => {
                const cfg = SPECIES_CONFIG[alert.species] || {
                  emoji: "🐾",
                  color: "#94a3b8",
                };
                return (
                  <div className="alert-card" key={alert.id}>
                    <div className="alert-card-header">
                      <div className="alert-species">
                        <span
                          className="species-icon"
                          style={{
                            filter: `drop-shadow(0 0 4px ${cfg.color})`,
                          }}
                        >
                          {cfg.emoji}
                        </span>
                        <span style={{ color: cfg.color }}>{alert.species}</span>
                      </div>
                      <span className="alert-time">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                    <div className="alert-details">
                      <span className="alert-tag">
                        <span className="alert-tag-icon">📍</span>
                        {alert.location}
                      </span>
                      <span className="alert-tag">
                        <span className="alert-tag-icon">🧭</span>
                        {alert.direction}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;