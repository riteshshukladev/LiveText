
const { Server } = require("socket.io");


import { Server } from "socket.io";
import {Room} from "../"

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', async ({ roomId }) => {
      const room = await Room.findOne({ roomId });
      if (room) {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      }
    });

    socket.on('sendMessage', ({ recievedMessage, roomId, socketId }) => {
      io.to(roomId).emit('recievedMessage', {
        senderId: socketId,
        Message: recievedMessage
      });
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

export default initializeSocket;