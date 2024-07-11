import React from "react";


const Chat = () => {
    return (
        <div>
          <div className="socket_print">
            <h1>Socket ID: {socketId.current}</h1>
            {isHost && <h2>Room Key: {room}</h2>}
          </div>
          <form>
            <input
              type="text"
              onChange={socket.handleMsgChange}
              placeholder="Enter message"
              value={socket.msg}
            />
        
          </form>
          <div>
            {Object.entries(socket.messages).map(([senderId, msgs]) => (
              <div key={senderId}>
                <p>{senderId}:</p>
              
                {msgs.map((m, index) => <p key={index}>{m}</p>)}
              </div>
            ))}
          </div>
        </div>
  );
}