import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    socketIdsJoined: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});
const Room = mongoose.model('Room', roomSchema);


export default Room;
