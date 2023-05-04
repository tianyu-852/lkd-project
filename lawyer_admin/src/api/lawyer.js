import request from '@/utils/request'

const lawyerApi = {
  LawyerPage: 'web/lawyer/page',
  LawyerDelete: 'web/lawyer',
  LawyerOrderPage: 'web/lawyer/order/page',
  LawyerDetail: 'web/lawyer',
  LawyerAuthPage: 'web/lawyer/auth/page',
  LawyerAuthDetail: 'web/lawyer/auth',
  LawyerAuthHistory: 'web/lawyer/auth/history',
  LawyerAuth: 'web/lawyer/auth',
  LawyerAuthDelete: 'web/lawyer/auth',
  LawyerBetter: 'web/lawyer/better',
  LawyerDistribution: 'web/lawyer/distribution',
  LawyerEmptyNumber: 'web/lawyer/suspicious/empty-number',
  LawyerDoubtfulCharges: 'web/lawyer/suspicious/many-unconnected',
  LawyerDistricts: 'web/districts',
  LawyerMessage: 'web/user/recommend-lawyer/message',
  LawyerGuarantee: 'web/order/refund/guarantee',
  LawyerShowEnableCall: 'web/lawyer/show-enable-call',
  LawyerImages: 'web/lawyer/images',
}

/**
 * 获取律师管理分页
 * @param page
 * @param search
 * @returns {AxiosPromise}
 */
export const getLawyerPage = params => {
  return request({
    url: '/web/lawyer/page',
    method: 'get',
    params,
  })
}

/**
 * 删除律师
 * @param userId
 * @returns {AxiosPromise}
 */
export const deleteLawyer = userId => {
  return request({
    url: lawyerApi.LawyerDelete,
    method: 'delete',
    data: {
      user_id: userId
    }
  })
}

/**
 * 获取律师订单分页
 * @param userId
 * @param page
 * @returns {AxiosPromise}
 */
export const getLawyerOrderPage = params=> {
  return request({
    url: lawyerApi.LawyerOrderPage,
    method: 'get',
    params: params
  })
}

/**
 * 获取律师案源报价列表
 */
export const getLawyerCauseSourceOfferApi = params => {
  return request({
    url: '/v2/web/diabetes/mellitus/order/list',
    method: 'get',
    params: params
  })
}

/**
 * 获取案源分类列表
 */
export const getLawyerTagListListApi = () => {
  return request({
    url: '/v2/web/admin/get/lawyer/tags',
    method: 'get'
  })
}

/**
 * 律师管理详情
 * @param userId
 * @returns {AxiosPromise}
 */
export const getLawyerDetail = userId => {
  return request({
    url: lawyerApi.LawyerDetail,
    method: 'get',
    params: {
      user_id: userId,
    }
  })
}

/**
 * 获取律师认证列表
 * @param page
 * @param search
 * @returns {AxiosPromise}
 */
export const getLawyerAuthPage = (page, search) => {
  return request({
    url: lawyerApi.LawyerAuthPage,
    method: 'get',
    params: {
      page,
      search
    }
  })
}

/**
 *  获取律师审核详情
 * @param lawyerAuthId
 * @returns {AxiosPromise}
 */
export const getLawyerAuth = lawyerAuthId => {
  return request({
    url: lawyerApi.LawyerAuthDetail,
    method: 'get',
    params: {
      lawyer_auth_id: lawyerAuthId
    }
  })
}

/**
 * 获取律师认证历史
 * @param lawyerAuthId
 * @returns {AxiosPromise}
 */
export const getLawyerAuthHistory = lawyerAuthId => {
  return request({
    url: lawyerApi.LawyerAuthHistory,
    method: 'get',
    params: {
      lawyer_auth_id: lawyerAuthId
    }
  })
}

/**
 * 律师审核
 * @param form
 * @returns {AxiosPromise}
 */
export const lawyerAuth = form => {
  return request({
    url: lawyerApi.LawyerAuth,
    method: 'put',
    data: form
  })
}

