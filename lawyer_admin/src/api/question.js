import request from '@/utils/request'

const questionApi = {
  QuestionPage: '/web/question/page',
  QuestionTags: '/web/question/tags',
  QuestionTagsDetail: '/web/question/tags/detail',
  QuestionDelete: '/web/question',
  QuestionAdd: '/web/question',
  QuestionDetail: '/web/question',
  QuestionCommentPage: '/web/question/comment/page',
  QuestionCommentDelete: '/web/question/comment',
  QuestionHotNumbers: '/web/question/hot-numbers',
  UpdateQuestionHotNumber: '/web/question/hot-number',
  QuestionCommentAdd: '/web/question/comment',
  QuestionCommentReplyAdd: '/web/question/comment/reply',
  QuestionerCommentReplyAdd: '/web/question/comment/questioner',
  QuestionRewardPage: '/web/question/reward/page',
  QuestionRewardApplyAuth: '/web/question/reward/question-comment',
  QuestionRewardCheck: '/web/question/reward/check',
  QuestionRewardCheckHistory: '/web/question/reward/check/history',
  QuestionRewardUpgrade: '/web/question/reward/upgrade',
  GetRewardStatus: 'web/question/reward/status',
  PutRewardStatus: 'web/question/reward/status',
  QuestionRemark: 'web/question/remark',
  QuestionCommentConversion: 'web/question-comment/to/question',
  QuestionCommentConversionBack: 'web/question/back/question-comment',
  QuestionImages: 'web/question/images',
  Advertisement: 'web/advertisement',
  AdvertisementPositions: 'web/advertisement/positions',
  AdvertisementPositionAdvertisements: 'web/advertisement-position/advertisements',
  AdvertisementPositionsShowRule: 'web/advertisement-position/show-rule',
}

export const getQuestionPage = (
  page,
  searchType,
  search,
  lawyerTagId,
  startDate,
  endDate,
  orderType
) => {
  return request({
    url: questionApi.QuestionPage,
    method: 'get',
    params: {
      page,
      search_type: searchType,
      search,
      lawyer_tag_id: lawyerTagId,
      start_date: startDate,
      end_date: endDate,
      order_type: orderType
    }
  })
}

/**
 * 获取问卷标签列表
 * @returns {AxiosPromise}
 */
export const getQuestionTags = () => {
  return request({
    url: questionApi.QuestionTags,
    method: 'get',
    params: {
      is_have_hot: 1,
      is_have_other: 1
    }
  })
}

/**
 * 删除问卷
 * @param questionIds
 * @returns {AxiosPromise}
 */
export const deleteQuestion = questionIds => {
  return request({
    url: questionApi.QuestionDelete,
    method: 'delete',
    data: {
      question_ids: JSON.stringify(questionIds)
    }
  })
}

/**
 * 添加问卷
 * @param userId
 * @param title
 * @param content
 * @param lawyerTagId
 * @param timedTimestamp
 * @returns {AxiosPromise}
 */
export const addQuestion = (
  userId,
  title,
  content,
  lawyerTagId,
  timedTimestamp
) => {
  return request({
    url: questionApi.QuestionDelete,
    method: 'post',
    data: {
      user_id: userId,
      title,
      content,
      lawyer_tag_id: lawyerTagId,
      timed_timestamp: timedTimestamp
    }
  })
}

/**
 * 获取问答标签列表
 * @returns {AxiosPromise}
 */
export const getQuestionTagsDetail = () => {
  return request({
    url: questionApi.QuestionTagsDetail,
    method: 'get',
  })
}

/**
 * 获取问答详情
 * @param questionId
 * @returns {AxiosPromise}
 */
export const getQuestionDetail = (questionId) => {
  return request({
    url: questionApi.QuestionDetail,
    method: 'get',
    params: {
      question_id: questionId
    }
  })
}

