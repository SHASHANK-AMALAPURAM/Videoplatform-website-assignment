import express from "express";
import fs from "fs";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import Video from "../models/Video.js";
import fakeProcess from "../utils/fakeProcessor.js";

const router = express.Router();

router.post("/upload", auth, upload.single("video"), async (req, res) => {
  const video = await Video.create({
    filename: req.file.filename,
    filepath: req.file.path,
    status: "processing",
    owner: req.user.id
  });

  fakeProcess(req.io, video._id.toString(), Video);
  res.json(video);
});

router.get("/", auth, async (req, res) => {
  const videos = await Video.find({ owner: req.user.id });
  res.json(videos);
});

router.get("/stream/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  const path = video.filepath;
  const stat = fs.statSync(path);
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, { "Content-Length": stat.size });
    fs.createReadStream(path).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": "video/mp4"
});

fs.createReadStream(path, { start, end }).pipe(res);
});

export default router;

