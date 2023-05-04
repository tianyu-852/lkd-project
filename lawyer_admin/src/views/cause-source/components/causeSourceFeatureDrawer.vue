<template>
  <div>
    <!-- 发布订单 -->
    <a-drawer
      title="发布精选案源"
      :width="620"
      :visible="causeSourceDrawer.isShowCauseSourceDrawer"
      destroyOnClose
      @close="onCauseSourceDrawerCloseEvt"
    >
      <div class="causeSource-drawer">
        <div class="causeSource-wrap">
          <!-- 当事人姓名 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">当事人姓名：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input v-model="causeSourceDrawer.name" class="input" :maxLength="20" placeholder="当事人姓名" allowClear />
            </div>
          </div>

          <!-- 当事人电话 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">当事人电话：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-input v-model="causeSourceDrawer.mobile" class="input" :maxLength="11" placeholder="当事人电话" allowClear />
            </div>
          </div>

          <!-- 当事人位置 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">当事人位置：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-cascader :defaultValue="[ causeSourceDrawer.user_province_id, causeSourceDrawer.user_city_id ]" :options="regionSelectList" placeholder="请选择当事人地区" @change="onUserRegionCascaderChangeEvt" />
            </div>
          </div>

          <!-- 案件类型 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">案件类型：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-cascader :options="causeSourceCategoryCascaderList" placeholder="请选择案件类型" @change="onCauseSourceCategoryCascaderChangeEvt" />
            </div>
          </div>

          <!-- 案件标签 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">案件标签：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="option-wrap">
                <div v-for="tItem in causeSourceTagSelectList" :key="tItem.demand_tags_id" class="option-item" :class="{ 'option-item-active': causeSourceDrawer.demand_tags_ids.includes(tItem.demand_tags_id) }" @click="changeCauseSourceTag(tItem)" >
                  {{ tItem.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- 案件时间 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left">
              <div class="info-title">案件时间：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-date-picker
                v-model="causeSourceDrawer.happen_time"
                format="YYYY-MM-DD HH:mm:ss"
                :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
              />
            </div>
          </div>

          <!-- 案件描述 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left" style="align-self: flex-start;" >
              <div class="info-title">案件描述：</div>
            </div>
            <div class="causeSource-info-middle">
              <a-textarea v-model="causeSourceDrawer.case_description" placeholder="请输入案件描述" :autoSize="{ minRows: 5, maxRows: 8 }" />
            </div>
          </div>

          <!-- 图片 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left" style="align-self: flex-start;" >
              <div class="info-title">图片(选填)：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="image-wrap">
                <div v-for="(iItem, iIndex) in causeSourceDrawer.images" :key="iIndex" class="image-item" v-viewer >
                  <img class="image" :src="iItem" />
                  <a-icon class="icon-close" type="close-circle" @click.stop="causeSourceDrawer.images.splice(iIndex, 1)" />
                </div>

                <div v-if="causeSourceDrawer.images.length < causeSourceDrawerImageLimit" class="image-upload" @click="chooseCauseSourceImage">
                  <a-icon type="plus" style="fontSize: 26px" />
                </div>
              </div>
            </div>
          </div>

          <!-- 文件 -->
          <div class="causeSource-info-item">
            <div class="causeSource-info-left" style="align-self: flex-start;">
              <div class="info-title">文件(选填)：</div>
            </div>
            <div class="causeSource-info-middle">
              <div class="file-wrap">
                <a-button type="primary" @click="openFileModal">选择文件</a-button>
                <div class="user-file-items">
                  <div v-for="(fItem, fIndex) in causeSourceDrawer.file_ids" :key="fIndex" class="user-file-item">
                    {{ fItem | userFileFilter(userFileModalInfo.userFileList) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a-popconfirm :title="causeSourceDrawer.order_no ? '请确认更新精选案源?' : '请确认发布精选案源?'" ok-text="确定" cancel-text="取消" @confirm="confirmPublishCauseSourceFeature" >
          <a-button v-if="causeSourceDrawer.order_no" class="pub-btn" type="primary">更新案源</a-button>
          <a-button v-else class="pub-btn" type="primary">发布案源</a-button>
        </a-popconfirm>
      </div>
    </a-drawer>

    <!-- 用户文件 modal -->
    <a-modal
      v-model="userFileModalInfo.isShowUserFileModal"
      title="文件列表"
      :width="500"
      :zIndex="1001"
      :bodyStyle="{ padding: '10px' }"
      @ok="onUserFileModalOkEvt"
    >
      <div class="file-modal">
        <div class="upload-wrap">
          <a-button type="link" @click="chooseUserFile">上传文件</a-button>
        </div>
        <a-checkbox-group style="width: 100%;" :defaultValue="userFileModalInfo.userCheckedFileIds" @change="onUserFileCheckboxChange">
          <a-row class="checkbox-row" v-for="(fItem, fIndex) in userFileModalInfo.userFileList" :key="fIndex">
            <a-col :span="24">
              <a-checkbox class="checkbox" :value="fItem.admin_file_id">
                <div class="file-info">
                  <div class="file-name">{{ fItem.title }}</div>
                  <div class="file-time">{{ fItem.file_size }}kB, {{ fItem.created_at }}</div>
                </div>
                <a-popconfirm
                  v-if="userFileModalInfo.userCheckedFileIds.indexOf(fItem.admin_file_id) >= 0 ? false : true"
                  title="请确认是否删除该文件?"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="delUserFile(fItem, fIndex)"
                >
                  <a-button type="link" size="small">删除</a-button>
                </a-popconfirm>
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>
    </a-modal>

    <!-- 案源图片 input 多文件上传  -->
    <input
      v-if="isShowCSImageFileInput"
      id="input"
      ref="fileInputCSImageRef"
      type="file"
      style="display: none;"
      accept="image/*"
      multiple
      @change="onCSImageInputFileChange"
    >

    <!-- 案源文件 input 单文件上传 -->
    <input
      v-if="isShowUserFileInput"
      id="input"
      ref="fileInputUserRef"
      type="file"
      style="display: none;"
      @change="onUserInputFileChange"
    >
  </div>
</template>

<script>
import * as causeSourceApi from '@/api/causeSourceApi'
import fileUtil from '@/utils/fileUtil'
import moment from 'moment'

// 附件信息
const USER_FILE_INFO = {
  userFileList: [], // 用户文件列表
  userCheckedFileIds: [], // 用户选中的文件 ids
  isShowUserFileModal: false, // 是否显示附件 modal
}

// 案件信息
const CAUSESOURCE_INFO = {
  isShowCauseSourceDrawer: false,
  order_no: '', // 订单号
  
  name: '', // 联系人姓名
  mobile: '', // 联系人电话
  user_province_id: '', // 当事人地区省份 id
  user_city_id: '', // 当事人地区城市 id
  category_id: '', // 案源类型id
  demand_tags_ids: [], // 案源标签 ids
  happen_time: '', // 案源时间
  case_description: '', // 案源描述
  images: [], // 图片地址数组
  file_ids: [], // 文件 ids
}

export default {
  name: 'CauseSourceFeatureDrawer',
  filters: {
    userFileFilter(fileId, userFileList) {
      const fileInfo = userFileList.find(item => item.admin_file_id === fileId)
      if (fileInfo) return fileInfo.title
    }
  },
  data() {
    return {
      userFileModalInfo: Object.assign({}, USER_FILE_INFO), // 用户 附件 modal 信息
      causeSourceDrawer: JSON.parse(JSON.stringify(CAUSESOURCE_INFO)), // 案源信息 drawer

      causeSourceTagSelectList: [], // 案源标签 select 列表
      causeSourceCategoryCascaderList: [], // 案源分类 option 列表
      regionSelectList: [], // 律师地区 select 列表

      causeSourceDrawerImageLimit: 9, // 案源图片限制 9 张

      isShowCSImageFileInput: true, // 是否显示上传案源图片 input
      isShowUserFileInput: true, // 是否显示上传用户文件 input
    }
  },
  created() {
    this._getCauseSourceTagList()
    this._getCauseSourceCategoryList()
    this._getRegionList()
  },
  methods: {
    moment,

    /**
     * 获取案源标签列表
     */
    async _getCauseSourceTagList() {
      try {
        const { data: causeSourceTagData } = await causeSourceApi.getCauseSourceTagListApi()
        this.causeSourceTagSelectList = causeSourceTagData
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取案源分类列表
     */
    async _getCauseSourceCategoryList() {
      try {
        const { data: causeSourceCategoryData } = await causeSourceApi.getCauseSourceCategoryListApi()

        const _categoryoptionList = []
        for (let i = 0; i < causeSourceCategoryData.length; i++) {
          if (causeSourceCategoryData[i].lawyer_tag_group) {
            _categoryoptionList.push({ label: causeSourceCategoryData[i].lawyer_tag_group, value: causeSourceCategoryData[i].lawyer_tag_group, children: [] })
            for (let j = 0; j < causeSourceCategoryData[i].lawyer_tags.length; j++) {
              _categoryoptionList[i].children.push({ label: causeSourceCategoryData[i].lawyer_tags[j].lawyer_tag, value: causeSourceCategoryData[i].lawyer_tags[j].lawyer_tag_id })
            }
          }
        }

        this.causeSourceCategoryCascaderList = _categoryoptionList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取地区列表
     */
    async _getRegionList() {
      try {
        const { data: lawyerRegionData } = await causeSourceApi.getLawyerRegionListApi()
        const lawyerRegionCommonCityList = lawyerRegionData.cities

        var _regioinOptionList = []
        for (let i = 0; i < lawyerRegionCommonCityList.length; i++) {
          _regioinOptionList.push({ label: lawyerRegionCommonCityList[i].name, value: lawyerRegionCommonCityList[i].district_id, children: [] })
          for (let j = 0; j < lawyerRegionCommonCityList[i].cities.length; j++) {
            _regioinOptionList[i].children.push({ label: lawyerRegionCommonCityList[i].cities[j].name, value: lawyerRegionCommonCityList[i].cities[j].district_id })
          }
        }

        this.regionSelectList = _regioinOptionList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开发布案源 drawer
     */
    openPublishCauseSourceDrawer(clueInfo) {
      console.log(clueInfo)
      this.causeSourceDrawer = JSON.parse(JSON.stringify(CAUSESOURCE_INFO))

      this.causeSourceDrawer.name = clueInfo.user.nickname
      this.causeSourceDrawer.mobile = clueInfo.user.mobile
      clueInfo.user.location_province_district_id && (this.causeSourceDrawer.user_province_id = clueInfo.user.location_province_district_id)
      clueInfo.user.location_city_district_id && (this.causeSourceDrawer.user_city_id = clueInfo.user.location_city_district_id)
      this.causeSourceDrawer.isShowCauseSourceDrawer = true
    },

    /**
     * 关闭发布案源 drawer
     */
    onCauseSourceDrawerCloseEvt() {
      this.causeSourceDrawer.isShowCauseSourceDrawer = false
    },

    /**
     * 选择案源标签
     */
    changeCauseSourceTag(cSTag) {
      if (this.causeSourceDrawer.demand_tags_ids.includes(cSTag.demand_tags_id)) {
        const findIndex = this.causeSourceDrawer.demand_tags_ids.findIndex(item => item === cSTag.demand_tags_id)
        findIndex >= 0 && this.causeSourceDrawer.demand_tags_ids.splice(findIndex, 1)
      } else {
        this.causeSourceDrawer.demand_tags_ids.push(cSTag.demand_tags_id)
      }
    },

    /**
     * 监听案源类型选择 事件
     */
    onCauseSourceCategoryCascaderChangeEvt(value, selectedOptions) {
      this.causeSourceDrawer.category_id = value[1]
    },

    /**
     * 监听当事人地区选择 事件
     */
    onUserRegionCascaderChangeEvt(value, selectedOptions) {
      this.causeSourceDrawer.user_province_id = value[0]
      this.causeSourceDrawer.user_city_id = value[1]
    },

    /**
     * 选择案源图片
     * https://juejin.cn/post/6844903697667850248
     */
    chooseCauseSourceImage() {
      this.isShowCSImageFileInput = true
      this.$nextTick(() => {
        // this.$refs.fileInputCSImageRef.click() 
        this.$refs.fileInputCSImageRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    async onCSImageInputFileChange(event) {
      const { causeSourceDrawer, causeSourceDrawerImageLimit } = this
      const causeSourceImageList = causeSourceDrawer.images
      const fileList = event.target.files
      this.isShowCSImageFileInput = false

      const newImageFileList = Array.from(fileList).slice(0, causeSourceDrawerImageLimit - causeSourceImageList.length)
      const newImageUrlList = []

      try {
        for (const imageFile of newImageFileList) {
          const imageUrl = await fileUtil.uploadFile(imageFile)
          newImageUrlList.push(imageUrl)
        }

        this.causeSourceDrawer.images.push(...newImageUrlList)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开 文件列表 modal
     */
    async openFileModal() {
      const param = { page: 1, size: 500, type: 2 }

      try {
        const { data: userFileData } = await causeSourceApi.getCauseSourceFeatureFileListApi(param)
        this.userFileModalInfo.userFileList = userFileData.data
        this.userFileModalInfo.isShowUserFileModal = true
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择文件
     * https://juejin.cn/post/6844903697667850248
     */
    chooseUserFile() {
      this.isShowUserFileInput = true
      this.$nextTick(() => {
        // this.$refs.fileInputCSImageRef.click() 
        this.$refs.fileInputUserRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 注：因为 input 的 change 事件是通过文件路径来识别是否为同一文件的，如果文件名或路径不改，即使文件内容修改了，在重复上传时也无法触发 change 事件
     * 解决 input 标签重新加载的方法
     */
    async onUserInputFileChange(event) {
      const file = event.target.files[0]
      this.isShowUserFileInput = false

      try {
        const fileUrl = await fileUtil.uploadFile(file)

        const param = {
          title: file.name,
          url: fileUrl,
          file_size: file.size + '',
          type: 2
        }
        const { data } = await causeSourceApi.postCauseSourceFeatureFileApi(param)
        // 获取用户文件
        const { data: userFileData } = await causeSourceApi.getCauseSourceFeatureFileListApi({ page: 1, size: 500, type: 2 })
        this.userFileModalInfo.userFileList = userFileData.data
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择文件 checkbox 变化时回调事件
     */
    onUserFileCheckboxChange(checkedValues) {
      this.userFileModalInfo.userCheckedFileIds = checkedValues
    },

    /**
     * 删除用户文件
     */
    async delUserFile(fileItem, fileIndex) {
      const { admin_file_id } = fileItem
      const param = { admin_file_id: admin_file_id }

      try {
        await causeSourceApi.delCauseSourceFeatureFileApi(param)
        this.userFileModalInfo.userFileList.splice(fileIndex, 1)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听用户文件 modal ok 事件
     */
    onUserFileModalOkEvt() {
      const { userFileModalInfo } = this
      this.causeSourceDrawer.file_ids = userFileModalInfo.userCheckedFileIds
      this.userFileModalInfo.isShowUserFileModal = false
    },

    /**
     * 发布/更新 精选案源
     */
    async confirmPublishCauseSourceFeature() {
      const { causeSourceDrawer } = this
      if (!causeSourceDrawer.name.trim()) return this.$message.warning('请输入当事人姓名')
      if (!causeSourceDrawer.mobile.trim()) return this.$message.warning('请输入当事人手机号')
      if (!causeSourceDrawer.user_city_id) return this.$message.warning('请选择当事人位置')
      if (!causeSourceDrawer.category_id) return this.$message.warning('请选择案件分类')
      if (!causeSourceDrawer.happen_time) return this.$message.warning('请选择案件发生时间')
      if (!causeSourceDrawer.case_description.trim()) return this.$message.warning('请填写案件描述')
      this.causeSourceDrawer.isShowCauseSourceDrawer = false

      const param = {
        name: causeSourceDrawer.name.trim(), // 当事人姓名
        mobile: causeSourceDrawer.mobile.trim(), // 当事人姓名
        province_id: causeSourceDrawer.user_province_id, // 省份 id
        city_id: causeSourceDrawer.user_city_id, // 城市 id
        demand_tags_ids: JSON.stringify(causeSourceDrawer.demand_tags_ids), // 标签json
        category_id: causeSourceDrawer.category_id, // 分类 id
        happen_time: moment(causeSourceDrawer.happen_time).format('YYYY-MM-DD HH:mm:ss'), // 时间
        case_description: causeSourceDrawer.case_description.trim(), // 描述
        images: JSON.stringify(this.causeSourceDrawer.images),
        file_ids: JSON.stringify(this.causeSourceDrawer.file_ids),
      }

      // 更新案源 添加 order_no
      causeSourceDrawer.order_no && (param.order_no = causeSourceDrawer.order_no)

      try {
        // 更新 案源精选
        if (causeSourceDrawer.order_no) {
          await causeSourceApi.updateCauseSourceFeatureApi(param)
          this.$notification.success({ message: '更新成功', duration: 3 })
        // 发布 案源精选
        } else {
          await causeSourceApi.postCauseSourceFeatureApi(param)
          this.$notification.success({ message: '发布成功', duration: 3 })
        }
        // 重置案源 drawer
        this.causeSourceDrawer = JSON.parse(JSON.stringify(CAUSESOURCE_INFO))
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style lang="less" scoped>
.causeSource-drawer {
  position: relative;
  padding-bottom: 40px;
  .causeSource-wrap {
    .causeSource-info-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #333;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .causeSource-info-left {
        min-width: 94px;
        .info-title {
          font-size: 14px;
          font-weight: 600;
        }
      }
      .causeSource-info-middle {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .input {
          width: 180px;
        }
        .option-wrap {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .option-item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 26px;
            padding: 0 16px;
            margin-right: 20px;
            font-size: 12px;
            color: #333;
            background: #eee;
            border-radius: 2px;
            cursor: pointer;
            &:last-child {
              margin-right: 0;
            }
            &.option-item-active {
              color: #fff;
              background: #1790ff;
            }
          }
        }
        .image-wrap {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 10px;
          width: 100%;
          .image-item {
            position: relative;
            cursor: pointer;
            height: 80px;
            .image {
              width: 100%;
              height: 100%;
            }
            .icon-close {
              position: absolute;
              top: -8px;
              right: -8px;
              font-size: 20px;
              cursor: pointer;
            }
          }
          .image-upload {
            position: relative;
            height: 80px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-around;
            background: #f5f5f5;
            border: dashed 1px #666;
          }
        }
        .file-wrap {
          .user-file-items {
            margin-top: 6px;
            .user-file-item {
              font-size: 14px;
              color: #1790ff;
            }
          }
        }
      }
    }
  }
  .pub-btn {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}

.file-modal {
  height: 310px;
  overflow-y: auto;
  .upload-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .upload-file-info {
      font-size: 14px;
      color: #999;
    }
  }
  .checkbox-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    .checkbox {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      /deep/ span {
        &:last-child {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .file-info {
            flex: 1;
            .file-name {
              font-size: 14px;
              font-weight: 500;
              color: #14284a;
              max-width: 330px;
              white-space: normal;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              /* ! autoprefixer: off */
              -webkit-box-orient: vertical;
            }
            .file-time {
              font-size: 12px;
              font-weight: 500;
              color: #6e7695;
            }
          }
        }
      }
    }
  }
}
</style>
