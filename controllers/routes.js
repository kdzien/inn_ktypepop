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
var memes = require('dankmemes');
var db = require("./ktype_poprawki/db_connection.js")

router.get('/randomMeme', function(req,res){
  memes('hour', 20, function(err, data) {
      if(err){
        res.status(500).send(err)
      }else{
        let memnr = Math.floor((Math.random() * 20) + 1);
        res.json(data[memnr].replace('https://i.redditmedia.com/',''));
      }
  });
})

router.get('/corrects/:type/:product/:xml_p',function(req,res){
  let xml_p = req.params.xml_p;
  db.sqlStartConnection().then(con=>{
      correctsSolver.solver(req.params.type, req.params.product,xml_p,con).then(()=>{
        con.query(`select * from konradd.poprawki_ktype`,function(err,result){
          if(err){
            db.sqlEndConnection(con,()=>{
              res.status(500).send(err)
            })
          }
          db.sqlEndConnection(con,()=>{
            res.json(result);
          })
        })
      }).catch((err)=>{
        db.sqlEndConnection(con,()=>{
          res.status(500).send(err)
        })
      })
    }).catch(err=>{
      res.status(500).send(err)
    })
})

router.get('/templates',function(req,res){
  db.sqlStartConnection().then(con=>{
    con.query("select xml_template,sql_template from ebay_api_calls.turbodziobak_job_predefines where job_type='ReviseItem' and `name` = 'Poprawki ktype'",function(err,result){
      if(err){
        db.sqlEndConnection(con,()=>{
          res.status(500).send(err)
        })
      }
      db.sqlEndConnection(con,()=>{
        res.json(result)
      })  
    })
  }).catch(err=>{
    res.status(500).send(err)
  })
})

router.get('/xml_preview/:item_id',function(req,res){
  let vq = `select sql_template from ebay_api_calls.turbodziobak_job_predefines where job_type='ReviseItem' and name = 'Poprawki ktype'`
  db.sqlStartConnection().then(con=>{
    con.query(vq,function(err,result){
      if(err){
        db.sqlEndConnection(con,()=>{
          res.status(500).send(err)
        })
      }
      let view_query = result[0].sql_template
      let template_query = `select xml_template from ebay_api_calls.turbodziobak_job_predefines where job_type='ReviseItem' and name = 'Poprawki ktype'`
      bracketParser.getDescription(`${view_query} where b.auction_id = '${req.params.item_id}'`,template_query,con,(template)=>{
        db.sqlEndConnection(con,()=>{
          const html_t = template.substring(template.indexOf('<Description>')+13,template.indexOf('</Description>'))
          res.json({xml:template, html: html_t})
        }) 
      })
    })
  }).catch(err=>{
    res.status(500).send(err)
  })
})

router.post('/makejobs/:produkt',function(req,res){
  db.sqlStartConnection().then(con=>{
    con.query("select xml_template,sql_template from ebay_api_calls.turbodziobak_job_predefines where job_type='ReviseItem' and `name` = 'Poprawki ktype'",function(err,response){
      if(err){
        db.sqlEndConnection(con,()=>{
          res.status(500).send(err)
        })
      }
      db.sqlEndConnection(con,()=>{
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
  }).catch(err=>{
    res.status(500).send(err)
  })
})

//nowosci
router.post('/news/validate',function(req,res){
  db.sqlStartConnection().then(con=>{
    newsValidator.validateAll(con,req.body,function(result){
      db.sqlEndConnection(con,()=>{
        res.status(200).send(result)
      }) 
    })
  }).catch(err=>{
    res.status(500).send(err)
  })
})

router.post('/news/add',function(req,res){
  db.sqlStartConnection().then(con=>{
    newsValidator.validateAll(req.body,function(errors){
      if(errors.length==0){
        newsController.insertProducts(con,req.body).then(()=>{
          db.sqlEndConnection(con,()=>{
            res.status(200).send("Poszly nowosci.")
          })
        }).catch(err=>{
          db.sqlEndConnection(con,()=>{
            res.status(500).send(err)
          })
        })
      }else{
        db.sqlEndConnection(con,()=>{
          res.status(500).send(errors)
        })
      }
    })  
  }).catch(err=>{
    res.status(500).send(err)
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

//zewnetrzne zasoby

router.get('/photoproducer',function(req,res){
  db.sqlStartConnection().then(con=>{
    con.query(`select x.sku,concat(x.produkt_id,'_',x.zgodny_id,if(k.nr_zdjecia is null,'',concat('_',k.nr_zdjecia))) as nazwa, k.source as froms from konradd.photo_producer_bp k inner join (
      select k.produkt_id,k.zgodny_id,concat('H',k.art_id,'00') as sku from ee_owiewki_mateusz.aukcja_view k inner join (
      select produkt_id,zgodny_id from konradd.photo_producer_bp where source='rosja' group by produkt_id,zgodny_id) x
      on k.produkt_id=x.produkt_id and k.zgodny_id=x.zgodny_id  group by k.produkt_id,k.zgodny_id
      ) x on k.produkt_id=x.produkt_id and k.zgodny_id=x.zgodny_id where k.source like '%rosja%' order by k.produkt_id,k.zgodny_id`,function(err,result){
      if(err){res.status(500).send(err)}else{
        res.send(result)
      }
    })

  }).catch(err=>{
    console.log(err)
    res.status(500).send(err)
  })

})

module.exports = router;