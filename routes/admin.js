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
router.get('/', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('admin/login', {
    title: "Login - Lihez BotList",
    user: user
  })
  } else{
    res.render('admin/login', {
      title: "Login - Lihez BotList",
      login: loginurl,
      user: "yok" //index.ejs'yi ve user diye bir değişken gönder
    });  
  }
});

router.post('/', async(req, res) => {

    if(req.session.username != undefined){return res.redirect('/admin/dashboard')}
    if(req.body.username < 1){return res.redirect('/admin')}
    if(req.body.passowrd < 1){return res.redirect('/admin')}
    if(req.body.position < 1){return res.redirect('/admin')}

    const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin WHERE username = ?`, [req.body.username], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
 

  if(veri[0].username < 1){
      return res.redirect('/admin')
  }

  if(req.body.password != veri[0].password){
    return res.redirect('/admin')
  }

  if(req.body.position != veri[0].position){
    return res.redirect('/admin')
  }
  req.session.username = veri[0].username;
  req.session.password = veri[0].password;
  res.redirect('/admin/dashboard')
});

router.get('/dashboard', async(req, res) => {

    if(req.session.username == undefined){return res.redirect('/admin')}
    if(req.session.username < 1){return res.redirect('/admin')}
    if(req.session.passowrd < 1){return res.redirect('/admin')}

 const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin WHERE username = ?`, [req.session.username], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

  if(veri[0].username < 1){return res.redirect('/admin')}
  if(req.session.password != veri[0].password){return res.redirect('/admin')}
  if(veri[0].position !=  "admin"){return res.redirect('/admin')}

  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('admin/dashboard', {
    title: "Dashboard - Lihez BotList",
    user: user,
    data:veri
  })
  } else{
    res.render('admin/dashboard', {
      title: "Dashboard - Lihez BotList",
      login: loginurl,
      data:veri,
      user: "yok" //index.ejs'yi ve user diye bir değişken gönder
    });  
  }
  });

  router.get('/dashboard/approvedbot', async(req, res) => {

    if(req.session.username == undefined){return res.redirect('/admin')}
    if(req.session.username < 1){return res.redirect('/admin')}
    if(req.session.passowrd < 1){return res.redirect('/admin')}

 const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin WHERE username = ?`, [req.session.username], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

  if(veri[0].username < 1){return res.redirect('/admin')}
  if(req.session.password != veri[0].password){return res.redirect('/admin')}
  if(veri[0].position !=  "admin"){return res.redirect('/admin')}

  const bot = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM bots WHERE status = ?`, ['approved'], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('admin/approvedbot', {
    title: "Login - Lihez BotList",
    user: user,
    bot:bot,
    data:veri
  })
  } else{
    res.render('admin/approvedbot', {
      title: "Login - Lihez BotList",
      login: loginurl,
      data:veri,
      bot:bot,
      user: "yok" //index.ejs'yi ve user diye bir değişken gönder
    });  
  }
  });

  router.get('/dashboard/pendingbot', async(req, res) => {

    if(req.session.username == undefined){return res.redirect('/admin')}
    if(req.session.username < 1){return res.redirect('/admin')}
    if(req.session.passowrd < 1){return res.redirect('/admin')}

 const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin WHERE username = ?`, [req.session.username], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

  if(veri[0].username < 1){return res.redirect('/admin')}
  if(req.session.password != veri[0].password){return res.redirect('/admin')}
  if(veri[0].position !=  "admin"){return res.redirect('/admin')}

  const bot = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM bots WHERE status = ?`, ['pending'], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('admin/approvedbot', {
    title: "Login - Lihez BotList",
    user: user,
    bot:bot,
    data:veri
  })
  } else{
    res.render('admin/approvedbot', {
      title: "Login - Lihez BotList",
      login: loginurl,
      data:veri,
      bot:bot,
      user: "yok" //index.ejs'yi ve user diye bir değişken gönder
    });  
  }
  });

  router.get('/dashboard/editbot/:id', async(req, res) => {
    var id = req.params.id
    if(req.session.username == undefined){return res.redirect('/admin')}
    if(req.session.username < 1){return res.redirect('/admin')}
    if(req.session.passowrd < 1){return res.redirect('/admin')}

 const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin WHERE username = ?`, [req.session.username], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

  if(veri[0].username < 1){return res.redirect('/admin')}
  if(req.session.password != veri[0].password){return res.redirect('/admin')}
  if(veri[0].position !=  "admin"){return res.redirect('/admin')}

  const bot = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM bots WHERE botID = ?`, [id], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('admin/editbot', {
    title: "Edit Bot - Lihez BotList",
    user: user,
    bot:bot,
    data:veri
  })
  } else{
    res.render('admin/editbot', {
      title: "Edit Bot - Lihez BotList",
      login: loginurl,
      data:veri,
      bot:bot,
      user: "yok" //index.ejs'yi ve user diye bir değişken gönder
    });  
  }
  });



  router.post('/approvebot', async(req, res) => {
    if(req.session.username == undefined){return res.redirect('/admin')}
    if(req.session.username < 1){return res.redirect('/admin')}
    if(req.session.passowrd < 1){return res.redirect('/admin')}

 const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM admin WHERE username = ?`, [req.session.username], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

  if(veri[0].username < 1){return res.redirect('/admin')}
  if(req.session.password != veri[0].password){return res.redirect('/admin')}
  if(veri[0].position !=  "admin"){return res.redirect('/admin')}

    console.log(req.body.botid)
  con.query(`UPDATE bots SET status = ? WHERE botID = ?`,
  ['approved', req.body.botid], function (err, result) {
    if (err) console.log(err)
});
bot.channels.cache.get('921722590404427806').send(`<a:tik:833702865406656573> <@${req.body.botid}> has been aproved by ${req.session.username}`)
  res.redirect('/admin/dashboard/pendingbot')
});



router.post('/deletebot', async(req, res) => {   
  
if(req.session.username == undefined){return res.redirect('/admin')}
if(req.session.username < 1){return res.redirect('/admin')}
if(req.session.passowrd < 1){return res.redirect('/admin')}

const veri = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM admin WHERE username = ?`, [req.session.username], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

if(veri[0].username < 1){return res.redirect('/admin')}
if(req.session.password != veri[0].password){return res.redirect('/admin')}
if(veri[0].position !=  "admin"){return res.redirect('/admin')}


  con.query(`DELETE FROM bots WHERE botID = ?`,
  [req.body.botid], function (err, result) {
    if (err) console.log(err)
});
bot.channels.cache.get('921722590404427806').send(`<a:x_:833702860344000512> <@${req.body.botid}> has been denied by ${req.session.username}`)

  res.redirect('/admin/dashboard/pendingbot')
});

module.exports = router;
