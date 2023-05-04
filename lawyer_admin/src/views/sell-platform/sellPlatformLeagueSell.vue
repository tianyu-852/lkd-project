<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div v-if="!userInfo.alliance" class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
      </div>
      <span class="focus-text">加盟商销售总数：{{ pagination.total }}</span>

      <a-button type="primary" style="background: #2cbf78; border-color: #2cbf78; margin-left: auto;" @click="openImportSellerModal">批量导入</a-button>
      <a-button type="primary" style="margin-left: 30px;" @click="openAddSellerModal">新增销售</a-button>
    </a-layout-header>

    <a-layout-header class="data-statistics">
      <span class="company-name">{{ leagueDetail.alliance_name }}</span>
      <span class="data-num" style="margin-left: 100px">销售数量：{{ leagueDetail.sales_num || 0 }}</span>
      <span class="data-num" style="margin-left: 100px">总成交数：{{ leagueDetail.total_order_num || 0 }}</span>
      <span class="data-num" style="margin-left: 100px">总成交金额：{{ leagueDetail.total_order_money || 0 }}</span>
      <span class="data-num" style="margin-left: 100px">总提成：{{ leagueDetail.total_order_commission || 0 }}</span>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getSellPlatformLeagueSellerList(pagination.current); _getSellPlatformLeagueDetail();">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tableDataList"
        :loading="tableDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.sales_affairs_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="sales_affairs_id" title="ID" align="center" />

        <!-- 创建时间 -->
        <a-table-column key="created_at" dataIndex="created_at" title="创建时间" align="center" />

        <!-- 加盟公司名称 -->
        <a-table-column dataIndex="alliance_business_name" title="加盟公司名称" align="center" />

        <!-- 销售姓名 -->
        <a-table-column dataIndex="name" title="销售姓名" align="center" />

        <!-- 性别 -->
        <a-table-column dataIndex="sex_text" title="性别" align="center" />

        <!-- 手机号码 -->
        <a-table-column dataIndex="mobile" title="手机号码" align="center" />

        <!-- 招商经理二维码 -->
        <a-table-column title="小程序分享码" align="center">
          <template slot-scope="record">
            <div v-if="record.bai_xing_qrcode" class="column-qrcode" v-viewer>
              <img class="qrcode-img" :src="record.bai_xing_qrcode">
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
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-popconfirm v-if="!record.bai_xing_qrcode" title="请确认是否生成小程序码?" ok-text="确定" cancel-text="取消" @confirm="setSellPlatformLeagueSellerMinipcode(record)">
              <a-button type="link" style="padding: 0; margin-right: 10px;">小程序码</a-button>
            </a-popconfirm>
            
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutSellerModal(record)">更新</a-button>
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToSellOpenOrderPage(record)">开单详情</a-button>
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToSellVipSharePage(record)">套餐分享</a-button>
            <a-popconfirm title="请确认是否删除该销售?" ok-text="删除" cancel-text="取消" @confirm="delSellPlatformLeagueSeller(record)">
              <a-button type="link" style="padding: 0; margin-right: 10px;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 批量导入 modal -->
    <a-modal
      v-model="importSellerModalInfo.isShowImportModal"
      title="批量导入销售"
      :width="500"
      :afterClose="onImportSellerModalAfterClose"
      destroyOnClose
      @ok="onImportSellerModalOkEvt"
    >
      <div class="import-modal">
        <div class="input-item" style="margin-bottom: 50px;">
          <div class="input-title" style="align-self: flex-start;">下载模板：</div>
          <div class="input-right">
            <a-button type="primary" style="height: 26px;" @click="downloadExcelTmpFile">下载模板</a-button>
            <div class="tip-title">请按照数据模板的格式准备要导入的数据</div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-title">上传文件：</div>
          <a-button type="primary" style="height: 26px;" @click="chooseExcelFile">上传</a-button>
          <div class="file-title">{{ importSellerModalInfo.excelFile && importSellerModalInfo.excelFile.name }}</div>
        </div>
      </div>
    </a-modal>

    <!-- 销售 modal -->
    <a-modal
      v-model="sellerModalInfo.isShowSellerModal"
      :title="sellerModalInfo.sellerModalType ? '编辑销售' : '新增销售'"
      :width="500"
      :afterClose="onSellerModalAfterClose"
      destroyOnClose
      @ok="onSellerModalOkEvt"
    >
      <div class="seller-modal">
        <div class="input-item">
          <div class="input-title">公司名称：</div>
          <a-select style="width: 240px;" v-model="sellerModalInfo.companyId" :disabled="sellerModalInfo.sellerModalType ? true : false">
            <a-select-option v-for="lItem in leagueSelectList" :value="lItem.value" :key="lItem.value">
              {{ lItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="input-item">
          <div class="input-title">销售姓名：</div>
          <a-input class="input" v-model="sellerModalInfo.name" :maxLength="20" placeholder="请输入姓名" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">电话号码：</div>
          <a-input
            class="input"
            v-model="sellerModalInfo.mobile"
            :maxLength="20"
            :disabled="sellerModalInfo.sellerModalType ? true : false"
            placeholder="请输入电话号码"
            allowClear
          />
        </div>
        <div class="input-item">
          <div class="input-title">性别：</div>
          <a-radio-group name="radioGroup" v-model="sellerModalInfo.sex" :default-value="sellerModalInfo.sex">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </div>
      </div>
    </a-modal>

    <!-- 上传 Excel 文件 input -->
    <input
      v-if="isShowExcelFileInput"
      id="input"
      ref="excelFileInputRef"
      type="file"
      style="display: none;"
      accept=".xlsx,.xls"
      @change="onChangeInputExcelFile"
    >
  </a-layout>
</template>

<script>
import * as sellPlatformApi from '@/api/sellPlatformApi'
import fileUtil from '@/utils/fileUtil'
import { mapState } from 'vuex'

// 销售人员信息
const SELLER_INFO = {
  companyId: '', // 公司 id
  name: '',
  mobile: '',
  sex: 1,
  isShowSellerModal: false, // 是否显示销售 modal
  sellerModalType: 0, // 销售 Modal 类型 0: 添加 1: 更新
  putSellPlatformSellerId: '', // 更新销售 id
}

// 批量导入销售信息
const IMPORT_INFO = {
  excelFile: null, // excel 文件
  excelFileUrl: '', // excel 文件 url
  isShowImportModal: false, // 是否显示导入 modal
}

export default {
  name: 'SellPlatformLeagueSell',
  inject: ['reloadPage'],
  data() {
    return {
      routeLeagueId: 0, // 加盟商 id
      leagueDetail: {}, // 加盟商详情

      tableDataList: [], // table 列表
      tableDataLoading: true, // 数据是否加载中

      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getSellPlatformLeagueSellerList(page)
          this.pagination.current = page
        },
      },
      
      sellerModalInfo: Object.assign({}, SELLER_INFO), // 销售 modal 信息
      leagueSelectList: [], // 加盟商 select 列表,

      isShowExcelFileInput: true, // 是否显示文件 input
      importSellerModalInfo: Object.assign({}, IMPORT_INFO), // 批量导入销售 modal 信息
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    const { leagueId: routeLeagueId } = this.$route.params

    // 判断是加盟商账号 只能看自己的信息
    if (this.userInfo.alliance) {
      const userLeagueId = this.userInfo.alliance.info.alliance_business_id
      if (Number(routeLeagueId) !== Number(userLeagueId)) {
        console.log(userLeagueId)
        this.$router.replace({ name: 'sellPlatformLeagueSell', params: { leagueId: Number(userLeagueId) } })
        this.reloadPage()
        return
      }
    }

    routeLeagueId && (this.routeLeagueId = routeLeagueId)
    
    this._getSellPlatformLeagueList()
    this._getSellPlatformLeagueDetail()
    this._getSellPlatformLeagueSellerList()
  },
  methods: {
    /**
     * 获取加盟商列表
     */
     async _getSellPlatformLeagueList(page = 1) {
       const param = { page, size: 300 }

       try {
         const { data: leagueData } = await sellPlatformApi.getSellPlatformLeagueListApi(param)
         let _leagueSelectList = []
         
         // 处理销售列表
         for (const dItem of leagueData.data) {
           const selectOpt = { label: dItem.name, value: dItem.alliance_business_id, }
           _leagueSelectList.push(selectOpt)
         }

         // 判断是加盟商账号 过滤出自己公司 select
         if (this.userInfo.alliance) {
           const userLeagueId = this.userInfo.alliance.info.alliance_business_id
           _leagueSelectList = _leagueSelectList.filter(item => item.value === userLeagueId)
         }

         this.leagueSelectList = _leagueSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取加盟商详情
     */
     async _getSellPlatformLeagueDetail() {
       if (!this.routeLeagueId) return
       const param = { alliance_business_id: this.routeLeagueId }

       try {
         const { data: leagueDetailData } = await sellPlatformApi.getSellPlatformLeagueDetailApi(param)
         this.leagueDetail = leagueDetailData
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取加盟商-销售列表
     */
     async _getSellPlatformLeagueSellerList(page = 1) {
       if (!this.routeLeagueId) return this.$message.warning('获取数据失败')

       const param = { alliance_business_id: this.routeLeagueId, page, size: this.pagination.pageSize }
       this.tableDataLoading = true

       try {
         const { data: leagueSellerData } = await sellPlatformApi.getSellPlatformLeagueSellerListApi(param)
         this.tableDataList = leagueSellerData.data
         this.pagination.total = leagueSellerData.total
         this.pagination.current = page
         this.tableDataLoading = false
       } catch (error) {
         this.tableDataLoading = false
         console.log(error)
       }
    },

    /**
     * 打开「添加模式」销售 modal
     */
    openAddSellerModal() {
      this.sellerModalInfo.sellerModalType = 0 // 添加模式
      this.sellerModalInfo = Object.assign({}, SELLER_INFO)

      // 判断是加盟商账号 默认选中自己公司
      if (this.userInfo.alliance) {
        const userLeagueId = this.userInfo.alliance.info.alliance_business_id
        this.sellerModalInfo.companyId = userLeagueId
      }
      
      this.sellerModalInfo.isShowSellerModal = true
    },

    /**
     * 打开「更新模式」销售 modal
     */
    openPutSellerModal(record) {
      this.sellerModalInfo.sellerModalType = 1 // 更新模式
      this.sellerModalInfo.companyId = record.alliance_business_id
      this.sellerModalInfo.name = record.name
      this.sellerModalInfo.mobile = record.mobile
      this.sellerModalInfo.sex = record.sex
      this.sellerModalInfo.putSellPlatformSellerId = record.sales_affairs_id // 待更新销售 id
      this.sellerModalInfo.isShowSellerModal = true
    },

    /**
     * 销售 Modal 完全关闭后的回调
     */
    onSellerModalAfterClose() {
      this.labelModalInfo = Object.assign({}, SELLER_INFO)
    },

    /**
     * 监听销售 modal ok 事件
     */
    onSellerModalOkEvt() {
      const { sellerModalInfo } = this
      const sellerModalType = sellerModalInfo.sellerModalType
      if (!sellerModalInfo.companyId) return this.$message.warning('请选择公司')
      if (!sellerModalInfo.name.trim()) return this.$message.warning('请输入销售名称')
      if (!sellerModalInfo.mobile.trim()) return this.$message.warning('请输入手机号码')
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(sellerModalInfo.mobile.trim()))) return this.$message.warning('请输入正确的手机号')

      this.sellerModalInfo.isShowSellerModal = false
      // sellerModalType === 1 ? 更新 : 添加
      sellerModalType === 1 ? this._putLeagueSeller(sellerModalInfo) : this._addLeagueSeller(sellerModalInfo)
    },

    /**
     * 添加加盟商-销售
     */
     async _addLeagueSeller(sellerModalInfo) {
       const param = {
         alliance_business_id: sellerModalInfo.companyId,
         name: sellerModalInfo.name.trim(),
         mobile: sellerModalInfo.mobile.trim(),
         sex: sellerModalInfo.sex,
       }
       
       try {
         const { data } = await sellPlatformApi.postAddSellPlatformLeagueSellerApi(param)

         this._getSellPlatformLeagueSellerList()
         this.$notification.success({ message: '添加成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 更新加盟商-销售
     */
    async _putLeagueSeller(sellerModalInfo) {
      const param = {
        sales_affairs_id: sellerModalInfo.putSellPlatformSellerId,
        name: sellerModalInfo.name.trim(),
        sex: sellerModalInfo.sex
      }
      
      try {
        const { data } = await sellPlatformApi.putSellPlatformLeagueSellerApi(param)
        this._getSellPlatformLeagueSellerList(this.pagination.current)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 设置加盟商-销售小程序码
     */
    async setSellPlatformLeagueSellerMinipcode(sellUserRecord) {
      const { sales_affairs_id } = sellUserRecord
      if (!sales_affairs_id) return

      try {
        const { data } = await sellPlatformApi.setSellPlatformLeagueSellerMinipcode({ sales_affairs_id })
        // // 更新当页数据
        this._getSellPlatformLeagueSellerList(this.pagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 删除加盟商-销售
     */
    async delSellPlatformLeagueSeller(sellUserRecord) {
      const { sales_affairs_id } = sellUserRecord
      if (!sales_affairs_id) return

      try {
        const { data } = await sellPlatformApi.delSellPlatformLeagueSellerApi({ sales_affairs_id })
        // 更新当页数据
        this._getSellPlatformLeagueSellerList(this.pagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 进入销售开单列表
     */
    navToSellOpenOrderPage(record) {
      const sellUserId = String(record.user_id)
      this.$router.push({ name: 'sellPlatformOpenOrder', params: { sellUserId } })
    },

    /**
     * 进入销售套餐分享列表
     */
    navToSellVipSharePage(record) {
      const sellUserId = String(record.user_id)
      this.$router.push({ name: 'sellPlatformVipShare', params: { sellUserId } })
    },

    /**
     * 打开导入销售 modal
     */
    openImportSellerModal() {
      this.importSellerModalInfo = Object.assign({}, IMPORT_INFO)
      this.importSellerModalInfo.isShowImportModal = true
    },

    /**
     * 选择 excel 文件
     * https://juejin.cn/post/6844903697667850248
     */
    chooseExcelFile() {
      this.isShowExcelFileInput = true
      this.$nextTick(() => {
        this.$refs.excelFileInputRef.click() 
        // this.$refs.excelFileInputRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    async onChangeInputExcelFile(event) {
      const file = event.target.files[0]
      this.isShowExcelFileInput = false

      const fileUrl = await fileUtil.uploadFile(file)
      this.importSellerModalInfo.excelFile = file
      this.importSellerModalInfo.excelFileUrl = fileUrl
    },

    /**
     * 批量导入 Modal 完全关闭后的回调
     */
    onImportSellerModalAfterClose() {
      this.importSellerModalInfo = Object.assign({}, IMPORT_INFO)
    },

    /**
     * 监听批量导入 modal ok 事件
     */
    async onImportSellerModalOkEvt() {
      const { importSellerModalInfo } = this
      if (!importSellerModalInfo.excelFileUrl) return this.$message.warning('请上传销售表格文件')

      const param = {
        url: importSellerModalInfo.excelFileUrl
      }

      try {
        const { data } = await sellPlatformApi.uploadImportSellPlatformLeagueSellerApi(param)
        this.importSellerModalInfo.isShowImportModal = false
        // 更新当页数据
        this._getSellPlatformLeagueSellerList(this.pagination.current)
        this.$notification.success({ message: '导入成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 下载批量导入 excel 模板 文件
     */
    downloadExcelTmpFile() {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2022-07-13/e33077b7972e108d5f67eae20fc584e8.xlsx'
      link.setAttribute('download', '模板')
      document.body.appendChild(link)
      link.click()
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 90px;
    .back {
      margin-right: 16px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
      .icon-back {
        cursor: pointer;
      }
    }
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }
}

.data-statistics {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  .company-name {
    font-size: 16px;
    font-weight: 600;
  }
  .data-num {
    font-size: 14px;
    font-weight: 600;
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

.import-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .file-title {
      color: #999;
      font-size: 12px;
      margin-left: 10px;
    }
    .input-right {
      .tip-title {
        color: #999;
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }
}

.seller-modal {
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
