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