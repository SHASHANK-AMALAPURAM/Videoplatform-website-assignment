import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    filename: String,
    filepath: String,
    status: String,
    owner: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Video", videoSchema);
