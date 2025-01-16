import { useEffect, useState } from "react";
import { useSocket } from "../Context/SocketContext";
import NameModal from "../Modal/NameModal";
import LandingPage from "./landing-page/LandingPage";
import Background from "./layout/Background";
import liveTextLogo from "../assets/logo/live-text-logo-4.svg";
import ErrorModal from "../Modal/ErrorModal";

function App() {
  const socket = useSocket();
  const [isHovered, setIsHovered] = useState(false);
  const { loadingState, error, clearError } = useSocket();

  useEffect(() => {
    if (!socket.connectionState.connected || socket.connectionState.error) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  }, [socket.connectionState.connected, socket.connectionState.error]);

  const isLoading = loadingState.createSession || loadingState.joinSession;

  return (
    <Background isLoading={isLoading}>
      {error && <ErrorModal error={error} clearError={clearError} />}

      
      {/* Network connection indicator */}
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

      {/* logo */}

      <img
        className="text-white font-comfortaa font-medium max-w-[110px] absolute top-4	 left-[2%]"
        src={liveTextLogo}
        alt="logo"
      />

      {socket.showNameModal ? <NameModal /> : <LandingPage />}
    </Background>
  );
}

export default App;
