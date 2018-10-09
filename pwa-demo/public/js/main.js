// 注册Sw
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register('./sw.js') //setting scope of sw
	.then(function(registration) {
		console.info('Service worker is registered!');
		// checkForPageUpdate(registration); // To check if new content is updated or not
	})
	.catch(function(error) {
		console.error('Service worker failed ', error);
	});
}

// 数据fetch 以及 缓存
const url = 'https://cnodejs.org/api/v1/topics?page=1&limit=3';
let dataSource = [];
fetch(url, { method: 'GET' })
	.then(function(fetchResponse){ return fetchResponse.json() })
		.then(function(response) {
			const {success,data} = response;
			if(success) {
				dataSource = data;
				const temp = document.getElementById('fetch-data').innerHTML;
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
	// 阻止添加到主屏幕的默认事件
	console.log('beforeinstallprompt');
	e.preventDefault();
	savePrompt = e;
	return false;	
});

const add2HomeBtn = document.getElementById('add-to-homescreen');
add2HomeBtn.addEventListener('click',function(){
	console.log('添加到主屏幕');
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
});

//离线or上线提示
const networkMsg = document.getElementById('network-msg')
window.addEventListener('online',function(){
	networkMsg.innerHTML = 'App are currently online!';
	networkMsg.className = 'show';
	setTimeout(function(){
		networkMsg.className = 'hide';
	},2000)
})

window.addEventListener('offline',function(){
	networkMsg.innerHTML = 'App are currently offline!'
	networkMsg.className = 'show';
})

//消息推送
 //Push notification button
 var webPushBtn = document.getElementById('web-push');
 
 //To check `push notification` is supported or not
 function isPushSupported() {
	 //To check `push notification` permission is denied by user
	 if (Notification.permission === 'denied') {
		 console.warn('User has blocked push notification.');
		 return;
	 }

	 //Check `push notification` is supported or not
	 if (!('PushManager' in window)) {
		 console.error('Push notification isn\'t supported in your browser.');
		 return;
	 }

	 //Get `push notification` subscription
	 //If `serviceWorker` is registered and ready
	 navigator.serviceWorker.ready
		 .then(function (registration) {
			 registration.pushManager.getSubscription()
			 .then(function (subscription) {
				 console.log('getSubscription subscription: ', subscription);
				 //If already access granted, enable push button status
				 if (subscription) {
					 changePushStatus(true);
				 }
				 else {
					 changePushStatus(false);
				 }
			 })
			 .catch(function (error) {
				 console.error('Error occurred while enabling push ', error);
			 });
		 });
 }

 //To subscribe `push notification`
 function subscribePush() {
	 console.log('enter subscribePush');
	 navigator.serviceWorker.ready.then(function(registration) {
		 console.log('navigator.serviceWorker.ready==');
		 if (!registration.pushManager) {
			 alert('Your browser doesn\'t support push notification.');
			 return false;
		 }

		 //To subscribe `push notification` from push manager
		 console.log('registration.pushManager.subscribe: ', registration.pushManager.subscribe);
		 registration.pushManager.subscribe({
			 userVisibleOnly: true //Always show notification when received
		 })
		 .then(function (subscription) {
			 console.log(111111)
			 toast('Subscribed successfully.');
			 console.info('Push notification subscribed.');
			 changePushStatus(true);
			 sendPushNotification();
		 })
		 .catch(function (error) {
			 console.log(222222)
			 changePushStatus(false);
			 console.error('Push notification subscription error: ', error);
		 });
	 })
 }

 //To unsubscribe `push notification`
 function unsubscribePush() {
	 navigator.serviceWorker.ready
	 .then(function(registration) {
		 //Get `push subscription`
		 registration.pushManager.getSubscription()
		 .then(function (subscription) {
			 //If no `push subscription`, then return
			 if(!subscription) {
				 console.error('Unable to unregister push notification.');
				 return;
			 }

			 //Unsubscribe `push notification`
			 subscription.unsubscribe()
				 .then(function () {
					 toast('Unsubscribed successfully.');
					 console.info('Push notification unsubscribed.');
					 changePushStatus(false);
				 })
				 .catch(function (error) {
					 console.error(error);
				 });
		 })
		 .catch(function (error) {
			 console.error('Failed to unsubscribe push notification.');
		 });
	 })
 }

 //To change status
 function changePushStatus(status) {
	 console.log('changePushStatus status: ', status);
	 webPushBtn.dataset.checked = status;
	 webPushBtn.checked = status;
	 if (status) {
		 console.log('激活')
		 webPushBtn.classList.add('active');
	 }
	 else {
		console.log('关闭接收')
		webPushBtn.classList.remove('active');
	 }
 }

 //Click event for subscribe push
 webPushBtn.addEventListener('click', function () {
	 var isSubscribed = (webPushBtn.dataset.checked === 'true');
	 console.log('isSubscribed: ', isSubscribed);
	 if (isSubscribed) {
		 unsubscribePush();
	 }
	 else {
		 subscribePush();
	 }
 });

 //Form data with info to send to server
 function sendPushNotification() {
	 navigator.serviceWorker.ready
		 .then(function(registration) {
			 //Get `push subscription`
			 registration.pushManager.getSubscription().then(function (subscription) {
				 //Send `push notification` - source for below url `server.js`
				 fetch('https://progressive-web-application.herokuapp.com/send_notification', {
					 method: 'post',
					 headers: {
						 'Accept': 'application/json',
						 'Content-Type': 'application/json'
					 },
					 body: JSON.stringify(subscription)
				 })
				 .then(function(response) {
					 return response.json();
				 })
			 })
		 })
 }

 isPushSupported(); //Check for push notification support



// web分享
const shareBtn = document.getElementById('web-share');
if (navigator.share !== undefined) {
	shareBtn.addEventListener('click', function(event) {
		//Web share API
		navigator.share({
			title: 'pwa demo: 我是分享的title',
			text: 'pwa demo: 我是分享的text',
			url: window.location.href
		})
		.then(function() {
			console.info('Shared successfully.');
		})
		.catch(function (error) {
			console.error('Error in sharing: ', error);
		})
	});
} else {
	console.error('Not support web share!');
}