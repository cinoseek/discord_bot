const math = require('mathjs');

// Type practice
var type_array = [];
var typeon = false;
var type_stime;
var type_etime;
var typemsg;
var typenum;

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
exports.on = function() {
    return typeon;
}
exports.get_typemsg = function(type_list) {
    pick = math.floor(math.random() * type_list.length);
    typemsg = type_list[pick];
    typenum = typemsg.kortypecount();
    return typemsg;
}
exports.start_type = function(message) {
    message.channel.sendMessage("5초후 제시문을 타이핑하세요. 제한 시간 60초");
    type_array = [];
    console.log('type msg: ' + typemsg + ' count:' + typenum);
    setTimeout(timer_type_start, 5*1000, message);
    setTimeout(timer_type_wait, 60*1000, message);
}
exports.match_type = function(message) {
    type_etime = Date.now();
    interval = (type_etime - type_stime)/1000.0;
    speed = Number((typenum*60.0/interval).toFixed(1));
    type_array.push([message.author.toString(), speed]);
}