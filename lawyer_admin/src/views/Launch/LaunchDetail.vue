<template>
  <div>
    <a-row :gutter="[16, 16]">
      <a-col :span="16">
        <a-card>
          <div class="left">
            <div class="left-title" @click="$router.back(-1)">
              <img :src="require('@/assets/Fundraising/hf_icon@2x.png')" />
              <span> 返回列表</span>
            </div>
            <div class="left-data">
              <div v-for="(i, key) in leftList" :key="key" class="left-data-show">
                <p style="font-size: 15px; margin: 0px">{{ i.title }}</p>
                <p style="font-size: 30px; margin: 0px">{{ i.value.value }}</p>
                <div style="font-size: 14px display: flex; flex-direction: row; align-items: center">
                  同比昨日：
                  <span v-if="i.value.radio.direction === 1" style="color: red">
                    {{ i.value.radio.ratio }}% <a-icon type="caret-up" theme="filled" style="color: red" />
                  </span>
                  <span v-else-if="i.value.radio.direction === -1" style="color: green">
                    {{ i.value.radio.ratio }}% <a-icon type="caret-down" theme="filled" style="color: green" />
                  </span>
                  <span v-else style="color: black">相同</span>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card>
          <div class="right">
            <span class="right-title">统计展示</span>
            <div class="right-progress">
              <a-progress type="dashboard" :percent="percentNumber" :gapDegree="145" />
              <div class="right-progress-data">
                <span>
                  <div
                    style="display: inline-block; width: 10px; height: 10px; background: #1890ff; border-radius: 50%"
                  />
                  已消耗数/次：{{ launchData.total_exposure_number - launchData.remain_exposure_number }}
                </span>
                <span>
                  <div
                    style="display: inline-block; width: 10px; height: 10px; background: #eeeeee; border-radius: 50%"
                  />
                  剩余数/次：{{ launchData.remain_exposure_number }}
                </span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <div class="user">
            <div class="user-data">
              <UserVipCell
                :nickname="launchData.user.nickname"
                :avatar="launchData.user.avatar"
                :mobile="launchData.user.mobile"
              />
              <span style="margin: 0 20px">
                订单号：<span style="color: #787e8d">{{ launchData.order_no }}</span>
              </span>
              <span style="margin: 0 20px">
                订单时间：<span style="color: #787e8d">{{ launchData.order_created_at }}</span>
              </span>
            </div>
            <hr />
            <div class="user-adData">
              <a-col :span="6" style="height: 50px; margin: 4px 0">
                <span> 投放状态: </span>
                <a-select
                  ref="select"
                  style="width: 120px"
                  v-model="launchData.status"
                  @change="putAdvertisementStatus(launchData.status)"
                >
                  <a-select-option :value="0">开启中</a-select-option>
                  <a-select-option :value="1">关闭</a-select-option>
                  <a-select-option :value="2">禁用</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="12" style="height: 50px; margin: 4px 0">
                <span> 投放设定: </span>
                <span style="color: #787e8d">
                  每次点击减少{{ reduce.cilickNumber ? reduce.cilickNumber : 'xx' }}次数, 每隔{{
                    reduce.interval ? reduce.interval : 'xx'
                  }}
                  小时,定时减少{{ reduce.intervalNumber ? reduce.intervalNumber : 'xx' }}次数
                </span>
                <a-icon type="form" @click="state.modalDetail = true" />
              </a-col>
              <a-col :span="24" style="height: 50px; margin: 4px 0">
                <span> 投放位置: </span>
                <span v-for="(i, key) in launchData.advertisement_positions" :key="key" style="color: #787e8d">
                  {{
                    i.advertisement_position_id === 2
                      ? i.title + '(banner)'
                      : i.advertisement_position_id === 5
                      ? i.title + '(悬浮窗)'
                      : i.title
                  }}{{ key === launchData.advertisement_positions.length - 1 ? ' 。 ' : ' ， ' }}
                </span>
                <a-icon type="form" @click="state.modalPosition = true" />
              </a-col>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model="state.modalPosition" title="编辑位置" @ok="adPositionChange">
      <div class="bannerAd">
        <div class="bannerAd-title">
          <img :src="require('@/assets/common/ring-blue.png')" />
          <span> BANNER广告</span>
          <a-divider />
        </div>
        <a-checkbox-group v-model="bannerList" style="display: flex; flex-direction: column; align-items: flex-start">
          <a-checkbox style="display: none"> 12321 </a-checkbox>
          <a-checkbox :value="1"> 首页头部 </a-checkbox>
          <a-checkbox :value="2"> 社区列表 </a-checkbox>
          <a-checkbox :value="3"> 找律师 </a-checkbox>
          <a-checkbox :value="4"> 我的 </a-checkbox>
          <a-checkbox :value="11"> 社区关注列表 </a-checkbox>
        </a-checkbox-group>
      </div>
      <a-divider />
      <div class="suspensionAd">
        <div class="suspensionAd-title">
          <img :src="require('@/assets/common/ring-red.png')" />
          <span> 悬浮窗广告</span>
          <a-divider />
        </div>
        <a-checkbox-group
          v-model="suspensionList"
          style="display: flex; flex-direction: column; align-items: flex-start"
        >
          <a-checkbox style="display: none"> 12321 </a-checkbox>
          <a-checkbox :value="5"> 社区列表 </a-checkbox>
          <a-checkbox :value="6"> 帖子详情 </a-checkbox>
          <a-checkbox :value="7"> 发布问答 </a-checkbox>
          <a-checkbox :value="8"> 30秒社区 </a-checkbox>
        </a-checkbox-group>
      </div>
      <a-divider />
      <div class="lawyerAd">
        <div class="lawyerAd-title">
          <img :src="require('@/assets/common/ring-yellow.png')" />
          <span> 律师广告</span>
          <a-divider />
        </div>
        <a-checkbox-group v-model="lawyerAdList" style="display: flex; flex-direction: column; align-items: flex-start">
          <a-checkbox style="display: none"> 12321 </a-checkbox>
          <a-checkbox :value="9"> 找律师 </a-checkbox>
          <a-checkbox :value="10"> 消息列表 </a-checkbox>
        </a-checkbox-group>
      </div>
    </a-modal>
    <a-modal v-model="state.modalDetail" title="投放设定" @ok="modalDetailChange">
      <div style="display: flex; flex-direction: column; flex-wrap: nowrap; align-content: flex-start">
        <span style="margin: 10px 0">
          每隔
          <span> <a-input size="small" style="width: 50px" v-model="reduce.interval"></a-input> 小时</span>
          消费
          <span> <a-input size="small" style="width: 50px" v-model="reduce.intervalNumber"></a-input>次</span>
        </span>
        <span style="margin: 10px 0">
          每次点击消费
          <span><a-input size="small" style="width: 50px" v-model="reduce.cilickNumber"></a-input>次数</span>
        </span>

        <div
          style="
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-between;
            margin: 10px 0;
          "
        >
          <span>投放抹零剩余 <a-input style="width: 100px" v-model="reduce.removeNumber"></a-input></span>
          <a-button @click="putAdvertisementExposureSub">抹零</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
  <script>
