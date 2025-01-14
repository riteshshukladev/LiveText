import { useSocket } from "../../Context/SocketContext";
import { Lock, Plus, LogIn } from "lucide-react";
import NameModal from "../../Modal/NameModal";
import { HashLoader } from "react-spinners";
import { useEffect } from "react";
// import liveTextLogo from "../../assets/logo/live-text-logo-2.svg";


function LandingPage() {
  const socket = useSocket();

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      {/* <h1 className="text-white font-comfortaa font-medium">Live Text</h1> */}
      {/* <img className="text-white font-comfortaa font-medium max-w-[110px]" src={liveTextLogo} alt="logo"></img> */}


      <div className="flex flex-col gap-2 items-center">
        {/* Create New Session Button */}
        <div className="flex flex-col align-center justify-center gap-2 w-full sm:w-auto">
          <button
            onClick={socket.handleGenerateNewKey}
            className="flex items-center gap-2 w-fit text-white font-extralight font-comfortaa pb-px border-b border-white"
          >
            {socket.loadingState.createSession ? (
              <HashLoader
                size={20}
                color="#6366F1"
                loading={socket.loadingState}
              />
            ) : (
              <span className="font-medium">New Chat</span>
            )}
          </button>
        </div>

        {/* Join Session Form */}
        <span className="text-white"> or </span>
        <form
          onSubmit={socket.handleInputSessionKey}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          {/* Input Container */}
          <div className="relative flex-1">
            <input
              type="text"
              name="inpVal"
              id="inpVal"
              placeholder="Enter session key"
              value={socket.joinSessionKey}
              onChange={socket.handleInputChange}
              className="py-2 bg-transparent border-b border-white w-fit focus:outline-none text-white placeholder:text-center font-comfortaa placeholder:font-comfortaa text-center"
            />
            {/* <Lock
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            /> */}
          </div>

          {/* Join Button */}
          <button
            type="submit"
            className="flex items-center gap-2 w-fit text-white font-extralight font-comfortaa pb-px border-b border-white"
          >
            
            {socket.loadingState.joinSession ? (
              <HashLoader
                size={20}
                color="#6366F1"
                loading={socket.loadingState}
              />
            ) : (
              <span className="font-medium">Join Chat</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LandingPage;
