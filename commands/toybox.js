/*
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

// Timer func
function timer_msg(message, caller , time, msg) {
    message.channel.sendMessage(caller + ' ' + time + '초 타이머 종료: ' + msg);
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
*/