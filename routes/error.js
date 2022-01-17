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
  redirectUri: "http://www.lihezbl.tk/callback", 
});
/* GET home page. */
router.get('/callbackerror', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/errors', {
    title: "Error - Lihez BotList",
    user: user,
    header: "Callback Code Is Undefined",
    errorcode: "1"
  })
  } else{
    res.render('errors/errors', {
      title: "Error - Lihez BotList",
      login: loginurl,
      user: "yok",
      header: "Callback Code Is Undefined",
      errorcode: "1"
    });  
  }
});



router.get('/profileerror', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/errors', {
    title: "Error - Lihez BotList",
    user: user,
    header: "We Couldn't Find User",
    errorcode: "2"
  })
  } else{
    res.render('errors/errors', {
      title: "Error - Lihez BotList",
      login: loginurl,
      user: "yok",
      header: "We Couldn't Find User",
      errorcode: "2"
    });  
  }
});

router.get('/loginerror', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/errors', {
    title: "Error - Lihez BotList",
    user: user,
    header: "Please Log In Site With Discord",
    errorcode: "3"
  })
  } else{
    res.render('errors/errors', {
      title: "Error - Lihez BotList",
      login: loginurl,
      user: "yok",
      header: "Please Log In Site With Discord",
      errorcode: "3"
    });  
  }
});


router.get('/emptyform', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/errors', {
    title: "Error - Lihez BotList",
    user: user,
    header: "Please Fill In The Required Fields",
    errorcode: "4"
  })
  } else{
    res.render('errors/errors', {
      title: "Error - Lihez BotList",
      login: loginurl,
      user: "yok",
      header: "Please Fill In The Required Fields",
      errorcode: "4"
    });  
  }
});


router.get('/botindb', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/errors', {
    title: "Error - Lihez BotList",
    user: user,
    header: "Bot Already Exists",
    errorcode: "5"
  })
  } else{
    res.render('errors/errors', {
      title: "Error - Lihez BotList",
      login: loginurl,
      user: "yok",
      header: "Bot Already Exists",
      errorcode: "5"
    });  
  }
});

router.get('/itisntbot', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/errors', {
    title: "Error - Lihez BotList",
    user: user,
    header: "You Can Only Add Bots",
    errorcode: "6"
  })
  } else{
    res.render('errors/errors', {
      title: "Error - Lihez BotList",
      login: loginurl,
      user: "yok",
      header: "You Can Only Add Bots",
      errorcode: "6"
    });  
  }
});


router.get('/botnotfound', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/errors', {
    title: "Error - Lihez BotList",
    user: user,
    header: "This Bot Has Not Been Added or Approved",
    errorcode: "7"
  })
  } else{
    res.render('errors/errors', {
      title: "Error - Lihez BotList",
      login: loginurl,
      user: "yok",
      header: "This Bot Has Not Been Added or Approved",
      errorcode: "7"
    });  
  }
});

router.get('/24hours', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('errors/errors', {
    title: "Error - Lihez BotList",
    user: user,
    header: "You Can Only Vote For 1 Bot Every 12 Hours.",
    errorcode: "8"
  })
  } else{
    res.render('errors/24hours', {
      title: "Error - Lihez BotList",
      login: loginurl,
      user: "yok",
      header: "You Can Only Vote For 1 Bot Every 12 Hours.",
      errorcode: "8"
    });  
  }
});


module.exports = router;
