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
    names: {
        type: Map,
        of: String,
        default:new Map()
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
