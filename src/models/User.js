import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: "editor" }
});

export default mongoose.model("User", userSchema);