export const deleteLawyerAuth = lawyerAuthId => {
  return request({
    url: lawyerApi.LawyerAuthDelete,
    method: 'delete',
    data: {lawyer_auth_id: lawyerAuthId}
  })
}

/**
 * 设置优选律师
 */
export const getLawyerBetter = (id, better) => {
  return request({
    url: lawyerApi.LawyerBetter,
    method: 'put',
    data: {
      user_id: id,
      is_better: better
    }
  })
}
 export const getLawyerDistribution = (search) => {
  return request({
    url: lawyerApi.LawyerDistribution,
    method: 'GET',
    params: {
      search
    }
  })
}
/**
 * 获取可疑空号律师
 * @param {页码} page 
 * @returns 
 */
export const getLawyerEmptyNumber = (page) => {
  return request({
    url: lawyerApi.LawyerEmptyNumber,
    method: 'get',
    params: {
      page
    }
  })
}
/**
 * 获取可疑收费律师
 * @param {页码} page 
 * @returns 
 */
export const getLawyerDoubtfulCharges = (page) => {
  return request({
    url: lawyerApi.LawyerDoubtfulCharges,
    method: 'get',
    params: {
      page
    }
  })
}
/**
 * 获取地区信息
 */
 export const getLawyerDistricts = () => {
  return request({
    url: lawyerApi.LawyerDistricts,
    method: 'get',
  })
}
/**
 * 
 * 发送推荐律师消息 
 */
 export const getLawyerMessage = (userId, lawyerUserId) => {
  return request({
    url: lawyerApi.LawyerMessage,
    method: 'post',
    data: {
      user_id: userId,
      lawyer_user_id: lawyerUserId
    }
  })
}
/**
 *   退款律师保障计划    
 */
 export const postLawyerGuarantee = (userId) => {
  return request({
    url: lawyerApi.LawyerGuarantee,
    method: 'post',
    data: {
      user_id: userId,
    }
  })
}
/**
 * 显示律师切换电话咨询按钮
 */
 export const putLawyerShowEnableCall = (id, isShowEnableCall) => {
  return request({
    url: lawyerApi.LawyerShowEnableCall,
    method: 'put',
    data: {
      user_id: id,
      is_show_enable_call: isShowEnableCall
    }
  })
}
/**
 *  设置律师审核图片（马赛克）
 */
 export const putLawyerImages = (id, idCardFrontImage, idCardBackImage, certificateImage, certificateRecordImage) => {
  return request({
    url: lawyerApi.LawyerImages,
    method: 'put',
    data: {
      user_id: id,
      id_card_front_image: idCardFrontImage,
      id_card_back_image: idCardBackImage,
      certificate_image: certificateImage,
      certificate_record_image: certificateRecordImage
    }
  })
}

/**
 * 获取优选律师列表
 */
 export const getBestLawyerListApi = params => {
  return request({
    url: '/v2/web/admin/optimization/lawyer/list',
    method: 'get',
    params
  })
}

/**
 * 获取优选律师开通套餐 列表
 */
 export const getBestLawyerMealListApi = params => {
  return request({
    url: '/v2/web/true/admin/optimization/plan/list',
    method: 'get',
    params
  })
}

/**
 * 更新优选律师套餐
 */
 export const updateBestMenuApi = params => {
  return request({
    url: '/v2/web/admin/optimization/plan/update',
    method: 'post',
    data: params
  })
}

/**
 * 获取优选律师详情
 */
 export const getBestLawyerDetailApi = params => {
  return request({
    url: '/v2/web/admin/get/push/log/list',
    method: 'get',
    params
  })
}

/**
 * 获取优选律师备注
 */
 export const updateBestLawyerRemarkApi = params => {
  return request({
    url: '/v2/web/admin/optimization/lawyer/list/remark',
    method: 'post',
    data: params
  })
}

/**
 * 获取销售标签列表
 */
 export const getLawyerLabelListApi = params => {
  return request({
    url: '/v2/web/user/label/list',
    method: 'get',
    params,
  })
}

/**
 * 添加标签
 */
 export const postAddLabelApi = param => {
  return request({
    url: '/v2/web/user/label/add',
    method: 'post',
    data: param
  })
}

