import request from '@/utils/request'

const userApi = {
  UserStatistics: '/web/user/statistics',
  LawyerStatistics: '/web/lawyer/statistics',
  QuestionBotPage: '/web/user/bot/page',
  UserPage: '/web/user/page',
  SetUserStatus: '/web/user/status',
  UserDetail: '/web/user/detail',
  UserOrderPage: '/web/user/order/page',
  UserQuestionPage: '/web/user/question/page',
  UserBanned: 'web/user/muted',
  UserUnbanned: 'web/user/unmute',
  UserPassword: 'web/admin/password',
  UserDialog: 'web/user/dialog/page',
  UserDeletePage: 'web/user/delete/auth/page',
  UserDeleteCheck: 'web/user/delete/auth/check',
  UserDeleteHistory: 'web/user/delete/auth/check/history',
  UserDeleteCommunity: 'web/user/community',
  UserWithdrawDelete: 'web/user/withdraw-deleted',
  UserDeleteRemark: 'web/user/delete/remark',
  UserQuestionComment: 'web/question/user/question-comment/page',
  UserVipRefund: 'web/user/vip/refund',
  intendedUserPage: 'v2/web/sales/intended/user/page',
  intendedUser: 'v2/web/sales/intended/user',
  rongPage: "/web/rong/page",
  rongChat: '/web/rong/chat'
}

export const getUserStatistics = userId => {
  return request({
    url: userApi.UserStatistics,
    method: 'get',
    params: {
      user_id: userId,
    }
  })
}

export const getLawyerStatistics = lawyerUserId => {
  return request({
    url: userApi.LawyerStatistics,
    method: 'get',
    params: {
      lawyer_user_id: lawyerUserId,
    }
  })
}

export const getQuestionBotPage = (page, searchType, search) => {
  return request({
    url: userApi.QuestionBotPage,
    method: 'get',
    params: {
      page,
      search_type: searchType,
      search: search
    }
  })
}

/**
 * 获取平台用户列表
 */
export const getUserPage = params => {
  return request({
    url: userApi.UserPage,
    method: 'get',
    params,
  })
}

export const setUserStatus = (userId, status) => {
  return request({
    url: userApi.SetUserStatus,
    method: 'put',
    data: {
      user_id: userId,
      status
    }
  })
}

export const getUserDetail = userId => {
  return request({
    url: userApi.UserDetail,
    method: 'get',
    params: {
      user_id: userId,
    }
  })
}

export const getUserOrderPage = (userId, page) => {
  return request({
    url: userApi.UserOrderPage,
    method: 'get',
    params: {
      page,
      user_id: userId,
    }
  })
}

export const getUserQuestionPage = (userId, page) => {
  return request({
    url: userApi.UserQuestionPage,
    method: 'get',
    params: {
      page,
      user_id: userId,
    }
  })
}

/**
 * 用户禁言
 */
 export const getUserBanned = (userId, min, content) => {
  return request({
    url: userApi.UserBanned,
    method: 'post',
    data: {
      user_id: userId,
      min,
      content
    }
  })
}

