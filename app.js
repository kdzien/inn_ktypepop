"use strict";
var db = require("./db_connection")
var Elem_auction_id = require("./config/item_id/ID.js")
var Elem_title = require("./config/item_title/Title.js")
var is = require("./config/jsonLoopPareser.js")
var desc = require("./bracketParser/setMap.js")

var single_item = {
    ItemID:"",
    app_data:"",
    compability_list:"",
    item_specific:"",
    item_title:"",
    item_desc:""
}

var item_array = new Array();

const prod = 'dywanyG';

let db_query = `select * from konradd.ktype_widok_${prod}` ;
    console.log(db_query)
    
db.query(db_query,function(err,result){
    
    if(err){
        console.log(err)
    }
    var n = 0;
        (function asyc(){
        if(n<=result.length-1){
            let evq=`select * from konradd.ktype_widok_${prod} where profil_id=${result[n].profil_id} and zgodny_id=${result[n].zgodny_id} and produkt_id = ${result[n].produkt_id} and user_id='${result[n].user_id}' `
            let etq=`select content from ${getCorrectDBProduct(prod)} where user='${result[n].user_id}' and profil=${result[n].profil_id} and kind='xmld' and name =`
            var auction_id = new Elem_auction_id(result[n].auction_id)
            single_item.ItemID = auction_id.toString()
                is.getItemDesc(etq+`'encoded_app_data'`,evq,isx=>{
                single_item.app_data = isx;
                var title = new Elem_title(result[n].tytul)
                single_item.item_title = title.toString()
                is.getItemDesc(etq+`'ItemCompatibilityList_replace'`,evq,isx=>{
                    single_item.compability_list=isx;
                    is.getItemDesc(etq+`'ItemSpecifics'`,evq,(isx)=>{
                        single_item.item_specific=isx
                        is.getItemDesc('select html_template from '+getCorrectHTMLTEMPLATE(prod)+'.`db_config_'+result[n].user_id+'`'+' where profil_id = '+result[n].profil_id,evq,(rdesc)=>{
                            single_item.item_desc=rdesc.replace(/(\r\n|\n|\r)/gm,"").replace(/'/g, "\\'");;
                            item_array.push(single_item)
                            single_item = {}
                            console.log(result[n].auction_id)
                            n++
                            asyc()
                        })
                    })
                })
            })
        }else{
            postData(item_array)
        }
    })()

})
function getCorrectDBProduct(product){
    let db_name = ""
    switch(product){
        case "dywanyR":
            db_name="ee_dywany_anty_mateusz.db_templates";
            break;
        case "dywanyG":
            db_name="ee_dywany_gumowe_mateusz.db_templates";
            break;
        case "dywanyW":
            db_name="ee_dywany_bez_maty_mateusz.db_templates";
            break;
        case "dywanyS":
            db_name="ee_bagaznikowe_gumowe.db_templates";
            break;
        case "dywanyGR":
            db_name="ee_komplety_dywany.db_templates";
            break;
        case "owiewkiH":
            db_name="ee_owiewki_mateusz.db_templates";
            break;
        default:
            break;
    }
    return db_name
}
function getCorrectHTMLTEMPLATE(product){
    let db_name = ""
    switch(product){
        case "dywanyR":
            db_name="ee_dywany_anty_mateusz";
            break;
        case "dywanyG":
            db_name="ee_dywany_gumowe_mateusz";
            break;
        case "dywanyW":
            db_name="ee_dywany_bez_maty_mateusz";
            break;
        case "dywanyS":
            db_name="ee_bagaznikowe_gumowe";
            break;
        case "dywanyGR":
            db_name="ee_komplety_dywany";
            break;
        case "owiewkiH":
            db_name="ee_owiewki_mateusz";
            break;
        default:
            break;
    }
    return db_name
}

function getCorectXML(user_id,profil_id,product){
    let db_name = getCorrectDBProduct(product)
    return `select content from ${db_name} where user='${user_id}' and profil=${profil_id} and kind='xmld' and name ='ItemSpecifics'`
}   

function postData(array){
    var n = 0;
    db.query("delete from konradd.ktype_test3",function(err,res){
        var sqlq = "insert into konradd.ktype_test3 (item_id,item_spec,item_comp,item_appdata,item_title,item_description) values ";
        var valuesx = "";
    
        (function asyc2(){
            if(n<=array.length-1){
                valuesx+=`("${array[n].ItemID}","${array[n].item_specific}","${array[n].compability_list}","${array[n].app_data}","${array[n].item_title}",'${array[n].item_desc}'), `
                console.log(array[n].ItemID+" "+array[n].app_data)
                n++
                asyc2()
            }else{
                valuesx = valuesx.slice(0,-2)
                sqlq = sqlq+valuesx
                db.query(sqlq,function(err,result){
                    if(err){console.log(err.sqlMessage)}
                    else{console.log("koniec")}
                })
            }
        })()
    })
}