/**
 * 更新标签
 * @param putLabelId {String} 更新标签 id
 */
export const putLabelApi = (putLabelId, param) => {
  return request({
    url: '/v2/web/user/label/update',
    method: 'put',
    data: {
      user_label_id: putLabelId,
      ...param
    }
  })
}

/**
 * 获取优选律师 待优先推送列表
 */
 export const getBestLawyerWaitPushListApi = params => {
  return request({
    url: '/v2/web/get/simple/optimization/lawyer/list',
    method: 'get',
    params,
  })
}

/**
 * 更新优选律师 优先推送列表
 */
 export const updateBestLawyerPushApi = param => {
  return request({
    url: '/v2/web/add/and/remove/precedence/push/lawyer',
    method: 'post',
    data: param
  })
}

/**
 * 获取待开通优选律师 列表
 */
 export const getWaitOpenBestLawyerListApi = params => {
  return request({
    url: '/v2/web/admin/simple/lawyer/list',
    method: 'get',
    params,
  })
}

/**
 * 获取优选会员详情 列表
 */
 export const getBestVipDetailApi = params => {
  return request({
    url: '/v2/web/get/optimization/detail',
    method: 'get',
    params,
  })
}

/**
 * 给律师 开通优选会员
 */
 export const postOpenBestVipApi = param => {
  return request({
    url: '/v2/web/add/optimization/plan',
    method: 'post',
    data: param
  })
}

/**
 * 给律师 覆盖优选会员
 */
 export const coverBestVipApi = param => {
  return request({
    url: '/v2/web/admin/optimization/cover',
    method: 'post',
    data: param
  })
}

/**
 * 获取优选律师会员 列表
 */
export const getBestLawyerVipOpenListApi = params => {
  return request({
    url: '/v2/web/admin/optimization/warehouse/list',
    method: 'get',
    params,
  })
}

/**
 * 删除律师优选会员
 */
 export const delLawyerBestVipApi = param => {
  return request({
    url: '/v2/web/del/optimization/warehouse',
    method: 'post',
    data: param
  })
}

/**
 * 恢复律师抢单次数
 */
 export const recoverLawyerGrabOrderNumApi = param => {
  return request({
    url: '/v2/web/restore/optimization/num',
    method: 'post',
    data: param
  })
}

/**
 * 返回律师订单次数 或者 收益
 */
 export const recoverLawyerOrderOrIncomeApi = param => {
  return request({
    url: '/v2/web/back/revenue/or/frequency',
    method: 'post',
    data: param
  })
}

/**
 * 更新用户余额 加/减钱
 */
 export const updateUserbalanceApi = param => {
  return request({
    url: '/v2/web/user/balance/change',
    method: 'post',
    data: param
  })
}

/**
 * 获取律师 待屏蔽列表
 */
 export const getBestLawyerWaitPreventListApi = params => {
  return request({
    url: '/v2/web/get/simple/optimization/lawyer/list',
    method: 'get',
    params,
  })
}

/**
 * 获取律师 已屏蔽列表
 */
 export const getBestLawyerPreventedListApi = params => {
  return request({
    url: '/v2/web/get/shield/lawyer/list',
    method: 'get',
    params,
  })
}

/**
 * 添加律师 屏蔽列表
 */
 export const addBestLawyerPreventApi = param => {
  return request({
    url: '/v2/web/add/shield/lawyer',
    method: 'post',
    data: param
  })
}

/**
 * 移除律师 屏蔽列表
 */
 export const removeBestLawyerPreventApi = param => {
  return request({
    url: '/v2/web/del/shield/lawyer',
    method: 'post',
    data: param
  })
}

/**
 * 更新用户手机品牌
 */
 export const updateUserPhoneBrandApi = param => {
  return request({
    url: '/v2/web/set/phone/brand',
    method: 'post',
    data: param
  })
}

/**
 * 添加律师订单次数
 */
 export const addLawyerOrderNumApi = param => {
  return request({
    url: '/v2/web/add/optimization/num',
    method: 'post',
    data: param
  })
}

