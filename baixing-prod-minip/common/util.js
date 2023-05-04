function friendlyDate(timestamp) {
	var formats = {
		'year': '%n% 年前',
		'month': '%n% 月前',
		'day': '%n% 天前',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前',
	};

	var now = Date.now();
	var seconds = Math.floor((now - timestamp) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}
function jumpToUrl(type,id) {
	console.log(type)
	switch (type) {
	    case 'fundraisingRegistrationAdd': //跳转 筹款发起页
	        uni.navigateTo({
	            url: '/pages/v2/funds'
	        })
	        break;
		case 'orderDetail': //跳转 订单详情
		    uni.navigateTo({
		        url: '/my/client/orderDetail?id=' + id
		    })
		    break;
		case 'demandDetail': //跳转 需求广场详情
		    uni.navigateTo({
		        url: '/pagesV2/square/detail?id=' + id
		    })
		    break;
		case 'demandAdd': //跳转 需求广场发布页
		    uni.navigateTo({
		        url: '/pagesV2/square/square'
		    })
		    break;	
		case 'fundraisingIndex'://跳转 筹款列表
			uni.navigateTo({
		        url: '/pages/v2/funds'
		    })
			break;
		case 'callMobile'://打电话
			uni.makePhoneCall({
				phoneNumber:id
			})
			break;
		case 'lawyerIndex'://打电话
			uni.navigateTo({
				url:'/pagesV1/index/lawyerPage?id=' +id
			})
			break;
		case 'demandOrderDetail'://打电话
			uni.navigateTo({
				url:'/pagesV1/need/orderDetail?id=' +id
			})
			break;
		case 'customer'://打电话
			var data=uni.getStorageSync('customer')
			if(data.user_id){
				uni.navigateTo({
					url:`/pagesV1/info/infoDetails?id=${data.user_id}&name=${data.nickname}`
				})
			}
			break;
		case 'vip'://打电话
			uni.navigateTo({
				url:'/my/payVip'
			})
			break;
	    default:
	        break;
	}
}
export {
	friendlyDate,
	jumpToUrl
}
