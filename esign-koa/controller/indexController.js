const eSignUtil = require('../utils/eSignUtil');
const httpESignUtil = require('../utils/httpESignUtil');

class indexController {
  constructor() {}

  /**
   * e签宝 发起一步签署
   */
  async createFlowOneESign(ctx) {
    // 个人签署信息
    // const userSignInfo = {
    //   userName: '韩宇',
    //   userIdNumber: '510824199710070536',
    //   userMobile: '15328058249',
    //   userEmail: '1807003141@qq.com'
    // };

    const userSignInfo = {
      userName: '周子琪',
      userIdNumber: '211103199806120323',
      userMobile: '18069067327',
      userEmail: '1807003141@qq.com'
    };
    // 个人签署账号 id
    const personAccountId = await eSignUtil.createPersonAccountId(userSignInfo);
    if (!personAccountId) return ctx.body = { msg: '个人签署账号创建失败' };

    
    // 企业签署信息
    const orgSignInfo = {
      orgName: '浙江律快答网络科技有限公司',
      orgIdNumber: '91330108MA7JPF1P55',
      orgUserName: '凌鹏',
    };
    // 企业签署账号 id
    const orgAccountId = await eSignUtil.createOrgAccountId(orgSignInfo);
    if (!orgAccountId) return ctx.body = { msg: '企业签署账号创建失败' };
    
    
    // 上传合同文件
    const signFileId = await eSignUtil.uploadFile();

    // 本次签署流程的基本信息
    const flowInfo = {
      businessScene: '企业律云套餐合同', // 本次签署流程的文件主题名称
      autoArchive: true,  // 全部签章后流程自动结束
      autoInitiate: true, // 自动开启签署流程
      flowConfigInfo: {
        // noticeDeveloperUrl: 'http://localhost:3000/esign-notify', // 通知开发者回调地址
        noticeDeveloperUrl: 'http://d9ce-39-174-79-191.ngrok.io/esign-notify', // 通知开发者回调地址
        noticeType: '1,2', // 签署通知方式 1-短信，2-邮件
        batchDropSeal: true // 签署页是否显示“一键落章”按钮
      }
    }

    // 签署方信息
    const signers1 = {
      platformSign: false, // 是否平台方自动签署
      // 签署方账号信息
      signerAccount: {
        signerAccountId: personAccountId, // 签署操作人个人账号标
        // authorizedAccountId: orgAccountId // 签约主体账号标识，即本次签署对应任务的归属方
      },
      // 签署方的签署区列表数据
      signfields: [
        {
          // actorIndentityType: '2', // 企业主体签约类型 0-个人盖章，2-机构盖章
          fileId: signFileId, // 文件 fileId
          signType: '0', // 签署类型
          sealType: '0,1', // 签署方式 0-手绘签名 1-模板印章签名
          // posBean: posBean1 // 签署区位置信息
        }
      ]
    };

    // 平台方自动签署
    const signers2 = {
      platformSign: true, // 是否平台方自动签署
      // 签署方的签署区列表数据
      signfields: [
        {
          autoExecute: true, // 是否自动执行签署
          actorIndentityType: '2', // 企业主体签约类型 0-个人盖章，2-机构盖章
          fileId: signFileId, // 文件 fileId
          signType: '1', // 签署类型 自动签署必须指定签署类型
          sealType: '0,1', // 签署方式 0-手绘签名 1-模板印章签名
          // 签署区位置信息 注：signType为 1 时, 页码和XY坐标不能为空
          posBean: {
            posPage: "1",
            posX: 100.00,
            posY: 100.00
          } // 签署区位置信息
        }
      ]
    };
    // 签署方信息
    const signers = [ signers1, signers2];
    // 待签署文件信息
    const docs = [{ fileId: signFileId, fileName: '企业律云' }];

    // 请求 body
    const reqBodyData = { flowInfo, signers, docs };
    // 接口地址 注：v3版本提供免登录签署
    const createFlowOneESignUrl = '/api/v2/signflows/createFlowOneStep';
    
    try {
      const postReqESignRes = await httpESignUtil.postReqESign(createFlowOneESignUrl, reqBodyData);
      console.log(postReqESignRes);
      
      if (postReqESignRes.code !== 0) throw('获取上传链接错误');
      ctx.body = postReqESignRes;
    } catch (error) {
      // console.log(error);
      ctx.body = { msg: '发起一键签署失败' };
    }
  }

  /**
   * e签宝 回调通知
   */
  async esignCallBackNotify(ctx) {
    console.log('签署回调', ctx);
  }
}
  
module.exports = new indexController;
