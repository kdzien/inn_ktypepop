let Product = require("./class/Product.js")


function addPZID(dbc,produkt){
    return new Promise((resolve,reject)=>{
        produkt.insertProdukty(dbc).then((pid)=>produkt.checkZgodny(dbc)
        .then((zid)=>{
            produkt.produkt_id=pid;
            if(zid){
                produkt.zgodny_id=zid;
                resolve(produkt)
            }else{
                produkt.insertZgodny(dbc).then((zidfi)=>{
                    produkt.zgodny_id=zidfi;
                    resolve(produkt)
                }).catch((err)=>{
                    reject(err)
                })
            }
        }
        )).catch((err)=>{
            reject(err)
        })
    })
}






function insertProducts(dbc,products){
    return new Promise((resolve,reject)=>{
        let n = 0;
        (function solve(){
            if(n<=products.length-1){
                let tpv=products[n];
                console.log(tpv)
                tpv.rokdo==0 ? tpv.rokdo=null : tpv.rokdo;
                tpv.rokod==0 ? tpv.rokod=null : tpv.rokod;
                tpv.ot=='tak' ? tpv.ot=true : tpv.ot=false;
                let product= new Product(tpv.sku,tpv.marka,tpv.model,tpv.drzwi,tpv.rokod,tpv.rokdo,tpv.ot)
                addPZID(dbc,product)
                .then((produkt)=>produkt.insertKrosy(dbc)
                .then(()=>produkt.insertProduktyLok(dbc)
                .then(()=>{
                    n++
                    solve();
                })))
                .catch((err)=>{
                    reject(err)
                })
            }else{
                resolve()
            }
        })()
    })
}

module.exports.insertProducts = insertProducts;