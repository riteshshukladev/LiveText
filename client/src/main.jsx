import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import socketContextAPI from './Context/SocketContext.jsx'
import chatPage from "./ChatPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <socketContextAPI>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<chatPage/>}/>
      </Routes>
    </socketContextAPI>
  </BrowserRouter>
);
