import React, { useState } from "react";
import { useSocket } from "../Context/SocketContext";
import { X } from "lucide-react";

const NameModal = () => {
  const [name, setName] = useState("");
  const { handleNewNameSubmit, onSkip,setShowNameModal } = useSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNewNameSubmit(name);
  };

  const closeNameSubmitModal = (e) => {
    e.preventDefault();
    setShowNameModal(false);
  }

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center bg-black">
      <div className="bg-transparent relative flex flex-col gap-4 shadow-xl lg:py-64 px-8 text-white border	border-solid border-white rounded-2xl">
        <button
          onClick={closeNameSubmitModal}
          className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-lg"
        >
          <X size={20} />
        </button>

        <h2 className="font-comfortaa font-extralight pl-3 tracking-wide md:text-base">What you want to be called?</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name please"
            className=" lg:w-72 py-4 px-4 bg-transparent border border-solid border-white rounded-full font-comfortaa font-light md:text-sm"
          />
        </form>

        <button type="button underline decoration-blue-800 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#8A1947] after:transition-all capitalize" onClick={onSkip}>
            skip
          </button>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <button type="submit" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default NameModal;
