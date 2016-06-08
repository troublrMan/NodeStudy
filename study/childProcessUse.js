var child_process = require('child_process');

var util = require('util');

/**
 * 使用os命令复制文件
 */
function copy(source, target, callback) {
    child_process.exec(util.format('cp -r %s %s', source, target), callback);
}
exports.copy = copy;