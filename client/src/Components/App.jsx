import { useState } from "react";
import { useSocket } from "../Context/SocketContext";
import { Lock, Plus, LogIn } from "lucide-react";
import NameModal from "../Modal/NameModal";
import LandingPage from "./landing-page/LandingPage";

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

      <div className="absolute bottom-0 w-full h-[25vh] wave-1" />
      <div className="absolute bottom-0 w-full h-[20vh] wave-2" />
      <div className="absolute bottom-0 w-full h-[15vh] wave-3" />
      <div className="absolute bottom-0 w-full h-[7vh] wave-4" />
      <LandingPage />
    </div>
  );
}

export default App;
