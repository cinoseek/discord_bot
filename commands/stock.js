const request = require('request');
const cheerio = require('cheerio');
const iconv   = require('iconv-lite');

var ret = "";

var get_price = function(code, callback) {
    let url_base = "https://finance.naver.com/item/main.nhn?code=";
    let url_full = url_base + code;
    request.get({ url: url_full, encoding: null }, function (err, response, body) {
        let $ = cheerio.load(iconv.decode(body, "EUC-KR").toString());
        let arr = [];
        $('div.new_totalinfo > dl.blind > dd').each(function (index, ele) {
            arr[index] = $(this).text();
        });
        let temp = arr[3].split(' ');
        ret = arr[1].split(' ')[1] + " " + temp[1] + " (" + temp[3] + " " + temp[4] + " / " + temp[5] + temp[6] + "%)";
        ret = ret.replace("상승", "▲");
        ret = ret.replace("보합", "━");
        ret = ret.replace("하락", "▼");
        ret = ret.replace("플러스", "+");
        ret = ret.replace("마이너스", "-");
        console.log("get_price: " + ret);
        callback(ret);
    });
}

exports.now_price = function(message, stock_list, stocks, callback) {
    var code_list = [];
    stocks.forEach(function(element, index, array){
        var code = stock_list.filter(function(value,index) {return value[0] === element.toUpperCase();});
        if (code.length)
            code_list.push(code[0][1]);
    });
    console.log(code_list);
    var all = "";
    var count = 0;
    code_list.forEach(function(element, index, array){
        get_price(element, function(ret){
            ret = "> " + ret;
            all =  all + ret + "\n";
            count++;
            if (count == array.length) {
                message.channel.sendMessage(all);
            }
        });
    });
}

exports.find_stock = function(message, stock_list, name, callback) {
    var code_list = [];
    var all = "> ... ";
    code_list = stock_list.filter(function(value,index) {return value[0].indexOf(name.toUpperCase()) >= 0;});

    code_list.forEach(function(element, index, array){
        all = all + " " + element[0];
    });
    message.channel.sendMessage(all);
}