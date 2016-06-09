var mime = require('mime');
var path = require('path');
var fs = require('fs');

var staticFileCache = {};

function send404(response) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404: resource not found');
    response.end();
}

function send500(response, err) {
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.write(err);
    response.end();
}

function sendFile(response, filePath, fileContens) {
    response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
    response.end(fileContens);
}

function serverStatic(response, absPath) {
    if(staticFileCache[absPath]) {
        sendFile(response, absPath, staticFileCache[absPath]);
    } else {
        fs.access(absPath, fs.R_OK, function(err) {
           if(err) return send500(response, err.message);
           fs.readFile(absPath, 'utf8', function(err, data) {
              if(err) return send500(response, err.message);
              staticFileCache[absPath] = data;
              sendFile(response, absPath, data);
           });
        });
    }
}

module.exports = {
    send404: send404,
    send500: send500,
    sendFile: sendFile,
    serverStatic: serverStatic
}