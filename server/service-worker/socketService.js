import { Server } from "socket.io";
import Room from "../models/Room.js";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected with socketId ${socket.id}`);

    socket.on("joinRoom", async ({ roomId, socketId }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (room) {
          if (!room.socketIdsJoined.includes(socketId)) {
            room.socketIdsJoined.push(socket.id);
            await room.save();
          }
          socket.join(roomId);
          console.log(`socketId ${socket.id} has joined the room`);
        }
      } catch (err) {
        console.error("Error joining room:", err);
      }
    });

    socket.on("sendMessage", ({ msgIndividual, roomId, socketId }) => {
      io.to(roomId).emit("recievedMessage", {
        senderId: socketId,
        Message: msgIndividual,
      });
    });

    socket.on("leaveRoom", async ({ roomId, socketId }) => {
      
      try {
        const room = await Room.findOne({
          roomId,
        });
        if (room && room.socketIdsJoined.includes(socketId)) {

          if (room.socketIdsJoined.length === 1) {
            await Room.findOneAndDelete({ roomId });
          }
          else {
            room.socketIdsJoined = room.socketIdsJoined.filter(
              (AllsocketIds) => AllsocketIds !== socketId
            );
            await room.save();
          }
        }
        socket.leave(roomId);
        console.log(
          `A user with socketId ${socketId} has exited the room ${roomId}`
        );
      } catch (err) {
        console.error(
          `Error while exiting the user ${socketId} from the room ${roomId}:`,
          err
        );
      }
    });
    // socket.on("disconnect", async () => {

    //   console.log(`user disconnected successfully`);
    // });
  });
};

export default initializeSocket;
