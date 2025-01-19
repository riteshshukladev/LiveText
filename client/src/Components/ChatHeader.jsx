import React from "react";
import shareSvg from "../assets/svg/share.svg";
import closeSvg from "../assets/svg/close.svg";
import ShareModal from "../Modal/ShareModal";
import {useState} from 'react'

const ChatHeader = ({
  roomId,
  socketId,
  usersList,
  isDropdownOpen,
  setIsDropdownOpen,
  handleLeaveRoom,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <header className="w-full px-12 py-6 border-b border-white flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-4">
        <p className="text-white font-comfortaa text-sm">
          Room Key : <span className="text-[#E6FAC6]">{roomId}</span>
        </p>
        <img
          src={shareSvg}
          alt="Share"
          onClick={() => setShowShareModal(true)}
          className="cursor-pointer"
        />

        {showShareModal && (
          <ShareModal
            roomId={roomId}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </div>

      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <div className="relative userlists">
            {/* Current user pill - always visible */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="bg-[#0D0D0D] text-white p-2.5 rounded-xl text-sm font-comfortaa w-52 text-center border border-[#151515]">
                {usersList
                  .find((user) => user.id === socketId)
                  ?.displayName.slice(0, 15) || "You"}
              </span>
              <span className="text-[#5EFE58] text-xs">
                {usersList.length > 1 ? `+${usersList.length - 1}` : ""}
              </span>
            </div>

            {/* Dropdown for other users */}
            {isDropdownOpen && (
              <div className="absolute top-full w-52 p-2.5 rounded-lg shadow-xl z-50 text-center bg-[#0D0D0D] border border-[#151515] mt-2 mb-1">
                {usersList
                  .filter((user) => user.id !== socketId)
                  .map((user, index) => (
                    <div
                      key={user.id}
                      className={`
                        text-sm font-comfortaa text-white/80 
                        py-2 hover:text-white transition-colors
                        ${index !== 0 ? "border-t border-[#151515]" : ""}
                      `}
                    >
                      {user.displayName.length > 15
                        ? `${user.displayName.slice(0, 15)}...`
                        : user.displayName}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <img
          src={closeSvg}
          alt="Close"
          onClick={handleLeaveRoom}
          className="cursor-pointer"
        />
      </div>
    </header>
  );
};

export default ChatHeader;
