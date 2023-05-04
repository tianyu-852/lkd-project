const RongIMLib = require('../SDK/RongIMLib-3.0.7.2-dev.js');

function imKey(){
	var im = RongIMLib.init({
		appkey: 'm7ua80gbme9dm' //正式
		// appkey: 'vnroth0kvlugo'//测试
	})
	return im
}

function imF(that) {
	let im = imKey()
	var conversationList = []; // 当前已存在的会话列表
	im.watch({
		conversation: function(event) {
			var updatedConversationList = event.updatedConversationList; // 更新的会话列表
			console.log('更新会话汇总:', updatedConversationList);
			console.log('最新会话列表:', im.Conversation.merge({
				conversationList,
				updatedConversationList
			}));
			im.Conversation.getTotalUnreadCount().then(function(totalUnreadCount) {
			  console.log('获取未读总数成功', totalUnreadCount);
			  that.$store.commit("setImtotalUnreadCount",totalUnreadCount)
			});

		},
		message: function(event) {
			var message = event.message;
			console.log('收到新消息: ', message);
			// setOrderMsg
			that.$store.commit("setOrderInfo",message)
			if(message.messageType != 'RC:SRSMsg'){
				that.$store.commit("setImNoticeInfo",message)
				that.$store.commit("setImNoticeShow",true)
			}
			
			setTimeout(res=>{
				that.$store.commit("setImNoticeShow",false)
			},3000)
			if(message.content.extra && message.content.extra.data && message.content.extra.data.status == 9){
				that.$store.commit("setOrderStatus",true);
			}
		},
		status: function(event) {
			var status = event.status
			console.log('连接状态码:', status);
		}
	})
	var user = {
		token: uni.getStorageSync('rong_cloud_token')
	};
	console.log(user)
	// im.disconnect(user).then(() => console.log('断开链接成功'));
	im.connect(user).then(function(user) {
		console.log('链接成功, 链接用户 id 为: ', user.id);
		im.Conversation.getList().then(function(conversationList) {
			console.log('获取会话列表成功', conversationList);
			getApp().globalData.list = conversationList
		},res=>{
			console.log(res)
			im.disconnect(user).then(() => console.log('断开链接成功'))
			reConnect(im,conversationList,user)
		});  
		im.Conversation.getTotalUnreadCount().then(function(totalUnreadCount) {
		  console.log('获取未读总数成功', totalUnreadCount);
		  that.$store.commit("setImtotalUnreadCount",totalUnreadCount)
		});
	}).catch(function(error) {
		console.log('链接失败: ', error.code, error.msg);
	});
}

function reConnect(im,conversationList,user){
	console.log('重新调用im')
	im.connect(user).then(function(user) {
		console.log('链接成功, 链接用户 id 为: ', user.id);
		im.Conversation.getList().then(function(conversationList) {
			console.log('获取会话列表成功', conversationList);
			getApp().globalData.list = conversationList
		},res=>{
			console.log(res)
			im.disconnect(user).then(() => console.log('断开链接成功'))
			setTimeout(()=>{
				reConnect(im,conversationList,user)
			},2000)
		});  
	}).catch(function(error) {
		console.log('链接失败: ', error.code, error.msg);
	});
}

export {
	imF,
	imKey,
	RongIMLib
}
