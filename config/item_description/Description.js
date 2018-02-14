"use strict"
var db = require("../../db_connection")
const replace = require('replace-async');
class Description{

    constructor(user_id,profil_id,encoded_art_id,encoded_sku,ftpfolder,link,tytul,link_de,marka,model){
        this.user_id=user_id;
        this.profil_id=profil_id;
        this.encoded_art_id=encoded_art_id;
        this.encoded_sku=encoded_sku;
        this.ftpfolder=ftpfolder;
        this.link=link;
        this.tytul=tytul;

        this.link_de =link_de;
        this.marka=marka;
        this.model=model;
    }

    toString(callback){
        var change_map= [
            {co: new RegExp("\\[\\[encoded_art_id\\]\\]","g"), na_co:this.encoded_art_id},
            {co: new RegExp("\\[\\[ftpfolder\\]\\]","g"), na_co:this.ftpfolder},
            {co: new RegExp("\\[\\[link\\]\\]","g"), na_co:this.link},
            {co: new RegExp("\\[\\[tytul\\]\\]","g"), na_co:this.tytul},
            {co: new RegExp("\\[\\[encoded_sku\\]\\]","g"), na_co:this.encoded_sku}
        ] 
        var querys = "SELECT html_template FROM ee_dywany_anty_mateusz.`db_config_"+this.user_id+"` d WHERE profil_id="+this.profil_id;

        db.query(querys,function(err,result){
            var description = result[0].html_template;
            var n=0;
            (function asyc(){
                if(n<=change_map.length-1){
                    replace(description, change_map[n].co , change_map[n].na_co, (err, result) => {
                        description = result;
                        n++
                        asyc()
                    })   
                }
                else{
                    callback(description)
                }
            })()           
        })
    }
    getMapens(){
        return this.mapens
    }
}
module.exports = Description;
