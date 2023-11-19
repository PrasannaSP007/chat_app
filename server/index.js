const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

// const port = process.env.PORT;
// const { Server } = require("socket.io") (http, {
//   cors : {
//     origin : "*",
//     methods: ['GET','HEAD','PUT','PATCH','POST','DELETE']
//   }
// });

// const corsOptions = {
//   origin: "*",
//   methods: ['GET','HEAD','PUT','PATCH','POST','DELETE']
// };

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin: "*",
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

// app.get("/", (req, res) => {
//     res.json("Hello");
// });

server.listen(8080, () => {
    console.log("Server started..!");
})
