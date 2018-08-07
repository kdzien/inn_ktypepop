
"use strict";

function parseData(con,query,callback){
    const bracket_array = new Array();
    con.query(query,function(err,result){
        if(err){
            throw new Error(err)
        }else{
            let html=''
        if(result.length===0){callback(bracket_array,"")}else{ html =  result[0].content || result[0].html_template || result[0].xml_template}
        var start=0,end=0;
        for(let x =0; x<=html.length-1;x++){
            if(checkOpenBracket(html[x]) && checkOpenBracket(html[x+1]) && !checkOpenBracket(html[x+2]) ){
                start = x
            }
            else if(!checkCloseBracket(html[x-1]) && checkCloseBracket(html[x]) && checkCloseBracket(html[x+1]) && start>0 ){
                end = x+2
                bracket_array.push(html.slice(start,end))
                start=0
            }
            else if(html.length-1===x){
                callback(bracket_array,html)
            }
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

function getBrackets(con,query,callback){
    parseData(con,query,(allBrackets,html)=>{
        const withoutDuplicates = allBrackets.filter(function(el,i) {
            return allBrackets.indexOf(el) == i;
        });
        callback(withoutDuplicates,html)
    })
}


module.exports.getBrackets=getBrackets;