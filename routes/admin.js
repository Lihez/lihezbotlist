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
router.get('/', async(req, res) => {
  var key = req.session.key;

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  const veri = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM users WHERE userid = ?`, [user.id], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});
  if(veri[0].role != "admin" && veri[0].role != "moderator"){
   return res.redirect("/error/admin")
  }
  res.redirect('/admin/dashboard')
  } else{
    res.redirect("/error/loginerror")
  }
});

router.get('/dashboard', async(req, res) => {

var key = req.session.key;

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  const veri = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM users WHERE userid = ?`, [user.id], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});
  if(veri[0].role != "admin" && veri[0].role != "moderator"){
   return res.redirect("/error/admin")
  }
 
  res.render('admin/dashboard', {
    title: "Dashboard - Lihez BotList",
    user: user,
    data:veri
  })
  } else{
    res.redirect("/error/loginerror")
  }
  });

  router.get('/dashboard/approvedbot', async(req, res) => {

    var key = req.session.key;

    const bot = await new Promise((resolve, reject) => {
      con.query(`SELECT * FROM bots WHERE status = ?`, ['approved'], function (err, result) {
          if (err)
              reject(err);
          resolve(result);
      });
  });
  

    if (key != '0' && key != null && key != undefined) {
      let user = await oauthclient.getUser(key);
      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM users WHERE userid = ?`, [user.id], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
      if(veri[0].role != "admin" && veri[0].role != "moderator"){
       return res.redirect("/error/admin")
      }
     

      res.render('admin/bots', {
        title: "Approved Bots - Lihez BotList",
        user: user,
        bot:bot,
        data:veri
      })
      } else{
        res.redirect("/error/loginerror")
      }
  
  });

  router.get('/dashboard/pendingbot', async(req, res) => {

    var key = req.session.key;

    const bot = await new Promise((resolve, reject) => {
      con.query(`SELECT * FROM bots WHERE status = ?`, ['pending'], function (err, result) {
          if (err)
              reject(err);
          resolve(result);
      });
  });
  

    if (key != '0' && key != null && key != undefined) {
      let user = await oauthclient.getUser(key);
      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM users WHERE userid = ?`, [user.id], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
      if(veri[0].role != "admin" && veri[0].role != "moderator"){
       return res.redirect("/error/admin")
      }
     

      res.render('admin/bots', {
        title: "Pending Bots - Lihez BotList",
        user: user,
        bot:bot,
        data:veri
      })
      } else{
        res.redirect("/error/loginerror")
      }
  });

  router.get('/dashboard/editbot/:id', async(req, res) => {

    var id = req.params.id
    var key = req.session.key;
   
    const bot = await new Promise((resolve, reject) => {
      con.query(`SELECT * FROM bots WHERE botID = ?`, [id], function (err, result) {
          if (err)
              reject(err);
          resolve(result);
      });
  });
  

    if (key != '0' && key != null && key != undefined) {
      let user = await oauthclient.getUser(key);
      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM users WHERE userid = ?`, [user.id], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
      if(veri[0].role != "admin" && veri[0].role != "moderator"){
       return res.redirect("/error/admin")
      }
      res.render('admin/editbot', {
        title: "Edit Bot - Lihez BotList",
        user: user,
        bot:bot,
        data:veri
      })
      } else{
        res.redirect("/error/loginerror")
      }
  });



  router.post('/approvebot', async(req, res) => {
    var key = req.session.key;

    if (key != '0' && key != null && key != undefined) {
      let user = await oauthclient.getUser(key);
      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM users WHERE userid = ?`, [user.id], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
      if(veri[0].role != "admin" && veri[0].role != "moderator"){
       return res.redirect("/error/admin")
      }
      const data = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM bots WHERE botID = ?`, [req.body.botid], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });

      con.query(`UPDATE bots SET status = ? WHERE botID = ?`,
      ['approved', req.body.botid], function (err, result) {
        if (err) console.log(err)
    });
    con.query(`UPDATE users SET role = ? WHERE userid = ?`,
    ['developer', user.id], function (err, result) {
      if (err) console.log(err)
  });
    bot.channels.cache.get('921722590404427806').send(`<a:tik:833702865406656573> <@${req.body.botid}> has been aproved by <@${user.id}>`)
    res.redirect('/admin/dashboard/pendingbot')
      } else{
        res.redirect("/error/loginerror")
      }
});



router.post('/deletebot', async(req, res) => {   
  var key = req.session.key;

    if (key != '0' && key != null && key != undefined) {
      let user = await oauthclient.getUser(key);
      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM users WHERE userid = ?`, [user.id], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
      if(veri[0].role != "admin" && veri[0].role != "moderator"){
       return res.redirect("/error/admin")
      }
      con.query(`DELETE FROM bots WHERE botID = ?`,
      [req.body.botid], function (err, result) {
        if (err) console.log(err)
    });
    bot.channels.cache.get('921722590404427806').send(`<a:x_:833702860344000512> <@${req.body.botid}> has been denied by <@${user.id}>`)
    res.redirect('/admin/dashboard/pendingbot')
      } else{
        res.redirect("/error/loginerror")
      }
});

module.exports = router;
