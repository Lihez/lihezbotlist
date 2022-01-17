var express = require('express');
var router = express.Router();
var {con} = require('../app')
var {bot} = require('../bot')
const setting = require('../setting.json')
const crypto = require('crypto');
const request = require('request');


var OAuthClient = require('discord-oauth2');
const oauthclient = new OAuthClient({
  clientId: setting.bot.botid,
  clientSecret: setting.bot.secret,
  redirectUri: "http://www.lihezbl.tk/callback", 
});

/* GET home page. */
router.get('/', async(req, res) => {
  var key = req.session.key;

  let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
    scope: ["identify", "guilds","email"],
    state: crypto.randomBytes(16).toString("hex"), 
  });

  const veri = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM bots WHERE premium = ? LIMIT 12 ORDER BY vote DESC`, ['certified'], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});

const voted = await new Promise((resolve, reject) => {
  con.query(`SELECT * FROM bots WHERE status = ? LIMIT 24 ORDER BY vote DESC`, ['approved'], function (err, result) {
      if (err)
          reject(err);
      resolve(result);
  });
});

if (key != '0' && key != null && key != undefined) {
  let user = await oauthclient.getUser(key);
  res.render('index', {
    title: "Home - Lihez BotList",
    data:veri,
    voted:voted,
    user: user
  })
  } else{
    res.render('index', {
      title: "Home - Lihez BotList",
      data:veri,
      login: loginurl,
      voted:voted,
      user: "yok" //index.ejs'yi ve user diye bir değişken gönder
    });  
  }
});

  router.get('/callback', async(req,res) =>{
    var code = req.query.code;
    if (code != '0' && code != null && code != undefined) {
      let userkey = await oauthclient.tokenRequest({
        code: code,
        grantType: "authorization_code",
        scope: ["identify", "guilds", "email"]
      }).catch(console.error);
      req.session.key = userkey.access_token;
      var key = req.session.key;
      let user = await oauthclient.getUser(key);
      const veri = await new Promise((resolve, reject) => {
        con.query(`SELECT * FROM users WHERE userid = ?`, [user.id], function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
if(veri.length < 1){
        con.query(`INSERT INTO users(userid,username,pp,email,role) VALUE(?,?,?,?,?)`,[user.id,`${user.username}#${user.discriminator}`,`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar} ? 'gif' : 'png'`,user.email,'user'], function (err, result) {
            if (err) console.log(err)
        });
        return res.redirect('/')
      }else{
        con.query(`UPDATE users SET username = ?, pp = ?, email = ? WHERE userid = ?`,
        [`${user.username}#${user.discriminator}`,`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar} ? 'gif' : 'png'`,user.email, user.id], function (err, result) {
          if (err) console.log(err)
      });

    const bot = await new Promise((resolve, reject) => {
      con.query(`SELECT * FROM bots WHERE ownerID = ?`, [user.id], function (err, result) {
          if (err)
              reject(err);
          resolve(result);
      });
  });      
    if(bot.length < 1){
    return res.redirect('/')
    }

      con.query(`UPDATE bots SET ownerName = ?, ownerPP = ? WHERE ownerID = ?`,
      [`${user.username}#${user.discriminator}`,`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar} ? 'gif' : 'png'`, user.id], function (err, result) {
        if (err) console.log(err)
    });
      res.redirect('/')
    }
    } else {
      res.redirect('/error/callbackerror')
  }
});
  
  router.get('/profile/:id', async(req, res) => {
    var key = req.session.key;
    var id = req.params.id
    let loginurl = oauthclient.generateAuthUrl({ //loginurl'i  tanımla
      scope: ["identify", "guilds","email"],
      state: crypto.randomBytes(16).toString("hex"), 
    });
  
    const bots = await new Promise((resolve, reject) => {
      con.query(`SELECT * FROM bots WHERE ownerID = ?`, [id], function (err, result) {
          if (err)
              reject(err);
          resolve(result);
      });
  });

  const users = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM users WHERE userid = ?`, [id], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});
  if(users.length < 1){
    return res.redirect('/error/profileerror')
  }
  if (key != '0' && key != null && key != undefined) {
    let user = await oauthclient.getUser(key);
    res.render('profile', {
      title: "Profile - Lihez BotList",
      bot:bots,
      users:users,
      user: user
    })
    } else{
      res.render('profile', {
        title: "Profile - Lihez BotList",
        login: loginurl,
        bot:bots,
        users:users,
        user: "yok" //index.ejs'yi ve user diye bir değişken gönder
      });  
    }
  });
  
  router.get('/addbot', async(req, res) => {
    var key = req.session.key;
  
  if (key != '0' && key != null && key != undefined) {
    let user = await oauthclient.getUser(key);
    res.render('addbot', {
      title: "Add Bot - Lihez BotList",
      user: user
    })
    } else{    
      return res.redirect('/error/loginerror')
    }
  });

  router.post('/addbot', async(req, res) => {
    if(req.body.ownerid < 1 || req.body.botid < 1 || req.body.prefix < 1 || req.body.shord < 1 || req.body.longd < 1){
      res.redirect('/error/emptyform')
    }

    const bots = await new Promise((resolve, reject) => {
      con.query(`SELECT * FROM bots WHERE botID = ?`, [req.body.botid], function (err, result) {
          if (err)
              reject(err);
          resolve(result);
      });
  });
  if(bots.length > 0){return res.redirect('/error/botindb')}

    var key = req.session.key;
  
    if (key != '0' && key != null && key != undefined) {
      request(`https://discord.com/api/v8/users/${req.body.botid}`,{
        headers: {
          Authorization: `Bot ${setting.bot.token}`,
        }
    }
    , async (error, response, body) => {
          var request = JSON.parse(body);

          if (request.bot != true){
            return res.redirect('/error/itisntbot')
          } 

          let user = await oauthclient.getUser(key);

      con.query(`INSERT INTO 
      bots(botID,ownerID,botPP,botName,botPrefix,shortD,longD,supportServer,website,premium,vote,status,ownerName,ownerPP) 
      VALUE(?,?,?,?,?,?,?,?,?,"normal","0","pending",?,?)`,
      [request.id, req.body.ownerid,`https://cdn.discordapp.com/avatars/${request.id}/${request.avatar}.png`, `${request.username}#${request.discriminator}`,req.body.prefix, req.body.shortd , req.body.longd , req.body.supportServer,req.body.website,user.username,`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar} ? 'gif' : 'png'`], function (err, result) {
        if (err) console.log(err)
    });
    bot.channels.cache.get('921722590404427806').send(`<a:yildiz:833702855403372654> <@${req.body.botid}> / **${request.username}#${request.discriminator}** has been added to the queue`)
    res.redirect(`/profile/${req.body.ownerid}`)
      });
     } else{    
        return res.redirect('/error/addboterror')
      }

  });
  

  router.get('/bot/:id', async(req, res) => {
    var key = req.session.key;
    var id = req.params.id
  
    let loginurl = oauthclient.generateAuthUrl({ //loginurl'i tanımla
      scope: ["identify", "guilds","email"],
      state: crypto.randomBytes(16).toString("hex"), 
    });
  
    const veri = await new Promise((resolve, reject) => {
      con.query(`SELECT * FROM bots WHERE botID = ?`, [id], function (err, result) {
          if (err)
              reject(err);
          resolve(result);
      });
  });
  if(veri[0] < 1){
    return res.redirect('/error/botnotfound')
  }

  if(veri[0].status == "pending"){
    return res.redirect('/error/botnotfound')
  }
  request(`https://discord.com/api/v8/users/${id}`,{
        headers: {
          Authorization: `Bot ${setting.bot.token}`,
        }
    }
    , async (error, response, body) => {
          var request = JSON.parse(body);
          con.query(`UPDATE bots SET botPP = ?, botName = ? WHERE botID = ?`,
          [`https://cdn.discordapp.com/avatars/${request.id}/${request.avatar}.png`, `${request.username}#${request.discriminator}`, id], function (err, result) {
            if (err) console.log(err)
        });
    })
        
  
  if (key != '0' && key != null && key != undefined) {
    let user = await oauthclient.getUser(key);
    res.render('Bot', {
      title: "Bot - Lihez BotList",
      data:veri,
      user: user
    })
    } else{
      res.render('Bot', {
        title: "Bot - Lihez BotList",
        data:veri,
        login: loginurl,
        user: "yok" //index.ejs'yi ve user diye bir değişken gönder
      });  
    }
  });


  router.get('/vote/:id', async(req, res) => {
    var key = req.session.key;

  if (key != '0' && key != null && key != undefined) {
    let user = await oauthclient.getUser(key);

    const veri = await new Promise((resolve, reject) => {
      con.query(`SELECT * FROM vote WHERE username = ?`, [user.id], function (err, result) {
          if (err)
              reject(err);
          resolve(result);
      });
  });
  const data = await new Promise((resolve, reject) => {
    con.query(`SELECT * FROM bots WHERE botID = ?`, [req.params.  id], function (err, result) {
        if (err)
            reject(err);
        resolve(result);
    });
});
    
    var newvote = data[0].vote;
    newvote++
    var a = new Date();
    var date = `${a.getDate()}/${a.getMonth()}/${a.getFullYear()}`;
    if(veri.length < 1){
    con.query(`INSERT INTO vote(botID,username,voteDate) VALUE(?,?,?)`,[req.params.id,user.id,date], function (err, result) {
      if (err) console.log(err)

      con.query(`UPDATE bots SET vote = ? WHERE botID = ?`,
      [newvote,req.params.id], function (err, result) {
        if (err) console.log(err)
    });
  });
  res.redirect(`/bot/${req.params.id}`)
}else{
      if(veri[0].voteDate >= date){
      return res.redirect('/error/24hours')
    }

  con.query(`UPDATE vote SET voteDate = ? WHERE username = ?`,
  [date,user.id], function (err, result) {
    if (err) console.log(err)
});

con.query(`UPDATE bots SET vote = ? WHERE botID = ?`,
[newvote,req.params.id], function (err, result) {
  if (err) console.log(err)
});
}
  res.redirect(`/bot/${req.params.id}`)
    } else{    
      return res.redirect('/error/loginerror')
    }
  });


  router.get('/invite/:id', async(req, res) => {
    res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.params.id}&scope=bot&permissions=0`)
  });

module.exports = router;
