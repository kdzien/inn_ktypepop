"use strict";
const db = require('../db_connection.js')
let bracket_array = []
const replace = require('replace-async');

function parse(html,cb){

    resolveLoop(html,()=>{
        if(bracket_array.length===0){
            cb(html)
        }
        bracket_array.forEach((elem,i)=>{
            resolveLoopContent(elem,(obj)=>{
                generateContent(obj,body=>{
                    let ls=html.indexOf('<Loop ');
                    let le=html.indexOf('</Loop>');
                    html = html.slice(0,ls)+body+html.slice(le+7,html.length);
                        if(i==bracket_array.length-1){
                            cb(html)
                            bracket_array=[]
                        }
                })
            })
        })
    })

}

function resolveLoop(html,callback){
    let start,end;
    for(let x =0; x<=html.length-1;x++){
        if(html[x]==="<" && html[x+1]==="L" && html[x+2]==="o" && html[x+3]==="o" && html[x+4]==="p"){
            start = x
        }
        else if(html[x]==="<" && html[x+1]==="/" && html[x+2]==="L" && html[x+3]==="o" && html[x+4]==="o" && html[x+5]==="p" && html[x+6]===">"){
            end = x+7
            bracket_array.push({loop:html.slice(start,end),start:start,end:end})
        }
        else if(html.length-1===x){
            callback()
        }
    }
}

function cut(str, cutStart, cutEnd){
    return str.substr(0,cutStart) + str.substr(cutEnd+1);
}

function generateContent(loopObj,callback){
    const {sql,body,alias} = loopObj
    let fields = [],change_map=[];
    let temp_map;
    let finalBody = ""
    db.query(sql,(err,result,fieldss)=>{
        result.forEach((elemr,i)=>{
            temp_map = []
            fieldss.forEach(elemf=>{
                temp_map.push({co: new RegExp("\\[\\["+alias+'.'+elemf.name+"\\]\\]","g"), na_co:result[i][elemf.name]})
            })
            change_map.push(temp_map);
            temp_map=[]
        })
        var n =0;
        (function asyc(){
            if(n<=change_map.length-1){
                var nn = 0
                var temp = body.slice();
                (function asyc2(){
                    if(nn<=change_map[n].length-1){
                        replace(temp, change_map[n][nn].co , change_map[n][nn].na_co, (err, result) => {
                            temp = result;
                            nn++
                            asyc2()
                        })
                    }else{
                        finalBody+=temp
                        n++;
                        asyc()
                    }
                })()
            }else{
                callback(finalBody)
            }
        })()
    })
}

function resolveLoopContent(looop,cb){
    var loop = looop.loop
    var obj = {sql:"",alias:"",body:""}
    obj.sql = loop.substring(loop.lastIndexOf('sql="')+5,loop.indexOf('"',loop.lastIndexOf('sql="')+5));
    obj.alias = loop.substring(loop.lastIndexOf('alias="')+7,loop.indexOf('"',loop.lastIndexOf('alias="')+7));
    obj.body = loop.substring(loop.indexOf('>')+1,loop.indexOf('</Loop>',loop.indexOf('>')+1));
    cb(obj)
}
module.exports.parse=parse;
