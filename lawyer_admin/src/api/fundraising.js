
import request from '@/utils/request'

const AssetsApi = {
    fundraisingPage: 'web/fundraising-registration/page',
    fundraisingDelete: 'web/fundraising-registration',
    fundraisingData: 'web/fundraising-registration',
    fundraisingPutData: 'web/fundraising-registration',
    fundraisingDataHistory: 'web/fundraising-registration/check/history',
    fundraisingCheck: 'web/fundraising-registration/check',
    fundraisingCheckSave: 'web/fundraising-registration/check/save',
    fundraisingServicePage: 'web/fundraising-registration/customer-service/page',
    fundraisingContactLawyer: 'web/fundraising-registration/contact/lawyer',
    fundraisingContactLawyers: 'web/fundraising-registration/contact/lawyers',
    fundraisingServices: 'web/customer-services',
    fundraisingLawyerNumber: 'web/fundraising-registration/call-mobile',
    fundraisingUserNumber: 'web/user',
    fundraisingStatus: 'web/fundraising/status',
    fundraisingContacted: 'web/fundraising/contacted',
    fundraisingInterviewPage: 'web/fundraising-interview/page',
    fundraisingNotify: 'web/fundraising-interview/notify',
    fundraisingContact: 'web/fundraising-registration/contact',
    fundraisingInterview: 'web/fundraising-interview',
    fundraisingLawyerMessage: 'web/fundraising/quote-price/lawyer/message',
    fundraisingLawyerPage: 'web/fundraising-registration/lawyer/page',
    fundraisingLawyerConfirm: 'web/fundraising/lawyer/confirm',
    fundraisingAgreementData: 'web/fundraising/trust-agreement',
    fundraisingAgreementUpload: 'web/fundraising/trust-agreement',
    fundraisingAgreementDelete: 'web/fundraising/trust-agreement',
    fundraisingAgreementSubmit: 'web/fundraising/trust-agreement/submit',
    fundraisingClueData: 'web/fundraising/clue',
    fundraisingClueUpload: 'web/fundraising/clue',
    fundraisingClueSubmit: 'web/fundraising/clue/submit',
    fundraisingClueDelete: 'web/fundraising/clue',
    fundraisingDetailData: 'web/fundraising',
    fundraisingDetailInit: 'web/fundraising/init',
    fundraisingDetailUpload: 'web/fundraising',
    fundraisingDetailSubmit: 'web/fundraising/submit',
    fundraisingDataClose: 'web/fundraising/close',
    fundraisingRecommendData: 'web/fundraising/recommend/auth/page',
    fundraisingRecommendCheck: 'web/fundraising/recommend/auth/check',
    fundraisingAnnouncementData: 'web/announcement/page',
    fundraisingAnnouncement: 'web/announcement',
    fundraisingProgressPage: 'web/fundraising/progress/item/page',
    fundraisingProgressData: 'web/fundraising/progress/item',
    fundraisingProgressCheck: 'web/fundraising/progress/item/check',
    fundraisingMessage: 'web/fundraising-registration/message/auth',
    fundraisingRemind: 'web/fundraising/remind',
    fundraisingRegistration: 'web/fundraising-registration',
    fundraisingRegistrationSubmit: 'web/fundraising-registration/submit',
    fundraisingCoverImage: 'web/fundraising/cover-image',
    fundraisingPreview: 'web/fundraising/preview',
    fundraisingDisplay: 'web/fundraising/display',
    fundraisingListPage: 'web/fundraising/page',
    fundraisingRefund: 'web/fundraising/refund/litigation-costs',
    fundraisingLitigant: 'web/fundraising-registration/litigant',
    fundraisingSuggestion: 'web/fundraising-interview/suggestion',
    fundraisingClose: 'web/fundraising/close',
    fundraisingProgress: 'web/fundraising/progress/item',
    fundraisingSms: 'web/fundraising-registration/not-contacted/sms',
    fundraisingMobile: 'web/fundraising-registration/mobile',
    fundraisingRemarkStatus: 'web/fundraising/remark-status',
    fundraisingRemark: 'web/fundraising/remark',
    fundraisingDemands: 'web/fundraising/demands',
    fundraisingDemandsSubmit: 'web/fundraising/demands/submit',
    fundraisingDemandsText: 'web/fundraising/demands/text',
    fundraisingDemandsTextSubmit: 'web/fundraising/demands/text/submit',
    fundraisingDemandsOperator: 'web/fundraising/demands/operator/check',
    fundraisingDemandsOperatorHistory: 'web/fundraising/demands/operator/check/history',
    fundraisingCreator: 'web/fundraising/creator',
    fundraisingCreatorCheck: 'web/fundraising/creator/check',
    fundraisingCreatorSubmit: 'web/fundraising/creator/submit',
    fundraisingTrialStage: 'web/fundraising/trial-stage',
    fundraisingCaseSubmit: 'web/fundraising/case/submit',
    fundraisingUserSubmitCheck: 'web/fundraising/user/submit/check',
    fundraisingBidPage: 'web/fundraising/bid/page',
    fundraisingBidVotes: 'web/fundraising/bid/votes-number',
    fundraisingBid: 'web/fundraising/bid',
    fundraisingLawyerContact: 'web/fundraising/lawyer/contact',
    fundraisingLawyerContactMessage: 'web/fundraising/lawyer/contact/message',
    fundraisingLawyers: 'web/fundraising/lawyers',
    fundraisingLawyersData: 'web/fundraising/lawyer',
    fundraisingLawyersRemind: 'web/fundraising/remind',
    fundraisingLawyerMobile: 'web/fundraising/lawyer/mobile',
    fundraisingQuestionTags: 'web/question/tags/detail', // 案件类型
  }

