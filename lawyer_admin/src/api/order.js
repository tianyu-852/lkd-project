import request from '@/utils/request'
import { type } from 'jquery'

const orderApi = {
  OrderPage: '/web/order/page', // 电话咨询
  OrderDetail: 'web/order',
  OrderRefundApply: 'web/order/refund/apply',
  OrderRefund: 'web/order/refund',
  OrderRecordPage: 'web/order/record/page',
  OrderRefundPage: 'web/order/refund/page',
  OrderDemandCheckPage: 'web/demand/check/page',
  OrderDemandTypes: 'web/demand/types', // 需求订单
  OrderDemand: 'web/demand',
  OrderDemandCheck: 'web/demand/check',
  OrderDemandCheckHistory: 'web/demand/check/history',
  OrderDemandPage: 'web/demand/page', // 需求订单详情列表
  OrderDemandLawyerPage: 'web/demand/lawyer/page',
  OrderDemandLawyer: 'web/demand/lawyer',
  OrderDemandLawyerChoose: 'web/demand/lawyer/choose',
  OrderEvaluateComplaintPage: 'web/order/evaluate/complaint/page',
  OrderEvaluateComplaintReply: 'web/order/evaluate/complaint/reply',
  OrderEvaluateComplaintRevokeReply: 'web/order/evaluate/complaint/revoke-reply',
  OrderEvaluateComplaintRevokeDelete: 'web/order/evaluate/complaint/revoke-delete',
  OrderCallPhoneApply: 'web/order/call-phone/apply/page',
  OrderEvaluateComplaintReject: 'web/order/evaluate/complaint/reject',

  OrderAllStatus: 'web/order/status/detail', // 获取订单相关所有状态
  OrderUpdateStatusPath: 'web/demand/update/status', // 修改需求订单状态
}

/**
 * 获取订单分页
 * @param page
 * @param type
 * @param search
 * @param startDate
 * @param endDate
 * @returns {AxiosPromise}
 */
export const getOrderPage = (
  page,
  type,
  status,
  search,
  startDate,
  endDate,
  isPaid
) => {
  return request({
    url: orderApi.OrderPage,
    method: 'get',
    params: {
      page,
      type,
      status,
      search,
      start_date: startDate,
      end_date: endDate,
      is_paid: isPaid,
    }
  })
}
// 订单详情
export const getOrderDetail = (orderNo) => {
  return request({
    url: orderApi.OrderDetail,
    method: 'get',
    params: {
      order_no: orderNo
    }
  })
}
// 申请退款
export const postOrderRefundApply = (content, orderNo, images) => {
  return request({
    url: orderApi.OrderRefundApply,
    method: 'post',
    data: {
      content,
      order_no: orderNo,
      images
    }
  })
}
// 同意退款
export const postOrderRefund = (orderRefundNo) => {
  return request({
    url: orderApi.OrderRefund,
    method: 'post',
    data: {
      order_refund_id: orderRefundNo,
    }
  })
} 
// 获取订单录音分页
export const getOrderRecordPage = (page, orderNo) => {
  return request({
    url: orderApi.OrderRecordPage,
    method: 'get',
    params: {
      page,
      order_no: orderNo
    }
  })
}
// 获取订单退款分页 
export const getOrderRefundPage = (page, type, status, search, startDate, endDate) => {
  return request({
    url: orderApi.OrderRefundPage,
    method: 'get',
    params: {
      page,
      type,
      status,
      search,
      start_date: startDate,
      end_date: endDate,
    }
  })
}

// 需求订单列表
export const getOrderDemandPage = (page, lawyerTagId, demandTypeId, search, startDate, endDate) => {
  return request({
    url: orderApi.OrderDemandPage,
    method: 'get',
    params: {
      page,
      lawyer_tag_id: lawyerTagId,
      demand_type_id: demandTypeId,
      search,
      start_date: startDate,
      end_date: endDate,
    }
  })
} 
// 需求详情 律师分页 
export const getOrderDemandLawyerPage = (page, demandId) => {
  return request({
    url: orderApi.OrderDemandLawyerPage,
    method: 'get',
    params: {
      page,
      demand_id: demandId
    }
  })
} 
// 需求审核分页
export const getOrderDemandCheckPage = (page, lawyerTagId, demandTypeId, search, startDate, endDate) => {
  return request({
    url: orderApi.OrderDemandCheckPage,
    method: 'get',
    params: {
      page,
      lawyer_tag_id: lawyerTagId,
      demand_type_id: demandTypeId,
      search,
      start_date: startDate,
      end_date: endDate,
    }
  })
} 

/**
 * 需求类型列表
 */
