var fs = require('fs');

var completeTasks = 0;
var tasks = [];
var wordCounts = {};

//闲来无事就拿 util 目录作测试了
var filesDir = '/home/code/nodejs/NodeStudy/async-sequence/util';

/**
 * 检查异步并发的任务是否完成
 */
function checkIfComplete() {
    completeTasks++;
    if(completeTasks == tasks.length) {
        for(var index in wordCounts) {
            console.log(index + ': ' + wordCounts[index]);
        }
    }
}

/**
 * 处理文档，统计文档中单词
 * 正则表达 /\W+/ 除了数字字母下划线外的连续字符，用这个切割得到 ‘字母、数字、下划线’ 组成的单词
 */
function countWordsInText(text) {
    var words = text
        .toString()
        .toLowerCase()
        .split(/\W+/)
        .sort();
    for(var index in words) {
        var word = words[index];
        if(word) {
            wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
        }
    }
}

/**
 * 异步并发的读取目录下的文本
 */
module.exports = function () {
    fs.readdir(filesDir, function(err, files) {
        if(err) throw err;
        for(var index in files) {
            var task = (function(file) {
                return function() {
                    fs.readFile(file, function(err, text) {
                        if(err) throw err;
                        countWordsInText(text);
                        checkIfComplete();
                    });
                }
            })(filesDir + '/' + files[index]);
            tasks.push(task);
        }
        for(var task in tasks) {
            tasks[task]();
        }
    });
};