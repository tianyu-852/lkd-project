import request from '@/utils/request'

const serviceApi={
    serviceExcel: '/web/user/customer/service/excel',
    servicePage: '/web/user/customer/service/page', // 客服提成
    serviceRemark: '/web/user/customer/service/remark',
    serviceIntention: '/web/user/customer/service/intention',
    serviceProgress: '/web/user/customer/service/progress',
    serviceSetting: '/web/user/customer/service/setting/page', // 客服列表
    serviceStatus: '/web/user/customer/service/setting/status',
    serviceMove: '/web/user/customer/service/setting/move',
    serviceSettingDel: '/web/user/customer/service/setting/del',
    serviceAdd: '/web/user/customer/service/setting/add',
  
}

// 获取导出excel分配结果
export const getServiceExcel = (startTime, endTime) => {
    return request({
      url:serviceApi.serviceExcel,
      method: 'get',
      params: {
        start_time: startTime,
        end_time: endTime
      }
    })
}

// 获取客服页面
export const getServicePage = ( progressStatus, page, commissionVipId, intentionStatus, search,sort, serviceId, startTime, endTime) => {
    return request({
      url:serviceApi.servicePage,
      method: 'get',
      params: {
        progress_status: progressStatus,
        page,
        commission_vip_id: commissionVipId,
        intention_status: intentionStatus,
        search,
        sort,
        customer_user_id: serviceId, // 客户 id
        start_time: startTime,
        end_time: endTime
      }
    })
}

// 修改备注
export const putServiceRemark = (remark, userId) => {
    return request({
      url:serviceApi.serviceRemark,
      method: 'put',
      data: {
        remark,
        user_customer_service_customer_id: userId
      }
    })
}

// 修改意向状态
export const putServiceIntention = (intentionStatus, userId) => {
    return request({
      url:serviceApi.serviceIntention,
      method: 'put',
      data: {
        intention_status: intentionStatus,
        user_customer_service_customer_id: userId
      }
    })
}
// 修改联系状态 
export const putServiceProgress = (progressStatus, userId) => {
  return request({
    url:serviceApi.serviceProgress,
    method: 'put',
    data: {
      progress_status: progressStatus,
      user_customer_service_customer_id: userId
    }
  })
}

// 获取客服管理页面
export const getServiceSetting = ( page,search ) => {
  return request({
    url:serviceApi.serviceSetting,
    method: 'get',
    params: {   
      page,    
      search
    }
  })
}

//  修改客服值班状态  
export const putServiceStatus = (id, status) => {
  return request({
    url:serviceApi.serviceStatus,
    method: 'put',
    data: {
      user_id: id,
      allocation_status: status
    }
  })
}

// 转移客服负责用户
export const putServiceMove = (oldUserId, newUserId) => {
  return request({
    url:serviceApi.serviceMove,
    method: 'put',
    data: {
      old_user_id: oldUserId,
      new_user_id: newUserId
    }
  })
}

// 删除客服  
export const putServiceSettingDel = (userId) => {
  return request({
    url:serviceApi.serviceSettingDel,
    method: 'delete',
    data: {
      user_id: userId,
    }
  })
}

// 添加客服 
export const postServiceAdd = ( userId ) => {
  return request({
    url:serviceApi.serviceAdd,
    method: 'post',
    data: {   
      user_id: userId,
    }
  })
}

/**
 * 获取客户待选列表
 */
 export const getServiceWaitListApi = params => {
  return request({
    url: '/v2/web/customer/user/account/bind/list',
    method: 'get',
    params,
  })
}