export const getOrderDemandTypes = () => {
  return request({
    url: orderApi.OrderDemandTypes,
    method: 'get',
  })
}
// 需求详情 
export const getOrderDemand = (demandId) => {
  return request({
    url: orderApi.OrderDemand,
    method: 'get',
    params: {
      demand_id: demandId
    }
  })
}
// 需求审核详情 
export const getOrderDemandCheck = (demandId) => {
  return request({
    url: orderApi.OrderDemandCheck,
    method: 'get',
    params: {
      demand_id: demandId
    }
  })
}
// 需求订单删除 
export const delOrderDemand = (demandId, deleteReason, type = 0) => {
  return request({
    url: orderApi.OrderDemand,
    method: 'delete',
    data: {
      demand_id: demandId,
      delete_reason: deleteReason,
      type
    }
  })
}
// 需求订单竞标律师删除 
export const delOrderDemandLawyer = (demandLawyerId) => {
  return request({
    url: orderApi.OrderDemandLawyer,
    method: 'delete',
    data: {
      demand_lawyer_id: demandLawyerId
    }
  })
}
// 选择竞标律师 
export const postOrderDemandLawyerChoose = (demandLawyerId) => {
  return request({
    url: orderApi.OrderDemandLawyerChoose,
    method: 'post',
    data: {
      demand_lawyer_id: demandLawyerId
    }
  })
} 
// 需求审核
export const postOrderDemandCheck = (demandId, type, refuseReason, lawyerTagId) => {
  return request({
    url: orderApi.OrderDemandCheck,
    method: 'post',
    data: {
      demand_id: demandId,
      type,
      refuse_reason: refuseReason,
      lawyer_tag_id: lawyerTagId	
    }
  })
} 
// 需求审核记录
export const postOrderDemandCheckHistory = (userId) => {
  return request({
    url: orderApi.OrderDemandCheckHistory,
    method: 'get',
    params: {
      user_id: userId
    }
  })
} 
// 获取订单评价申诉分页
export const getOrderEvaluateComplaintPage = (page, status, orderType, search) => {
  return request({
    url: orderApi.OrderEvaluateComplaintPage,
    method: 'get',
    params: {
      page,
      status,
      order_type: orderType,
      search
    }
  })
} 
// 订单申诉 
export const putOrderEvaluateComplaintReply = (orderEvaluateComplaintId, type, role, replyContent) => {
  return request({
    url: orderApi.OrderEvaluateComplaintReply,
    method: 'put',
    data: {
      order_evaluate_complaint_id: orderEvaluateComplaintId,
      type,
      role,
      reply_content: replyContent
    }
  })
} 
// 撤销回复 
export const putOrderEvaluateComplaintRevokeReply = (orderEvaluateComplaintId) => {
  return request({
    url: orderApi.OrderEvaluateComplaintRevokeReply,
    method: 'put',
    data: {
      order_evaluate_complaint_id: orderEvaluateComplaintId,
    }
  })
} 
// 撤销删除
export const putOrderEvaluateComplaintRevokeDelete = (orderEvaluateComplaintId) => {
  return request({
    url: orderApi.OrderEvaluateComplaintRevokeDelete,
    method: 'put',
    data: {
      order_evaluate_complaint_id: orderEvaluateComplaintId,
    }
  })
} 
/**
 * 获取订单电话申请分页
 */
 export const getOrderCallPhoneApply = (page, status, search, startDate, endDate) => {
  return request({
    url: orderApi.OrderCallPhoneApply,
    method: 'get',
    params: {
      page,
      status,
      search,
      start_date: startDate,
      end_date: endDate,
    }
  })
} 
/**
 *  评价管理申请驳回 
 */
 export const putOrderEvaluateComplaintReject = (orderEvaluateComplaintId, role, replyContent) => {
  return request({
    url: orderApi.OrderEvaluateComplaintReject,
    method: 'put',
    data: {
      order_evaluate_complaint_id: orderEvaluateComplaintId,
      role,
      reply_content: replyContent
    }
  })
} 


// 订单所有状态
export const getOrderAllStatusApi = () => {
  return request({
    url: orderApi.OrderAllStatus,
    method: 'get',
  })
}

/**
 * 修改需求订单状态
 * @param {*} demand_id 需求订单id
 * @param {*} order_status 订单流程状态
 * @param {*} demand_status 需求订单状态
 * @returns 
 */
export const updateDemandOrderStatusApi = (demand_id, order_status, demand_status) => {
  return request({
    url: orderApi.OrderUpdateStatusPath,
    method: 'post',
    data: {
      demand_id,
      order_status,
      demand_status
    }
  })
}


// 申请退款
export const apostOrderRefundApply = (content, orderNo, images) => {
  return request({
    url: orderApi.OrderRefundApply,
    method: 'post',
    data: {
      content,
      order_no: orderNo,
      images
    }
  })
}

/**
 * 更新订单备注
 */
export const updateOrderRemarkApi = params => {
  return request({
    url: '/v2/web/order/remark',
    method: 'post',
    data: params
  })
}

/**
 * 获取异常订单列表
 */
export const getExceptionOrderApi = params => {
  return request({
    url: '/v2/web/order/ali/call/abnormal',
    method: 'get',
    params
  })
}
