import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pwd: { type: String, required: true },
    profilePicUrl: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
