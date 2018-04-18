function validateProduct(product,dbc){
    return new Promise((resolve,reject)=>{
        let errors = [];
        console.log(product)
        const { sku, marka, model, drzwi,odroku,doroku,ot } = product;
        if(sku.search(/^H[0-9]{5}00$/)){
            errors.push("Zle sku")
        }
        if(marka.length==0){
            errors.push("Brak marki")
        }
        if(model.length==0){
            errors.push("Brak modelu")
        }
        if(drzwi==0){
            errors.push("0 drzwi? oszalales?")
        }
        if(odroku!=0 && (odroku<1900 || odroku>(new Date()).getFullYear())){
            errors.push(`od roku nie jest pomiędzy 1900 a ${(new Date()).getFullYear()}`)
        }
        if( doroku!=0 && (odroku<1900 || doroku>(new Date()).getFullYear())){
            errors.push(`do roku nie jest pomiędzy 1900 a ${(new Date()).getFullYear()}`)
        }
        dbc.query(`select * from ee_owiewki_mateusz.produkty where kod_produkt='${sku}'`,function(err,result){
            if(err){reject(err)}
            else if (result.length!=0){
                errors.push("Takie sku jest już w bazie, wez to posprzataj")
                resolve(errors)
            }
            else{
                resolve(errors)
            }
        })
    })
}

function validateAll(array,dbc,callback){
    let n = 0;
    let resultArray = [];
    (function async(){
        if(n<=array.length-1){
            validateProduct(array[n],dbc).then((errors)=>{
                if(errors.length!=0){
                    resultArray.push({id:n,messages:errors})
                    n++;async()
                }else{n++;async()}
            }).catch((err)=>{
                console.log(err)
            })
        }else{
            callback(resultArray)
        }
    })()
}

module.exports.validateAll = validateAll