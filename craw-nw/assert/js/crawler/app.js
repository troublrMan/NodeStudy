/**
 * learn from https://cnodejs.org/topic/523b0439101e574521ea1319
 * 简单爬虫入口
 */
var config = {
	page: 8,
	url: 'http://www.imooc.com/view/'
}

var showPage = function() {
	craw.getData(function (data){
		var analyzer = new Analyzer();
		analyzer.setData(data);

		var message = analyzer.getMessage();
		
		var dom = $('#message');
		dom.find('.title').text('');
		dom.find('.content').text('');

		dom.find('.title').text(config.page + ' ' + message.title);
		var outLine = '<h5>{message}<h5>';
		for(var i=0,len=message.content.length; i<len; i++){
			var $outLine = $(outLine.replace('{message}', message.content[i]));
			dom.find('.content').append($outLine);
		}
	});
}

craw.setUrl(config.url + config.page);
showPage();


$(document).ready(function(){
	$('#previous').on('click', function (){
		config.page = config.page - 1;
		var url = config.url + config.page;
		craw.setUrl(url);
		showPage();
	});

	$('#next').on('click', function (){
		config.page = config.page + 1;
		var url = config.url + config.page;
		craw.setUrl(url);
		showPage();
	});
}); 