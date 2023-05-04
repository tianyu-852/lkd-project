import request from '@/utils/request'

const PermissionsApi = {
    PermissionsStatistics: 'web/withdraw/page',
    DetailStatistics: 'web/balance/detail/page',
    PaymentStatistics: 'web/withdraw/payment/page',
    SuccessStatistics: 'web/withdraw/success/page',
    WithdrawStatistics: 'web/withdraw/check',
    getAdminPage: 'web/admin/page',
    changeAdminStatus: '/web/admin/status',
    deleteAdminPage: 'web/admin',
    changeAdminPermissions: 'web/admin/permissions',
    getAdminMenus: 'web/admin/menus'
  }
/**
 * 权限管理数据
 */
export const getPermissionsStatistics = (page, search) => {
    return request({
      url: PermissionsApi.PermissionsStatistics,
      method: 'get',
      params: {
       page,
       search,
        }
    })
  }
/**
 * 获取权限管理列表
 */
export const getAdminPage = (page, search) => {
  return request({
    url: PermissionsApi.getAdminPage,
    method: 'get',
    params: {
     page,
     search,
    }
  })
}
/**
 * 获取后台菜单树形结构
 */
 export const getAdminMenus = () => {
  return request({
    url: PermissionsApi.getAdminMenus,
    method: 'get',
  })
}
/**
 * 设置管理员状态
 */
 export const putChangeAdminStatus = (adminId, status) => {
  return request({
    url: PermissionsApi.changeAdminStatus,
    method: 'PUT',
    data: {
      admin_id: adminId,
      status
      }
  })
}
/**
 * 删除后台管理员
 */
 export const deleteAdminPage = (adminId) => {
  return request({
    url: PermissionsApi.deleteAdminPage,
    method: 'DELETE',
    data: {
      admin_id: adminId,
      }
  })
}
export const putChangeAdminPermissions = (adminId, permissions) => {
  return request({
    url: PermissionsApi.changeAdminPermissions,
    method: 'PUT',
    data: {
      admin_id: adminId,
      permissions
      }
  })
}

/**
 * 添加后台账号
 */
 export const addHouTaiAccountApi = param => {
  return request({
    url: '/v2/web/admin/add',
    method: 'post',
    data: param
  })
}

/**
 * 更新 账号线索页面 编辑权限
 */
 export const updateCauseSourceClueEditRights = param => {
  return request({
    url: '/v2/web/admin/set/button',
    method: 'post',
    data: param
  })
}

/**
 * 更新 后台账号，法律管家用户 id
 */
 export const updateHoutaiAccountLawManagerUserId = param => {
  return request({
    url: '/v2/web/admin/bind/user',
    method: 'post',
    data: param
  })
}
