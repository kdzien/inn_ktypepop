
"use strict";
const brackets = require('./resolveBrackets.js')
const replace = require('replace-async');

function getDescription (view_query,template_query,con,callback,errorcallback){
    brackets.getBrackets(con,template_query,(bracketArray,html)=>{
        con.query(view_query,(err,result,fieldss)=>{
            let fields = [];
            let change_map = []
            fieldss.forEach(elem=>{
                fields.push('[['+elem.name+']]');
                if(result[0][elem.name]==null){result[0][elem.name]=''}
                change_map.push({co: new RegExp("\\[\\["+elem.name+"\\]\\]","g"), na_co:result[0][elem.name]})
            })
            equalArrays(bracketArray,fields,()=>{
                var n=0;
                (function asyc(){
                    if(n<=change_map.length-1){
                        replace(html, change_map[n].co , change_map[n].na_co, (err, result) => {
                            html = result;
                            n++
                            asyc()
                        })   
                    }
                    else{
                        callback(html)
                    }
                })()    
            },(error)=>{
                errorcallback(error)
            })
        })
    })
}

function equalArrays(first,second,callback,callbackerror){
    let errors = [];
    for( const elem of first ){
        let exist = false;
        for( const elem2 of second ){
            if(elem===elem2){exist=true}
        } 
        if(exist===false && elem.indexOf('.')===-1){errors.push(elem)}
    }
    if(errors.length!==0){callbackerror(`brak nastepujacych pol w zapytaniu ${errors.join(',')}`)}
    else{callback()}
}

module.exports.getDescription = getDescription;