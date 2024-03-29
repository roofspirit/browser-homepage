String.prototype.replaceAt = function(index, replacement) {
	return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function url_exists(url) {
	var http = new XMLHttpRequest();
	http.open('HEAD', url, false);
	http.send();
	return http.status!=404;
}


// function sleep(ms) {
// 	return new Promise(resolve => setTimeout(resolve, ms));
// }
// console.log("Hello");
// sleep(2000).then(() => { console.log("World!"); });

// const timer = ms => new Promise(res => setTimeout(res, ms))
