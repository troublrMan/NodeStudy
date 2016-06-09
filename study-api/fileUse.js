var fs = require('fs');
var async = require('async');
var path = require('path');
var zlib = require('zlib');

var File = function(path) {
    this.path = path;
}

/**
 * 根据目录和文件名数组返回文件路径数组
 */
function fullPath(dir, files) {
    return files.map(function(file) {
       return path.resolve(dir, file); 
    });
}

/**
 * 复制文件或文件夹
 */
File.prototype.copy = function(dir, destination, callback) {
    var callee = arguments.callee;
    if(arguments.length == 2) {
        callback = destination;
        destination = dir;
        dir = this.path;
    }
    fs.stat(dir, function(err, stats) {
        if(err) return callback(err);
        
        if(stats.isDirectory()) {
            var newDestination = path.resolve(destination, path.basename(dir));
            fs.mkdir(newDestination, function(err) {
                if(err) return callback(err);
                fs.readdir(dir, function(err, files) {
                    var dirs = fullPath(dir, files);
                    async.each(dirs, function(item, errcall) {
                        callee(item, newDestination, callback);
                    }, function(err) {
                        if(err) return callback(err);
                    });
                });
            });
        } else if(stats.isFile()) {
            fs.readFile(dir, function(err, data) {
                var paths = path.resolve(destination, path.basename(dir));
                fs.writeFile(paths, data, function(err) {
                   if(err) return callback(err);
                   callback(null);
                });
            });
        } else {
            return callback('file types err');
        }
    });
};

/**
 * 大文件拷贝
 */
File.bigFileCopy = function(path, dst, callback) {
    fs.stat(path, function(err, stats) {
       if(err) return callback(err);
       if(!stats.isFile()) return callback(err);
       var filesize = stats.size;
       var copysize = 0;
       
       var readprogress = fs.createReadStream(path)
    //    readprogress.pipe(fs.createWriteStream(dst));
       readprogress.on('data', function(chunk) {
          copysize += chunk.length;
          console.log('复制文件进度：' + copysize/filesize * 100 + '%');
        //   readprogress.pause();
       });
       readprogress.on('end', function() {
          callback(null, 'end'); 
       });
    });
}

/**
 * 测试文件流
 */
File.testStream = function(path) {
    var rr = fs.createReadStream(path);
    rr.on('readable', function() {
        console.log('readable: ' + rr.read());
    });
    rr.on('end', function() {
        console.log('end');
    });
}

module.exports = File;