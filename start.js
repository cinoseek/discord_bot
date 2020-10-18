const Discord = require('discord.js');
const settings = require('./settings.json');
const client = new Discord.Client();

const reload = require('./commands/reload.js');
const type = require('./commands/type.js');
const stock = require('./commands/stock.js');

var prefix = '!';
var alias_list = [];
var type_list = [];
var stock_list = [];
var type_msg = "";
var typeon = false;

client.on('ready',() => {
    console.log('Online');
    reload.make_alias_list();
    alias_list = reload.get_alias_list();
    type_list = reload.get_type_list();
    stock_list = reload.get_stock_list();
});

client.on('message', message => {
    try {
        // run only prefix msg
        var msg = message.content;
        if (!type.on && !msg.startsWith(prefix)) return;

        // test ping
        if (msg.startsWith(prefix + 'ping')) {
            console.log(message.author.username + " : " + message.content);
            message.channel.sendMessage('pong');
            return;
        }

        switch(msg.split(' ')[0]) {
            case "!reload": {
                reload.make_alias_list();
                alias_list = reload.get_alias_list();
                type_list = reload.get_type_list();
                stock_list = reload.get_stock_list();
                message.channel.sendMessage('Reload List. Plz Wait...');
            } break;
            case "!도움": {
                all = '명령어 목록: ';
                for ( i in alias_list) {
                    all = all + i + ' ';
                }
                message.channel.sendMessage(all);
                console.log(alias_list);
            } break;

            case "!주식": {
                if (msg.split(' ')[1])
                    stock.now_price(message, stock_list, msg.split(' ')[1]);
            } break;

            case "!타자연습": {
                type_msg = type.get_typemsg(type_list);
                type.start_type(message);
            } break;
            
            default: {
                if (alias_list[msg]) {
                    message.channel.sendMessage(alias_list[msg]);
                }
                if (msg.startsWith(type_msg)) {
                    type.match_type(message);
                }
            } break;
        }
        return;
    }
    catch(err) {
        // nothing
        console.log("Catch Error");
    }
});

client.login(settings.discord_token);
