const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
      origin: "http://172.31.37.79:8080",
      methods: ["GET", "POST"]
    }
});

var bodyParse =require('body-parser');
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));
//Settings
const port = process.env.PORT || 3002;

//Middlewares
app.use(express.json());



//Routes
app.use(require('./routes/Initial_Requests'))

let users = [];
let messages = [];
let index = 0
io.on("connection", socket => {
	socket.emit('loggedIn', {
		users: users.map(s => s.username),
		messages: messages
	});

	socket.on('newuser', username => {
		console.log(`${username} has arrived at the party.`);
		socket.username = username;
		
		users.push(socket);

		io.emit('userOnline', socket.username);
	});

	socket.on('msg', msg => {
		let message = {
			username: socket.username,
            msg: msg,
            index:index
        }
        messages.push(message);

        io.emit('msg', message);
        index++
	});
	
	// Disconnect
	socket.on("disconnect", () => {
		console.log(`${socket.username} has left the party.`);
		io.emit("userLeft", socket.username);
		users.splice(users.indexOf(socket), 1);
	});
});
//Starting the server
http.listen(port, () => {
    console.log(`listening on port ${port} ...... `);
});