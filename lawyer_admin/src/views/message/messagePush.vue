<template>
  <a-layout class="messageMain">
    <a-layout-header class="top">
      <div>
        <span class="focus-text">已推送消息数量:{{ pagination.total }}</span>
        <a-input
          allow-clear
          placeholder="搜索用户名/手机号"
          v-model="search"
          @keyup.enter="getIntendedUserPage"
          style="width: 180px; margin: 0 5px"
        />
        <a-button type="primary" @click="getIntendedUserPage"> 搜索 </a-button>
      </div>
      <div class="addList">
        <a-button style="background-color: #2cbf78; color: #ffffff; border-color: #2cbf78" @click="cancelAdd()">
          推送系统消息
        </a-button>
      </div>
    </a-layout-header>
    <a-card class="content">
      <a-table
        :pagination="pagination"
        :rowKey="(record) => record.wechat_number"
        :data-source="data"
        bordered
        :loading="state.loading"
      >
        <a-table-column key="mobile" title="发送内容">
          <template slot-scope="text, record">
            <TextWithRowButton :text="record.mobile" :over-max="50" />
          </template>
        </a-table-column>
        <a-table-column key="customer_nickname" title="发送时间">
          <template slot-scope="text, record">
            <span> {{ record.customer_nickname }} </span>
          </template>
        </a-table-column>
        <a-table-column key="wechat_number" title="推送地区">
          <template slot-scope="text, record">
            <span> {{ record.wechat_number }} </span>
          </template>
        </a-table-column>
        <a-table-column key="intentional_customer_service_admin" title="操作">
          <template slot-scope="text, record">
            <a-button type="danger" @click="deleteMessage(record)">删除</a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-card>
    <a-modal v-model="state.addModal">
      <div class="addIntendedUser">
        <div class="addIntendedUser-title">
          <span>推送系统消息 </span>
        </div>
        <div class="addIntendedUser-main">
          <p>编辑信息</p>
          <a-textarea placeholder="请输入系统信息内容" v-model="newData.content" :auto-size="{ minRows: 4 }" />
          <div
            style="
              margin: 10px 0;
              width: 100%;
              height: auto;
              display: flex;
              flex-flow: row wrap;
              justify-content: flex-start;
              flex-direction: row;
              flex-wrap: wrap;
              align-items: flex-start;
            "
          >
            <div v-for="(i, key) in newData.addMessageImage" :key="key" style="position: relative; margin: 5px">
              <img
                v-show="$store.state.step.selectStep === 0"
                :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                style="
                  width: 18px;
                  height: 18px;
                  float: right;
                  position: absolute;
                  z-index: 2;
                  right: 5px;
                  top: 5px;
                  cursor: pointer;
                "
                @click="deleteImage(key, 1)"
              />
              <div
                style="
                  width: 80px;
                  height: 80px;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: start;
                  position: relative;
                "
              >
                <img :src="i" style="width: 80px; height: 80px" />
              </div>
              <div style="width: 80px; word-break: break-all; height: auto; display: flex; justify-content: center">
                <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
              </div>
            </div>
            <div
              style="
                height: 80px;
                width: 80px;
                background-color: 999999;
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: center;
                border: 1px solid rgb(203, 209, 225);
              "
              v-show="state.uploading"
            >
              <a-spin />
              正在上传
            </div>
            <upload-video
              @uploadVideo="getUrl"
              @beginUpload="beginUpload"
              height="80px"
              width="80px"
              style="margin: 5px"
            />
          </div>
          <p>选择推送地区律师</p>
          <div
            style="
              width: 100%;
              display: flex;
              justify-content: space-around;
              align-items: center;
              flex-direction: row;
              flex-wrap: nowrap;
            "
          >
            <span>所在省:</span>
            <a-select placeholder="选择省份" style="width: 180px" @change="changeDistrict">
              <a-select-option :value="i.district_id" v-for="(i, key) in districtList" :key="key">
                {{ i.name }}
              </a-select-option>
            </a-select>
            <span>所在市:</span>
            <a-select placeholder="选择城市" style="width: 180px" @change="changeCity">
              <a-select-option :value="i.district_id" v-for="(i, key) in cityList" :key="key">
                {{ i.name }}
              </a-select-option>
            </a-select>
            <!-- <Cascader
              v-model="newData.cityCascade"
              :options="options"
              :show-search="{ filter }"
              placeholder="选择城市"
              @change="cityChange"
              style="width: 480px"
            /> -->
          </div>
        </div>

        <div class="addIntendedUser-action">
          <a-button @click="cancelAdd()"> 取消 </a-button>
          <a-button @click="submitData()" type="primary" style="background: #3764ff; border-color: #3764ff">
            确定推送
          </a-button>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import { getIntendedUserPage } from '@/api/user'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import { getLawyerDistricts } from '@/api/lawyer'
