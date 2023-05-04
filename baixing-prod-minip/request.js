import commonConfig from '@/common/config';
const server = `${ commonConfig[commonConfig.env].serverBaseUrl }/`;;
const JSONbig = require('json-bigint')

let suiji = function (min, max) {
	var returnStr = "",
		range = (max ? Math.round(Math.random() * (max - min)) + min : min),
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
			'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
			'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
		];
	for (var i = 0; i < range; i++) {
		var index = Math.round(Math.random() * (arr.length - 1));
		returnStr += arr[index];
	}
	return returnStr;
}
function isWechat() {
	return String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) === "micromessenger";
}

const crypto = require('crypto');

function initHeader(url,data,header){
	const secret = Date.parse(new Date()) / 1000 + '';
	const nonce = suiji(8,8) + '';
	let deviceType = 'wechat-mini-program'
	//#ifdef MP-WEIXIN
	deviceType = "wechat-mini-program"
	//#endif

	//#ifdef MP-TOUTIAO
	deviceType = "bytedance-mini-program"
	//#endif

	// #ifdef MP-KUAISHOU
	deviceType = "kuaishou-mini-program"
	// #endif

	// #ifdef H5
	deviceType = isWechat() ? "h5-wechat" : "H5"
	// #endif

	const token =uni.getStorageSync('token')
	let str = '/'+url + (token?`authorization=${token}`:'')+`&x-device-type=${deviceType}&x-nonce=${nonce}&x-timestamp=${secret}`
	let arr = [];
	for (var key in data) {
		if(data[key] == null || data[key] == undefined || data[key] ==='')
			continue
		arr.push(key)
	}

	arr.sort();
	for (let i in arr) {
		if (i != 0)
			str +="&"
			str += `${urlencode(arr[i])}=${urlencode(data[arr[i]])}`
	}
	//首先引入crypto模块进项目中；
	let hmac = crypto.createHmac('sha1', secret);
	hmac.write(str); // write in to the stream
	hmac.end();       // can't read from the stream until you call end()
	const hash = hmac.read().toString('hex');    // read out hmac digest

	// console.log(hash)
	const base64 = new Buffer(hash).toString('base64');
	return {
		...header,
		"X-Device-Type": deviceType,
		"X-Timestamp": secret,
		"X-Nonce": nonce,
		"Authorization": token,
		"X-Signature": base64,
		"X-Api-Version": "v1",
		// "x-is-debug":'1'
		"X-Source-App":'0'
	}
}
//随手写一段明文字符串，保存到常量secret中。
function urlencode(str){
	return encodeURIComponent(str).replace(/\+/g,"%20").replace(/\*/g,"%2A")
}
//在更新之后，我们将更新的内容的进行十六进制的消化吸收。

function request(url, data = {}, method, header = {}) {
	return new Promise((resolve, reject) => {
		//签名
		header = initHeader(url,data,header)
		// console.log(base64)
		uni.request({
			url: `${server}${url}`,
			data: data ? data : {},
			dataType: 'String',
			method: method ? method : 'GET',
			sslVerify: false,
			header: {
				...header,
				'content-type':'application/x-www-form-urlencoded',
				"X-App-Version-Number": '2.0.1',
			},
			complete: res => {
				let newData = res.data.replace(/user_id\":(\d+)/g,"user_id\":\"$1\"")
				newData = newData.replace(/demand_id\":(\d+)/g,"demand_id\":\"$1\"")
				newData = newData.replace(/demand_lawyer_id\":(\d+)/g,"demand_lawyer_id\":\"$1\"")
				// res.data=JSON.parse(newData)
				res.data = JSONbig.parse(newData)
				// console.log(res)

				if (res.statusCode == 200) {
					resolve(res)
					if (res.data.code == 1009) {
						uni.clearStorage()
						//#ifndef H5
						uni.navigateTo({ url: "/pagesV1/common/login" })
						//#endif

						//#ifdef H5
						uni.navigateTo({ url: isWechat() ? "/pagesV1/common/login" : "/pagesV2/h5/login" })
						//#endif
					}
				} else {
					console.log(res)
					reject(res)
				}
			}
		})
	})
}

export { request, server, initHeader }
