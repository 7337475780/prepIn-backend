import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    topicsToFocus: [{ type: String, required: true }],
    desc: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Que" }],
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
