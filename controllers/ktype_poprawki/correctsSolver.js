"use strict";
var Elem_auction_id = require("../config/item_id/ID.js")
var Elem_title = require("../config/item_title/Title.js")
var sqlsolver = require("./sqlsolver.js")


var item_array = new Array();

const prod = '';
let db_query;

function solver(type,prod,xml_p,db){
    let xml_positions = xml_p.substring(1, xml_p.length-1).split(",");
    console.log(xml_positions)
    db_query=`select * from konradd.ktype_widok_${prod} `
    if(type!='undefined' && type.length!=0){
        db_query = db_query+ ` where cozapoprawka = '${type}'`
    }
    db_query = db_query + ' group by auction_id'
    console.log(db_query)
    console.log(db_query)
    return new Promise((resolve,reject)=>{
        db.query(db_query,function(err,result){
            if(err){
                console.log(err)
                reject("problem z bazą")
                clearItems()
            }
            else{
            let n = 0;
            console.log(result.length);
            (function asyc(){
            if(n<=result.length-1){
                let evq=`select * from konradd.ktype_widok_${prod} where profil_id=${result[n].profil_id} and zgodny_id=${result[n].zgodny_id} and produkt_id = ${result[n].produkt_id} and user_id='${result[n].user_id}' `

                let etq=`select content from ${getCorrectDBProduct(prod)} where user='${result[n].user_id}' and profil=${result[n].profil_id} and kind='xmld' and name =`
                let single_item = {
                    ItemID:"",
                    xml:"",
                    user_id:""
                }
                single_item.ItemID=result[n].auction_id;
                single_item.user_id=result[n].user_id;
                
                let j = 0;
                (function async2(){
                    if(j<=xml_positions.length-1){
                        if(xml_positions[j]=='Description'){
                            sqlsolver.solve(db,'select html_template from '+getCorrectHTMLTEMPLATE(prod)+'.`db_config_'+result[n].user_id+'`'+' where profil_id = '+result[n].profil_id,evq,(rdesc)=>{
                                single_item.xml +=`<Description><![CDATA[[[${rdesc.replace(/(\r\n|\n|\r)/gm,"").replace(/'/g, "\\'")}]]]]></Description>`
                                j++;async2();
                            },(error)=>{
                                reject(`${result[n].user_id}_${result[n].country}: ${error}`)
                                clearItems()
                            })
                        }else{
                            sqlsolver.solve(db,etq+`'${xml_positions[j]}'`,evq,isx=>{
                                single_item.xml +=isx.replace(/'/g, "\\'");  ;
                                j++;async2();
                            },(error)=>{
                                reject(`${result[n].user_id}_${result[n].country}: ${error}`)
                                clearItems()
                            })
                        }
                        
                    }else{
                        item_array.push(single_item)
                        n++;asyc();
                    }
                })()
    
                // sqlsolver.solve(db,etq+`'encoded_app_data'`,evq,isx=>{
                    
                //     single_item.app_data = isx;
                //     var title = new Elem_title(result[n].tytul)
                //     single_item.item_title = title.toString()
                //     sqlsolver.solve(db,etq+`'ItemCompatibilityList_replace'`,evq,isx=>{
                //         single_item.compability_list=isx;
                //         sqlsolver.solve(db,etq+`'ItemSpecifics'`,evq,(isx)=>{
                //             single_item.item_specific=isx
                //             sqlsolver.solve(db,'select html_template from '+getCorrectHTMLTEMPLATE(prod)+'.`db_config_'+result[n].user_id+'`'+' where profil_id = '+result[n].profil_id,evq,(rdesc)=>{
                //                 single_item.item_desc=rdesc.replace(/(\r\n|\n|\r)/gm,"").replace(/'/g, "\\'");
                //                 item_array.push(single_item)
                //                 single_item = {}
                //                 n++
                //                 asyc()
                //             },(error)=>{
                //                 reject(`${result[n].user_id}_${result[n].country}: ${error}`)
                //             })
                //         },(error)=>{
                //             reject(`${result[n].user_id}_${result[n].country}: ${error}`)
                //         })
                //     },(error)=>{
                //         reject(`${result[n].user_id}_${result[n].country}: ${error}`)
                //     })
                // })
            }else{
                postData(item_array,db,()=>{
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

function postData(array,db,callback){
    var n = 0;
    db.query("delete from konradd.poprawki_ktype",function(err,res){
        var sqlq = "insert into konradd.poprawki_ktype (ItemID,xml,user_id) values ";
        var valuesx = "";
    
        (function asyc3(){
            if(n<=array.length-1){
                valuesx+=`('${array[n].ItemID}','${array[n].xml}','${array[n].user_id}'), `
                n++
                asyc3()
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
                        clearItems();
                        callback()
                    }
                })
            }
        })()
    })
}
function clearItems(){
    item_array= [];
}

module.exports.solver=solver;