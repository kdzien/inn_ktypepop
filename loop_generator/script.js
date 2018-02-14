var db = require('../db_connection.js')

db.query("select html_template from ee_dywany_anty_mateusz.`db_config_grenico-fr`",function(err,result){
    var html = result[0].html_template
    console.log(getLoop(html))
})


function isSecondLoop(html){
    if(html.indexOf("<Loop")<html.indexOf("</Loop")){
        return true;
    }
    return false;
}

function getSecondLoopEndIdx(html){
    var first_loop_finish = html.indexOf("</Loop")
    html = html.slice(first_loop_finish+6,html.length)
    var last_loop_finish = html.indexOf("</Loop")
    return first_loop_finish+6+last_loop_finish+6
}

function getLoop(html){
    if(isSecondLoop(html.slice(html.indexOf("<Loop")+6,html.length))){
        var loop_start = html.indexOf("<Loop");
        var loop_end = getSecondLoopEndIdx(html)
        var double_loop = html.slice(loop_start,loop_end)
    }
    else{
        var loop_start = html.indexOf("<Loop");
        var loop_end = html.indexOf("</Loop");
        var single_loop = html.slice(loop_start,loop_end)
    }

    return single_loop || double_loop
}

/////////////////////////////////////////////

function getLoopJson(htmlloop){
    
}