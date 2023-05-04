<template>
  <div>
    <a-spin :tip="state.loadingText" size="large" :spinning="state.isAuthLoading">
      <a-card class="top">
        <div class="top-title">
          <span class="icon-back" style="cursor: pointer; padding-right: 10px;" @click="$router.back(-1)">←</span>
          <span>律师基本信息</span>
        </div>

        <div class="top-info" v-for="(row, key) in topInfo" :key="key">
          <div v-for="item in row" :key="item.title" class="top-info-item">
            <div v-if="item.type === 'text'" class="flex-center">
              <span>{{ item.title }}：</span>
              <span v-if="auth.apply_times === 1">
                {{ item.value }}
              </span>
              <span v-else-if="item.title === '律师姓名' || item.title === '手机号码' || item.title === '最近登录时间'">
                {{ item.value }}
              </span>
              <span
                v-else-if="
                  item.value === auth.before.lawyer_grade_chinese ||
                    item.value === auth.before.company_name ||
                    item.value === auth.before.is_need_change ||
                    item.value === auth.before.issue_date ||
                    item.value === auth.before.lawyer_tags ||
                    item.value === auth.before.school_name ||
                    item.value === `${auth.before.school_start_time}年-${auth.before.school_end_time}年` ||
                    item.value === auth.before.service_area ||
                    item.value === auth.before.valid_date
                "
              >
                {{ item.value }}
              </span>
              <span v-else>
                <a-tooltip>
                  <template slot="title">
                    <span>修改前内容：</span>
                    <span v-if="item.field === 'lawyer_grade_chinese'">{{ auth.before.lawyer_grade_chinese }} </span>
                    <span v-else-if="item.field === 'company_name'">{{ auth.before.company_name }} </span>
                    <span v-else-if="item.field === 'is_need_change'">{{ auth.before.is_need_change }} </span>
                    <span v-else-if="item.field === 'issue_date'">{{ auth.before.issue_date }} </span>
                    <span v-else-if="item.field === 'lawyer_tags'">{{ auth.before.lawyer_tags }} </span>
                    <span v-else-if="item.field === 'school_name'">
                      {{ auth.before.school_name ? auth.before.school_name : '未填写' }}
                    </span>
                    <span v-else-if="item.field === 'school_time'">
                      {{
                        auth.before.school_start_time || auth.before.school_end_time
                          ? `${auth.before.school_start_time}年-${auth.before.school_end_time}年`
                          : '未填写'
                      }}
                    </span>
                    <span v-else-if="item.field === 'service_area'">{{ auth.before.service_area }} </span>
                    <span v-else-if="item.field === 'valid_date'">{{ auth.before.valid_date }} </span>
                  </template>

                  <span style="color: #ff524c"> {{ item.value }}</span>
                </a-tooltip>
              </span>
            </div>
            <div v-if="item.type === 'textarea'" class="flex-center">
              <span>{{ item.title }}：</span>
              <a-textarea v-model="auth[item.field]"> </a-textarea>
            </div>
            <div v-if="item.type === 'date'" class="flex-center">
              <span>{{ item.title }}：</span>
              <SingleDate v-model="auth[item.field]" />
            </div>
          </div>

          <!-- 律所地址 -->
          <!-- <div class="top-info-item">
            <div class="flex-center">
              <span>律所地址：</span>
              <span>律所地址</span>
            </div>
          </div> -->
        </div>
        
        <div class="top-introduction">
          <span v-if="auth.apply_times === 1">
            {{ auth.introduction ? auth.introduction.substr(0, 150) + (isShowDetail ? '...' : '') : '未上传简介' }}
          </span>
          <span v-else-if="auth.introduction === auth.before.introduction">
            {{ auth.introduction ? auth.introduction.substr(0, 150) + (isShowDetail ? '...' : '') : '未上传简介' }}
          </span>
          <span v-else style="color: #ff524c">
            <a-tooltip>
              <template slot="title"> <span>修改前内容：</span> {{ auth.before.introduction }} </template>
              {{ auth.introduction ? auth.introduction.substr(0, 150) + (isShowDetail ? '...' : '') : '' }}
            </a-tooltip>
          </span>
          <a-button
            type="link"
            size="small"
            v-if="isShowDetail && auth.introduction"
            @click="state.introductionVisible = true"
          >
            查看详情
          </a-button>
          <a-modal v-model="state.introductionVisible" title="律师简介" @ok="state.introductionVisible = false">
            <p>{{ auth.introduction }}</p>
          </a-modal>
        </div>
      </a-card>
      <div class="content">
        <a-card :bordered="false" style="width: 50%; margin-right: 16px">
          <template #title>
            <span class="title">律师资料图片</span>
          </template>
          <a-card-grid class="bottom-left-title"> 一寸免冠照 </a-card-grid>
          <a-card-grid class="bottom-left-image" :hoverable="false">
            <q-img
              v-if="auth.avatar_image === auth.before.avatar_image || auth.apply_times === 1"
              @click="openLawyerCheck(auth.avatar_image, 'avatar_image')"
              :src="auth.avatar_image"
              class="bottom-left-image-small clickable"
            >
              <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
            </q-img>
            <a-popover title="修改前的图片" trigger="hover" v-else>
              <template slot="content">
                <img :src="auth.before.avatar_image" style="height: 200px; width: 200px" />
              </template>
              <q-img
                @click="openLawyerCheck(auth.avatar_image, 'avatar_image')"
                :src="auth.avatar_image"
                class="bottom-left-image-small clickable"
                :style="redBorder"
              >
                <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
              </q-img>
            </a-popover>
          </a-card-grid>
          <a-card-grid class="bottom-left-title"> 身份证 </a-card-grid>
          <a-card-grid class="bottom-left-image" :hoverable="false">
            <q-img
              v-if="auth.id_card_front_image === auth.before.id_card_front_image || auth.apply_times === 1"
              @click="openLawyerCheck(auth.id_card_front_image, 'id_card_front_image')"
              :src="auth.id_card_front_image"
              class="bottom-left-image-half margin-right-16 clickable"
            >
              <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
            </q-img>
            <a-popover v-else title="修改前的图片" trigger="hover">
              <template slot="content">
                <img :src="auth.before.id_card_front_image" style="height: 200px; width: 200px" />
              </template>
              <q-img
                @click="openLawyerCheck(auth.id_card_front_image, 'id_card_front_image')"
                :src="auth.id_card_front_image"
                class="bottom-left-image-half margin-right-16 clickable"
                :style="redBorder"
              >
                <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
              </q-img>
            </a-popover>

            <q-img
              v-if="auth.id_card_back_image === auth.before.id_card_back_image || auth.apply_times === 1"
              @click="openLawyerCheck(auth.id_card_back_image, 'id_card_back_image')"
              :src="auth.id_card_back_image"
              class="bottom-left-image-half clickable"
            >
              <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
            </q-img>
            <a-popover title="修改前的图片" trigger="hover" v-else>
              <template slot="content">
                <img :src="auth.before.id_card_back_image" style="height: 200px; width: 200px" />
              </template>
              <q-img
                @click="openLawyerCheck(auth.id_card_back_image, 'id_card_back_image')"
                :src="auth.id_card_back_image"
                class="bottom-left-image-half clickable"
                :style="redBorder"
              >
                <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
              </q-img>
            </a-popover>
          </a-card-grid>
          <a-card-grid class="bottom-left-title"> 执业证照 </a-card-grid>
          <a-card-grid class="bottom-left-image" :hoverable="false">
            <div style="width: 100%; height: 100%" v-if="auth.apply_lawyer_grade === 5">
              <q-img
                v-if="
                  auth.student_certificate_image === auth.before.student_certificate_image || auth.apply_times === 1
                "
                @click="openLawyerCheck(auth.student_certificate_image, 'student_certificate_image')"
                :src="auth.student_certificate_image"
                class="bottom-left-image-half margin-right-16 clickable"
              >
                <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
              </q-img>
              <a-popover title="修改前的图片" trigger="hover" v-else>
                <template slot="content">
                  <img :src="auth.before.student_certificate_image" style="height: 200px; width: 200px" />
                </template>
                <q-img
                  @click="openLawyerCheck(auth.student_certificate_image, 'student_certificate_image')"
                  :src="auth.student_certificate_image"
                  class="bottom-left-image-half margin-right-16 clickable"
                  :style="redBorder"
                >
                  <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
                </q-img>
              </a-popover>
            </div>
            <div style="width: 100%; height: 100%" v-else>
              <q-img
                v-if="auth.certificate_image === auth.before.certificate_image || auth.apply_times === 1"
                @click="openLawyerCheck(auth.certificate_image, 'certificate_image')"
                :src="auth.certificate_image"
                class="bottom-left-image-half margin-right-16 clickable"
              >
                <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
              </q-img>
              <a-popover title="修改前的图片" trigger="hover" v-else>
                <template slot="content">
                  <img :src="auth.before.certificate_image" style="height: 200px; width: 200px" />
                </template>
                <q-img
                  @click="openLawyerCheck(auth.certificate_image, 'certificate_image')"
                  :src="auth.certificate_image"
                  class="bottom-left-image-half margin-right-16 clickable"
                  :style="redBorder"
                >
                  <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
                </q-img>
              </a-popover>

              <q-img
                v-if="auth.certificate_record_image === auth.before.certificate_record_image || auth.apply_times === 1"
                @click="openLawyerCheck(auth.certificate_record_image, 'certificate_record_image')"
                :src="auth.certificate_record_image"
                class="bottom-left-image-half clickable"
              >
                <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
              </q-img>
              <a-popover title="修改前的图片" trigger="hover" v-else>
                <template slot="content">
                  <img :src="auth.before.certificate_record_image" style="height: 200px; width: 200px" />
                </template>
                <q-img
                  @click="openLawyerCheck(auth.certificate_record_image, 'certificate_record_image')"
                  :src="auth.certificate_record_image"
                  class="bottom-left-image-half clickable"
                  :style="redBorder"
                >
                  <div class="absolute-bottom text-subtitle1 text-center">编辑</div>
                </q-img>
              </a-popover>
            </div>
          </a-card-grid>
          <a-card-grid class="bottom-left-title"> 律师荣誉证件 </a-card-grid>
          <a-card-grid
            class="bottom-left-image"
            :hoverable="false"
            style="overflow: auto; display: flex; flex-wrap: wrap; flex-direction: row; justify-content: center"
          >
            <div
              v-for="(index, key) in auth.honor_certificates"
              :key="key"
              style="height: 150px; width: 150px; margin: 0 5px 20px 5px; position: relative"
            >
              <a-popconfirm
                title="请确认是否删除该荣誉证书?"
                ok-text="删除"
                cancel-text="取消"
                @confirm="deleteHonorCertificates(key)"
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
                />
              </a-popconfirm>

              <img
                :src="index.image"
                style="height: 150px; width: 150px; object-fit: contain; background-color: #d8d8d8"
                v-if="
                  auth.before.honor_certificates[key]
                    ? auth.before.honor_certificates[key].image === index.image
                      ? true
                      : false
                    : false
                "
                @click="openShowImages(index.image, key)"
              />
              <a-popover title="修改前的图片" trigger="hover" v-else>
                <template slot="content">
                  <img
                    style="height: 300px; width: 300px; object-fit: contain"
                    v-if="auth.before.honor_certificates.length >= key + 1"
                    :src="auth.before.honor_certificates[key].image"
                  />
                  <span v-else>该图片为新增图片</span>
                </template>
                <img
                  :src="index.image"
                  class="bottom-left-image-small clickable"
                  style="background-color: #d8d8d8"
                  :style="auth.before.honor_certificates[key] === undefined ? greenBorder : redBorder"
                  @click="openShowImages(index.image, key)"
                />
              </a-popover>
              <span>{{ index.title }}</span>
            </div>
          </a-card-grid>
        </a-card>
        <a-card :bordered="false" style="width: 50%">
          <template #title>
            <span class="title">{{ auth.apply_times }}次律师审核</span>

            <a-button type="link" @click="state.isOpenHistory = true">历史审核记录</a-button>
          </template>

          <a-radio-group v-model="auth.type" style="margin-bottom: 20px">
            <a-radio
              :value="checkType.value"
              style="margin-right: 20px; margin-bottom: 15px"
              v-for="checkType in checkTypes"
              :key="checkType.label"
            >
              {{ checkType.label }}
            </a-radio>
          </a-radio-group>

          <a-radio-group v-model="auth.lawyer_grade">
            <a-radio
              :value="lawyerType.value"
              style="margin-right: 20px; margin-bottom: 15px"
              v-for="lawyerType in lawyerTypes"
              :key="lawyerType.label"
              :disabled="auth.type === 1"
            >
              {{ lawyerType.label }}
            </a-radio>
          </a-radio-group>

          <div class="hr"></div>
          
          <div class="auth-refuse">
            <div class="auth-refuse-top">
              <span>审核不通过原因</span>
              <a-alert class="auth-refuse-top-message" message="多项不合格，选择多选项" banner closable />
            </div>
            <a-checkbox-group class="auth-refuse-checkbox" @change="changeFailCheckBox">
              <a-row>
                <a-col :span="6" v-for="checkRefuseType in checkRefuseTypes" :key="checkRefuseType.label">
                  <a-checkbox :value="checkRefuseType.value" :disabled="auth.type === 0">
                    {{ checkRefuseType.label }}
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>

            <a-textarea
              class="auth-refuse-textarea"
              v-model="auth.fail_reason"
              :disabled="auth.type === 0"
              placeholder="如有必要，请填写该律师审核失败的原因"
              :auto-size="{ minRows: 8, maxRows: 8 }"
            />
            <div v-if="!lawyerUpdateAddrInfo" class="auth-refuse-auth-btn">
              <q-btn
                class="auth-refuse-auth-btn-first"
                type="primary"
                v-if="auth.apply_times === 1"
                @click="showConfirm"
              >
                审核律师
              </q-btn>
              <q-btn class="auth-refuse-auth-btn-more" type="primary" @click="showConfirm" v-else>
                {{ auth.apply_times }}次审核
              </q-btn>
              <q-btn color="primary" @click="goList">返回上一页</q-btn>
            </div>
          </div>
        </a-card>
      </div>
      
      <q-dialog v-model="state.isOpenCheck">
        <!-- 图片裁剪弹框 -->
        <lawyer-image-handler
          v-model="auth"
          :image="currentHandleImage"
          :lawyerUpdateAddrInfo="lawyerUpdateAddrInfo"
          @close="state.isOpenCheck = false"
          @save="saveImage"
        />
      </q-dialog>

      <q-dialog v-model="state.isOpenHistory" persistent>
        <lawyer-auth-history
          :lawyer-auth-id="String(this.$route.params.lawyerAuthId)"
          @close="state.isOpenHistory = false"
        />
      </q-dialog>
    </a-spin>
  </div>
