<template>
  <div>
    <a-row
      style="
        margin-top: 60px;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        flex-direction: row;
      "
    >
      <a-divider style="margin: 0px" />

      <div class="center" style="flex-direction: column; overflow: auto; width: 25%">
        <b> 案件详情</b>
      </div>
      <div
        :span="18"
        style="border-left: 1px solid #00000019; min-height: 208px; padding: 5px; width: 75%"
        :hoverable="false"
      >
        <div
          class="moneyDiv"
          style="
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: center;
            align-content: center;
          "
        >
          <div style="width: 50%; display: flex; flex-direction: row; align-items: center">
            <b> 律师费：</b>
            <a-input
              style="width: 100px; margin: 5px"
              suffix="元"
              v-model="money.lawyerMoney"
              @change="allMoneyAdd(0)"
            />
          </div>
          <div style="width: 50%; display: flex; flex-direction: row; align-items: center">
            <b> 诉讼费：</b>
            <a-input
              style="width: 100px; margin: 5px"
              suffix="元"
              v-model="money.litigationMoney"
              @change="allMoneyAdd(0)"
            />
          </div>
          <div style="width: 50%; display: flex; flex-direction: row; align-items: center">
            <b> 保全费：</b>
            <a-input
              style="width: 100px; margin: 5px"
              suffix="元"
              v-model="money.propertyMoney"
              @change="allMoneyAdd(0)"
            />
          </div>
          <div style="width: 50%; display: flex; flex-direction: row; align-items: center">
            <b> 鉴定费：</b>
            <a-input
              style="width: 100px; margin: 5px"
              suffix="元"
              v-model="money.appraisalMoney"
              @change="allMoneyAdd(0)"
            />
          </div>
          <div style="width: 100%">
            <b> 总金额：</b>
            <a-input style="width: 258px; margin: 5px" suffix="元" v-model="money.caseMoney" @change="allMoneyAdd(1)" />
          </div>
        </div>
        <a-divider style="margin: 0px" />
        <div
          style="
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            justify-content: flex-start;
            flex-direction: row;
            flex-wrap: wrap;
            margin: 0 5px;
          "
        >
          <div style="width: 50%; margin: 12px 0">
            <p style="margin: 0">审理阶段：</p>
            <a-select
              v-model="orderData.trial_stage"
              placeholder="请选择审理阶段"
              style="width: 160px"
              @change="changeTrialStage"
              size="small"
            >
              <a-select-option v-for="(i, key) in trialData" :key="key + i.name" :value="i.name">
                {{ i.name }}
              </a-select-option>
            </a-select>
          </div>
          <div style="width: 50%; margin: 12px 0">
            <p style="margin: 0">案件所在城市：</p>
            <Cascader
              v-model="cityCascade"
              :options="options"
              :show-search="{ filter }"
              placeholder="搜索城市"
              @change="onChange"
              size="small"
              style="width: 170px"
            />
          </div>
          <div style="width: 50%; margin: 12px 0">
            <p style="margin: 0">案件类型：</p>
            <Cascader
              v-model="caseType"
              :options="caseTypeList"
              :show-search="{ filter }"
              placeholder="案件类型"
              @change="chooseCaseType"
              size="small"
              style="width: 160px"
            />
          </div>
          <div style="width: 50%; margin: 12px 0">
            <p style="margin: 0">标地金额:</p>
            <a-input
              suffix="元"
              v-model="orderData.caseAllMoney"
              style="width: 170px"
              size="small"
              @change="allMoneyAdd(1)"
            />
          </div>
          <div style="width: 100%; margin: 12px 0">
            <span>委托当事人:</span>
            <a-select
              placeholder="请选择委托当事人类型"
              v-model="orderData.litigant_role"
              style="width: 120px; margin: 5px"
              @change="addressChange"
              size="small"
            >
              <a-select-option v-for="(i, key) in userTypeList" :key="key + i.id" :value="i.id">
                {{ i.name }}
              </a-select-option>
            </a-select>
          </div>
          <div
            style="width: 100%; margin: 12px 0; display: flex; flex-direction: column; align-items: flex-start"
            v-for="(i, key) in litigantsList"
            :key="key + 4577"
          >
            <label>
              {{
                orderData.litigant_role === 0 || orderData.litigant_role === '原告'
                  ? '原告'
                  : orderData.litigant_role === 1 || orderData.litigant_role === '被告'
                  ? '被告'
                  : orderData.litigant_role === 2 || orderData.litigant_role === '再审申请人'
                  ? '再审申请人'
                  : orderData.litigant_role === 3 || orderData.litigant_role === '再审被申请人'
                  ? '再审被申请人'
                  : orderData.litigant_role === 4 || orderData.litigant_role === '申诉人'
                  ? '申诉人'
                  : orderData.litigant_role === 5 || orderData.litigant_role === '被申诉人'
                  ? '被申诉人'
                  : orderData.litigant_role === 6 || orderData.litigant_role === '抗诉申请人'
                  ? '抗诉申请人'
                  : orderData.litigant_role === 7 || orderData.litigant_role === '被抗诉申请人'
                  ? '被抗诉申请人'
                  : '原告'
              }}信息:
            </label>
            <div class="radioType" style="width: 100%">
              <a-select style="width: 100px" size="small" placeholder="选择类型" v-model="i.type">
                <a-select-option value="个人">个人</a-select-option>
                <a-select-option value="公司">公司</a-select-option>
                <a-select-option value="机关单位">机关单位</a-select-option>
              </a-select>
              <a-input v-model="i.nickname" style="width: 60%" size="small" @change="allMoneyAdd(1)" />
              <a v-show="dataStatus === 10" @click="dellist(key, 0)" style="color: #ff0000; float: right">删除</a>
            </div>
          </div>
          <div
            style="
              display: flex;
              width: 100%;
              margin: 12px 0px;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: space-between;
              align-items: center;
            "
            v-show="dataStatus === 10"
          >
            <a @click="addlist(0)">继续添加</a>
          </div>
          <a-divider style="margin: 0px" />
          <div
            style="width: 100%; margin: 12px 0; display: flex; flex-direction: column; align-items: flex-start"
            v-for="(i, key) in otherSide"
            :key="key + 9975"
          >
            <label>
              {{
                orderData.litigant_role === 0 || orderData.litigant_role === '原告'
                  ? '被告'
                  : orderData.litigant_role === 1 || orderData.litigant_role === '被告'
                  ? '原告'
                  : orderData.litigant_role === 2 || orderData.litigant_role === '再审申请人'
                  ? '再审被申请人'
                  : orderData.litigant_role === 3 || orderData.litigant_role === '再审被申请人'
                  ? '再审申请人'
                  : orderData.litigant_role === 4 || orderData.litigant_role === '申诉人'
                  ? '被申诉人'
                  : orderData.litigant_role === 5 || orderData.litigant_role === '被申诉人'
                  ? '申诉人'
                  : orderData.litigant_role === 6 || orderData.litigant_role === '抗诉申请人'
                  ? '被抗诉申请人'
                  : orderData.litigant_role === 7 || orderData.litigant_role === '被抗诉申请人'
                  ? '抗诉申请人'
                  : '被告'
              }}信息:
            </label>
            <div class="radioType" style="width: 100%">
              <a-select style="width: 100px" size="small" placeholder="选择类型" v-model="i.type">
                <a-select-option value="个人">个人</a-select-option>
                <a-select-option value="公司">公司</a-select-option>
                <a-select-option value="机关单位">机关单位</a-select-option>
              </a-select>
              <a-input v-model="i.nickname" style="width: 60%" size="small" @change="allMoneyAdd(1)" />
              <a v-show="dataStatus === 10" @click="dellist(key, 1)" style="color: #ff0000; float: right">删除</a>
            </div>
          </div>
          <div
            style="
              display: flex;
              width: 100%;
              margin: 12px 0px;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: space-between;
              align-items: center;
            "
            v-show="dataStatus === 10"
          >
            <a @click="addlist(1)">继续添加</a>
          </div>
        </div>
      </div>
      <a-divider style="margin: 0px" />
      <div
        v-if="userData.litigant.is_auth === 0"
        class="center"
        style="flex-direction: column; overflow: auto; width: 25%"
      >
        <b> 情况说明</b>
      </div>
      <div
        v-if="userData.litigant.is_auth === 0 && type === 0"
        style="border-left: 1px solid #00000019; min-height: 208px; padding: 10px; width: 75%"
        :hoverable="false"
      >
        <div style="word-wrap: break-word; word-break: normal">
          <p>{{ userData.not_auth_reason }}</p>
        </div>
      </div>
      <div
        v-if="userData.litigant.is_auth === 0 && type === 1"
        style="border-left: 1px solid #00000019; min-height: 208px; padding: 10px"
        :hoverable="false"
      >
        <div style="word-wrap: break-word; word-break: normal">
          <a-input type="textarea" v-model="userData.not_auth_reason" style="border: none; height: 160px" :row="5" />
        </div>
      </div>
      <a-divider style="margin: 0px" v-if="userData.litigant.is_auth === 1" />
      <div v-if="userData.litigant.is_auth === 1" class="center" style="flex-direction: column; width: 25%">
        <b>身份证</b>
      </div>
      <div
        :hoverable="false"
        v-if="userData.litigant.is_auth === 1"
        style="border-left: 1px solid #00000019; min-height: 208px; padding: 10px; width: 75%"
      >
        <div
          style="
            text-align: center;
            height: 208px;
            overflow: auto;
            padding: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
          "
        >
          <ImageViewer ref="imageViewer" :images="images" />
          <img
            style="background-color: #eff1f5; width: 160px; height: 120px; margin: 5px; cursor: pointer"
            :src="userData.id_card_front_image"
            @click="showImages(1)"
          />
          <img
            style="background-color: #eff1f5; width: 160px; height: 120px; margin: 5px; cursor: pointer"
            :src="userData.id_card_back_image"
            @click="showImages(1)"
          />
        </div>
      </div>
      <a-divider style="margin: 0px" v-if="type === 0" />
      <div v-if="userData.litigant.is_auth === 0" :span="6" class="center" style="flex-direction: column; width: 25%">
        <b> 其他照片</b>
      </div>
      <div
        v-if="userData.litigant.is_auth === 0"
        :span="18"
        class="center"
        style="border-left: 1px solid #00000019; min-height: 208px; padding: 10px; width: 75%"
        :hoverable="false"
      >
        <div
          v-if="type === 1"
          style="
            width: 100%;
            height: 140px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: start;
          "
        >
          <ImageViewer ref="imageViewer" :images="images" />
          <div v-for="(i, key) in userData.not_auth_images" :key="key + i" style="position: relative">
            <div
              v-show="key < 3"
              style="
                width: 70px;
                height: 70px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: start;
              "
            >
              <div>
                <img
                  :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                  style="
                    width: 10px;
                    height: 10px;
                    float: right;
                    position: absolute;
                    z-index: 2;
                    right: 5px;
                    top: 5px;
                    cursor: pointer;
                  "
                  @click="deleteF(key)"
                />
                <img
                  style="background-color: #eff1f5; width: 60px; height: 60px; margin: 5px; cursor: pointer"
                  :src="i"
                  @click="showImages"
                />
              </div>
            </div>
            <div
              v-show="key === 3"
              style="
                position: relative;
                width: 60px;
                height: 60px;
                float: left;
                margin: 5px;
                background: rgba(0, 0, 0, 0.3);
              "
            >
              <img class="imagesShow" :src="i" />
              <span class="imagesSpan" @click="showImages">+{{ userData.not_auth_images.length - 3 }}</span>
            </div>
          </div>

          <div
            @click="triggers"
            v-show="userData.not_auth_images.length < 9"
            style="
              cursor: pointer;
              width: 60px;
              height: 60px;
              display: flex;
              flex-direction: column;
              align-items: center;
              border-radius: 10px;
              justify-content: center;
              border: 2px dashed #0000004c;
              margin: 0 5px;
              font-size: 10px;
            "
          >
            <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 18px; height: 18px" />
            选择图片
          </div>
          <input
            type="file"
            id="imagesBtn"
            ref="imagesBtn"
            accept="image/*"
            @change="getImages($event)"
            multiple="multiple"
            style="display: none"
          />
        </div>
        <div v-if="type === 0" style="display: flex; flex-direction: row; flex-wrap: wrap; align-items: center">
          <ImageViewer ref="imageViewer" :images="images" />
          <div v-for="(i, key) in userData.not_auth_images" :key="i + 'images'">
            <div v-show="key < 3">
              <img
                style="background-color: #eff1f5; width: 60px; height: 60px; margin: 10px; cursor: pointer"
                :src="i"
                @click="showImages(0)"
              />
            </div>
            <div
              v-show="key === 3"
              style="width: 60px; position: relative; float: left; margin: 10px; background: rgba(0, 0, 0, 0.3)"
            >
              <img class="imagesShow" :src="i" />
              <span class="imagesSpan" @click="showImages">+{{ userData.not_auth_images.length - 3 }}</span>
            </div>
          </div>
        </div>
      </div>
      <a-divider style="margin: 0px" v-if="userData.litigant.is_auth === 0" />
      <a-button
        v-show="dataStatus === 10"
        @click="saveCaseDate"
        type="primary"
        style="margin: 10px; background-color: #3980ea; border-color: #3980ea"
      >
        保存
      </a-button>

      <a-button
        v-show="dataStatus === 10"
        @click="state.rejectAudit = true"
        type="danger"
        style="margin: 10px; background-color: #ff9700; border-color: #ff9700"
      >
        驳回
      </a-button>
      <a-button
        v-show="dataStatus === 10"
        @click="state.visible = true"
        type="primary"
        style="margin: 10px; background-color: #2cbf78; border-color: #2cbf78"
      >
        审核
      </a-button>
    </a-row>
    <a-modal v-model="state.visible" title="请确认是否提交审核" @ok="submitData">
      <div style="margin: 0 10px; width: 200px" :style="Extension ? 'color: #3980ea' : 'color: #787e8d'">
        <span @click="Extension = !Extension" style="cursor: pointer">
          <img
            :src="
              Extension
                ? require('@/assets/lawyer/xztrue_icon_sel@2x.png')
                : require('@/assets/lawyer/xzfalse_icon_sel@2x.png')
            "
            style="width: 14px; height: 14px"
          />

          {{ Extension ? '平台介入推广' : '平台不介入推广' }}
        </span>
      </div>
    </a-modal>
    <a-modal v-model="state.rejectAudit" title="审核不通过" @ok="rejectAuditOk" width="600px">
      <div style="height: 200px; overflow: auto">
        <a-input v-model="rejectAudit" placeholder="请输入驳回原因"></a-input>
      </div>
    </a-modal>
  </div>
