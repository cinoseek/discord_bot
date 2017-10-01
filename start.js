const Discord = require('discord.js');
const settings = require('./settings.json');
const client = new Discord.Client();

const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./google_api_auth.json');

const math = require('mathjs');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet(settings.alias_sheet_id);
var alias_list = [];
var prefix = '!'

function make_alias_list() {
    /*
        fix cell contents
        A1 : alias
        B1 : resp
    */
    alias_list = [];

    // Authenticate with the Google Spreadsheets API.
    doc.useServiceAccountAuth(creds, function (err) {
        // Get all of the rows from the spreadsheet.
        doc.getRows(1,{
            offset: 1,
            limit: 100,
        }, function (err, rows) {
            console.log('Read '+rows.length+' rows');
            for ( i in rows ) {
                alias_list[prefix + rows[i].alias] = rows[i].resp;
            }
            console.log(alias_list);
        });
    });
}
make_alias_list();

client.on('ready',() => {
    console.log('Online');
});

client.on('message', message => {
    try {
        if (message.author === client.user) return;

        // run only prefix msg
        var msg = message.content;
        if (!msg.startsWith(prefix)) return;

        // test ping
        if (msg.startsWith(prefix + 'ping')) {
            console.log(message.author.username + " : " + message.content);
            message.channel.sendMessage('pong');
            return;
        }

        // reload google spreadsheet list
        if (msg.startsWith(prefix + 'reload')) {
            make_alias_list();
            message.channel.sendMessage('Reload List. Plz Wait...');
            return;
        }

        // Print All
        if (msg.startsWith(prefix + '도움')) {
            all = '';
            for ( i in alias_list) {
                all = all + i + ' ';
            }
            message.channel.sendMessage(all);
            return;
        }

        if (msg.startsWith(prefix + '계산')) {
            formula = msg.replace(msg.split(' ')[0],'').trim();
            message.channel.sendMessage(formula + ' = ' + math.eval(formula));
            return;
        }

        if (msg.startsWith(prefix + '선택')) {
            items = (msg.replace(msg.split(' ')[0],'').trim()).split(' ');
            message.channel.sendMessage(message.author.username + ' 선택: ' + items[math.floor(math.random() * items.length)]);
            return;
        }

        // print google sheet items
        if (alias_list[msg]) {
            message.channel.sendMessage(alias_list[msg]);
        }

    }
    catch(err) {
        // nothing
    }
});

client.login(settings.discord_token);
