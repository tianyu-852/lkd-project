<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">案源法务总数：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="openAddLawManagerModal">新增案源法务</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getLawManagerList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="record => String(record.legal_affairs_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="legal_affairs_id" title="ID" align="center" />

        <!-- 创建时间 -->
        <a-table-column dataIndex="created_at" title="创建时间" align="center" />

        <!-- 姓名 -->
        <a-table-column dataIndex="name" title="姓名" align="center" />

        <!-- 手机号码 -->
        <a-table-column dataIndex="user.mobile" title="手机号码" align="center" />

        <!-- 二维码 -->
        <a-table-column title="二维码" align="center">
          <template slot-scope="record">
            <div v-if="record.qrcode" class="qrcode-image" v-viewer>
              <img class="qrcode-img" :src="record.qrcode">
            </div>
            <div v-else>无</div>
          </template>
        </a-table-column>

        <!-- 法务类型 -->
        <a-table-column dataIndex="staff_type_cn" title="法务类型" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <!-- <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutLawManagerModal(record)">更新</a-button> -->
            <a-popconfirm title="请确认是否删除该法务?" ok-text="删除" cancel-text="取消" @confirm="delLawManager(record)">
              <a-button type="link" style="padding: 0; margin-right: 10px;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 法务 modal -->
    <a-modal
      v-model="lawManagerModalInfo.isShowLawManagerModal"
      :title="lawManagerModalInfo.lawManagerModalType ? '更新法务' : '新增法务'"
      :width="500"
      :afterClose="onLawManagerModalAfterClose"
      destroyOnClose
      @ok="onLawManagerModalOkEvt"
    >
      <div class="lawManager-modal">
        <div class="input-item">
          <div class="input-title">姓名：</div>
          <a-input class="input" v-model="lawManagerModalInfo.name" :maxLength="-1" placeholder="请输入姓名" allowClear />
        </div>

        <div class="input-item">
          <div class="input-title">手机号：</div>
          <a-input class="input" v-model="lawManagerModalInfo.mobile" :maxLength="11" placeholder="请输入手机号码" allowClear />
        </div>

        <!-- 目标对象 -->
        <div class="input-item">
          <div class="input-title">类型：</div>
          <a-select style="width: 140px;" v-model="lawManagerModalInfo.source_type">
            <a-select-option v-for="(rItem, rIndex) in lawManagerSelectList" :value="rItem.value" :key="rIndex">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 二维码 -->
        <div class="input-item">
          <div class="input-title" style="align-self: flex-start;">二维码：</div>
          <div class="upload-box" v-viewer>
            <a-icon v-if="lawManagerModalInfo.qrcode" class="icon-close" type="close-square" @click.stop="removeQrcodeImage" />
            <img v-if="lawManagerModalInfo.qrcode" class="upload-img" :src="lawManagerModalInfo.qrcode" />
            <div v-else class="null-wrap" @click="chooseImage">
              <a-icon type="plus" style="fontSize: 26px" />
            </div>
          </div>
        </div>
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
import * as lawManagerApi from '@/api/lawManagerApi'
import QrCodeWithLogo from 'qr-code-with-logo'
import qrcodeLogo from '@/assets/sell/qrcode-logo.png'
import fileUtil from '@/utils/fileUtil'

// 法务管家信息
const LAWMANAGER_INFO = {
  name: '',
  mobile: '',
  source_type: 3, // 法务类型
  qrcode: '', // 二维码
  isShowLawManagerModal: false, // 是否显示法务管家 modal
  lawManagerModalType: 0, // 法务 Modal 类型 0: 添加 1: 更新
  putLawManagerId: '', // 更新法务 id
}

export default {
  name: 'CaseManagerPage',
  filters: {
    /**
     * 生成文件本地路径
     * createObjectURL 获取当前文件的一个内存URL => blobURL
     * createObjectURL返回一段带hash的url，并且一直存储在内存中，直到document触发了unload事件（例如：document close）或者执行 revokeObjectURL 来释放。
     */
    fileTempPathFilter(file) {
      let fileTempPath = null
      if (window.createObjectURL != undefined) { // basic
        fileTempPath = window.createObjectURL(file)
      } else if (window.URL != undefined) { // mozilla(firefox)
        fileTempPath = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) { // webkit or chrome
        fileTempPath = window.webkitURL.createObjectURL(file)
      }
      if (!fileTempPath) return ''
      
      return fileTempPath
    },
  },
  data() {
    return {
      tabelDataList: [], // 标签列表
      tabelDataLoading: true, // 数据是否加载中

      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getSellPlatformUserList(page)
          this.pagination.current = page
        },
      },

      lawManagerModalInfo: Object.assign({}, LAWMANAGER_INFO), // 法务管家 modal 信息
      // lawManagerSelectList: [{ label: '客服端', value: 4 }, { label: '销售端', value: 5 }, { label: '律师管家', value: 0 } ], // 法务管家 select
      lawManagerSelectList: [{ label: '案源法务', value: 3 } ], // 法务管家 select

      qrcodeLogo, // 二维码 logo
      winQrcode: window.qrcode, // 解析二维码库
      isShowFileInput: true, // 是否显示文件input
    }
  },
  created() {
    this._getLawManagerList()
  },
  methods: {
    /**
     * 获取法律列表
     */
     async _getLawManagerList(page = 1) {
       const param = { page, size: this.pagination.pageSize, source_type: 3, staff_type: 7 }
       this.tabelDataLoading = true

       try {
         const { data: advertPositionData } = await lawManagerApi.getLawManagerListApi(param)
         this.tabelDataList = advertPositionData.data
         this.pagination.total = advertPositionData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
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
        this.lawManagerModalInfo.qrcode = ''
        setTimeout(() => (this.lawManagerModalInfo.qrcode = imageUrl), 0)
      } catch (error) {
        this.$message.error('二维码图片生成失败')
        console.log(error)
      }
    },

    /**
     * 移除 modal 二维码图片
     */
    removeQrcodeImage() {
      this.lawManagerModalInfo.qrcode = ''
    },

    /**
     * 打开「添加模式」法务 modal
     */
    openAddLawManagerModal() {
      this.lawManagerModalInfo.lawManagerModalType = 0 // 添加模式
      this.lawManagerModalInfo = Object.assign({}, LAWMANAGER_INFO)
      this.lawManagerModalInfo.isShowLawManagerModal = true
    },

    /**
     * 打开「更新模式」法务 modal
     */
    openPutLawManagerModal(record) {
      this.lawManagerModalInfo.lawManagerModalType = 1 // 更新模式
      this.lawManagerModalInfo.name = record.name
      this.lawManagerModalInfo.mobile = record.mobile
      // this.lawManagerModalInfo.putLawManagerId = record.financial_legal_sales_relation_id // 待更新用户 id
      this.lawManagerModalInfo.isShowLawManagerModal = true
    },

    /**
     * 法务 Modal 完全关闭后的回调
     */
    onLawManagerModalAfterClose() {
      this.lawManagerModalInfo = Object.assign({}, LAWMANAGER_INFO)
    },

    /**
     * 监听法务 modal ok 事件
     */
    onLawManagerModalOkEvt() {
      const { lawManagerModalInfo } = this
      const lawManagerModalType = lawManagerModalInfo.lawManagerModalType
      if (!lawManagerModalInfo.name.trim()) return this.$message.warning('请输入姓名')
      if (!lawManagerModalInfo.mobile.trim()) return this.$message.warning('请输入手机号码')
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(lawManagerModalInfo.mobile.trim()))) return this.$message.warning('请输入正确的手机号')
      
      this.lawManagerModalInfo.isShowLawManagerModal = false
      // lawManagerModalType === 1 ? 更新 : 添加
      lawManagerModalType === 1 ? this._putLawManager(lawManagerModalInfo) : this._addLawManager(lawManagerModalInfo)
    },

    /**
     * 添加法务
     */
     async _addLawManager(lawManagerModalInfo) {
       const param = {
         name: lawManagerModalInfo.name.trim(),
         mobile: lawManagerModalInfo.mobile.trim(),
         source_type: lawManagerModalInfo.source_type,
         qrcode: lawManagerModalInfo.qrcode,
         staff_type: 7
       }

       try {
         const { data } = await lawManagerApi.postAddLawManagerApi(param)
         this._getLawManagerList()
         this.$notification.success({ message: '添加成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }
     },


    /**
     * 更新法务
     */
    async _putLawManager(lawManagerModalInfo) {
      const param = {
        legal_affairs_id: lawManagerModalInfo.putLawManagerId,
        name: lawManagerModalInfo.name.trim(),
        mobile: lawManagerModalInfo.mobile.trim(),
        source_type: lawManagerModalInfo.source_type,
        qrcode: lawManagerModalInfo.qrcode,
        staff_type: 7
      }

      try {
        const { data } = await lawManagerApi.putSellPlatformUserApi(param)
        this._getSellPlatformUserList(this.pagination.current)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 删除法务
     */
    async delLawManager(advertRecord) {
      const { legal_affairs_id } = advertRecord
      if (!legal_affairs_id) return

      try {
        const { data } = await lawManagerApi.delLawManagerApi({ legal_affairs_id })
        // 更新当页数据
        this._getLawManagerList(this.pagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
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
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
  .qrcode-image {
    cursor: pointer;
    .qrcode-img {
      width: 120px;
      height: 120px;
    }
  }
}

.lawManager-modal {
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
    .upload-box {
      position: relative;
      width: 120px;
      height: 120px;
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
      .icon-close {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        cursor: pointer;
      }
    }
  }
}

#qrcodeCanvas {
  position: fixed;
  top: 9999px;
  left: 9999px;
}
</style>
