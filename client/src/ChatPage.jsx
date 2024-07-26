import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import  { useSocket } from "./Context/SocketContext";

const ChatPage = () => {

  const {socket} = useSocket();

  console.log(socket);

  const location = useLocation();

  const { roomId, socketId } = location.state;
  const [msgIndividual, setMsgIndividual] = useState("");
  const [allMessages, setAllMessages] = useState({});
 

  // useEffect(() => {
  //   if (socket && roomId) {
  //     socket.emit("joinRoom", { roomId });

  //   }
  // }, [socket, roomId]);

  // console.log(roomId);

  useEffect(() => {
   
      socket.on("recievedMessage", (data) => {
        setAllMessages((prev) => ({
          ...prev,
          [data.senderId]: [data.Message],
        }));
      });
    
    
  }, [socket]);

  

  const handleMsgChange = (e) => {
    const { value } = e.target;

    setMsgIndividual(value);
    if (socket && roomId && msgIndividual.trim()) {
      socket.emit("sendMessage", {
        msgIndividual: msgIndividual,
        roomId: roomId,
        socketId: socketId,
      });
    }
  };

  
  return (
    <div>
      <div className="socket_print">
        <h1>Socket ID: {socketId}</h1>
        {<h2>Room Key: {roomId}</h2>}
      </div>
      <form>
        <input
          type="text"
          onChange={handleMsgChange}
          placeholder="Enter message"
          value={msgIndividual}
        />
      </form>
      <div>
        {Object.entries(allMessages).map(([senderId, msgs]) => (
          <div key={senderId}>
            <p>{senderId}:</p>

            {msgs.map((m, index) => (
              <p key={index}>{m}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
