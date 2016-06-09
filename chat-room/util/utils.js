
function getTime() {
	var date = new Date();
	return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getUTCDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

module.exports = {
    getTime: getTime
}