"use strict";
var db = require("../db_connection")
var fs = require('fs');
var convert = require('xml-js');
const replace = require('replace-async');
var jsonxml = require('jsontoxml');
var brackets = require("../bracketParser/setMap.js")
var loop_parser = require("../../loop_solver/script.js")


function parseData(urlx,callback) {
    let totalObject = []   
    db.query(`${urlx} limit 1`,(err,result)=>{
        callback(result)
    })
}

function getItemDesc (tq,vq,callback){
    parseData(tq,(res)=>{
        brackets.getDescription(vq,tq,(res)=>{
            loop_parser.solve(res,db).then(result=>{
                callback(result)
            })
        })
    })
}

module.exports.getItemDesc = getItemDesc