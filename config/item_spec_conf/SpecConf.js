"use strict"
var db = require("../../db_connection")
var fs = require('fs'),
    xml2js = require('xml2js');
var parser = new xml2js.Parser();
const replace = require('replace-async');
var jsonxml = require('jsontoxml');
class SpecConf
{
    constructor(path,model,marka,sku) {
        this.path = path;
        this.model=model;
        this.marka=marka;
        this.sku=sku;
    }
    fillFields(callback){
        var temp_model=this.model;
        var temp_marka=this.marka;
        var temp_sku=this.sku
        fs.readFile(this.path, function(err, data) {
            parser.parseString(data, function (err, result) {
                var xml = result.ItemSpecifics.NameValueList
                xml.forEach(element => {
                    if(element.Value=='[[marka]]'){
                        element.Value=temp_marka;
                    }else if (element.Value=='[[model]]'){
                        element.Value=temp_model;
                    }
                });
                var loop_query = result.ItemSpecifics.Loop[0].$.sql
                var loop_body = result.ItemSpecifics.Loop[0].NameValueList
                replace(loop_query,new RegExp("\\[\\[sku\\]\\]","g"), temp_sku, (err, replac) => { 
                    loop_query=replac;
                    db.query(loop_query, (err,res) =>{
                        res.forEach(elem=>{
                            var loop_body_temp = loop_body;
                            loop_body_temp.forEach(element =>{
                                if(element.Value=='[[ean.mpn]]'){
                                    element.Value=elem.mpn;
                                }else if (element.Value=='[[ean.ean]]'){
                                    element.Value=elem.ean;
                                }else if (element.Value=='[[ean.ManufacturerPartNr]]'){
                                    element.Value=elem.ManufacturerPartNr;
                                }
                                xml.push(element)
                            })
                        })
                        var temp_obj = []
                        xml.forEach(elem =>{
                            var obj = {NameValueList:elem}
                            temp_obj.push(obj)
                        })
                        var obj = jsonxml({ItemSpecific:temp_obj})
                        callback(obj)
                    })
                })  
            });
        });
    }
}

module.exports = SpecConf