var Discord = require('discord.js')
var bot = new Discord.Client;
var mysql = require('mysql')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'botlist'
});

connection.connect((err)=> {
  if (err){
      throw err;
  }
  console.log('MySQL veritabanına başarıyla bağlanıldı.'); 
});

bot.login('ODI5NzUwODc3MDU2MjcwNDI2.YG8ruQ.fADmVaZUksSVv038MNXN8iE2qkg')

bot.on('ready', async()=>{
  console.log('Bot hazır')
})

module.exports.bot = bot;
module.exports.connection = connection;