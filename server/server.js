import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { randomInt } from "crypto";




const port = 4001;
const app = express();
const server = createServer(app);
const randomInt = crypto.randomInt(10000, 100000);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  
})