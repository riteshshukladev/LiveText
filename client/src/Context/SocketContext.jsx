import { useContext, createContext } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";


const socketContext = createContext({});

export const useSocket = useContext(socketContext);

const socketContextAPI = ({ children }) => {
  const navigate = useNavigate();
  const [joinSessionKey, setJoinSessionKey] = useState("");
  const socket = io("http://localhost:4001");

  useEffect(() => {
    const handleNewKeyGenerateSuccess = (obj) => {
      try {
        if (obj.isSuccess) {
          navigate("/chat", {
            state: { SocketId: obj.socketId, roomId: obj.roomId },
          });
        } else {
          console.log("Error while creating the session");
        }
      } catch (err) {
        console.error(err);
      }
    };

    socket.on("newKeyGenerateSucces", handleNewKeyGenerateSuccess);

    return () => {
      socket.off("newKeyGenerateSucces", handleNewKeyGenerateSuccess);
    };
  }, [socket, navigate]);

  useEffect(() => {
    const handleAlreadyGeneratedKeySuccess = (obj) => {
      try {
        if (obj.isSuccess) {
          navigate("/chat", {
            state: { Socketid: obj.SocketId, roomId: obj.roomId },
          });
        } else {
          console.log("Couldn't Enter the session");
        }
      } catch (e) {
        console.error(e);
      }
    };

    socket.on(
      "joinAlreadyGeneratedSessionSuccess",
      handleAlreadyGeneratedKeySuccess
    );

    return () => {
      socket.off(
        "joinAlreadyGeneratedSessionSuccess",
        handleAlreadyGeneratedKeySuccess
      );
    };
  }, [socket, navigate]);

  const handleGenerateNewKey = () => {
    socket.on("connect", () => {
      socket.emit("generateNewSession");
    });
  };

  const handleInputChange = (e) => {
    setJoinSessionKey(e.target.value);
  };

  const handleInputSessionKey = (e) => {
    e.preventDefault();
    socket.on("connect", () => {
      socket.emit("joinAlreadyGeneratedSession", joinSessionKey);
    });
    };
    
  const value = {
    joinSessionKey,
    socket,
    handleGenerateNewKey,
    handleInputChange,
    handleInputSessionKey
    };

  return;
  <socketContext.Provider value={value}>{children}</socketContext.Provider>;
};

export default socketContextAPI;