</template>

<script>
// 律师图片裁剪
import LawyerImageHandler from '@/components/Image/LawyerImageHandler'
import { uploadImage } from '@/api/common'
import { getLawyerAuth, lawyerAuth } from '@/api/lawyer'
import { dataURLToFile } from '@/utils/util'
import LawyerAuthHistory from '@/components/LawyerAuthHistory'
import SingleDate from '@/components/Common/SingleDate'

// import { TMap } from '@/utils/qqmapUtil'
export default {
  name: 'LawyerAuthDetailPage',
  components: { SingleDate, LawyerAuthHistory, LawyerImageHandler },
  data() {
    return {
      imageType: 'id-card',
      redBorder: 'border:3px solid #FF524C',
      greenBorder: 'border:3px solid rgb(0 255 108)',
      lawyerTypes: [
        { label: '专职律师', value: 0, },
        { label: '实习律师', value: 1, },
        { label: '兼职律师', value: 2, },
        { label: '法律服务工作者', value: 3, },
        { label: '公职律师', value: 4, },
        { label: '法学生', value: 5, },
        { label: '公司律师', value: 6, },
        { label: '法援律师', value: 7, },
      ],
      checkTypes: [
        { label: '审核通过', value: 0, },
        { label: '审核不通过', value: 1, },
      ],
      checkRefuseTypes: [
        { label: '头像不合格', value: 0, },
        { label: '身份证不合格', value: 1, },
        { label: '律师证不合格', value: 2, },
        { label: '其他', value: 3, },
      ],
      state: {
        introductionVisible: false,
        isOpenCheck: false,
        // isOpenCheck: true,
        isOpenSubmit: false,
        isOpenHistory: false,
        isAuthLoading: false,
        loadingText: '正在给您加载数据...',
      },
      iconList: [
        { url: require('@/assets/user/zs_icon@2x.png'), },
      ],
      currentHandleImage: '',
      currentHandleKey: '',

      auth: {
        type: 0, // 审核通过/不通过
        nickname: '',
        real_name: '',
        mobile: '',
        login_at: '',
        avatar_image: '',
        id_card_front_image: '',
        id_card_back_image: '',
        certificate_image: '',
        certificate_record_image: '',
        avatar_image_path: '',
        id_card_front_image_path: '',
        id_card_back_image_path: '',
        certificate_image_path: '',
        certificate_record_image_path: '',
        city_district_id: null,
        city: '',
        province: '',
        province_district_id: null,
        lawyer_office: '',
        start_work_time: '',
        license_number: '',
        apply_times: 1,
        fail_reason: '',
        fail_types: [],
        issue_date: '',
        valid_date: '',
        company_name: '',
        school_id: 0,
        school_name: '',
        service_area: '',
        school_start_time: '',
        school_end_time: '',
        lawyer_grade: 0, // 后台审核选择的 律师等级
        apply_lawyer_grade: 0, // 用户申请的 律师等级
        student_certificate_image: '',
        student_certificate_image_path: '',
        internship_certificate_image_path: '',
        internship_certificate_image: '',
        introduction: '',
        honor_certificates: [
          { title: '', image: '', },
        ],
        before: {
          honor_certificates: [
            { title: '', image: '', },
          ],
          is_need_change: 0,
          lawyer_tags: '',
          school_start_time: 0,
          school_end_time: 0,
          school_name: '',
          company_name: '',
          issue_date: '',
          valid_date: '',
          introduction: '',
          service_area: '',
          apply_lawyer_grade: 0,
          avatar_image: '',
          id_card_front_image: '',
          id_card_back_image: '',
          certificate_image: '',
          certificate_record_image: '',
          student_certificate_image: '',
          internship_certificate_image: '',
        },

        lawyer_office_lng: '', // 律所经度
        lawyer_office_lat: '', // 律所纬度
        lawyer_office_address: '', // 律所地址
      },

      geocoder: null,

      lawyerUpdateAddrInfo: null, // 律师更新地址
    }
  },
  computed: {
    showImages() {
      const showImages = []
      for (let index = 0; index < this.auth.honor_certificates.length; index++) {
        showImages.push(this.auth.honor_certificates[index].image)
      }
      return showImages
    },
    topInfo() {
      const base = [
        {
          title: '律师姓名',
          value: this.auth.real_name,
          type: 'text',
          field: 'real_name',
        },
        {
          title: '手机号码',
          value: this.auth.mobile,
          type: 'text',
          field: 'mobile',
        },
        {
          title: '擅长领域',
          value: this.auth.lawyer_tags,
          type: 'text',
          field: 'lawyer_tags',
        },
        {
          title: '最近登录时间',
          value: this.auth.login_at,
          type: 'text',
          field: 'login_at',
        },
      ]
      let content = []
      // 律师等级 -1无 0专职律师 1实习律师 2兼职律师 3法律服务工作者 4公职律师 5法学生 6公司律师 7法援律师
      switch (this.auth.apply_lawyer_grade) {
        case 0:
        case 2:
          content = [
            {
              title: '申请律师类型',
              value: this.auth.lawyer_grade_chinese,
              type: 'text',
              field: 'lawyer_grade_chinese',
            },
          ]
          break
        case 1:
          content = [
            {
              title: '申请律师类型',
              value: this.auth.lawyer_grade_chinese,
              type: 'text',
              field: 'lawyer_grade_chinese',
            },
            {
              title: '服务区域',
              value: this.auth.service_area,
              type: 'text',
              field: 'service_area',
            },
            {
              title: '发证日期',
              value: this.auth.issue_date,
              type: 'text',
              field: 'issue_date',
            },
            {
              title: '有效日期',
              value: this.auth.valid_date,
              type: 'text',
              field: 'valid_date',
            },
          ]
          break

        case 3:
          content = [
            {
              title: '申请律师类型',
              value: this.auth.lawyer_grade_chinese,
              type: 'text',
              field: 'lawyer_grade_chinese',
            },
            {
              title: '服务区域',
              value: this.auth.service_area,
              type: 'text',
              field: 'service_area',
            },
            {
              title: '发证日期',
              value: this.auth.issue_date,
              type: 'text',
              field: 'issue_date',
            },
          ]
          break
        case 4:
          content = [
            {
              title: '申请律师类型',
              value: this.auth.lawyer_grade_chinese,
              type: 'text',
              field: 'lawyer_grade_chinese',
            },
          ]
          break
        case 5:
          content = [
            {
              title: '申请律师类型',
              value: this.auth.lawyer_grade_chinese,
              type: 'text',
              field: 'lawyer_grade_chinese',
            },
            {
              title: '学校',
              value: this.auth.school_name,
              type: 'text',
              field: 'school_name',
            },
            {
              title: '在读时间',
              value: `${this.auth.school_start_time}年-${this.auth.school_end_time}年`,
              type: 'text',
              field: 'school_time',
            },
          ]
          break
        case 6:
          content = [
            {
              title: '申请律师类型',
              value: this.auth.lawyer_grade_chinese,
              type: 'text',
              field: 'lawyer_grade_chinese',
            },
            {
              title: '工作单位',
              value: this.auth.company_name,
              type: 'text',
              field: 'company_name',
            },
          ]
          break
        case 7:
          content = [
            {
              title: '申请律师类型',
              value: this.auth.lawyer_grade_chinese,
              type: 'text',
              field: 'lawyer_grade_chinese',
            },
          ]
        break
      }
      return [
        base,
        content,
        // [
        //   [
        //     {
        //       title: '律师简介',
        //       value: this.auth.introduction,
        //       type: 'text',
        //       field: 'introduction',
        //     },
        //   ],
        // ],
      ]
    },
  },
  created() {
    // 律师更新地址信息
    const lawyerUpdateAddrInfo = JSON.parse(sessionStorage.getItem('lawyerUpdateAddrInfo'))
    lawyerUpdateAddrInfo && (this.lawyerUpdateAddrInfo = lawyerUpdateAddrInfo)
    console.log('传参：', lawyerUpdateAddrInfo)
    
    this.state.isAuthLoading = true
    // 获取律师申请认证信息
    getLawyerAuth(this.$route.params.lawyerAuthId)
      .then(({ data }) => {
        // console.log(data)
        for (const field in data) {
          this.auth[field] = data[field]
          // 赋值律师类型
          this.auth.lawyer_grade = this.auth.apply_lawyer_grade
          this.auth.issueDate = this.auth.issue_date
        }
        this.state.isAuthLoading = false

        // 打开律师修改地址 已读/未读 modal
        if (this.lawyerUpdateAddrInfo) this.openLawyerCheck(this.auth.avatar_image, 'avatar_image')
      })
      .finally(() => {})
  },
  destroyed() {
    sessionStorage.removeItem('lawyerUpdateAddrInfo')
  },
  methods: {
    isShowDetail() {
      return this.lawyerInfo.introduction.length > 150
    },
    goList() {
      this.$router.push({ name: 'LawyerAuth' })
    },
    openLawyerCheck(image, key) {
      this.imageType = 'id-card'
      this.state.isOpenCheck = true
      this.currentHandleImage = image
      this.currentHandleKey = key
    },
    saveImage(image) {
      if (this.imageType === 'id-card') {
        this.auth[this.currentHandleKey] = image
      } else {
        this.auth.honor_certificates[this.currentHandleKey].image = image
      }
      this.state.isOpenCheck = false
    },
    /**
     * 发送审核通过接口
     */
    check() {
      try {
        this.validAuthData()
      } catch (e) {
        this.$message.error(e.message)
        return
      }
      this.state.isAuthLoading = true
      this.uploadImages().then(() => {
        lawyerAuth({
          type: this.auth.type,
          lawyer_auth_id: this.$route.params.lawyerAuthId,
          avatar_image_path: this.auth.avatar_image_path,
          id_card_front_image_path: this.auth.id_card_front_image_path,
          id_card_back_image_path: this.auth.id_card_back_image_path,
          certificate_image_path: this.auth.certificate_image_path,
          certificate_record_image_path: this.auth.certificate_record_image_path,
          student_certificate_image_path: this.auth.student_certificate_image_path,
          internship_certificate_image_path: this.auth.internship_certificate_image_path,
          lawyer_grade: this.auth.lawyer_grade,
          start_work_time: this.auth.start_work_time,
          license_number: this.auth.license_number,
          lawyer_office: this.auth.lawyer_office,
          province_district_id: this.auth.province_district_id,
          city_district_id: this.auth.city_district_id,
          fail_types: JSON.stringify(this.auth.fail_types),
          fail_reason: this.auth.fail_reason,
          gender: Number(this.auth.gender),
          issue_date: this.auth.issueDate,
          honor_certificates: JSON.stringify(this.auth.honor_certificates),
          
          lawyer_office_lng: String(this.auth.lawyer_office_lng),
          lawyer_office_lat: String(this.auth.lawyer_office_lat),
          lawyer_office_address: String(this.auth.lawyer_office_address),
        })
          .then(() => {
            this.$message.success('审核成功')
            this.goList()
          })
          .catch((error) => {
            this.$message.error(error.message)
          })
          .finally(() => {
            this.state.isAuthLoading = false
          })
      })
    },
    uploadImages() {
      return new Promise((resolve) => {
        if (this.auth.type === 1) {
          resolve()
        }

        const fields = [
          'avatar_image',
          'id_card_front_image',
          'id_card_back_image',
          'certificate_image',
          'certificate_record_image',
        ]

        const requests = []
        fields.forEach((field) => {
          if (this.auth[field].indexOf('base64') !== -1) {
            requests.push(
              uploadImage(dataURLToFile(this.auth[field], 'temp.png')).then(({ data }) => {
                this.auth[field] = data.url
                this.auth[`${field}_path`] = data.path
              })
            )
          }
        })

        this.state.loadingText = `正在提交图片 ...`
        Promise.all(requests).then(() => {
          this.state.loadingText = `正在提交数据 ...`
          resolve()
        })
      })
    },
    /**
     * 校验审核字段数据
     */
    validAuthData() {
      if (this.auth.type === 0) {
        if (!this.auth.province_district_id) {
          throw new Error('请填写律师所在省')
        }
        if (!this.auth.city_district_id) {
          throw new Error('请填写律师所在市')
        }
        const stringValid = {
          lawyer_office: '请填写律所',
        }
        for (const field in stringValid) {
          if (this.auth[field].length === 0) {
            throw new Error(stringValid[field])
          }
        }
        const min = 1980
        const max = new Date().getFullYear()
        if (this.auth.lawyer_grade !== 3) {
          // if (([1, 5].includes(this.auth.apply_lawyer_grade) === false && this.auth.start_work_time < min) || this.auth.start_work_time > max) {
          if (([1, 5].includes(this.auth.lawyer_grade) === false && this.auth.start_work_time < min) || this.auth.start_work_time > max) {
            throw new Error(`执业年限不能小于${min}不能大于${max}`)
          }
        }
      } else {
        if (this.auth.fail_types.length === 0) {
          throw new Error('请填写审核不通过类型')
        }
      }
    },
    /**
     * 确认通过审核
     */
    showConfirm() {
      this.$confirm({
        title: '确认审核结果么?',
        content: '请检查身份证是否打码？律师相关信息是否填写？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.check()
        },
        onCancel() {},
      })
    },
    changeFailCheckBox(failType) {
      this.auth.fail_types = failType
    },
    openShowImages(image, key) {
      console.log(image)
      this.imageType = 'honor_certificates'
      this.state.isOpenCheck = true
      this.currentHandleImage = image
      this.currentHandleKey = key
    },
    deleteHonorCertificates(key) {
      this.auth.honor_certificates.splice(key, 1)
      console.log('删除了第' + (key + 1) + '张荣誉图片')
    },

    _initMap() {
      const map = new qq.maps.Map(document.getElementById("qqmapBox"),{
        center: new qq.maps.LatLng(30.246026, 120.210792),
        zoom: 13,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: false
      })

      this.geocoder = new qq.maps.Geocoder({
        complete: function(result) {
          console.log(result)
          // that.fristForm.longitude = result.detail.location.lng
          // that.fristForm.latitude = result.detail.location.lat
          map.setCenter(result.detail.location)
          var marker = new qq.maps.Marker({
            map: map,
            position: result.detail.location
          })

          console.log(marker)
          // markersArray.push(marker)
        },
        fail: function(err) {
          console.log(err)
        }
    })

      console.log(map)
    },
  },
}
</script>

