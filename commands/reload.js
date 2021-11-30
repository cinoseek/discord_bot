const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');


var stock_list = [];

exports.make_stock_list = function() {
    stock_list = [];
    fs.createReadStream(path.resolve(__dirname, '.', 'tickers.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => stock_list.push([row['name'], row['ticker']]))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
}

exports.get_stock_list = function() {
    return stock_list;
}