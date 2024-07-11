
import { useSocket } from "./Context/SocketContext";


function App() {


  const socket = useSocket();

  
  return (
    <div>
      <button className="generate" onClick={socket.handleGenerateNewKey}>
        Create new Session
      </button>
      <div className="join-session">
        <form onSubmit={socket.handleInputSessionKey}>
          <input
            type="text"
            name="inpVal"
            id="inpVal"
            placeholder="Enter session key"
            value={socket.joinSessionKey}
            onChange={socket.handleInputChange}
          />
          <button type="submit">Join Session</button>
        </form>
      </div>
    </div>
  );
}

export default App;
