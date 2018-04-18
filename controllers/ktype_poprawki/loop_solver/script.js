const mysql = require('mysql');
const db_config = require("./db_config.js");
let Loop = require("./class/Loop.js")

function solve (html,con){
    return new Promise((resolve,reject)=>{
        (function asyc(){
            if(html.indexOf("<Loop")!==-1){
                getLoop(html)
                .then((loop) =>resolveLoopContent(loop)).then(obj=>{
                    obj.resolveLoop(con,(result)=>{
                        html = html.substring(0,result.start) + result.body + html.substring(result.end+7,html.length)
                        asyc();
                    });
               }).catch(err=>{
                    throw new Error(err)
                })
            }else{
                resolve(html)
            }
        })()
    })
}


function getLoop(html){
    return new Promise((resolve,reject)=>{
        let loop = {start:0,end:0}
        loop.start = html.indexOf("<Loop")
        var isAnother = 0;
        loop.end = 0;
        for(let i=loop.start+5;i<=html.length-1;i++){
            if(html[i]==="<" && html[i+1]==="L" && html[i+2]==="o" && html[i+3]==="o" && html[i+4]==="p"){
                isAnother++
            }
            else if (html[i]==="<" && html[i+1]==="/" && html[i+2]==="L" && html[i+3]==="o" && html[i+4]==="o" && html[i+5]==="p"){
                if(isAnother===0){
                    loop.end=i;
                    var obj = {loop:html.substring(loop.start,loop.end+7),start:loop.start,end:loop.end}
                    resolve(obj)
                    break;
                }else{
                    isAnother--
                }
            }
        }
    })
}

function resolveLoopContent(obj){
    return new Promise((resolve,reject)=>{
        loop = obj.loop;
        let sql,alias,body;
        sql = loop.substring(loop.indexOf('sql="')+5,loop.indexOf('"',loop.indexOf('sql="')+5));
        alias = loop.substring(loop.indexOf('alias="')+7,loop.indexOf('"',loop.indexOf('alias="')+7));
        let alias_start = loop.indexOf('alias="')
        let temp = loop.substring(alias_start,loop.lastIndexOf('</Loop>'))
        let end = temp.indexOf('>');

        body = loop.substring(alias_start+end+1,loop.lastIndexOf('</Loop>'));
        let temp_loop = new Loop(sql,alias,body,obj.start,obj.end)
        resolve(temp_loop)
    })
}

module.exports.solve= solve;