import { copyToClip } from '@/utils/util'
import { Cascader } from 'ant-design-vue'
import uploadVideo from '@/components/Common/uploadVideo.vue'
import moment from 'moment'
export default {
  name: 'LawyerAuth',
  components: { Cascader, uploadVideo, TextWithRowButton },
  data() {
    return {
      districtList: [],
      cityList: [],
      options: [],
      modelTitle: '添加意向客服',
      newData: {
        content: '',
        addMessageImage: [],
        cityCascade: [null, null],
      },
      data: [],
      search: '',
      state: {
        loading: false,
        addModal: false,
        uploading: false,
      },
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        onChange: (page) => {
          this.getIntendedUserPage(page, this.search)
          this.pagination.current = page
        },
      },
    }
  },
  computed: {
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      return condition
    },
  },
  created() {
    const condition = JSON.parse(sessionStorage.getItem('IntendedUserCondition'))
    if (condition) {
      this.pagination.current = condition.current
      sessionStorage.clear()
      this.getIntendedUserPage(condition.current)
    } else {
      this.getIntendedUserPage(1)
    }
    this.getDistricts()
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('IntendedUserCondition', JSON.stringify(this.conditionData))
    },
    getIntendedUserPage(page) {
      this.state.loading = true
      getIntendedUserPage(page)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          this.data = data.data
          console.log(this.data)
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    moment,
    getDistricts() {
      // 城市级联
      getLawyerDistricts().then((data) => {
        this.districtList = data.data
        console.log(this.districtList)
        var list = []
        for (let i = 0; i < data.data.length; i++) {
          list.push({ label: data.data[i].name, value: data.data[i].district_id, children: [] })
          for (let j = 0; j < data.data[i].cities.length; j++) {
            list[i].children.push({ label: data.data[i].cities[j].name, value: data.data[i].cities[j].district_id })
          }
        }
        this.options = list
      })
    },
    // filter(inputValue, path) {
    //   return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    // },
    // cityChange(data) {
    //   this.newData.cityCascade = data
    //   console.log(this.newData.cityCascade)
    // },
    submitData() {
      console.log(this.newData)
      this.state.addModal = false
    },
    cancelAdd() {
      this.state.addModal = !this.state.addModal
      this.newData.content = ''
      this.newData.addMessageImage = []
      this.newData.cityCascade = []
    },
    copyClip(text) {
      copyToClip(text)
      this.$message.success('已复制到剪切板')
    },
    deleteMessage(record) {
      console.log('删除信息:', record)
    },
    getUrl(data) {
      this.newData.addMessageImage.push(data)
    },
    beginUpload(data) {
      this.state.uploading = data
    },
    deleteImage(key) {
      this.newData.addMessageImage.splice(key, 1)
    },
    changeDistrict(data, type) {
      for (let i = 0; i < this.districtList.length; i++) {
        if (this.districtList[i].district_id === data) {
          this.cityList = this.districtList[i].cities
        }
      }
      this.newData.cityCascade[0] = data
    },
    changeCity(data) {
      this.newData.cityCascade[1] = data
    },
  },
}
</script>

<style lang="less" scoped>
.messageMain {
  .top {
    display: flex;
    height: 90px;
    align-items: center;
    justify-content: space-between;
    input {
      width: 170px;
      margin-right: 20px;
    }

    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }

  .content {
    margin-top: 16px;
  }
}
/deep/.ant-modal-close,
/deep/.ant-modal-header,
/deep/.ant-modal-footer {
  display: none;
}
/deep/.ant-modal-body {
  padding: 0;
}
/deep/.ant-modal-content {
  border-radius: 16px 8px 16px 8px;
}
.addIntendedUser {
  &-title {
    background: #ebeef5;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 48px;
    border-radius: 16px 8px 0 0;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 34px;
    color: #222222;
    opacity: 1;
  }
  &-main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    align-items: flex-start;
    padding: 0 20px;
    input {
      margin: 10px 0;
      background: #f5f7fa;
      border: 1px solid #e1e6ee;
      opacity: 1;
      border-radius: 8px;
    }
    p {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 34px;
      color: #222222;
      opacity: 1;
      margin: 10px 0;
    }
  }
  &-action {
    height: 88px;
    padding: 28px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    button {
      width: 178px;
      height: 36px;
    }
  }
}
.addList {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  &-option {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
    margin: 0 20px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 8px;
    }
    span {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      opacity: 1;
    }
  }
}
</style>
