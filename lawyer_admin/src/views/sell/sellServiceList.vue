<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">销售人数：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="openAddSellModal">添加销售</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getSellServiceList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="sellDataList"
        :loading="sellDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.customer_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="customer_id" title="ID" align="center" />

        <!-- 创建时间 -->
        <a-table-column dataIndex="created_at" title="创建时间" align="center" />

        <!-- 姓名 -->
        <a-table-column dataIndex="name" title="姓名" align="center" />

        <!-- 手机号 -->
        <a-table-column dataIndex="mobile" title="手机号" align="center" />

        <!-- 二维码 -->
        <a-table-column title="二维码" align="center">
          <template slot-scope="record">
            <div v-if="record.qrcode" class="qrcode-image" v-viewer>
              <img class="qrcode-img" :src="record.qrcode">
            </div>
            <div v-else>无</div>
          </template>
        </a-table-column>

        <!-- 上月提成 -->
        <a-table-column dataIndex="last_month" title="上月提成" align="center" />

        <!-- 当月提成 -->
        <a-table-column dataIndex="month" title="当月提成" align="center" />

        <!-- 总客户数 -->
        <a-table-column dataIndex="count" title="总客户数" align="center" />

        <!-- 后台账号 -->
        <a-table-column dataIndex="admin_account" title="后台账号" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutSellModal(record)">更新</a-button>
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToSellClientList(record)">客户详情</a-button>
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openTransferModal(record)">转移客户</a-button>
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="navToSellCommissionDetail(record)">提成详情</a-button>
            <a-popconfirm title="请确认是否删除该销售?" ok-text="删除" cancel-text="取消" @confirm="delSellService(record)">
              <a-button type="link" style="padding: 0;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 添加销售 modal -->
    <a-modal v-model="isShowSellServiceModal" :width="500" @ok="onSellServiceModalOkEvt" @cancel="onSellServiceModalCancelEvt">
      <div class="add-sell-modal">
        <div class="modal-title">
          <span>{{ sellServiceModalType === 1 ? '更新销售' : '添加销售' }}</span>
        </div>
        <div class="input-wrap">
          <div class="input-item">
            <div class="input-title">姓名：</div>
            <a-input
              v-model="sellServiceModalInfo.name"
              :maxLength="5"
              placeholder="请输入姓名"
              allowClear
            />
          </div>
          <div class="input-item">
            <div class="input-title">手机号码：</div>
            <a-input
              v-model="sellServiceModalInfo.mobile"
              :maxLength="11"
              :disabled="sellServiceModalType === 1"
              placeholder="请输入手机号码"
              allowClear
            />
          </div>
          <div class="input-item">
            <div class="input-title">企业微信二维码：</div>

            <div class="upload-box" v-viewer>
              <img v-if="sellServiceModalInfo.qrcode" class="upload-img" :src="sellServiceModalInfo.qrcode" />
              <div v-else class="null-wrap" @click="chooseImage">
                <a-icon type="plus" style="fontSize: 26px" />
              </div>
            </div>

            <a-button v-if="sellServiceModalInfo.qrcode" class="change-btn" type="primary" @click="chooseImage">更换一张图片</a-button>
          </div>

          <div class="input-item">
            <div class="input-title">后台账号：</div>
            <a-select style="width: 120px;" v-model="sellServiceModalInfo.admin_id" :loading="sellHouTaiAccountSelectLoading">
              <a-select-option v-for="sItem in sellHouTaiAccountSelectList" :value="sItem.value" :key="sItem.value" :disabled="sItem.disabled">
                {{ sItem.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 转移客户 modal -->
    <a-modal
      v-model="isShowTransferModal"
      :title="'转移「' + transferModalInfo.fromSellName + '」的全部客户'"
      :width="500"
      :afterClose="onTransferModalAfterClose"
      destroyOnClose
      @ok="onTransferModalOkEvt"
    >
      <div class="transfer-modal">
        <div class="transfer-title">指定销售人员</div>
        <a-select style="width: 100%" placeholder="请选择销售人员" @change="onTransferModalChangeEvt">
          <a-select-option v-for="sItem in transferSellSelectList" :value="sItem.value" :key="sItem.value">
            {{ sItem.label }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>

    <canvas id="qrcodeCanvas"></canvas>
    <!-- 上传文件 input -->
    <input
      v-if="isShowFileInput"
      id="input"
      ref="fileInputRef"
      type="file"
      style="display: none;"
      accept="image/*"
      @change="onChangeInputFile"
    >
  </a-layout>
</template>

<script>
import QrCodeWithLogo from 'qr-code-with-logo'
import qrcodeLogo from '@/assets/sell/qrcode-logo.png'
import fileUtil from '@/utils/fileUtil'
import { getSellListApi, postAddSellServiceApi, putSellServiceApi, delSellServiceApi, getSellHouTaiAccountListApi, transferAllClientToAssignSellApi } from '@/api/sellApi'

// 销售人员信息
const sellServiceInfoObj = {
  name: '', // 销售姓名
  mobile: '', // 销售手机号码
  qrcode: '', // 企业微信二维码
  admin_id: 0, // 后台账号 id
}

// 转移销售人员信息
const SELL_TRANSFER_INFO = { fromSellName: '', fromSellId: 0, toSellId: 0 }

export default {
  name: 'SellServiceList',
  data() {
    return {
      sellDataList: [], // 销售数据列表
      sellDataLoading: true, // 销售数据是否加载中
      isShowFileInput: true, // 是否显示文件input
      
      sellHouTaiAccountSelectList: [], // 销售后台账号列表
      sellHouTaiAccountSelectLoading: false, // 是否正在加载中账号后台列表

      qrcodeLogo, // 二维码 logo
      
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getSellServiceList(page)
          this.pagination.current = page
        },
      },
      
      isShowSellServiceModal: false, // 是否打开添加销售 Modal
      sellServiceModalType: 0, // 销售 Modal 类型 0: 添加 1: 更新
      sellServiceModalInfo: Object.assign({}, sellServiceInfoObj), // 销售人员信息
      putSellServiceId: 0, // 待更新销售人员 id

      isShowTransferModal: false, // 是否打开转移 Modal
      transferModalInfo: Object.assign({}, SELL_TRANSFER_INFO), // 转移客户 modal 信息
      transferSellSelectList: [], // 转移销售 select 列表

      winQrcode: window.qrcode // 解析二维码库
    }
  },
  created() {
    this._getSellServiceList()
  },
  methods: {
    /**
     * 获取销售人员列表
     */
     async _getSellServiceList(page = 1) {
       this.sellDataLoading = true
       try {
         const { data: sellListData } = await getSellListApi(page)
         this.pagination.total = sellListData.total
         this.sellDataList = sellListData.data
         this.pagination.current = page

         this.sellDataLoading = false
       } catch (error) {
         this.sellDataLoading = false
         console.log(error)
       }
    },

    /**
     * 获取可选的销售后台账号列表
     */
     async _getSellHouTaiAccountList() {
       this.sellHouTaiAccountSelectList = []
       this.sellHouTaiAccountSelectLoading = true
       try {
         const { data: sellHouTaiAccountData } = await getSellHouTaiAccountListApi()
         const tempSelectList = []
         
         // 销售后台账号列表
         for (const dItem of sellHouTaiAccountData.data) {
           const selectOpt = {
            label: dItem.account,
            value: dItem.admin_id,
           }
           tempSelectList.push(selectOpt)
         }

         this.sellHouTaiAccountSelectList = [ ...[ { label: '无', value: 0 } ], ...tempSelectList ]
         this.sellHouTaiAccountSelectLoading = false
       } catch (error) {
         this.sellHouTaiAccountSelectLoading = false
         console.log(error)
       }
    },
    
    /**
     * 打开「添加模式」销售人员 modal
     */
    openAddSellModal() {
      this.sellServiceModalType = 0 // 添加模式
      this.sellServiceModalInfo = Object.assign({}, sellServiceInfoObj)
      this.isShowSellServiceModal = true

      this._getSellHouTaiAccountList()
    },

    /**
     * 打开「更新模式」销售人员 modal
     */
    async openPutSellModal(record) {
      this.sellServiceModalType = 1 // 更新模式
      this.sellServiceModalInfo.name = record.name
      this.sellServiceModalInfo.mobile = record.mobile
      this.sellServiceModalInfo.qrcode = record.qrcode
      record.admin_id ? (this.sellServiceModalInfo.admin_id = record.admin_id) : (this.sellServiceModalInfo.admin_id = 0)

      // 待更新销售 id
      this.putSellServiceId = record.customer_id
      this.isShowSellServiceModal = true
      await this._getSellHouTaiAccountList()

      if (record.admin_id) {
        const selectOpt = { label: record.admin_account, value: record.admin_id, disabled: true }
        // 插入到第二个
        this.sellHouTaiAccountSelectList.splice(1, 0, selectOpt)
      }
    },

    /**
     * 监听销售 modal cancel 事件
     */
    onSellServiceModalCancelEvt() {
      // console.log('关闭')
    },

    /**
     * 监听销售 modal ok 事件
     */
    onSellServiceModalOkEvt() {
      const { sellServiceModalInfo, sellServiceModalType } = this
      if (!sellServiceModalInfo.name.trim()) return this.$message.warning('请输入姓名')
      if (!sellServiceModalInfo.mobile.trim()) return this.$message.warning('请输入手机号码')
      if (sellServiceModalInfo.mobile.trim().length !== 11) return this.$message.warning('请输入正确的手机号码')
      // if (!sellServiceModalInfo.qrcode) return this.$message.warning('请选择二维码图片')
      // if (!sellServiceModalInfo.admin_id) return this.$message.warning('请绑定后台账号')

      this.isShowSellServiceModal = false
      // sellServiceModalType === 1 ? 更新销售 : 添加销售
      sellServiceModalType === 1 ? this._putSellService(sellServiceModalInfo) : this._addSellService(sellServiceModalInfo)
    },

    /**
     * 添加销售
     */
     async _addSellService(sellServiceInfo) {
       
      try {
        const { data } = await postAddSellServiceApi(sellServiceInfo)
        this._getSellServiceList()
        // 重置待销售人员信息
        this.sellServiceModalInfo = Object.assign({}, sellServiceInfoObj)
        // 重置后台账号列表
        this.sellHouTaiAccountSelectList = [ { label: '无', value: 0 } ]
        this.$notification.success({ message: '添加成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 进入销售客户列表详情
     */
    navToSellClientList(record) {
      const sellUserId = String(record.customer_id)
      this.$router.push({ name: 'sellClientList', query: { sellUserId, layoutType: 1 } })
    },

    /**
     * 进入销售提成详情
     */
    navToSellCommissionDetail(record) {
      const sellUserId = String(record.customer_id)
      this.$router.push({ name: 'sellCommissionDetail', query: { sellUserId } })
    },

    /**
     * 更新销售
     */
    async _putSellService(sellServiceInfo) {
      const { putSellServiceId } = this
      if (!putSellServiceId) return
      
      try {
        const { data } = await putSellServiceApi(putSellServiceId, sellServiceInfo)
        this._getSellServiceList(this.pagination.current)
        // 重置待销售人员信息
        this.sellServiceModalInfo = Object.assign({}, sellServiceInfoObj)
        this.putSellServiceId = 0
        // 重置后台账号列表
        this.sellHouTaiAccountSelectList = [ { label: '无', value: 0 } ]
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开转移客户 modal
     */
    openTransferModal(record) {
      this.transferModalInfo.fromSellId = record.customer_id
      this.transferModalInfo.fromSellName = record.name
      this.isShowTransferModal = true
      
      this._getTransferSellList()
    },

    /**
     * 监听转移客户 modal change事件 
     */
    onTransferModalChangeEvt(value) {
      this.transferModalInfo.toSellId = value
    },
    
    /**
     * 转移客户
     */
    async onTransferModalOkEvt() {
      const { transferModalInfo } = this
      if (!transferModalInfo.fromSellId) return this.$message.warning('待转移销售为空')
      if (!transferModalInfo.toSellId) return this.$message.warning('请指定销售人员')

      console.log(transferModalInfo)
      this._transferAllClientToAssignSell(transferModalInfo.fromSellId, transferModalInfo.toSellId)
      this.isShowTransferModal = false
    },

    /**
     * 转移客户 Modal 完全关闭后的回调
     */
    onTransferModalAfterClose() {
      // 重置转移销售人员信息
      this.transferModalInfo = Object.assign({}, SELL_TRANSFER_INFO)
    },

    /**
     * 转移所有客户到指定销售
     * @param {Number} fromSellId 待转移销售
     * @param {Number} toSellId 指定转移销售
     */
    async _transferAllClientToAssignSell(fromSellId, toSellId) {
      const param = { customer_id: fromSellId, move_customer_id: toSellId }
      
      try {
        const { data: transferData } = await transferAllClientToAssignSellApi(param)
        this.$notification.success({ message: '转移成功', duration: 3 })
        // 更新当页数据
         this._getSellServiceList(this.pagination.current)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取转移销售人员列表
     */
     async _getTransferSellList() {
       const page = 1
       const size = 50
       try {
         const { data: sellListData } = await getSellListApi(page, size)
         const tempTransferSelectList = []
         
         // 处理销售列表
         for (const dItem of sellListData.data) {
           const selectOpt = { label: dItem.name, value: dItem.customer_id, }
           tempTransferSelectList.push(selectOpt)
         }

         const findSellIndex = tempTransferSelectList.findIndex(item => item.value === this.transferModalInfo.fromSellId)
         // 移除待转移的销售人员  
         findSellIndex > -1 && tempTransferSelectList.splice(findSellIndex, 1)
         this.transferSellSelectList = tempTransferSelectList
       } catch (error) {
         console.log(error)
       }
    },
    
    /**
     * 删除销售
     */
    async delSellService(sellServiceRecord) {
      const { customer_id } = sellServiceRecord
      if (!customer_id) return

      try {
        const { data } = await delSellServiceApi(customer_id)
        // 更新当页数据
        this._getSellServiceList(this.pagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择图片
     * https://juejin.cn/post/6844903697667850248
     */
    chooseImage() {
      this.isShowFileInput = true
      this.$nextTick(() => {
        // this.$refs.fileInputRef.click() 
        this.$refs.fileInputRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    onChangeInputFile(event) {
      const file = event.target.files[0]
      this.isShowFileInput = false
      this._parseAndGenerateQrcodeImg(file)
    },

    /**
     * 解析 & 生成新二维码图片
     */
    _parseAndGenerateQrcodeImg(file) {
      let fileTempPath = null
      /**
       * createObjectURL 获取当前文件的一个内存URL => blobURL
       * createObjectURL返回一段带hash的url，并且一直存储在内存中，直到document触发了unload事件（例如：document close）或者执行 revokeObjectURL 来释放。
       */
      if (window.createObjectURL != undefined) { // basic
        fileTempPath = window.createObjectURL(file)
      } else if (window.URL != undefined) { // mozilla(firefox)
        fileTempPath = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) { // webkit or chrome
        fileTempPath = window.webkitURL.createObjectURL(file)
      }
      if (!fileTempPath) return this.$message.warning('获取图片失败')

      // 解析二维码
      this.winQrcode.decode(fileTempPath)
      this.winQrcode.callback = imgMsg => {
        // console.log('二维码解析：', imgMsg)
        if (imgMsg === 'error decoding QR Code') return this.$message.warning('请上传清晰的二维码图片')
        // 生成二维码
        this._generateQrcode(imgMsg)
      }
    },

    /**
     * 生成二维码
     */
    async _generateQrcode(canvasContent) {
      if (!canvasContent) return
      const qrcodeCanvasNode = document.getElementById('qrcodeCanvas') // canvas 节点
      
      try {
        // 将内容绘制到 canvas
        await QrCodeWithLogo.toCanvas({
          canvas: qrcodeCanvasNode,
          content: canvasContent,
          width: 380,
          nodeQrCodeOptions: { margin: 0.5, errorCorrectionLevel: 'H' },
          logo: {
            src: qrcodeLogo,
            logoSize: 0.26,
            borderSize: 0,
          }
        })

        // canvas 内容转换成 Blob 对象
        const qrcodeCanvasBlob = await (() => (new Promise((resolve, reject) => {
          qrcodeCanvasNode.toBlob(blob => {
            if (!blob) return reject(null)
            resolve(blob)
          })
        })))()

        // 上传文件 oss
        const imageUrl = await fileUtil.uploadFile(qrcodeCanvasBlob)
        this.sellServiceModalInfo.qrcode = ''
        setTimeout(() => (this.sellServiceModalInfo.qrcode = imageUrl), 0)
      } catch (error) {
        this.$message.error('二维码图片生成失败')
        console.log(error)
      }
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
  .qrcode-image {
    cursor: pointer;
    .qrcode-img {
      width: 100px;
      height: 100px;
    }
  }
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
}

.add-sell-modal {
  .modal-title {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 48px;
    font-size: 18px;
    font-weight: bold;
    background: #ebeef5;
  }
  .input-wrap {
    padding: 30px;
    .input-item {
      margin-bottom: 14px;
      &:last-child { margin-bottom: 0; }
      .input-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 6px;
      }
      .upload-box {
        width: 128px;
        height: 128px;
        cursor: pointer;
        .null-wrap {
          display: flex;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          height: 100%;
          background: #F5F5F5;
          border: dashed 1px #666;
        }
        .upload-img {
          width: 100%;
          height: 100%;
        }
      }
      .change-btn {
        margin-top: 10px;
      }
    }
  }
}

.transfer-modal {
  padding: 20px;
  .transfer-title {
    margin-bottom: 10px;
  }
}

/deep/.ant-modal-body {
  padding: 0;
}

#qrcodeCanvas {
  position: fixed;
  top: 9999px;
  left: 9999px;
}
</style>
