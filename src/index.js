const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
    cors: {
      origin: "http://172.31.37.79:8080",
      methods: ["GET", "POST"]
    }
});
const router = express.Router();

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
router.put('/player_attributes',(req,res)=>{
    console.log(req.body)
    let id_player = req.body.id_player;
    let id_attributes = req.body.id_attributes;
    let new_data = req.body.new_data

    let date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    let update = 'UPDATE `playerss_attributes` '
    let set = ' SET `data` = ?,`last_modified` = ' + '\''+date+'\'' 
    let where = ' WHERE `playerss_attributes`.`id_playerss` = ? '
    let and = 'AND `playerss_attributes`.`id_attributes` = ? '
    let query = update+set+where+and
    console.log(id_player)
    console.log(id_attributes)
    console.log(new_data)

    console.log(query)
    pool.getConnection(function(err,connection){
        if (err) {
          callback(false);
          return;
        }
        for(let i = 0; i< id_attributes.length; i++){
            connection.query(query,[new_data[i], id_player,id_attributes[i]],function(err,rows){
                connection.release();
                if(!err) {
                    io.emit('player_attribute', [new_data[i],id_attributes[i]])                
                }
            });
            connection.on('error', function(err) {
                    io.emit('player_attribute_error', [new_data[i],id_attributes[i]])          
                    return;
            });


        }
        
        console.log('Antes del succes');
        res.json('Success');
       
    });
})

//Starting the server
http.listen(port, () => {
    console.log(`listening on port ${port} ...... `);
});