/**
 * 解除禁言
 */
 export const userUnbanned = (userId) => {
  return request({
    url: userApi.UserUnbanned,
    method: 'delete',
    data: {
      user_id: userId,
    }
  })
}
/**
 * 修改密码
 */
 export const getUserPassword = (oldPassword, newPassword) => {
  return request({
    url: userApi.UserPassword,
    method: 'PUT',
    data: {
      old_password: oldPassword,
      new_password: newPassword
    }
  })
}
/**
 * 获取用户弹窗数据
 */
 export const getUserDialog = (page, search) => {
  return request({
    url: userApi.UserDialog,
    method: 'get',
    params: {
     page,
     search
    }
  })
}
/**
 * 获取用户注销分页
 */
 export const getUserDeletePage = (page, type, search) => {
  return request({
    url: userApi.UserDeletePage,
    method: 'get',
    params: {
     page,
     type,
     search
    }
  })
}
/**
 * 用户注销审核
 */
 export const getUserDeleteCheck = (result, userDeleteAuthId, reason) => {
  return request({
    url: userApi.UserDeleteCheck,
    method: 'post',
    data: {
      result,
      user_delete_auth_id: userDeleteAuthId,
      reason
    }
  })
}
/**
 *  用户注销审核历史
 */
 export const getUserDeleteHistory = (userId) => {
  return request({
    url: userApi.UserDeleteHistory,
    method: 'get',
    params: {
      user_id: userId,
    }
  })
}
/**
 * 清空数据 
 */
 export const deleteUserDeleteCommunity = (userId) => {
  return request({
    url: userApi.UserDeleteCommunity,
    method: 'delete',
    data: {
      user_id: userId,
    }
  })
}
/**
 * 撤销账号注销 
 */
 export const getUserWithdrawDelete = (userId) => {
  return request({
    url: userApi.UserWithdrawDelete,
    method: 'post',
    data: {
      user_id: userId
    }
  })
}
/**
 *   撤销列表页面备注 
 */
 export const putUserDeleteRemark = (userDeleteAuthId, remark) => {
  return request({
    url: userApi.UserDeleteRemark,
    method: 'PUT',
    data: {
      user_delete_auth_id: userDeleteAuthId,
      remark
    }
  })
}
/**
 * 获取用户评论分页
 */
 export const getUserQuestionComment = (page, userId) => {
  return request({
    url: userApi.UserQuestionComment,
    method: 'get',
    params: {
      page,
      user_id: userId,
    }
  })
}
/**
 * 用户vip退款 
 */
 export const getUserVipRefund = (userId) => {
  return request({
    url: userApi.UserVipRefund,
    method: 'post',
    data: {
      user_id: userId
    }
  })
}
/**
 * 获取意向用户分页
 */
 export const getIntendedUserPage = (page, userId) => {
  return request({
    url: userApi.intendedUserPage,
    method: 'get',
    params: {
      page,
    }
  })
}
/**
 * 添加意向用户
 */
 export const postIntendedUser = (customerNickname, companyNickname, mobile, wechatNumber) => {
  return request({
    url: userApi.intendedUser,
    method: 'post',
    data: {
      customer_nickname: customerNickname,
      company_nickname: companyNickname,
      mobile,
      wechat_number: wechatNumber
    }
  })
}
// 融云短信查询 
export const getRongPage = (page, sort, fromUserId, recvUserId, content, search, startTime, endTime) => {
  return request({
    url: userApi.rongPage,
    method: 'get',
    params: {
      page,
      sort,
      from_user_id: fromUserId,
      recv_user_id: recvUserId,
      content,
      search,
      start_time: startTime,
      end_time: endTime
    }
  })
}
// 聊天记录查询 rongChat
export const getRongChat = (page,  fromUserId, recvUserId, date) => {
  return request({
    url: userApi.rongChat,
    method: 'get',
    params: {
      page,
      from_user_id: fromUserId,
      recv_user_id: recvUserId,
      date
    }
  })
}


/**
 * 减少律师函数量
 */
 export const postLawyerLetterApi = param => {
  return request({
    url: '/v2/web/subtract/lawyer/letter/num',
    method: 'post',
    data: param
  })
}

/**
 * 获取企业搜索埋点列表
 */
 export const getEnterpriseSearchLogApi = params => {
  return request({
    url: '/v2/web/user/log',
    method: 'get',
    params
  })
}

/**
 * 获取用户会员列表
 */
 export const getUserVipListApi = params => {
  return request({
    url: '/v2/web/get/user/husbandman/enterprise/vip/list',
    method: 'get',
    params
  })
}

/**
 * 获取用户电话咨询列表
 */
 export const getUserPhoneConsultListApi = params => {
  return request({
    url: '/v2/web/user/order/call/phone',
    method: 'get',
    params
  })
}

/**
 * 获取用户聊天记录列表
 */
 export const getUserChatRecordListApi = params => {
  return request({
    url: '/web/rong/chat',
    method: 'get',
    params
  })
}

/**
 * 获取用户未完成订单详情
 */
 export const getUserUndoneOrderApi = params => {
  return request({
    url: '/web/user/delete/auth/user/order',
    method: 'get',
    params
  })
}

/**
 * 获取电话咨询订单 分类列表
 */
export const getPhoneOrderCategoryApi = () => {
  return request({
    url: '/v2/get/telephone/counseling/tag',
    method: 'get',
  })
}

/**
 * 创建电话咨询订单
 */
 export const createPhoneOrderApi = param => {
  return request({
    url: '/v2/web/admin/create/call/phone',
    method: 'post',
    data: param
  })
}

/**
 * 设置 有/无效 用户
 */
 export const setValidUserApi = param => {
  return request({
    url: '/web/user/effect',
    method: 'post',
    data: param
  })
}

/**
 * 设置用户 认证企业 信息
 */
 export const postUserApproveEnterpriseApi = param => {
  return request({
    url: '/v2/web/user/enterprise/update',
    method: 'post',
    data: param
  })
}
