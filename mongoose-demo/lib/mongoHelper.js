'use strict'

const mongoose = require('mongoose');
let dbconfig = require('../config').dbconfig;

function getConnection() {
    dbconfig.host = dbconfig.host || '127.0.0.1';
    dbconfig.port = dbconfig.port || '27017';
    if(!dbconfig.database) throw new Error('database is undefined');
    
    // + ':' + dbconfig.port
    const db = mongoose.createConnection('mongodb://' + dbconfig.host + '/' + dbconfig.database); 
    
    //监听 error 事件
    db.on('error', () => {
        throw new Error('connect error'); 
    });
    
    //监听 open 事件
    db.on('open', () => {
        // console.log('mongo open...');
    });
    
    return db;
}
exports.getConnection = getConnection;