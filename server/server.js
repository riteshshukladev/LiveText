import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { randomInt } from "crypto";


const port = 4001;
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("generate_key", async () => {
    const randomInt = randomInt(10000, 100000);
    try {
      await query(
        "INSERT INTO sessionsmanager(session_key,socket_ids) VALUES($1, $2)"[
        (key, [socket.id])
        ]
      );
      // reversal
      socket.join(key);
      socket.emit("key_generated", key);
      console.log(`Session key generated and joined: ${key}`);
    } catch (err) {
      console.error("Error generating key:", err);
    }
  });

  socket.on("disconnect", async () => {
    try {
      await query('UPDATE sessionsmanager SET socket_ids = array_remove(socket_ids, $1) WHERE $1 = ANY(socket_ids)', [socket.id]);
      await query('DELETE FROM sessionsmanager WHERE array_length(socket_ids, 1) IS NULL');
    }
    catch (err) {
      console.error('Error updating sessions on disconnect:', err);
    }
  });

  socket.on('join_session', async (key) => {
    try {
      const { rows } = await query('SELECT socket_ids FROM sessionsmanager WHERE session_key = $1', [key]);
      
      if (rows.length > 0 && !rows[0].socket_ids.includes(socket.id)) {
        await query('UPDATE sessionsmanager SET socket_ids = array_append(socket_ids, $1) WHERE session_key = $2', [socket.id, key]);
        socket.join(key);
        socket.emit('join_success', key);
        console.log(`Socket ${socket.id} joined session: ${key}`);
      }
    }
    catch (err) {
      console.error('Error joining session:', err);
    }
  })
  
});
