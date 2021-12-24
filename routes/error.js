var express = require('express');
var router = express.Router();
var {con} = require('../app')
var {bot} = require('../bot')
const setting = require('../setting.json')
const crypto = require('crypto');

var OAuthClient = require('discord-oauth2');
const oauthclient = new OAuthClient({
  clientId: setting.bot.botid,
  clientSecret: setting.bot.secret,
  redirectUri: "http://localhost:3000/callback", 
});

/* GET home page. */
router.get('/callbackerror', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

  const veri = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM bots WHERE status = ?`, ['approved'], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/callbackerror', {
    title: "Error - Lihez BotList",
    data:veri,
    user: user
  })
  } else{
    res.render('errors/callbackerror', {
      title: "Error - Lihez BotList",
      data:veri,
      login: loginurl,
      user: "yok" //index.ejs'yi ve user diye bir değişken gönder
    });  
  }
});

router.get('/profileerror', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

  const veri = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM bots WHERE status = ?`, ['approved'], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/profileerror', {
    title: "Error - Lihez BotList",
    data:veri,
    user: user
  })
  } else{
    res.render('errors/profileerror', {
      title: "Error - Lihez BotList",
      data:veri,
      login: loginurl,
      user: "yok" //index.ejs'yi ve user diye bir değişken gönder
    });  
  }
});


module.exports = router;
