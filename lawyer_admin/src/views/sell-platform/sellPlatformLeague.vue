<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">加盟商总数：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="openAddLeagueModal">新增加盟商</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getSellPlatformLeagueList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.alliance_business_id)"
        :scroll="{ x: 2000 }"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="alliance_business_id" title="ID" align="center" />

        <!-- 创建时间 -->
        <a-table-column dataIndex="created_at" title="创建时间" align="center" />

        <!-- 加盟公司 -->
        <a-table-column dataIndex="name" title="加盟公司" align="center" />

        <!-- 联系人 -->
        <a-table-column dataIndex="relation_name" title="联系人" align="center" />

        <!-- 手机号码 -->
        <a-table-column dataIndex="relation_phone" title="手机号码(后台账号)" align="center" />

        <!-- 加盟商身份 -->
        <a-table-column dataIndex="alliance_identity.alliance_identity_name" title="加盟商身份" align="center" />

        <!-- 地区 -->
        <a-table-column title="地区" align="center">
          <template slot-scope="record">
            <div class="column-qrcode">{{ record.province_name }}/{{ record.city_name }}</div>
          </template>
        </a-table-column>

        <!-- 销售人数 -->
        <a-table-column dataIndex="sales_num" title="销售人数" align="center" />

        <!-- 招商经理 -->
        <a-table-column dataIndex="china_merchants.name" title="招商经理" align="center" />

        <!-- 招商经理二维码 -->
        <a-table-column title="招商经理二维码" align="center">
          <template slot-scope="record">
            <div v-if="record.china_merchants.qrcode" class="column-qrcode" v-viewer>
              <img class="qrcode-img" :src="record.china_merchants.qrcode">
            </div>
            <div v-else>无</div>
          </template>
        </a-table-column>

        <!-- 合同成交数 -->
        <a-table-column dataIndex="order_num" title="合同成交数" align="center" />

        <!-- 成单总金额 -->
        <a-table-column dataIndex="order_money" title="成单总金额" align="center" />

        <!-- 提成 -->
        <a-table-column dataIndex="order_commission" title="提成" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="190px">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutLeagueModal(record)">更新</a-button>
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToLeagueSellerPage(record)">销售列表</a-button>
            <a-popconfirm title="请确认是否删除该加盟商?" ok-text="删除" cancel-text="取消" @confirm="delSellPlatformLeague(record)">
              <a-button type="link" style="padding: 0; margin-right: 10px;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 加盟商 modal -->
    <a-modal
      v-model="leagueModalInfo.isShowLeagueModal"
      :title="leagueModalInfo.leagueModalType ? '更新加盟商' : '新增加盟商'"
      :width="500"
      :afterClose="onLeagueModalAfterClose"
      destroyOnClose
      @ok="onLeagueModalOkEvt"
    >
      <div class="league-modal">
        <div class="input-item">
          <div class="input-title">加盟公司：</div>
          <a-input class="input" v-model="leagueModalInfo.companyName" :maxLength="30" placeholder="请输入加盟商公司名称" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">联系人：</div>
          <a-input class="input" v-model="leagueModalInfo.contactName" :maxLength="4" placeholder="请输入联系人姓名" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">手机号码：</div>
          <a-input
            class="input"
            v-model="leagueModalInfo.contactMobile"
            :disabled="leagueModalInfo.leagueModalType ? true : false"
            :maxLength="11"
            placeholder="请输入电话号码"
            allowClear />
        </div>

        <div class="input-item">
          <div class="input-title">身份选择：</div>
          <a-select style="width: 100%;" v-model="leagueModalInfo.identityId">
            <a-select-option v-for="lItem in identitySelectList" :value="lItem.value" :key="lItem.value">
              {{ lItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <div class="input-item">
          <div class="input-title">后台账号：</div>
          <a-input class="input" v-model="leagueModalInfo.contactMobile" disabled />
        </div>

        <div v-if="!leagueModalInfo.leagueModalType" class="input-item">
          <div class="input-title">后台密码：</div>
          <a-input class="input" v-model="leagueModalInfo.houtaiPassword" :maxLength="10" disabled />
        </div>

        <div class="input-item">
          <div class="input-title">加盟地区：</div>
          <a-cascader :defaultValue="[ leagueModalInfo.province_id, leagueModalInfo.city_id ]" :options="regionOptionList" placeholder="请选加盟地区" @change="onRegionCascaderChangeEvt" />
        </div>

        <div class="input-item">
          <div class="input-title">招商经理：</div>
          <a-select style="width: 100%;" v-model="leagueModalInfo.china_merchants_user_id">
            <a-select-option v-for="lItem in businessSelectList" :defaultValue="leagueModalInfo.china_merchants_user_id" :value="lItem.value" :key="lItem.value">
              {{ lItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <div class="input-item">
          <div class="input-title" style="align-self: flex-start;">合同权限：</div>
          <a-select style="flex: 1;" v-model="leagueModalInfo.contractTmpSelectedIdList" mode="multiple" placeholder="请选择合同模板">
            <a-select-option v-for="(sItem, sIndex) in contractTmpSelectList" :value="sItem.value" :key="sIndex">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as sellPlatformApi from '@/api/sellPlatformApi'
import * as causeSourceApi from '@/api/causeSourceApi'

// 加盟商信息
const LEAGUE_INFO = {
  companyName: '', // 公司名称
  contactName: '', // 联系人姓名
  contactMobile: '', // 联系人手机号
  identityId: '', // 身份 id
  houtaiPassword: '', // 后台密码
  china_merchants_user_id: '', // 招商经理 id
  province_id: '', // 省份 id
  city_id: '', // 城市 id
  // RegionOptionList: [], // 律师地区 option 列表

  isShowLeagueModal: false, // 是否显示加盟 modal
  leagueModalType: 0, // 加盟 Modal 类型 0: 添加 1: 更新
  disabledMobileInput: false, // 是否禁用 手机号 input
  putSellPlatformLeagueId: '', // 更新加盟商 id

  contractTmpSelectedIdList: [], // 已选的模板 id 列表
}

export default {
  name: 'SellPlatformLeague',
  data() {
    return {
      tableDataList: [], // table 列表
      tableDataLoading: true, // 数据是否加载中

      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getSellPlatformLeagueList(page)
          this.pagination.current = page
        },
      },
      
      leagueModalInfo: Object.assign({}, LEAGUE_INFO), // 加盟 modal 信息

      contractTmpSelectList: [], // 合同模板 select 列表
      businessSelectList: [], // 招商经理 select 列表
      regionOptionList: [], // 律师地区 option 列表

      identitySelectList: [], // 身份 select 列表
    }
  },
  watch: {
    'leagueModalInfo.contactMobile'(newVal) {
      // 更新后台密码
      if (newVal.length === 11) {
        this.leagueModalInfo.houtaiPassword = `lkd${ this.leagueModalInfo.contactMobile.slice(-4) }`
      } else {
        this.leagueModalInfo.houtaiPassword = ''
      }
    }
  },
  created() {
    this._getSellPlatformLeagueList()
    this._getSellPlatformBusinessList()
    this._getSellPlatformLeagueIdentityList()
    this._getContractTmpList()
    this._getRegionList()
  },
  methods: {
    /**
     * 获取加盟商列表
     */
     async _getSellPlatformLeagueList(page = 1) {
       const param = { page, size: this.pagination.pageSize }
       this.tableDataLoading = true

       try {
         const { data: leagueData } = await sellPlatformApi.getSellPlatformLeagueListApi(param)
         this.tableDataList = leagueData.data
         this.pagination.total = leagueData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 获取合同模板列表
     */
     async _getContractTmpList(page = 1) {
       const param = { page, size: 300 }

       try {
         const { data: labelListData } = await sellPlatformApi.getSellPlatformContractTmpListApi(param)

         const tempSelectList = []
         // 销售主管账号列表
         for (const dItem of labelListData.data) {
           const selectOpt = { label: dItem.name, value: dItem.sales_contract_template_id, }
           tempSelectList.push(selectOpt)
         }

         this.contractTmpSelectList = tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取加盟商身份列表
     */
     async _getSellPlatformLeagueIdentityList() {
       try {
         const { data: identityData } = await sellPlatformApi.getSellPlatformLeagueIdentityListApi()

         const _tempSelectList = []
         // 销售主管账号列表
         for (const dItem of identityData) {
           const selectOpt = { label: dItem.name, value: dItem.alliance_identity_id, }
           _tempSelectList.push(selectOpt)
         }

         this.identitySelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取招商经理列表
     */
     async _getSellPlatformBusinessList(page = 1) {
       const param = { page, size: 300 }

       try {
         const { data: businessData } = await sellPlatformApi.getSellPlatformBusinessListApi(param)

         const tempSelectList = []
         // 销售主管账号列表
         for (const dItem of businessData.data) {
           const selectOpt = { label: dItem.name, value: dItem.china_merchants_user_id, }
           tempSelectList.push(selectOpt)
         }

         this.businessSelectList = tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取地区列表
     */
    async _getRegionList() {
      try {
        const { data: regionData } = await causeSourceApi.getLawyerRegionListApi()
        const regionCommonCityList = regionData.cities

        var _regioinOptionList = []
        for (let i = 0; i < regionCommonCityList.length; i++) {
          _regioinOptionList.push({ label: regionCommonCityList[i].name, value: regionCommonCityList[i].district_id, children: [] })
          for (let j = 0; j < regionCommonCityList[i].cities.length; j++) {
            _regioinOptionList[i].children.push({ label: regionCommonCityList[i].cities[j].name, value: regionCommonCityList[i].cities[j].district_id })
          }
        }

        this.regionOptionList = _regioinOptionList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听加盟地区选择 事件
     */
    onRegionCascaderChangeEvt(value, selectedOptions) {
      this.leagueModalInfo.province_id = value[0]
      this.leagueModalInfo.city_id = value[1]
    },

    /**
     * 打开「添加模式」加盟商 modal
     */
    openAddLeagueModal() {
      this.leagueModalInfo.leagueModalType = 0 // 添加模式
      this.leagueModalInfo = Object.assign({}, LEAGUE_INFO)
      // 默认选中 5 模板
      this.leagueModalInfo.contractTmpSelectedIdList = this.contractTmpSelectList.map(itm => itm.value)
      
      this.leagueModalInfo.isShowLeagueModal = true
    },

    /**
     * 打开「更新模式」加盟商 modal
     */
    async openPutLeagueModal(record) {
      this.leagueModalInfo.leagueModalType = 1 // 更新模式
      this.leagueModalInfo.companyName = record.name
      this.leagueModalInfo.contactName = record.relation_name
      this.leagueModalInfo.contactMobile = record.relation_phone
      this.leagueModalInfo.identityId = record.alliance_identity.alliance_identity_id
      this.leagueModalInfo.china_merchants_user_id = record.china_merchants.china_merchants_user_id
      this.leagueModalInfo.province_id = record.province_id
      this.leagueModalInfo.city_id = record.city_id

      this.leagueModalInfo.putSellPlatformLeagueId = record.alliance_business_id // 待更新用户 id
      this.leagueModalInfo.contractTmpSelectedIdList = record.default_template.map(item => item.sales_contract_template_id)
      this.leagueModalInfo.isShowLeagueModal = true
    },

    /**
     * 加盟商 Modal 完全关闭后的回调
     */
    onLeagueModalAfterClose() {
      this.leagueModalInfo = Object.assign({}, LEAGUE_INFO)
    },

    /**
     * 监听加盟商 modal ok 事件
     */
    onLeagueModalOkEvt() {
      const { leagueModalInfo } = this
      const leagueModalType = leagueModalInfo.leagueModalType
      if (!leagueModalInfo.companyName.trim()) return this.$message.warning('请输入公司名称')
      if (!leagueModalInfo.contactName.trim()) return this.$message.warning('请输入姓名')
      if (!leagueModalInfo.contactMobile.trim()) return this.$message.warning('请输入手机号码')
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(leagueModalInfo.contactMobile.trim()))) return this.$message.warning('请输入正确的手机号')
      if (!leagueModalInfo.identityId) return this.$message.warning('请选择加盟商身份')
      if (leagueModalInfo.houtaiPassword.length < 7) return this.$message.warning('无后台登录密码')
      if (!leagueModalInfo.province_id && !leagueModalInfo.city_id) return this.$message.warning('请选择加盟地区')
      if (!leagueModalInfo.china_merchants_user_id) return this.$message.warning('请选择招商经理')
      if (!leagueModalInfo.contractTmpSelectedIdList.length) return this.$message.warning('请选择合同权限')
      
      this.leagueModalInfo.isShowLeagueModal = false
      // console.log(leagueModalInfo)
      // leagueModalType === 1 ? 更新 : 添加
      leagueModalType === 1 ? this._putLeague(leagueModalInfo) : this._addLeague(leagueModalInfo)
    },

    /**
     * 添加加盟商
     */
     async _addLeague(leagueModalInfo) {
       console.log(leagueModalInfo)

       const param = {
         name: leagueModalInfo.companyName.trim(),
         relation_name: leagueModalInfo.contactName.trim(),
         relation_phone: leagueModalInfo.contactMobile.trim(),
         password: leagueModalInfo.houtaiPassword.trim(),
         china_merchants_user_id: leagueModalInfo.china_merchants_user_id,
         alliance_identity_id: leagueModalInfo.identityId,
         province_id: leagueModalInfo.province_id,
         city_id: leagueModalInfo.city_id,
         default_template: JSON.stringify(leagueModalInfo.contractTmpSelectedIdList)
       }
       
      try {
        const { data } = await sellPlatformApi.postAddSellPlatformLeagueApi(param)
        this._getSellPlatformLeagueList()
        this.$notification.success({ message: '添加成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 更新加盟商
     */
    async _putLeague(leagueModalInfo) {
      const param = {
        alliance_business_id: leagueModalInfo.putSellPlatformLeagueId,
        name: leagueModalInfo.companyName.trim(),
        relation_name: leagueModalInfo.contactName.trim(),
        china_merchants_user_id: leagueModalInfo.china_merchants_user_id,
        alliance_identity_id: leagueModalInfo.identityId,
        province_id: leagueModalInfo.province_id,
        city_id: leagueModalInfo.city_id,
        default_template: JSON.stringify(leagueModalInfo.contractTmpSelectedIdList),
      }

      try {
        const { data } = await sellPlatformApi.putSellPlatformLeagueApi(param)
        this._getSellPlatformLeagueList(this.pagination.current)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 删除加盟商
     */
    async delSellPlatformLeague(leagueRecord) {
      const { alliance_business_id } = leagueRecord
      if (!alliance_business_id) return

      try {
        const { data } = await sellPlatformApi.delSellPlatformLeagueApi({ alliance_business_id })
        // 更新当页数据
        this._getSellPlatformLeagueList(this.pagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 进入加盟商销售列表
     */
    navToLeagueSellerPage(record) {
      const leagueId = String(record.alliance_business_id)
      this.$router.push({ name: 'sellPlatformLeagueSell', params: { leagueId } })
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
  .column-qrcode {
    cursor: pointer;
    .qrcode-img {
      width: 100px;
      height: 100px;
    }
  }
}

.league-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .input-title {
      font-size: 14px;
      font-weight: 500;
      min-width: 74px;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
