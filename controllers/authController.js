import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Generate Token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//@desc @route @ acess

export const registerUser = async (req, res) => {
  try {
    const { name, email, pwd, profilePicUrl } = req.body;

    //Check User
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: "User exists" });
    }

    //Hash pwd
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(pwd, salt);

    //new user
    const user = await User.create({
      name,
      email,
      pwd: hashedPwd,
      profilePicUrl,
    });

    //return user jwt

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err: err.message });
  }
};

//Login
export const loginUser = async (req, res) => {
  try {
    const { email, pwd } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).json({ msg: "Invalid email or password" });
    }

    //Compare
    const isMatch = await bcrypt.compare(pwd, user.pwd);

    if (!isMatch) {
      return res.status(500).json({ msg: "Invalid email or password" });
    }

    //return user data
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicUrl: user.profilePicUrl,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

//
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-pwd");

    if (!user) {
      return res.status(404).json({ msg: "No User" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