/**
 * 获取优选 体验期/非体验期 列表
 */
 export const getBestExperienceListApi = params => {
  return request({
    url: '/v2/web/admin/optimization/lawyer/list/class',
    method: 'get',
    params,
  })
}

/**
 * 获取 定时开通优选会员 列表
 */
 export const getClockOpenBestListApi = params => {
  return request({
    url: '/v2/web/get/optimization/task',
    method: 'get',
    params,
  })
}

/**
 * 给律师 定时开通优选会员
 */
 export const postClockOpenBestVipApi = param => {
  return request({
    url: '/v2/web/add/optimization/task',
    method: 'post',
    data: param
  })
}

/**
 * 取消 定时开通优选会员
 */
 export const cancelClockOpenBestVipApi = param => {
  return request({
    url: '/v2/web/admin/cancel/task',
    method: 'post',
    data: param
  })
}

/**
 * 编辑 定时开通优选会员
 */
 export const editClockOpenBestVipApi = param => {
  return request({
    url: '/v2/web/edit/task/open/time',
    method: 'post',
    data: param
  })
}

/**
 * 移除优选律师会员
 */
 export const removeLawyerBestVipApi = param => {
  return request({
    url: '/v2/web/del/optimization/lawyer',
    method: 'post',
    data: param
  })
}

/**
 * 获取推广大使 全部列表
 */
 export const getLawyerPromoteTotalListApi = params => {
  return request({
    url: '/v2/web/lawyer/enterprise/promotion/list',
    method: 'get',
    params,
  })
}

/**
 * 获取推广大使 待审核列表
 */
 export const getLawyerPromoteCheckListApi = params => {
  return request({
    url: '/v2/web/enterprise/services/audit/list',
    method: 'get',
    params,
  })
}

/**
 * 处理 律师申请推广大使 请求
 */
 export const postLawyerApplyPromoteCheckApi = params => {
  return request({
    url: '/v2/web/admin/enterprise/services/audit',
    method: 'post',
    data: params
  })
}

/**
 * 获取推广大使 收益规则
 */
 export const getLawyerPromoteIncomeRuleApi = () => {
  return request({
    url: '/v2/web/get/earnings/setting',
    method: 'get',
  })
}

/**
 * 更新推广大使 收益规则
 */
 export const updateLawyerPromoteIncomeRuleApi = params => {
  return request({
    url: '/v2/web/earnings/setting',
    method: 'post',
    data: params
  })
}

/**
 * 获取推广大使 收益详情列表
 */
 export const getLawyerPromoteIncomeDetailApi = params => {
  return request({
    url: '/v2/web/admin/earnings/list',
    method: 'get',
    params
  })
}

/**
 * 更新推广大使 收益用户 法务管家
 */
 export const updatePromoteIncomeLawManagerApi = params => {
  return request({
    url: '/v2/web/set/earnings/legal',
    method: 'post',
    data: params
  })
}

/**
 * 获取用户 使用第三方支付 消费记录
 */
 export const getUserOtherExpenseRecordApi = params => {
  return request({
    url: '/v2/web/user/pay/order',
    method: 'get',
    params
  })
}

/**
 * 获取用户 使用平台余额 消费记录
 */
 export const getUserPlatformExpenseRecordApi = params => {
  return request({
    url: '/web/balance/detail/page',
    method: 'get',
    params
  })
}

/**
 * 获取优选律师 权益设置 列表
 */
 export const getLawyerBestRightsSetListApi = params => {
  return request({
    url: '/v2/web/lawyer/equity/set/list',
    method: 'get',
    params
  })
}

/**
 * 添加优选律师 权益时间段
 */
 export const postLawyerBestRightsSetApi = params => {
  return request({
    url: '/v2/web/lawyer/equity/set/add',
    method: 'post',
    data: params
  })
}

/**
 * 更新推广大使 收益用户 法务管家
 */
 export const updateLawyerBestRightsSetApi = params => {
  return request({
    url: '/v2/web/lawyer/equity/set/operation',
    method: 'post',
    data: params
  })
}

