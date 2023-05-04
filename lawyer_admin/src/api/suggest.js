import request from '@/utils/request'

const suggestApi = {
  getSuggestPage: 'web/suggest/page',
  replySuggest: 'web/suggest/reply',
  getSuggestPendingNumber: 'web/suggest/pending-reply/number',
  deleteSuggest: 'web/suggest',
  ReportPage: 'web/report/page',
  ReportReply: 'web/report/reply',
  ReportDel: 'web/report',
  PostSuggestToQuestion: 'web/suggest/to/question',
}

export const getSuggestPage = (page, suggestStatus, search) => {
  return request({
    url: suggestApi.getSuggestPage,
    method: 'get',
    params: {
      page,
      suggest_status: suggestStatus,
      search
    }
  })
}

export const suggestReply = (suggestId, replyContent) => {
  return request({
    url: suggestApi.replySuggest,
    method: 'post',
    data: {
      suggest_id: suggestId,
      reply_content: replyContent
    }
  })
}

export const getSuggestPendingNumber = () => {
  return request({
    url: suggestApi.getSuggestPendingNumber,
    method: 'get',
  })
}
// 删除意见反馈
export const deleteSuggest = (suggestId) => {
  return request({
    url: suggestApi.deleteSuggest,
    method: 'delete',
    data: {
      suggest_id: suggestId,
    }
  })
}
/**
 * 获取举报分页
 */
 export const getReportPage = (page, status, search) => {
  return request({
    url: suggestApi.ReportPage,
    method: 'get',
    params: {
      page,
      status,
      search
    }
  })
}
// 回复投诉举报
export const putReportReply = (reportId, replyContent) => {
  return request({
    url: suggestApi.ReportReply,
    method: 'put',
    data: {
      report_id: reportId,
      reply_content: replyContent
    }
  })
}
// 删除投诉举报
export const deleteReportDel = (reportId) => {
  return request({
    url: suggestApi.ReportDel,
    method: 'delete',
    data: {
      report_id: reportId,
    }
  })
}
/**
 * 意见反馈转化为问答
 */
export const postPostSuggestToQuestion = (suggestId, content) => {
  return request({
    url: suggestApi.PostSuggestToQuestion,
    method: 'post',
    data: {
      suggest_id: suggestId,
      content 
    }
  })
}