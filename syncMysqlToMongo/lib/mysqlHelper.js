var mysql = require('mysql');
var config = require('../config');

function getConnection(callback) {
    var connection = mysql.createConnection(config.mysqlConfig);
    connection.connect(function(err) {
       if (err && err.code === 'ECONNREFUSED') {
            if (process.env.CI) {
                throw err;
            }
       }
       
       if(err) {
           callback && callback(err);
       }
       
       callback && callback(null, connection);
    });
}
exports.getConnection = getConnection;