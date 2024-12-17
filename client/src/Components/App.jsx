import { useState } from "react";
import { useSocket } from "../Context/SocketContext";
import { Lock, Plus, LogIn } from "lucide-react";
import NameModal from "../Modal/NameModal";

function App() {
  const socket = useSocket();

  if (socket.showNameModal) {
    return <NameModal />;
  }

  // Otherwise render the main UI
  return (
    <div class="screen">
      <div class="base-background"></div>
      <div class="background relative overflow-hidden"></div>

      
      <div className="absolute bottom-0 w-full h-[40vh] wave-1" />
      <div className="absolute bottom-0 w-full h-[30vh] wave-2" />
      <div className="absolute bottom-0 w-full h-[20vh] wave-3" />
      <div className="absolute bottom-0 w-full h-[10vh] wave-4" />

      <div>
        <h1>Live Text</h1>

        <div>
          <button onClick={socket.handleGenerateNewKey}>
            <Plus size={20} />
            <span>Create New Session</span>
          </button>

          <form onSubmit={socket.handleInputSessionKey}>
            <div>
              <input
                type="text"
                name="inpVal"
                id="inpVal"
                placeholder="Enter session key"
                value={socket.joinSessionKey}
                onChange={socket.handleInputChange}
              />
              <Lock size={20} />
            </div>

            <button type="submit">
              <LogIn size={20} />
              <span>Join Session</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
