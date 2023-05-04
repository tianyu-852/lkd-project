<template>
  <div>
    <a-row :gutter="[24, 24]">
      <a-col :span="24">
        <a-card>
          <!-- <a-col :span="2"><a-icon type="arrow-left" /></a-col> -->
          <a-col :span="24">
            <div @click="goList" style="cursor: pointer">
              <h6>
                ←
                <span>返回列表：</span>
              </h6>
            </div>
            <!-- <h6 style="margin: 0">用户基本信息：</h6> -->
          </a-col>

          <a-col :span="24">
            <user-vip-cell
              :nickname="progressData.creator.nickname"
              :avatar="progressData.creator.avatar"
              :mobile="progressData.creator.mobile"
              :user-id="progressData.creator.user_id"
              :mode="0"
              size="big"
            />
          </a-col>

          <a-col :span="24">
            <user-vip-cell
              :nickname="progressData.lawyer.nickname"
              :avatar="progressData.lawyer.avatar"
              :mobile="progressData.lawyer.mobile"
              :user-id="progressData.lawyer.user_id"
              :mode="2"
              size="big"
            />
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-card-grid style="width: 100%" :hoverable="false">
            <h6>项目详情</h6>
            <div style="background-color: #eff1f5; width: 100%; height: 100px; padding: 15px">
              <label>
                {{ progressData.content }}
              </label>
            </div>
          </a-card-grid>
          <a-card-grid style="width: 100%" :hoverable="false">
            <h6>项目进度</h6>
            <a-radio-group v-model="state.steps" style="width: 100%">
              <a-radio :value="true"> 正序 </a-radio>
              <a-radio :value="false"> 倒序 </a-radio>
            </a-radio-group>
            <div v-show="state.steps === true">
              <div v-for="(item, keys) in progressData.items" :key="keys" style="margin: 10px">
                <div>
                  <li>
                    <img :src="imgUrl[item.is_auth].url" style="height: 20px; width: 20px" />
                    <b> {{ item.fundraising_progress }}</b> <span style="color: #787e8d"> {{ item.created_at }}</span>
                  </li>

                  <img
                    v-for="(i, key) in item.images"
                    :key="key"
                    :src="i.image"
                    style="width: 240px; height: 120px; background-color: #c2ccdc; margin: 5px"
                    @click="showImages(keys)"
                  />
                </div>
                <div v-if="item.is_auth === 0">
                  <a-button @click="checkProgress(1, item.fundraising_progress_item_auth_id)" type="primary">
                    审核通过
                  </a-button>
                  <a-popconfirm
                    ok-text="确定"
                    cancel-text="再想想"
                    @confirm="checkProgress(0, item.fundraising_progress_item_auth_id)"
                    @cancel="cancel"
                  >
                    <a-icon slot="icon" />
                    <a-input id="input" v-model="refuseReason" placeholder="请输入驳回理由" slot="title" />
                    <a-button style="margin-left: 10px; background-color: #ff9700; color: #fff; border-color: #ff9700">
                      驳回
                    </a-button>
                  </a-popconfirm>
                </div>
              </div>
            </div>
            <div v-show="state.steps === false" style="display: flex; flex-direction: column-reverse">
              <div v-for="(item, keys) in progressData.items" :key="keys" style="margin: 10px">
                <div>
                  <li>
                    <img :src="imgUrl[item.is_auth].url" style="height: 20px; width: 20px" />
                    <b> {{ item.fundraising_progress }}</b> <span style="color: #787e8d"> {{ item.created_at }}</span>
                  </li>

                  <img
                    v-for="(i, keys) in item.images"
                    :key="keys"
                    :src="i.image"
                    style="width: 240px; height: 120px; background-color: #c2ccdc; margin: 5px"
                    @click="showImages(keys)"
                  />
                </div>
                <div v-if="item.is_auth === 0">
                  <a-button @click="checkProgress(1, item.fundraising_progress_item_auth_id)" type="primary">
                    审核通过
                  </a-button>
                  <a-popconfirm
                    ok-text="确定"
                    cancel-text="再想想"
                    @confirm="checkProgress(0, item.fundraising_progress_item_auth_id)"
                    @cancel="cancel"
                  >
                    <a-icon slot="icon" />
                    <a-input id="input" v-model="refuseReason" placeholder="请输入驳回理由" slot="title" />
                    <a-button style="margin-left: 10px; background-color: #ff9700; color: #fff; border-color: #ff9700">
                      驳回
                    </a-button>
                  </a-popconfirm>
                </div>
              </div>
            </div>
          </a-card-grid>
        </a-card>
      </a-col>
    </a-row>
    <ImageViewer ref="imageViewer" :images="images" />
  </div>
</template>
  <script>
import UserVipCell from '@/components/User/UserVipCell'
import TimeLine from '@/components/TimeLine/timeLine'
import ImageViewer from '@/components/Image/ImageViewer'
import { getFundraisingProgressCheck, getFundraisingProgressData } from '@/api/fundraising'
export default {
  name: 'Index',
  components: { UserVipCell, TimeLine, ImageViewer },
  props: {},
  data() {
    return {
      value: 1,
      state: {
        steps: true,
      },
      imgUrl: [
        {
          url: require('@/assets/Fundraising/wait.png'),
        },
        {
          url: require('@/assets/Fundraising/finish.png'),
        },
        {
          url: require('@/assets/Fundraising/time.png'),
        },
      ],
      progressData: {},
      current: 1,
      fundraisingProgressItemAuthId: 0,
      refuseReason: '',
      images: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fundraisingProgressItemAuthId = this.$route.params.fundraisingProgressItemAuthId
    this.getData(this.fundraisingProgressItemAuthId)
  },
  mounted() {},
  methods: {
    getData(id) {
      getFundraisingProgressData(id).then((data) => {
        this.progressData = data.data
      })
    },
    goList() {
      const condition = this.$route.params.condition
      this.$router.push({ name: 'FundraisingProgressList', params: { condition } })
    },
    checkProgress(type, fundraisingProgressItemAuthId) {
      const refuseReason = this.refuseReason
      getFundraisingProgressCheck(fundraisingProgressItemAuthId, type, refuseReason)
        .then(() => {
          if (type === 1) {
            this.$message.success('审核通过')
            this.getData(this.fundraisingProgressItemAuthId)
          } else {
            this.$message.success('审核已驳回')
            this.getData(this.fundraisingProgressItemAuthId)
            this.refuseReason = ''
          }
        })
        .catch(() => {
          this.refuseReason = ''
        })
    },
    cancel() {
      this.refuseReason = ''
    },
    showImages(keys) {
      const images = []
      for (let i = 0; i < this.progressData.items[keys].images.length; i++) {
        images.push(this.progressData.items[keys].images[i].image)
      }
      this.images = images
      this.$refs.imageViewer.show()
    },
  },
}
</script>
 <style scoped  lang="less">
/deep/.ant-steps-item-tail {
  display: none !important;
}
</style>