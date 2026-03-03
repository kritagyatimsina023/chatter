import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware.middleware.js";

const app = express();
const server = http.createServer(app);

// const SocketServer = new Server(server);
const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

//apply authentication middleware to all socket connection
io.use(socketAuthMiddleware);

// using this function to check id the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// for torking the online user
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  //io.emit is used to send event to all the connected clients
  io.emit("getonlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for an events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getonlineUsers", Object.keys(userSocketMap));
  });
});
export { io, app, server };
