import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const models = require('./models/userModel');


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

interface User {
    userName: string,
    userId: string
}

let userList: User[] = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', function (socket) {

    socket.on('join', (userName) => {
        console.log(userName + "has connected");
        let userId = socket.id;
        userList.push({ userName, userId });
        socket.emit('set id', userId);
        io.emit("send userList", userList);
    })

    socket.on('chat message', function (data) {
        const { receiverId, message, senderId } = data;
        const timeStamp = Date.now();
        socket.emit("new message", { senderId, message, timeStamp });
        socket.to(receiverId).emit("new message", { senderId, message, timeStamp });
    });

    socket.on('disconnect', () => {
        socket.disconnect();
        userList = userList.filter(user => user.userId != socket.id);
    })
});

server.listen(PORT, function () {
    console.log(`listening on *:${PORT}`);
});
