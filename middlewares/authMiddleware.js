import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-pwd");
      next();
    } else {
      return res.status(401).json({ msg: "Not Authorized" });
    }
  } catch (err) {
    return res.status(401).json({ msg: "Token Failed", err: err.message });
  }
};
