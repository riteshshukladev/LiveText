import React, { useState } from "react";
import { useSocket } from "../Context/SocketContext";

const NameModal = () => {


    const [name, setName] = useState("");
    const {handleNewNameSubmit, onSkip} = useSocket();
    

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        handleNewNameSubmit(name);
      };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-gray-800 p-5 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-white">Enter Your Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Give yourself a nickname or something"
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
    )
}

export default NameModal;