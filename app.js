import express from "express";

import { createServer } from "node:http";
import { Server } from "socket.io";

import fileDirName from './src/utils/file-dir-name.js';
const { __dirname } = fileDirName(import.meta);

const app = express();

const server = createServer(app);

const io = new Server(server);

const allMessages = [];

app.use(express.static(__dirname));


app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/src/utils/index.html');
  });

  io.on('connection', (socket) => {
    console.log('Usuario conectado');
  
    // Envia todos los mensajes anteriores al nuevo usuario
    socket.emit('chat-history', allMessages);
  
    socket.on('chat-msg', (msgData) => {
      console.log(msgData);
  
      allMessages.push(msgData);
  
      // Emite el nuevo mensaje a todos los clientes conectados
      io.emit('chat-msg', msgData);
    });
  
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });



server.listen(4000, () => {
  console.log("localhost:4000");
});