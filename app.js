var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');


app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

var clients = {};
var clicked = [];

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on("join", function (name) {
        if (name && name != "null" && name.trim() != "") {
            console.log("Joined: " + name);
            clients[socket.id] = name;
            socket.emit("update-users", (clients));
            socket.emit("start-board", (clicked));
            socket.broadcast.emit("update-users", (clients))
        }
    });

    socket.on("send", function (msg) {
        console.log("Message: " + msg);
        let message = {};
        message.user = clients[socket.id];
        message.block = msg;
        clicked.push(msg);
        socket.broadcast.emit("update-board", (message));
    });

    socket.on("disconnect", function () {
        console.log("Disconnect");
        delete clients[socket.id];
        io.emit("update-users", (clients));
    });

});

server.listen(3000, () => {
    console.log('Server listening on :3000');
});


