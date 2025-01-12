import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../Context/SocketContext";
import { encryptMessage, decryptMessage } from "../utils/crypto";

const ChatPage = () => {
  const { socket, roomKey } = useSocket();
  const location = useLocation();
  const { roomId, socketId, userName } = location.state;
  const [msgIndividual, setMsgIndividual] = useState("");
  const [allMessages, setAllMessages] = useState({});

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", { roomId, socketId });

      const handleBeforeUnload = () => {
        socket.emit("leaveRoom", { roomId, socketId });
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        socket.emit("leaveRoom", { roomId, socketId });
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [socket, roomId, socketId]);

  useEffect(() => {
    if (!socket || !roomKey) {
      return;
    }

    const handleReceivedMessage = async (data) => {
      try {

        console.log(data);

        const decryptedMessage = await decryptMessage(data.message, roomKey);
        setAllMessages((prev) => ({
          ...prev,
          [data.senderIdentity]: [decryptedMessage],
        }));
         
      } catch (error) {
        console.error('❌ Error processing message:', error);
      }
    };

    socket.on("recievedMessage", handleReceivedMessage);

    return () => {
      socket.off("recievedMessage", handleReceivedMessage);
    };
  }, [socket, roomKey, socketId]);

  const handleInputChange = async (e) => {
    e.preventDefault();
    const value = e.target.value;
    setMsgIndividual(value);

    if (!socket || !roomKey || !value.trim()) {
      console.log('⚠️ Cannot send message:', { 
        socketAvailable: !!socket, 
        keyAvailable: !!roomKey, 
        messageAvailable: !!value.trim() 
      });
      return;
    }

    try {
      const encrypted = await encryptMessage(value, roomKey);
      socket.emit("sendMessage", {
        message: encrypted,
        roomId: roomId,
        socketId: socketId,
      });

    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 text-white p-4">
      <div className="socket_print bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-lg mb-4">
        <h1 className="text-xl font-semibold text-cyan-400">
          Socket ID: <span className="text-white">{socketId}</span>
        </h1>
        <h2 className="text-lg text-gray-400">
          Room Key: <span className="font-medium text-cyan-400">{roomId}</span>
        </h2>
        {userName && (
          <h2 className="text-xl font-semibold text-cyan-400">
            Name: <span className="text-white">{userName}</span>
          </h2>
        )}
      </div>
      <div className="mb-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          onChange={handleInputChange}
          value={msgIndividual}
          placeholder="Enter message"
          className="w-full px-4 py-2 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>
      <div className="space-y-2">
        {Object.entries(allMessages).map(([senderIdentity, msgs]) => (
          <div
            key={senderIdentity}
            className="bg-gray-800 bg-opacity-50 p-3 rounded-lg"
          >
            <p className="font-semibold text-cyan-400">
              {senderIdentity === socketId ? 'You' : senderIdentity}:
            </p>
            {msgs.map((m, index) => (
              <p key={index} className="text-gray-300 ml-4">
                {m}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;