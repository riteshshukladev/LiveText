import express from 'express';
import cors from "cors";
import http from "http"
import { initializeSocket } from "./service-worker/socketService";
import { connectDatabase } from "./config/database";



const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());


initializeSocket();

connectDatabase();



