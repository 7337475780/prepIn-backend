import mongoose from "mongoose";

const queSchema = mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    question: String,
    answer: String,
    note: String,
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Que = mongoose.model("Que", queSchema);
export default Que;
