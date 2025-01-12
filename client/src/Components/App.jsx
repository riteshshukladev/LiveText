import { useEffect, useState } from "react";
import { useSocket } from "../Context/SocketContext";
import { Lock, Plus, LogIn } from "lucide-react";
import NameModal from "../Modal/NameModal";
import LandingPage from "./landing-page/LandingPage";

function App() {
  const socket = useSocket();
  const [isHovered, setIsHovered] = useState(false);
  const { loadingState } = useSocket();

  useEffect(() => {
    if (!socket.connectionState.connected || socket.connectionState.error) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, [socket.connectionState.connected, socket.connectionState.error]);

  const isLoading = loadingState.createSession || loadingState.joinSession;

  if (socket.showNameModal) {
    return <NameModal />;
  }
  // Otherwise render the main UI
  return (
    <div className="screen relative">
      <span
        className={
          socket.connectionState.connected
            ? "absolute top-4 right-4 bg-green-500 text-white px-1 py-1 rounded-full"
            : "absolute top-4 right-4 bg-red-500 text-white px-1 py-1 rounded-full"
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <div className="absolute top-8 right-4 bg-white text-black p-2 rounded-lg shadow-lg w-fit whitespace-nowrap">
            {socket.connectionState.connected
              ? "We're connected and ready to go!"
              : "we're using free hosting services, please wait..."}
          </div>
        )}
      </span>
      <div className="base-background"></div>
      <div className="background relative overflow-hidden"></div>

      <div
        className={`absolute bottom-0 w-full h-[25vh] wave-1 ${
          isLoading ? "loading" : ""
        }`}
      />
      <div
        className={`absolute bottom-0 w-full h-[20vh] wave-2 ${
          isLoading ? "loading" : ""
        }`}
      />
      <div
        className={`absolute bottom-0 w-full h-[15vh] wave-3 ${
          isLoading ? "loading" : ""
        }`}
      />
      <div
        className={`absolute bottom-0 w-full h-[7vh] wave-4 ${
          isLoading ? "loading" : ""
        }`}
      />
      <LandingPage />
    </div>
  );
}

export default App;