import UserVipCell from '@/components/User/UserVipCell'
import {
  getAdvertisementDetail,
  putAdvertisementExposureSub,
  putAdvertisementDetail,
  putAdvertisementPositions,
  putAdvertisementStatus,
} from '@/api/launch'
export default {
  name: 'LaunchDetailIndex',
  components: { UserVipCell },
  props: {},
  data() {
    return {
      state: {
        modalDetail: false,
        modalPosition: false,
      },
      reduce: {
        interval: null,
        intervalNumber: null,
        cilickNumber: null,
        removeNumber: null,
      },
      bannerList: [],
      suspensionList: [],
      lawyerAdList: [],
      modalDetailvalue: 0,
      launchData: {
        total_exposure_number: 10000,
        remain_exposure_number: 9997,
        statistics: {
          click_number: {
            value: '0',
            radio: {
              direction: -1,
              ratio: 100,
            },
          },
          click_conversion: {
            value: '0',
            radio: {
              direction: -1,
              ratio: 100,
            },
          },
          call_phone_number: {
            value: '2',
            radio: {
              direction: 0,
              ratio: 0,
            },
          },
          call_phone_conversion: {
            value: '0',
            radio: {
              direction: -1,
              ratio: 100,
            },
          },
        },
        user: {
          user_id: 4,
          nickname: '测试',
          avatar:
            'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/lawyer/d3bee784bc94e1fd211f3981f2865a79.jpeg',
          mobile: '18958904395',
        },
        timed_frequency_hour: null,
        timed_frequency_sub_exposure_number: null,
        click_sub_exposure_number: 1,
        order_no: '20210813102228417',
        order_created_at: '2021-08-13 10:22',
        status: 0,
        advertisement_positions: [
          {
            advertisement_position_id: 2,
            title: '社区列表',
          },
        ],
      },
    }
  },
  computed: {
    leftList() {
      return [
        {
          title: '总点击数(次)',
          value: this.launchData.statistics.click_number,
        },
        {
          title: '点击转化率(次)',
          value: this.launchData.statistics.click_conversion,
        },
        {
          title: '咨询数(次)',
          value: this.launchData.statistics.call_phone_number,
        },
        {
          title: '咨询转化率(次)',
          value: this.launchData.statistics.call_phone_conversion,
        },
      ]
    },
    percentNumber() {
      let numberData = null
      numberData =
        Math.round(
          ((this.launchData.total_exposure_number - this.launchData.remain_exposure_number) /
            this.launchData.total_exposure_number) *
            10000
        ) / 100
      return numberData
    },
  },
  watch: {
    launchData() {
      this.bannerList = []
      this.suspensionList = []
      this.lawyerAdList = []
      const allList = this.launchData.advertisement_positions
      for (let i = 0; i < allList.length; i++) {
        if (allList[i].advertisement_position_id < 4) {
          this.bannerList.push(allList[i].advertisement_position_id)
        } else if (allList[i].advertisement_position_id > 4 && allList[i].advertisement_position_id < 9) {
          this.suspensionList.push(allList[i].advertisement_position_id)
        } else {
          this.lawyerAdList.push(allList[i].advertisement_position_id)
        }
      }
    },
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      getAdvertisementDetail(this.$route.params.advertisementId).then((data) => {
        this.launchData = data.data
        this.reduce.interval = data.data.timed_frequency_hour
        this.reduce.intervalNumber = data.data.timed_frequency_sub_exposure_number
        this.reduce.cilickNumber = data.data.click_sub_exposure_number
      })
    },
    modalDetailChange() {
      putAdvertisementDetail(
        this.$route.params.advertisementId,
        this.reduce.cilickNumber,
        this.reduce.intervalNumber,
        this.reduce.interval
      )
        .then(() => {
          this.$message.success('修改成功')
          this.getData()
        })
        .finally(() => {
          this.state.modalDetail = false
        })
    },
    adPositionChange() {
      const advertisementPositionIds = []
      advertisementPositionIds.push.apply(advertisementPositionIds, this.bannerList)
      advertisementPositionIds.push.apply(advertisementPositionIds, this.suspensionList)
      advertisementPositionIds.push.apply(advertisementPositionIds, this.lawyerAdList)
      putAdvertisementPositions(this.$route.params.advertisementId, JSON.stringify(advertisementPositionIds)).then(
        () => {
          this.$message.success('修改展示位置成功')
          this.getData()
        }
      )
      this.state.modalPosition = false
    },
    putAdvertisementExposureSub() {
      putAdvertisementExposureSub(this.$route.params.advertisementId, this.reduce.removeNumber).then(() => {
        this.reduce.removeNumber = null
        this.$message.success('已抹零')
        this.getData()
      })
    },
    putAdvertisementStatus(status) {
      putAdvertisementStatus(this.$route.params.advertisementId, status).then(() => {
        this.$message.success('修改成功')
        this.getData()
      })
    },
  },
}
</script>
 <style scoped lang="less">
