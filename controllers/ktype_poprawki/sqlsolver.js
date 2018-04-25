"use strict";
var brackets = require("./bracketParser/script.js")
var loop_parser = require("./loop_solver/script.js")


function parseData(db,urlx,callback) {
    let totalObject = []   
    db.query(`${urlx} limit 1`,(err,result)=>{
        callback(result)
    })
}

function solve (db,tq,vq,callback,errorcallback){
    try{
        parseData(db,tq,(res)=>{
            brackets.getDescription(vq,tq,db,(res)=>{
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