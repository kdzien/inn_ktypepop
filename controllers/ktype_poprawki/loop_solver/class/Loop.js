const mysql = require('mysql');
const db_config = require("../db_config.js");
const replace = require('replace-async');

class Loop {
    constructor(sql,alias,body,cutStart,cutEnd){
        this.sql=sql;
        this.alias=alias;
        this.body=body;
        this.cutStart=cutStart;
        this.cutEnd=cutEnd;
    }
    getSql(){
        return this.sql;
    }
    getAlias(){
        return this.alias;
    }
    getBody(){
        return this.body;
    }
    resolveLoop(con,callback){
        let cutEnd = this.cutEnd;
        let cutStart = this.cutStart;
        let sql=this.sql,body=this.body,alias=this.alias;
        let fields = [],change_map=[];
        let temp_map;
        let finalBody = ""
        con.connect(function(err){
            con.query(sql,(err,result,fieldss)=>{
                result.forEach((elemr,i)=>{
                    temp_map = []
                    fieldss.forEach(elemf=>{
                        if(result[i][elemf.name]===null){
                            temp_map.push({co: new RegExp("\\[\\["+alias+'.'+elemf.name+"\\]\\]","g"), na_co:''})   
                        }else{
                            temp_map.push({co: new RegExp("\\[\\["+alias+'.'+elemf.name+"\\]\\]","g"), na_co:result[i][elemf.name]})
                        }
                        
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
                        callback({body:finalBody,start:cutStart,end:cutEnd})
                    }
                })()
            })
        })
    }
}

module.exports = Loop;