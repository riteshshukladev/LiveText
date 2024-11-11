import React, { useState } from "react";
import { useSocket } from "../Context/SocketContext";
import { X } from "lucide-react";

const NameModal = () => {
  const [name, setName] = useState("");
  const { handleNewNameSubmit, onSkip } = useSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNewNameSubmit(name);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
  <div className="relative bg-white p-6 rounded-lg shadow-xl">
    <button 
      onClick=''  // You'll need to add this handler
      className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 shadow-lg"
    >
      <X size={20} />
    </button>
    
    <h2>Enter Your Name</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Give yourself a nickname or something"
      />
    </form>
    <div>
      <button type="submit">Continue</button>
      &nbsp;&nbsp;
      <button type="button" onClick={onSkip}>Skip</button>
    </div>
  </div>
</div>
  );
};

export default NameModal;
