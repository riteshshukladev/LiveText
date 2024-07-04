import { useState } from "react";
import {io} from "socket.io-client"

function App() {
  const [joinSessionKey, setJoinSessionKey] = useState("");
  const socket = io('http://localhost:4001');

  const handleInputChange = (e) => {
    setJoinSessionKey(e.target.value);
  }

  const handleInputSessionKey = (e) => {
    e.preventDefault();
    // Validate the Input key from the backend if true, allow to join the session else throw error
    const sessionKey = joinSessionKey;
  }

  const handleGenerateNewKey = () => {
    // validate if the session is created from the backenc and then route the user to tbhat specified room . else throw error
  }
  return (
    <div>
      <button className="generate" onClick={handleGenerateNewKey}>Create new Session</button>
      <div className="join-session">
        <form onSubmit={handleInputSessionKey}>
          <input
            type="text"
            name="inpVal"
            id="inpVal"
            placeholder="Enter session key"
            value={joinSessionKey}
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}

export default App;
