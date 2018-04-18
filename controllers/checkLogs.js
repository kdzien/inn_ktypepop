const fs = require('fs');
const logFolder = './logs/';

function getAllLogs(){
    return new Promise((resolve,reject)=>{
        fs.readdir(logFolder, (err, files) => {
            if(err){
                reject(err)
            }
            else{
                function clearName(elements,cb){
                    let temp = [];
                    elements.forEach((elem,i) => {
                        elem = elem.replace('.log','');
                        temp.push(elem)
                        if(i==elements.length-1){
                            cb(temp)
                        }
                    });
                }
                clearName(files,(newFiles)=>{
                    resolve(newFiles)
                })
            }
        })
    })
}

function readLog(filedate){
    return new Promise((resolve,reject)=>{
        fs.readFile(`${logFolder}${filedate}.log`,'utf8', (err, data) => {
            if (err) reject(err);
            else{
                resolve(data)
            }
        });
    })
}

module.exports.readLog = readLog;
module.exports.getAllLogs = getAllLogs;
