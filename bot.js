const discord = require('discord.js');
var client = new discord.Client();
var setting = require('./setting.json')

client.on('ready', async() => {
    console.log('Bot Hazır')
});

client.login(setting.bot.token)

module.exports = {bot:client}