/**
 * 获取众筹案件审核分页
 */

export const getFundraisingPage = (page, status, search, startDate, endDate) => {
  return request({
    url: AssetsApi.fundraisingPage,
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
 * 删除审核中的众筹案件
 */

 export const deleteFundraisingDelete = (fundraisingRegistrationId) => {
    return request({
      url: AssetsApi.fundraisingDelete,
      method: 'delete',
      data: {
        fundraising_registration_id: fundraisingRegistrationId
      }
    })
  }
  /**
 * 获取审核中的众筹案件详情
 */

 export const getFundraisingData = (fundraisingRegistrationId) => {
    return request({
      url: AssetsApi.fundraisingData,
      method: 'get',
      params: {
        fundraising_registration_id: fundraisingRegistrationId
      }
    })
  }
/**
 * 获取众筹案件审核历史
 */

 export const getFundraisingDataHistory = (createUserId) => {
    return request({
      url: AssetsApi.fundraisingDataHistory,
      method: 'get',
      params: {
        create_user_id: createUserId
      }
    })
  }
  /**
 * 修改众筹登记信息
 */

 export const putFundraisingPutData = (fundraiseRegistrationId, creatorNickname, creatorMobile, litigantNickname, litigantMobile, content, appeal, images, checkFiles) => {
  return request({
    url: AssetsApi.fundraisingPutData,
    method: 'put',
    data: {
      fundraise_registration_id: fundraiseRegistrationId,
      creator_nickname: creatorNickname,
      creator_mobile: creatorMobile,
      litigant_nickname: litigantNickname,
      litigant_mobile: litigantMobile,		
      content,
      appeal,
      images,
      check_files: checkFiles
  }
  })
}
/**
 * 审核众筹案件
 */
 export const postFundraisingCheck = (status,
   lawyerUserIds,
    refuseReason,
    fundraisingRegistrationId, 
    caseMoney, 
    lawyerMoney, 
    propertyMoney, 
    litigationMoney, 
    appraisalMoney,
    caseAllMoney,
    content, 
    appeal, 
    lawyerTagId, 
    trialStage,
    provinceId,
    cityId,
    litigantRole,
    otherSideNicknames,
    ownSideNicknames,
    isPromote,
    ) => {
    return request({
      url: AssetsApi.fundraisingCheck,
      method: 'post',
      data: {
        status,
        lawyer_user_ids: lawyerUserIds,
        refuse_reason: refuseReason,
        fundraising_registration_id: fundraisingRegistrationId,	
        case_money: caseMoney,
        lawyer_money: lawyerMoney,
        property_money: propertyMoney,
        litigation_money: litigationMoney,
        appraisal_money: appraisalMoney,
        case_all_money: caseAllMoney,
        appeal,	
        content,
        lawyer_tag_id: lawyerTagId,
        trial_stage: trialStage,
        province_id: provinceId,
        city_id: cityId,
        litigant_role: litigantRole,
        other_side_nicknames: otherSideNicknames,
        own_side_nicknames: ownSideNicknames,
        is_promote: isPromote, 
    }
    })
  }
  /**
 * 保存审核众筹案件
 */
 export const postFundraisingCheckSave = (fundraisingRegistrationId,
   caseMoney, 
   lawyerMoney, 
   propertyMoney, 
   litigationMoney, 
   appraisalMoney,
   caseAllMoney,
   content, 
   appeal, 
   lawyerTagId, 
   trialStage,
   provinceId,
   cityId,
   litigantRole,
   otherSideType,
   ownSideType,
   otherSideNicknames,
   ownSideNicknames,
   isPromote,
   litigantUserNicknames,
  ) => {
   return request({
     url: AssetsApi.fundraisingCheckSave,
     method: 'post',
     data: {
       fundraising_registration_id: fundraisingRegistrationId,	
       case_money: caseMoney,
       lawyer_money: lawyerMoney,
       property_money: propertyMoney,
       litigation_money: litigationMoney,
       appraisal_money: appraisalMoney,
       case_all_money: caseAllMoney,
       appeal,	
       content,
       lawyer_tag_id: lawyerTagId,
       trial_stage: trialStage,
       province_id: provinceId,
       city_id: cityId,
       litigant_role: litigantRole,
       other_side_type: otherSideType,
       own_side_type: ownSideType,
       other_side_nicknames: otherSideNicknames,
       own_side_nicknames: ownSideNicknames,
       is_promote: isPromote,
       litigant_user_nicknames: litigantUserNicknames,
      
   }
   })
 }
/**
 * 获取客服订单分页
 */
 export const getFundraisingServicePage = (page, status, search, startDate, endDate, isPendingHandle, isCollect, isGiveUp) => {
  return request({
    url: AssetsApi.fundraisingServicePage,
    method: 'get',
    params: {
      page,
      status,
      search,
      start_date: startDate,
      end_date: endDate,
      is_pending_handle: isPendingHandle,
      is_collect: isCollect,
      is_give_up: isGiveUp
    }
  })
}
/**
 * 追加站内律师
 */

 export const postFundraisingLawyer = (fundraisingRegistrationId, lawyerUserIds) => {
  return request({
    url: AssetsApi.fundraisingContactLawyer,
    method: 'post',
    data: {
      fundraising_registration_id: fundraisingRegistrationId,
      lawyer_user_ids: lawyerUserIds,
  }
  })
}
/**
 *获取客服联系律师列表(左边列表)
 */

 export const getFundraisingLawyers = (fundraisingRegistrationId) => {
  return request({
    url: AssetsApi.fundraisingContactLawyers,
    method: 'get',
    params: {
      fundraising_registration_id: fundraisingRegistrationId,
  }
  })
}
/**
 *获取客服列表
 */

 export const getFundraisingServices = () => {
  return request({
    url: AssetsApi.fundraisingServices,
    method: 'get',
  })
}
/**
 *获取律师号码
 */

 export const getFundraisingLawyerNumber = (fundraisingRegistrationContactId) => {
  return request({
    url: AssetsApi.fundraisingLawyerNumber,
    method: 'get',
    params: {
      fundraising_registration_contact_id: fundraisingRegistrationContactId,
  }
  })
}

/**
 *根据用户手机号码获取用户信息
 */

 export const getFundraisingUserNumber = (mobile) => {
  return request({
    url: AssetsApi.fundraisingUserNumber,
    method: 'get',
    params: {
      mobile
  }
  })
}
/**
 *获取订单详情
 */

 export const getFundraisingStatus = (fundraisingProgressId) => {
  return request({
    url: AssetsApi.fundraisingStatus,
    method: 'get',
    params: {
      fundraising_progress_id: fundraisingProgressId	
  }
  })
}
/**
 * 设置联系状态
 */

 export const putFundraisingContacted = (fundraisingRegistrationContactId, isContacted) => {
  return request({
    url: AssetsApi.fundraisingContacted,
    method: 'put',
    data: {
      fundraising_registration_contact_id: fundraisingRegistrationContactId,
      is_contacted: isContacted
  }
  })
}

/**
 * 发送众筹登记申请人脸认证的消息
 */

 export const postFundraisingMessage = (fundraisingRegistrationId, mobile) => {
  return request({
    url: AssetsApi.fundraisingMessage,
    method: 'POST',
    data: {
      fundraising_registration_id: fundraisingRegistrationId,
      mobile
  }
  })
}
/**
 * 获取线下约谈分页
 */
 export const getFundraisingInterviewPage = (page, fundraisingRegistrationId) => {
  return request({
    url: AssetsApi.fundraisingInterviewPage,
    method: 'get',
    params: {
      page,
      fundraising_registration_id: fundraisingRegistrationId
  }
  })
}
/**
 * 提醒用户线下约谈
 */

 export const postFundraisingNotify = (fundraisingInterviewId) => {
  return request({
    url: AssetsApi.fundraisingNotify,
    method: 'post',
    data: {
      fundraising_interview_id: fundraisingInterviewId,

  }
  })
}
/**
 * 创建线下约谈
 */
export const postFundraisingInterview = (fundraisingRegistrationContactId, interviewProvince, interviewCity, interviewAddress, interviewAt, lng, lat) => {
  return request({
    url: AssetsApi.fundraisingInterview,
    method: 'post',
    data: {
      fundraising_registration_contact_id: fundraisingRegistrationContactId,
      interview_province: interviewProvince,
      interview_city: interviewCity,
      interview_address: interviewAddress,
      interview_at: interviewAt,
      lng,
      lat
  }
  })
}
/**
 * 获取线下约谈信息
 */
 export const getFundraisingContact = (fundraisingRegistrationContactId) => {
  return request({
    url: AssetsApi.fundraisingContact,
    method: 'get',
    params: {
      fundraising_registration_contact_id: fundraisingRegistrationContactId,

  }
  })
}
/**
 * 发送报价单 
 */
 export const postFundraisingLawyerMessage = (fundraisingInterviewId) => {
  return request({
    url: AssetsApi.fundraisingLawyerMessage,
    method: 'post',
    data: {
      fundraising_interview_id: fundraisingInterviewId
  }
  })
}
/**
 *众筹案件律师分页
 */
 export const getFundraisingLawyerPage = (page, search, fundraisingRegistrationId, perPage) => {
  return request({
    url: AssetsApi.fundraisingLawyerPage,
    method: 'get',
    params: {
      page,
      search,
      fundraising_registration_id: fundraisingRegistrationId,
      per_page: perPage
  }
  })
}
/**
 * 确认委托律师
 */
 export const putFundraisingLawyerConfirm = (fundraisingProgressId, lawyerUserId) => {
  return request({
    url: AssetsApi.fundraisingLawyerConfirm,
    method: 'put',
    data: {
      fundraising_progress_id: fundraisingProgressId,
      lawyer_user_id: lawyerUserId
  }
  })
}
/**
 * 获取委托协议信息  
 */
 export const getFundraisingAgreementData = (fundraisingProgressId) => {
  return request({
    url: AssetsApi.fundraisingAgreementData,
    method: 'get',
    params: {
      fundraising_progress_id: fundraisingProgressId,
  }
  })
}
/**
 * 上传委托协议文件
 */
 export const postFundraisingAgreementUpload = (from) => {
  return request({
    url: AssetsApi.fundraisingAgreementUpload,
    method: 'post',
       data: from
  })
}
/**
 * 删除文件
 */
 export const deleteFundraisingAgreementDelete = (fundraisingTrustAgreementId) => {
  return request({
    url: AssetsApi.fundraisingAgreementDelete,
    method: 'DELETE',
    data: {
      fundraising_trust_agreement_id: fundraisingTrustAgreementId,
  }
  })
}
/**
 * 确认上传委托协议
 */
 export const postFundraisingAgreementSubmit = (fundraisingProgressId, lawyers) => {
  return request({
    url: AssetsApi.fundraisingAgreementSubmit,
    method: 'post',
    data: {
      fundraising_progress_id: fundraisingProgressId,
      lawyers
  }
  })
}
/**
 * 获取众筹收集资料信息
 */
 export const getFundraisingClueData = (fundraisingProgressId) => {
  return request({
    url: AssetsApi.fundraisingClueData,
    method: 'get',
    params: {
      fundraising_progress_id: fundraisingProgressId,
  }
  })
}
/**
 * 上传众筹收集资料文件
 */
 export const postFundraisingClueUpload = (form) => {
  return request({
    url: AssetsApi.fundraisingClueUpload,
    method: 'post',
    data: form
  })
}
/**
 * 提交众筹收集资料
 */
 export const postFundraisingClueSubmit = (fundraisingProgressId, graphicAdminId, videoAdminId, promoteAdminId) => {
  return request({
    url: AssetsApi.fundraisingClueSubmit,
    method: 'post',
    data: {
      fundraising_progress_id: fundraisingProgressId,
      graphic_admin_id: graphicAdminId,
      video_admin_id: videoAdminId,
      promote_admin_id: promoteAdminId,
  }
  })
}
/**
 * 删除文件
 */
 export const deleteFundraisingClueDelete = (fundraisingClueFileId) => {
  return request({
    url: AssetsApi.fundraisingClueDelete,
    method: 'DELETE',
    data: {
      fundraising_clue_file_id: fundraisingClueFileId,
  }
  })
}
/**
 * 查看筹款案件详情
 */
 export const getFundraisingDetailData = (fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingDetailData,
    method: 'get',
    params: {
      fundraising_id: fundraisingId,
  }
  })
}
/**
 * 初始化创建筹款案件
 */
 export const postFundraisingDetailInit = (fundraisingProgressId) => {
  return request({
    url: AssetsApi.fundraisingDetailInit,
    method: 'post',
    data: {
      fundraising_progress_id: fundraisingProgressId,

  }
  })
}
/**
 * 保存筹款案件信息
 */
 export const postFundraisingDetailUpload = (form) => {
  return request({
    url: AssetsApi.fundraisingDetailUpload,
    method: 'PUT',
    data: form
  })
}
/**
 * 确认提交案件
 */
 export const postFundraisingDetailSubmit = (form) => {
  return request({
    url: AssetsApi.fundraisingDetailSubmit,
    method: 'PUT',
    data: form
  })
}
/**
 * 众筹结案
 */
 export const postFundraisingDataClose = (fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingDataClose,
    method: 'post',
    data: {
      fundraising_id: fundraisingId,

  }
  })
}
/**
 * 获取众筹申请推荐位列表
 */
 export const getFundraisingRecommendData = (page, type, search, startDate, endDate) => {
  return request({
    url: AssetsApi.fundraisingRecommendData,
    method: 'get',
    params: {
      page,
      type,
      search,
      start_date: startDate,
      end_date: endDate,
  }
  })
}
/**
 * 申请推荐位众筹
 */
 export const postFundraisingRecommendCheck = (fundraisingRecommendAuthId, status) => {
  return request({
    url: AssetsApi.fundraisingRecommendCheck,
    method: 'post',
    data: {
      fundraising_recommend_auth_id: fundraisingRecommendAuthId,
      status
  }
  })
}
/**
 *获取平台公告分页
 */
 export const getFundraisingAnnouncementData = (page, startDate, endDate) => {
  return request({
    url: AssetsApi.fundraisingAnnouncementData,
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
 export const postFundraisingAnnouncement = (title, content, announcementId) => {
  return request({
    url: AssetsApi.fundraisingAnnouncement,
    method: 'post',
    data: {
      title,
      content,
      announcement_id: announcementId
  }
  })
}
/**
 * 删除平台公告
 */
 export const deleteFundraisingAnnouncement = (announcementId) => {
  return request({
    url: AssetsApi.fundraisingAnnouncement,
    method: 'DELETE',
    data: {
      announcement_id: announcementId,
  }
  })
}
/**
 * 获取公告详情
 */
 export const getFundraisingAnnouncement = (announcementId) => {
  return request({
    url: AssetsApi.fundraisingAnnouncement,
    method: 'get',
    params: {
      announcement_id: announcementId,
  }
  })
}
/**
 * 众筹进度审核分页
 */
 export const getFundraisingProgressPage = (page, search, startDate, endDate) => {
  return request({
    url: AssetsApi.fundraisingProgressPage,
    method: 'get',
    params: {
      page,
      search,
      start_date: startDate,
      end_date: endDate,
  }
  })
}
/**
 * 众筹进度详情 
 */
 export const getFundraisingProgressData = (fundraisingId, sort) => {
  return request({
    url: AssetsApi.fundraisingProgressData,
    method: 'get',
    params: {
      fundraising_id: fundraisingId,
      sort
  }
  })
}
/**
 * 审核案件进度 
 */
 export const getFundraisingProgressCheck = (fundraisingProgressItemAuthId, type, refuseReason) => {
  return request({
    url: AssetsApi.fundraisingProgressCheck,
    method: 'POST',
    data: {
      fundraising_progress_item_auth_id: fundraisingProgressItemAuthId,
      type,
      refuse_reason: refuseReason
  }
  })
}
/**
 * 提醒上传 
 */
 export const postFundraisingRemind = (type, fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingRemind,
    method: 'POST',
    data: {
      type,
      fundraising_id: fundraisingId
  }
  })
}
/**
 * 修改众筹登记信息
 */
 export const putFundraisingRegistration = (fundraiseRegistrationId, nickname, mobile, content, images) => {
  return request({
    url: AssetsApi.fundraisingRegistration,
    method: 'PUT',
    data: {
      fundraise_registration_id: fundraiseRegistrationId,
      nickname,
      mobile,
      content,	
      images,
    }
  })
}
/**
 * 确认提交众筹登记
 */
 export const putFundraisingRegistrationSubmit = (fundraiseRegistrationId, isNotAuth, notAuthReason, notAuthImages, creatorNickname, creatorMobile, litigantNickname, litigantMobile, content, images, checkFiles, appeal) => {
  return request({
    url: AssetsApi.fundraisingRegistrationSubmit,
    method: 'PUT',
    data: {
      fundraise_registration_id: fundraiseRegistrationId,
      is_not_auth: isNotAuth,
      not_auth_reason: notAuthReason,	
      not_auth_images: notAuthImages,
      creator_nickname: creatorNickname,	
      creator_mobile: creatorMobile,
      litigant_nickname: litigantNickname,
      litigant_mobile: litigantMobile,
      content,
      images,
      check_files: checkFiles,
      appeal
    }
  })
}
/**
 * 修改封面图片
 */
 export const postFundraisingCoverImage = (form) => {
  return request({
    url: AssetsApi.fundraisingCoverImage,
    method: 'POST',
    data: form
  })
}
/**
 * 发送预览消息
 */
 export const postFundraisingPreview = (fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingPreview,
    method: 'POST',
    data: {
      fundraising_id: fundraisingId,
  }
  })
}
/**
 * 发布/下架众筹
 * is_display	是否发布 1是 0不是
 */
 export const postFundraisingDisplay = (fundraisingId, isDisplay) => {
  return request({
    url: AssetsApi.fundraisingDisplay,
    method: 'POST',
    data: {
      fundraising_id: fundraisingId,
      is_display: isDisplay
  }
  })
}
/**
 * 获取筹款案件分页
 */
 export const getFundraisingListPage = (page, search, startDate, endDate, perPage) => {
  return request({
    url: AssetsApi.fundraisingListPage,
    method: 'get',
    params: {
      page,
      search,
      start_date: startDate,
      end_date: endDate,
      per_page: perPage,
    }
  })
}
/**
 * 退还诉讼费
 */
 export const postFundraisingRefund = (fundraisingId, money) => {
  return request({
    url: AssetsApi.fundraisingRefund,
    method: 'POST',
    data: {
      fundraising_id: fundraisingId,
      money
  }
  })
}
/**
 * 确认当事人
 * 
 */
 export const putFundraisingLitigant = (fundraisingRegistrationId, userId) => {
  return request({
    url: AssetsApi.fundraisingLitigant,
    method: 'PUT',
    data: {
      fundraising_registration_id: fundraisingRegistrationId,
      user_id: userId,
    }
  })
}
/**
 * 地图搜索建议
 * fundraisingSuggestion
 */
 export const getFundraisingSuggestion = (search, lawyerUserId) => {
  return request({
    url: AssetsApi.fundraisingSuggestion,
    method: 'get',
    params: {
      search,
      lawyer_user_id: lawyerUserId,
    }
  })
}

