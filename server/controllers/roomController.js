import Room from "../models/room";


const creatRoom = async (req, res) => {
    try {
        const roomId = generateRoomId();
        const room = new Room({ roomId });
        await room.save();
        res.json({ roomId });
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating room' });

    }
};


const joinRoom = async (req, res) => {
    const { joinSessionKey } = req.body;
    try {
        const room = await Room.findOne({ roomId: joinSessionKey });
        if (room) {
            res.json({ roomId: room.id });
        }

        else {
            res.status(500).json({ error: "room not found" });
        }
    }
    catch (err) {
        res.status(500).json({ error: "Error while joining in to the room" });
    }
}