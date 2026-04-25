const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Test route
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Wildlife EWS Backend is running 🚀",
    });
});

// Socket connection
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Start server
const PORT = 5001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/api/detection", (req, res) => {
    const { species, location, direction, timestamp } = req.body;

    const detectionEvent = {
        species,
        location,
        direction,
        timestamp: timestamp || new Date(),
    };

    console.log("🚨 New Detection:", detectionEvent);

    // Send real-time event to frontend (Socket.IO)
    io.emit("new-detection", detectionEvent);

    return res.json({
        success: true,
        message: "Detection received",
        data: detectionEvent,
    });
});