/**
 * 众筹结案
 */
 export const postFundraisingClose = (fundraisingId, isEarlyClose) => {
  return request({
    url: AssetsApi.fundraisingClose,
    method: 'POST',
    data: {
      fundraising_id: fundraisingId,
      is_early_close: isEarlyClose
  }
  })
}
/**
 * 添加筹款进度
 */
 export const postFundraisingProgress = (fundraisingId, fundraisingProgress, images) => {
  return request({
    url: AssetsApi.fundraisingProgress,
    method: 'POST',
    data: {
      fundraising_id: fundraisingId,
      fundraising_progress: fundraisingProgress,
      images
  }
  })
}
/**
 * 删除筹款进度
 */
 export const deleteFundraisingProgress = (fundraisingProgressItemId) => {
  return request({
    url: AssetsApi.fundraisingProgress,
    method: 'DELETE',
    data: {
      fundraising_progress_item_id: fundraisingProgressItemId,
  }
  })
}
/**
 * 发送未联系到的短信
 */
 export const postFundraisingSms = (mobile, fundraisingRegistrationId) => {
  return request({
    url: AssetsApi.fundraisingSms,
    method: 'POST',
    data: {
      mobile,
      fundraising_registration_id: fundraisingRegistrationId
  }
  })
}
/**
 * 
 * 客服拨打号码
 */
 export const postFundraisingMobile = (mobile, fundraisingRegistrationId) => {
  return request({
    url: AssetsApi.fundraisingMobile,
    method: 'POST',
    data: {
      mobile,
      fundraising_registration_id: fundraisingRegistrationId
  }
  })
}
/**
 * 修改备注状态
 * 
 */
 export const putFundraisingRemarkStatus = (fundraisingProgressId, remarkStatus) => {
  return request({
    url: AssetsApi.fundraisingRemarkStatus,
    method: 'PUT',
    data: {
      fundraising_progress_id: fundraisingProgressId,
      remark_status: remarkStatus,
    }
  })
}
/**
 * 修改备注
 * 
 */
 export const putFundraisingRemark = (fundraisingProgressId, remark) => {
  return request({
    url: AssetsApi.fundraisingRemark,
    method: 'PUT',
    data: {
      fundraising_progress_id: fundraisingProgressId,
      remark
    }
  })
}
/**
 * 获取众筹材料需求文字列表
 */
 export const getFundraisingDemandsText = (fundraisingRegistrationId) => {
  return request({
    url: AssetsApi.fundraisingDemandsText,
    method: 'get',
    params: {
      fundraising_registration_id: fundraisingRegistrationId
    }
  })
}
/**
 * 提交材料需求 
 */
 export const postFundraisingDemandsTextSubmit = (fundraisingRegistrationId, demandTextDescriptions) => {
  return request({
    url: AssetsApi.fundraisingDemandsTextSubmit,
    method: 'POST',
    data: {
      fundraising_registration_id: fundraisingRegistrationId,
      demand_text_descriptions: demandTextDescriptions
  }
  })
}
/**
 * 获取众筹客服上传素材列表
 */
 export const getFundraisingDemands = (fundraisingRegistrationId) => {
  return request({
    url: AssetsApi.fundraisingDemands,
    method: 'get',
    params: {
      fundraising_registration_id: fundraisingRegistrationId
    }
  })
}
/**
 *提交客服上传素材列表
 */
 export const postFundraisingDemandsSubmit = (fundraisingRegistrationId, demands) => {
  return request({
    url: AssetsApi.fundraisingDemandsSubmit,
    method: 'POST',
    data: {
      fundraising_registration_id: fundraisingRegistrationId,
      demands
  }
  })
}
/**
 *保存材料需求
 */
 export const postFundraisingDemandsText = (fundraisingRegistrationId, demandTextDescriptions) => {
  return request({
    url: AssetsApi.fundraisingDemandsText,
    method: 'POST',
    data: {
      fundraising_registration_id: fundraisingRegistrationId,
      demand_text_descriptions: demandTextDescriptions
  }
  })
}
/**
 *保存客服上传素材列表
 */
 export const postFundraisingDemands = (fundraisingRegistrationId, demands) => {
  return request({
    url: AssetsApi.fundraisingDemands,
    method: 'POST',
    data: {
      fundraising_registration_id: fundraisingRegistrationId,
      demands
  }
  })
}
/**
 * 运营审核上传素材
 */
 export const postFundraisingDemandsOperator = (fundraisingRegistrationId, result, reason) => {
  return request({
    url: AssetsApi.fundraisingDemandsOperator,
    method: 'POST',
    data: {
      fundraising_registration_id: fundraisingRegistrationId,
      result,
      reason,

  }
  })
}
/**
 * 运营审核素材上传历史 
 */
 export const getFundraisingDemandsOperatorHistory = (fundraisingRegistrationId) => {
  return request({
    url: AssetsApi.fundraisingDemandsOperatorHistory,
    method: 'get',
    params: {
      fundraising_registration_id: fundraisingRegistrationId
    }
  })
}
/**
 * 获取众筹案件信息
 */
 export const getFundraisingCreator = (fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingCreator,
    method: 'get',
    params: {
      fundraising_id: fundraisingId
    }
  })
}
/**
 * 保存众筹案件信息
 */
 export const putFundraisingCreator = (fundraisingId, title, content, coverImage, images, videos) => {
  return request({
    url: AssetsApi.fundraisingCreator,
    method: 'put',
    data: {
      fundraising_id: fundraisingId,
      title,
      content,
      cover_image: coverImage,
      images,
      videos
    }
  })
}
/**
 * 确认提交众筹案件信息
 */
 export const putFundraisingCreatorSubmit = (fundraisingId, title, content, coverImage, images, videos) => {
  return request({
    url: AssetsApi.fundraisingCreatorSubmit,
    method: 'put',
    data: {
      fundraising_id: fundraisingId,
      title,
      content,
      cover_image: coverImage,
      images,
      videos
    }
  })
}

