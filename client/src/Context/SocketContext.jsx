import { useEffect, useState, useMemo, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socketContext = createContext({
  joinSessionKey: "",
  socket: null,
  handleGenerateNewKey: () => {},
  handleInputSessionKey: () => {},
  handleInputChange: () => {},
});

const SocketContextAPI = ({ children }) => {
  const navigate = useNavigate();
  const [joinSessionKey, setJoinSessionKey] = useState("");
  const urlEndPoint = "http://localhost:4001";
  const [socket, setSocket] = useSocket("");

  const connectSocket = () => {
    if (!socket) {
      const newSocket = io(urlEndPoint);
      setSocket(newSocket);
      return newSocket;
    }
    return socket;
  };

  const handleGenerateNewKey = async () => {
    const newSocket = await connectSocket();
    try {
      const response = await fetch(`${urlEndPoint}/create-room`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socketId: newSocket.id }),
      });
      if (response.ok) {
        const data = await response.json();
        newSocket.emit('joinRoom', { roomId: data.roomId });
        navigate(`/chat/${data.roomId}`, {
          state: { roomId: data.roomId, socketId: newSocket.id },
        });
      }
      else {
        throw new Error("Error while creating the room")
      }
    }
     catch (err) {
      alert(`Error while creating the room: ${err}`);
    }
  };

  const handleInputChange = (e) => {
    setJoinSessionKey(e.target.value);
  };

  const handleInputSessionKey = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${urlEndPoint}/join-room`, {
        method: "post",
        Headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinSessionKey }),
      });

      if (response.ok) {
        navigate(`/chat/${joinSessionKey}`, {
          state: { roomId: data.roomId, socketId: data.socketId },
        });
      }
    } catch (err) {
      alert("Error while joining session");
    }
  };

  const value = {
    joinSessionKey,
    socket,
    handleGenerateNewKey,
    handleInputChange,
    handleInputSessionKey,
  };

  return (
    <socketContext.Provider value={value}>{children}</socketContext.Provider>
  );
};

export const useSocket = () => useContext(socketContext);
export default SocketContextAPI;