<style lang="less" scoped>
.top {
  padding: 10px 16px;
  margin-bottom: 16px;

  &-title {
    font-size: 22px;
    font-weight: 800;
    color: #222222;
    margin-bottom: 22px;
  }

  &-info {
    display: flex;

    &-item {
      margin-right: 80px;
      margin-bottom: 24px;

      span {
        &:first-child {
          font-size: 17px;
          font-weight: 800;
          color: #222222;
        }

        &:last-child {
          font-size: 17px;
          font-weight: bold;
          color: #787e8d;
        }
      }
    }
  }
}

.bottom-left-title {
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.bottom-left-image {
  width: 75%;
  height: 200px;

  &-small {
    width: 100%;
    height: 100%;
    max-width: 150px;
    object-fit: contain;
  }

  &-half {
    width: calc(50% - 16px);
    height: 100%;
  }
}

.auto-show {
  display: flex;

  &-none {
    display: none;
  }
}

.title {
  margin-left: 17px;
  margin-right: 20px;
  font-size: 22px;
  font-weight: 800;
  color: #222222;
}

.content {
  display: flex;
}

.hr {
  height: 1px;
  border: 1px solid #ebecf1;
  margin: 24px 0;
}

.auth-refuse {
  &-top {
    display: flex;
    height: 50px;
    width: 100%;
    align-items: center;
    margin-bottom: 16px;

    &-message {
      width: 280px;
    }

    span {
      font-size: 18px;
      font-weight: 500;
      color: #787e8d;
      margin-right: 20px;
    }
  }

  &-checkbox {
    width: 100%;
    margin-bottom: 20px;
  }

  &-textarea {
    margin-bottom: 20px;
    background: #f7f8fa;
    color: #787e8d;
    font-size: 14px;
  }

  &-auth-btn {
    display: flex;
    justify-content: flex-end;

    &-first {
      background: #2cbf78;
      border-color: #2cbf78;
      color: #ffffff;
    }

    &-more {
      background: #ff9700;
      border-color: #ff9700;
      color: #ffffff;
    }

    button {
      margin-left: 12px;
    }
  }
}
.top-introduction {
  width: 100%;
  height: auto;
  background: #eff1f5;
  border-radius: 4px;
  overflow: hidden;
  padding: 16px 20px;
}

</style>
