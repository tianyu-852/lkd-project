<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
        <span style="margin-left: 6px;">企业套餐信息</span>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="edit-module">
        <!-- 企业名称 -->
        <div class="edit-item">
          <div class="edit-left">企业名称：</div>
          <div class="edit-middle">
            <a-input
              class="input"
              style="width: 360px;"
              v-model="enterpriseServeInfo.enterpriseName"
              :disabled="true"
              placeholder="请输入企业名称"
              allowClear />
          </div>
          
          <a-button type="primary" style="margin-left: 20px; padding: 0 6px;" @click="relationEnterpriseModal.isShowRelationEnterpriseModal = true">添加关联企业</a-button>
        </div>

        <!-- 关联企业 -->
        <div v-for="(rItem, rIndex) of enterpriseServeInfo.relationEnterpriseList" :key="rIndex" class="edit-item relation-item">
          <div class="edit-left">关联企业{{ rIndex + 1 }}：</div>
          <div class="edit-middle">
            <div class="enterprise-name">{{ rItem }}</div>
          </div>
          <div class="remove-btn" @click="enterpriseServeInfo.relationEnterpriseList.splice(rIndex, 1)">删除</div>
        </div>

        <a-divider />

        <!-- 企业套餐 -->
        <div class="edit-item">
          <div class="edit-left">企业套餐：</div>
          <div class="edit-middle">
            <a-select style="width: 200px;" :disabled="isDisalbeUpateEnterpriseLawServe ? true : false" v-model="enterpriseServeInfo.enterpriseLawServeVipId" placeholder="请选择套餐类型" allowClear>
              <a-select-option v-for="sItem in enterpriseLawServeVipSelectList" :value="sItem.value" :key="sItem.value">
                {{ sItem.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!-- 企业套餐起止时间 -->
        <div class="edit-item">
          <div class="edit-left">起止时间：</div>
          <div class="edit-middle">
            <a-date-picker v-model="enterpriseServeInfo.enterpriseLawServeVipStartDate" :disabled="isDisalbeUpateEnterpriseLawServe ? true : false" placeholder="请选择开始时间" />
            <span style="margin: 0 10px; font-weight: 5000;">至</span>
            <a-date-picker v-model="enterpriseServeInfo.enterpriseLawServeVipEndDate" :disabled="isDisalbeUpateEnterpriseLawServe ? true : false" placeholder="请选择结束时间" />
          </div>
        </div>

        <div class="edit-item">
          <div class="edit-left">实际售卖价：</div>
          <div class="edit-middle">
            <a-input class="input" style="width: 360px;" v-model="enterpriseServeInfo.enterpriseLawServeRealPrice" placeholder="不填则是套餐原价" allowClear />
          </div>
        </div>

        <a-divider />

        <!-- 个人套餐 -->
        <!-- <div class="edit-item">
          <div class="edit-left">个人套餐：</div>
          <div class="edit-middle">
            <a-select style="width: 200px;" :disabled="isDisalbeUpatePersonLawServe ? true : false" v-model="enterpriseServeInfo.personLawServeVipId" placeholder="请选择套餐类型" allowClear>
              <a-select-option v-for="sItem in personLawServeVipSelectList" :value="sItem.value" :key="sItem.value">
                {{ sItem.label }}
              </a-select-option>
            </a-select>
          </div>
        </div> -->

        <!-- 个人套餐起止时间 -->
        <!-- <div class="edit-item">
          <div class="edit-left">起止时间：</div>
          <div class="edit-middle">
            <a-date-picker v-model="enterpriseServeInfo.personLawServeVipStartDate" :disabled="isDisalbeUpatePersonLawServe ? true : false" placeholder="请选择开始时间" />
            <span style="margin: 0 10px; font-weight: 5000;">至</span>
            <a-date-picker v-model="enterpriseServeInfo.personLawServeVipEndDate" :disabled="isDisalbeUpatePersonLawServe ? true : false" placeholder="请选择结束时间" />
          </div>
        </div> -->

        <!-- <div class="edit-item">
          <div class="edit-left">实际售卖价：</div>
          <div class="edit-middle">
            <a-input class="input" style="width: 360px;" v-model="enterpriseServeInfo.personLawServeRealPrice" placeholder="不填则是套餐原价" allowClear />
          </div>
        </div> -->

        <!-- <a-divider /> -->

        <!-- 法务管家 -->
        <div class="edit-item">
          <div class="edit-left">法务管家：</div>
          <div class="edit-middle">
            <a-select style="width: 380px;" v-model="enterpriseServeInfo.lawManagerId" placeholder="请选择法律管家" allowClear>
              <a-select-option v-for="lItem in lawManagerSelectList" :value="lItem.value" :key="lItem.value">
                {{ lItem.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!-- 销售 -->
        <div class="edit-item">
          <div class="edit-left">加盟商：</div>
          <a-select style="width: 380px;" v-model="enterpriseServeInfo.leagueId" placeholder="请选择加盟商" @change="onLeagueSelectChangeEvt">
            <a-select-option v-for="(lItem, lIndex) in leagueSelectList" :value="lItem.value" :key="lIndex">
              {{ lItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 销售 -->
        <div class="edit-item">
          <div class="edit-left">销售：</div>
          <a-select style="width: 380px;" v-model="enterpriseServeInfo.leagueSellerId" placeholder="请选择销售">
            <a-select-option v-for="(lItem, lIndex) in leagueSellerSelectList" :value="lItem.value" :key="lIndex">
              {{ lItem.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
        
      <div class="btn-wrap">
        <a-popconfirm title="请确认是否更新企业套餐信息?" @confirm="confirmUpdateEnterpriseServeInfo">
          <a-button type="primary" style="width: 120px;">更新</a-button>
        </a-popconfirm>
      </div>
    </a-card>

    <!-- 关联企业 modal -->
    <a-modal
      v-model="relationEnterpriseModal.isShowRelationEnterpriseModal"
      :title="'添加关联企业'"
      :width="400"
      :afterClose="onRelationEnterpriseModalAfterClose"
      destroyOnClose
      @ok="onRelationEnterpriseModalOkEvt"
    >
      <div class="relation-enterprise-modal">
        <div class="input-item">
          <div class="input-title">企业名称：</div>
          <a-input class="input" v-model="relationEnterpriseModal.enterpriseName" placeholder="请输入企业名称" allowClear />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as lawManagerApi from '@/api/lawManagerApi'
import * as lawServeApi from '@/api/lawServeApi'
import * as sellPlatformApi from '@/api/sellPlatformApi'
import * as clientApi from '@/api/clientApi'
import { mapState } from 'vuex'

// 关联企业 modal 信息
const RELATION_ENTERPRISE_MODAL = { 
  isShowRelationEnterpriseModal: false, // 是否显示关联企业 modal
  enterpriseName: '', // 企业名称
}

export default {
  name: 'ClientCompanyEdit',
  data() {
    return {
      userEnterpriseId: '', // 企业信息 id

      enterpriseServeInfo: {
        enterpriseName: '', // 企业名称
        relationEnterpriseList: [], // 关联企业 list
        
        enterpriseLawServeVipId: '', // 企业套餐类型 id
        enterpriseLawServeVipStartDate: '', // 企业套餐开始时间
        enterpriseLawServeVipEndDate: '', // 企业套餐结束时间
        enterpriseLawServeRealPrice: '', // 企业套餐实际成交价

        personLawServeVipId: '', // 个人套餐类型 id
        personLawServeVipStartDate: '', // 个人套餐开始时间
        personLawServeVipEndDate: '', // 个人套餐结束时间
        personLawServeRealPrice: '', // 个人套餐实际成交价

        lawManagerId: '', // 法务 id
        leagueId: '', // 销售端加盟商 id
        leagueSellerId: '', // 销售端加盟商销售 id
      },

      isDisalbeUpateEnterpriseLawServe: false, // 是否禁止更新企业套餐
      isDisalbeUpatePersonLawServe: false, // 是否禁止更新个人套餐

      enterpriseLawServeVipSelectList: [], // 企业套餐类型 select 列表
      personLawServeVipSelectList: [], // 个人套餐类型 select 列表

      lawManagerSelectList: [], // 法务管家 select 列表
      leagueSelectList: [], // 加盟商 select 列表,
      leagueSellerSelectList: [], // 加盟商 select 列表,

      relationEnterpriseModal: Object.assign({}, RELATION_ENTERPRISE_MODAL), // 关联企业 modal
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    const { userEnterpriseId } = this.$route.query
    // 获取企业套餐信息
    if (userEnterpriseId) {
      this.userEnterpriseId = userEnterpriseId
      this._getEnterpriseLawServeDetail()
    }

    this._getEnterpriseLawServeVipList()
    this._getPersonLawServeVipList()
    this._getLawManagerList()
    this._getSellPlatformLeagueList()
  },
  methods: {
    /**
     * 获取企业套餐详情
     */
     async _getEnterpriseLawServeDetail() {
       if (!this.userEnterpriseId) return
       const param = { user_enterprise_id: this.userEnterpriseId }

       try {
         const { data: enterpriseLawServeData } = await clientApi.getEnterpriseLawServeDetailApi(param)
         this.enterpriseServeInfo.enterpriseName = enterpriseLawServeData.enterprise_name
         enterpriseLawServeData.affiliated_enterprise && (this.enterpriseServeInfo.relationEnterpriseList = enterpriseLawServeData.affiliated_enterprise)
         // 企业套餐
         if (enterpriseLawServeData.enterprise_vip.enterprise_vip_id) {
           this.enterpriseServeInfo.enterpriseLawServeVipId = enterpriseLawServeData.enterprise_vip.enterprise_vip_id
           this.enterpriseServeInfo.enterpriseLawServeVipStartDate = enterpriseLawServeData.enterprise_vip.enterprise_vip_opened_at
           this.enterpriseServeInfo.enterpriseLawServeVipEndDate = enterpriseLawServeData.enterprise_vip.enterprise_vip_expired_at
           this.isDisalbeUpateEnterpriseLawServe = true
         }
         // 个人套餐
         if (enterpriseLawServeData.vip.vip_id) {
           this.enterpriseServeInfo.personLawServeVipId = enterpriseLawServeData.vip.vip_id
           this.enterpriseServeInfo.personLawServeVipStartDate = enterpriseLawServeData.vip.vip_new_time
           this.enterpriseServeInfo.personLawServeVipEndDate = enterpriseLawServeData.vip.vip_expired_time
           this.isDisalbeUpatePersonLawServe = true
         }
         //  加盟商
         if (enterpriseLawServeData.sales_affairs_alliance?.alliance_business_id) {
          this.enterpriseServeInfo.leagueId = enterpriseLawServeData.sales_affairs_alliance.alliance_business_id
          this._getLeagueSellerList(this.enterpriseServeInfo.leagueId)
         }
         //  加盟商销售
         if (enterpriseLawServeData.customer?.customer_user_id) {
          this.enterpriseServeInfo.leagueSellerId = enterpriseLawServeData.customer.customer_user_id
         }
         //  法务管家
         if (enterpriseLawServeData.legal?.legal_user_id) {
          this.enterpriseServeInfo.lawManagerId = enterpriseLawServeData.legal.legal_user_id
         }
         if (enterpriseLawServeData.remarks.enterprise) {
          this.enterpriseServeInfo.enterpriseLawServeRealPrice = enterpriseLawServeData.remarks.enterprise
         }
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取企业服务套餐列表
     */
     async _getEnterpriseLawServeVipList() {
       try {
         const { data: lawServeListData } = await clientApi.getEnterpriseLawServeVipListApi()

         const _tempSelectList = []
         for (const lItem of lawServeListData) {
           const selectOpt = { label: `${ lItem.title } ${ lItem.price }/年`, value: lItem.enterprise_vip_id, }
           _tempSelectList.push(selectOpt)
         }
         this.enterpriseLawServeVipSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },
    
    /**
     * 获取个人服务套餐列表
     */
     async _getPersonLawServeVipList() {
       try {
         const { data: lawServeListData } = await clientApi.getPersonLawServeVipListApi()

         const _tempSelectList = []
         for (const lItem of lawServeListData) {
           const selectOpt = { label: `${ lItem.origin_price }/${ lItem.vip_name }`, value: lItem.vip_id, }
           _tempSelectList.push(selectOpt)
         }
         this.personLawServeVipSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取法务管家列表
     */
     async _getLawManagerList() {
      const param = { page: 1, size: 300, source_type: 4 }
       try {
         const { data: lawManagerListData } = await lawManagerApi.getLawManagerListApi(param)

         const _tempSelectList = []
         for (const lItem of lawManagerListData.data) {
           const selectOpt = { label: lItem.name, value: lItem.user.user_id }
           _tempSelectList.push(selectOpt)
         }
         this.lawManagerSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取加盟商列表
     */
     async _getSellPlatformLeagueList(page = 1) {
       const param = { page, size: 500 }

       try {
         const { data: leagueData } = await sellPlatformApi.getSellPlatformLeagueListApi(param)
         const _leagueSelectList = []
         
         for (const dItem of leagueData.data) {
           const selectOpt = { label: dItem.name, value: dItem.alliance_business_id, }
           _leagueSelectList.push(selectOpt)
         }
         this.leagueSelectList = _leagueSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取加盟商-销售列表
     */
     async _getLeagueSellerList(companyIdValue) {
       const param = { alliance_business_id: companyIdValue, page: 1, size: 300 }
       try {
         const { data: leagueSellerData } = await sellPlatformApi.getSellPlatformLeagueSellerListApi(param)

         const _sellerSelectList = []
         // 销售 select
         for (const sItem of leagueSellerData.data) {
           const sellerOpt = { label: sItem.name, value: sItem.user_id, }
           _sellerSelectList.push(sellerOpt)
         }

         this.leagueSellerSelectList = _sellerSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听加盟商 select 
     */
    onLeagueSelectChangeEvt(value) {
      this.leagueSellerId = '',
      console.log(value)
      if (value) {
        this._getLeagueSellerList(value)
      } else {
        this.leagueSellerSelectList = []
      }
    },

    /**
     * 监听关联企业 modal ok 事件
     */
    onRelationEnterpriseModalOkEvt() {
      const { relationEnterpriseModal } = this
      if (!relationEnterpriseModal.enterpriseName.trim()) return this.$message.warning('请输入企业名称')
      this.relationEnterpriseModal.isShowRelationEnterpriseModal = false
      // 新增关联企业
      this.enterpriseServeInfo.relationEnterpriseList.push(relationEnterpriseModal.enterpriseName.trim())
    },

    /**
     * 监听关联企业 Modal 完全关闭后的回调
     */
    onRelationEnterpriseModalAfterClose() {
      this.relationEnterpriseModal = Object.assign({}, RELATION_ENTERPRISE_MODAL)
    },

    /**
     * 提交企业套餐信息
     */
    async confirmUpdateEnterpriseServeInfo() {
      const { enterpriseServeInfo } = this
      // 验证企业套餐
      if (enterpriseServeInfo.enterpriseLawServeVipId) {
        if (!enterpriseServeInfo.enterpriseLawServeVipStartDate) return this.$message.warning('请选择企业套餐开始时间')
        if (!enterpriseServeInfo.enterpriseLawServeVipEndDate) return this.$message.warning('请选择企业套餐结束时间')
        const dateIsAfter = moment(enterpriseServeInfo.enterpriseLawServeVipEndDate).isAfter(enterpriseServeInfo.enterpriseLawServeVipStartDate)
        if (!dateIsAfter) return this.$message.warning('请选择企业套餐正确的时间段')
      }

      // 验证个人套餐
      if (enterpriseServeInfo.personLawServeVipId) {
        if (!enterpriseServeInfo.personLawServeVipStartDate) return this.$message.warning('请选择个人套餐开始时间')
        if (!enterpriseServeInfo.personLawServeVipEndDate) return this.$message.warning('请选择个人套餐结束时间')
        const dateIsAfter = moment(enterpriseServeInfo.personLawServeVipEndDate).isAfter(enterpriseServeInfo.personLawServeVipStartDate)
        if (!dateIsAfter) return this.$message.warning('请选择个人套餐正确的时间段')
      }

      if (!this.enterpriseServeInfo.lawManagerId) return this.$message.warning('请选择法务')
      if (!this.enterpriseServeInfo.leagueSellerId) return this.$message.warning('请选择销售')
      
      const param = {
        user_enterprise_id: this.userEnterpriseId,
        affiliated_enterprise:  JSON.stringify(this.enterpriseServeInfo.relationEnterpriseList), // 关联企业名称
        legal_user_id: `${ this.enterpriseServeInfo.lawManagerId }`,
        customer_id: this.enterpriseServeInfo.leagueSellerId,
        remarks: `${ this.enterpriseServeInfo.personLawServeRealPrice.trim() },${ this.enterpriseServeInfo.enterpriseLawServeRealPrice.trim() }`
      }

      // 添加企业套餐参数
      if (!this.isDisalbeUpateEnterpriseLawServe && enterpriseServeInfo.enterpriseLawServeVipId) {
        param.enterprise_vip_id = enterpriseServeInfo.enterpriseLawServeVipId
        param.enterprise_vip_opened_at = `${ moment(enterpriseServeInfo.enterpriseLawServeVipStartDate).format('YYYY-MM-DD') } 00:00:00`
        param.enterprise_vip_expired_at = `${ moment(enterpriseServeInfo.enterpriseLawServeVipEndDate).format('YYYY-MM-DD') } 23:59:59`
      }

      // 添加个人套餐参数
      if (!this.isDisalbeUpatePersonLawServe && enterpriseServeInfo.personLawServeVipId) {
        param.vip_id = enterpriseServeInfo.personLawServeVipId
        param.vip_new_time = `${ moment(enterpriseServeInfo.personLawServeVipStartDate).format('YYYY-MM-DD') } 00:00:00`
        param.vip_expired_time = `${ moment(enterpriseServeInfo.personLawServeVipEndDate).format('YYYY-MM-DD') } 23:59:59`
      }

      // 更新操作添加 企业信息id
      // this.userEnterpriseId && (param.enterprise_entry_id = this.userEnterpriseId)

      // console.log(param)
      // return
      try {
        // 更新企业套餐
        const { data } = await clientApi.updatEnterpriseLawServeApi(param)
        this.$router.back()
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .header-module {
    padding: 0 20px;
    .back-wrap {
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
    }
  }
  .content {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    .edit-module {
      .edit-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #333;
        margin-bottom: 20px;
        .edit-left {
          font-size: 14px;
          font-weight: 500;
          width: 100px;
          margin-right: 10px;
        }
        .edit-middle {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        &.relation-item {
          .edit-left {
            margin-left: 12px;
          }
          .edit-middle {
            .enterprise-name {
              font-size: 16px;
              font-weight: 500;
            }
          }
          .remove-btn {
            font-size: 14px;
            font-weight: 500;
            color: #FF4D4F;
            margin-left: 10px;
            cursor: pointer;
          }
        }
        &.otherContact-item {
          .edit-left {
            margin-left: 12px;
          }
          .edit-middle {
            .other-name {
              font-size: 14px;
              font-weight: 500;
              margin-right: 14px;
            }
            .other-mobile {
              font-size: 14px;
              font-weight: 500;
              margin-right: 14px;
            }
            .other-job {
              font-size: 14px;
              font-weight: 500;
            }
          }
          .remove-btn {
            font-size: 14px;
            font-weight: 500;
            color: #FF4D4F;
            margin-left: 10px;
            cursor: pointer;
          }
        }
        // 销售
        &.seller-item {
          align-items: flex-start;
          .edit-middle {
            flex-direction: column;
            align-items: flex-start;
            .seller-radio-wrap {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              margin-bottom: 20px;
              .seller-radio-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-right: 30px;
                cursor: pointer;
                &:last-child { margin-right: 0; }
                .checkbox-img {
                  width: 18px;
                  height: 18px;
                  margin-right: 6px;
                }
              }
            }
          }
        }
      }
    }
    .btn-wrap {
      display: flex;
      justify-content: center;
      margin-top: 50px;
    }
  }
}

.relation-enterprise-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
  }
}

.other-contact-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    &:last-child { margin-bottom: 0; }
    .input-title {
      font-size: 14px;
      font-weight: 500;
      width: 60px;
    }
    .input {
      flex: 1;
    }
  }
}
</style>


