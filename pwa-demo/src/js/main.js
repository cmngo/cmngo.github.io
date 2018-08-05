// 注册Sw
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register('../../sw.js') //setting scope of sw
	.then(function(registration) {
		console.info('Service worker is registered!');
		// checkForPageUpdate(registration); // To check if new content is updated or not
	})
	.catch(function(error) {
		console.error('Service worker failed ', error);
	});
}


const url = 'https://cnodejs.org/api/v1/topics?page=1&limit=5&tab=good' ;
fetch(url, { method: 'GET' })
	.then(function(fetchResponse){ return fetchResponse.json() })
		.then(function(response) {
			console.log('response: ', response);
			// if (!requestFromBGSync) {
			// 	localStorage.removeItem('request'); //Once API is success, remove request data from localStorage
			// }
			// spinnerElement.classList.remove('show'); //hide spinner
		})
		.catch(function (error) {
			//If user is offline and sent a request, store it in localStorage
			//Once user comes online, trigger bg sync fetch from application tab to make the failed request
			localStorage.setItem('request', name);
			spinnerElement.classList.remove('show'); //hide spinner
			console.error(error);
		});