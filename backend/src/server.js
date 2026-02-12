import express from "express";
// for this you need to change the "type":"module"
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messagesRouter from "./routes/messages.route.js";
dotenv.config();

const app = express();
console.log(process.env.PORT);
const port = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
