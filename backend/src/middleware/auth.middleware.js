import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../model/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized not token provided" });
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    console.log("Decoded info", decoded);

    if (!decoded) return res.status(401).json({ message: "Invalid token" });
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user; // to use this user onto next function
    next();
  } catch (error) {
    console.error("Error in protect route middleware", error);
    res.status(500).json({ message: "internal server error" });
  }
};
