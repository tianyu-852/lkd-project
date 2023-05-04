<template>
  <a-layout class="main">
    <a-layout-header class="header-module">
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
        <span style="margin-left: 6px;">{{ enterpriseLawServeId ? '更新' : '录入' }}企业套餐信息</span>
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
              :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? true : false) : false"
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
          <div class="remove-btn" v-if="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? false : true) : true" @click="enterpriseServeInfo.relationEnterpriseList.splice(rIndex, 1)">删除</div>
          <!-- <div class="remove-btn" @click="enterpriseServeInfo.relationEnterpriseList.splice(rIndex, 1)">删除</div> -->
        </div>

        <!-- 企业行业 -->
        <div class="edit-item">
          <div class="edit-left">行业(选填)：</div>
          <div class="edit-middle">
            <a-input
              class="input"
              style="width: 360px;"
              v-model="enterpriseServeInfo.enterpriseIndustry"
              :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? true : false) : false"
              placeholder="请输入行业"
              allowClear />
          </div>
        </div>

        <!-- 套餐类型 -->
        <div class="edit-item">
          <div class="edit-left">套餐类型：</div>
          <div class="edit-middle">
            <a-select style="width: 200px;" :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? true : false" v-model="enterpriseServeInfo.lawServeVipId" placeholder="请选择套餐类型" allowClear>
              <a-select-option v-for="sItem in lawServeVipSelectList" :value="sItem.value" :key="sItem.value">
                {{ sItem.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!-- 起止时间 -->
        <div class="edit-item">
          <div class="edit-left">起止时间：</div>
          <div class="edit-middle">
            <a-date-picker v-model="enterpriseServeInfo.startDate" :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? true : false) : false" placeholder="请选择开始时间" @change="onStartChangeEvt" />
            <span style="margin: 0 10px; font-weight: 5000;">至</span>
            <a-date-picker v-model="enterpriseServeInfo.endDate" :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? true : false) : false" placeholder="请选择结束时间" @change="onEndChangeEvt" />
          </div>
        </div>
        
        <!-- 使用人姓名 -->
        <div class="edit-item">
          <div class="edit-left">使用人姓名：</div>
          <div class="edit-middle">
            <a-input
              class="input"
              style="width: 360px;"
              v-model="enterpriseServeInfo.userName"
              :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? true : false) : false"
              placeholder="请输入联系人姓名"
              allowClear />
          </div>
        </div>
        
        <!-- 使用人手机号 -->
        <div class="edit-item">
          <div class="edit-left">使用人手机号：</div>
          <div class="edit-middle">
            <a-input
              class="input"
              style="width: 360px;"
              v-model="enterpriseServeInfo.userMobile"
              :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? true : false) : false"
              placeholder="请输入联系人手机号"
              allowClear />
          </div>
          <a-button type="primary" style="margin-left: 20px; padding: 0 6px;" @click="otherContactModal.isShowOtherContactModal = true">添加附属人</a-button>
        </div>

        <!-- 附属人 -->
        <div v-for="(oItem, oIndex) of enterpriseServeInfo.otherContactList" :key="oIndex" class="edit-item otherContact-item">
          <div class="edit-left">附属人{{ oIndex + 1 }}</div>
          <div class="edit-middle">
            <div class="other-name">姓名：{{ oItem.name }}</div>
            <div class="other-mobile">手机号：{{ oItem.mobile }}</div>
            <div class="other-job">职位：{{ oItem.position }}</div>
          </div>
          <div class="remove-btn" v-if="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? false : true) : true" @click="enterpriseServeInfo.otherContactList.splice(oIndex, 1)">删除</div>
        </div>

        <!-- 法务管家 -->
        <div class="edit-item">
          <div class="edit-left">法务管家：</div>
          <div class="edit-middle">
            <a-select style="width: 200px;" :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? true : false) : false" v-model="enterpriseServeInfo.lawManagerId" placeholder="请选择法律管家" allowClear>
              <a-select-option v-for="lItem in lawManagerSelectList" :value="lItem.value" :key="lItem.value">
                {{ lItem.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!-- 销售 -->
        <div class="edit-item seller-item">
          <div class="edit-left">销售：</div>
          <div class="edit-middle">
            <div class="seller-radio-wrap">
              <div v-for="(tItem, tIndex) of sellerTypeRadioList" :key="tIndex" class="seller-radio-item" @click="changeSellerType(tIndex)">
                <img v-if="activeSellerTypeIndex === tIndex" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                <span>{{ tItem.name }}</span>
              </div>
            </div>
            <div class="seller-value-wrap">
              <a-input
                v-if="activeSellerTypeIndex === 0"
                class="input"
                style="width: 300px;"
                v-model="enterpriseServeInfo.sellerName"
                :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? true : false) : false"
                placeholder="请输入销售姓名"
                allowClear
              />
              
              <a-select
                v-else-if="activeSellerTypeIndex === 1"
                style="width: 200px;"
                :disabled="(userInfo.enterprise_auth && enterpriseLawServeId) ? (userInfo.enterprise_auth.edit === 2 ? true : false) : false"
                v-model="enterpriseServeInfo.sellPlatformLeagueId"
                placeholder="请选择加盟商"
                allowClear>
                <a-select-option v-for="lItem in leagueSelectList" :value="lItem.value" :key="lItem.value">
                  {{ lItem.label }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>

        <div class="btn-wrap">
          <a-popconfirm v-if="(userInfo.enterprise_auth && enterpriseLawServeId)" title="请确认是否更新企业套餐信息?" @confirm="submitEnterpriseServeInfo">
            <a-button type="primary" style="width: 120px;">更新</a-button>
          </a-popconfirm>
          <a-popconfirm v-else title="请确认是否保存企业套餐信息?" @confirm="submitEnterpriseServeInfo">
            <a-button type="primary" style="width: 120px;">提交</a-button>
          </a-popconfirm>
        </div>
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

    <!-- 附属人 modal -->
    <a-modal
      v-model="otherContactModal.isShowOtherContactModal"
      :title="'添加附属人'"
      :width="400"
      :afterClose="onOtherContactModalAfterClose"
      destroyOnClose
      @ok="onOtherContactModalOkEvt"
    >
      <div class="other-contact-modal">
        <div class="input-item">
          <div class="input-title">姓名：</div>
          <a-input class="input" v-model="otherContactModal.otherContactName" placeholder="请输入姓名" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">手机号：</div>
          <a-input class="input" v-model="otherContactModal.otherContactMobile" placeholder="请输入手机号" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">职位：</div>
          <a-input class="input" v-model="otherContactModal.otherContactJob" placeholder="请输入职位" allowClear />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import moment from 'moment'
import * as lawServeApi from '@/api/lawServeApi'
import * as sellPlatformApi from '@/api/sellPlatformApi'
import { mapState } from 'vuex'

// 关联企业 modal 信息
const RELATION_ENTERPRISE_MODAL = { 
  isShowRelationEnterpriseModal: false, // 是否显示关联企业 modal
  enterpriseName: '', // 企业名称
}

// 附属人 modal 信息
const OTHER_CONTACT_MODAL = {
  isShowOtherContactModal: false, // 是否显示附属人  modal
  otherContactName: '', // 附属人姓名
  otherContactMobile: '', // 附属人手机号
  otherContactJob: '', // 附属人职位
}

export default {
  name: 'EnterpriseServeEdit',
  data() {
    return {
      enterpriseLawServeId: '', // 企业套餐信息 id

      enterpriseServeInfo: {
        enterpriseName: '', // 企业名称
        relationEnterpriseList: [], // 关联企业 list
        enterpriseIndustry: '', // 企业行业
        userName: '', // 使用人姓名
        userMobile: '', // 使用人手机号
        lawServeVipId: '', // 法律套餐类型 id
        lawManagerId: '', // 法务管家
        startDate: '', // 套餐开始时间
        endDate: '', // 套餐结束时间
        otherContactList: [], // 附属人 list
        sellerName: '', // 销售姓名
        sellPlatformLeagueId: '', // 销售端加盟商 id
      },

      lawServeVipSelectList: [], // 套餐类型 select 列表
      lawManagerSelectList: [], // 法务管家 select 列表
      leagueSelectList: [], // 加盟商 select 列表,

      relationEnterpriseModal: Object.assign({}, RELATION_ENTERPRISE_MODAL), // 关联企业 modal
      otherContactModal: Object.assign({}, OTHER_CONTACT_MODAL), // 附属人 modal

      sellerTypeRadioList: [ { name: '内部销售' }, { name: '加盟商销售' }, ], // 销售类型单选列表
      activeSellerTypeIndex: 0, // 选中的销售类型下标
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    const { enterpriseLawServeId } = this.$route.query
    // 获取企业套餐信息
    if (enterpriseLawServeId) {
      this.enterpriseLawServeId = enterpriseLawServeId
      this._getEnterpriseLawServeDetail()
    }

    this._getLawServeVipList()
    this._getLawManagerList()
    this._getSellPlatformLeagueList()
  },
  methods: {
    /**
     * 获取企业套餐详情
     */
     async _getEnterpriseLawServeDetail() {
       if (!this.enterpriseLawServeId) return
       const param = { enterprise_entry_id: this.enterpriseLawServeId }

       try {
         const { data: enterpriseLawServeData } = await lawServeApi.getEnterpriseLawServeDetailApi(param)
         this.enterpriseServeInfo.enterpriseName = enterpriseLawServeData.enterprise_name
         this.enterpriseServeInfo.enterpriseIndustry = enterpriseLawServeData.industry
         this.enterpriseServeInfo.relationEnterpriseList = enterpriseLawServeData.associated_enterprises
         this.enterpriseServeInfo.userName = enterpriseLawServeData.name
         this.enterpriseServeInfo.userMobile = enterpriseLawServeData.mobile
         this.enterpriseServeInfo.lawServeVipId = enterpriseLawServeData.enterprise_vip.enterprise_vip_id
         this.enterpriseServeInfo.lawManagerId = enterpriseLawServeData.legal_affairs.legal_affairs_id
         this.enterpriseServeInfo.startDate = moment(enterpriseLawServeData.start_time, 'YYYY-MM-DD HH:mm')
         this.enterpriseServeInfo.endDate = moment(enterpriseLawServeData.end_time, 'YYYY-MM-DD HH:mm')
         this.enterpriseServeInfo.otherContactList = enterpriseLawServeData.enterprise_affiliated
         // 内部销售姓名
         if (enterpriseLawServeData.sales_name) {
          this.enterpriseServeInfo.sellerName = enterpriseLawServeData.sales_name
         }
         // 加盟商
         if (enterpriseLawServeData.alliance_business.alliance_business) {
          this.enterpriseServeInfo.sellPlatformLeagueId = enterpriseLawServeData.alliance_business.alliance_business
          this.activeSellerTypeIndex = 1
         }
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取企业服务套餐列表
     */
     async _getLawServeVipList() {
       try {
         const { data: lawServeListData } = await lawServeApi.getLawServeVipListApi()

         const _tempSelectList = []
         for (const lItem of lawServeListData) {
           const selectOpt = { label: `${ lItem.title } ${ lItem.price }/年`, value: lItem.enterprise_vip_id, }
           _tempSelectList.push(selectOpt)
         }
         this.lawServeVipSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取法务管家列表
     */
     async _getLawManagerList() {
       try {
         const { data: lawManagerListData } = await lawServeApi.getLawManagerListApi()

         const _tempSelectList = []
         for (const lItem of lawManagerListData) {
           const selectOpt = { label: lItem.name, value: lItem.enterprise_entry_legal_id }
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
     * 监听开始时间 change 事件
     */
    onStartChangeEvt(date, dateStr) {
      // 结束时间为空则执行
      if (!this.enterpriseServeInfo.endDate) {
        const endDateStr = moment(dateStr).add(1, 'years').format('YYYY-MM-DD')
        this.enterpriseServeInfo.endDate = endDateStr
      }
    },
    /**
     * 监听结束时间 change 事件
     */
    onEndChangeEvt(date, dateStr) {},

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
     * 监听附属人 modal ok 事件
     */
    onOtherContactModalOkEvt() {
      const { otherContactModal } = this
      if (!otherContactModal.otherContactName.trim()) return this.$message.warning('请输入姓名')
      if (!otherContactModal.otherContactMobile.trim()) return this.$message.warning('请输入手机号')
      if (otherContactModal.otherContactMobile.trim().length !== 11) return this.$message.warning('请输入正确的手机号')
      if (!otherContactModal.otherContactJob.trim()) return this.$message.warning('请输入职位')

      this.otherContactModal.isShowOtherContactModal = false
      //添加附属人
      this.enterpriseServeInfo.otherContactList.push({
        name: otherContactModal.otherContactName.trim(),
        mobile: otherContactModal.otherContactMobile.trim(),
        position: otherContactModal.otherContactJob.trim(),
      })
    },

    /**
     * 监听附属人 Modal 完全关闭后的回调
     */
    onOtherContactModalAfterClose() {
      this.otherContactModal = Object.assign({}, OTHER_CONTACT_MODAL)
    },

    /**
     * 切换销售类型下标
     */
    changeSellerType(typeIndex) {
      if (this.enterpriseLawServeId && this.userInfo.enterprise_auth.edit === 2) return

      this.activeSellerTypeIndex = typeIndex
      this.enterpriseServeInfo.sellerName = ''
      this.enterpriseServeInfo.sellPlatformLeagueId = ''
    },

    /**
     * 提交企业信息
     */
    submitEnterpriseServeInfo() {
      const { enterpriseServeInfo } = this
      if (!enterpriseServeInfo.enterpriseName.trim()) return this.$message.warning('请输入企业名称')
      if (!enterpriseServeInfo.lawServeVipId) return this.$message.warning('请选择套餐类型')
      if (!enterpriseServeInfo.startDate) return this.$message.warning('请选择开始时间')
      if (!enterpriseServeInfo.endDate) return this.$message.warning('请选择结束时间')
      const dateIsAfter = moment(enterpriseServeInfo.endDate).isAfter(enterpriseServeInfo.startDate)
      if (!dateIsAfter) return this.$message.warning('请选择正确的时间段')

      if (!enterpriseServeInfo.userName.trim()) return this.$message.warning('请输入使用人姓名')
      if (!enterpriseServeInfo.userMobile.trim()) return this.$message.warning('请输入使用人手机号')
      if (!enterpriseServeInfo.lawManagerId) return this.$message.warning('请选择法务管家')

      if (this.activeSellerTypeIndex === 0) {
        if (!enterpriseServeInfo.sellerName.trim()) return this.$message.warning('请输入销售名字')
      } else {
        if (!enterpriseServeInfo.sellPlatformLeagueId) return this.$message.warning('请选择加盟商')
      }
      // enterpriseLawServeId ? this._upEnterpriseServeInfo() : this._createEnterpriseServeInfo()
      this._editEnterpriseServeInfo()
    },

    /**
     * 编辑提交企业套餐信息
     */
    async _editEnterpriseServeInfo() {
      // 套餐开始时间
      const startTime = `${ moment(this.enterpriseServeInfo.startDate).format('YYYY-MM-DD') } 00:00:00`
      // 套餐结束时间
      const endTime = `${ moment(this.enterpriseServeInfo.endDate).format('YYYY-MM-DD') } 23:59:59`
      
      const param = {
        enterprise_name: this.enterpriseServeInfo.enterpriseName.trim(), // 企业名称
        associated_enterprises: JSON.stringify(this.enterpriseServeInfo.relationEnterpriseList), // 关联企业名称
        industry: this.enterpriseServeInfo.enterpriseIndustry.trim(), // 行业
        enterprise_vip_id: this.enterpriseServeInfo.lawServeVipId, // 法律套餐类型 id
        start_time: startTime, // 套餐开始时间
        end_time: endTime, // 套餐结束时间
        name: this.enterpriseServeInfo.userName.trim(), // 使用人姓名
        mobile: this.enterpriseServeInfo.userMobile.trim(), // 使用人手机号
        legal_affairs_id: this.enterpriseServeInfo.lawManagerId, // 法务管家 id
        enterprise_affiliated: JSON.stringify(this.enterpriseServeInfo.otherContactList), // 附属人
      }

      // 更新操作添加 企业信息id
      this.enterpriseLawServeId && (param.enterprise_entry_id = this.enterpriseLawServeId)

      // 内部销售
      this.activeSellerTypeIndex === 0 && (param.sales_name = this.enterpriseServeInfo.sellerName.trim())
      // 加盟商销售
      this.activeSellerTypeIndex === 1 && (param.alliance_business_id = this.enterpriseServeInfo.sellPlatformLeagueId)

      try {
        if (this.enterpriseLawServeId) {
          // 更新企业套餐
          const { data } = await lawServeApi.updatEnterpriseLawServeApi(param)
        } else {
          // 添加企业套餐
          const { data } = await lawServeApi.addEnterpriseLawServeApi(param)
        }
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
      .btn-wrap {
        display: flex;
        justify-content: center;
        margin-top: 50px;
      }
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