/**
 * 获取问答评论分页
 * @param questionId
 * @param page
 * @param isViewLawyer
 * @returns {AxiosPromise}
 */
export const getQuestionCommentPage = (questionId, page, isViewLawyer) => {
  return request({
    url: questionApi.QuestionCommentPage,
    method: 'get',
    params: {
      question_id: questionId,
      page,
      is_view_lawyer: isViewLawyer
    }
  })
}
/**
 * 
 * @returns 评论转为帖子
 */
 export const postQuestionCommentConversion = (questionCommentId, content, isShow) => {
  return request({
    url: questionApi.QuestionCommentConversion,
    method: 'post',
    data: {
      question_comment_id: questionCommentId,
      content,
      is_show: isShow
    }
  })
}
/**
 * 
 * @returns 撤销评论转为帖子
 */
 export const putQuestionCommentConversionBack = (questionId) => {
  return request({
    url: questionApi.QuestionCommentConversionBack,
    method: 'put',
    data: {
      question_id: questionId
    }
  })
}

/**
 * 获取问答热度列表
 * @returns {AxiosPromise}
 */
export const getQuestionHotNumbers = () => {
  return request({
    url: questionApi.QuestionHotNumbers,
    method: 'get',
  })
}

/**
 * 修改问答热度
 * @param questionId
 * @param adminHotNumber
 * @returns {AxiosPromise}
 */
export const updateQuestionHotNumber = (questionId, adminHotNumber) => {
  return request({
    url: questionApi.UpdateQuestionHotNumber,
    method: 'put',
    data: {
      question_id: questionId,
      admin_hot_number: adminHotNumber
    }
  })
}

/**
 * 删除问答评论
 * @param questionCommentId
 * @returns {AxiosPromise}
 */
export const deleteQuestionComment = (questionCommentId) => {
  return request({
    url: questionApi.QuestionCommentDelete,
    method: 'delete',
    data: {
      question_comment_id: questionCommentId,
    }
  })
}

/**
 * 添加问答评论
 * @param userId
 * @param questionId
 * @param questionComment
 * @param timedTimestamp
 * @returns {AxiosPromise}
 */
export const addQuestionComment = (
  userId,
  questionId,
  questionComment,
  timedTimestamp
) => {
  return request({
    url: questionApi.QuestionCommentAdd,
    method: 'post',
    data: {
      user_id: userId,
      question_id: questionId,
      question_comment: questionComment,
      question_comment_images: '[]',
      timed_timestamp: timedTimestamp,
    }
  })
}

/**
 * 添加问答评论回复
 * @param userId
 * @param questionCommentId
 * @param questionComment
 * @param timedTimestamp
 * @returns {AxiosPromise}
 */
export const addQuestionCommentReply = (
  userId,
  questionCommentId,
  questionComment,
  timedTimestamp
) => {
  return request({
    url: questionApi.QuestionCommentReplyAdd,
    method: 'post',
    data: {
      user_id: userId,
      question_comment_id: questionCommentId,
      question_comment: questionComment,
      question_comment_images: '[]',
      timed_timestamp: timedTimestamp,
    }
  })
}

export const addQuestionerComment = (questionCommentId, questionComment) => {
  return request({
    url: questionApi.QuestionerCommentReplyAdd,
    method: 'post',
    data: {
      question_comment_id: questionCommentId,
      question_comment: questionComment,
      question_comment_images: '[]',
    }
  })
}

export const getRewardQuestion = (page, search) => {
  return request({
    url: questionApi.QuestionRewardPage,
    method: 'get',
    params: {
      page,
      search
    }
  })
}

export const getApplyRewardQuestionAuth = (questionId) => {
  return request({
    url: questionApi.QuestionRewardApplyAuth,
    method: 'get',
    params: {
      question_id: questionId
    }
  })
}

/**
 * 审核采纳
 * @param questionCommentId
 * @returns {AxiosPromise}
 */
