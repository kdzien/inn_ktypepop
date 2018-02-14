var db = require("./config/db_config")
var mysql = require('mysql');

var connection = mysql.createConnection(db.config)

connection.connect(function(err){
    if(err){
        console.log(err)
        return;
    }console.log("connected DB")
})


module.exports = connection;