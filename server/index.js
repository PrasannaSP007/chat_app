const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const port = process.env.PORT;
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin: ["https://chat-app-client-neon-eight.vercel.app/"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User ", socket.id, "Connected..");

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("User with ID ", socket.id,"joined room ", data);
    });

    socket.on("send_msg", (data) => {
        socket.to(data.room).emit("receive_msg", data);
    });

    socket.on("disconnect", () => {
        console.log("User ",socket.id, "Disconnected..");
    });
});

server.listen(port, () => {
    console.log("Server started..!");
})
