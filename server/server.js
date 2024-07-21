import express from 'express';
import { Server as socketIOServer } from 'socket.io';
import { createServer, METHODS } from 'http';


const port = 4001;
const app = express();
const server = createServer(app);
const io = new socketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});



server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});