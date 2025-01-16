import { useEffect, useState, useContext, createContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { generateAESKey, exportKey, importKey } from "../utils/crypto";

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
  const [loadingState, setLoadingState] = useState({
    createSession: false,
    joinSession: false,
  });
  const [connectionState, setConnectionState] = useState({
    connected: false,
    error: false,
  });
  const [roomKey, setRoomKey] = useState(null);
  const [error, setError] = useState(null);

  const handleError = ({ title, message }) => {
    setError({ title, message });
    // setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    const newSocket = io(urlEndPoint, {
      transports: ["websocket"], // Force WebSocket as the only transport
      upgrade: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 3,
    });

    newSocket.on("connect", () => {
      setConnectionState((prevState) => ({ ...prevState, connected: true }));
      console.log("Socket connected");
      setSocket(newSocket);
    });

    newSocket.on("roomKey", async (keyData) => {
      try {
        const key = await importKey(keyData);
        setRoomKey(key);
      } catch (error) {
        console.error("Error importing room key:", error);
      }
    });

    newSocket.on("roomKeyUpdate", async (keyData) => {
      try {
        console.log("Received room key update");
        const key = await importKey(keyData);
        setRoomKey(key);
      } catch (error) {
        console.error("Error importing room key:", error);
      }
    });

    newSocket.on("connect_error", (error) => {
      setConnectionState((prevState) => ({ ...prevState, error: true }));
      {
        connectionState.connected &&
          handleError({
            title: "Connection Error",
            message: "There was an error connecting to the server",
          });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [urlEndPoint]);

  const handleGenerateNewKey = async () => {
    if (!socket) return;
    setLoadingState((prevState) => ({ ...prevState, createSession: true }));
    try {
      const aesKey = await generateAESKey();
      const exportedKey = await exportKey(aesKey);

      const response = await fetch(`${urlEndPoint}/chat/create-room`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socketId: socket.id,
          roomKey: exportedKey,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        roomIdRef.current = data.roomId;
        socketIdRef.current = socket.id;
        const key = await importKey(data.roomKey);
        setRoomKey(key);
        setShowNameModal(true);
        setPendingNavigation({ roomId: data.roomId, socket: socket.id });
      } else {
        const errorData = await response.json();
        throw new Error(errorData || "Room creation unsuccessful");
      }
    } catch (err) {
      handleError({
        title: "Room Creation Error",
        message: "There was an error creating the room",
      });
    } finally {
      setLoadingState((prevState) => ({ ...prevState, createSession: false }));
    }
  };

  const handleInputChange = (e) => {
    setJoinSessionKey(e.target.value);
  };

  const handleInputSessionKey = async (e) => {
    e.preventDefault();
    if (!socket) return;

    try {
      setLoadingState((prevState) => ({ ...prevState, joinSession: true }));

      const response = await fetch(`${urlEndPoint}/chat/join-room`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: joinSessionKey,
          socketId: socket.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        roomIdRef.current = data.roomId;
        socketIdRef.current = socket.id;
        setLoadingState((prevState) => ({ ...prevState, joinSession: false }));
        setShowNameModal(true);

        setPendingNavigation({ roomId: data.roomId, socket: socket.id });
      } else {
        const errorData = await response.json();
        throw new Error(errorData || "error while joining the room");
      }
    } catch (err) {
      handleError({
        title: "Join Session Error",
        message: "There was an error joining the session",
      });
    } finally {
      setLoadingState((prevState) => ({ ...prevState, joinSession: false }));
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
              userName: name,
            },
          });
          setPendingNavigation(null);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData || "error adding the name");
      }
    } catch (err) {
      handleError({
        title: "Name Submission Error",
        message: "There was an error submitting the name",
      });
      setShowNameModal(false);
    }
  };
  const onSkip = () => {
    setShowNameModal(false);
    if (pendingNavigation) {
      navigate(`/chat/${pendingNavigation.roomId}`, {
        state: {
          roomId: pendingNavigation.roomId,
          socketId: pendingNavigation.socket,
          userName: null,
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
    setShowNameModal,
    loadingState,
    connectionState,
    roomKey,
    error,
    clearError: () => setError(null),
  };

  return (
    <socketContext.Provider value={value}>{children}</socketContext.Provider>
  );
};

export const useSocket = () => useContext(socketContext);
export default SocketContextAPI;