.left {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  height: 176px;
  &-title {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 120px;
    cursor: pointer;
    img {
      width: 25px;
      height: 20px;
    }
    span {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 800;
      line-height: 0px;
      color: #222222;
      opacity: 1;
    }
  }
  &-data {
    padding: 20px;
    width: 100%;

    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    height: auto;
    &-show {
      display: flex;
      align-items: center;
      flex-direction: column;
      height: auto;
      width: 25%;
      span {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 0px;
        color: #222222;
      }
    }
  }
}
.right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &-title {
    width: 100%;
    font-size: 22px;
    font-weight: 800;
    color: #222222;
  }
  &-progress {
    display: flex;
    flex-direction: row;
    padding: 10px;

    &-data {
      width: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-wrap: nowrap;
      padding: 10px;
    }
  }
}
.user {
  &-data {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    height: 100px;
    span {
      color: #222222;
      margin: 0 10px;
    }
  }
  &-adData {
    min-height: 350px;
    span {
      color: #222222;
    }
  }
}
.radioDiv {
  width: 472px;
  height: 64px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  opacity: 1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 0 28px;
  margin: 20px 0;
  cursor: pointer;
}
.bannerAd,
.suspensionAd,
.lawyerAd {
  padding: 0 32px;
  &-title {
    img {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
