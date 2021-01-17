const express = require("express");
const app = express();
var bodyParse =require('body-parser');
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}));
//Settings
const port = process.env.PORT || 3002;

//Middlewares
app.use(express.json());

//Routes
app.use(require('./routes/Initial_Requests'))

//Starting the server
const server = app.listen(port, () => {
 console.log(`listening on port ${port} ...... `);
});

module.exports = server;