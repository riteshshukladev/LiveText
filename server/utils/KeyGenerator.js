import crypto  from "crypto";

const generateRoomId = () => {
    return crypto.randomBytes(8).toString('hex');

}

export default generateRoomId;