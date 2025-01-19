import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../Context/SocketContext";
import { encryptMessage, decryptMessage } from "../utils/crypto";
import ChatBackground from "./layout/ChatBackground";
import ChatHeader from "./ChatHeader";

const ChatPage = () => {
  const { socket, roomKey } = useSocket();
  const location = useLocation();
  const { roomId, socketId, userName } = location.state;
  const [msgIndividual, setMsgIndividual] = useState("");
  const [allMessages, setAllMessages] = useState({});
  const [usersList, setUsersList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", { roomId, socketId });

      const handleRoomUsers = ({ users }) => {
        console.log("Received users:", users);
        setUsersList(users);
      };

      socket.on("roomUsers", handleRoomUsers);

      const handleBeforeUnload = () => {
        socket.emit("leaveRoom", { roomId, socketId });
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        socket.emit("leaveRoom", { roomId, socketId });
        window.removeEventListener("beforeunload", handleBeforeUnload);
        socket.off("roomUsers", handleRoomUsers);
      };
    }
  }, [socket, roomId, socketId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative userlists")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        console.error("❌ Error processing message:", error);
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
      console.log("⚠️ Cannot send message:", {
        socketAvailable: !!socket,
        keyAvailable: !!roomKey,
        messageAvailable: !!value.trim(),
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
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (usersList.length > 0) {
      console.log("Current users in room:", usersList);
    }
  }, [usersList]);

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", { roomId, socketId });
    window.history.back();
  };

  return (
    <ChatBackground>
      <div className="min-h-screen">
        <ChatHeader
          roomId={roomId}
          socketId={socketId}
          usersList={usersList}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          handleLeaveRoom={handleLeaveRoom}
        />
        

        <div className="flex flex-col h-[calc(100vh-88px)]">
          {" "}
          {/* 88px is header height */}
          <div className="flex-grow overflow-y-auto px-12 py-6">
            <div className="flex flex-col gap-2">
              {Object.entries(allMessages).map(([senderIdentity, msgs]) => (
                <div
                  key={senderIdentity}
                  className="bg-[#373737] p-3 rounded-full flex gap-1 items-baseline w-fit transition-all duration-300 ease-in-out animate-message-in"
                >
                  <p className="text-[#9F9F9F] font-comfortaa font-medium tracking-wide whitespace-nowrap">
                    {senderIdentity === socketId ? "You" : senderIdentity} :
                  </p>
                  {msgs.map((m, index) => (
                    <p
                      key={index}
                      className="text-white font-comfortaa font-medium text-center tracking-normal break-words max-w-[60vw]"
                    >
                      {m}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Input fixed at bottom */}
          <div className="pb-4 px-8">
            <input
              type="text"
              onChange={handleInputChange}
              value={msgIndividual}
              placeholder="You can type your message in here!!"
              className="w-full px-1 py-1 bg-transparent border-b text-white outline-none font-normal font-comfortaa"
            />
          </div>
        </div>
      </div>
    </ChatBackground>
  );
};

export default ChatPage;
