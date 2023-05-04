<template>
  <div>
    <a-row :gutter="[16, 16]">
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
          <a-divider />
          <a-col :span="24">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-direction: row">
              <user-vip-cell
                :nickname="progressData.user.litigant.nickname"
                :avatar="progressData.user.litigant.avatar"
                :mobile="progressData.user.litigant.mobile"
                size="big"
              />
              <a style="margin-right: 20px" v-show="!state.userDetails" @click="state.userDetails = true">
                展开全部内容
                <img :src="require('@/assets/Fundraising/open_icon_sel.png')" style="width: 11px; height: 6px" />
              </a>
              <a style="margin-right: 20px" v-show="state.userDetails" @click="state.userDetails = false">
                收起全部内容
                <img :src="require('@/assets/Fundraising/close_icon_sel.png')" style="width: 11px; height: 6px" />
              </a>
            </div>
            <div v-show="state.userDetails" style="padding: 10px">
              <a-divider />
              <p class="labelh6">求助人信息</p>
              <div style="margin: 24px 0">
                <label>求助人标题:</label>
                <div
                  type="textarea"
                  style="
                    background-color: #eff1f5;
                    width: 100%;
                    height: 60px;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    align-items: center;
                    justify-content: space-around;
                    margin-top: 8px;
                  "
                >
                  <p style="margin: 0; font-size: 16px">{{ progressData.user.title }}</p>
                </div>
              </div>
              <div style="margin: 24px 0">
                <label>封面图片：</label>
                <div>
                  <img
                    @click="openModal(progressData.user.cover_image, 1)"
                    :src="progressData.user.cover_image"
                    style="width: 220px; height: 110px; margin-top: 8px; cursor: pointer"
                  />
                </div>
              </div>
              <div style="margin: 24px 0">
                <label>诉求说明:</label>
                <div
                  type="textarea"
                  style="
                    background-color: #eff1f5;
                    width: 100%;
                    height: auto;
                    max-height: 500px;
                    overflow: auto;
                    padding: 20px;
                    margin-top: 8px;
                  "
                >
                  <p style="margin: 0; font-size: 16px">{{ progressData.user.appeal }}</p>
                </div>
              </div>
              <div style="margin: 24px 0">
                <label>求助详情说明:</label>
                <div
                  type="textarea"
                  style="
                    background-color: #eff1f5;
                    width: 100%;
                    height: auto;
                    max-height: 500px;
                    overflow: auto;
                    padding: 20px;
                    margin-top: 8px;
                  "
                >
                  <p style="margin: 0; font-size: 16px">{{ progressData.user.content }}</p>
                </div>
              </div>
              <a-divider />
              <p class="labelh6">案件信息</p>
              <div
                style="
                  display: flex;
                  flex-wrap: wrap;
                  flex-direction: row;
                  align-items: center;
                  justify-content: flex-start;
                "
              >
                <div style="margin: 9px 24px; width: 300px">
                  <span class="titleClass">审理阶段：</span>
                  {{ progressData.user.case.trial_stage ? progressData.user.case.trial_stage : '待上传审理阶段' }}
                </div>
                <div style="margin: 9px 24px; width: 400px">
                  <span class="titleClass">案件所在城市：</span>
                  {{
                    progressData.user.case.city === progressData.user.case.province
                      ? progressData.user.case.city
                      : progressData.user.case.province + '-' + progressData.user.case.city
                  }}
                </div>

                <div style="margin: 9px 24px; width: 300px">
                  <span class="titleClass">委托当事人:</span>
                  {{ progressData.user.case.litigant_role === 1 ? '被告' : '原告' }}
                </div>
                <div style="margin: 9px 24px; width: 300px">
                  <span class="titleClass">身份证号码:</span>
                  {{ progressData.user.litigant.id_card ? progressData.user.litigant.id_card : '待上传' }}
                </div>
                <div
                  style="margin: 9px 24px; width: 300px"
                  v-for="(i, key) in progressData.user.case.other_side_nicknames"
                  :key="key"
                >
                  <span class="titleClass">
                    {{ progressData.user.case.litigant_role === 0 ? '被告' : '原告' }}信息:</span
                  >
                  {{ i }}
                </div>
              </div>
              <a-divider />
              <p class="labelh6">视频与图片资料</p>

              <p class="titleClass">视频：</p>
              <div style="height: auto; display: flex; flex-direction: row; align-items: center">
                <div v-for="i in progressData.user.videos" :key="i + 'z'">
                  <div
                    style="position: relative; width: 100px; height: 100px; margin: 5px; background: rgba(0, 0, 0, 0.3)"
                  >
                    <img :src="i.cover" style="width: 100px; height: 100px; object-fit: contain" />
                    <img
                      class="imagesSpan"
                      style="float: right; position: absolute; z-index: 3; right: 0px; top: 0px"
                    />
                    <img
                      :src="require('@/assets/Fundraising/video3083.png')"
                      style="
                        width: 30px;
                        height: 30px;
                        float: right;
                        position: absolute;
                        z-index: 4;
                        right: 35px;
                        top: 35px;
                        cursor: pointer;
                      "
                      @click="changeVideo(i)"
                    />
                  </div>
                </div>
              </div>
              <p class="titleClass">图片：</p>
              <div style="height: auto">
                <img
                  :src="i"
                  v-for="i in progressData.user.images"
                  :key="i"
                  style="
                    width: 100px;
                    height: 100px;
                    margin: 5px;
                    object-fit: contain;
                    background-color: #eff1f5;
                    cursor: pointer;
                  "
                  @click="openModal(progressData.user.images, 0)"
                />
              </div>
            </div>
          </a-col>
        </a-card>
        <a-card style="margin-top: 16px">
          <a-col :span="24">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-direction: row">
              <user-vip-cell
                :nickname="progressData.lawyer.lawyer.nickname"
                :avatar="progressData.lawyer.lawyer.avatar"
                :mobile="progressData.lawyer.lawyer.mobile"
                size="big"
              />
              <a
                style="margin-right: 20px"
                v-show="!state.lawyerDetails"
                @click="state.lawyerDetails = !state.lawyerDetails"
              >
                展开全部内容
                <img :src="require('@/assets/Fundraising/open_icon_sel.png')" style="width: 11px; height: 6px" />
              </a>
              <a
                style="margin-right: 20px"
                v-show="state.lawyerDetails"
                @click="state.lawyerDetails = !state.lawyerDetails"
              >
                收起全部内容
                <img :src="require('@/assets/Fundraising/close_icon_sel.png')" style="width: 11px; height: 6px" />
              </a>
            </div>
            <div v-show="state.lawyerDetails">
              <a-divider />

              <div style="padding: 0 12px">
                <label class="labelh6"><b>律师委托说明</b></label>
              </div>
              <div>
                <div
                  style="
                    margin: 24px 0;
                    padding: 0 12px;
                    display: flex;
                    align-items: center;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                  "
                >
                  <div style="margin: 9px 24px 9px 0; width: 300px">
                    <label>律师名字:</label>
                    <span>
                      {{ progressData.lawyer.lawyer.nickname }} |
                      {{
                        progressData.lawyer.lawyer.work_year
                          ? '从业' + progressData.lawyer.lawyer.work_year + '年'
                          : '暂未填写从业年份'
                      }}
                      <img
                        :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')"
                        style="width: 16px; height: 16px"
                      />
                    </span>
                  </div>
                  <div style="margin: 9px 24px; width: 300px">
                    <label>所在律所:</label>
                    {{ progressData.lawyer.lawyer.lawyer_office ? progressData.lawyer.lawyer.lawyer_office : '待上传' }}
                  </div>
                  <div style="margin: 9px 24px; width: 300px">
                    <label>执业证号:</label>
                    {{
                      progressData.lawyer.lawyer.license_number ? progressData.lawyer.lawyer.license_number : '待上传'
                    }}
                  </div>
                </div>
                <div style="padding: 0 12px">
                  <label>律师简介:</label>
                  <div
                    style="
                      width: 100%;
                      height: 180px;
                      max-height: 500px;
                      border: 0px;
                      background-color: #eff1f5;
                      padding: 15px;
                      overflow: overlay;
                      margin-top: 8px;
                    "
                  >
                    <p>
                      {{ progressData.lawyer.lawyer.introduction }}
                    </p>
                  </div>
                </div>
                <div style="margin: 24px 0; padding: 0 12px">
                  <label>律师荣誉证书:</label>
                  <div
                    style="
                      width: 100%;
                      height: auto;
                      padding: 5px;
                      display: flex;
                      flex-direction: row;
                      align-content: center;
                      justify-content: start;
                      flex-wrap: wrap;
                      margin-top: 8px;
                      cursor: pointer;
                    "
                  >
                    <div
                      v-for="(i, key) in progressData.lawyer.lawyer.honor_certificates"
                      :key="key + i"
                      style="
                        width: 250px;
                        height: 150px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                      "
                    >
                      <img
                        :src="i.image"
                        style="
                          width: 240px;
                          height: 120px;
                          background-color: #eff1f5;
                          margin: 0 5px;
                          object-fit: contain;
                        "
                        @click="openModal(progressData.lawyer.lawyer.honor_certificates, 0)"
                      />
                      <label>{{ i.title }}</label>
                    </div>
                  </div>
                </div>
                <div style="margin: 24px 0; padding: 0 12px">
                  <label>法律服务委托书:</label>
                  <div
                    style="
                      width: 100%;
                      height: auto;
                      padding: 5px;
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      flex-wrap: wrap;
                      margin-top: 8px;
                    "
                  >
                    <div
                      v-for="(i, key) in progressData.lawyer.lawyer.trust_agreement_images"
                      :key="key + i"
                      style="width: 120px; height: auto; display: flex; flex-direction: column; align-items: center"
                    >
                      <img
                        :src="i"
                        style="
                          width: 110px;
                          height: 110px;
                          display: flex;
                          align-items: center;
                          background-color: #eff1f5;
                          margin: 0 5px;
                          object-fit: contain;
                        "
                        @click="openModal(progressData.lawyer.lawyer.trust_agreement_images, 0)"
                      />
                      <div style="width: 80px; word-break: break-all; height: auto">
                        <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="margin: 24px 0; padding: 0 12px">
                  <label>授权委托书:</label>
                  <div
                    style="
                      width: 100%;
                      height: auto;
                      padding: 5px;
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      flex-wrap: wrap;
                      margin-top: 8px;
                    "
                  >
                    <div
                      v-for="(i, key) in progressData.lawyer.lawyer.power_of_attorney_images"
                      :key="key * 3"
                      style="width: 120px; height: auto; display: flex; align-items: center; flex-direction: column"
                    >
                      <img
                        :src="i"
                        style="
                          width: 110px;
                          height: 110px;
                          background-color: #eff1f5;
                          margin: 0 5px;
                          object-fit: contain;
                        "
                        @click="openModal(progressData.lawyer.lawyer.power_of_attorney_images, 0)"
                      />
                      <div style="width: 80px; word-break: break-all; height: auto">
                        <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a-divider />
              <div style="margin: 24px 0; padding: 0 12px">
                <label class="labelh6"><b>委托事务所说明</b></label>
              </div>
              <div
                style="
                  margin: 24px 0;
                  padding: 0 12px;
                  display: flex;
                  flex-direction: row;
                  flex-wrap: nowrap;
                  justify-content: flex-start;
                  align-items: center;
                "
              >
                <div style="width: 500px">
                  <label>事务所名称:</label>
                  <span
                    v-if="
                      progressData.lawyer.lawyer_office.lawyer_office === '' ||
                      progressData.lawyer.lawyer_office.lawyer_office === null
                    "
                  >
                    待上传
                  </span>
                  <span v-else>
                    {{ progressData.lawyer.lawyer_office.lawyer_office }}
                    <!-- |
                  <span style="color: #3980ea">
                    {{ progressData.lawyer.lawyer_office.address ? progressData.lawyer.lawyer_office.address : '未添加网址' }}
                  </span> -->
                  </span>
                </div>
                <div style="width: 400px; margin-left: 64px">
                  <label>地址:</label>
                  {{ progressData.lawyer.lawyer_office.address ? progressData.lawyer.lawyer_office.address : '待上传' }}
                </div>
              </div>
              <div style="margin: 24px 0; padding: 0 12px">
                <label>律师事务所执业许可证</label>
                <div
                  style="
                    width: 100%;
                    height: auto;
                    padding: 5px;
                    display: flex;
                    flex-direction: row;
                    align-content: center;
                    justify-content: start;
                  "
                >
                  <div
                    style="
                      width: 250px;
                      height: 150px;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <img
                      v-if="progressData.lawyer.lawyer_office.practice_license"
                      :src="progressData.lawyer.lawyer_office.practice_license"
                      @click="openModal(progressData.lawyer.lawyer_office.practice_license, 1)"
                      style="
                        width: 240px;
                        height: 120px;
                        background-color: #eff1f5;
                        margin: 0 5px;
                        object-fit: contain;
                        cursor: pointer;
                      "
                    />
                    <!-- <label>xxxx荣耀证书</label> -->
                  </div>
                </div>
              </div>
              <div style="margin: 24px 0; padding: 0 12px">
                <label>律所简介:</label>
                <div
                  style="
                    width: 100%;
                    height: 180px;
                    border: 0px;
                    background-color: #eff1f5;
                    padding: 15px;
                    overflow: overlay;
                    margin-top: 8px;
                  "
                >
                  <p>
                    {{ progressData.lawyer.lawyer_office.introduction }}
                  </p>
                </div>
              </div>
              <div style="margin: 24px 0; padding: 0 12px">
                <label>律所荣耀：</label>
                <div
                  style="
                    width: 100%;
                    height: auto;
                    padding: 5px;
                    display: flex;
                    flex-direction: row;
                    align-content: center;
                    justify-content: start;
                    flex-wrap: wrap;
                    margin-top: 8px;
                  "
                >
                  <div
                    v-for="(i, key) in progressData.lawyer.lawyer_office.honor_certificates"
                    :key="key * 3"
                    style="
                      width: 250px;
                      height: 150px;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <img
                      :src="i.image"
                      style="
                        width: 240px;
                        height: 120px;
                        background-color: #eff1f5;
                        margin: 0 5px;
                        object-fit: contain;
                        cursor: pointer;
                      "
                      @click="openModal1(progressData.lawyer.lawyer_office.honor_certificates)"
                    />
                    <label>{{ i.title }}</label>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-card-grid style="width: 100%" :hoverable="false">
            <h6>项目进度</h6>
            <a-radio-group v-model="value" @change="getFundraisingProgressData(value)" style="width: 100%">
              <a-radio :value="1"> 正序 </a-radio>
              <a-radio :value="0"> 倒序 </a-radio>
            </a-radio-group>
            <div>
              <div v-for="(item, keys) in caseList.items" :key="keys" style="margin: 10px">
                <div>
                  <li>
                    <img
                      :src="
                        item.is_auth === 0
                          ? require('@/assets/Fundraising/wait.png')
                          : require('@/assets/Fundraising/finish.png')
                      "
                      style="height: 20px; width: 20px"
                    />
                    <b> {{ item.fundraising_progress }}</b> <span style="color: #787e8d"> {{ item.created_at }}</span>
                  </li>

                  <img
                    v-for="(i, key) in item.images"
                    :key="key"
                    :src="i.image"
                    style="width: 240px; height: 120px; background-color: #c2ccdc; margin: 5px"
                    @click="showImages(item)"
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

          <a-button
            v-if="caseList.is_apply_end === 1"
            style="
              left: calc(50% - 200px);
              margin: 10px;
              color: #ffffff;
              background-color: #2cbf78;
              width: 400px;
              border-color: #2cbf78;
            "
            @click="postFundraisingClose"
          >
            同意结案
          </a-button>
        </a-card>
      </a-col>
    </a-row>
    <ImageViewer ref="imageViewer" :images="images" />
    <a-modal
      v-model="state.testLoading"
      title="预览视频"
      ok-text="确认"
      cancel-text="取消"
      @ok="state.testLoading = false"
    >
      <!-- 视频预览,视频文件拓展名AVI、mov、rmvb、rm、FLV、mp4、3GP -->
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        @pause="pausePlay($event)"
        :options="playerOptions"
      />
    </a-modal>
  </div>
