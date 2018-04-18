class Product{
    constructor(sku,marka,model,drzwi,rokod,rokdo,ot){
        this.sku=sku;
        this.art_id=sku.substring(1,sku.length-2)
        this.marka=marka;
        this.model=model;
        this.drzwi=drzwi;
        this.rokod=rokod;
        this.rokdo=rokdo;
        this.ot=ot;
        this.produkt_id=undefined;
        this.zgodny_id=undefined;
    }
    insertProdukty(dbc){
        return new Promise((resolve,reject)=>{
            let OT=null,NazwaID=8;
            if(this.ot){
                OT = 1;
                NazwaID=2
            }
            let query = `insert into ee_owiewki_mateusz.produkty (producent_nr,OT,kod_produkt,Nazwa_ID) values ('${this.art_id}',${OT},'${this.sku}','${NazwaID}')`
            dbc.query(query,function(err,result){
                console.log(result)
                if(err){reject(err)}
                else{
                    resolve(result.insertId)
                }
            })
        })
    }
    insertZgodny(dbc){
        return new Promise((resolve,reject)=>{
            let query = `insert into ee_owiewki_mateusz.zgodne_prod (marka,model,wersja,odRoku,doRoku) values
             ('${this.marka}','${this.model}',${this.drzwi},${this.rokod},${this.rokdo})`
            dbc.query(query,function(err,result){
                console.log(result)
                if(err){reject(err)}
                else{
                    resolve(result.insertId)
                }
            })
        })
    }
    checkZgodny(dbc){
        let query = `select * from ee_owiewki_mateusz.zgodne_prod where marka like '${this.marka}' 
        and model like '${this.model}' and wersja like '${this.drzwi}' and odRoku like ${this.rokod} and doRoku like ${this.rokdo} limit 1`
        return new Promise((resolve,reject)=>{
            dbc.query(query,function(err,result){
                if(err){reject(err)}else{
                    if(result.length!=0){resolve(result[0].ID)}else{resolve()}
                }
            })
        })
    }
    insertKrosy(dbc){
        return new Promise((resolve,reject)=>{
            let query = 'insert into ee_owiewki_mateusz.krosy (produkt_id,profil_id,zgodny_id,wystaw,pokaz) values'
            for(let i = 1 ; i<=4 ; i++){
                query += `(${this.produkt_id},${i},${this.zgodny_id},1,1),`
            }
            query = query.substring(0,query.length-1)
            dbc.query(query,function(err,result){
                console.log(result)
                if(err){reject()}else{
                    resolve()
                }
            })
        })
    }
    insertProduktyLok(dbc){
        return new Promise((resolve,reject)=>{
            let query = 'insert into ee_owiewki_mateusz.produkty_lok (produkt_id,profil_id,Ustawienia_ID) values'
            for(let i = 1 ; i<=4 ; i++){
                query += `(${this.produkt_id},${i},1),`
            }
            query = query.substring(0,query.length-1)
            dbc.query(query,function(err,result){
                console.log(result)
                if(err){reject()}else{
                    resolve()
                }
            })
        })
    }
}

module.exports = Product;