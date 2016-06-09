var File = require('./fileUse');
var buffer = require('./bufferUse');
var netuse = require('./netuse');
var childProcessUse = require('./childProcessUse');
var path = require('path');

var dir = path.normalize('E:/test/nodetest/newforder/');
var file = new File(dir);

// file.copy('E:/test', function(err) {
//     if(err) console.error(err);
// });

// File.testStream('E:/test/hello.txt');

// File.bigFileCopy('E:/test/沉睡的商人.rar', 'E:/test/nodetest/test.rar', function(err, end) {
//     if(err) console.error(err);
//     if(end) console.log(end);
// });

// buffer.testBuffer();

// netuse.server();

childProcessUse.copy('E:/test/沉睡的商人.rar', 'E:/test/nodetest/test.rar', function() {
    console.log('ok..');
})