var express = require('express');
var router = express.Router();
const www = require('../bot');
const Discord = require('discord.js');
var body = require('body-parser');
const request = require('request');
const token = "bot-token";
const log = "log-channel-id";

const OAuthClient = require('disco-oauth');
const client = new OAuthClient('botid', 'bot-secret');
client.setRedirect('http://localhost:3000/callback');
client.setScopes('identify','guilds');

router.get('/', async(req, res) => {
  var key = req.cookies.get('key')
  const veri = await new Promise((resolve, reject) => {
    www.connection.query(`SELECT * FROM bots WHERE status = ?`, ['approved'],function (err, result) {
        if (err) 
        reject(err);
        resolve(result);
    });
});

  if(key){
    var user = await client.getUser(key);
    res.render('index', {
      data: veri,
      user: user,
    })
  }else{
    res.render('index', {
      data: veri,
      loginurl: client.auth.link,
      user: 'yok'
    })
  }
});

router.get('/callback', async(req,res) => {
  var code = req.query.code;
  if(code == undefined){
    res.redirect('/callback/error')
  }else{
    var userKey = await client.getAccess(code)
    res.cookies.set('key', userKey)
    res.redirect('/profile')
  }
});

router.get('/profile', async(req,res) => {
  var key = req.cookies.get('key')
  if(!key){
    res.redirect('/profile/error')
  }
  if(key){
    var user = await client.getUser(key);
    const veri = await new Promise((resolve, reject) => {
      www.connection.query(`SELECT * FROM bots WHERE ownerID = ?`, [user.id], function (err, result) {
          if (err) 
          reject(err);
          resolve(result);
      });
  });
    res.render('profile', {
      data: veri,
      user: user,
    })
  }
});

router.get('/addbot', async(req,res) => {
  var key = req.cookies.get('key')
  if(!key){
    res.redirect('/')
  }
  if(key){
    var user = await client.getUser(key);
    res.render('addbot', {
      user: user,
    })
  }
});

router.post('/addbot', async (req, res) => {
  var key = req.cookies.get('key')
  if(!key){
    return res.redirect('/addbot/error-user')
  }
  const veri = await new Promise((resolve, reject) => {
    www.connection.query(`SELECT * FROM bots WHERE botID = ?`, [req.body.botID], function (err, result) {
        if (err) 
        reject(err);
        resolve(result);
    });
});


  if(veri.length > 0){
    return res.redirect('/addbot/bot-error')
  }else{
    request({
      url: `https://discordapp.com/api/v7/users/${req.body.botID}`,
      headers: {
      "Authorization": `Bot ${token}`
      },
      }, async(error, response, body) => {
      if (error) return console.log(error)
      else if (!error) {
      var bot = JSON.parse(body)
      if(bot.bot != true){
        return res.redirect('/addbot/error')
      }
    www.connection.query(`INSERT INTO bots (ownerID,botID,botPP,botName,botPrefix,shortD,longD,supportServer,website,premium,vote) values (?,?,?,?,?,?,?,?,?,"normal","0")`, [req.body.ownerID,req.body.botID,`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=256`,`${bot.username}#${bot.discriminator}`,req.body.prefix,req.body.shortD,req.body.longD,req.body.supportServer,req.body.website], function (err, result) {
        if (err) console.log(err)
    });
    www.bot.channels.cache.get(log).send(`<@!${bot.id}> adlı bot sıraya eklendi`)
  }})

}
});

