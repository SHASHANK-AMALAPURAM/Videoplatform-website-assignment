import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Dashboard({ token }) {
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    fetchVideos();
    socket.on("progress", ({ videoId, progress }) => {
      setProgress(p => ({ ...p, [videoId]: progress }));
    });
  }, []);

  const fetchVideos = async () => {
    const res = await axios.get("http://localhost:5000/api/videos", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setVideos(res.data);
  };

  const upload = async e => {
    const form = new FormData();
    form.append("video", e.target.files[0]);

    await axios.post("http://localhost:5000/api/videos/upload", form, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchVideos();
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <input type="file" onChange={upload} />

      {videos.map(v => (
        <div key={v._id}>
          <p>{v.filename}</p>
          <p>Status: {v.status}</p>
          <p>Progress: {progress[v._id] || 0}%</p>
          {v.status === "completed" && (
            <video width="300" controls src={`http://localhost:5000/api/videos/stream/${v._id}`} />
          )}
        </div>
      ))}
    </div>
  );
}
