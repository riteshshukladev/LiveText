import { useSocket } from "../../Context/SocketContext";
import { Lock, Plus, LogIn } from "lucide-react";
import NameModal from "../../Modal/NameModal";
import { HashLoader } from "react-spinners";
import { useEffect } from "react";

function LandingPage() {
  const socket = useSocket();

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-white font-comfortaa font-medium">Live Text</h1>

      <div className="flex flex-col gap-4 items-center">
        {/* Create New Session Button */}
        <div className="flex flex-col align-center justify-center gap-2 w-full sm:w-auto">
          <button
            onClick={socket.handleGenerateNewKey}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200 w-full sm:w-auto"
          >
            {socket.loadingState.createSession ? (
              <HashLoader
                size={20}
                color="#6366F1"
                loading={socket.loadingState}
              />
            ) : (
              <span className="font-medium">Create New Session</span>
            )}
          </button>
        </div>

        {/* Join Session Form */}
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
              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all duration-200"
            />
            <Lock
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Join Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            
            {socket.loadingState.joinSession ? (
              <HashLoader
                size={20}
                color="#6366F1"
                loading={socket.loadingState}
              />
            ) : (
              <span className="font-medium">Join Session</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LandingPage;
