var fs = require('fs');
var superagent = require('superagent');
// var cheerio = require('cheerio');   //为什么会找不到module ??
var cheerio = require('../node_modules/cheerio/lib/cheerio.js');

var configFileName = '/home/code/nodejs/NodeStudy/async-sequence/util/rss.txt';
function checkForRSSFile() {
    fs.stat(configFileName, function(err, stats) {
       if(err) return next(err);
       if(!stats.isFile()) return next(new Error(configFileName + ' 不是文件'));
       next(null, configFileName);
    });
}

function readRSSFile(configFileName) {
    fs.readFile(configFileName, function(err, feedList) {
        if(err) return next(err);
        feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split('\n');
        var random = Math.floor(Math.random() * feedList.length);
        next(null, feedList[random]);
    });
}

function downloadRSSFeed(feedUrl) {
    console.log(feedUrl);
    superagent
        .post(feedUrl)
        .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/50.0.2661.102 Chrome/50.0.2661.102 Safari/537.36')
        .end(function(err, res) {
           if(err) return next(err);
           if(res.statusCode != 200) return next(new Error('不能正确请求：' + feedUrl));
           next(null, res);
        });
}

function parseRSSFeed(rss) {
    var $ = cheerio.load(rss.text);
    if(!$) return next(new Error('no rss items found'));
    var domList = [];
    $('.item').each(function(i, elem) {
        domList[i] = elem;
        
    });
}

var tasks = [checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed];

function next(err, result) {
    if(err) throw err;
    var currentTask = tasks.shift();
    if(currentTask) {
        currentTask(result);
    }
}

module.exports = next;