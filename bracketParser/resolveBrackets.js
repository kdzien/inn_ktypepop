
"use strict";
const db = require('../db_connection.js')

function parseData(query,callback){
    const bracket_array = new Array();
    db.query(query,function(err,result){
        let html=''
        if(result.length===0){callback(bracket_array,"")}else{ html =  result[0].content || result[0].html_template}
        var start,end;
        for(let x =0; x<=html.length-1;x++){
            if(!checkOpenBracket(html[x-1]) && checkOpenBracket(html[x]) && checkOpenBracket(html[x+1]) && !checkOpenBracket(html[x+2]) ){
                start = x
            }
            else if(!checkCloseBracket(html[x-1]) && checkCloseBracket(html[x]) && checkCloseBracket(html[x+1]) && !checkCloseBracket(html[x+2]) ){
                end = x+2
                bracket_array.push(html.slice(start,end))
            }
            else if(html.length-1===x){
                callback(bracket_array,html)
            }
        }
    })
}

function checkOpenBracket(letter,letter1,letter2){
    return (letter==='[') ? true : false
}
function checkCloseBracket(letter){
    return (letter===']') ? true : false
}

function getBrackets(query,callback){
    parseData(query,(allBrackets,html)=>{
        const withoutDuplicates = allBrackets.filter(function(el,i) {
            return allBrackets.indexOf(el) == i;
        });
        callback(withoutDuplicates,html)
    })
}


module.exports.getBrackets=getBrackets;