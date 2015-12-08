var cheerio = require('cheerio');

/**
 * 爬虫数据分析器
 */
var Analyzer = function() {
	this.data = '';
}

Analyzer.prototype.setData = function(data) {
	this.data = data;
}

Analyzer.prototype.getMessage = function($) {
	var $ = cheerio.load(this.data),
		title = $('.course-infos .path span').text(),
		content = [];

	var outLineList = $('.outline-list').find('.name');
	for(var i=0,len=outLineList.length; i<len; i++) {
		content.push(outLineList[i].children[0].data);
	}

	return {
		title: title,
		content: content
	}
}