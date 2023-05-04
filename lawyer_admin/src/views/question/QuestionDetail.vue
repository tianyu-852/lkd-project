<template>
  <div class="question-detail">
    <div class="question-detail-left">
      <a-card>
        <div class="question-detail-left-title clickable" @click="goList">← 基本信息</div>
        <div class="question-detail-left-user">
          <div class="margin-top-32 question-detail-left-user-left">
            <user-vip-cell
              size="md"
              :mobile="question.mobile"
              :avatar="question.avatar"
              :nickname="question.nickname"
              :is-bot="question.is_bot"
              @open="openUser"
            />
            <div class="question-detail-left-create">
              <span class="question-detail-left-create-title">发布时间：</span>
              <span class="question-detail-left-create-time">{{ question.created_at }}</span>
            </div>
          </div>

          <div class="question-detail-left-question">
            <div class="question-detail-left-question-data">
              <div
                v-for="(questionItem, index) in questionData"
                :key="questionItem.label"
                class="question-detail-left-question-data-item"
              >
                <div
                  class="question-detail-left-question-data-item-title"
                  :style="{ color: index === 2 ? '#FF524C' : '#787E8D' }"
                >
                  {{ questionItem.label }}
                </div>
                <div
                  class="question-detail-left-question-data-item-content"
                  :style="{ color: index === 2 ? '#FF524C' : '#222222' }"
                >
                  {{ questionItem.value }}
                </div>
              </div>
            </div>
            <div class="question-detail-left-question-bottom">
              <div class="question-detail-left-question-bottom-rank">
                <span>预计排名：</span>
                <span style="color: #ff524c">{{ question.rank }}</span>
              </div>

              <div class="question-detail-left-question-bottom-hot">
                <div class="question-detail-left-question-bottom-hot-div">
                  <input v-model.number="question.admin_hot_number" @blur="updateRank" />
                </div>
                <q-btn
                  color="primary"
                  size="sm"
                  @click="updateAdminHotNumber"
                  :loading="state.isUpdateHotNumberLoading"
                >
                  修改热度
                  <template #loading>
                    <q-spinner-hourglass class="on-left" />
                  </template>
                </q-btn>
              </div>
            </div>

            <div>
              <q-btn color="primary" size="sm" @click="goQuestionDetail" v-if="question.reward_status !== 0">
                查看悬赏问答
              </q-btn>

              <q-btn color="teal" size="sm" @click="state.isOpenUpgradeQuestionReward = true" v-else>
                升级悬赏问答
                <template #loading>
                  <q-spinner-hourglass class="on-left" />
                </template>
              </q-btn>
            </div>
          </div>
        </div>

        <div class="hr"></div>

        <div class="question-detail-left-bottom">
          <div class="question-detail-left-bottom-title">
            <span>标题：</span>
            <span class="question-detail-left-bottom-title-content">{{ question.title }}</span>
          </div>

          <div class="margin-top-32 question-detail-left-bottom-content">
            <p>帖子内容：</p>
            <div class="question-detail-left-bottom-content-div">
              <div class="question-detail-left-bottom-content-value">
                {{ question.content }}
              </div>
              <div class="hr" style="background: #d2d6de"></div>
              <div class="right">
                <a-button type="link" @click="openQuestion">回复</a-button>
              </div>
            </div>
          </div>

          <div
            class="question-detail-left-bottom-img"
            :style="question.question_images.length !== 0 || state.saveImageChange ? 'margin-top: 32px' : ''"
          >
            <a-button
              style="float: right"
              @click="saveImageChange"
              v-show="question.question_images.length !== 0 || state.saveImageChange"
            >
              保存修改
            </a-button>
            <p v-show="question.question_images.length !== 0 || state.saveImageChange">帖子图片：</p>
            <ImageViewer ref="imageViewer" :images="showImagesList" v-if="state.imageViewer" />
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center">
              <div
                v-for="(i, key) in question.question_images"
                :key="key"
                style="
                  width: 130px;
                  height: 100px;
                  margin: 5px;
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  justify-content: start;
                  position: relative;
                "
              >
                <img
                  :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                  style="
                    width: 14px;
                    height: 14px;
                    float: right;
                    position: absolute;
                    z-index: 2;
                    right: 5px;
                    top: 5px;
                    cursor: pointer;
                  "
                  @click="deleteF(key)"
                />
                <img style="background-color: #eff1f5; width: 130px; height: 100px; object-fit: contain" :src="i" />
                <div class="actionIcon">
                  <img :src="require('@/assets/common/image_preview.png')" @click="showImages" />
                  <img :src="require('@/assets/common/image_edit.png')" @click="openMosaic(i, key)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <div class="question-detail-right">
      <q-table
        style="height: 695px; margin-bottom: 16px"
        :data="data"
        :columns="columns"
        :loading="state.isTableLoading"
        row-key="name"
        :pagination="pagination"
        :hide-bottom="true"
        separator="cell"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="index" :props="props">
              {{ (pagination.current - 1) * 10 + props.rowIndex + 1 }}
            </q-td>
            <q-td key="user" :props="props">
              <user-vip-cell
                :nickname="props.row.nickname"
                :avatar="props.row.avatar"
                :mobile="props.row.mobile"
                :is-bot="props.row.is_bot"
                @open="openUser(String(props.row.user_id))"
              />
            </q-td>
            <q-td key="content" :props="props">
              <question-comment-cell
                :question-comment="props.row"
                @delete="getQuestionCommentPage(pagination.current)"
                @success="getQuestionCommentPage(pagination.current)"
                @conversion="getQuestionCommentPage(pagination.current)"
              />
            </q-td>
          </q-tr>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>

      <a-card>
        <div class="question-detail-right-page">
          <q-checkbox label="只看律师" v-model="isViewLawyer" />

          <q-pagination v-model="pagination.current" :max="pagination.last" :max-pages="5" :direction-links="true" />
        </div>
      </a-card>
    </div>

    <q-dialog v-model="state.questionDialog" persistent>
      <question-add-dialog
        title="回复"
        @close="state.questionDialog = false"
        @success="addQuestionSuccess"
        :question-id="$route.params.questionId"
        mode="comment"
      />
    </q-dialog>

    <q-dialog v-model="state.isOpenUpgradeQuestionReward" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">请输入悬赏金额</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model.number="questionReward" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup />
          <q-btn flat label="确认" @click="upgradeQuestionReward" :loading="state.isLoadingQuestionReward">
            <template #loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" @close="state.userDialog = false" />
    </q-dialog>
    <a-modal
      v-model="state.mosaicDialog"
      title="编辑图片"
      ok-text="保存"
      cancel-text="取消"
      @ok="saveImage"
      @cancel="cancelImage"
      width="900px"
    >
      <p>鼠标点击添加马赛克</p>
      <ImageMosaic :imgSrc="mosaicImage" ref="ImageMosaic" @save="save" />
    </a-modal>
  </div>
