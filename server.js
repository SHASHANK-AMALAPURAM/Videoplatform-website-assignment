import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.routes.js";
import videoRoutes from "./src/routes/video.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

server.listen(5000, () => console.log("Server running on port 5000"));
