const express = require('express');
const router = express.Router();

var http = require('http');
const mysqlConnection = require('../database');

// PARA ESTE MICROSERVICIO SE NECESITA INGRESAR LOS DATOS DE LA SIGUIENTE MANERA:
/* Ejemplo de Json del Body para el POST
    {
    "id_player": 2,
    "nameat": "Resistencia",
    "namecategory": "Físico",
    "data": 1,
    "data_type": "in.off",
    "input_source": "xlr8_podometer",
    "date_time": "2019-05-16 13:17:17"
    }
*/

/*
Input: Name, pass and age of that player
Output: Void (Edits an existing player in the db)
Description: Simple MYSQL query
*/
//Con id en 0 se ingresa un nuevo jugador, con cualquier otro id se edita el existente
router.put('/attributes/bycategory/:id/:type',(req,res)=>{
    console.log("entro en el PUT");
    var post_data = req.body;
    if(!req.body.id_player || !req.body.data){
        return res.sendStatus(400).json({
            error: 'Missing data'
          })
    }
    console.log(post_data);
    var id_player = Number(post_data.id_player);
    var namecategory = post_data.namecategory;
    var data = Number(post_data.data);
    const query = 'UPDATE attributes SET data = ? WHERE attributes.name = ? AND attributes.players_id_players = ?'       
    mysqlConnection.query(query,[data,namecategory,id_player],(err,rows,fields) =>{
        if(!err){
            res.json({Status:'Player s attribute update SUCCESSFUL'});
            console.log("Lo logró");
            
        } else {
            res.json({Status:'ERROR: Attribute Update'});
            console.log(err);
        }
    })

})


/*
var adquired_subattributes ={  
        "id_player": id_player,        Ej: 1
        "id_sensor_endpoint": id_sensor_endpoint, Ej: 1
        "id_conversion": id_conversions,   Ej [3,4]
        "id_subattributes":id_subattributes, Ej [5,5]
        "new_data": results, Ej [4,5] Son puntos
    }
*/

router.post('/adquired_subattribute/', (req,res,next)=>{
    var adquired_subattribute = req.body;
    var id_player = adquired_subattribute.id_player
    var id_sensor_endpoint = adquired_subattribute.id_sensor_endpoint
    var id_conversions = adquired_subattribute.id_conversions
    var id_subattributes = adquired_subattribute.id_subattributes
    var new_data = adquired_subattribute.new_data

    if(!id_player || !id_sensor_endpoint|| !id_conversions|| !id_subattributes|| !new_data){
        return res.sendStatus(400)
    }
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var insertInto = 'INSERT INTO `adquired_subattribute` (`id_players`,`id_sensor_endpoint`,`id_conversion`,`id_subattributes`,`data`,`created_time`) VALUES'
    var values = '(?,?,?,?,?,'+ '\''+date +'\''+')'
    var query = insertInto+values
    for(let i = 0; i< id_conversions.length; i++){
        mysqlConnection.query(query,[id_player,id_sensor_endpoint,id_conversions[i], id_subattributes[i], new_data[i]], function(err2,rows2,fields2){
            if (!err2){
                console.log('Antes del succes');
                res.json('Success');
            } else {
                console.log(err2);
                res.json('Error in add')
            }
        });
    }
  
        
});

/*
Input: 
var dataChanges ={  
        "id_player":  1
        "id_attributes": [3,4] //Ej: id_attributes = , distintos
        "new_data": [20,34]
    }
data = [20,10]
Description: Simple MYSQL query
*/
router.put('/player_attributes',(req,res)=>{
    let id_player = req.body.id_player;
    let id_attributes = req.body.id_attributes;
    let new_data = req.body.new_data

    let date = new Date().toISOString().slice(0, 19).replace('T', ' ')

    let update = 'UPDATE `playerss_attributes`'
    let set = ' SET `data` = ?,`last_modified` = ' + '\''+date+'\'' 
    let where = 'WHERE playerss_attributes.id_players = ?'
    let and = 'AND playerss_attributes.id_attributes = ? '
    let query = update+set+where+and

    for(let i = 0; i< id_attributes.length; i++){
        mysqlConnection.query(query,[new_data[i], id_player,id_attributes[i]], function(err2,rows2,fields2){
            if (!err2){
                console.log('Antes del succes');
                res.json('Success');
            } else {
                console.log(err);
                res.json('Error in add')
            }
        });
    }
})



/*
Input: Json of sensor data
Output: Void (Just stores the json in the database)
Description: Simple MYSQL query
*/
router.post('/attributes/', (req,res,next)=>{
    console.log("asdasdasdasdasdsa");
    var post_data = req.body;
    console.log(post_data);
    console.log("asdasdasdasdasdsa");
    if(!req.body.id_player || !req.body.id_player|| !req.body.nameat|| !req.body.namecategory|| !req.body.data|| !req.body.data_type|| !req.body.input_source|| !req.body.date_time){
        return res.sendStatus(400).json({
            error: 'Missing data'
          })
    }
    console.log(post_data);
    var id_player = Number(post_data.id_player);
    var nameat = post_data.nameat;
    var namecategory = post_data.namecategory;
    var data = Number(post_data.data);
    var data_type = post_data.data_type;
    var input_source = post_data.input_source;
    var date_time = post_data.date_time;

    
    console.log('casienelquery');
    try {mysqlConnection.query('SELECT*FROM `attributes` where players_id_players=? AND name =?',[id_player,namecategory], function(err,rows,fields){
        console.log('CASI EN EL IF',!err);
        if(!err){
            
            var attributes_id_attributes = rows[0].id_attributes
            console.log('ENTRO EN EL IF')   ;
            console.log(attributes_id_attributes);
            mysqlConnection.query('INSERT INTO `subattributes` (`nameat`,`namecategory`,`data`,`data_type`,`input_source`,`date_time`,`attributes_id_attributes`)VALUES (?,?,?,?,?,?,?)',[nameat,namecategory,data,data_type,input_source,date_time,attributes_id_attributes], function(err2,rows2,fields2){
                if (!err2){
                    console.log('Antes del succes');
                    res.json('Success');
                } else {
                    console.log(err);
                    res.json('Error in add')
                }
            });
        } else {
            console.log(err);
            res.json('The player does not exist');
        }
        
    });
    } catch(ex) {
        callback(new Error('something bad happened'));
    }

})

module.exports = router;

// A TODOS LOS JUGADORES QUE SE AGREGUEN A LA TABLA JUGADORES, DEBE AGREGARSE TODOS LOS ATRIBUTOS POSIBLES QUE ESTEN EN LA LISTA DE ATRIBUTOS INICIALIZADOS EN 0