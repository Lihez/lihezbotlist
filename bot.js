var Discord = require('discord.js')
var bot = new Discord.Client;
var mysql = require('mysql')
var setting = require('./setting.json')

var connection = mysql.createConnection({
  host     : setting.sql.host,
  user     : setting.sql.user,
  password : setting.sql.password,
  database : setting.sql.database
});

connection.connect((err)=> {
  if (err){
      throw err;
  }
  console.log('MySQL veritabanına başarıyla bağlanıldı.'); 
});

bot.login(setting.bot.token)

bot.on('ready', async()=>{
  console.log('Bot hazır')
})

module.exports.bot = bot;
module.exports.connection = connection;
