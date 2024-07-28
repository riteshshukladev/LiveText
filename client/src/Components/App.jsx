
import { useSocket } from "../Context/SocketContext";
import { Lock, Plus, LogIn } from 'lucide-react';



function App() {


  const socket = useSocket();

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-cyan-500/30">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8 text-center">Live Text</h1>
        
        <div className="space-y-6">
          <button 
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2"
            onClick={socket.handleGenerateNewKey}
          >
            <Plus size={20} />
            <span>Create New Session</span>
          </button>
          
          <form onSubmit={socket.handleInputSessionKey} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="inpVal"
                id="inpVal"
                placeholder="Enter session key"
                value={socket.joinSessionKey}
                onChange={socket.handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2"
            >
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
