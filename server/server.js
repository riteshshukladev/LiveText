import express from 'express';
import cors from "cors";
import http from "http"
import  initializeSocket  from "./service-worker/socketService.js";
import  connectDatabase  from "./config/database.js";
import dotenv from "dotenv"
import { createRoom, joinRoom } from "./controllers/roomController.js";
import setName from './service-worker/setName.js';


dotenv.config();
const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(express.json());

connectDatabase();

initializeSocket(server);


app.post('/chat/create-room', createRoom);
app.post('/chat/join-room', joinRoom);
app.post('/set-name', setName);

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// This is a test;