</template>
  <script>
import UserVipCell from '@/components/User/UserVipCell'
import TimeLine from '@/components/TimeLine/timeLine'
import ImageViewer from '@/components/Image/ImageViewer'
import {
  getFundraisingProgressCheck,
  getFundraisingStatus,
  getFundraisingDetailData,
  getFundraisingProgressData,
  getFundraisingLawyersData,
  postFundraisingClose,
} from '@/api/fundraising'
export default {
  name: 'Index',
  components: { UserVipCell, TimeLine, ImageViewer },
  props: {},
  data() {
    return {
      value: 1,
      state: {
        steps: true,
        userDetails: false,
        lawyerDetails: false,
        testLoading: false,
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
      progressData: {
        user: {
          litigant: {
            nickname: '当事人昵称',
            avatar:
              'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/bot/07ac7cd13fd0eb1654ccdbd222b81437.jpg',
            mobile: '18958904365',
            is_auth: 0,
            id_card: '33030319970101031x',
          },
          admin: {
            nickname: '王尼玛',
            alias: '别名啊',
          },
          target_money: '5000',
          fundraise_money: '5000',
          cover_image: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png',
          title: '测试',
          content: '测试内容',
          images: ['https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png'],
          videos: ['https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/app_logo.png'],
          case: {
            litigant_role: 0,
            is_show_defendant: 1,
            other_side_type: '个人',
            other_side_nicknames: ['第一被告人'],
            trial_stage: '一审',
            province: '河南省',
            city: '洛阳市',
            province_id: 1,
            city_id: 2,
          },
        },
        lawyer: {
          lawyer: {
            nickname: '律师名称那',
            avatar:
              'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/avatars/bot/07ac7cd13fd0eb1654ccdbd222b81437.jpg',
            mobile: '18958904365',
            lawyer_grade_chinese: '',
            is_auth: 1,
            lawyer_office: '所在律所',
            license_number: '执业证号',
            introduction: '律师简介',
            honor_certificates: [
              {
                title: '+563123',
                image: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/banners/1.png',
              },
            ],
            trust_agreement_images: [
              'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/banners/fundraising_banner.png',
            ],
            power_of_attorney_images: [
              'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/banners/fundraising_banner.png',
            ],
          },
          lawyer_office: {
            lawyer_office: '事务所名称',
            address: '地址啊',
            practice_license: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/banners/fundraising_banner.png',
            introduction: '事务所简介',
            honor_certificates: [
              {
                title: '12312',
                image: 'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/banners/1.png',
              },
            ],
          },
        },
      },
      current: 1,
      fundraisingProgressItemAuthId: 0,
      refuseReason: '',
      images: [],
      caseList: [
        {
          is_auth: 1,
          fundraising_progress_item_auth_id: 19,
          fundraising_progress: '测试啊111',
          created_at: '2020年10月02日 18:09',
          timestamp: 1601633361,
          images: [
            {
              title: '',
              image:
                'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2021-05-09/4700de56de0fc41df440c20aa79678f3.jpg',
            },
          ],
        },
        {
          is_auth: 0,
          fundraising_progress_item_auth_id: 19,
          fundraising_progress: '测试啊111',
          created_at: '2020年10月02日 18:09',
          timestamp: 1601633361,
          images: [
            {
              title: '',
              image:
                'https://lvkuaidaimages.oss-cn-hangzhou.aliyuncs.com/temp/2021-05-09/4700de56de0fc41df440c20aa79678f3.jpg',
            },
          ],
        },
      ],
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        autoplay: false,
        muted: false,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [
          {
            // 类型
            type: 'video/mp4',
            // url地址
            src: '',
          },
        ],
        poster: '',
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true,
        },
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fundraisingProgressId = Number(this.$route.params.fundraisingProgressId)
    this.getFundraisingStatus(this.fundraisingProgressId)
  },
  mounted() {},
  methods: {
    getFundraisingStatus(fundraisingProgressId) {
      // 单数据展开
      getFundraisingStatus(fundraisingProgressId).then((data) => {
        this.fundraisingRegistrationId = data.data.fundraising_registration_id
        this.current = data.data.status / 5 - 1
        this.fundraisingId = data.data.fundraising_id
        console.log(data.data.fundraising_lawyer_id)
        this.getFundraisingDetailData(this.fundraisingId)
        this.getFundraisingLawyersData(data.data.fundraising_lawyer_id)
        this.getFundraisingProgressData(1)
      })
    },
    getFundraisingDetailData(id) {
      getFundraisingDetailData(id).then((data) => {
        this.progressData.user = data.data
      })
    },
    getFundraisingLawyersData(id) {
      getFundraisingLawyersData(id).then((data) => {
        this.progressData.lawyer = data.data
      })
    },
    getFundraisingProgressData(sort) {
      getFundraisingProgressData(this.fundraisingId, sort).then((data) => {
        this.caseList = data.data
        console.log(this.caseList)
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
    postFundraisingClose() {
      postFundraisingClose(this.fundraisingId, 0).then(() => {
        this.$message.success('已结案')
      })
    },
    showImages(item) {
      console.log(item)
      const images = []
      for (let i = 0; i < item.images.length; i++) {
        images.push(item.images[i].image)
      }
      this.images = images
      this.$refs.imageViewer.show()
    },
    openModal(value, type) {
      if (type === 1) {
        this.images = []
        this.images.push(value)
      } else {
        this.images = value
      }
      this.$refs['imageViewer'].show()
    },
    openModal1(value) {
      console.log(value)
      const images = []
      for (let i = 0; i < value.length; i++) {
        images.push(value[i].image)
      }
      this.images = images
      this.$refs.imageViewer.show()
    },
    changeVideo(value) {
      this.playerOptions.sources[0].src = value.video
      this.state.testLoading = true
    },
    pausePlay(player) {
      // 关闭弹窗-停止播放
      this.player.pause()
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      // 设置视频src
      if (this.$refs.videoPlayer === undefined) {
        this.playerOptions.sources[0] = {
          type: 'video/mp4',
          src: row.video,
        }
      } else {
        // 防止页面重复打开会播放同一个视频||暂时替代方案
        const palyer = this.$refs.videoPlayer.player
        palyer.src(row.video)
      }
    },
  },
}
</script>
 <style scoped  lang="less">
/deep/.ant-steps-item-tail {
  display: none !important;
}
.labelh6 {
  margin: 20px 0;
  font-size: 22px;
  font-family: PingFang SC;
  font-weight: 800;
  line-height: 30px;
  color: #222222;
  opacity: 1;
}
.titleClass {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 25px;
  color: #222222;
  opacity: 1;
  margin: 8px 0;
}
label {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 25px;
  color: #222222;
  opacity: 1;
}
</style>