import { AwardIcon } from "lucide-react";
import {
  useEffect,
  useState,
  useMemo,
  useContext,
  createContext,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socketContext = createContext({
  joinSessionKey: "",
  socket: null,
  handleGenerateNewKey: () => {},
  handleInputSessionKey: () => {},
  handleInputChange: () => {},
  showNameModal: "",
  handleNewNameSubmit: () => {},
  onSkip: () => {},
});

const SocketContextAPI = ({ children }) => {
  const navigate = useNavigate();
  const [joinSessionKey, setJoinSessionKey] = useState("");
  const urlEndPoint = `${import.meta.env.VITE_API_URL}`;
  const [socket, setSocket] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const roomIdRef = useRef(null);
  const socketIdRef = useRef(null);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const connectSocket = async () => {
    return new Promise((resolve) => {
      if (!socket) {
        const newSocket = io(urlEndPoint, {
          transports: ["websocket"], // Force WebSocket as the only transport
          upgrade: false,
        });

        newSocket.on("connect", () => {
          setSocket(newSocket);
          resolve(newSocket);
        });

        newSocket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
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
        roomIdRef.current = data.roomId;
        socketIdRef.current = newSocket.id;
        setShowNameModal(true);
        setPendingNavigation({ roomId: data.roomId, socket: newSocket.id });
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
        roomIdRef.current = data.roomId;
        socketIdRef.current = newSocket.id;
        setShowNameModal(true);
        // navigate(`/chat/${data.roomId}`, {
        //   state: { roomId: data.roomId, socketId: newSocket.id },
        // });
        setPendingNavigation({ roomId: data.roomId, socket: newSocket.id });
      } else {
        const errorData = await response.json();
        throw new Error(errorData || "error while joining the room");
      }
    } catch (err) {
      alert(`There was a problem while joining session ${err}`);
    }
  };

  const handleNewNameSubmit = async (name) => {
    try {
      const response = await fetch(`${urlEndPoint}/set-name`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: roomIdRef.current,
          socketId: socketIdRef.current,
          name: name,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setShowNameModal(false);
        if (pendingNavigation) {
          navigate(`/chat/${pendingNavigation.roomId}`, {
            state: {
              roomId: pendingNavigation.roomId,
              socketId: pendingNavigation.socket,
              userName: name
            },
          });
          setPendingNavigation(null);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData || "error adding the name");
      }
    } catch (err) {
      alert("There is some problem while setting the name" || err);
    }
  };
  const onSkip = () => {
    setShowNameModal(false);
    if (pendingNavigation) {
      navigate(`/chat/${pendingNavigation.roomId}`, {
        state: {
          roomId: pendingNavigation.roomId,
          socketId: pendingNavigation.socket,
          userName: null
        },
      });
      setPendingNavigation(null);
    }
  };
  const value = {
    joinSessionKey,
    socket,
    handleGenerateNewKey,
    handleInputChange,
    handleInputSessionKey,
    showNameModal,
    handleNewNameSubmit,
    onSkip,
  };

  return (
    <socketContext.Provider value={value}>{children}</socketContext.Provider>
  );
};

export const useSocket = () => useContext(socketContext);
export default SocketContextAPI;
