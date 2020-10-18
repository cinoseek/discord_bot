// Create a document object using the ID of the spreadsheet - obtained from its URL.
const settings = require('../settings.json');
const creds = require('../google_api_auth.json');
const GoogleSpreadsheet = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(settings.alias_sheet_id);

var alias_list = [];
var type_list  = [];
var stock_list = [];

exports.make_alias_list = function() {
    /*
        fix cell contents
        A1 : alias
        B1 : resp
    */
    alias_list = [];
    type_list  = [];
    stock_list = [];

    // Authenticate with the Google Spreadsheets API.
    doc.useServiceAccountAuth(creds, function (err) {
        // Get all of the rows from the spreadsheet.
        doc.getRows(1,{
            offset: 1,
            limit: 1000,
        }, function (err, rows) {
            console.log('Read alias '+rows.length+' rows');
            for ( i in rows ) {
                alias_list[rows[i].alias] = rows[i].resp;
            }
            //console.log(alias_list);
        });
        doc.getRows(2,{
            offset: 1,
            limit: 1000,
        }, function (err, rows) {
            console.log('Read type '+rows.length+' rows');
            for ( i in rows ) {
                type_list.push(rows[i].type);
            }
            //console.log(type_list);
        });
        doc.getRows(3,{
            offset: 1,
            limit: 3000,
        }, function (err, rows) {
            console.log('Read type '+rows.length+' rows');
            for ( i in rows ) {
                stock_list.push([rows[i].name, rows[i].code]);
            }
            //console.log(stock_list);
        });
    });
}

exports.get_alias_list = function() {
    return alias_list;
}

exports.get_type_list = function() {
    return type_list;
}

exports.get_stock_list = function() {
    return stock_list;
}
// First Loading
//make_alias_list();