</template>
  <script>
import { Cascader } from 'ant-design-vue'
import ImageViewer from '@/components/Image/ImageViewer'
import {
  getFundraisingTrialStage,
  getFundraisingQuestionTags,
  postFundraisingCheckSave,
  postFundraisingCheck,
} from '@/api/fundraising'
import { uploadImage } from '@/api/common'
import { getLawyerDistricts } from '@/api/lawyer'
export default {
  name: 'DetailstTable',
  components: { ImageViewer, Cascader },
  props: {
    detailstService: {
      type: Object,
      default: () => {
        return {}
      },
    },
    type: {
      type: Number,
      default: 1,
    },
    dataStatus: {
      type: Number,
      default: 1,
    },
    userData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    fundraisingId: {
      type: Number,
      default: 1,
    },
    fundraisingRegistrationId: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      Extension: false,
      caseType: [],
      caseTypeList: [],
      userTypeList: [],
      otherSide: [
        {
          type: '',
          nickname: '',
        },
      ],
      litigantList: [{ nickname: '' }],
      litigantsList: [
        {
          type: '',
          nickname: '',
        },
      ],
      orderData: {
        trial_stage: '',
        province_id: '',
        city_id: '',
        litigant_role: '',
        id_card: '',
        other_side_type: '',
        own_side_type: '',
        other_side_nicknames: '',
        own_side_nicknames: '',
        is_show_defendant: 0,
        caseAllMoney: '',
        caseType: [],
      },
      trialData: [],
      radioType: '公司',
      radioUserType: '公司',
      userType: 0,
      // fundraisingRegistrationId: 0,
      value: 1,
      options: [],
      cityCascade: [],
      money: {
        lawyerMoney: '',
        propertyMoney: '',
        litigationMoney: '',
        appraisalMoney: '',
        caseMoney: '',
      },
      state: {
        visible: false,
        rejectAudit: false,
      },
      rejectAudit: '',
      loading: true,
      images: [],
      is_not_auth: 0,
      case_money: 0,
    }
  },
  computed: {
    caseTypeChinese() {
      const value = this.userData.lawyer_tag_id
      let label = ''
      for (let i = 0; i < this.caseTypeList.length; i++) {
        const element = this.caseTypeList[i]
        for (let j = 0; j < this.caseTypeList[i].children.length; j++) {
          if (this.caseTypeList[i].children[j].value === value) {
            label = this.caseTypeList[i].children[j].label
          }
        }
      }
      return label
    },
  },
  watch: {
    immediate: true,
    detailstService(value) {
      this.detailstService = value
    },
    userData(value) {
      this.userData = value
      console.log(this.userData.lawyer_tag_id)
      if (this.userData.lawyer_tag_id) {
        if (this.userData.lawyer_tag_id <= 21) {
          this.caseType[0] = 0
          this.caseType[1] = this.userData.lawyer_tag_id
        } else if (this.userData.lawyer_tag_id <= 32 && this.userData.lawyer_tag_id > 21) {
          this.caseType[0] = 1
          this.caseType[1] = this.userData.lawyer_tag_id
        } else if (this.userData.lawyer_tag_id <= 47 && this.userData.lawyer_tag_id > 32) {
          this.caseType[0] = 2
          this.caseType[1] = this.userData.lawyer_tag_id
        } else if (this.userData.lawyer_tag_id <= 55 && this.userData.lawyer_tag_id > 47) {
          this.caseType[0] = 3
          this.caseType[1] = this.userData.lawyer_tag_id
        } else if (this.userData.lawyer_tag_id <= 69 && this.userData.lawyer_tag_id > 55) {
          this.caseType[0] = 4
          this.caseType[1] = this.userData.lawyer_tag_id
        } else if (this.userData.lawyer_tag_id <= 91 && this.userData.lawyer_tag_id > 69) {
          this.caseType[0] = 5
          this.caseType[1] = this.userData.lawyer_tag_id
        }
      }
      this.money.caseMoney = this.userData.case_money
      this.money.lawyerMoney = this.userData.lawyer_money
      this.money.propertyMoney = this.userData.property_money
      this.money.litigationMoney = this.userData.litigation_money
      this.money.appraisalMoney = this.userData.appraisal_money
      this.orderData.trial_stage = this.userData.trial_stage
      this.orderData.province_id = this.userData.province_id
      this.orderData.city_id = this.userData.city_id
      this.cityCascade[0] = this.userData.province_id
      this.cityCascade[1] = this.userData.city_id
      switch (this.userData.litigant_role) {
        case 0:
          this.orderData.litigant_role = '原告'
          break
        case 1:
          this.orderData.litigant_role = '被告'
          break
        case 2:
          this.orderData.litigant_role = '再审申请人'
          break
        case 3:
          this.orderData.litigant_role = '再审被申请人'
          break
        case 4:
          this.orderData.litigant_role = '申诉人'
          break
        case 5:
          this.orderData.litigant_role = '被申诉人'
          break
        case 6:
          this.orderData.litigant_role = '抗诉申请人'
          break
        case 7:
          this.orderData.litigant_role = '被抗诉申请人'
          break
        default:
          break
      }
      this.orderData.caseAllMoney = this.userData.case_all_money
      this.orderData.id_card = this.userData.id_card
      this.radioType = this.userData.other_side_type
      this.radioUserType = this.userData.own_side_type
      if (this.userData.other_side_type_nicknames.length > 0) {
        this.otherSide = this.userData.other_side_type_nicknames
      } else if (this.userData.other_side_type !== null && this.userData.other_side_type.length > 0) {
        this.otherSide = JSON.parse(this.userData.other_side_type)
      } else {
      }
      if (this.userData.own_side_type_nicknames.length > 0) {
        this.litigantsList = this.userData.own_side_type_nicknames
      } else if (this.userData.own_side_type !== null && this.userData.own_side_type.length > 0) {
        this.litigantsList = JSON.parse(this.userData.own_side_type)
      } else {
      }
    },
    fundraisingId(value) {
      this.fundraisingId = value
      this.getFundraisingTrialStage(this.fundraisingId)
    },
  },
  created() {
    // this.dataStatus = JSON.parse(sessionStorage.getItem('订单详情')).status
    console.log(this.dataStatus)
    // this.fundraisingRegistrationId = JSON.parse(sessionStorage.getItem('订单详情')).fundraising_registration_id
    console.log(this.fundraisingRegistrationId)
    if (this.userData.is_auth === 0) {
      this.is_not_auth = 1
    } else {
      this.is_not_auth = 0
    }
    this.getFundraisingTrialStage(this.fundraisingId)
    this.getDistricts()
    this.getFundraisingQuestionTags()
  },
  mounted() {},
  methods: {
    allMoneyAdd(type) {
      if (type === 0) {
        const value =
          Math.floor(
            (Number(this.money.lawyerMoney) +
              Number(this.money.propertyMoney) +
              Number(this.money.litigationMoney) +
              Number(this.money.appraisalMoney)) *
              10000
          ) / 10000
        this.money.caseMoney = value
        this.orderData.other_side_type = this.radioType
        this.orderData.own_side_type = this.radioUserType
      }
    },
    showImages(value) {
      if (value === 1) {
        const images = [this.userData.id_card_front_image, this.userData.id_card_back_image]
        this.images = images
        this.$refs.imageViewer.show()
      } else {
        const images = this.userData.not_auth_images
        this.images = images
        this.$refs.imageViewer.show()
      }
    },
    chooseIsNotAuth(value) {
      this.is_not_auth = value
    },
    getImages(event) {
      var images1 = event.target.files[0]
      uploadImage(images1).then((data) => {
        let images = {}
        images = data.data.url
        this.userData.not_auth_images.push(images)
        event.target.value = ''
        this.$message.success('上传成功')
      })
    },
    deleteF(e) {
      this.userData.not_auth_images.splice(e, 1)
    },
    triggers() {
      this.$refs.imagesBtn.dispatchEvent(new MouseEvent('click'))
    },
    getFundraisingTrialStage(fundraisingId) {
      getFundraisingTrialStage(fundraisingId).then((data) => {
        this.trialData = data.data
      })
    },
    getDistricts() {
      getLawyerDistricts().then((data) => {
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
    addressChange(e) {
      this.orderData.litigant_role = e
      this.allMoneyAdd(1)
    },
    changeTrialStage(e) {
      this.orderData.trial_stage = e
      for (let i = 0; i < this.trialData.length; i++) {
        if (this.trialData[i].name === e) {
          this.userTypeList = this.trialData[i].litigant_role
        }
      }
      this.orderData.litigant_role = ''
      this.allMoneyAdd(1)
      console.log(this.orderData.trial_stage, this.userTypeList)
    },
    onChange(value, selectedOptions) {
      this.orderData.province_id = value[0]
      this.orderData.city_id = value[1]
      console.log(this.orderData)
      this.allMoneyAdd(1)
    },
    filter(inputValue, path) {
      return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    addlist(type) {
      if (type === 0) {
        this.litigantsList.push({ nickname: '' })
      } else {
        this.otherSide.push({ nickname: '' })
      }
    },
    dellist(key, type) {
      if (type === 0) {
        this.litigantsList.splice(key, 1)
      } else {
        this.otherSide.splice(key, 1)
      }
      this.allMoneyAdd(1)
    },
    chooseCaseType(value, selectedOptions) {
      console.log(value)
      this.caseType = value
    },
    getFundraisingQuestionTags() {
      getFundraisingQuestionTags().then((data) => {
        const list = []
        for (let i = 0; i < data.data.length; i++) {
          const listchilren = { label: '', value: '', children: [] }
          listchilren.label = data.data[i].lawyer_tag_group
          listchilren.value = i
          for (let j = 0; j < data.data[i].lawyer_tags.length; j++) {
            const listchilrens = { label: '', value: '' }
            listchilrens.label = data.data[i].lawyer_tags[j].lawyer_tag
            listchilrens.value = data.data[i].lawyer_tags[j].lawyer_tag_id
            listchilren.children.push(listchilrens)
          }
          list.push(listchilren)
        }
        this.caseTypeList = list
        console.log(this.caseTypeList)
      })
    },
    changeExtension() {
      this.Extension = !this.Extension
    },
    saveCaseDate() {
      const isPromote = 0
      const caseMoney = this.money.caseMoney
      const lawyerMoney = this.money.lawyerMoney
      const propertyMoney = this.money.propertyMoney
      const litigationMoney = this.money.litigationMoney
      const appraisalMoney = this.money.appraisalMoney
      const caseAllMoney = this.orderData.caseAllMoney
      const trialStage = this.orderData.trial_stage
      const provinceId = this.orderData.province_id
      const cityId = this.orderData.city_id
      const litigantRole = this.orderData.litigant_role
      const otherSideNicknames = JSON.stringify(this.otherSide)
      const ownSideNicknames = JSON.stringify(this.litigantsList)
      const lawyerTagId = this.caseType[1]
      console.log(this.caseType[1])
      postFundraisingCheckSave(
        this.fundraisingRegistrationId,
        caseMoney,
        lawyerMoney,
        propertyMoney,
        litigationMoney,
        appraisalMoney,
        caseAllMoney,
        this.userData.content,
        this.userData.appeal,
        lawyerTagId,
        trialStage,
        provinceId,
        cityId,
        litigantRole,
        otherSideNicknames,
        ownSideNicknames,
        isPromote
      )
        .then((data) => {
          this.$message.success('已保存')
          sessionStorage.setItem('upData', true)
        })
        .finally(() => {
          this.state.adoptLoading = false
        })
    },
    rejectAuditOk() {
      const fundraisingRegistrationId = this.fundraisingRegistrationId
      const refuseReason = this.rejectAudit
      postFundraisingCheck(20, [], refuseReason, fundraisingRegistrationId, '', '')
        .then((data) => {
          this.$message.success('已驳回')
          this.$router.push({ name: 'FundraisingCheck' })
        })
        .finally(() => {
          this.state.rejectAudit = false
        })
    },
    submitData() {
      const fundraisingRegistrationId = this.fundraisingRegistrationId
      let isPromote = 1
      if (this.Extension) {
        isPromote = 1
      } else {
        isPromote = 0
      }
      const caseMoney = this.money.caseMoney
      const lawyerMoney = this.money.lawyerMoney
      const propertyMoney = this.money.propertyMoney
      const litigationMoney = this.money.litigationMoney
      const appraisalMoney = this.money.appraisalMoney
      const caseAllMoney = this.orderData.caseAllMoney
      const trialStage = this.orderData.trial_stage
      const provinceId = this.orderData.province_id
      const cityId = this.orderData.city_id
      const litigantRole = this.orderData.litigant_role
      const otherSideNicknames = JSON.stringify(this.otherSide)
      const ownSideNicknames = JSON.stringify(this.litigantsList)
      const lawyerTagId = this.caseType[1]
      postFundraisingCheck(
        10,
        [],
        '',
        fundraisingRegistrationId,
        caseMoney,
        lawyerMoney,
        propertyMoney,
        litigationMoney,
        appraisalMoney,
        caseAllMoney,
        this.userData.content,
        this.userData.appeal,
        lawyerTagId,
        trialStage,
        provinceId,
        cityId,
        litigantRole,
        otherSideNicknames,
        ownSideNicknames,
        isPromote
      )
        .then((data) => {
          this.$message.success('已审核')
          const condition = this.$route.params.condition
          this.$router.push({ name: 'FundraisingCheck', params: { condition } })
        })
        .finally(() => {
          this.state.adoptLoading = false
        })
    },
  },
}
</script>
 <style scoped lang="less">
.radioType {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 10px;
}
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: row;
  min-height: 208px;
  color: #222222;
  font-size: 16px;
}
.imagesShow {
  object-fit: contain;
  background-color: #eff1f5;
  width: 60px;
  height: 60px;
  cursor: pointer;
  top: 50%;
  text-align: center;
}

.imagesSpan {
  cursor: pointer;
  width: 60px;
  height: 60px;
  display: block;
  padding-left: 0px;
  line-height: 60px;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0.9;
  position: absolute;
  bottom: 0;
  color: #fff;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
