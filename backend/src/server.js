import express from "express";
// for this you need to change the "type":"module"
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messagesRouter from "./routes/messages.route.js";
import path from "path";
import { connectDb } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// console.log(process.env.PORT);
const port = ENV.PORT || 3000;

app.use(express.json()); // to get access to the field the user gets
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRouter);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // taking dist from frontend and making it an static assets

  // anything other then this /api/auth ot /api related works just send the react application meaning that both frontend and backend runs the same port
  app.get("*", (_, res) => {
    res.sendFile(
      path.join(path.join(__dirname, "../frontend/dist/index.html")),
    );
  });
}
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectDb();
});
