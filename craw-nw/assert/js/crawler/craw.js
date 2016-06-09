var http = require('http');

(function (w){
	var Craw = function () {
		this.url = '';
	}

	Craw.prototype.setUrl = function(url) {
		this.url = url;
	}

	Craw.prototype.getData = function(callback) {
		var url = this.url;
		var defer = $.Deferred();
		http.get(url, function (res){
			var size = 0;
			var chunks = [];
			res.on('data', function (chunk){
				size += chunk.length;
				chunks.push(chunk);
			});
			res.on('end', function (){
				var data = Buffer.concat(chunks, size);
				callback && callback(data.toString());
			});
		}).on('error', function (e){
			console.log("Get a error: " + e);
		});
	}

	var craw = new Craw();
	w.craw = craw;

})(window);