import Room from "../models/room.js";
import generateRoomId from "../utils/KeyGenerator.js";
import { generateRoomKey } from "../utils/encryptionUtils.js";

const createRoom = async (req, res) => {
  const { socketId, roomKey } = req.body;
  try {
    const roomId = generateRoomId();
    const room = new Room({
      roomId,
      roomKey: Buffer.from(roomKey).toString("hex"), 
    });

    room.socketIdsJoined.push(socketId);
    await room.save();

    res.json({
      roomId,
      roomKey, 
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Error creating room" });
  }
};

const joinRoom = async (req, res) => {
  const { roomId, socketId } = req.body;
  try {
    const room = await Room.findOne({ roomId });
    if (room) {
      if (!room.socketIdsJoined.includes(socketId)) {
        room.socketIdsJoined.push(socketId);
        await room.save();
      }

      const roomKeyBuffer = Buffer.from(room.roomKey, "hex");

      res.json({
        roomId,
        roomKey: Array.from(roomKeyBuffer),
      });
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (err) {
    console.error("Error joining room:", err);
    res.status(500).json({ error: "Error while joining the room" });
  }
};

export { createRoom, joinRoom };