router.get('/bot/:botID', async(req,res) => {
  var botid = req.params.botID
  const veri = await new Promise((resolve, reject) => {
    www.connection.query(`SELECT * FROM bots WHERE botID = ?`, [botid], function (err, result) {
        if (err) 
        reject(err);
        resolve(result);
    });
});
  if(veri.length < 1){
   return res.redirect(`/bot/${botid}/error`)
  }
  request({
    url: `https://discordapp.com/api/v7/users/${botid}`,
    headers: {
    "Authorization": `Bot ${token}`
    },
    }, async(error, response, body) => {
    if (error) return console.log(error)
    else if (!error) {
    var bot = JSON.parse(body)
    var key = req.cookies.get('key')
    if(!key){
      if(veri[0].status != 'approved'){
        return res.redirect(`/bot/${botid}/data-error`)
      }
      res.render('bot', {
        loginurl: client.auth.link,
        user: 'yok',
        bot:bot,
        shortD: veri[0].shortD,
        longD: veri[0].longD,
        vote: veri[0].vote,
        website: veri[0].website,
        supportServer: veri[0].supportServer,
      })
    }
    if(key){
      var user = await client.getUser(key);
      if(veri[0].status != 'approved'){
        if(user.id != veri[0].ownerID || user.id != '800809750584492052'){
        return res.redirect(`/bot/${botid}/data-error`)
      }
      }
      res.render('bot', {
        user: user,
        bot:bot,
        shortD: veri[0].shortD,
        longD: veri[0].longD,
        vote: veri[0].vote,
        website: veri[0].website,
        supportServer: veri[0].supportServer,
      })
    }
    www.connection.query(`UPDATE bots SET botPP = ? WHERE botID =?`, [`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png?size=256`,req.params.botID], function (err, result) {
      if (err) console.log(err)
    });
    www.connection.query(`UPDATE bots SET botName = ? WHERE botID =?`, [`${bot.username}#${bot.discriminator}`,req.params.botID], function (err, result) {
      if (err) console.log(err)
    });
    }})
});

router.get('/vote/:botID', async(req,res) => {
  var eskioy = await new Promise((resolve, reject) => {
    www.connection.query(`SELECT vote FROM bots WHERE botID = ?`, [req.params.botID], function (err, result) {
        if (err) 
        reject(err);
        resolve(result);
    });
});
var votedate = await new Promise((resolve, reject) => {
  www.connection.query(`SELECT voteDate FROM vote WHERE botID = ?`, [req.params.botID], function (err, result) {
      if (err) 
      reject(err);
      resolve(result);
  });
});
  var key = req.cookies.get('key')
  if(!key){
    return res.redirect(`/vote/${req.params.botID}/user-error`);
  }
  var date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;

  var user = await client.getUser(key);
if(votedate.length < 1){
www.connection.query(`INSERT INTO vote (botID,username,voteDate) values (?,?,?)`, [req.params.botID,user.id,date], function (err, result) {
    if (err) console.log(err)
});

www.connection.query(`UPDATE bots SET vote ='${parseInt(eskioy[0].vote) + 1}' WHERE botID = ?`, [req.params.botID],function (err, result) {
  if (err) console.log(err)
});

return  res.redirect(`/bot/${req.params.botID}`)
}else{
  if(votedate[0].voteDate == date){
    return res.redirect(`/vote/${req.params.botID}/date-error`)
  }

  www.connection.query(`UPDATE bots SET vote ='${parseInt(eskioy[0].vote) + 1}' WHERE botID = ?`, [req.params.botID], function (err, result) {
    if (err) console.log(err)
});

www.connection.query(`UPDATE vote SET voteDate ='${date}' WHERE botID = ?`,[req.params.botID], function (err, result) {
  if (err) console.log(err)
});

res.redirect(`/bot/${req.params.botID}`)
}
})

/* error pages */
router.get('/callback/error', async(req,res) => {
  res.render('errors/callback')
});

router.get('/profile/error', async(req,res) => {
  res.render('errors/cookies')
});

router.get('/addbot/bot-error', async(req,res) => {
  res.render('errors/addbot-error')
});

router.get('/addbot/error', async(req,res) => {
  res.render('errors/addbot')
});

router.get('/bot/:botID/error', async(req,res) => {
  res.render('errors/bot')
});

router.get('/vote/:botID/date-error', async(req,res) => {
  res.render('errors/date')
});

router.get('/vote/:botID/user-error', async(req,res) => {
  res.render('errors/cookies')
});

router.get('/bot/:botID/data-error', async(req,res) => {
  res.render('errors/data')
});




module.exports = router;
