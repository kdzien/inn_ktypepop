var db = require("../db_connection")
var fs = require('fs');
var convert = require('xml-js');
const replace = require('replace-async');
var jsonxml = require('jsontoxml');

var baza = {

}

class JsonLoopParser {
    constructor(model,marka,typ,sku,profil_id,produkt_id,zgodny_id,rokdobetter,rokod,rokdo){
        this.model=model;
        this.marka=marka;
        this.typ=typ;
        this.sku=sku;
        this.profil_id=profil_id;
        this.produkt_id=produkt_id;
        this.zgodny_id=zgodny_id;
        this.rokdobetter=rokdobetter;
        this.rokod=rokod;
        this.rokdo=rokdo;
    }
    setMap(){
        baza = {
            "[[model]]" : this.model,
            "[[marka]]" : this.marka,
            "[[typ]]" : this.typ,
            "[[sku]]" : this.sku,
            "[[profil_id]]":this.profil_id,
            "[[produkt_id]]":this.produkt_id,
            "[[zgodny_id]]":this.zgodny_id,
            "[[rokdobetter]]":this.rokdobetter,
            "[[rokod]]":this.rokod,
            "[[rokdo]]":this.rokdo
        }
    }
    getMap(){
        return baza
    }
    getParsed(ural,callback){
        var returnArray = [];
        parseData(ural,objects=>{
            var n =0
            var finalJSON = [];
            (function asyc(){
                if(n<=objects.length-1){
                    if(objects[n].alias){
                        db.query(objects[n].sql_query,function(err,result,fields){
                            var obj = {}
                            var objs = []
                            fields.forEach(elem =>{
                                var xd = `[[${objects[n].alias}.${elem.name}]]`
                                obj[xd] = elem.name
                            })
                            result.forEach((elem,i)=>{
                                for(var k=0;k<=Object.keys(obj).length-1;k++){
                                     obj[Object.keys(obj)[k]] = elem[Object.keys(elem)[k]];
                                }
                                var orginalArray  = objects[n].elements
                                var clonedArray = JSON.parse(JSON.stringify(orginalArray))
                                clonedArray.forEach(elem=>{
                                    elem.value=obj[elem.value]
                                })
                                returnArray.push(clonedArray)
                            })
                            n++
                            asyc()
                        })
                    }else{
                        returnArray.push(objects[n])
                        n++
                        asyc()
                    }
                }else{
                    var temp = new Array()
                    returnArray.forEach(elem=>{
                        var obj = {}
                        if(elem.constructor === Array){
                            elem.forEach(elemi=>{
                                obj.NameValueList = elemi
                                temp.push(obj)
                                obj = {}
                            })
                        }else{
                            obj.NameValueList = elem
                            temp.push(obj)
                        }
                    })  
                    temp = jsonxml({ItemSpecific:temp})
                    callback(temp)
                }
            })()
        })
    }
}

function parseData(urxl,callback) {
    var totalObject = []    
    fs.readFile(urxl, function(err, data) {
        var result = convert.xml2js(data, {compact: false, spaces: 4});
        var list = result.elements[0].elements;
        list.forEach((elem,i)=>{
            if(elem.name=='Loop'){
                var obj = {}
                obj.alias = elem.attributes.alias
                obj.sql_query = elem.attributes.sql
                Object.keys(baza).forEach(elem=>{
                    if(obj.sql_query.indexOf(elem)!==-1){
                        var begining = obj.sql_query.indexOf(elem)
                        var length = elem.length;
                        var start = obj.sql_query.slice(0,begining)
                        var middle = baza[elem]
                        var end = obj.sql_query.slice(begining+length,obj.sql_query.length)
                        obj.sql_query = start+middle+end
                    }
                })
                var elements = elem.elements
                obj.elements = []
                
                elements.forEach(elem=>{
                    var i = 1;
                    obj_elem={}
                    elem.elements.forEach(elem=>{
                        if(i%2==0){
                            obj_elem.value = elem.elements[0].text
                            obj.elements.push(obj_elem)
                            obj_elem={}
                        }else{
                            obj_elem.name = elem.elements[0].text
                        }
                        i++
                    })
                })
                totalObject.push(obj)
                obj = {}
            }
            else{
                var obj_array = []
                var temp_obj = {}
                elem.elements.forEach(elem_inside=>{
                    if(elem_inside.name=="Name"){
                        temp_obj.name=elem_inside.elements[0].text
                    }else{
                        if(elem_inside.elements[0].cdata){
                            var kwadrat = elem_inside.elements[0].cdata; 
                        }
                        else{
                            var kwadrat = elem_inside.elements[0].text; 
                        }
                        if(kwadrat.indexOf('[[')!==-1){
                            temp_obj.value=baza[kwadrat]
                            
                        }else{
                            temp_obj.value=elem_inside.elements[0].text
                        }                      
                    }
                })
                obj_array.push(temp_obj)
                totalObject.push(temp_obj)
                temp_obj={}
                
            }
            if(list.length-1==i){
                callback(totalObject)
            }
            
        })

    })

}

module.exports = JsonLoopParser;