export const checkSuccessRewardQuestion = (questionCommentId) => {
  return request({
    url: questionApi.QuestionRewardCheck,
    method: 'put',
    data: {
      type: 1,
      question_comment_id: questionCommentId,
    }
  })
}

/**
 * 审核 拒绝采纳
 * @param questionCommentId
 * @param failReason
 * @returns {AxiosPromise}
 */
export const checkFailRewardQuestion = (questionCommentId, failReason) => {
  return request({
    url: questionApi.QuestionRewardCheck,
    method: 'put',
    data: {
      type: 0,
      question_comment_id: questionCommentId,
      fail_reason: failReason,
    }
  })
}

export const getCheckRewardQuestionHistory = questionId => {
  return request({
    url: questionApi.QuestionRewardCheckHistory,
    method: 'get',
    params: {
      question_id: questionId
    }
  })
}

export const upgradeQuestionReward = (questionId, reward) => {
  return request({
    url: questionApi.QuestionRewardUpgrade,
    method: 'put',
    data: {
      question_id: questionId,
      reward
    }
  })
}
/**
 * 获取悬赏问答的状态
 * @param {状态 0关闭 1开启} status 
 * @returns 
 */
export const getGetRewardStatus = () => {
  return request({
    url: questionApi.GetRewardStatus,
    method: 'get',

  })
}
/**
 * 修改悬赏问答的状态
 * @param {状态 0关闭 1开启} status 
 * @returns 
 */
export const putPutRewardStatus = status => {
  return request({
    url: questionApi.PutRewardStatus,
    method: 'put',
    data: {
      status
    }
  })
}

/**
 *问答备注
 */
 export const putQuestionRemark = (questionId, adminRemark, adminRemarkColor) => {
  return request({
    url: questionApi.QuestionRemark,
    method: 'put',
    data: {
      question_id: questionId,
      admin_remark: adminRemark,
      admin_remark_color: adminRemarkColor
    }
  })
}
/**
 * 问答图片编辑保存 
 */
 export const putQuestionImages = (questionId, images) => {
  return request({
    url: questionApi.QuestionImages,
    method: 'put',
    data: {
      question_id: questionId,
      images
    }
  })
}
/**
 * 获取广告图列表
 */
 export const getAdvertisementPositions = userType => {
  return request({
    url: questionApi.AdvertisementPositions,
    method: 'get',
    params: {
      user_type: userType
    }
  })
}
/**
 * 删除广告
 */
 export const deleteAdvertisement = advertisementId => {
  return request({
    url: questionApi.Advertisement,
    method: 'delete',
    data: {
      advertisement_id: advertisementId,
    }
  })
}
/**
 * 修改或添加广告
 */
 export const postAdvertisement = (advertisementId, advertisementPositionId, type, userType, banner, startedAt, stoppedAt, jumpType, jumpId) => {
  return request({
    url: questionApi.Advertisement,
    method: 'post',
    data: {
      advertisement_id: advertisementId,
      advertisement_position_id: advertisementPositionId,
      type,
      user_type: userType,
      banner,
      started_at: startedAt,
      stopped_at: stoppedAt,
      jump_type: jumpType,
      jump_id: jumpId,
    }
  })
}
/**
 * 获取单个banner数据 
 */
 export const getAdvertisementPositionAdvertisements = (advertisementPositionId, userType, inTime) => {
  return request({
    url: questionApi.AdvertisementPositionAdvertisements,
    method: 'get',
    params: {
      advertisement_position_id: advertisementPositionId,
      user_type: userType,
      in_time: inTime
    }
  })
}
/**
 * 修改广告图展现方式
 */
 export const putAdvertisementPositionsShowRule = (advertisementPositionId, showRule) => {
  return request({
    url: questionApi.AdvertisementPositionsShowRule,
    method: 'put',
    data: {
      advertisement_position_id: advertisementPositionId,
      show_rule: showRule
    }
  })
}