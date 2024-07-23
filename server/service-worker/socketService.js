
const { Server } = require("socket.io");


import { Server } from "socket.io";
import {Room} from "../models/room"

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
      try {
        const room = await Room.findOne({ roomId });
      if (room) {
        if (!room.socketIdsJoined.includes(socket.id)) {
          room.socketIdsJoined.push(socket.id);
          await room.save();
        }
        socket.join(roomId);
        console.log(`socketId ${socket.id} has joined the chat`);
        
      }
      }
      catch (err) {
        console.error('Error joining room:', err);
      }
    });

    socket.on('sendMessage', ({ recievedMessage, roomId, socketId }) => {
      io.to(roomId).emit('recievedMessage', {
        senderId: socketId,
        Message: recievedMessage
      });
    });

    socket.on('disconnect', async () => {
      try {
        const rooms = await Room.findOne({ socketIdsJoined: socket.id });

        for ( let room of rooms) {
          room.socketIdsJoined = room.socketIdsJoined.filter(id => id !== socket.id);
          await room.save();

          io.to(room.roomId).emit('userLeft', { socketId: socket.id });

          console.log(`A user has been left socketId : ${socket.id}`);
        }

      }
      catch (err) {
        console.error(`some error occured while disconnecting : ${err}`);
      }
    });
  });
};

export default initializeSocket;