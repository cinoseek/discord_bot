//const Discord = require('discord.js');
//const settings = require('./settings.json');
//const client = new Discord.Client();
const { Client, Intents } = require('discord.js');
const { token } = require('./settings.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const reload = require('./commands/reload.js');
const stock = require('./commands/stock.js');

var stock_list = [];


client.on('ready',() => {
    console.log('Online');
    reload.make_stock_list();
    stock_list = reload.get_stock_list();
});
/*
client.on("messageCreate", message  => {
    console.log(message.content);
    if (message.content === "ping") {
        message.reply("Pong!")
    }
  })
*/

client.on("messageCreate", message  => {
    try {
        var msg = message.content;
        if (message.author.bot) return false;
        if (!msg.startsWith("!")) return;

        // test ping
        if (msg.startsWith('!ping')) {
            message.reply("Pong!");
            message.channel.send("Pong!!");
            return;
        }

        switch(msg.split(' ')[0]) {
            case "!도움": {
                cmdlist = '명령어 목록:\n!주식 CJ, CJ CGV \n!종목찾기 LG';
                message.channel.send(cmdlist);
            } break;

            case "!주식": {
                if (msg.split(' ')[1]) {
                    var stockstr = msg.replace('!주식','');
                    var stocks = stockstr.split(',');
                    stocks.forEach(function(name, index) {
                        stocks[index] = name.trim();
                    });
                    console.log(stocks);
                    stock.now_price(message, stock_list, stocks);
                }
            } break;

            case "!종목찾기": {
                if (msg.split(' ')[1]) {
                    stock.find_stock(message, stock_list, msg.split(' ')[1]);
                }
            } break;

            default: {
            } break;
        }
        return;
    }
    catch(err) {
        // nothing
        console.log("Catch Error");
    }
});

client.login(token);
