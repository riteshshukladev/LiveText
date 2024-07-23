import express from 'express';
import cors from "cors";
import http from "http"
import { initializeSocket } from "./service-worker/socketService.js";
import { connectDatabase } from "./config/database.js";
import roomRouter from "./routes/roomRoutes.js"


const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDatabase();

initializeSocket(server);


app.use('/', roomRouter);

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



