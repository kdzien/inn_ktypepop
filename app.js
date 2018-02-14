var db = require("./db_connection")
var Elem_auction_id = require("./config/item_id/Element.js")
var Elem_app_data = require("./config/item_app_data/Element.js")
var Elem_compability = require("./config/item_compability_list/Element.js")
var Elem_title = require("./config/item_title/Element.js")
var Elem_is = require("./config/jsonLoopPareser.js")
var Elem_desc = require("./config/item_description/Element.js")

// jsonparsed("./config/item_spec_files/R_ELTD.xml",itemSpecXML=>{
// console.log(itemSpecXML)
// })

var single_item = {
    ItemID:"",
    app_data:"",
    compability_list:"",
    item_specific:"",
    item_title:"",
    item_desc:""
}
var item_array = new Array();

db.query('select * from konradd.ktype_widok',function(err,result){
    var n = 0;
    (function asyc(){
        if(n<=result.length-1){
            //id aukcji
            var auction_id = new Elem_auction_id(result[n].auction_id)
            single_item.ItemID = auction_id.toString()
            //app data
            var app_data = new Elem_app_data(result[n].ApplicationData)
            app_data.getEncoded((appdata)=>{
                single_item.app_data = appdata;
                var title = new Elem_title(result[n].title)
                single_item.item_title = title.toString()
                var comp_list = new Elem_compability(result[n].RokOd,result[n].RokDo,result[n].sku,result[n].country)
                comp_list.toString((res)=>{
                    single_item.compability_list=res;
                    var its = new Elem_is(result[n].model,result[n].marka,result[n].typ,result[n].sku,result[n].profil_id,result[n].produkt_id,result[n].zgodny_id,result[n].rokrokdobetter,result[n].rokod,result[n].rokdo)
                    its.setMap()
                    its.getParsed(getCorectXML(result[n].user_id),isx=>{
                        single_item.item_specific = isx;
                        var it_desc = new Elem_desc(result[n].user_id,result[n].profil_id,result[n].encoded_art_id,result[n].encoded_sku,result[n].ftpfolder,result[n].link,result[n].title,result[n].link_de,result[n].marka,result[n].model)
                            it_desc.toString((desc)=>{
                            single_item.item_desc=desc.replace(/(\r\n|\n|\r)/gm,"").replace(/'/g, "\\'");;
                            item_array.push(single_item)
                            single_item = {}
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

function getCorectXML(user_id){
    var url = new String()
    switch (user_id) {
        case 'online-depot-ohg':
            url="./config/item_spec_files/R_ODDE.xml"
            break;
        case 'eternal-store':
            url="./config/item_spec_files/R_ES.xml"
            break;
        case 'grenico-ohg':
            url="./config/item_spec_files/R_GROHG.xml"
            break;
        case 'eternalcar-ltd':
            url="./config/item_spec_files/R_ELTD.xml"
            break;
        case 'trade-express-ug':
            url="./config/item_spec_files/R_TEX.xml"
            break;
        case 'grenico-fr':
            url="./config/item_spec_files/R_GRFR.xml"
            break;
        default:
         url="./config/item_spec_files/R_GRFR.xml"   
            break;
    }
    return url;
}   

function postData(array){
    var n = 0;
    db.query("delete from konradd.ktype_test3",function(err,res){
        var sqlq = "insert into konradd.ktype_test3 (item_id,item_spec,item_comp,item_appdata,item_title,item_description) values ";
        var valuesx = "";
    
        (function asyc2(){
            if(n<=array.length-1){
                valuesx+=`("${array[n].ItemID}","${array[n].item_specific}","${array[n].compability_list}","${array[n].app_data}","${array[n].item_title}",'${array[n].item_desc}'), `
                // valuesx+=`("xd","xd","xd","xd"), `
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

