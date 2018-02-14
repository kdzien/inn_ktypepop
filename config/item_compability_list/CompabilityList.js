"use strict"
var db = require("../../db_connection")

class CompabilityList {
    constructor(rokod,rokdo,sku,country){
        var self = this;
        this.rokod=rokod;
        this.rokdo=rokdo;
        this.sku=sku;
        this.country=country;
    }
    getCompabilitylist(callback){
        var querys = `SELECT k.`+"`g-numer`"+` as car_id, concat('${this.rokod}-', if('${this.rokdo}' = '', '${this.getTodayText()}', '${this.rokdo}')) as RokOdDo FROM system_dopasowan.krosy k Join tecdoc_v4.ebay_list_de el On k.`+"`g-numer`"+`= el.ktype WHERE SKU = '${this.sku}' LIMIT 999;`
        var temp_compabilities = "";
        var temp_f = new CompabilityList(this.rokod,this.rokdo,this.sku,this.country)
        db.query(querys,function(err,result){
            result.forEach(elem => {
                temp_compabilities+=
                `<Compatibility><CompatibilityNotes><![CDATA[ ${elem.RokOdDo}  ${temp_f.getYearText()} ]]></CompatibilityNotes><NameValueList><Name>KType</Name><Value>${elem.car_id}</Value></NameValueList></Compatibility>`
            });
            callback(temp_compabilities)
        })
    }
    getYearText(){
        if(this.country=='DE'){
            return " Passt nur für die oben genannten Baujahre."
        }else if(this.country=='FR'){
            return " N'est compatible qu'avec années de construction énumérés ci-dessus."
        }else if(this.country=='GB'){
            return " Suitable only for production year models listed above."
        }
    }
    getTodayText(){
        if(this.country=='DE'){
            return " heute"
        }else if(this.country=='FR'){
            return " francjaheute"
        }else if(this.country=='GB'){
            return " nowadays"
        }
    }
    toString(callback){
        this.getCompabilitylist(compabilities =>{
            var result = `<ItemCompatibilityList>${compabilities}<ReplaceAll>true</ReplaceAll></ItemCompatibilityList>`
            callback(result)
        })
    }
}

module.exports = CompabilityList;