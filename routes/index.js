var express = require('express');
var router = express.Router();
var {con} = require('../app')
var {bot} = require('../bot')

/* GET home page. */
router.get('/', async(req, res) => {
  
  const veri = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM bots WHERE status = ?`, ['approved'], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

  res.render('index', { 
    title: 'Home - Lihez BotList',
    data:veri 
  });
});

module.exports = router;
