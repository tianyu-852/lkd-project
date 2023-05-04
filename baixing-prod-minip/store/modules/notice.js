const notice = {
	state: {
		show:false,
		type:0,
		info:{
			name:''
		},
		imshow:false,
		iminfo:{},
		imtotalUnreadCount:0
	},
	actions: {
		
	},
	mutations: {
		setNoticeShow(state,data){
			state.show = data
		},
		setNoticeType(state,data){
			state.type = data
		},
		setNoticeInfo(state,data){
			state.info = data
		},
		setImNoticeShow(state,data){
			state.imshow = data
		},
		setImNoticeInfo(state,data){
			state.iminfo = data
		},
		setImtotalUnreadCount(state,data){
			state.imtotalUnreadCount = data
		}
	}

};

export default notice;
