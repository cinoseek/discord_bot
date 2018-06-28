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
var type_list  = [];
var prefix = '!';

// Type practice
var type_array = [];
var typeon = false;
var type_stime;
var type_etime;
var typemsg;
var typenum;

function make_alias_list() {
    /*
        fix cell contents
        A1 : alias
        B1 : resp
    */
    alias_list = [];
    lucky_list = [];
    type_list  = [];

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
        doc.getRows(3,{
            offset: 1,
            limit: 1000,
        }, function (err, rows) {
            console.log('Read type '+rows.length+' rows');
            for ( i in rows ) {
                type_list.push(rows[i].type);
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
// Type count
// ex) 'string'.kortypecount()
String.prototype.kortypecount = function() {
    var str = this;
    var sum = 0;
    var code = 0;

    // 타이핑 값
    //  초성   [ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ]
    var inum = [1,2,1,1,2,1,1,1,2,1,2,1,1,2,1,1,1,1,1 ]
    //  중성   [ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ]
    var mnum = [1,1,1,2,1,1,1,2,1,2,2,2,1,1,2,2,2,1,1,2,1 ];
    //  종성   [  ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ]
    var tnum = [0,1,2,2,1,2,2,1,1,2,2,2,2,2,2,2,1,1,2,1,2,1,1,1,1,1,1,1 ];
    var isound, msound, tsound;

    var cnt = str.length;
    for (var i = 0; i < cnt; i++) {
        code = str.charCodeAt(i);
        // 한글이 아닌 경우
        if (code < 0xAC00 || code > 0xD7A3) {
            sum += 1;
            continue;
        }

        code = str.charCodeAt(i) - 0xAC00;
        tsound = code % 28; // 종성
        msound = ((code - tsound) / 28 ) % 21 // 중성
        isound = (((code - tsound) / 28 ) - msound ) / 21 //초성

        sum += inum[isound];
        sum += mnum[msound];
        sum += tnum[tsound];
    }
    return sum;
}
// Type timer
function timer_type_start(message) {
    typeon = true;
    // 출력변조
    falsifymsg = ' ';
    for (i=0;i<typemsg.length;i++) {
        if (' ' == typemsg[i])
            falsifymsg = falsifymsg+'  ';
        else
            falsifymsg = falsifymsg+typemsg[i];
    }
    message.channel.sendMessage('제시문: '+ falsifymsg);
    type_stime = Date.now();
}
function timer_type_wait(message) {
    typeon = false;
    function type_sort(callback) {
        type_array.sort(function(a, b) {
            return b[1] - a[1];
        });
        callback();
    }
    type_sort(function() {
        var result="타자연습 결과\n";
        for (i=0;i<type_array.length;i++) {
            result += type_array[i][1] + "타/분 " + type_array[i][0] + '\n';
        }
        message.channel.sendMessage(result)
    });
}

client.on('ready',() => {
    console.log('Online');
});

client.on('message', message => {
    try {
        // if (message.author === client.user) return;

        // run only prefix msg
        var msg = message.content;
        if (!typeon && !msg.startsWith(prefix)) return;

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
            pick = math.floor(math.random() * lucky_list.length);
            retmsg = lucky_list[pick]
            console.log('lucky num: '+pick+'/'+lucky_list.length);
            if (0 != retmsg.length)
                message.channel.sendMessage(retmsg);
        }

        // type test
        if (!typeon && msg.startsWith(prefix + '타자연습')) {
            pick1 = math.floor(math.random() * type_list.length);
            pick2 = math.floor(math.random() * type_list.length);
            typemsg = type_list[pick1] + ' ' + type_list[pick2];
            typenum = typemsg.kortypecount();

            message.channel.sendMessage("5초후 제시문을 타이핑하세요.");
            type_array = [];
            console.log('type msg: ' + typemsg + ' count:' + typenum);
            setTimeout(timer_type_start, 5*1000, message);
            setTimeout(timer_type_wait, 30*1000, message);
        }
        if (msg.startsWith(typemsg)) {
            type_etime = Date.now();
            interval = (type_etime - type_stime)/1000.0;
            speed = Number((typenum*60.0/interval).toFixed(1));
            type_array.push([message.author.toString(), speed]);
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