/**
 * 审核众筹案件求助信息
 */
 export const putFundraisingCreatorCheck = (fundraisingId, result, reason) => {
  return request({
    url: AssetsApi.fundraisingCreatorCheck,
    method: 'put',
    data: {
      fundraising_id: fundraisingId,
      result,
      reason,
    }
  })
}
/**
 *  获取审理阶段
 */
 export const getFundraisingTrialStage = (fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingTrialStage,
    method: 'get',
    params: {
      fundraising_id: fundraisingId
    }
  })
}
/**
 * 确认众筹案件案件信息
 */
 export const putFundraisingCaseSubmit = (fundraisingId, sendType, title, appeal, content, coverImage, images, videos) => {
  return request({
    url: AssetsApi.fundraisingCaseSubmit,
    method: 'put',
    data: {
      fundraising_id: fundraisingId,
      send_type: sendType,
      title,
      appeal,
      content,
      cover_image: coverImage,
      images,
      videos,
    }
  })
}
/**
 *   审核用户的求助说明
 */
 export const putFundraisingUserSubmitCheck = (fundraisingId, result, reason) => {
  return request({
    url: AssetsApi.fundraisingUserSubmitCheck,
    method: 'put',
    data: {
      fundraising_id: fundraisingId,
      result,
      reason,
    }
  })
}
/**
 * 众筹律师竞标分页
 */
