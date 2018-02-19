const Discord = require('discord.js');
const settings = require('./settings.json');
const client = new Discord.Client();

const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./google_api_auth.json');

const math = require('mathjs');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet(settings.alias_sheet_id);
var alias_list = [];
var lucky_list = [];
var prefix = '!'

function make_alias_list() {
    /*
        fix cell contents
        A1 : alias
        B1 : resp
    */
    alias_list = [];
    lucky_list = [];

    // Authenticate with the Google Spreadsheets API.
    doc.useServiceAccountAuth(creds, function (err) {
        // Get all of the rows from the spreadsheet.
        doc.getRows(1,{
            offset: 1,
            limit: 1000,
        }, function (err, rows) {
            console.log('Read alias '+rows.length+' rows');
            for ( i in rows ) {
                alias_list[prefix + rows[i].alias] = rows[i].resp;
            }
            // console.log(alias_list);
        });
        doc.getRows(2,{
            offset: 1,
            limit: 1000,
        }, function (err, rows) {
            console.log('Read lucky '+rows.length+' rows');
            for ( i in rows ) {
                lucky_list.push(rows[i].lucky);
            }
            // console.log(alias_list);
        });
    });
}
make_alias_list();

// Timer func
function timer_msg(message, caller , time, msg) {
    message.channel.sendMessage(caller + ' ' + time + '초 타이머 종료: ' + msg);
}

client.on('ready',() => {
    console.log('Online');
});

client.on('message', message => {
    try {
        // if (message.author === client.user) return;

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
            all = '명령어 목록: ';
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
            //message.channel.sendMessage(message.author.username + ' 선택: ' + items[math.floor(math.random() * items.length)]);
            retmsg = items[math.floor(math.random() * items.length)]
            if (0 != retmsg.length)
                message.channel.sendMessage(retmsg);
            return;
        }

        // Timer
        // !타이머 1800 모닥불
        if (msg.startsWith(prefix + '타이머')) {
            items = (msg.replace(msg.split(' ')[0],'').trim()).split(' ');
            if (0 == items) {
                message.channel.sendMessage('ex) !타이머 1700초 모닥불');
            }
            else {
                time = parseInt(items[0]);
                msg  = items[1];
                message.channel.sendMessage(message.author.toString() + ' ' + time + '초 ' + msg + ' 타이머 시작');
                setTimeout(timer_msg, time*1000, message, message.author.toString(), time, msg);
            }
            return;
        }

        // lucky random print
        if (msg.startsWith(prefix + '운세')) {
            retmsg = lucky_list[math.floor(math.random() * lucky_list.length)]
            if (0 != retmsg.length)
                message.channel.sendMessage(retmsg);
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
