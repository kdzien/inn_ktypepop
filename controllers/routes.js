var express = require('express');
var path    = require("path");
var router = express.Router();
var mysql = require('mysql');
var correctsSolver = require('./ktype_poprawki/correctsSolver.js')
var request = require('request');
var bracketParser = require('./ktype_poprawki/bracketParser/script.js')
var newsValidator = require('./nowosci/validator.js')
var newsController = require('./nowosci/newscontroller.js')
var dopasowania = require('../dopasowania/index.js')
var dopasowania_logi = require('./checkLogs')


var con = mysql.createConnection({
  multipleStatements: true,
  host: "192.168.1.60",
  user: "konradd",
  password: "samba20",
  port:"13306"
});
con.connect(err=>{

})

router.post('/corrects/:product',function(req,res){
	correctsSolver.solver(req.params.product).then(()=>{
    con.query("select * from konradd.ktype_test3",(err,response)=>{
      res.json(response);
   })
  }).catch((err)=>{
    res.status(500).send(err)
  })
})
router.get('/templates',function(req,res){
  con.query("select xml_template,sql_template from ebay_api_calls.turbodziobak_job_predefines where job_type='ReviseItem' and `name` = 'Poprawki ktype'",(err,response)=>{
    res.json(response)
  })
})
router.get('/xml_preview/:item_id',function(req,res){
  let vq = `select sql_template from ebay_api_calls.turbodziobak_job_predefines where job_type='ReviseItem' and name = 'Poprawki ktype'`
  con.query(vq,function(err,result){
    let view_query = result[0].sql_template
    let template_query = `select xml_template from ebay_api_calls.turbodziobak_job_predefines where job_type='ReviseItem' and name = 'Poprawki ktype'`
    bracketParser.getDescription(`${view_query} where b.auction_id = '${req.params.item_id}'`,template_query,(template)=>{
      res.json(template)
    })
  })
})

router.post('/makejobs/:produkt',function(req,res){
  con.query("select xml_template,sql_template from ebay_api_calls.turbodziobak_job_predefines where job_type='ReviseItem' and `name` = 'Poprawki ktype'",(err,response)=>{
    let sendObj = {
      data_to_proceed : `${response[0].sql_template}`, 
      xml_template:response[0].xml_template, 
      description : `Poprawki ${req.params.produkt}`,
      jobname : 'ReviseItem'
    }
    var options = {
      uri: 'http://192.168.1.60/turbodziobak_new/api/jobs/ebay/create',
      method: 'POST',
      headers: {
        Authorization: `Basic a29ucmFkZDpzYW1iYTIw`,
        Connection: 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      form:sendObj
    };
    request(options,function(error,response,body){
      if(error){throw new Error(error)}else{
        res.json(body)
      }
    })
  })
})

//nowosci
router.post('/news/validate',function(req,res){
  newsValidator.validateAll(req.body,con,function(result){
    res.status(200).send(result)
  })
})
router.post('/news/add',function(req,res){
  newsValidator.validateAll(req.body,con,function(errors){
    if(errors.length==0){
      newsController.insertProducts(req.body).then(()=>{
        res.status(200).send("Poszly nowosci.")
      }).catch(err=>{
        console.log(err)
        res.status(500).send(err)
      })
    }else{
      res.status(500).send(errors)
    }
  })
})

router.get('/dopasowania/',function(req,res){
  dopasowania.solve().then((result)=>{
    res.status(200).send(result)
  }).catch((err)=>{
    res.status(500).send(err)
  })
})
router.get('/dopasowania/logs',function(req,res){
  dopasowania_logi.getAllLogs().then(logs=>{
    res.status(200).send(logs)
  }).catch(err=>{
    console.log(err)
    res.status(500).send(err)
  })
})
router.get('/dopasowania/logs/:date',function(req,res){
  dopasowania_logi.readLog(req.params.date).then(log=>{
    res.status(200).send(log)
  }).catch(err=>{
    res.status(500).send(err)
  })
})
router.post('/dopasowania/new',function(req,res){
  dopasowania.solve(err=>{
    res.status(500).send(err)
  })
  res.status(202).send("Dopasowania uruchomione, sprawdzaj logi")
})
module.exports = router;