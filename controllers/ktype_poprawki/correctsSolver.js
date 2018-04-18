"use strict";
var db = require("./db_connection")
var Elem_auction_id = require("../config/item_id/ID.js")
var Elem_title = require("../config/item_title/Title.js")
var sqlsolver = require("./sqlsolver.js")

var single_item = {
    ItemID:"",
    app_data:"",
    compability_list:"",
    item_specific:"",
    item_title:"",
    item_desc:"",
    user_id:""
}

var item_array = new Array();

const prod = '';
let db_query;
// solver(prod,()=>{
    
// })

function solver(prod,callback){
    db_query=`select * from konradd.ktype_widok_${prod} `
    return new Promise((resolve,reject)=>{
        db.query(db_query,function(err,result){
            if(err){
                reject("problem z bazą")
            }
            else{
            var n = 0;
            (function asyc(){
                console.log(n)
            if(n<=result.length-1){
                console.log(result[n].user_id)
                let evq=`select * from konradd.ktype_widok_${prod} where profil_id=${result[n].profil_id} and zgodny_id=${result[n].zgodny_id} and produkt_id = ${result[n].produkt_id} and user_id='${result[n].user_id}' `
                let etq=`select content from ${getCorrectDBProduct(prod)} where user='${result[n].user_id}' and profil=${result[n].profil_id} and kind='xmld' and name =`
                single_item.user_id=result[n].user_id
                var auction_id = new Elem_auction_id(result[n].auction_id)
                single_item.ItemID = auction_id.toString()
    
                sqlsolver.solve(etq+`'encoded_app_data'`,evq,isx=>{
                    
                    single_item.app_data = isx;
                    var title = new Elem_title(result[n].tytul)
                    single_item.item_title = title.toString()
                    sqlsolver.solve(etq+`'ItemCompatibilityList_replace'`,evq,isx=>{
                        single_item.compability_list=isx;
                        sqlsolver.solve(etq+`'ItemSpecifics'`,evq,(isx)=>{
                            single_item.item_specific=isx
                            sqlsolver.solve('select html_template from '+getCorrectHTMLTEMPLATE(prod)+'.`db_config_'+result[n].user_id+'`'+' where profil_id = '+result[n].profil_id,evq,(rdesc)=>{
                                single_item.item_desc=rdesc.replace(/(\r\n|\n|\r)/gm,"").replace(/'/g, "\\'");
                                item_array.push(single_item)
                                single_item = {}
                                n++
                                asyc()
                            },(error)=>{
                                reject(`${result[n].user_id}_${result[n].country}: ${error}`)
                            })
                        },(error)=>{
                            reject(`${result[n].user_id}_${result[n].country}: ${error}`)
                        })
                    },(error)=>{
                        reject(`${result[n].user_id}_${result[n].country}: ${error}`)
                    })
                })
            }else{
                postData(item_array,()=>{
                    resolve()
                })
            }
        })()
            }
        })
    })
}

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
        case "ruryP":
            db_name="ee_rury_polmo_mateusz.db_templates";
            break;
        case "ruryPF":
            db_name="ee_rury_polmo_zawieszki.db_templates";
            break;
        case "ruryPP":
            db_name="ee_komplety_rury_mateusz.db_templates";
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
        case "ruryP":
            db_name="ee_rury_polmo_mateusz";
            break;
        case "ruryPF":
            db_name="ee_rury_polmo_zawieszki";
            break;
        case "ruryPP":
            db_name="ee_komplety_rury_mateusz";
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

function postData(array,callback){
    var n = 0;
    db.query("delete from konradd.ktype_test3",function(err,res){
        var sqlq = "insert into konradd.ktype_test3 (item_id,item_spec,item_comp,item_appdata,item_title,item_description,user_id) values ";
        var valuesx = "";
    
        (function asyc2(){
            if(n<=array.length-1){
                valuesx+=`("${array[n].ItemID}","${array[n].item_specific}","${array[n].compability_list}","${array[n].app_data}","${array[n].item_title}",'${array[n].item_desc}','${array[n].user_id}'), `

                n++
                asyc2()
            }else{
                valuesx = valuesx.slice(0,-2)
                sqlq = sqlq+valuesx
                if(array.length==0){
                    callback()
                    return;
                }
                db.query(sqlq,function(err,result){
                    if(err){throw new Error(err)}
                    else{
                        console.log("koniec")
                        item_array=[];
                        callback()
                    }
                })
            }
        })()
    })
}

module.exports.solver=solver;