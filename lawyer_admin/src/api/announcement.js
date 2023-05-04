import request from '@/utils/request'

const AssetsApi = {
    announcementPage: 'web/announcement/page',
    announcementAddData: 'web/announcement',
    announcementDeleteData: 'web/announcement',
    announcementGetData: 'web/announcement',
}
/**
* 获取平台公告分页
*/

export const getAnnouncementPage = (page, startDate, endDate) => {
    return request({
      url: AssetsApi.announcementPage,
      method: 'get',
      params: {
       page,
       start_date: startDate,
       end_date: endDate,
      }
    })
  }
/**
* 添加或修改公告
*/
export const getAnnouncementAddData = (title, content, announcementId) => {
    return request({
      url: AssetsApi.announcementAddData,
      method: 'post',
      data: {
        title,
        content	,
        announcement_id: announcementId,
      }
    })
  }
/**
*删除公告
*/
export const getAnnouncementDeleteData = ( announcementId) => {
    return request({
      url: AssetsApi.announcementDeleteData,
      method: 'delete',
      data: {
        announcement_id: announcementId,
      }
    })
  }
/**
*获取公告详情
*/
export const getAnnouncementGetData = ( announcementId) => {
    return request({
      url: AssetsApi.announcementGetData,
      method: 'get',
      data: {
        announcement_id: announcementId,
      }
    })
  }