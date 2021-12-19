var express = require('express');
var router = express.Router();
var {con} = require('../app')
var {bot} = require('../bot')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home - Lihez BotList' });
});

module.exports = router;
