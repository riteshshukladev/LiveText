import Room from "../models/room.js";

const setName = async (req,res) => {
    const { roomId, socketId, name } = req.body
    
    if (!roomId || !socketId) {
        return res.status(400).json({ error: 'Room ID and Socket ID are required' });
    }


    try {
        const room = await Room.findOneAndUpdate({ roomId, socketIdsJoined: socketId },
        {$set:{[`names.${socketId}`]:name}},
        {new:true}
        );
        
        if (room) {
            console.log("Name updated successfully");
            return res.status(200).json({ message: 'Name set successfully', room });
        }
        else {
            return res.status(404).json({ error: 'Room not found or socket ID not in room' });
        }
    }
    catch (error) {
        console.error('Error setting name:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
}

export default setName;