/**
 * 更新推广大使 收益用户 法务管家
 */
 export const batchRecoverLawyerOrderApi = params => {
  return request({
    url: '/v2/web/optimization/batch/restore',
    method: 'post',
    data: params
  })
}

/**
 * 获取预认证律师 列表
 */
 export const getReadyAuthLawyerListApi = params => {
  return request({
    url: '/v2/web/lawyer/staff',
    method: 'get',
    params
  })
}

/**
 * 转移为预认证律师
 */
export const transferReadyAuthLawyerApi = params => {
  return request({
    url: '/v2/web/lawyer/staff/add',
    method: 'post',
    data: params
  })
}

/**
 * 更新律师跟进记录 销售
 */
export const updateLawyerFollowLogSellerApi = params => {
  return request({
    url: '/v2/web/lawyer/staff/log/update',
    method: 'post',
    data: params
  })
}

/**
 * 获取律师 跟进记录
 */
export const getLawyerFollowLogApi = params => {
  return request({
    url: '/v2/web/lawyer/staff/log',
    method: 'get',
    params
  })
}

/**
 * 获取律师 本地案源条数
 */
export const getLawyerCaseSourceNativeNumApi = params => {
  return request({
    url: '/v2/web/admin/get/free/count',
    method: 'get',
    params
  })
}

/**
 * 添加升级 vip套餐 跟进记录
 */
 export const postUpBestVipLogApi = param => {
  return request({
    url: '/v2/web/lawyer/staff/log/up/log',
    method: 'post',
    data: param
  })
}

/**
 * 开启 律师暂停接单
 */
 export const openBestReceiveOrderApi = param => {
  return request({
    url: '/v2/web/optimization/open/uspend/push',
    method: 'post',
    data: param
  })
}

/**
 * 关闭 律师暂停接单
 */
 export const closeBestReceiveOrderApi = param => {
  return request({
    url: '/v2/web/optimization/close/uspend/push',
    method: 'post',
    data: param
  })
}

/**
 * 取消 律师保证金
 */
 export const closeLawyerGuaranteeMoneyApi = param => {
  return request({
    url: '/v2/web/user/close/earnest',
    method: 'post',
    data: param
  })
}

/**
 * 赠送律师本地案源条数
 */
 export const giveToLawyerNativeNumApi = param => {
  return request({
    url: '/v2/web/admin/giveaway/local/case/num',
    method: 'post',
    data: param
  })
}

/**
 * 获取律师修改地址记录列表
 */
 export const getLawyerUpdateAddrLogApi = params => {
  return request({
    url: '/v2/web/lawyer/update/log/list',
    method: 'get',
    params
  })
}

/**
 * 已读律师 本地案源条数
 */
 export const postLawyerUpdateAddrLogApi = params => {
  return request({
    url: '/v2/web/lawyer/update/log/read',
    method: 'post',
    data: params
  })
}

/**
 * 获取律师订单收益 ￥20 律师
 */
export const getLawyerSpecialIncomeSetListApi = params => {
  return request({
    url: '/v2/web/config/list',
    method: 'get',
    params
  })
}

/**
 * 添加 订单收益￥20 律师
 */
export const postLawyerSpecialIncomeSetApi = params => {
  return request({
    url: '/v2/web/config/list/set',
    method: 'post',
    data: params
  })
}
/**
 * 移除 订单收益￥20 律师
 */
export const delLawyerSpecialIncomeSetApi = params => {
  return request({
    url: '/v2/web/config/list/del',
    method: 'post',
    data: params
  })
}

/**
 * 获取提现设置列表
 */
 export const getLawyerWithdrawSetListApi = params => {
  return request({
    url: '/v2/web/config/list/type',
    method: 'get',
    params
  })
}

/**
 * 添加 律师提现 item
 */
export const postLawyerWithdrawSetApi = params => {
  return request({
    url: '/v2/web/config/list/type/set',
    method: 'post',
    data: params
  })
}

/**
 * 删除 律师本地案源 item
 */
export const delLawyerCauseSourceItem = params => {
  return request({
    url: '/v2/web/admin/del/local/lawyer/case/source',
    method: 'post',
    data: params
  })
}
