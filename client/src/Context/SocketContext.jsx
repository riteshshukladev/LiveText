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
  const [socket, setSocket] = useState("");

  const connectSocket = async () => {
    return new Promise((resolve) => {
      if (!socket) {
        const newSocket = io(urlEndPoint);

        newSocket.on('connect', () => {
          setSocket(newSocket);
          resolve(newSocket);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          resolve(null);
        });
      } else {
        resolve(socket);
      }
    });
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
        newSocket.emit("joinRoom", { roomId: data.roomId });
        navigate(`/chat/${data.roomId}`, {
          state: { roomId: data.roomId, socketId: newSocket.id },
        });
      } else {
        throw new Error("Room creation unsuccesfull");
      }
    } catch (err) {
      alert(`Problem while creating the room: ${err}`);
    }
  };

  const handleInputChange = (e) => {
    setJoinSessionKey(e.target.value);
  };

  const handleInputSessionKey = async (e) => {
    e.preventDefault();

    try {
      const newSocket = await connectSocket();

      const response = await fetch(`${urlEndPoint}/join-room`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: joinSessionKey,
          socketId: newSocket.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/chat/${data.roomId}`, {
          state: { roomId: data.roomId, socketId: newSocket.id },
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData || "error while joining the room");
      }
    } catch (err) {
      alert(`There was a problem while joining session ${err}`);
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
