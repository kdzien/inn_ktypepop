var db = require("../config/db_config")
var mysql = require('mysql');

var sqlStartConnection = function sqlStartConnection() {
    return new Promise((resolve,reject)=>{
        var connection = mysql.createConnection(db.config);

        connection.connect(function(err) {
            if (err !== null) {
                reject("[MYSQL] Error connecting to mysql:" + err+'\n');
            }else{
                resolve(connection)
            }
        });
    })
}

var sqlEndConnection = function sqlEndConnection(connection,callback){
        connection.end(()=>{
            callback()
        }); 
}

module.exports.sqlStartConnection = sqlStartConnection;
module.exports.sqlEndConnection = sqlEndConnection;