import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [joinSessionKey, setJoinSessionKey] = useState("");
  const socket = io("http://localhost:4001");


  useEffect(() => {
    const handleNewKeyGenerateSuccess = (obj) => {
      try {
        if (obj.isSuccess) {
          navigate("/chat", {
            state: { SocketId: obj.socketId, roomId: obj.roomId },
          });
        } else {
          console.log("Error while creating the session");
        }
      } catch (err) {
        console.error(err);
      }
    };

    socket.on("newKeyGenerateSucces", handleNewKeyGenerateSuccess);

    return () => {
      socket.off("newKeyGenerateSucces", handleNewKeyGenerateSuccess)
    }
  }, [socket, navigate]);


  useEffect(() => {
    const handleAlreadyGeneratedKeySuccess = (obj) => {
      try {
        if (obj.isSuccess) {
          navigate("/chat", {
            state:{Socketid:obj.SocketId, roomId:obj.roomId}
          })
        }
        else {
          console.log("Couldn't Enter the session");
        }
      }
      catch (e) {
        console.error(e);
      }
    }

    socket.on("joinAlreadyGeneratedSessionSuccess", handleAlreadyGeneratedKeySuccess);


    return () => {
      socket.off("joinAlreadyGeneratedSessionSuccess", handleAlreadyGeneratedKeySuccess);
    }
  },[socket,navigate])
   
  const handleGenerateNewKey = () => {
    socket.on("connect", () => {
      socket.emit("generateNewSession");
   })
  };

  
  const handleInputChange = (e) => {
    setJoinSessionKey(e.target.value);
  };

  const handleInputSessionKey = (e) => {
    e.preventDefault();
    socket.on("connect", () => {
      socket.emit("joinAlreadyGeneratedSession", joinSessionKey);
   })
  };

 
  return (
    <div>
      <button className="generate" onClick={handleGenerateNewKey}>
        Create new Session
      </button>
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
          <button type="submit">Join Session</button>
        </form>
      </div>
    </div>
  );
}

export default App;
