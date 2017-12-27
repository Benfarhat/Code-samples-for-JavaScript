var fnCallback = function(data){
	// We are supposed to parse the data and apply on it some usefull operations 
	self.postMessage(JSON.stringify(data, null, 4));
};

onmessage = function(e) {
	try {
		importScripts(e.data + '?callback=fnCallback');
	} catch(error) {
		postMessage(`NetworkError: Failed to load worker script with this URL

Try with this examples:
	https://api.fixer.io/latest
	http://api.icndb.com/jokes/random?firstName=John&amp;lastName=Doe
	http://examples.kevinchisholm.com/utils/json/jsonp.php
	https://api.cdnjs.com/libraries/
	https://blockchain.info/fr/ticker
	https://catalog.data.gov/api/3/action/package_search
	`);
	}
};

