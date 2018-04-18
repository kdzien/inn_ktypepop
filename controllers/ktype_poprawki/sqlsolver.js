"use strict";
var db = require("./db_connection")
var brackets = require("./bracketParser/script.js")
var loop_parser = require("./loop_solver/script.js")


function parseData(urlx,callback) {
    let totalObject = []   
    db.query(`${urlx} limit 1`,(err,result)=>{
        callback(result)
    })
}

function solve (tq,vq,callback,errorcallback){
    try{
        parseData(tq,(res)=>{
            brackets.getDescription(vq,tq,(res)=>{
                loop_parser.solve(res,db).then(result=>{
                    callback(result)
                })
            },(error)=>{
                errorcallback(error)
            })
        })
    }catch(err){
        callback(err)
    }
}

module.exports.solve = solve