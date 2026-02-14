import jwt from "jsonwebtoken";
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // in mili second (7days)
    httpOnly: true, // this will prevent  xss attack and this token will be only available via http : cross-side scripting attack
    sameSite: "strict", // this will prevent from csrf attack
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
  return token;
};

// http://localhost in dev
// https in production