export const getFundraisingBidPage = (page, fundraisingId) => {
return request({
  url: AssetsApi.fundraisingBidPage,
  method: 'get',
  params: {
    page,
    fundraising_id: fundraisingId
  }
})
}
/**
 * 修改票数 
 */
 export const putFundraisingBidVotes = (fundraisingLawyerBidId, votesNumber) => {
  return request({
    url: AssetsApi.fundraisingBidVotes,
    method: 'put',
    data: {
      fundraising_lawyer_bid_id: fundraisingLawyerBidId,
      votes_number: votesNumber,

    }
  })
}
/**
 * 删除竞选律师
 */
 export const deleteFundraisingBid = (fundraisingLawyerBidId) => {
  return request({
    url: AssetsApi.fundraisingBid,
    method: 'DELETE',
    data: {
      fundraising_lawyer_bid_id: fundraisingLawyerBidId,
  }
  })
}
/**
 * 获取签订合同信息
 */
 export const getFundraisingLawyerContact = (fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingLawyerContact,
    method: 'get',
    params: {
      fundraising_id: fundraisingId
    }
  })
  }
  /**
 * 保存签订合同
 */
 export const postFundraisingLawyerContact = (fundraisingId, lawyerRecvMobile, lawyerRecvNickname, lawyerRecvAddress, lawyerShipNo, trustAgreementImages, powerOfAttorneyImages) => {
  return request({
    url: AssetsApi.fundraisingLawyerContact,
    method: 'POST',
    data: {
      fundraising_id: fundraisingId,
      lawyer_recv_mobile: lawyerRecvMobile,
      lawyer_recv_nickname: lawyerRecvNickname,
      lawyer_recv_address: lawyerRecvAddress,
      lawyer_ship_no: lawyerShipNo,
      trust_agreement_images: trustAgreementImages,
      power_of_attorney_images: powerOfAttorneyImages,
  }
  })
}
/**
 * 发送完整案件信息
 */
   export const postFundraisingLawyerContactMessage = (fundraisingId) => {
    return request({
      url: AssetsApi.fundraisingLawyerContactMessage,
      method: 'POST',
      data: {
        fundraising_id: fundraisingId,
    }
    })
  }
  /**
 *获取众筹律师列表
 */
 export const getFundraisingLawyersList = (fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingLawyers,
    method: 'get',
    params: {
      fundraising_id: fundraisingId
    }
  })
  }
   /**
 *获取众筹律师详情
 */
 export const getFundraisingLawyersData = (fundraisingLawyerId) => {
  return request({
    url: AssetsApi.fundraisingLawyersData,
    method: 'get',
    params: {
      fundraising_lawyer_id: fundraisingLawyerId
    }
  })
  }
  /**
 * 确认律师发布
 */
 export const postFundraisingLawyersData = (fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingLawyersData,
    method: 'POST',
    data: {
      fundraising_id: fundraisingId,
  }
  })
}
 /**
* 提醒上传
*/
export const postFundraisingLawyersRemind = (type, fundraisingId) => {
 return request({
   url: AssetsApi.fundraisingLawyersRemind,
   method: 'POST',
   data: {
     type,
     fundraising_id: fundraisingId,
 }
 })
}
/**
 * 拨打电话给律师
 */
 export const postFundraisingLawyerMobile = (fundraisingId) => {
  return request({
    url: AssetsApi.fundraisingLawyerMobile,
    method: 'POST',
    data: {
      fundraising_id: fundraisingId,
  }
  })
 }
/**
 * 获取案件类型标签
 */
 export const getFundraisingQuestionTags = () => {
  return request({
    url: AssetsApi.fundraisingQuestionTags,
    method: 'get',
    params: {
  }
  })
}
