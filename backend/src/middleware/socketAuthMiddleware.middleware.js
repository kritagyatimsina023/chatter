import jwt from "jsonwebtoken";
import User from "../model/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    //extract the token from our http only cookies
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];
    console.log("This is soket token extraction", token);
    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unathorized- No token Provided"));
    }

    // verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unathorized- Invalid token "));
    }
    // find the user on DB
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return next(new Error("user not found"));
    console.log("user from socket", user);

    //attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString();
    console.log(`Socket authenticated for:${user.fullName} (${user._id})`);
    next();
  } catch (error) {
    console.log("Error in socket authentication", error.message);
    next(new Error("Unathorized - Authentication failed"));
  }
};
