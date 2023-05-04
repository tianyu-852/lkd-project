<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">广告总数：{{ pagination.total }}</span>

      <a-button type="primary" style="margin: 0 10px" @click="openAddAdvertModal">新增广告</a-button>
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getAdvertList(pagination.current)">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="record => String(record.advertisement_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="advertisement_id" title="ID" align="center" />

        <!-- Banner -->
        <a-table-column title="Banner" align="center">
          <template slot-scope="record">
            <div v-if="record.banner_url" class="qrcode-image" v-viewer>
              <img class="qrcode-img" :src="record.banner_url">
            </div>
            <div v-else>无</div>
          </template>
        </a-table-column>

        <!-- 跳转类型 -->
        <a-table-column dataIndex="jump_type" title="跳转类型" align="center" />

        <!-- 用户类型 -->
        <a-table-column dataIndex="show_type" title="用户类型" align="center" />

        <!-- 展示类型 -->
        <a-table-column dataIndex="user_type" title="展示类型" align="center" />

        <!-- 广告状态-->
        <a-table-column dataIndex="status" title="广告状态" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutLabelModal(record)">更新</a-button>
            <a-popconfirm title="请确认是否删除该广告?" ok-text="删除" cancel-text="取消" @confirm="delAdvert(record)">
              <a-button type="link" style="padding: 0; margin-right: 10px;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 角色 modal -->
    <a-modal
      v-model="advertModalInfo.isShowAdvertModal"
      :title="advertModalInfo.advertModalType ? '更新广告' : '新增广告'"
      :width="500"
      :afterClose="onRoleModalAfterClose"
      destroyOnClose
      @ok="onRoleModalOkEvt"
    >
      <div class="advert-modal">
        <div class="input-item">
          <div class="input-title">跳转方式：</div>
          <a-radio-group name="radioGroup" v-model="advertModalInfo.type">
            <a-radio :value="0">APP内跳转</a-radio>
            <a-radio :value="1">H5网页跳转</a-radio>
          </a-radio-group>
        </div>

        <div class="input-item">
          <div class="input-title">展示类型：</div>
          <a-select style="width: 150px;" v-model="advertModalInfo.show_type">
            <a-select-option v-for="(rItem, rIndex) in advertShowTypeSelectList" :value="rItem.value" :key="rIndex">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <div class="input-item">
          <div class="input-title">跳转路由：</div>
          <a-select style="width: 150px;" v-model="advertModalInfo.jump_type">
            <a-select-option v-for="(rItem, rIndex) in advertRouteSelectList" :value="rItem.value" :key="rIndex">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <div class="input-item">
          <div class="input-title">跳转参数：</div>
          <a-input class="input" v-model="advertModalInfo.jump_id" :maxLength="-1" placeholder="请输入跳转参数" allowClear />
        </div>

        <!-- 广告位置 -->
        <div class="input-item">
          <div class="input-title">广告位置：</div>
          <a-select style="width: 140px;" v-model="advertModalInfo.advertisement_position_id">
            <a-select-option v-for="(rItem, rIndex) in advertPositionSelectList" :value="rItem.value" :key="rIndex">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 目标对象 -->
        <div class="input-item">
          <div class="input-title">目标对象：</div>
          <a-select style="width: 140px;" v-model="advertModalInfo.user_type">
            <a-select-option v-for="(rItem, rIndex) in advertTargetSelectList" :value="rItem.value" :key="rIndex">
              {{ rItem.label }}
            </a-select-option>
          </a-select>
        </div>

        <!-- 图片 -->
        <div class="input-item">
          <div class="input-title" style="align-self: flex-start;">图片：</div>
          <div class="upload-box" v-viewer>
            <a-icon v-if="advertModalInfo.banner" class="icon-close" type="close-square" @click.stop="removeAdvertModalImage" />
            <img v-if="advertModalInfo.banner" class="upload-img" :src="advertModalInfo.banner" />
            <div v-else class="null-wrap" @click="chooseImage">
              <a-icon type="plus" style="fontSize: 26px" />
            </div>
          </div>
        </div>
      </div>
    </a-modal>

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
import * as advertApi from '@/api/advertApi'
import fileUtil from '@/utils/fileUtil'

// 广告信息
const ADVERT_INFO = {
  banner: '', // banner
  advertisement_position_id: '', // 广告位置 id
  type: 0, // 广告跳转方式 0：app跳转 1：H5网页跳转
  show_type: 0, // 广告展示类型
  jump_type: '', // 广告跳转路由
  jump_id: '', // 广告跳转路由
  user_type: 2, // 广告展示目标用户
  isShowAdvertModal: false, // 是否显示广告 modal
  advertModalType: 0, // 广告 Modal 类型 0: 添加 1: 更新
  putSellPlatformUserId: '', // 更新用户 id
}

export default {
  name: 'AdvertList',
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

      isShowFileInput: true, // 是否显示文件input

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
      
      advertModalInfo: Object.assign({}, ADVERT_INFO), // 广告 modal 信息

      advertPositionSelectList: [], // 广告位位置 select
      advertJumpModeSelectList: [{ label: 'APP内跳转', value: 0 }, { label: 'H5网页跳转', value: 1 }], // 广告跳转方式 select
      advertRouteSelectList: [], // 广告跳转路由 select
      advertTargetSelectList: [{ label: '全部', value: 2 }, { label: '针对用户', value: 0 }, { label: '针对律师', value: 1 }], // 广告目标对象 select
      advertShowTypeSelectList: [{ label: 'Banner', value: 0 }], // 广告展示类型 select
    }
  },
  created() {
    this._advertPositionList()
    this._getAppRouteList()
    this._getAdvertList()
  },
  methods: {
    /**
     * 获取广告列表
     */
     async _getAdvertList(page = 1) {
       const param = { page, size: this.pagination.pageSize }
       this.tabelDataLoading = true

       try {
         const { data: advertPositionData } = await advertApi.getAdvertListApi(param)
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
     * 获取 app 路由列表
     */
     async _getAppRouteList() {
       try {
         const { data: appRouteData } = await advertApi.getAppRouteListApi()
         const tempSelectList = []
         for (const rKey in appRouteData) {
           const selectOpt = { label: appRouteData[rKey], value: rKey }
           tempSelectList.push(selectOpt)
         }
         
         this.advertRouteSelectList = tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取广告位置列表
     */
     async _advertPositionList() {
       const param = { page: 1, size: 100 }

       try {
         const { data: advertPositionData } = await advertApi.getAdvertPositionListApi(param)
         const tempSelectList = []
         // 销售主管账号列表
         for (const dItem of advertPositionData.data) {
           const selectOpt = { label: dItem.title, value: dItem.advertisement_position_id, }
           tempSelectList.push(selectOpt)
         }

         this.advertPositionSelectList = tempSelectList
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
    async onChangeInputFile(event) {
      const file = event.target.files[0]
      this.isShowFileInput = false
      const imageUrl = await fileUtil.uploadFile(file)
      
      this.advertModalInfo.banner = imageUrl
    },

    /**
     * 移除 广告 modal 图片
     */
    removeAdvertModalImage() {
      this.advertModalInfo.banner = ''
    },

    /**
     * 打开「添加模式」广告 modal
     */
    openAddAdvertModal() {
      this.advertModalInfo.advertModalType = 0 // 添加模式
      this.advertModalInfo = Object.assign({}, ADVERT_INFO)
      this.advertModalInfo.isShowAdvertModal = true
    },

    /**
     * 打开「更新模式」广告 modal
     */
    async openPutLabelModal(record) {
      this.advertModalInfo.advertModalType = 1 // 更新模式
      this.advertModalInfo.name = record.name
      this.advertModalInfo.mobile = record.mobile
      this.advertModalInfo.sex = record.sex
      this.advertModalInfo.putSellPlatformUserId = record.financial_legal_sales_relation_id // 待更新用户 id
      this.advertModalInfo.isShowAdvertModal = true
    },

    /**
     * 角色 Modal 完全关闭后的回调
     */
    onRoleModalAfterClose() {
      this.advertModalInfo = Object.assign({}, ADVERT_INFO)
    },

    /**
     * 监听标签 modal ok 事件
     */
    onRoleModalOkEvt(event) {
      const { advertModalInfo } = this
      const advertModalType = advertModalInfo.advertModalType
      // if (!advertModalInfo.name.trim()) return this.$message.warning('请输入姓名')
      // if (!advertModalInfo.mobile.trim()) return this.$message.warning('请输入手机号码')
      
      this.advertModalInfo.isShowAdvertModal = false
      
      // advertModalType === 1 ? 更新 : 添加
      advertModalType === 1 ? this._putSellPlatformUser(advertModalInfo) : this._addAdvert(advertModalInfo)
    },

    /**
     * 添加销售端用户
     */
     async _addAdvert(advertModalInfo) {
       const param = {
         advertisement_position_id: advertModalInfo.advertisement_position_id,
         type: advertModalInfo.type,
         jump_type: advertModalInfo.jump_type,
         jump_id: advertModalInfo.jump_id,
         show_type: advertModalInfo.show_type,
         user_type: advertModalInfo.user_type,
         banner: advertModalInfo.banner,
       }

       console.log(param)

       try {
         const { data } = await advertApi.postAddAdvertApi(param)
         this._getAdvertList()
         this.$notification.success({ message: '添加成功', duration: 3 })
       } catch (error) {
         console.log(error)
       }
     },


    /**
     * 更新标签
     */
    async _putSellPlatformUser(advertModalInfo) {
      const param = {
        financial_legal_sales_relation_id: advertModalInfo.putSellPlatformUserId,
        name: advertModalInfo.name.trim(),
        sex: advertModalInfo.sex,
      }

      try {
        const { data } = await advertApi.putSellPlatformUserApi(param)
        this._getSellPlatformUserList(this.pagination.current)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 删除广告
     */
    async delAdvert(advertRecord) {
      const { advertisement_id } = advertRecord
      if (!advertisement_id) return

      try {
        const { data } = await advertApi.delAdvertApi({ advertisement_id })
        // 更新当页数据
        this._getAdvertList(this.pagination.current)
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

.advert-modal {
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
      width: 200px;
      height: 140px;
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
</style>
