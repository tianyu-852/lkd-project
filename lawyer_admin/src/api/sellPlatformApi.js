import request from '@/utils/request'

import axios from 'axios'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

/**
 * 获取销售端用户列表
 */
export const getSellPlatformUserListApi = params => {
  return request({
    url: '/v2/web/user/generate/list',
    method: 'get',
    params
  })
}

/**
 * 获取销售端销售主管列表
 */
export const getSellPlatformSellAdminerListApi = params => {
  return request({
    url: '/v2/web/admin/get/team/list',
    method: 'get',
    params
  })
}

/**
 * 添加销售端用户
 */
export const postAddSellPlatformUserApi = param => {
  return request({
    url: '/v2/web/user/generate',
    method: 'post',
    data: param
  })
}

/**
 * 更新销售端用户
 */
export const putSellPlatformUserApi = param => {
  return request({
    url: '/v2/web/update/sales/side/user',
    method: 'post',
    data: param
  })
}

/**
 * 删除销售端用户
 */
export const delSellPlatformUserApi = param => {
  return request({
    url: '/v2/web/del/sales/side/user',
    method: 'post',
    data: param
  })
}

/**
 * 获取销售端加盟商列表
 */
export const getSellPlatformLeagueListApi = params => {
  return request({
    url: '/v2/web/admin/alliance/business/list',
    method: 'get',
    params
  })
}

/**
 * 获取销售端-招商经理列表
 */
export const getSellPlatformBusinessListApi = params => {
  return request({
    url: '/v2/web/get/china/merchants/user/list',
    method: 'get',
    params
  })
}

/**
 * 获取销售端-加盟商身份列表
 */
export const getSellPlatformLeagueIdentityListApi = () => {
  return request({
    url: '/v2/web/admin/get/alliance/business/identity',
    method: 'get',
  })
}

/**
 * 添加销售端加盟商
 */
export const postAddSellPlatformLeagueApi = param => {
  return request({
    url: '/v2/web/admin/add/alliance/business',
    method: 'post',
    data: param
  })
}

/**
 * 更新销售端加盟商
 */
export const putSellPlatformLeagueApi = param => {
  return request({
    url: '/v2/web/admin/update/alliance/business',
    method: 'post',
    data: param
  })
}

/**
 * 删除销售端加盟商
 */
export const delSellPlatformLeagueApi = param => {
  return request({
    url: '/v2/web/admin/del/alliance/business',
    method: 'post',
    data: param
  })
}

/**
 * 获取销售端加盟商-销售
 */
export const getSellPlatformLeagueSellerListApi = params => {
  return request({
    url: '/v2/web/sales/affairs/list',
    method: 'get',
    params
  })
}

/**
 * 获取销售端加盟商详情
 */
export const getSellPlatformLeagueDetailApi = params => {
  return request({
    url: '/v2/web/get/commission/info',
    method: 'get',
    params
  })
}

/**
 * 添加销售端加盟商-销售
 */
export const postAddSellPlatformLeagueSellerApi = param => {
  return request({
    url: '/v2/web/add/alliance/sales',
    method: 'post',
    data: param
  })
}

/**
 * 更新销售端加盟商-销售
 */
export const putSellPlatformLeagueSellerApi = param => {
  return request({
    url: '/v2/web/update/alliance/sales',
    method: 'post',
    data: param
  })
}

/**
 * 删除销售端加盟商-销售
 */
export const setSellPlatformLeagueSellerMinipcode = param => {
  return request({
    url: '/v2/web/admin/set/qrcode',
    method: 'post',
    data: param
  })
}

/**
 * 删除销售端加盟商-销售
 */
export const delSellPlatformLeagueSellerApi = param => {
  return request({
    url: '/v2/web/del/alliance/sales',
    method: 'post',
    data: param
  })
}

/**
 * 获取销售端-销售开单详情
 */
export const getSellPlatformSellerOpenOrderListApi = params => {
  return request({
    url: '/v2/web/alliance/contract/order/list',
    method: 'get',
    params
  })
}

/**
 * 获取销售端-销售分享套餐列表
 */
export const getSellPlatformSellerVipShareListApi = params => {
  return request({
    url: '/v2/web/get/sales/side/share/list',
    method: 'get',
    params
  })
}

/**
 * 获取销售端-合同模板列表
 */
export const getSellPlatformContractTmpListApi = params => {
  return request({
    url: '/v2/web/true/template/list',
    method: 'get',
    params
  })
}

/**
 * 获取销售端-合同模板权限
 */
export const getSellPlatformContractTmpPermissionsApi = params => {
  return request({
    url: '/v2/web/get/template/permissions',
    method: 'get',
    params
  })
}

/**
 * 更新销售端-合同模板权限
 */
export const putSellPlatformContractTmpPermissionsApi = param => {
  return request({
    url: '/v2/web/edit/template/permissions',
    method: 'post',
    data: param
  })
}

/**
 * 更新销售端-合同模板权限
 */
export const uploadImportSellPlatformLeagueSellerApi = param => {
  return request({
    url: '/v2/web/import/alliance/business/sales',
    method: 'post',
    data: param
  })
}

/**
 * 销售端-上传导入加盟商销售人员
 */
// export const uploadImportSellPlatformLeagueSellerApi = param => {
//   const formData = new FormData()
//   formData.set('excel', param.file)

//   return new Promise((resolve, reject) => {
//     axios({
//       method: 'post',
//       url: `${ process.env.VUE_APP_API_BASE_URL }/v2/web/import/alliance/business/sales`,
//       headers: {
//         'X-Timestamp': new Date().getTime().toString().substr(0, 10), // 时间戳
//         'X-Nonce': Math.random().toString(36).slice(-10), // 随机字符串
//         'X-Api-Version': 'v1', // api版本号
//         'X-Device-Type': 'admin', // 设备类型
//         'Content-Type': 'multipart/form-data',
//         'Authorization': storage.get(ACCESS_TOKEN)
//       },
//       data: formData
//     })
//     .then(res => {
//       console.log(res)
//       resolve(res)
//     })
//     .catch(error => {
//       console.log(error)
//       reject(error)
//     })
//   })
// }
