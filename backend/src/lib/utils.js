import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
export const generateToken = (userId, res) => {
  if (!ENV.JWT_SECRET) {
    throw new Error("No jwt secret key included");
  }
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // in mili second (7days)
    httpOnly: true, // this will prevent  xss attack and this token will be only available via http : cross-side scripting attack
    sameSite: "strict", // this will prevent from csrf attack
    secure: ENV.NODE_ENV === "development" ? false : true,
  });
  return token;
};

// http://localhost in dev
// https in production