</template>

<script>
import ImageViewer from '@/components/Image/ImageViewer'
import UserCell from '@/components/User/UserCell'
import UserVipCell from '@/components/User/UserVipCell'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import ImageMosaic from '@/components/Image/ImageMosaic.vue'
import {
  getQuestionCommentPage,
  getQuestionDetail,
  getQuestionHotNumbers,
  updateQuestionHotNumber,
  upgradeQuestionReward,
  putQuestionImages,
} from '@/api/question'
import QuestionCommentCell from '@/components/Question/QuestionCommentCell'
import QuestionAddDialog from '@/components/Question/QuestionAddDialog'

export default {
  name: 'QuestionDetail',
  components: {
    QuestionAddDialog,
    QuestionCommentCell,
    UserCell,
    UserVipCell,
    ImageViewer,
    UserDetailDialog,
    ImageMosaic,
  },
  computed: {
    questionData() {
      return [
        {
          label: '用户操作',
          value: this.question.hot_number,
        },
        {
          label: '后台操作',
          value: this.question.admin_hot_number,
        },
        {
          label: '总热度',
          value: this.question.hot_number + this.question.admin_hot_number,
        },
      ]
    },
  },
  watch: {
    isViewLawyer() {
      this.getQuestionCommentPage(1)
    },
    'pagination.current': {
      handler(page) {
        this.getQuestionCommentPage(page)
      },
    },
  },
  data() {
    return {
      columns: [
        { name: 'index', label: '层序', align: 'center' },
        { name: 'user', align: 'center', label: '用户/律师' },
        { name: 'content', label: '回复' },
      ],
      data: [],
      showImagesList: [],
      question: {
        avatar: '',
        nickname: '',
        mobile: '',
        created_at: '',
        hot_number: 0,
        admin_hot_number: 0,
        title: '',
        content: '',
        question_images: [],
        rank: 0,
        reward_status: 0,
        reward: '0',
      },
      isViewLawyer: false,
      pagination: {
        current: 1,
        last: 1,
        rowsPerPage: 15,
      },
      questionReward: 0,
      questionHotNumbers: [],
      state: {
        isTableLoading: false,
        isUpdateHotNumberLoading: false,
        questionDialog: false,
        isOpenUpgradeQuestionReward: false,
        isLoadingQuestionReward: false,
        userDialog: false,
        mosaicDialog: false,
        imageViewer: true,
        saveImageChange: false,
      },
      currentUserId: 0,
      mosaicImage: '',
      mosaicImageKey: -1,
    }
  },
  created() {
    Promise.all([this.getQuestionCommentPage(1), this.getQuestionDetail(), this.getQuestionHotNumbers()]).then(() => {
      this.question.rank = this.getRank(this.question.hot_number + this.question.admin_hot_number)
    })
  },
  methods: {
    openUser(userId) {
      if (userId) {
        this.currentUserId = userId
      } else {
        this.currentUserId = JSON.parse(sessionStorage.getItem('user_id'))
      }
      this.state.userDialog = true
    },
    openQuestion() {
      this.state.questionDialog = true
    },
    goList() {
      const condition = this.$route.params.condition
      if (condition) {
        this.$router.push({ name: 'QuestionPage', params: { condition } })
      } else {
        this.$router.back(-1)
      }
    },
    getQuestionDetail() {
      return getQuestionDetail(this.$route.params.questionId).then(({ data }) => {
        data.rank = 0
        this.question = data
      })
    },
    getQuestionCommentPage(page) {
      this.state.isTableLoading = true
      return getQuestionCommentPage(this.$route.params.questionId, page, this.isViewLawyer ? 1 : 0)
        .then(({ data }) => {
          this.pagination.last = data.last
          this.data = data.data
        })
        .finally(() => {
          this.state.isTableLoading = false
        })
    },
    getRank(hotNumber) {
      const index = this.questionHotNumbers.findIndex((questionHotNumber) => {
        return hotNumber >= questionHotNumber
      })

      return index === -1 ? this.questionHotNumbers.length + 1 : index + 1
    },
    updateRank() {
      this.question.rank = this.getRank(this.question.hot_number + this.question.admin_hot_number)
    },
    updateAdminHotNumber() {
      this.state.isUpdateHotNumberLoading = true
      updateQuestionHotNumber(this.$route.params.questionId, this.question.admin_hot_number)
        .then(() => {
          this.$message.success('修改后台热度成功')
        })
        .finally(() => {
          this.state.isUpdateHotNumberLoading = false
        })
    },
    getQuestionHotNumbers() {
      return getQuestionHotNumbers().then(({ data }) => {
        this.questionHotNumbers = data
      })
    },
    addQuestionSuccess() {
      this.getQuestionCommentPage(1)
      this.state.questionDialog = false
    },
    goQuestionDetail() {
      this.$router.push({
        name: 'QuestionRewardDetail',
        params: { questionId: this.$route.params.questionId },
      })
    },
    upgradeQuestionReward() {
      this.state.isLoadingQuestionReward = true
      upgradeQuestionReward(this.$route.params.questionId, this.questionReward)
        .then(() => {
          this.state.isOpenUpgradeQuestionReward = false
          this.goQuestionDetail()
        })
        .finally(() => {
          this.state.isLoadingQuestionReward = false
        })
    },
    showImages() {
      this.showImagesList = this.question.question_images
      this.$refs.imageViewer.show()
    },
    deleteF(e) {
      this.question.question_images.splice(e, 1)
      this.showImagesList = this.question.question_images
      if (e === 0) {
        this.state.saveImageChange = true
      }
    },
    openMosaic(value, key) {
      this.state.mosaicDialog = true
      this.mosaicImage = value
      this.mosaicImageKey = key
    },
    cancelImage() {
      this.mosaicImage = ''
      this.mosaicImageKey = -1
      this.state.mosaicDialog = false
      this.showImagesList = this.question.question_images
    },
    saveImage() {
      this.$refs.ImageMosaic.saveImage()
      this.state.mosaicDialog = false
    },
    save(data) {
      this.question.question_images[this.mosaicImageKey] = data
      this.showImagesList = this.question.question_images
      this.$message.success('修改成功')
    },
    saveImageChange() {
      putQuestionImages(this.$route.params.questionId, JSON.stringify(this.showImagesList)).then(() => {
        this.$message.success('修改成功')
        this.getQuestionDetail()
        this.state.saveImageChange = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.question-detail {
  display: flex;

  &-left {
    width: 50%;
    margin-right: 16px;

    &-bottom {
      margin-top: 32px;
      &-img {
        height: auto;
        // min-height: 140px;
        // margin-top: 32px;
        &-item {
          margin-right: 16px;
          border-radius: 4px;
        }
      }

      &-content {
        margin-top: 32px;

        p {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #222222;
          opacity: 1;
        }

        &-value {
          height: auto;
          min-height: 200px;
        }

        &-div {
          padding: 20px 23px;
          width: 100%;
          height: auto;
          min-height: 300px;
          background: #eff1f5;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          font-family: PingFang SC;
          color: #787e8d;
        }
      }

      &-title {
        font-size: 18px;
        font-family: PingFang SC;
        color: #222222;
        font-weight: bold;

        &:first-child {
          color: #222222;
        }

        &-content {
          color: #787e8d;
        }
      }
    }

    &-title {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 800;
      line-height: 30px;
      color: #222222;
    }

    &-question {
      width: 50%;

      &-bottom {
        display: flex;
        margin-top: 20px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;

        &-hot {
          display: flex;
          align-items: center;

          &-div {
            width: 80px;
            height: 26px;
            border-radius: 4px;
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: bold;
            line-height: 25px;
            text-align: center;
            opacity: 1;

            input {
              width: 100%;
              height: 26px;
              background: #f2f4f8;
              color: #787e8d;
              border: none;
              text-align: center;

              &:focus {
                outline: none;
              }
            }
          }
        }

        &-rank {
          font-size: 15px;
          font-family: PingFang SC;
          font-weight: bold;
          line-height: 25px;
          color: #222222;
          opacity: 1;
        }
      }

      &-data {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 33.33%);

        &-item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          &-title {
            width: 72px;
            height: 25px;
            font-size: 18px;
            font-family: PingFang SC;
            font-weight: 500;
            line-height: 25px;
            color: #787e8d;
            opacity: 1;
            text-align: center;
          }

          &-content {
            width: 48px;
            height: 56px;
            font-size: 40px;
            font-family: PingFang SC;
            font-weight: 800;
            line-height: 56px;
            color: #222222;
            opacity: 1;
            text-align: center;
          }
        }
      }
    }

    &-user {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;

      &-left {
        width: 50%;
      }
    }

    &-create {
      margin-top: 35px;

      &-title {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #222222;
      }

      &-time {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #787e8d;
      }
    }
  }

  &-right {
    width: 50%;

    &-page {
      display: flex;
      justify-content: space-between;
    }
  }
}
.actionIcon {
  width: 130px;
  height: 40px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.9;
  position: absolute;
  z-index: 999;
  color: #fff;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  img {
    width: 20px;
    height: 20px;
    z-index: 4;
    cursor: pointer;
    object-fit: contain;
  }
}
</style>
