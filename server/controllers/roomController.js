import Room from "../models/Room.js";
import generateRoomId from "../utils/KeyGenerator.js";

const createRoom = async (req, res) => {
  const { socketId } = req.body;
  console.log(`this is the socketId sended from client with the roomId being ${socketId}`);
  try {
    const roomId = generateRoomId();
    const room = new Room({ roomId });
    room.socketIdsJoined.push(socketId);
    await room.save();
    res.json({ roomId });
  } catch (error) {
    res.status(500).json({ error: "Error creating room" });
  }
};


const joinRoom = async (req, res) => {
  const { roomId, socketId } = req.body;
  console.log(`this is the socketId sended from client ${socketId} with roomId ${roomId}`);

  try {
    const room = await Room.findOne({ roomId });
    if (room) {
      if (!room.socketIdsJoined.includes(socketId)) {
        room.socketIdsJoined.push(socketId);
        await room.save();
      }
      res.json({ roomId });
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error while joining the room" });
  }
};


export { createRoom, joinRoom };
