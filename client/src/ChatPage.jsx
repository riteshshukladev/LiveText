import React, { useState } from "react";
import { useLocation } from "react-router-dom";


const ChatPage = () => {

  const { socket, socketId, roomId} = useLocation();
  
  const [msgIndividual, setMsgIndividual] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  
  const handleMsgChange = (e) => {
    e.preventDefault();
    
    setMsgIndividual(msgIndividual);
    if (socket && room && msgIndividual.trim()) {
      socket.emit("sendMessage", { recievedMessage: msgIndividual, roomId: roomId, socketId: socketId });
    }
  }

  socket.on("recievedMessage", (data) => {
    setAllMessages((prev) => ({
      ...prev,
      [data.senderId]: [data.Message]
      
    }))
  })
    return (
        <div>
          <div className="socket_print">
            <h1>Socket ID: {socketId}</h1>
            {<h2>Room Key: {room}</h2>}
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
              
                {msgs.map((m, index) => <p key={index}>{m}</p>)}
              </div>
            ))}
          </div>
        </div>
  );
}

export default ChatPage;