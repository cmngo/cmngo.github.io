// 注册Sw
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register('public/sw.js') //setting scope of sw
	.then(function(registration) {
		console.info('Service worker is registered!');
		// checkForPageUpdate(registration); // To check if new content is updated or not
	})
	.catch(function(error) {
		console.error('Service worker failed ', error);
	});
}

// 数据fetch 以及 缓存
const url = 'https://cnodejs.org/api/v1/topics?page=1&limit=5&tab=share' ;
let dataSource = [];
fetch(url, { method: 'GET' })
	.then(function(fetchResponse){ return fetchResponse.json() })
		.then(function(response) {
			console.log('response: ', response);
			const {success,data} = response;
			if(success) {
				dataSource = data;
				const temp = document.getElementById('fetch-data').innerHTML;
				// const html = ejs.render('<%= people.join(", "); %>', {people: people});
				const html = ejs.render(temp,{data:data});
				document.getElementById('fetch-area').innerHTML = html;
			}
			// if (!requestFromBGSync) {
			// 	localStorage.removeItem('request'); //Once API is success, remove request data from localStorage
			// }
			// spinnerElement.classList.remove('show'); //hide spinner
		})
		.catch(function (error) {
			//If user is offline and sent a request, store it in localStorage
			//Once user comes online, trigger bg sync fetch from application tab to make the failed request
			localStorage.setItem('request', name);
			// spinnerElement.classList.remove('show'); //hide spinner
			console.error(error);
		});

// 点击显示添加到屏幕
let savePrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
	e.preventDefault();
	savePrompt = e;
	return false;
})
const add2HomeBtn = document.getElementById('add-to-homescreen');
add2HomeBtn.addEventListener('click',function(){
	console.log('click');
	if(savePrompt) {
		savePrompt.prompt();

		savePrompt.userChoice.then(function(result) {
			if(result.outcome === 'dismissed') {
				alert('user dismissed');
			}else {
				alert('user accept!')
			}

			savePrompt = null;
		})
	}
})