import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SocketContextAPI from './Context/SocketContext.jsx'
import ChatPage from "./ChatPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <SocketContextAPI>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat/:roomId" element={<ChatPage/>}/>
      </Routes>
    </SocketContextAPI>
  </BrowserRouter>
);
