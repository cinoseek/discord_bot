const axios = require('axios');
const API_KEY = '<APIKEY>';

async function get_price_us(ticker) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data['Error Message']) {
            console.error('[API]', data['Error Message']);
            return null;
        }

        if (data['Note']) {
            console.warn('[API] ', data['Note']);
            return null;
        }

        const globalQuote = data['Global Quote'];

        if (!globalQuote || Object.keys(globalQuote).length === 0) {
            console.error('[Data Error]', 'No globalQuote');
            console.log('API data:', data);
            return null;
        }

        return {
            symbol: globalQuote['01. symbol'],
            price: parseFloat(globalQuote['05. price']),
            change: parseFloat(globalQuote['09. change']),
            changePercent: globalQuote['10. change percent'] // 예: '0.7200%' 또는 '-0.1500%'
        };

    } catch (error) {
        console.error('[Error]', 'API request Fail: ', error.message);
        return null;
    }
}

exports.now_price_us = async function(message, stocks) {
    const code_list = stocks;

    if (code_list.length === 0) {
        return;
    }

    console.log('ticker:', code_list);

    const promises = code_list.map(ticker => get_price_us(ticker));
    const results = await Promise.all(promises);

    let all = "```diff\n";
    results.forEach((data, index) => {
        if (data && data.price != null) {
            let sign = " ";
            let symbol = "━";

            if (data.change > 0) {
                sign = "+";
                symbol = "▲";
            } else if (data.change < 0) {
                sign = "-";
                symbol = "▼";
            }

            let changePercentStr = data.changePercent.replace('%', '');

            if (data.change > 0 && !changePercentStr.startsWith('+')) {
                changePercentStr = '+' + changePercentStr;
            }

            const line = `${sign} ${data.symbol} : $${data.price.toFixed(2)} (${symbol} ${data.change.toFixed(2)} / ${changePercentStr}%)\n`;
            all += line;

        } else {
            const failedTicker = code_list[index];
            all += `- ${failedTicker} : fail info\n`;
        }
    });

    all += "```";

    message.channel.send(all);
};