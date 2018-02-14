"use strict"
var db = require("../../db_connection")

class AppData{
    constructor(app_data){
        this.app_data=app_data
    }
    getEncoded(callback){
        var querys = `SELECT ebay_api_calls.szyfr_encode('${this.app_data}', 30) as encoded_app_data;`
        var temp_encoded=""
        db.query(querys,(err,result)=>{
            result.forEach(element => {
                temp_encoded+=`<ApplicationData>$${element.encoded_app_data}</ApplicationData>`
            });
            callback(temp_encoded)
        })
    }
    toString(){
        this.getEncoded((encoded)=>{
            // return encoded;
            return this.app_data
        })
    }
}

module.exports = AppData