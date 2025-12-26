export default function fakeProcess(io, videoId, Video) {
    let progress = 0;

    const interval = setInterval(async () => {
    progress += 10;
    io.emit("progress", { videoId, progress });

    if (progress >= 100) {
        clearInterval(interval);
        await Video.findByIdAndUpdate(videoId, { status: "completed" });
        io.emit("completed", { videoId });
        }
    }, 500);
}
